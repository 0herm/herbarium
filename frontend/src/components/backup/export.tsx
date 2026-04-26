'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { managementPanel as text } from '@text'

async function backup() {
    try {
        const response = await fetch('/protected/api/backup')
        if (!response.ok) {
            throw new Error('Failed to fetch backup file')
        }

        const blob = await response.blob()
        const fileUrl = URL.createObjectURL(blob)
        return fileUrl
    } catch (error) {
        console.error('Error fetching backup:', error)
        throw error
    }
}

export default function ExportButton() {
    const [loading, setLoading] = useState(false)

    const handleBackup = async () => {
        setLoading(true)

        try {
            const fileUrl = await backup()
            const link = document.createElement('a')
            link.href = fileUrl
            const date = new Date().toISOString().split('T')[0].replace(/-/g, '_')
            link.download = `herbarium_backup_${date}.sql`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(fileUrl)
        } catch (error) {
            toast.error('Error: Please try again later.')
            console.error('Failed to download backup:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button onClick={handleBackup} disabled={loading} variant='outline' className='w-full h-11 cursor-pointer gap-2'>
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
            </svg>
            {loading ? `${text.export.downloading}...` : text.export.title}
        </Button>
    )
}