'use client'

import { Input } from '@ui/input'
import { Button } from '@ui/button'
import Form from 'next/form'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { searchPlaceholder } from '@text'

export default function SearchForm() {
    const router = useRouter()
    const pathname = usePathname()
    const [active, setActive] = useState(false)
    const hide = pathname.startsWith('/recipes')

    return (
        <>
            <Form 
                action='/recipes'
                className={`md:block left-0 top-(--h-navbar) absolute bg-background w-full px-[0.1rem] md:top-0 md:relative md:max-w-[200px] md:bg-transparent ${active ? '' : 'hidden'} ${hide && active ? '' : hide ? 'md:hidden' : ''}`}
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
                <div className='relative w-full md:max-w-[200px]'>
                    <Input 
                        type='search'
                        name='q' 
                        placeholder={searchPlaceholder}
                        className='pr-10 focus-visible:ring-0'
                    />
                    <div className='absolute top-0 right-0 flex items-center'>
                        <Button variant='ghost' type='submit' className='cursor-pointer'>
                            <Search/>
                        </Button>
                    </div>
                </div>
            </Form>
            <Search
                onClick={() => setActive(!active)} 
                className={`${hide ? 'block': 'md:hidden'} cursor-pointer`}
            />
        </>
    )
} 