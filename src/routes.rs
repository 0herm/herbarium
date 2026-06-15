use askama::Template;
use axum::{
    body::Body,
    extract::{Path, Query, Request, State},
    http::{header, HeaderValue, Response, StatusCode},
    response::{Html, IntoResponse},
};
use serde::Deserialize;
use std::path::{Path as FsPath, PathBuf};
use tower::ServiceExt;
use tower_http::services::ServeFile;
use crate::AppState;
use crate::filters;
use crate::models::{Recipe, RecipeSummary};

const PAGE_SIZE: usize = 12;
const DURATION_MAX: u32 = 255;
const MAX_IMAGE_BYTES: u64 = 16 * 1024 * 1024;

fn is_safe_segment(seg: &str) -> bool {
    use std::path::Component;
    let mut comps = FsPath::new(seg).components();
    matches!(comps.next(), Some(Component::Normal(_)))
        && comps.next().is_none()
        && !seg.contains('\0')
}

struct PageLink { page: usize, url: String, active: bool }
struct InstructionStep { num: usize, text: String }
struct InstructionSectionDisplay { title: String, steps: Vec<InstructionStep> }

fn build_qs(p: usize, q: &str, category: &str, duration: u32, favorite: bool) -> String {
    let mut ser = form_urlencoded::Serializer::new(String::new());
    if !q.is_empty()           { ser.append_pair("q", q); }
    if !category.is_empty()    { ser.append_pair("category", category); }
    if duration < DURATION_MAX { ser.append_pair("duration", &duration.to_string()); }
    if favorite                { ser.append_pair("favorite", "true"); }
    ser.append_pair("p", &p.to_string());
    format!("/recipes?{}", ser.finish())
}

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate {
    recent: Vec<RecipeSummary>,
    total_recipes: usize,
    total_categories: usize,
    first_year: u32,
}

#[derive(Template)]
#[template(path = "recipes.html")]
struct RecipesTemplate {
    recipes: Vec<RecipeSummary>,
    total_items: usize,
    total_pages: usize,
    search: String,
    filter_category: String,
    filter_duration: u32,
    filter_favorite: bool,
    prev_url: Option<String>,
    next_url: Option<String>,
    page_urls: Vec<PageLink>,
    has_more_pages: bool,
    last_page_url: String,
}

#[derive(Template)]
#[template(path = "recipe.html")]
struct RecipeTemplate {
    recipe: Recipe,
    instruction_sections: Vec<InstructionSectionDisplay>,
}

#[derive(Template)] #[template(path = "about.html")] struct AboutTemplate {}
#[derive(Template)] #[template(path = "image.html")] struct ImageTemplate {}
#[derive(Template)] #[template(path = "404.html")]   struct NotFoundTemplate {}

fn render<T: Template>(t: T) -> Response<Body> {
    match t.render() {
        Ok(html) => Html(html).into_response(),
        Err(e) => {
            tracing::error!("template render failed: {e}");
            (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error").into_response()
        }
    }
}

pub async fn home(State(state): State<AppState>) -> impl IntoResponse {
    let recipes = state.recipes.load_full();
    let mut published: Vec<_> = recipes.iter().filter(|r| r.published).collect();
    published.sort_by(|a, b| b.date_created.cmp(&a.date_created));

    render(HomeTemplate {
        total_recipes: published.len(),
        total_categories: published.iter().map(|r| &r.category).collect::<std::collections::HashSet<_>>().len(),
        first_year: published.iter().filter_map(|r| r.date_created.get(..4)?.parse().ok()).min().unwrap_or(0),
        recent: published.iter().take(6).map(|r| r.to_summary()).collect(),
    })
}

#[derive(Deserialize, Default)]
pub(crate) struct RecipesQuery {
    #[serde(default)]
    q: String,
    category: Option<String>,
    duration: Option<u32>,
    favorite: Option<String>,
    #[serde(default = "default_page")]
    p: usize,
}

fn default_page() -> usize { 1 }

pub async fn recipes_page(
    State(state): State<AppState>,
    Query(params): Query<RecipesQuery>,
) -> impl IntoResponse {
    let all = state.recipes.load_full();
    let kw = params.q.to_lowercase();
    let want_favorite = params.favorite.as_deref() == Some("true");

    let mut filtered: Vec<&Recipe> = all
        .iter()
        .filter(|r| r.published)
        .filter(|r| kw.is_empty() || r.title.to_lowercase().contains(&kw))
        .filter(|r| params.category.as_ref().map_or(true, |c| c.is_empty() || &r.category == c))
        .filter(|r| params.duration.map_or(true, |d| d >= DURATION_MAX || r.duration <= d))
        .filter(|r| !want_favorite || r.favorite)
        .collect();
    filtered.sort_by(|a, b| b.date_created.cmp(&a.date_created));

    let total_items = filtered.len();
    let total_pages = total_items.div_ceil(PAGE_SIZE).max(1);
    let page = params.p.clamp(1, total_pages);
    let search = params.q;
    let filter_category = params.category.unwrap_or_default();
    let filter_duration = params.duration.unwrap_or(DURATION_MAX);
    let qs = |p: usize| build_qs(p, &search, &filter_category, filter_duration, want_favorite);

    let start = page.saturating_sub(2).max(1);
    let end = (start + 4).min(total_pages);

    render(RecipesTemplate {
        recipes: filtered.iter().skip((page - 1) * PAGE_SIZE).take(PAGE_SIZE).map(|r| r.to_summary()).collect(),
        total_items,
        total_pages,
        filter_favorite: want_favorite,
        prev_url: (page > 1).then(|| qs(page - 1)),
        next_url: (page < total_pages).then(|| qs(page + 1)),
        has_more_pages: end < total_pages,
        last_page_url: qs(total_pages),
        page_urls: (start..=end).map(|p| PageLink { page: p, url: qs(p), active: p == page }).collect(),
        search,
        filter_category,
        filter_duration,
    })
}

pub async fn recipe_page(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Response<Body> {
    let all = state.recipes.load_full();
    match all.iter().find(|r| r.id == id && r.published) {
        Some(recipe) => {
            let recipe = recipe.clone();
            let mut num = 0usize;
            let instruction_sections = recipe.instructions.iter().map(|s| InstructionSectionDisplay {
                title: s.title.clone(),
                steps: s.steps.iter().map(|step| { num += 1; InstructionStep { num, text: step.clone() } }).collect(),
            }).collect();
            render(RecipeTemplate { recipe, instruction_sections }).into_response()
        }
        None => (StatusCode::NOT_FOUND, render(NotFoundTemplate {})).into_response(),
    }
}

pub async fn about_page() -> impl IntoResponse {
    render(AboutTemplate {})
}

pub async fn image_page() -> impl IntoResponse {
    render(ImageTemplate {})
}

pub async fn not_found() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, render(NotFoundTemplate {}))
}

fn recipe_is_published(state: &AppState, id: &str) -> bool {
    state.recipes.load().iter().any(|r| r.id == id && r.published)
}

pub async fn cover_image(
    Path(id): Path<String>,
    State(state): State<AppState>,
    req: Request,
) -> Response<Body> {
    if !recipe_is_published(&state, &id) {
        return StatusCode::NOT_FOUND.into_response();
    }
    serve_recipe_image(&state.recipes_dir, &id, "cover", req).await
}

pub async fn named_image(
    Path((id, file)): Path<(String, String)>,
    State(state): State<AppState>,
    req: Request,
) -> Response<Body> {
    if !recipe_is_published(&state, &id) {
        return StatusCode::NOT_FOUND.into_response();
    }
    let buf = PathBuf::from(&file);
    let Some(stem) = buf.file_stem().and_then(|s| s.to_str()) else {
        return StatusCode::BAD_REQUEST.into_response();
    };
    serve_recipe_image(&state.recipes_dir, &id, stem, req).await
}

async fn serve_recipe_image(recipes_dir: &FsPath, id: &str, stem: &str, req: Request) -> Response<Body> {
    if !is_safe_segment(id) || !is_safe_segment(stem) {
        return StatusCode::BAD_REQUEST.into_response();
    }

    let mut found: Option<PathBuf> = None;
    for ext in ["webp", "jpg", "jpeg", "png"] {
        let path = recipes_dir.join(id).join(format!("{stem}.{ext}"));
        match tokio::fs::symlink_metadata(&path).await {
            Ok(m) if m.len() > MAX_IMAGE_BYTES => return StatusCode::PAYLOAD_TOO_LARGE.into_response(),
            Ok(m) if m.is_file() => { found = Some(path); break; }
            _ => {}
        }
    }
    let Some(path) = found else {
        return StatusCode::NOT_FOUND.into_response();
    };

    let resp = match ServeFile::new(&path).oneshot(req).await {
        Ok(r) => r,
        Err(e) => match e {},
    };
    let mut resp = resp.map(Body::new);
    resp.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("public, max-age=86400"),
    );
    resp
}

