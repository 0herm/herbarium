import { Leaf, User } from 'lucide-react'
import Link from 'next/link'
import { recipeTypes } from '@parent/constants' 
import ThemeToggle from '@components/themetoggle/themeToggle'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@components/ui/navigation-menu'
import SearchForm from '@components/searchForm/searchForm'
import { siteName, navigation as text } from '@text'

export default function NavBar() {
    return (
        <div className='flex flex-row justify-between items-center w-full h-full pr-2'>
            <div className='flex flex-row h-full items-center'>
                <Link href={'/'} className='h-full'> 
                    <Leaf className='h-full w-auto p-4 px-4 text-[#599459]' />
                </Link>
                <h1 className='hidden md:block'>{siteName}</h1>
            </div>

            <NavigationMenu className='absolute left-[calc(50%-2rem)] sm:left-1/2 transform -translate-x-1/2'>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='cursor-pointer bg-transparent hover:bg-accent/50 focus:bg-accent/50 data-[state=open]:focus:bg-accent/50 data-[state=open]:hover:bg-accent/50'>
                            <p className='text-[0.95rem] font-normal'>{text.recipes}</p>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className='flex flex-col w-[100px] p-2 gap-2'>
                                <NavigationMenuLink asChild>
                                    <Link 
                                        href={'/recipes/'}
                                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground text-center capitalize'
                                    >
                                        <p className='text-[0.925rem]'>{text.all}</p>
                                    </Link>
                                </NavigationMenuLink>
                                {Object.entries(recipeTypes).map(([key, value]) => {
                                    return ( 
                                        <NavigationMenuLink asChild key={key}>
                                            <Link 
                                                href={`/recipes?category=${key}`}
                                                className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground text-center capitalize'
                                            >
                                                <p className='text-[0.925rem]'>{value}</p>
                                            </Link>
                                        </NavigationMenuLink>
                                    )
                                })}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link 
                            href='/about'
                            className='block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground text-center text-[0.875rem]'
                        >
                            <p className='text-[0.95rem] whitespace-nowrap'>{text.about}</p>
                        </Link>	
                    </NavigationMenuItem>	
                </NavigationMenuList>
            </NavigationMenu>

            <div className='flex flex-row items-center py-1 px-3 gap-2'>
                <SearchForm />
                <ThemeToggle />
                <Link href={'/login'}>
                    <User />
                </Link>
            </div>
        </div>
    )
}