import { about as text } from '@text'
import { Card, CardContent } from '@parent/frontend/src/components/ui/card'
import { Button } from '@parent/frontend/src/components/ui/button'
import { Leaf, Heart, ChefHat, Users, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function About(){
    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background via-background to-muted/20'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
                    <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                    <ChevronRight className='h-4 w-4' />
                    <span className='text-foreground font-medium'>Om meg</span>
                </nav>
                
                <div className='text-center mb-12'>
                    <div className='inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 mb-6'>
                        <Leaf className='h-12 w-12 text-primary' />
                    </div>
                    <h1 className='text-4xl sm:text-5xl font-bold text-foreground mb-4'>
                        {text.title}
                    </h1>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                        Min personlige digitale kokebok for å samle, organisere og dele mine favorittoppskrifter.
                    </p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12'>
                    <Card className='text-center border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                        <CardContent className='pt-8 pb-6'>
                            <div className='inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4'>
                                <ChefHat className='h-8 w-8 text-primary' />
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>Enkelt å bruke</h3>
                            <p className='text-sm text-muted-foreground'>
                                Intuitivt grensesnitt for rask tilgang til alle dine oppskrifter
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className='text-center border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                        <CardContent className='pt-8 pb-6'>
                            <div className='inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4'>
                                <Users className='h-8 w-8 text-primary' />
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>For hele familien</h3>
                            <p className='text-sm text-muted-foreground'>
                                Samle familieoppskrifter på ett sted for alle generasjoner
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className='text-center border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                        <CardContent className='pt-8 pb-6'>
                            <div className='inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-4'>
                                <Heart className='h-8 w-8 text-primary' />
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>Laget med kjærlighet</h3>
                            <p className='text-sm text-muted-foreground'>
                                Et personlig prosjekt for å bevare mattradisjoner
                            </p>
                        </CardContent>
                    </Card>
                </div>
                
                <div className='text-center py-12 px-6 rounded-2xl bg-card border border-border/50'>
                    <h2 className='text-2xl font-bold text-foreground mb-4'>
                        Klar til å utforske?
                    </h2>
                    <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                        Utforsk min samling av oppskrifter og finn din neste favorittrett.
                    </p>
                    <Link href='/recipes'>
                        <Button size='lg' className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                            Se alle oppskrifter
                            <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}