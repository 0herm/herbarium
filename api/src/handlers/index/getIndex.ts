import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function getIndex(req: FastifyRequest, res: FastifyReply) {
    const routes = req.server.printRoutes({ commonPrefix: false })
    return res.send(`Herbarium API.\n\nValid endpoints are:\n\n${routes}`)
}
