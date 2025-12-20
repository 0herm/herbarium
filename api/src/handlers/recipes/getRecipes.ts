import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function getRecipes(req: FastifyRequest, res: FastifyReply) {
    const { limit = 10 } = req.query as { limit?: number }
    const query = 'SELECT id, title, date_created, date_updated, category, duration, difficulty, published, favorite FROM recipes WHERE published = true ORDER BY date_created DESC LIMIT $1'
    
    try {
        const result = await run(query, [limit])
        return res.send(result.rows)
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('No recipes found')
    }
}
