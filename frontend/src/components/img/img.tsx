'use server'

import Image from 'next/image'

type LoadImageProps = {
    id: number
    className?: string
}

export default async function LoadImage({ id, className }: LoadImageProps) {
    const fallbackImage = '/images/fallback.svg'
    const imageApi = `/api/image/${id}`

    return (
        <Image
            src={id ? imageApi : fallbackImage}
            alt='Image'
            fill={true}
            sizes='100%'
            priority
            className={`object-contain ${className || ''}`}
        />
    )
}