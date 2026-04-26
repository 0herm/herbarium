'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '@parent/frontend/src/utils/cookies'
import { Moon, Sun } from 'lucide-react'

export default function ThemeSwitch() {
    const [theme, setTheme] = useState<Theme>('dark')

    useEffect(() => {
        const el = document.documentElement
        const savedTheme = getCookie('theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
        else if (el.classList.contains('light')) {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }, [])

    function toggleTheme() {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setCookie('theme', newTheme)
        setTheme(newTheme)
        const el = document.documentElement
        el.classList.remove('dark', 'light')
        el.classList.add(newTheme)
    }

    return (
        <button 
            onClick={toggleTheme}
            className='flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent/60 transition-colors cursor-pointer'
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            {theme === 'light' ? (
                <Sun className='h-5 w-5 text-amber-500' />
            ) : (
                <Moon className='h-5 w-5 text-blue-400' />
            )}
        </button>
    )
}