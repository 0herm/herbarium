'use server'

import run from './db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function dbWrapper(query: string, params: any[] = []) {
    try {
        const result = await run(query, params)
        return result.rows
    // eslint-disable-next-line
    } catch (error: any) {
        console.error(JSON.stringify(error))
        return JSON.stringify(error.message) || 'Unknown error!'
    }
}

// Varnish cache
export async function banCachePattern(pattern: string) {
    await fetch('http://localhost:8080', {
        method: 'BAN',
        headers: {
            'x-invalidate-pattern': pattern
        }
    })
}

export async function exportData(tableName: string): Promise<string> {
    const query = `SELECT * FROM ${tableName}`
    const result = await dbWrapper(query)

    return typeof result === 'string' ? 'Error exporting data' : JSON.stringify(result)
}

export async function importData(tableName: string, data: Array<Record<string, string | number | null>>): Promise<string> {
    const keys = Object.keys(data[0])
    const columns = keys.join(', ')
    const values = data.map(row => `(${keys.map(key => `'${row[key]}'`).join(', ')})`).join(', ')
    const query = `INSERT INTO ${tableName} (${columns}) VALUES ${values}`

    const result = await dbWrapper(query)
    return typeof result === 'string' ? 'Error importing data' : 'Data imported successfully'
}

export async function getRecipeById(id: number): Promise<RecipeProps | string> {
    const query = 'SELECT id, title, date_created, date_updated, category, duration, difficulty, quantity, ingredients, instructions, published FROM recipes WHERE id = $1'
    const result = await dbWrapper(query, [id])
    return typeof result === 'string' ? 'Recipe not found' : result[0]
}

export async function getRecipes(limit: number = 10): Promise<RecipeProps[] | string> {
    const query = 'SELECT id, title, date_created, date_updated, category, duration, difficulty, published FROM recipes WHERE published = true ORDER BY date_created DESC LIMIT $1'
    const result = await dbWrapper(query, [limit])
    return typeof result === 'string' ? 'No recipes found' : result
}

export async function getRecentAdditions(limit: number = 4): Promise<GetRecentAddition[] | string> {
    const query = 'SELECT id, title, date_created, category FROM recipes WHERE published = true ORDER BY date_created DESC LIMIT $1'
    const result = await dbWrapper(query, [limit])
    return typeof result === 'string' ? 'No recent additions found' : result
}

export async function getStats(): Promise<{ totalRecipes: number, totalCategories: number, firstYear: number } | string> {
    const query = `SELECT 
        (SELECT COUNT(id) FROM recipes WHERE published = true) AS total_recipes, 
        (SELECT COUNT(DISTINCT category) FROM recipes WHERE published = true) AS total_categories,
        (SELECT MIN(date_created) FROM recipes WHERE published = true) AS first_recipe_date`

    const result = await dbWrapper(query)

    let firstYear = 0
    if (typeof result !== 'string') {
        const minDate = result[0]?.first_recipe_date
        if (minDate) {
            firstYear = new Date(minDate).getFullYear()
        }
    }

    return typeof result === 'string' ? 'Error fetching stats' : { 
        totalRecipes: parseInt(result[0]?.total_recipes || '0'), 
        totalCategories: parseInt(result[0]?.total_categories || '0'),
        firstYear: firstYear
    }
}

export async function searchRecipes(
    keyword: string,
    limit: number = 8,
    offset: number = 0,
    showUnpublished: boolean = false,
    filters: { category?: string; difficulty?: string; duration?: number }
): Promise<{ recipes: RecipeProps[]; totalItems: number } | string> {
    const filterKeys = Object.keys(filters).filter(key => filters[key as keyof typeof filters] !== undefined)
    const filterConditions = filterKeys.map((key, index) => {
        if (key === 'duration') {
            return ` AND ${key} <= $${index + 2}`
        }
        return ` AND ${key} = $${index + 2}`
    })
    const filtersQuery = filterConditions.join('')

    const params = [`%${keyword}%`, ...filterKeys.map(key => filters[key as keyof typeof filters]), limit, offset*limit]

    const query = `SELECT id, title, date_created, date_updated, category, duration, difficulty, published FROM recipes WHERE ${showUnpublished ? '' : 'published = true AND'} title LIKE $1${filtersQuery} ORDER BY date_created DESC LIMIT $${params.length - 1} OFFSET $${params.length}`
    const countQuery = `SELECT COUNT(id) FROM recipes WHERE ${showUnpublished ? '' : 'published = true AND'} title LIKE $1${filtersQuery}`

    const [result, countResult] = await Promise.all([
        dbWrapper(query, params),
        dbWrapper(countQuery, [`%${keyword}%`, ...filterKeys.map(key => filters[key as keyof typeof filters])])
    ])

    if (typeof result === 'string' || typeof countResult === 'string') {
        return 'No matching recipes found'
    }

    const totalItems = parseInt(countResult[0]?.count || '0')
    return { recipes: result, totalItems: totalItems }
}

export async function addRecipe(recipe: Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>): Promise<RecipeProps | string> {
    const query = `INSERT INTO recipes (title, date_created, date_updated, category, duration, difficulty, quantity, ingredients, instructions, published, image) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`

    const date = new Date().toISOString()

    const params = [
        recipe.title,
        date,
        date,
        recipe.category,
        recipe.duration,
        recipe.difficulty,
        recipe.quantity,
        JSON.stringify(recipe.ingredients),
        recipe.instructions,
        recipe.published,
        recipe.image
    ]
    const result = await dbWrapper(query, params)
    return typeof result === 'string' ? 'Failed to add recipe' : result[0]
}

export async function updateRecipe(id: number, recipe: Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>): Promise<RecipeProps | string> {
    const query = `
        UPDATE recipes 
        SET 
            title = $1, 
            date_updated = CASE 
                WHEN title IS DISTINCT FROM $1 OR
                     category IS DISTINCT FROM $3 OR
                     duration IS DISTINCT FROM $4 OR
                     difficulty IS DISTINCT FROM $5 OR
                     quantity IS DISTINCT FROM $6 OR
                     ingredients IS DISTINCT FROM $7 OR
                     instructions IS DISTINCT FROM $8
                THEN $2
                ELSE date_updated
            END, 
            category = $3, 
            duration = $4, 
            difficulty = $5, 
            quantity = $6, 
            ingredients = $7, 
            instructions = $8, 
            published = $9,
            image = COALESCE($10, image)
        WHERE 
            id = $11
        RETURNING *
    `

    const params = [
        recipe.title,
        new Date().toISOString(),
        recipe.category,
        recipe.duration,
        recipe.difficulty,
        recipe.quantity,
        JSON.stringify(recipe.ingredients),
        recipe.instructions,
        recipe.published,
        recipe.image,
        id
    ]

    const result = await dbWrapper(query, params)

    return typeof result === 'string' ? 'Failed to edit recipe' : result[0]

}

export async function deleteRecipe(id: number) {
    const query = 'DELETE FROM recipes WHERE id = $1 RETURNING *'
    const result = await  dbWrapper(query, [id])
    return typeof result === 'string' ? 'Failed to delete recipe' : result[0]
}
