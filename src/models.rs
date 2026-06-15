#[derive(Clone, Debug)]
pub struct IngredientProps {
    pub ingredient: String,
    pub quantity: String,
}

#[derive(Clone, Debug)]
pub struct IngredientsSection {
    pub title: String,
    pub ingredients: Vec<IngredientProps>,
}

#[derive(Clone, Debug)]
pub struct InstructionSection {
    pub title: String,
    pub steps: Vec<String>,
}

#[derive(Clone, Debug, Default)]
pub struct Recipe {
    pub id: String,
    pub title: String,
    pub date_created: String,
    pub date_updated: String,
    pub category: String,
    pub duration: u32,
    pub difficulty: String,
    pub quantity: String,
    pub ingredients: Vec<IngredientsSection>,
    pub instructions: Vec<InstructionSection>,
    pub published: bool,
    pub favorite: bool,
}

#[derive(Clone, Debug)]
pub struct RecipeSummary {
    pub id: String,
    pub title: String,
    pub date_created: String,
    pub category: String,
    pub duration: u32,
    pub quantity: String,
    pub published: bool,
    pub favorite: bool,
}

impl Recipe {
    pub fn to_summary(&self) -> RecipeSummary {
        RecipeSummary {
            id: self.id.clone(),
            title: self.title.clone(),
            date_created: self.date_created.clone(),
            category: self.category.clone(),
            duration: self.duration,
            quantity: self.quantity.clone(),
            published: self.published,
            favorite: self.favorite,
        }
    }
}
