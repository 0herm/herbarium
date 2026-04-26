'use client'

import { Input } from '@parent/frontend/src/components/ui/input'
import Form from 'next/form'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { searchPlaceholder } from '@text'

export default function SearchForm() {
    const router = useRouter()
    const pathname = usePathname()
    const [active, setActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const hide = pathname.startsWith('/recipes')

    useEffect(() => {
        if (active) {
            inputRef.current?.focus()
        }
    }, [active])

    return (
        <>
            <div className={`
                ${active ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center py-2 px-4' : 'hidden'}
                md:relative md:flex md:bg-transparent md:backdrop-blur-none md:p-0 md:py-0 md:inset-auto md:z-auto
                ${hide && !active ? 'md:hidden' : ''}
            `}>
                {/* Close button for mobile */}
                {active && (
                    <button 
                        onClick={() => setActive(false)}
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-accent md:hidden'
                    >
                        <X className='h-6 w-6' />
                    </button>
                )}
                
                <Form 
                    action='/recipes'
                    className='w-full max-w-md md:w-auto md:max-w-none'
                    onSubmit={(e) => {
                        e.preventDefault()
                        setActive(false)
                        const form = e.target as HTMLFormElement
                        const formData = new FormData(form)
                        const query = formData.get('q') as string
                        const params = new URLSearchParams()
                        params.set('q', query)
                        const url = `/recipes?${params.toString()}`
                        router.push(url)
                        form.reset()
                    }}
                >
                    <div className='relative w-full md:w-52 lg:w-64'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input 
                            type='search'
                            name='q' 
                            placeholder={searchPlaceholder}
                            className='pl-10 pr-4 h-10 bg-accent/30 border-transparent hover:border-border focus:border-primary focus:bg-background transition-colors'
                            ref={inputRef}
                        />
                    </div>
                </Form>
            </div>
            
            {/* Mobile Search Toggle */}
            <button
                onClick={() => setActive(!active)} 
                className={`
                    ${hide ? 'flex': 'flex md:hidden'} 
                    items-center justify-center h-10 w-10 rounded-lg hover:bg-accent/60 transition-colors cursor-pointer
                `}
                aria-label='Search'
            >
                <Search className='h-5 w-5' />
            </button>
        </>
    )
} 