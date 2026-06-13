import { CooklangParser } from '@cooklang/cooklang'
import type { Ingredient, Item, Section } from '@cooklang/cooklang'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'

const parser = new CooklangParser()

function slugToTitle(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function quantityString(ing: Ingredient): string {
    if (!ing.quantity) return ''
    const v = ing.quantity.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inner = v.value as any
    let num: string
    if (v.type === 'number') {
        num = String(inner.value ?? inner)
    } else if (v.type === 'range') {
        num = `${inner.start?.value ?? inner.start}-${inner.end?.value ?? inner.end}`
    } else {
        num = String(v.value)
    }
    return ing.quantity.unit ? `${num} ${ing.quantity.unit}` : num
}

function itemsToText(items: Item[], ingredients: Ingredient[]): string {
    return items.map(item => {
        if (item.type === 'text') return item.value
        if (item.type === 'ingredient') {
            const ing = ingredients[item.index]
            return ing ? (ing.alias ?? ing.name) : ''
        }
        return ''
    }).join('').trim()
}

function buildSections(sections: Section[], ingredients: Ingredient[]): IngredientsProps[] {
    const result: IngredientsProps[] = sections.map(section => {
        const seen = new Set<number>()
        const sectionIngredients: IngredientProps[] = []

        for (const content of section.content) {
            if (content.type !== 'step') continue
            for (const item of content.value.items) {
                if (item.type !== 'ingredient' || seen.has(item.index)) continue
                seen.add(item.index)
                const ing = ingredients[item.index]
                if (ing) sectionIngredients.push({
                    ingredient: ing.alias ?? ing.name,
                    quantity: quantityString(ing)
                })
            }
        }

        return { title: section.name ?? '', ingredients: sectionIngredients }
    }).filter(s => s.ingredients.length > 0)

    return result.length ? result : [{ title: '', ingredients: [] }]
}

function buildInstructions(sections: Section[], ingredients: Ingredient[]): InstructionSectionProps[] {
    return sections
        .map(section => {
            const steps = section.content.flatMap(c => {
                if (c.type !== 'step') return []
                const hasText = c.value.items.some(item => item.type === 'text' && item.value.trim().length > 0)
                if (!hasText) return []
                const text = itemsToText(c.value.items, ingredients)
                return text ? [text] : []
            })
            return { title: section.name ?? '', steps }
        })
        .filter(s => s.steps.length > 0)
}

export function parseCookFile(content: string, slug: string): RecipeProps {
    const [recipe] = parser.parse(content)
    const get = (key: string): string => {
        const raw = recipe.rawMetadata.get(key)
        if (raw != null) return String(raw)
        const custom = recipe.custom_metadata.get(key)
        if (custom != null) return String(custom)
        return ''
    }

    const duration = (() => {
        const d = get('duration')
        if (d) return parseInt(d) || 0
        if (recipe.time == null) return 0
        return typeof recipe.time === 'number'
            ? recipe.time
            : (recipe.time.prep_time ?? 0) + (recipe.time.cook_time ?? 0)
    })()

    const quantity = get('servings') || (recipe.servings != null ? String(recipe.servings) : '')
    const difficulty = get('difficulty') || (recipe.difficulty != null ? String(recipe.difficulty) : '')

    return {
        id: slug,
        title: recipe.title ?? (get('title') || slugToTitle(slug)),
        date_created: get('date_created') || new Date().toISOString(),
        date_updated: get('date_updated') || get('date_created') || new Date().toISOString(),
        category: get('category'),
        duration,
        difficulty,
        quantity,
        ingredients: buildSections(recipe.sections, recipe.ingredients),
        instructions: buildInstructions(recipe.sections, recipe.ingredients),
        published: get('published') !== 'false',
        favorite: get('favorite') === 'true',
    }
}

export async function loadAllRecipes(dir: string): Promise<RecipeProps[]> {
    let entries: string[]
    try {
        entries = await readdir(dir)
    } catch {
        return []
    }

    const slugs = entries
        .filter(e => !e.startsWith('.') && !e.includes('.'))
        .sort()

    const recipes = await Promise.all(
        slugs.map(async (slug) => {
            try {
                const content = await readFile(join(dir, slug, 'recipe.cook'), 'utf-8')
                return parseCookFile(content, slug)
            } catch {
                return null
            }
        })
    )

    return recipes.filter((r): r is RecipeProps => r !== null)
}
