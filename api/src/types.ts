export {}

declare global {
    type SQLParamType = string | number | boolean | null | Date | string[] | Uint8Array

    type IngredientProps = {
        ingredient: string
        quantity: string
    }
      
    type IngredientsProps = {
        title: string
        ingredients: IngredientProps[]
    }
    
    type RecipeProps = {
        id: number
        title: string
        date_created: Date
        date_updated: Date
        category: string
        duration: number
        difficulty: string
        quantity: string
        ingredients: IngredientsProps[]
        instructions: string[]
        published: boolean
        favorite: boolean
        image: Uint8Array | null
    }
    
    type GetRecentAddition = {
        id: number
        title: string
        date_created: string
        category: string
    }
}
