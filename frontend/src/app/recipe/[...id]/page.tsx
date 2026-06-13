import LoadImage from '@parent/frontend/src/components/img/img'
import PrintButton from '@parent/frontend/src/components/print/print'
import { Separator } from '@parent/frontend/src/components/ui/separator'
import { getRecipeById } from '@parent/frontend/src/utils/api'
import { timeToString } from '@parent/frontend/src/utils/timeFormater'
import { Clock, Gauge, Leaf, Users, ChevronRight, Calendar, RefreshCw, ChefHat } from 'lucide-react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { recipe as text } from '@text'


export default async function RecipePage({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params
    const slug = id?.[0] ?? ''

    const recipe = await getRecipeById(slug)

    if (typeof recipe === 'string' || !recipe || recipe.published === false) {
        notFound()
    }

    return (
        <div className='min-h-screen bg-linear-to-b from-background to-muted/10'>
            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
                    <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                    <ChevronRight className='h-4 w-4' />
                    <Link href='/recipes' className='hover:text-foreground transition-colors'>Oppskrifter</Link>
                    <ChevronRight className='h-4 w-4' />
                    <span className='text-foreground font-medium capitalize truncate max-w-[200px]'>{recipe.title}</span>
                </nav>

                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground capitalize text-center mb-8'>
                    {recipe.title}
                </h1>

                <div className='relative w-full aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden bg-muted/30 mb-8 print:hidden shadow-lg'>
                    <LoadImage id={recipe.id} />
                    <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent' />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12'>
                    <div className='flex items-center gap-4 p-5 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow'>
                        <div className='p-3 rounded-xl bg-primary/10'>
                            <Clock className='h-6 w-6 text-primary'/>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>{text.totalTime}</p>
                            <p className='text-lg font-semibold text-foreground'>
                                {timeToString(recipe.duration, 'long')}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-5 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow'>
                        <div className='p-3 rounded-xl bg-primary/10'>
                            <Gauge className='h-6 w-6 text-primary'/>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>{text.difficulty}</p>
                            <p className='text-lg font-semibold text-foreground capitalize'>{recipe.difficulty}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-5 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow'>
                        <div className='p-3 rounded-xl bg-primary/10'>
                            <Users className='h-6 w-6 text-primary'/>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>{text.porsions}</p>
                            <p className='text-lg font-semibold text-foreground'>{recipe.quantity}</p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                    <aside className='lg:col-span-1'>
                        <div className='sticky top-24'>
                            <div className='bg-card rounded-xl border border-border p-6 shadow-sm'>
                                <div className='flex items-center gap-2 mb-6'>
                                    <div className='p-2 rounded-lg bg-primary/10'>
                                        <Leaf className='h-5 w-5 text-primary' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{text.ingredients}</h2>
                                </div>

                                <div className='space-y-6'>
                                    {recipe.ingredients.map((section, index) => (
                                        <div key={index}>
                                            {section.title && (
                                                <h3 className='font-semibold uppercase tracking-wide text-foreground mb-3 text-sm'>
                                                    {section.title}
                                                </h3>
                                            )}
                                            <ul className='space-y-2'>
                                                {section.ingredients.map((item, idx) => (
                                                    <li key={idx} className='flex items-start gap-3 text-sm'>
                                                        <span className='w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0' />
                                                        <span className='text-foreground diagonal-fractions'>
                                                            <span className='font-medium'>{item.quantity}</span> {item.ingredient}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {index < recipe.ingredients.length - 1 && (
                                                <Separator className='mt-4' />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className='lg:col-span-2'>
                        <div className='bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm'>
                            <div className='flex items-center gap-2 mb-6'>
                                <div className='p-2 rounded-lg bg-primary/10'>
                                    <ChefHat className='h-5 w-5 text-primary' />
                                </div>
                                <h2 className='text-xl font-semibold'>{text.instructions}</h2>
                            </div>

                            <div className='prose prose-sm sm:prose-base dark:prose-invert max-w-none'>
                                {(() => {
                                    let stepNum = 0
                                    return recipe.instructions.map((section, sIdx) => (
                                        <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
                                            {section.title && (
                                                <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 not-prose'>
                                                    {section.title}
                                                </h3>
                                            )}
                                            {section.steps.map((step, idx) => {
                                                stepNum++
                                                return (
                                                    <div key={idx} className='flex gap-4 mb-4'>
                                                        <span className='shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm'>
                                                            {stepNum}
                                                        </span>
                                                        <p className='text-foreground leading-relaxed pt-1'>{step}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))
                                })()}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-8 border-t border-border'>
                            <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4' />
                                    <span>{text.created}: {new Date(recipe.date_created).toLocaleDateString('NO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                {recipe.date_created !== recipe.date_updated && (
                                    <div className='flex items-center gap-2'>
                                        <RefreshCw className='h-4 w-4' />
                                        <span>{text.updated}: {new Date(recipe.date_updated).toLocaleDateString('NO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                )}
                            </div>
                            <PrintButton recipe={recipe} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
