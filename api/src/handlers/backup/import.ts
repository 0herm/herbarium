import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function importData(req: FastifyRequest, res: FastifyReply) {
    const { tableName, data } = req.body as { tableName: string, data: Array<Record<string, string | number | null>> }
    
    if (!data || data.length === 0) {
        return res.code(400).send('No data to import')
    }

    const keys = Object.keys(data[0])
    const columns = keys.join(', ')
    const values = data.map(row => `(${keys.map(key => `'${row[key]}'`).join(', ')})`).join(', ')
    const query = `INSERT INTO ${tableName} (${columns}) VALUES ${values}`

    try {
        await run(query)
        return res.send({ message: 'Data imported successfully' })
    } catch (error) {
        req.log.error(error)
        return res.code(500).send({ message: 'Error importing data' })
    }
}
