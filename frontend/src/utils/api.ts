'use server'

import { loadAllRecipes } from './cookParser'

const RECIPES_DIR = process.env.RECIPES_DIR || '/herbarium-recipes'

export async function getRecipeById(id: string): Promise<RecipeProps | string> {
    try {
        const all = await loadAllRecipes(RECIPES_DIR)
        const recipe = all.find(r => r.id === id)
        return recipe ?? 'Recipe not found'
    } catch {
        return 'Recipe not found'
    }
}

export async function getRecipes(limit: number = 10): Promise<RecipeProps[] | string> {
    try {
        const all = await loadAllRecipes(RECIPES_DIR)
        return all
            .filter(r => r.published)
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
            .slice(0, limit)
            .map(({ id, title, date_created, date_updated, category, duration, difficulty, published, favorite }) =>
                ({ id, title, date_created, date_updated, category, duration, difficulty, published, favorite, quantity: '', ingredients: [], instructions: [] }))
    } catch {
        return 'No recipes found'
    }
}

export async function getRecentAdditions(limit: number = 4): Promise<GetRecentAddition[] | string> {
    try {
        const all = await loadAllRecipes(RECIPES_DIR)
        return all
            .filter(r => r.published)
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
            .slice(0, limit)
            .map(({ id, title, date_created, category, duration, quantity }) =>
                ({ id, title, date_created, category, duration, quantity }))
    } catch {
        return 'No recent additions found'
    }
}

export async function getStats(): Promise<{ totalRecipes: number, totalCategories: number, firstYear: number } | string> {
    try {
        const all = await loadAllRecipes(RECIPES_DIR)
        const published = all.filter(r => r.published)
        const totalRecipes = published.length
        const totalCategories = new Set(published.map(r => r.category).filter(Boolean)).size
        const dates = published.map(r => new Date(r.date_created).getTime()).filter(n => !isNaN(n))
        const firstYear = dates.length ? new Date(Math.min(...dates)).getFullYear() : 0
        return { totalRecipes, totalCategories, firstYear }
    } catch {
        return 'Error fetching stats'
    }
}

export async function searchRecipes(
    keyword: string,
    limit: number = 8,
    offset: number = 0,
    filters: { category?: string; difficulty?: string; duration?: number; favorite?: boolean }
): Promise<{ recipes: RecipeProps[]; totalItems: number } | string> {
    try {
        const all = await loadAllRecipes(RECIPES_DIR)
        const kw = keyword.toLowerCase()

        const filtered = all
            .filter(r => r.published)
            .filter(r => !kw || r.title.toLowerCase().includes(kw))
            .filter(r => !filters.category || r.category === filters.category)
            .filter(r => !filters.difficulty || r.difficulty === filters.difficulty)
            .filter(r => filters.duration === undefined || r.duration <= filters.duration)
            .filter(r => filters.favorite === undefined || r.favorite === filters.favorite)
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())

        const totalItems = filtered.length
        const recipes = filtered
            .slice(offset * limit, offset * limit + limit)
            .map(({ id, title, date_created, date_updated, category, duration, difficulty, published, favorite }) =>
                ({ id, title, date_created, date_updated, category, duration, difficulty, published, favorite, quantity: '', ingredients: [], instructions: [] }))

        return { recipes, totalItems }
    } catch {
        return 'No matching recipes found'
    }
}
