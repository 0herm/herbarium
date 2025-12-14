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
        <Button onClick={handleBackup} disabled={loading} className='w-full cursor-pointer'>
            {loading ? `${text.export.downloading}...` : text.export.title}
        </Button>
    )
}