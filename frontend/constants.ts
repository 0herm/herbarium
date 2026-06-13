import { types as text } from '@text'

export const recipeTypes: Record<string, string> = {
    dinner: text.categories.dinner,
    baking: text.categories.baking,
    drink: text.categories.drink,
    dessert: text.categories.dessert
}

export const recipeCategories: {name_en:string, name:string, icon:string}[] = [
    { name_en: 'dinner', name: recipeTypes.dinner, icon: '🍛' },
    { name_en: 'baking', name: recipeTypes.baking, icon: '🍞' },
    { name_en: 'drink', name: recipeTypes.drink, icon: '🥤' },
    { name_en: 'dessert', name: recipeTypes.dessert, icon: '🍪' }
]

export const recipeDifficulty: Record<string, string> = {
    'easy'   : text.difficulty.easy,
    'medium' : text.difficulty.medium,
    'hard'   : text.difficulty.hard
}

const config = {}

export default config
