'use client'

import { recipeTypes, recipeDifficulty } from '@parent/constants'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, type Control } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Upload } from 'lucide-react'
import { Plus, Minus } from 'lucide-react'
import { submitForm } from '@/components/editPage/actions'
import { useActionState, useEffect } from 'react'
import { formSchema, FormState, formSchemaData, defaultSchemaData } from '@/lib/schema'
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { deleteRecipe } from '@/utils/api'
import { Switch } from '@/components/ui/switch'
import { editPage as text } from '@text'

const initialState: FormState = {
    success: null
}

export default function EditPage({ values, isNew, id }:{ values?: formSchemaData, isNew: boolean, id?: number }) {
    const [state, formAction, isPending] = useActionState(submitForm, initialState)
    const router = useRouter()

    const defaultValues = values ? values : defaultSchemaData

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
        mode: 'onBlur',
    })
    const { fields: sectionFields, append: appendSection, remove: removeSection, } = useFieldArray({ control: form.control, name: 'sections', })

    
    function handleSubmit(formData: FormData) {
        formData.set('sections', JSON.stringify(form.getValues('sections')))
        const image = form.getValues('image')
        if (image instanceof Blob) {
            formData.set('image', image)
        }else {
            formData.set('image', 'null')
        }
        formData.set('instructions', JSON.stringify(form.getValues('instructions')))
        return formAction(formData)
    }

    function handleDelete(id: number) {
        const result = deleteRecipe(id)
        if (typeof result === 'string') {
            toast.error(result || 'Error: Please try again later.')
        }else {
            toast.success('Recipe deleted successfully')
            router.back()
        }
    }

    useEffect(() => {
        if (state.success) {
            toast.success(`Recipe ${isNew ? 'created' : 'updated'} successfully!`)
            router.back()
        } else if (state.success === false) {
            toast.error(state.error || 'Error: Please try again later.')
        }
    }, [state])

    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background to-muted/20'>
            <Form {...form}>
                <form className='space-y-8' action={handleSubmit} onSubmit={() => form.trigger()}>
                    <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6'>

                        <Button className='w-fit text-base cursor-pointer gap-2' variant='ghost' size='sm' onClick={() => router.back()}>
                            <ArrowLeft className='h-4 w-4' />
                            {text.back}
                        </Button>

                        <div className='w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border'>
                            <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>{isNew ? text.addRecipe : text.editRecipe}</h1>
                            <div className='flex gap-4'>
                                <FormField
                                    control={form.control}
                                    name='published'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-3 bg-card rounded-lg px-4 py-2 border border-border'>
                                            <FormLabel className='text-sm font-medium'>{text.published}</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    name='published'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className='cursor-pointer data-[state=checked]:bg-primary'
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='favorite'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-3 bg-card rounded-lg px-4 py-2 border border-border'>
                                            <FormLabel className='text-sm font-medium'>Favorite</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    name='favorite'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className='cursor-pointer data-[state=checked]:bg-primary'
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{text.title}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={text.title} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-8'>
                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{text.category}</FormLabel>
                                        <Select
                                            name='category'
                                            defaultValue={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                form.clearErrors('category')
                                            }}
                                        >
                                            <FormControl className='w-full cursor-pointer'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`${text.select} ${text.category}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(recipeTypes).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='difficulty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{text.difficulty}</FormLabel>
                                        <Select
                                            name='difficulty'
                                            defaultValue={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                form.clearErrors('difficulty')
                                            }}
                                        >
                                            <FormControl className='w-full cursor-pointer'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`${text.select} ${text.difficulty}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(recipeDifficulty).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-8'>
                            <FormField
                                control={form.control}
                                name='quantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{text.quantity}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={text.quantity} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='duration'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{text.duration}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`${text.duration} (min)`} type='number' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <FormLabel>{text.ingredients}</FormLabel>
                            <div className='w-full flex flex-col justify-center items-center bg-input/30 border border-input rounded-md p-4'>
                                <Image
                                    src={form.watch('image') instanceof File ? URL.createObjectURL(form.watch('image') as Blob) : typeof form.watch('image') === 'string' ? `data:image/png;base64,${form.watch('image')}` as string : '/images/fallback.svg'}
                                    width={300}
                                    height={300}
                                    alt='Recipe image'
                                    className='object-cover rounded-md'
                                />

                                <FormField
                                    control={form.control}
                                    name='image'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel />
                                            <FormControl>
                                                <div>
                                                    <Button
                                                        type='button'
                                                        onClick={() => document.getElementById('file-input')?.click()}
                                                        className='w-full cursor-pointer'
                                                    >
                                                        <Upload />
                                                        {text.select} {text.image}
                                                    </Button>
                                                    <Input
                                                        id='file-input'
                                                        type='file'
                                                        className='hidden'
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) field.onChange(file); form.clearErrors('image')
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormLabel>{text.ingredients}</FormLabel>
                        {sectionFields.map((section, sectionIndex) => (
                            <div key={section.id} className='border p-4 rounded-md'>
                                <FormField
                                    control={form.control}
                                    name={`sections.${sectionIndex}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{text.sectionTitle}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={text.sectionTitle} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='mt-2'>
                                    <IngredientFields nestIndex={sectionIndex} control={form.control} />
                                </div>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => removeSection(sectionIndex)}
                                    className='mt-2 cursor-pointer'
                                    disabled={sectionFields.length === 1}
                                >
                                    <Minus className='h-4 w-4 mr-2' />
                                    {text.removeSection}
                                </Button>
                            </div>
                        ))}
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => appendSection({ title: '', ingredients: [{ quantity: '', ingredient: '' }] })}
                            className='cursor-pointer'
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            {text.addSection}
                        </Button>

                        <FormField
                            control={form.control}
                            name='instructions'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{text.instructions}</FormLabel>
                                    <div className='flex flex-col gap-2'>
                                        {form.watch('instructions').map((instruction, index) => (
                                            <div key={index} className='flex gap-2'>
                                                <FormControl>
                                                    <Input
                                                        placeholder={`${text.instruction} ${index + 1}`}
                                                        value={instruction}
                                                        onChange={(e) => {
                                                            const updatedInstructions = [...form.watch('instructions')]
                                                            updatedInstructions[index] = e.target.value
                                                            field.onChange(updatedInstructions)
                                                        }}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() => {
                                                        const updatedInstructions = [...form.watch('instructions')]
                                                        updatedInstructions.splice(index, 1)
                                                        field.onChange(updatedInstructions)
                                                    }}
                                                    disabled={form.watch('instructions').length === 1}
                                                >
                                                    <Minus className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={() => field.onChange([...form.watch('instructions'), ''])}
                                            className='cursor-pointer'
                                        >
                                            <Plus className='h-4 w-4 mr-2' />
                                            {text.addInstruction}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!isNew && id &&
                            <FormField
                                control={form.control}
                                name='id'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type='hidden' {...field} value={id} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        }

                        <Button type='submit' className='cursor-pointer' disabled={isPending}>{text.submit} {isPending ? '...' : ''}</Button>
                        {!isNew && id &&
                            <div className='w-full flex justify-end'>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type='button' variant='destructive' className='cursor-pointer'>
                                            {text.delete}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{text.areYouSure}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {text.deleteDescription}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{text.deleteCancel}</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(id)}>
                                                {text.deleteConfirm}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}

function IngredientFields({ nestIndex, control }: {nestIndex:number, control:Control<z.infer<typeof formSchema>>}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `sections.${nestIndex}.ingredients`,
    })

    return (
        <div>
            {fields.map((item, k) => (
                <div key={item.id} className='flex gap-2 mt-2'>
                    <FormField
                        control={control}
                        name={`sections.${nestIndex}.ingredients.${k}.quantity`}
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormControl>
                                    <Input placeholder={text.quantity} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`sections.${nestIndex}.ingredients.${k}.ingredient`}
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormControl>
                                    <Input placeholder={text.ingredient} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='button' variant='outline' size='icon' className='cursor-pointer' onClick={() => remove(k)} disabled={fields.length === 1}>
                        <Minus className='h-4 w-4' />
                    </Button>
                </div>
            ))}
            <Button type='button' variant='outline' onClick={() => append({ quantity: '', ingredient: '' })} className='mt-2 cursor-pointer'>
                <Plus className='h-4 w-4 mr-2' />
                {text.addIngredient}
            </Button>
        </div>
    )
}