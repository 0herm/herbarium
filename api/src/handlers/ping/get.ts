import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function getPing(req: FastifyRequest, res: FastifyReply) {
    return res.send({ message: 'pong' })
}
