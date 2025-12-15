'use server'

import EditPage from '@/components/editPage/editPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { getRecipeById, searchRecipes } from '@/utils/api'
import { Search, ChevronRight, Edit, FileText } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { managementPanel as text } from '@text'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@utils/auth'

export default async function Page({ params, searchParams }: { params: Promise<{ id?: string[] }>, searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect('/login')
    }

    const { id } = await params
    const recipeId = id?.[0] ? id[0] : undefined

    if(recipeId){
        const recipe = await getRecipeById(Number(recipeId))
        if(typeof recipe !== 'string'){
            const values = {
                title:          recipe.title,
                category:       recipe.category,
                difficulty:     recipe.difficulty,
                quantity:       recipe.quantity,
                duration:       String(recipe.duration),
                published:      recipe.published,
                image:          recipe.image ? Buffer.from(recipe.image).toString('base64') : null,
                sections:       recipe.ingredients,
                instructions:   recipe.instructions,
            }

            return (<EditPage isNew={false} values={values} id={Number(id)} />)
        }
        return (
            <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background to-muted/20'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='text-center py-20'>
                        <div className='p-4 rounded-full bg-destructive/10 inline-block mb-4'>
                            <FileText className='h-8 w-8 text-destructive' />
                        </div>
                        <h2 className='text-xl font-semibold text-foreground mb-2'>{text.edit.errorFetching}</h2>
                        <Link href='/protected/edit'>
                            <Button variant='outline' className='mt-4'>Tilbake til søk</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const param = await searchParams
    const search = typeof param.q === 'string' ? param.q : ''

    const recipes = await searchRecipes(search, 8, 0, true, {})

    if(typeof recipes === 'string'){
        return (
            <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background to-muted/20'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='text-center py-20'>
                        <p className='text-muted-foreground'>{`${text.edit.errorSearch} '${search}'`}</p>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background to-muted/20'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                {/* Breadcrumb */}
                <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
                    <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                    <ChevronRight className='h-4 w-4' />
                    <Link href='/protected' className='hover:text-foreground transition-colors'>Administrasjon</Link>
                    <ChevronRight className='h-4 w-4' />
                    <span className='text-foreground font-medium'>Rediger oppskrift</span>
                </nav>
                
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='p-2 rounded-xl bg-primary/10'>
                            <Edit className='h-6 w-6 text-primary' />
                        </div>
                        <h1 className='text-3xl font-bold text-foreground'>Rediger oppskrift</h1>
                    </div>
                    <p className='text-muted-foreground'>Søk etter en oppskrift for å redigere den</p>
                </div>
                
                {/* Search Form */}
                <Card className='mb-8 border-border/50 bg-card/50 backdrop-blur-sm'>
                    <CardContent className='p-6'>
                        <RecipesInput search={search} />
                    </CardContent>
                </Card>
                
                {/* Results */}
                {recipes.recipes.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {recipes.recipes.map((recipe) => (
                            <Link key={recipe.id} href={`/protected/edit/${recipe.id}`} className='group'>
                                <Card className='hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50'>
                                    <CardContent className='p-4 flex items-center gap-4'>
                                        <div className='p-3 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors'>
                                            <FileText className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-foreground truncate group-hover:text-primary transition-colors'>
                                                {recipe.title}
                                            </h3>
                                            <p className='text-sm text-muted-foreground'>Klikk for å redigere</p>
                                        </div>
                                        <ChevronRight className='h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : search ? (
                    <div className='text-center py-12'>
                        <div className='p-4 rounded-full bg-muted/50 inline-block mb-4'>
                            <Search className='h-8 w-8 text-muted-foreground' />
                        </div>
                        <h3 className='text-lg font-medium text-foreground mb-2'>Ingen resultater</h3>
                        <p className='text-muted-foreground'>Prøv et annet søkeord</p>
                    </div>
                ) : null}
                
                {/* Back Button */}
                <div className='mt-8'>
                    <Button variant='outline' asChild>
                        <Link href='/protected'>
                            ← {text.back}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

function RecipesInput({search}:{search: string}){
    return (
        <Form action='/protected/edit'>
            <div className='relative w-full'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <Input 
                    type='search'
                    name='q' 
                    placeholder={text.edit.search}
                    defaultValue={search}
                    className='pl-12 pr-24 h-12 text-base bg-background border-input'
                />
                <Button 
                    type='submit' 
                    className='absolute right-2 top-1/2 -translate-y-1/2 h-8'
                >
                    Søk
                </Button>
            </div>
        </Form>
    )
}