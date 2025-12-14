import { notFound as text } from '@text'

export default function Custom404() {
    return (
        <div className='w-full h-full flex flex-col gap-3 sm:gap-0 sm:flex-row justify-center items-center'>
            <h1 className='text-xl sm:text-3xl'>404</h1>
            <div className='bg-accent-foreground mx-4 w-24 h-[0.15rem] sm:w-[0.15rem] sm:h-12' />
            <h1 className='text-xl sm:text-3xl'>{text.title}</h1>
        </div>
    )
}