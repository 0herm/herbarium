import LoadImage from '@/components/img/img'
import PrintButton from '@/components/print/print'
import { Separator } from '@/components/ui/separator'
import { getRecipeById } from '@/utils/api'
import { timeToString } from '@/utils/timeFormater'
import { Clock, Gauge, Leaf, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { recipe as text } from '@text'


export default async function RecipePage({ params }: { params: Promise<{ id?: string[] }> }) {
    const { id } = await params

    const recipe = await getRecipeById(Number(id))

    if (typeof recipe === 'string' || recipe === undefined || recipe.published === false) {
        notFound()
    }

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-260 sm:px-8'>
                <h1 className='w-full text-center capitalize text-2xl font-semibold'>{recipe.title}</h1>
                <div className='relative flex items-start w-full h-48 sm:h-56 mt-4 print:hidden'>
                    <LoadImage id={recipe.id} />
                </div>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 pt-8 md:pt-12'>
                    <div className='flex flex-row items-center gap-4 w-60 p-4 rounded-lg bg-green-950/10 border border-green-900/40'>
                        <Clock className='size-8 stroke-green-600/70'/>
                        <div className='flex flex-col'>
                            <h1 className='text-sm text-green-400/70'>{text.totalTime}</h1>
                            <span className='text-xl font-semibold'>
                                {timeToString(recipe.duration, 'long')}
                            </span>
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-4 w-60 p-4 rounded-lg bg-green-950/10 border border-green-900/40'>
                        <Gauge className='size-8 stroke-green-600/70'/>
                        <div className='flex flex-col'>
                            <h1 className='text-sm text-green-400/70'>{text.difficulty}</h1>
                            <span className='text-xl font-semibold capitalize'>{recipe.difficulty}</span>
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-4 w-60 p-4 rounded-lg bg-green-950/10 border border-green-900/40'>
                        <Users className='size-8 stroke-green-600/70'/>
                        <div className='flex flex-col'>
                            <h1 className='text-sm text-green-400/70'>{text.porsions}</h1>
                            <span className='text-xl font-semibold'>{recipe.quantity}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col md:flex-row gap-20 justify-between pt-16'>
                    <div className='w-full md:max-w-[20rem]'>
                        <h2 className='text-xl font-semibold mb-4 flex items-center'>
                            <Leaf className='size-5 text-green-600/70 mr-2' />
                            {text.ingredients}
                        </h2>
                        <Separator className='mb-4 bg-green-900' />
                        {recipe.ingredients.map((section, index) => (
                            <div key={index} className='mt-4'>
                                <h1 className='capitalize font-semibold'>{section.title ?`${section.title}:`:''}</h1>
                                <ul className='list-disc list-inside marker:text-green-600/50'>
                                    {section.ingredients.map((item, idx) => (
                                        <li key={idx} className='diagonal-fractions'>
                                            <span>{item.quantity} {item.ingredient}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className='w-full'>
                        <h2 className='text-xl font-semibold mb-4'>{text.instructions}</h2>
                        <Separator className='mb-4 bg-green-900' />
                        <p className='w-full leading-relaxed'>{recipe.instructions.join(' ')}</p>
                    </div>
                </div>
                <div className='w-full flex flex-row justify-between items-center pt-12'>
                    <div className='dark:text-white/70 text-black/70 text-sm'>
                        <div className='grid grid-cols-2 gap-2 text-sm'>
                            <span className='font-semibold'>{text.created}:</span>
                            <span>{recipe.date_created.toLocaleDateString('NO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            {recipe.date_created.getTime() !== recipe.date_updated.getTime() && (
                                <>
                                    <span className='font-semibold'>{text.updated}:</span>
                                    <span>{recipe.date_updated.toLocaleDateString('NO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <PrintButton recipe={{...recipe, image: null}} />
                </div>
            </div>
        </div>
    )
}
