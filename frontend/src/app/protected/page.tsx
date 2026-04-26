import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@parent/frontend/src/components/ui/card'
import ExportButton from '@parent/frontend/src/components/backup/export'
import ImportButton from '@parent/frontend/src/components/backup/import'
import SignOutButton from '@parent/frontend/src/components/auth/logout'
import { managementPanel as text } from '@text'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@parent/frontend/src/utils/auth'
import { Plus, Edit, Download, Settings, ChevronRight } from 'lucide-react'

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect('/login')
    }

    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full bg-linear-to-b from-background to-muted/20'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                {/* Breadcrumb */}
                <nav className='flex items-center gap-2 text-sm text-muted-foreground mb-6'>
                    <Link href='/' className='hover:text-foreground transition-colors'>Hjem</Link>
                    <ChevronRight className='h-4 w-4' />
                    <span className='text-foreground font-medium'>Administrasjon</span>
                </nav>
                
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='p-2 rounded-xl bg-primary/10'>
                            <Settings className='h-6 w-6 text-primary' />
                        </div>
                        <h1 className='text-3xl font-bold text-foreground'>{text.title}</h1>
                    </div>
                    <p className='text-muted-foreground'>{text.description}</p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                    <Link href='protected/add' className='group'>
                        <Card className='h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card'>
                            <CardContent className='p-6 flex items-center gap-4'>
                                <div className='p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                                    <Plus className='h-6 w-6 text-primary' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                                        {text.addRecipe}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>Legg til en ny oppskrift</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    
                    <Link href='protected/edit' className='group'>
                        <Card className='h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card'>
                            <CardContent className='p-6 flex items-center gap-4'>
                                <div className='p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                                    <Edit className='h-6 w-6 text-primary' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                                        {text.editRecipe}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>Rediger eksisterende oppskrifter</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                
                <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
                    <CardHeader className='pb-4'>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                            <Download className='h-5 w-5 text-muted-foreground' />
                            Sikkerhetskopi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <ExportButton />
                        <ImportButton />
                    </CardContent>
                </Card>
                
                {/* Sign Out */}
                <div className='mt-8 pt-8 border-t border-border'>
                    <SignOutButton />
                </div>
            </div>
        </div>
    )
}