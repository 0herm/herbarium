'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { recipeTypes } from '@parent/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '../ui/slider'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { timeToString } from '@/utils/timeFormater'
import { searchPlaceholder, filter as text } from '@text'

export default function Filters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const minTime  = 15
    const maxTime  = 240 + 15
    const stepTime = 15

    const selectedTypes = searchParams.getAll('category')
    const [timeFilter, setTimeFilter] = useState(Number(searchParams.get('duration')) || maxTime)
    const [search, setSearch] = useState(searchParams.get('q') || '')

    function handleFilterChangeGroup(paramName: string, value: string, selected: boolean) {
        const params = new URLSearchParams(searchParams.toString())
        let values = params.getAll(paramName)

        if (selected) {
            if (!values.includes(value)) {
                values.push(value)
            }
        } else {
            values = values.filter(v => v !== value)
        }

        params.delete(paramName)
        values.forEach(v => params.append(paramName, v))

        router.push(`${pathname}?${params.toString()}`)
    }

    function handleFilterChange(paramName: string, value: string, remove?: boolean) {
        const params = new URLSearchParams(searchParams.toString())
        params.set(paramName, value)
        if(remove) params.delete(paramName)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <h2 className='pb-2'>{text.search}</h2>
                <div className='relative'>
                    <Input 
                        type='search'
                        name='q' 
                        placeholder={searchPlaceholder}
                        value={search}
                        className='pr-10'
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilterChange('q', search)
                            }
                        }}
                    />
                    <Button 
                        variant='ghost' 
                        type='button' 
                        size='icon'
                        className='absolute right-0 top-0 h-full cursor-pointer'
                        onClick={() => handleFilterChange('q', search)}
                    >
                        <Search className='h-4 w-4' />
                    </Button>
                </div>
            </div>
            <div>
                <h2 className='pb-2'>{text.category}</h2>
                {recipeTypes && Object.entries(recipeTypes).map(([category, label]) => (
                    <div key={category} className='flex items-center space-x-2 mb-2'>
                        <Checkbox
                            id={category}
                            value={category}
                            className='cursor-pointer border-[0.1rem] dark:data-[state=checked]:bg-green-700/70 data-[state=checked]:bg-green-700 dark:data-[state=checked]:border-secondary'
                            checked={selectedTypes.includes(category)}
                            onCheckedChange={checked =>
                                handleFilterChangeGroup('category', category, !!checked)
                            }
                        />
                        <label
                            htmlFor={category}
                            className='peer-not-data-[state=checked]:text-muted-foreground capitalize'
                        >
                            {label}
                        </label>
                    </div>
                ))}
            </div>
            <div>
                <h2>{text.totalTime}</h2>
                <div className='w-full flex flex-col gap-2 space-x-2 mb-2'>
                    <label className='text-sm'>
                        {(timeFilter) === maxTime ? 'Ingen grense' : `Maks: ${timeToString(timeFilter)}`}
                    </label>
                    <Slider
                        className='w-full **:data-[slot=slider-range]:bg-green-700/70 cursor-pointer'
                        min={minTime}
                        max={maxTime}
                        step={stepTime}
                        defaultValue={[timeFilter]}
                        onValueChange={([val]) => setTimeFilter(val)}
                        onValueCommit={([val]) => val === maxTime ? handleFilterChange('duration', String(val), true) : handleFilterChange('duration', String(val))}
                    />
                </div>
            </div>
        </div>
    )
}