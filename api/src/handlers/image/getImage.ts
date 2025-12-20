import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function getImage(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number }
    const query = 'SELECT image FROM recipes WHERE id = $1'
    
    try {
        const result = await run(query, [id])
        if (result.rows.length === 0 || !result.rows[0].image) {
            return res.code(404).send('Image not found')
        }
        const imageBuffer = result.rows[0].image
        res.header('Content-Type', 'image/webp')
        return res.send(imageBuffer)
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Internal server error')
    }
}
