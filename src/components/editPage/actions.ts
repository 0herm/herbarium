'use server'

import { formSchema, FormState } from '@/lib/schema'
import { addRecipe, banCachePattern, updateRecipe } from '@/utils/api'

export async function submitForm(prevState: FormState, formData: FormData): Promise<FormState> {
    const formObject = {
        title: formData.get('title'),
        category: formData.get('category'),
        quantity: formData.get('quantity'),
        difficulty: formData.get('difficulty'),
        duration: formData.get('duration'),
        published: formData.get('published') === 'on',
        favorite: formData.get('favorite') === 'on',
        image: formData.get('image') as File | string,
        sections: JSON.parse(formData.get('sections') as string) as {
            title: string
            ingredients: { quantity: string; ingredient: string }[]
        }[],
        instructions: JSON.parse(formData.get('instructions') as string),
    }

    const result = formSchema.safeParse(formObject)
    
    if (!result.success) {
        return {
            error: 'Invalid form data. Please check your inputs.',
            success: false,
        }
    }

    try {
        const queryBody = {
            title:          result.data.title,
            category:       result.data.category,
            difficulty:     result.data.difficulty,
            quantity:       result.data.quantity,
            duration:       Number(result.data.duration),
            ingredients:    result.data.sections,
            instructions:   result.data.instructions,
            published:      result.data.published,
            favorite:       result.data.favorite,
            image:          null as Buffer | null
        }

        if (result.data.image instanceof Blob) {
            const arrayBuffer = await result.data.image.arrayBuffer()
            queryBody.image = Buffer.from(new Uint8Array(arrayBuffer))
        }

        const id = Number(formData.get('id'))

        if (!id) {
            const res = await addRecipe(queryBody)
            if (typeof res === 'string') return { error: 'Failed to add recipe', success: false }
        }
        else if (id) {
            const res = await updateRecipe(id,queryBody)
            if (typeof res === 'string') return { error: 'Failed to edit recipe', success: false }
        }

        banCachePattern('/')
        banCachePattern('/?.*')
        banCachePattern('/recipes.*')
        if (id)  banCachePattern(`/recipe/${id}.*`)

        return {
            success: true
        }

    } catch (error) {
        console.error('Form submission error:', error)
        return {
            error: 'Unknown error',
            success: false
        }
    }
}
