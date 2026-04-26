'use client'

import React, { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { print as text, recipe as recipeText } from '@text'
import { timeToString } from '@parent/frontend/src/utils/timeFormater'

type OptionsProps = {
    font: string
    listStyle: string
    listDirection: string
    instructionStyle: string
    instructionPosition: string
}

function RecipeContent({ recipe, options }: { recipe: RecipeProps; options: OptionsProps }) {
    return (
        <div className={`${options.font !== 'none' ? options.font : ''} pl-20 pt-10 pr-10 leading-relaxed break-inside-avoid`}>
            <h1 className='text-2xl font-bold mb-2 capitalize'>{recipe.title}</h1>
            <p className='text-gray-600'>{recipeText.porsions}: {recipe.quantity}</p>
            <p className='text-gray-600'>{recipeText.totalTime}: {timeToString(recipe.duration, 'long')}</p>
            <hr className='my-5 border-t-[0.1rem] border-gray-300' />
            <h2 className='text-base font-semibold'>{recipeText.ingredients}:</h2>
            <div className={`flex ${options.listDirection === 'row' ? 'flex-row gap-8' : 'flex-col gap-2'}`}>
                {recipe.ingredients.map((part, index) => (
                    <div key={index} className='break-inside-avoid'>
                        <h3 className='text-base font-semibold capitalize'>{part.title}</h3>
                        <ul className={`${options.listStyle !== 'none' ? `${options.listStyle} pl-4` : ''}`}>
                            {part.ingredients.map((ingredient, idx) => (
                                <li key={idx} className='text-base'>
                                    {ingredient.quantity} {ingredient.ingredient}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className='mt-5 break-inside-avoid'>
                <p className='whitespace-pre-wrap'>{recipe.instructions}</p>
            </div>
        </div>
    )
}

export default function PrintButton({ recipe }: { recipe: RecipeProps }) {
    const availableOptions = {
        font: {
            name: text.option.fontFamily.name,
            items: [
                { value: 'none', label: text.option.fontFamily.standard },
                { value: 'font-sans', label: text.option.fontFamily.sans },
            ],
        },
        listStyle: {
            name: text.option.listStyle.name,
            items: [
                { value: 'none', label: text.option.listStyle.none },
                { value: 'list-disc', label: text.option.listStyle.disc },
            ],
        },
        listDirection: {
            name: text.option.listDirection.name,
            items: [
                { value: 'col', label: text.option.listDirection.col },
                { value: 'row', label: text.option.listDirection.row },
            ],
        },
        instructionStyle: {
            name: text.option.instructionFormat.name,
            items: [
                { value: 'none', label: text.option.instructionFormat.none },
                { value: 'decimal', label: text.option.instructionFormat.decimal },
            ],
        },
        instructionPosition: {
            name: text.option.instructionPosition.name,
            items: [
                { value: 'bottom', label: text.option.instructionPosition.bottom },
                { value: 'right', label: text.option.instructionPosition.right },
            ],
        },
    }

    const contentRef = useRef<HTMLDivElement>(null)
    const [options, setOptions] = useState<OptionsProps>({
        font:                   availableOptions.font.items[0].value,
        listStyle:              availableOptions.listStyle.items[0].value,
        listDirection:          availableOptions.listDirection.items[0].value,
        instructionStyle:       availableOptions.instructionStyle.items[0].value,
        instructionPosition:    availableOptions.instructionPosition.items[0].value
    })

    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        documentTitle: recipe.title.replace(/\s+/g, '-'),
    })

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline' className='cursor-pointer gap-2'>
                        <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' />
                        </svg>
                        {text.printButton}
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md overflow-y-auto'> 
                    <DialogHeader>
                        <DialogTitle>{text.title}</DialogTitle>
                        <DialogDescription>{text.description}</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4 py-4'>
                        {Object.entries(availableOptions).map(([key, { name, items }]) => (
                            <div key={key} className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor={key} className='text-right text-sm'>
                                    {name}
                                </Label>
                                <div className='col-span-3'>
                                    <Select
                                        value={options[key as keyof OptionsProps]}
                                        onValueChange={(value) =>
                                            setOptions((prev) => ({ ...prev, [key]: value }))
                                        }
                                    >
                                        <SelectTrigger className='cursor-pointer'>
                                            <SelectValue placeholder={`${text.select} ${name}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.value} value={item.value} className='cursor-pointer'>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={reactToPrintFn}
                            className='cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground'
                        >
                            {text.printSubmit}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div ref={contentRef} className='hidden print:block'>
                <RecipeContent recipe={recipe} options={options} />
            </div>
        </>
    )
}