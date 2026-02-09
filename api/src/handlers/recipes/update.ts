import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function updateRecipe(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number }
    const recipe = req.body as Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>
    
    let imageBuffer: Buffer | null = null
    if (recipe.image && typeof recipe.image === 'string' && recipe.image !== 'null') {
        imageBuffer = Buffer.from(recipe.image, 'base64')
    } else if (recipe.image instanceof Buffer) {
        imageBuffer = recipe.image
    }

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
            favorite = $10,
            image = COALESCE($11, image)
        WHERE 
            id = $12
        RETURNING *
    `

    const params: SQLParamType[] = [
        recipe.title,
        new Date().toISOString(),
        recipe.category,
        recipe.duration,
        recipe.difficulty,
        recipe.quantity,
        JSON.stringify(recipe.ingredients),
        recipe.instructions,
        recipe.published,
        recipe.favorite,
        imageBuffer,
        id
    ]

    try {
        const result = await run(query, params)
        return res.send(result.rows[0])
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Failed to edit recipe')
    }
}
