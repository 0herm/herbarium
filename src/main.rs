mod filters;
mod models;
mod parser;
mod routes;

use axum::{
    http::{header, HeaderValue},
    routing::get,
    Router,
};
use arc_swap::ArcSwap;
use std::path::PathBuf;
use std::sync::Arc;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::set_header::SetResponseHeaderLayer;

#[derive(Clone)]
pub struct AppState {
    pub recipes_dir: PathBuf,
    pub recipes: Arc<ArcSwap<Vec<models::Recipe>>>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "herbarium=info,tower_http=info".into()),
        )
        .init();

    let recipes_dir = PathBuf::from(
        std::env::var("RECIPES_DIR").unwrap_or_else(|_| "/herbarium-recipes".to_string()),
    );
    let static_dir = std::env::var("STATIC_DIR").unwrap_or_else(|_| "static".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());

    let refresh_secs: u64 = std::env::var("RECIPES_PULL_INTERVAL")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(86400)
        .max(1);

    let initial = parser::load_all_recipes(&recipes_dir).await;
    let recipe_cache = Arc::new(ArcSwap::from_pointee(initial));

    let bg_cache = recipe_cache.clone();
    let bg_dir = recipes_dir.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(std::time::Duration::from_secs(refresh_secs));
        interval.tick().await;
        loop {
            interval.tick().await;
            let fresh = parser::load_all_recipes(&bg_dir).await;
            if !fresh.is_empty() {
                bg_cache.store(Arc::new(fresh));
            } else {
                tracing::warn!("Recipe refresh returned empty; retaining existing cache");
            }
        }
    });

    let state = AppState {
        recipes_dir,
        recipes: recipe_cache,
    };

    let app = Router::new()
        .route("/", get(routes::home))
        .route("/recipes", get(routes::recipes_page))
        .route("/recipe/:id", get(routes::recipe_page))
        .route("/about", get(routes::about_page))
        .route("/image", get(routes::image_page))
        .route("/api/image/:id", get(routes::cover_image))
        .route("/api/image/:id/*file", get(routes::named_image))
        .route_service("/style.css", ServeFile::new(format!("{}/style.css", &static_dir)))
        .nest_service("/fonts", ServeDir::new(format!("{}/fonts", &static_dir)))
        .nest_service("/images", ServeDir::new(format!("{}/images", &static_dir)))
        .route_service("/robots.txt", ServeFile::new(format!("{}/robots.txt", &static_dir)))
        .fallback(routes::not_found)
        .layer(SetResponseHeaderLayer::overriding(
            header::CONTENT_SECURITY_POLICY,
            HeaderValue::from_static(
                "default-src 'self'; img-src 'self' data:; \
                 style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; \
                 object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
            ),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::X_FRAME_OPTIONS,
            HeaderValue::from_static("DENY"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            header::REFERRER_POLICY,
            HeaderValue::from_static("strict-origin-when-cross-origin"),
        ))
        .with_state(state);

    let addr = format!("0.0.0.0:{}", port);
    tracing::info!("Listening on http://{}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await
        .unwrap_or_else(|e| panic!("Failed to bind to {addr}: {e}"));
    axum::serve(listener, app).await
        .expect("server error");
}
