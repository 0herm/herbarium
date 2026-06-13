import { notFound as text } from '@text'
import { Button } from '@parent/frontend/src/components/ui/button'
import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function Custom404() {
    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full flex flex-col items-center justify-center p-8 bg-linear-to-b from-background to-muted/20'>
            <div className='text-center'>
                <div className='relative mb-8'>
                    <h1 className='text-[8rem] sm:text-[12rem] font-bold text-primary/10 leading-none select-none'>
                        404
                    </h1>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <Search className='h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground' />
                    </div>
                </div>
                
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-3'>
                    {text.title}
                </h2>
                <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
                    Beklager, vi kunne ikke finne siden du leter etter. Den kan ha blitt flyttet eller slettet.
                </p>
                
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link href='/'>
                        <Button size='lg' className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                            <Home className='mr-2 h-5 w-5' />
                            Gå til forsiden
                        </Button>
                    </Link>
                    <Link href='/recipes'>
                        <Button size='lg' variant='outline'>
                            <Search className='mr-2 h-5 w-5' />
                            Søk i oppskrifter
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}