import { Leaf } from 'lucide-react'
import Link from 'next/link'
import { siteName, footer as text } from '@text'

export default function Footer() {
    const version = process.env.NEXT_PUBLIC_VERSION

    return (
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>

                <div className='flex flex-col items-center sm:items-start gap-3'>
                    <Link href='/' className='flex items-center gap-2 group'>
                        <div className='p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200'>
                            <Leaf className='h-5 w-5 text-primary' />
                        </div>
                        <span className='text-lg font-semibold text-foreground'>{siteName}</span>
                    </Link>
                    <p className='text-sm text-muted-foreground flex items-center gap-1'>
                        {text.copyright} © {new Date().getFullYear()} {siteName}
                    </p>
                </div>

                <div className='flex flex-wrap items-center justify-center gap-6 text-sm'>
                    <Link 
                        href='/recipes' 
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        Oppskrifter
                    </Link>
                    <Link 
                        href='/about' 
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        Om oss
                    </Link>
                </div>

                <div className='flex items-center gap-3'>
                    <span className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20'>
                        v{version}
                    </span>
                </div>
            </div>
        </div>
    )
}