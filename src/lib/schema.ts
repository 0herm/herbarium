import { z } from 'zod'
import { editPage as text } from '@text'

export const formSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, { message: text.required }),
    category: z.string().min(1, { message: text.required }),
    difficulty: z.string().min(1, { message: text.required }),
    quantity: z.string().min(1, { message: text.required }),
    duration: z.string().min(1, { message: text.required }),
    published: z.boolean(),
    favorite: z.boolean(),
    image: (z.instanceof(File).or(z.null())).or(z.string()),
    sections: z.array(
        z.object({
            title: z.string(),
            ingredients: z.array(
                z.object({
                    quantity: z.string(),
                    ingredient: z.string(),
                }),
            ),
        }),
    ),
    instructions: z.array(z.string())
})

export type formSchemaData = z.infer<typeof formSchema>

export type FormState = {
    error?: string
    success?: boolean | null
}

export const defaultSchemaData = {
    title:          '',
    category:       '', 
    difficulty:     '',
    quantity:       '',
    duration:       '',
    published:      true,
    favorite:       false,
    image:          null,
    sections:       [{ title: '', ingredients: [{ quantity: '', ingredient: '' }] }],
    instructions:   [''],
}