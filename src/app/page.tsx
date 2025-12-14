import Link from 'next/link'
import Image from 'next/image'
import { recipeCategories } from '@parent/constants'
import { Button } from '@/components/ui/button'
import { getRecentAdditions, getStats } from '@/utils/api'
import { homepage as text } from '@text'
import { Card, CardContent } from '../components/ui/card'
import LoadImage from '../components/img/img'
import { timeToString } from '../utils/timeFormater'
import { Clock, Users } from 'lucide-react'
import LoadSVG from '../components/svg/svg'

export default async function Home() {
    const favoriteRecipes = await getRecentAdditions(6)
    const stats = await getStats()

    return (
        <div className='w-full flex flex-col items-center gap-20'>
            <div className='h-[calc(100vh-var(--h-navbar))] w-screen relative'>
                <div className='absolute inset-0 bg-linear-to-b not-dark:from-green-400/60 dark:from-green-900 blur-3xl brightness-50' />
                <div className='w-full h-full relative flex md:flex-row flex-col gap-12 md:gap-20 lg:gap-40 items-center pb-40 pl-8 md:pl-16 lg:pl-24 p-8'>
                    <div className='flex flex-col gap-4 justify-center md:justify-normal'>
                        <h1 className='text-3xl md:text-5xl font-bold text-center md:text-left'>
                            {text.title}
                        </h1>
                        <p className='text-sm md:text-lg text-center md:text-left'>
                            {text.description}
                        </p>
                        <div className='flex flex-col xs:flex-row gap-4'>
                            <Link href='/recipes/' className='flex justify-center'>
                                <Button className='cursor-pointer bg-green-600 hover:bg-green-500'>
                                    {text.exploreRecipes}
                                </Button>
                            </Link>
                            <Link href='/' className='flex justify-center'>
                                <Button className='cursor-pointer hover:text-green-600 text-green-600' variant='outline'>
                                    {text.favoriteRecipes}
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className='relative w-full h-full max-h-120 max-w-120'>
                        <Image 
                            src='/images/heroSection.webp'
                            fill
                            alt='recipe hero image'
                            className='object-contain'
                        />
                    </div>
                </div>
            </div>

            <div className='w-full flex justify-center py-4 px-4'>
                {typeof stats === 'string' ? (
                    <span className='text-center text-red-500'>{stats}</span>
                ) : (
                    <div className='bg-card/80 shadow-lg rounded-2xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-10 text-lg sm:text-xl font-semibold text-foreground items-center border border-border max-w-4xl w-11/12 justify-center'>
                        <div className='flex flex-col items-center min-w-[90px]'>
                            <span className='text-green-500/80 text-2xl sm:text-3xl'>{stats.totalRecipes}</span>
                            <span className='text-muted-foreground text-sm sm:text-base'>{text.stats.recipes}</span>
                        </div>
                        <span className='hidden sm:inline text-muted-foreground text-xl'>|</span>
                        <div className='flex flex-col items-center min-w-[90px]'>
                            <span className='text-green-500/80 text-2xl sm:text-3xl'>{stats.totalCategories}</span>
                            <span className='text-muted-foreground text-sm sm:text-base'>{text.stats.categories}</span>
                        </div>
                        <span className='hidden sm:inline text-muted-foreground text-xl'>|</span>
                        <div className='flex flex-col items-center min-w-[90px]'>
                            <span className='text-muted-foreground text-sm sm:text-base'>{text.stats.since}</span>
                            <span className='text-green-500/80 text-2xl sm:text-3xl'>{stats.firstYear}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='w-full'>
                <LoadSVG
                    className='h-20 fill-muted/20'
                    path='M0,192L80,192C160,192,320,192,480,208C640,224,800,256,960,266.7C1120,277,1280,267,1360,261.3L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'
                />
                <section className='py-16 px-4 bg-muted/20 w-full'>
                    <div className='container mx-auto'>
                        <div className='flex items-center justify-between mb-12'>
                            <div>
                                <h2 className='text-3xl sm:text-4xl font-bold text-foreground mb-4'>
                                    {text.recentTitle}
                                </h2>
                                <p className='text-base sm:text-xl text-muted-foreground'>
                                    {text.recentDescription}
                                </p>
                            </div>
                        </div>
                        <div className='flex gap-6 overflow-x-auto pb-4 scroll'>
                            {typeof favoriteRecipes !== 'string' ? favoriteRecipes.map((recipe) => (
                                <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                                    <Card className='shrink-0 w-50 sm:w-60 group bg-card border-border pt-0'>
                                        <div className='relative overflow-hidden flex items-center justify-center bg-muted/30 rounded-md px-8 py-4 pt-10'>
                                            <div className='aspect-3/2 overflow-hidden w-full relative'>
                                                <LoadImage id={recipe.id} />
                                            </div>
                                        </div>
                                        <CardContent className='flex flex-col gap-2 py-2'>
                                            <h3 className='font-bold text-lg pt-2 text-card-foreground capitalize truncate'>
                                                {recipe.title}
                                            </h3>
                                            <div className='flex items-center justify-between text-sm text-muted-foreground'>
                                                <div className='flex items-center gap-1'>
                                                    <Clock className='h-4 w-4' />
                                                    <span>{timeToString(90)}</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <Users className='h-4 w-4' />
                                                    <span>{3}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )): 
                                <div className='col-span-full text-center'>
                                    {text.errorFetchingRecipes}
                                </div>
                            }
                        </div>
                    </div>
                </section>
                <LoadSVG
                    className='h-20 fill-muted/20 rotate-180'
                    path='M0,224L120,240C240,256,480,288,720,293.3C960,299,1200,277,1320,266.7L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'
                />
            </div>

            <div className='w-full mb-20'>
                <LoadSVG
                    className='h-20 fill-muted/20'
                    path='M0,224L120,213.3C240,203,480,181,720,186.7C960,192,1200,224,1320,240L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'
                />
                <section className='py-8 sm:py-12 px-4 bg-muted/20 w-full'>
                    <div className='container mx-auto'>
                        <h3 className='text-3xl sm:text-4xl font-bold mb-4 text-center'>
                            {text.categoriesTitle}
                        </h3>
                        <h4 className='text-base sm:text-xl text-muted-foreground text-center'>
                            {text.categoriesDescription}
                        </h4>
                        <div className='grid grid-cols-2 xs:px-10 sm:grid-cols-4 gap-4 justify-items-center mx-auto max-w-3xl pt-10'>
                            {recipeCategories.slice(0, 4).map((category) => (
                                <Link href={`/recipes?category=${category.name_en}`} key={category.name_en} className='w-full'>
                                    <Card className='hover:shadow-md transition-shadow cursor-pointer group w-full'>
                                        <CardContent className='p-2 xs:p-6 text-center'>
                                            <div className='text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform'>
                                                {category.icon}
                                            </div>
                                            <h4 className='font-semibold text-card-foreground capitalize'>
                                                {category.name}
                                            </h4>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <p className='text-center text-muted-foreground mt-6'>
                            {text.more}
                        </p>
                    </div>
                </section>
                <LoadSVG
                    className='h-20 fill-muted/20 rotate-180'
                    path='M0,224L120,240C240,256,480,288,720,298.7C960,309,1200,299,1320,293.3L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'
                />
            </div>
        </div>
    )
}