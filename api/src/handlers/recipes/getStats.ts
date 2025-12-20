import type { FastifyRequest, FastifyReply } from 'fastify'
import run from '#db'

export default async function getStats(req: FastifyRequest, res: FastifyReply) {
    const query = `SELECT 
        (SELECT COUNT(id) FROM recipes WHERE published = true) AS total_recipes, 
        (SELECT COUNT(DISTINCT category) FROM recipes WHERE published = true) AS total_categories,
        (SELECT MIN(date_created) FROM recipes WHERE published = true) AS first_recipe_date`

    try {
        const result = await run(query)
        
        let firstYear = 0
        const minDate = result.rows[0]?.first_recipe_date
        if (minDate) {
            firstYear = new Date(minDate).getFullYear()
        }

        return res.send({ 
            totalRecipes: parseInt(result.rows[0]?.total_recipes || '0'), 
            totalCategories: parseInt(result.rows[0]?.total_categories || '0'),
            firstYear: firstYear
        })
    } catch (error) {
        req.log.error(error)
        return res.code(500).send('Error fetching stats')
    }
}
