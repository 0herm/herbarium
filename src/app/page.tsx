import Link from 'next/link'
import Image from 'next/image'
import { recipeCategories } from '@parent/constants'
import { Button } from '@/components/ui/button'
import { getRecentAdditions, getStats } from '@/utils/api'
import { homepage as text } from '@text'
import { Card, CardContent } from '../components/ui/card'
import LoadImage from '../components/img/img'
import { timeToString } from '../utils/timeFormater'
import { Clock, Users, ChefHat, BookOpen, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
// import LoadSVG from '../components/svg/svg'

export default async function Home() {
    const favoriteRecipes = await getRecentAdditions(6)
    const stats = await getStats()

    return (
        <div className='w-full flex flex-col'>
            
            {/* Hero Section */}
            <section className='relative min-h-[calc(100vh-var(--h-navbar))] w-full overflow-hidden'>
                
                {/* Background Gradient */}
                <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/20 dark:from-primary/10 dark:via-background dark:to-accent/10' />
                <div className='absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60 dark:opacity-30' />
                <div className='absolute bottom-20 left-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl opacity-50 dark:opacity-20' />
                
                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20'>
                    <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-var(--h-navbar)-6rem)]'>
                        
                        {/* Text Content */}
                        <div className='flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mx-auto lg:mx-0'>
                                <Sparkles className='h-4 w-4' />
                                <span>Den digitale kokebok</span>
                            </div>
                            
                            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight'>
                                {text.title}
                            </h1>
                            
                            <p className='text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0'>
                                {text.description}
                            </p>
                            
                            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4'>
                                <Link href='/recipes/'>
                                    <Button size='lg' className='cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all'>
                                        {text.exploreRecipes}
                                        <ArrowRight className='ml-2 h-5 w-5' />
                                    </Button>
                                </Link>
                                <Link href='/recipes/?favorite=true'>
                                    <Button size='lg' variant='outline' className='cursor-pointer px-8 h-12 text-base font-medium border-2 hover:bg-accent'>
                                        {text.favoriteRecipes}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Hero Image */}
                        <div className='relative order-1 lg:order-2'>
                            <div className='relative w-full max-w-lg mx-auto'>
                                <div className='absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl' />
                                <div className='flex items-center relative aspect-square bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-6 shadow-2xl overflow-hidden'>
                                    <Image 
                                        src='/images/heroSection.webp'
                                        width={500}
                                        height={500}
                                        alt='recipe hero image'
                                        className='object-contain w-full h-auto'
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className='w-full py-16 sm:py-20 bg-card/50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {typeof stats === 'string' ? (
                        <div className='col-span-full text-center py-12 text-muted-foreground'>
                            {text.errorFetchingStats}
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'>
                            <div className='flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow'>
                                <div className='p-3 rounded-xl bg-primary/10 mb-4'>
                                    <BookOpen className='h-8 w-8 text-primary' />
                                </div>
                                <span className='text-4xl sm:text-5xl font-bold text-primary'>{stats.totalRecipes}</span>
                                <span className='text-muted-foreground font-medium mt-2'>{text.stats.recipes}</span>
                            </div>
                            <div className='flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow'>
                                <div className='p-3 rounded-xl bg-primary/10 mb-4'>
                                    <ChefHat className='h-8 w-8 text-primary' />
                                </div>
                                <span className='text-4xl sm:text-5xl font-bold text-primary'>{stats.totalCategories}</span>
                                <span className='text-muted-foreground font-medium mt-2'>{text.stats.categories}</span>
                            </div>
                            <div className='flex flex-col items-center p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow'>
                                <div className='p-3 rounded-xl bg-primary/10 mb-4'>
                                    <TrendingUp className='h-8 w-8 text-primary' />
                                </div>
                                <span className='text-sm text-muted-foreground'>{text.stats.since}</span>
                                <span className='text-4xl sm:text-5xl font-bold text-primary'>{stats.firstYear}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Recipes Section */}
            <section className='w-full py-16 sm:py-24'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12'>
                        <div>
                            <h2 className='text-3xl sm:text-4xl font-bold text-foreground'>
                                {text.recentTitle}
                            </h2>
                            <p className='text-lg text-muted-foreground mt-2'>
                                {text.recentDescription}
                            </p>
                        </div>
                        <Link href='/recipes'>
                            <Button variant='outline' className='group'>
                                Se alle
                                <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                            </Button>
                        </Link>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {typeof favoriteRecipes !== 'string' ? favoriteRecipes.map((recipe) => (
                            <Link key={recipe.id} href={`/recipe/${recipe.id}`} className='group'>
                                <Card className='h-full overflow-hidden bg-card border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
                                    <div className='relative aspect-video overflow-hidden bg-muted/30'>
                                        <LoadImage id={recipe.id} />
                                        <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                                    </div>
                                    <CardContent className='p-5'>
                                        <h3 className='font-semibold text-lg text-card-foreground capitalize line-clamp-1 group-hover:text-primary transition-colors'>
                                            {recipe.title}
                                        </h3>
                                        <div className='flex items-center gap-4 mt-3 text-sm text-muted-foreground'>
                                            <div className='flex items-center gap-1.5'>
                                                <Clock className='h-4 w-4' />
                                                <span>{timeToString(90)}</span>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <Users className='h-4 w-4' />
                                                <span>{3} porsjoner</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )): 
                            <div className='col-span-full text-center py-12 text-muted-foreground'>
                                {text.errorFetchingRecipes}
                            </div>
                        }
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className='w-full py-16 sm:py-24 bg-muted/30'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-12'>
                        <h3 className='text-3xl sm:text-4xl font-bold text-foreground'>
                            {text.categoriesTitle}
                        </h3>
                        <p className='text-lg text-muted-foreground mt-3 max-w-2xl mx-auto'>
                            {text.categoriesDescription}
                        </p>
                    </div>
                    
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto'>
                        {recipeCategories.slice(0, 4).map((category) => (
                            <Link href={`/recipes?category=${category.name_en}`} key={category.name_en} className='group'>
                                <Card className='h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background'>
                                    <CardContent className='p-6 sm:p-8 flex flex-col items-center text-center'>
                                        <div className='text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                                            {category.icon}
                                        </div>
                                        <h4 className='font-semibold text-card-foreground capitalize group-hover:text-primary transition-colors'>
                                            {category.name}
                                        </h4>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    
                    <div className='text-center mt-10'>
                        <Link href='/recipes'>
                            <Button variant='outline' size='lg' className='group'>
                                {text.more}
                                <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}