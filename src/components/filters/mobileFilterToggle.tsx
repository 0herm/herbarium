'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { recipes as text } from '@text'

interface MobileFilterToggleProps {
    children: React.ReactNode
}

export default function MobileFilterToggle({ children }: MobileFilterToggleProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='lg:hidden'>
            <button
                onClick={() => setIsOpen(true)}
                className='flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg shadow-sm hover:bg-accent transition-colors cursor-pointer'
            >
                <Filter className='h-4 w-4 text-primary' />
                <span className='font-medium text-sm'>{text.filters}</span>
            </button>

            {isOpen && (
                <div 
                    className='fixed inset-0 bg-black/50 z-40'
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div 
                className={`fixed inset-y-0 left-0 w-full max-w-sm bg-card z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex flex-col h-full'>
                    <div className='flex items-center justify-between p-4 border-b border-border'>
                        <div className='flex items-center gap-2'>
                            <div className='p-2 rounded-lg bg-primary/10'>
                                <Filter className='h-4 w-4 text-primary' />
                            </div>
                            <h2 className='text-lg font-semibold'>{text.filters}</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer'
                            aria-label='Close filters'
                        >
                            <X className='h-5 w-5' />
                        </button>
                    </div>

                    <div className='flex-1 overflow-y-auto p-4'>
                        {children}
                    </div>

                    <div className='p-4 border-t border-border'>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer'
                        >
                            Vis resultater
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
