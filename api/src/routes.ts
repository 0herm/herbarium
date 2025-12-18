import type { FastifyInstance } from 'fastify'

import getIndex from './handlers/index/getIndex.ts'

import getPing from './handlers/ping/get.ts'

export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // ping
    fastify.get('/ping', getPing)
}
