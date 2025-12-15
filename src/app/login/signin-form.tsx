'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@utils/auth-client'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Leaf, Mail, Lock, Loader2 } from 'lucide-react'
import text from '@public/text.json'

export default function SignInForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <div className='min-h-[calc(100vh-var(--h-navbar))] w-full flex items-center justify-center p-4 bg-linear-to-br from-primary/5 via-background to-accent/20'>
            <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50' />
            <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-40' />

            <Card className='relative w-full max-w-md shadow-2xl border-border/50 bg-card/80 backdrop-blur-xl'>
                <CardHeader className='text-center pb-2 pt-8'>
                    <Link href='/' className='inline-flex items-center justify-center gap-2 mb-6'>
                        <div className='p-3 rounded-xl bg-primary/10'>
                            <Leaf className='h-8 w-8 text-primary' />
                        </div>
                    </Link>
                    <CardTitle className='text-2xl font-bold'>{text.auth.login}</CardTitle>
                    <CardDescription className='text-muted-foreground mt-2'>
                        {text.auth.loginDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className='pt-6 pb-8'>
                    <form
                        className='space-y-6'
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
                                    onError: (ctx) => {
                                        console.error('Login error:', ctx)
                                        setLoading(false)
                                    },
                                    onSuccess: () => {
                                        router.push('/protected')
                                        router.refresh()
                                    }
                                }
                            )
                        }}
                    >
                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-sm font-medium'>
                                {text.auth.email}
                            </Label>
                            <div className='relative'>
                                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                <Input
                                    id='email'
                                    type='email'
                                    required
                                    autoComplete='email'
                                    value={email}
                                    placeholder='din@epost.no'
                                    onChange={e => setEmail(e.target.value)}
                                    className='pl-10 h-11 bg-background border-input focus:border-primary focus:ring-primary'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='password' className='text-sm font-medium'>
                                {text.auth.password}
                            </Label>
                            <div className='relative'>
                                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                <Input
                                    id='password'
                                    type='password'
                                    required
                                    autoComplete='current-password'
                                    value={password}
                                    placeholder='••••••••'
                                    onChange={e => setPassword(e.target.value)}
                                    className='pl-10 h-11 bg-background border-input focus:border-primary focus:ring-primary'
                                />
                            </div>
                        </div>

                        <Button
                            type='submit'
                            className='w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all'
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={20} className='animate-spin' />
                            ) : (
                                text.auth.login
                            )}
                        </Button>
                    </form>

                    <div className='mt-6 text-center'>
                        <Link
                            href='/'
                            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                        >
                            ← Tilbake til forsiden
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}