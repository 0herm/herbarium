import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@parent/frontend/src/utils/auth'
import SignInForm from './signin-form'

export default async function SignIn() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect('/protected')
    }

    return <SignInForm />
}