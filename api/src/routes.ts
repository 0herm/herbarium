import type { FastifyInstance } from 'fastify'

import requireAuth from './utils/authMiddleware.ts'

import getIndex from './handlers/index/getIndex.ts'
import getPing from './handlers/ping/get.ts'

import getRecipes from './handlers/recipes/getRecipes.ts'
import getRecipeById from './handlers/recipes/getRecipeById.ts'
import getRecent from './handlers/recipes/getRecent.ts'
import getStats from './handlers/recipes/getStats.ts'
import searchRecipes from './handlers/recipes/search.ts'
import addRecipe from './handlers/recipes/add.ts'
import updateRecipe from './handlers/recipes/update.ts'
import deleteRecipe from './handlers/recipes/delete.ts'

import getImage from './handlers/image/getImage.ts'

import exportData from './handlers/backup/export.ts'
import importData from './handlers/backup/import.ts'

export default async function apiRoutes(fastify: FastifyInstance) {
    // index
    fastify.get('/', getIndex)

    // ping
    fastify.get('/ping', getPing)

    // recipes
    fastify.get('/recipes', getRecipes)
    fastify.get('/recipes/recent', getRecent)
    fastify.get('/recipes/stats', getStats)
    fastify.get('/recipes/search', searchRecipes)
    fastify.get('/recipes/:id', getRecipeById)
    fastify.post('/recipes', {preHandler: requireAuth}, addRecipe)
    fastify.put('/recipes/:id', {preHandler: requireAuth}, updateRecipe)
    fastify.delete('/recipes/:id', {preHandler: requireAuth}, deleteRecipe)

    // image
    fastify.get('/image/:id', getImage)

    // backup
    fastify.get('/backup/export', {preHandler: requireAuth}, exportData)
    fastify.post('/backup/import', {preHandler: requireAuth}, importData)
}
