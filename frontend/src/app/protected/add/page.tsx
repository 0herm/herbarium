'use server'

import EditPage from '@parent/frontend/src/components/editPage/editPage'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@parent/frontend/src/utils/auth'

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect('/login')
    }

    return (
        <EditPage isNew={true} />
    )
}