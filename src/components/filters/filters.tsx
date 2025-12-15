'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { recipeTypes } from '@parent/constants'
import { useState } from 'react'
import { Search, Clock } from 'lucide-react'
import { timeToString } from '@/utils/timeFormater'
import { searchPlaceholder, filter as text } from '@text'
import Input from '@components/inputs/input'
import Checkbox from '@components/inputs/checkbox'
import Slider from '@components/inputs/slider'

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
        <div className='flex flex-col gap-6'>
            <div>
                <h2 className='text-sm font-medium text-foreground mb-3'>{text.search}</h2>
                <div className='relative'>
                    <Input 
                        type='search'
                        name='q' 
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={setSearch}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFilterChange('q', search)
                            }
                        }}
                        icon={<Search className='h-4 w-4' />}
                    />
                    <button 
                        type='button' 
                        className='absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer hover:text-primary transition-colors'
                        onClick={() => handleFilterChange('q', search)}
                    >
                        <Search className='h-4 w-4' />
                    </button>
                </div>
            </div>

            <div>
                <h2 className='text-sm font-medium text-foreground mb-3'>{text.category}</h2>
                <div className='space-y-3'>
                    {recipeTypes && Object.entries(recipeTypes).map(([category, label]) => (
                        <Checkbox
                            key={category}
                            id={category}
                            checked={selectedTypes.includes(category)}
                            onChange={(checked) => handleFilterChangeGroup('category', category, checked)}
                            label={label}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className='flex items-center gap-2 mb-3'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <h2 className='text-sm font-medium text-foreground'>{text.totalTime}</h2>
                </div>
                <div className='space-y-4'>
                    <div className='text-sm text-muted-foreground'>
                        {timeFilter === maxTime ? 'Ingen grense' : `Maks: ${timeToString(timeFilter)}`}
                    </div>
                    <Slider
                        min={minTime}
                        max={maxTime}
                        step={stepTime}
                        value={timeFilter}
                        onChange={setTimeFilter}
                        onChangeEnd={(val) => val === maxTime ? handleFilterChange('duration', String(val), true) : handleFilterChange('duration', String(val))}
                    />
                </div>
            </div>
        </div>
    )
}