
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { signIn, useSession } from '@utils/auth-client'
import { useRouter } from 'next/navigation'
import { auth as text } from '@text'

export default function SignIn() {
    const { data: session } = useSession()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (session?.user) {
            router.push('/protected')
        }
    }, [session, router])

    return (
        <div className='h-full w-full flex items-center justify-center bg-linear-to-br from-accent to-background dark:from-background dark:to-accent/40'>
            <Card className='w-full max-w-md shadow-lg border border-border/60 bg-primary-foreground backdrop-blur-md'>
                <CardHeader className='pb-2'>
                    <CardTitle className='text-2xl font-bold text-center'>{text.login}</CardTitle>
                    <CardDescription className='text-center text-muted-foreground'>
                        {text.loginDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className='grid gap-6'
                        onSubmit={async e => {
                            e.preventDefault()
                            await signIn.email(
                                {
                                    email,
                                    password,
                                    callbackURL: '/protected',
                                },
                                {
                                    onRequest: () => setLoading(true),
                                    onResponse: () => setLoading(false),
                                }
                            )
                        }}
                    >
                        <div className='relative grid gap-2'>
                            <Input
                                id='email'
                                type='email'
                                required
                                autoComplete='email'
                                value={email}
                                placeholder=''
                                onChange={e => setEmail(e.target.value)}
                                className='block px-2.5 pb-5.5 pt-4 w-full text-sm dark:bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus-visible:ring-0 peer'
                            />
                            <Label htmlFor='email' className='absolute bg-primary-foreground text-sm duration-300 transform -translate-y-7 scale-75 top-5 z-10 origin-left px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'>
                                {text.email}
                            </Label>
                        </div>
                        <div className='relative grid gap-2'>
                            <Input
                                id='password'
                                type='password'
                                required
                                autoComplete='current-password'
                                value={password}
                                placeholder=''
                                onChange={e => setPassword(e.target.value)}
                                className='block px-2.5 pb-5.5 pt-4 w-full text-sm dark:bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 focus-visible:ring-0 peer'
                            />
                            <Label htmlFor='password' className='absolute bg-primary-foreground text-sm duration-300 transform -translate-y-7 scale-75 top-5 z-10 origin-left px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1'>
                                {text.password}
                            </Label>
                        </div>
                        <Button
                            type='submit'
                            className='w-full font-semibold tracking-wide py-2 hover:text-[#599459] text-[#599459]'
                            disabled={loading}
                            variant='outline'
                        >
                            {loading ? (
                                <Loader2 size={18} className='animate-spin mx-auto' />
                            ) : (
                                <span>{text.login}</span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}