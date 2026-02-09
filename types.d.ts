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
    id: number
    title: string
    date_created: Date | string
    date_updated: Date | string
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

type RecipeCreate = Omit<RecipeProps, 'id' | 'date_created' | 'date_updated' | 'image'> & {
    image: string | null
}

type GetRecentAddition = {
    id: number
    title: string
    date_created: string
    category: string
}

type FormStateImport = {
    error?: string
    success?: boolean | null
}