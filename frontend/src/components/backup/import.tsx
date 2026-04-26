'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@parent/frontend/src/components/ui/dialog'
import { Button } from '../ui/button'
import Form from 'next/form'
import { importBackup } from './actions'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { managementPanel as text } from '@text'

const initialState: FormStateImport = {
    success: null,
}

export default function ImportButton() {
    const [state, formAction, isPending] = useActionState(importBackup, initialState)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (state.success === true) {
            toast.success('Database imported successfully!')
            setOpen(false)
        } else if (state.success === false && state.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' className='w-full h-11 cursor-pointer gap-2'>
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                    </svg>
                    {text.import.title}
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{text.import.dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {text.import.dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='gap-2 sm:gap-0'>
                    <DialogClose asChild>
                        <Button variant='outline' className='cursor-pointer'>
                            {text.import.dialogCancel}
                        </Button>
                    </DialogClose>
                    <Form action={formAction}>
                        <Button type='submit' className='cursor-pointer bg-primary hover:bg-primary/90' disabled={isPending}>
                            {isPending ? `${text.import.dialogImporting}...` : text.import.dialogImport}
                        </Button>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 