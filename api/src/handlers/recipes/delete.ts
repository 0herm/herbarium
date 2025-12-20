import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function deleteRecipe(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number }
    const query = 'DELETE FROM recipes WHERE id = $1 RETURNING *'
    
    try {
        const result = await run(query, [id])
        return res.send(result.rows[0])
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Failed to delete recipe')
    }
}
