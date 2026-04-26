'use client'
import { signOut } from '@parent/frontend/src/utils/auth-client'
import { Button } from '@parent/frontend/src/components/ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { auth as text } from '@text'

export default function SignOutButton() {
    const router = useRouter()
    
    return (
        <Button
            variant='outline'
            onClick={() => signOut(
                {
                    fetchOptions: {
                        onSuccess: () => {
                            router.push('/')
                        }
                    }
                }
            )}
            className='cursor-pointer w-full h-11 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30'
        >
            <LogOut className='h-4 w-4' />
            {text.logout}
        </Button>
    )
}