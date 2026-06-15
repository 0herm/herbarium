use cooklang::{CooklangParser, Content, Item};
use crate::models::*;
use std::path::Path;

fn slug_to_title(slug: &str) -> String {
    slug.split('-').map(|w| {
        let mut c = w.chars();
        c.next().map(|f| f.to_uppercase().collect::<String>() + c.as_str()).unwrap_or_default()
    }).collect::<Vec<_>>().join(" ")
}

fn chrono_now() -> String {
    chrono::Local::now().format("%Y-%m-%d").to_string()
}

pub fn parse_cook_file(content: &str, slug: &str) -> Recipe {
    let parser = CooklangParser::default();
    let result = parser.parse(content);

    let r = match result.output() {
        Some(r) => r,
        None => {
            tracing::warn!("failed to parse recipe '{slug}'; using stub");
            return Recipe {
                id: slug.to_string(),
                title: slug_to_title(slug),
                date_created: chrono_now(),
                date_updated: chrono_now(),
                ..Default::default()
            };
        }
    };

    let meta = &r.metadata;

    let get_str = |key: &str| -> String {
        meta.get(key)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string()
    };

    let get_num_str = |key: &str| -> String {
        meta.get(key)
            .and_then(|v| {
                v.as_str()
                    .map(|s| s.to_string())
                    .or_else(|| v.as_u64().map(|n| n.to_string()))
                    .or_else(|| v.as_f64().map(|n| n.to_string()))
            })
            .unwrap_or_default()
    };

    let get_bool = |key: &str, default: bool| -> bool {
        match meta.get(key) {
            Some(v) => v
                .as_bool()
                .or_else(|| v.as_str().map(|s| s.eq_ignore_ascii_case("true")))
                .unwrap_or(default),
            None => default,
        }
    };

    let title = {
        let t = get_str("title");
        if t.is_empty() { slug_to_title(slug) } else { t }
    };
    let category = get_str("category");
    let duration: u32 = get_num_str("duration").parse().unwrap_or(0);
    let difficulty = get_str("difficulty");
    let quantity = get_num_str("servings");
    let date_created = {
        let d = get_str("date_created");
        if d.is_empty() { chrono_now() } else { d }
    };
    let date_updated = {
        let d = get_str("date_updated");
        if d.is_empty() { date_created.clone() } else { d }
    };
    let published = get_bool("published", true);
    let favorite = get_bool("favorite", false);

    let mut ingredients: Vec<IngredientsSection> = Vec::new();
    let mut instructions: Vec<InstructionSection> = Vec::new();

    for section in &r.sections {
        let sec_title = section.name.clone().unwrap_or_default();
        let mut steps: Vec<String> = Vec::new();
        let mut seen_ing: std::collections::HashSet<usize> = Default::default();
        let mut sec_ings: Vec<IngredientProps> = Vec::new();

        for content in &section.content {
            match content {
                Content::Step(step) => {
                    let mut text = String::new();
                    for item in &step.items {
                        match item {
                            Item::Text { value } => text.push_str(value),
                            Item::Ingredient { index } => {
                                let ing = &r.ingredients[*index];
                                text.push_str(&ing.display_name());
                                if seen_ing.insert(*index) {
                                    let qty = ing.quantity.as_ref()
                                        .map(|q| q.to_string())
                                        .unwrap_or_default();
                                    sec_ings.push(IngredientProps {
                                        quantity: qty,
                                        ingredient: ing.display_name().into_owned(),
                                    });
                                }
                            }
                            Item::Cookware { index } => {
                                text.push_str(&r.cookware[*index].name);
                            }
                            Item::Timer { index } => {
                                let timer = &r.timers[*index];
                                if let Some(qty) = &timer.quantity {
                                    text.push_str(&qty.to_string());
                                } else if let Some(name) = &timer.name {
                                    text.push_str(name);
                                }
                            }
                            Item::InlineQuantity { index } => {
                                text.push_str(&r.inline_quantities[*index].to_string());
                            }
                        }
                    }
                    let t = text.trim().to_string();
                    if !t.is_empty() {
                        steps.push(t);
                    }
                }
                Content::Text(t) => {
                    let t = t.trim().to_string();
                    if !t.is_empty() {
                        steps.push(t);
                    }
                }
            }
        }

        if !sec_ings.is_empty() {
            ingredients.push(IngredientsSection {
                title: sec_title.clone(),
                ingredients: sec_ings,
            });
        }
        if !steps.is_empty() {
            instructions.push(InstructionSection {
                title: sec_title,
                steps,
            });
        }
    }

    Recipe {
        id: slug.to_string(),
        title,
        date_created,
        date_updated,
        category,
        duration,
        difficulty,
        quantity,
        ingredients,
        instructions,
        published,
        favorite,
    }
}

pub async fn load_all_recipes(dir: &Path) -> Vec<Recipe> {
    let mut read_dir = match tokio::fs::read_dir(dir).await {
        Ok(d) => d,
        Err(e) => {
            tracing::error!("failed to read recipes dir {}: {e}", dir.display());
            return Vec::new();
        }
    };

    let mut slugs: Vec<String> = Vec::new();
    while let Ok(Some(entry)) = read_dir.next_entry().await {
        let name = entry.file_name().to_string_lossy().into_owned();
        if !name.starts_with('.') && entry.file_type().await.map(|t| t.is_dir()).unwrap_or(false) {
            slugs.push(name);
        }
    }
    slugs.sort();

    let mut recipes = Vec::new();
    for slug in slugs {
        let recipe_path = dir.join(&slug).join("recipe.cook");
        match tokio::fs::read_to_string(&recipe_path).await {
            Ok(content) => recipes.push(parse_cook_file(&content, &slug)),
            Err(e) => tracing::warn!("skipping '{slug}': cannot read {}: {e}", recipe_path.display()),
        }
    }
    recipes
}
