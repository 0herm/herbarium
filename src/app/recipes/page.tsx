import Link from 'next/link'
import {
    Card,
    CardDescription,
    CardTitle,
    CardContent
} from '@/components/ui/card'
import LoadImage from '@/components/img/img'
import PageOverview from '@/components/pagination/pagination'
import { BadgePlus, Clock, Filter, Shapes } from 'lucide-react'
import { recipeTypes } from '@parent/constants'
import Filters from '@/components/filters/filters'
import { searchRecipes } from '@/utils/api'
import { timeToString } from '@/utils/timeFormater'
import { recipes as text } from '@text'

export default async function Page({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {
    const paramsSearch = await searchParams

    const search = typeof paramsSearch.q    === 'string' ? paramsSearch.q           : ''
    const offset = typeof paramsSearch.p    === 'string' ? Number(paramsSearch.p)   : 1
    const category = typeof paramsSearch.category === 'string' ? paramsSearch.category : undefined
    const difficulty = typeof paramsSearch.difficulty === 'string' ? paramsSearch.difficulty : undefined
    const duration = typeof paramsSearch.duration === 'string' ? Number(paramsSearch.duration) : undefined

    const limit = 8

    const data = await searchRecipes(search, limit, offset-1, false, { category, difficulty, duration })

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col lg:flex-row gap-6'>
                <aside className='w-full lg:w-[18rem] shrink-0'>
                    <div className='sticky top-20 bg-card rounded-xl border p-5 shadow-sm'>
                        <h1 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                            <Filter className='size-5 text-green-600/70' />
                            {text.filters}
                        </h1>
                        <div className='space-y-4'>
                            <Filters />
                        </div>
                    </div>
                </aside>

                <div className='flex-1'>
                    {typeof data === 'string' ? (
                        <div className='flex items-center justify-center h-60 bg-muted/20 rounded-lg'>
                            <p className='text-lg text-muted-foreground'>{text.noRecipes}</p>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            <h2 className='text-2xl font-semibold'>
                                {search ? `Resultater for '${search}'` : 'Alle oppskrifter'}
                                {data.totalItems > 0 && <span className='text-muted-foreground text-lg ml-2'>({data.totalItems})</span>}
                            </h2>
                            
                            <RecipeGrid recipes={data.recipes} />
                            
                            <PageOverview current={offset} pages={Math.ceil(data.totalItems/limit)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function RecipeGrid({recipes}: {recipes: RecipeProps[]}) {
    if (!recipes || recipes.length === 0) {
        return (
            <div className='flex items-center justify-center h-60 bg-muted/20 rounded-lg'>
                <p className='text-lg text-muted-foreground'>{text.noRecipes}</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    )
}

function RecipeCard({recipe}: {recipe: RecipeProps}) {
    const now = new Date()
    const isNew = recipe.date_created && Math.abs(new Date(recipe.date_created).getTime() - now.getTime()) <= 30 * 24 * 60 * 60 * 1000
    
    return (
        <Link href={`../recipe/${recipe.id}`}>
            <Card className='h-70 w-full overflow-hidden transition-all hover:shadow-md'>
                <div className='relative h-40 w-full overflow-hidden flex items-center justify-center'>
                    <LoadImage id={recipe.id} className='w-full h-auto max-h-40 object-contain' />
                    {isNew && (
                        <div className='absolute top-2 left-2 bg-green-950/70 py-1 px-2 rounded-md flex items-center gap-1'>
                            <BadgePlus className='h-3 w-3 text-green-400' />
                            <span className='text-xs font-medium text-green-400'>{text.new}</span>
                        </div>
                    )}
                </div>
                
                <CardContent className='p-3'>
                    <CardTitle className='text-base font-semibold mb-2 line-clamp-1'>
                        {recipe.title}
                    </CardTitle>
                    
                    <CardDescription className='flex flex-wrap gap-3 text-xs'>
                        {recipe.category && (
                            <div className='flex items-center gap-1'>
                                <Shapes className='h-3 w-3' />
                                <span className='capitalize'>{recipeTypes[recipe.category]}</span>
                            </div>
                        )}
                        
                        {recipe.duration > 0 && (
                            <div className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                <span>
                                    {timeToString(recipe.duration)}
                                </span>
                            </div>
                        )}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}