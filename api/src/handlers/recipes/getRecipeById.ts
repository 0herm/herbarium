import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function getRecipeById(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number }
    const query = 'SELECT id, title, date_created, date_updated, category, duration, difficulty, quantity, ingredients, instructions, published, favorite FROM recipes WHERE id = $1'
    
    try {
        const result = await run(query, [id])
        if (result.rows.length === 0) {
            return res.code(404).send('Recipe not found')
        }
        return res.send(result.rows[0])
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Error fetching recipe')
    }
}
