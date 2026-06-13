type Theme = 'dark' | 'light'

type IngredientProps = {
    ingredient: string
    quantity: string
}

type IngredientsProps = {
    title: string
    ingredients: IngredientProps[]
}

type RecipeProps = {
    id: string
    title: string
    date_created: string
    date_updated: string
    category: string
    duration: number
    difficulty: string
    quantity: string
    ingredients: IngredientsProps[]
    instructions: string[]
    published: boolean
    favorite: boolean
}

type GetRecentAddition = {
    id: string
    title: string
    date_created: string
    category: string
    duration: number
    quantity: string
}
