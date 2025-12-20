import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function exportData(req: FastifyRequest, res: FastifyReply) {
    const { tableName } = req.query as { tableName: string }
    const query = `SELECT * FROM ${tableName}`
    
    try {
        const result = await run(query)
        return res.send(result.rows)
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Error exporting data')
    }
}
