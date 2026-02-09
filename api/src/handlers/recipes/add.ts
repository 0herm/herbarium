import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function addRecipe(req: FastifyRequest, res: FastifyReply) {
    const recipe = req.body as Omit<RecipeProps, 'date_created' | 'date_updated' | 'id'>
    let imageBuffer: Buffer | null = null
    if (recipe.image && typeof recipe.image === 'string' && recipe.image !== 'null') {
        imageBuffer = Buffer.from(recipe.image, 'base64')
    } else if (recipe.image instanceof Buffer) {
        imageBuffer = recipe.image
    }

    const query = `INSERT INTO recipes (title, date_created, date_updated, category, duration, difficulty, quantity, ingredients, instructions, published, favorite, image) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`

    const date = new Date().toISOString()

    const params: SQLParamType[] = [
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
        recipe.favorite,
        imageBuffer
    ]
    
    try {
        const result = await run(query, params)
        return res.send(result.rows[0])
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Failed to add recipe')
    }
}
