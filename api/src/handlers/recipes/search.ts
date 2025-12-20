import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function searchRecipes(req: FastifyRequest, res: FastifyReply) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryParams = req.query as any
    
    const keyword = queryParams.keyword || ''
    const limit = Number(queryParams.limit) || 8
    const offset = Number(queryParams.offset) || 0
    const showUnpublished = String(queryParams.showUnpublished) === 'true'

    const conditions: string[] = []
    const params: SQLParamType[] = []

    params.push(`%${keyword}%`)
    conditions.push(`title LIKE $${params.length}`)

    if (!showUnpublished) {
        conditions.push('published = true')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterMap: Record<string, (val: any) => { cond: string, param: any }> = {
        category: (val) => ({ cond: 'category =', param: val }),
        difficulty: (val) => ({ cond: 'difficulty =', param: val }),
        duration: (val) => ({ cond: 'duration <=', param: Number(val) }),
        favorite: (val) => ({ cond: 'favorite =', param: String(val) === 'true' })
    }

    for (const [key, builder] of Object.entries(filterMap)) {
        if (queryParams[key] !== undefined && queryParams[key] !== '') {
            const { cond, param } = builder(queryParams[key])
            params.push(param)
            conditions.push(`${cond} $${params.length}`)
        }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    
    const query = `
        SELECT id, title, date_created, date_updated, category, duration, difficulty, published, favorite 
        FROM recipes 
        ${whereClause} 
        ORDER BY date_created DESC 
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
    
    const countQuery = `SELECT COUNT(id) FROM recipes ${whereClause}`

    try {
        const [result, countResult] = await Promise.all([
            run(query, [...params, limit, offset * limit]),
            run(countQuery, params)
        ])

        const totalItems = parseInt(countResult.rows[0]?.count || '0')
        return res.send({ recipes: result.rows, totalItems: totalItems })
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('No matching recipes found')
    }
}
