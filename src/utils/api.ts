'use server'

import { getWrapper, postWrapper, putWrapper, deleteWrapper } from './apiWrapper'

// Varnish cache
export async function banCachePattern(pattern: string) {
    await fetch('http://localhost:3030', {
        method: 'BAN',
        headers: {
            'x-invalidate-pattern': pattern
        }
    })
}

export async function exportData(tableName: string): Promise<string> {
    const result = await getWrapper({
        path: `/backup/export?tableName=${tableName}`
    })
    return Array.isArray(result) ? JSON.stringify(result) : 'Error exporting data'
}

export async function importData(tableName: string, data: Array<Record<string, string | number | null>>): Promise<string> {
    const result = await postWrapper({
        path: '/backup/import',
        data: { tableName, data }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Error importing data'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any).message || 'Data imported successfully'
}

export async function getRecipeById(id: number): Promise<RecipeProps | string> {
    const result = await getWrapper({
        path: `/recipes/${id}`
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Recipe not found'
    return result as RecipeProps
}

export async function getRecipes(limit: number = 10): Promise<RecipeProps[] | string> {
    const result = await getWrapper({
        path: `/recipes?limit=${limit}`
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'No recipes found'
    return result as RecipeProps[]
}

export async function getRecentAdditions(limit: number = 4): Promise<GetRecentAddition[] | string> {
    const result = await getWrapper({
        path: `/recipes/recent?limit=${limit}`
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'No recent additions found'
    return result as GetRecentAddition[]
}

export async function getStats(): Promise<{ totalRecipes: number, totalCategories: number, firstYear: number } | string> {
    const result = await getWrapper({
        path: '/recipes/stats'
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Error fetching stats'
    return result as { totalRecipes: number, totalCategories: number, firstYear: number }
}

export async function searchRecipes(
    keyword: string,
    limit: number = 8,
    offset: number = 0,
    showUnpublished: boolean = false,
    filters: { category?: string; difficulty?: string; duration?: number; favorite?: boolean }
): Promise<{ recipes: RecipeProps[]; totalItems: number } | string> {
    const params = new URLSearchParams()
    params.append('keyword', keyword)
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    params.append('showUnpublished', showUnpublished.toString())
    
    if (filters.category) params.append('category', filters.category)
    if (filters.difficulty) params.append('difficulty', filters.difficulty)
    if (filters.duration) params.append('duration', filters.duration.toString())
    if (filters.favorite !== undefined) params.append('favorite', filters.favorite.toString())

    const result = await getWrapper({
        path: `/recipes/search?${params.toString()}`
    })
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'No matching recipes found'
    return result as { recipes: RecipeProps[]; totalItems: number }
}

export async function addRecipe(recipe: Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>): Promise<RecipeProps | string> {
    const result = await postWrapper({
        path: '/recipes',
        data: recipe
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Failed to add recipe'
    return result as RecipeProps
}

export async function updateRecipe(id: number, recipe: Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>): Promise<RecipeProps | string> {
    const result = await putWrapper({
        path: `/recipes/${id}`,
        data: recipe
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Failed to edit recipe'
    return result as RecipeProps
}

export async function deleteRecipe(id: number) {
    const result = await deleteWrapper({
        path: `/recipes/${id}`
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any).error) return 'Failed to delete recipe'
    return result
}
