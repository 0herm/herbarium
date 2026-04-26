import Link from 'next/link'
import {
    Card,
    CardDescription,
    CardTitle,
    CardContent
} from '@parent/frontend/src/components/ui/card'
import LoadImage from '@parent/frontend/src/components/img/img'
import PageOverview from '@parent/frontend/src/components/pagination/pagination'
import { BadgePlus, Clock, Filter, Shapes, ChevronRight, Search, Star } from 'lucide-react'
import { recipeTypes } from '@parent/constants'
import Filters from '@parent/frontend/src/components/filters/filters'
import { searchRecipes } from '@parent/frontend/src/utils/api'
import { timeToString } from '@parent/frontend/src/utils/timeFormater'
import { recipes as text } from '@text'
import MobileFilterToggle from '@parent/frontend/src/components/filters/mobileFilterToggle'

export default async function Page({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {
    const paramsSearch = await searchParams

    const search = typeof paramsSearch.q    === 'string' ? paramsSearch.q           : ''
    const offset = typeof paramsSearch.p    === 'string' ? Number(paramsSearch.p)   : 1
    const category = typeof paramsSearch.category === 'string' ? paramsSearch.category : undefined
    const difficulty = typeof paramsSearch.difficulty === 'string' ? paramsSearch.difficulty : undefined
    const duration = typeof paramsSearch.duration === 'string' ? Number(paramsSearch.duration) : undefined
    const favorite = paramsSearch.favorite === 'true' ? true : undefined

    const limit = 12

    const data = await searchRecipes(search, limit, offset-1, false, { category, difficulty, duration, favorite })

    return (
        <div className='min-h-screen bg-linear-to-b from-background via-background to-muted/20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                {/* Header */}
                <div className='mb-8'>
                    <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
                        <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                        <ChevronRight className='h-4 w-4' />
                        <span className='text-foreground font-medium'>Oppskrifter</span>
                    </nav>
                    <h1 className='text-3xl sm:text-4xl font-bold text-foreground'>
                        {search ? `Søkeresultater for "${search}"` : 'Alle oppskrifter'}
                    </h1>
                    {typeof data !== 'string' && data.totalItems > 0 && (
                        <p className='text-muted-foreground mt-2'>
                            {data.totalItems} oppskrift{data.totalItems !== 1 ? 'er' : ''} funnet
                        </p>
                    )}
                </div>

                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Mobile Filter Toggle */}
                    <MobileFilterToggle>
                        <Filters />
                    </MobileFilterToggle>

                    {/* Sidebar Filters - Desktop */}
                    <aside className='hidden lg:block w-72 shrink-0'>
                        <div className='sticky top-24'>
                            <Card className='bg-card/50 backdrop-blur-sm border-border/50 shadow-sm'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center gap-2 mb-6'>
                                        <div className='p-2 rounded-lg bg-primary/10'>
                                            <Filter className='h-4 w-4 text-primary' />
                                        </div>
                                        <h2 className='text-lg font-semibold'>{text.filters}</h2>
                                    </div>
                                    <Filters />
                                </CardContent>
                            </Card>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className='flex-1 min-w-0'>
                        {typeof data === 'string' ? (
                            <EmptyState message={text.noRecipes} />
                        ) : data.recipes.length === 0 ? (
                            <EmptyState message={text.noRecipes} />
                        ) : (
                            <div className='space-y-8'>
                                <RecipeGrid recipes={data.recipes} />
                                <PageOverview current={offset} pages={Math.ceil(data.totalItems/limit)} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className='flex flex-col items-center justify-center py-20 px-4'>
            <div className='p-4 rounded-full bg-muted/50 mb-4'>
                <Search className='h-8 w-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium text-foreground mb-2'>Ingen oppskrifter funnet</h3>
            <p className='text-muted-foreground text-center max-w-md'>{message}</p>
            <Link 
                href='/recipes' 
                className='mt-6 text-primary hover:text-primary/80 font-medium transition-colors'
            >
                Se alle oppskrifter
            </Link>
        </div>
    )
}

function RecipeGrid({recipes}: {recipes: RecipeProps[]}) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
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
        <Link href={`../recipe/${recipe.id}`} className='group'>
            <Card className='h-full overflow-hidden bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50'>
                <div className='relative aspect-4/3 overflow-hidden bg-muted/30'>
                    <LoadImage id={recipe.id} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                    {isNew && (
                        <div className='absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium shadow-lg'>
                            <BadgePlus className='h-3 w-3' />
                            <span>{text.new}</span>
                        </div>
                    )}
                    {recipe.favorite && (
                        <div className='absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/90 text-yellow-50 text-xs font-medium shadow-lg'>
                            <Star className='h-3 w-3 fill-current' />
                            <span>Favoritt</span>
                        </div>
                    )}
                    <div className='absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>
                
                <CardContent className='p-5'>
                    <CardTitle className='text-lg font-semibold mb-3 line-clamp-1 group-hover:text-primary transition-colors'>
                        {recipe.title}
                    </CardTitle>
                    
                    <CardDescription className='flex flex-wrap items-center gap-4 text-sm'>
                        {recipe.category && (
                            <div className='flex items-center gap-1.5 text-muted-foreground'>
                                <Shapes className='h-4 w-4' />
                                <span className='capitalize'>{recipeTypes[recipe.category]}</span>
                            </div>
                        )}
                        
                        {recipe.duration > 0 && (
                            <div className='flex items-center gap-1.5 text-muted-foreground'>
                                <Clock className='h-4 w-4' />
                                <span>{timeToString(recipe.duration)}</span>
                            </div>
                        )}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}