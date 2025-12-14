import { Leaf } from 'lucide-react'
import { siteName, footer as text } from '@text'

export default function Footer() {

    const version = process.env.NEXT_PUBLIC_VERSION

    return (
        <div className='flex flex-row items-center w-full p-4'>
            <div>
                <div className='flex flex-row items-center'>
                    <Leaf className='h-full w-auto p-2 text-[#599459]' />
                    <h1>{siteName}</h1>
                </div>
                <p className='text-sm p-2'>{text.copyright} © {new Date().getFullYear()} {siteName}</p>
            </div>
            <p className='ml-auto bg-primary-foreground p-[0.5rem_1rem] rounded-md font-semibold text-[#599459]'>v{version}</p>
        </div>
    )
}