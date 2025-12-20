import type { FastifyRequest, FastifyReply } from 'fastify'
import { auth } from './auth.ts'

export default async function requireAuth(req: FastifyRequest, res: FastifyReply) {
    try {
        const headers = new Headers()
        const authHeader = req.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).send({ error: 'Missing or invalid Authorization header' })
        }

        const token = authHeader.split(' ')[1]
        headers.append('cookie', `better-auth.session_token=${token}`)

        const session = await auth.api.getSession({
            headers
        })

        if (!session) {
            return res.code(401).send({ error: 'Unauthorized' })
        }
    } catch (error) {
        req.log.error(error)
        return res.code(500).send({ error: 'Internal Server Error during authentication' })
    }
}
