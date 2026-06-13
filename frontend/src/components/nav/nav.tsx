'use client'

import { Leaf, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { recipeTypes } from '@parent/constants' 
import ThemeToggle from '@parent/frontend/src/components/themetoggle/themeToggle'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@parent/frontend/src/components/ui/navigation-menu'
import SearchForm from '@parent/frontend/src/components/searchForm/searchForm'
import { siteName, navigation as text } from '@text'

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])
    return (
        <>
            <div className='flex flex-row justify-between items-center w-full h-(--h-navbar) max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>

                <Link href='/' className='flex items-center gap-2 group'> 
                    <div className='p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200'>
                        <Leaf className='h-6 w-6 text-primary' />
                    </div>
                    <span className='hidden sm:block text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200'>
                        {siteName}
                    </span>
                </Link>

                <NavigationMenu className='hidden sm:flex absolute left-1/2 transform -translate-x-1/2'>
                    <NavigationMenuList className='gap-1 justify-center'>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='cursor-pointer bg-transparent hover:bg-accent/60 focus:bg-accent/60 data-[state=open]:bg-accent/60 h-10 px-4 rounded-lg font-medium text-sm'>
                                {text.recipes}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className='flex flex-col w-48 p-2 gap-1'>
                                    <NavigationMenuLink asChild>
                                        <Link 
                                            href='/recipes/'
                                            className='flex items-center gap-3 select-none rounded-lg p-3 leading-none no-underline transition-colors hover:bg-accent text-foreground font-medium'
                                        >
                                            <span>{text.all}</span>
                                        </Link>
                                    </NavigationMenuLink>
                                    <div className='h-px bg-border my-1' />
                                    {Object.entries(recipeTypes).map(([key, value]) => (
                                        <NavigationMenuLink asChild key={key}>
                                            <Link 
                                                href={`/recipes?category=${key}`}
                                                className='flex items-center gap-3 select-none rounded-lg p-3 leading-none no-underline transition-colors hover:bg-accent text-muted-foreground hover:text-foreground capitalize'
                                            >
                                                <span>{value}</span>
                                            </Link>
                                        </NavigationMenuLink>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link 
                                href='/about'
                                className='flex items-center h-10 px-4 rounded-lg font-medium text-sm text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors'
                            >
                                {text.about}
                            </Link>	
                        </NavigationMenuItem>	
                    </NavigationMenuList>
                </NavigationMenu>

                <div className='flex flex-row items-center gap-1 sm:gap-2'>
                    <SearchForm />
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(true)}
                        className='flex sm:hidden items-center justify-center cursor-pointer bg-transparent hover:bg-accent/60 h-10 w-10 p-0 rounded-lg'
                        aria-label='Menu'
                    >
                        <Menu className='h-5 w-5' />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div 
                    className='fixed inset-0 bg-black/50 z-40'
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div 
                className={`fixed top-0 right-0 h-screen w-full max-w-sm bg-card z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className='flex flex-col h-full'>
                    <div className='flex items-center justify-between p-4 border-b border-border'>
                        <div className='flex items-center gap-2'>
                            <div className='p-2 rounded-lg bg-primary/10'>
                                <Leaf className='h-4 w-4 text-primary' />
                            </div>
                            <h2 className='text-lg font-semibold'>{siteName}</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className='p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer'
                            aria-label='Close menu'
                        >
                            <X className='h-5 w-5' />
                        </button>
                    </div>
                    <div className='flex-1 overflow-y-auto p-4'>
                        <ul className='space-y-2'>
                            <li>
                                <Link 
                                    href='/recipes/'
                                    className='flex items-center gap-3 select-none rounded-lg p-3 leading-none no-underline transition-colors hover:bg-accent text-foreground font-medium'
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>{text.recipes}</span>
                                </Link>
                            </li>
                            <li className='h-px bg-border my-2' />
                            {Object.entries(recipeTypes).map(([key, value]) => (
                                <li key={key}>
                                    <Link 
                                        href={`/recipes?category=${key}`}
                                        className='flex items-center gap-3 select-none rounded-lg p-3 leading-none no-underline transition-colors hover:bg-accent text-muted-foreground hover:text-foreground capitalize'
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span>{value}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className='h-px bg-border my-2' />
                            <li>
                                <Link 
                                    href='/about'
                                    className='flex items-center gap-3 select-none rounded-lg p-3 leading-none no-underline transition-colors hover:bg-accent'
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>{text.about}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}