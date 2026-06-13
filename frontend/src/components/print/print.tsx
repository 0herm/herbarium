'use client'

import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '../ui/button'
import { recipe as recipeText } from '@text'
import { timeToString } from '@parent/frontend/src/utils/timeFormater'

function RecipeContent({ recipe }: { recipe: RecipeProps }) {
    return (
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#111', padding: '0', margin: '0' }}>
            {/* Header */}
            <div style={{ borderBottom: '2px solid #222', paddingBottom: '8px', marginBottom: '12px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px 0', textTransform: 'capitalize', lineHeight: 1.2 }}>
                    {recipe.title}
                </h1>
                <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: '#555' }}>
                    <span>{recipeText.porsions}: {recipe.quantity}</span>
                    <span>{recipeText.totalTime}: {timeToString(recipe.duration, 'long')}</span>
                </div>
            </div>

            {/* Body: two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
                {/* Ingredients */}
                <div>
                    <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', margin: '0 0 8px 0' }}>
                        {recipeText.ingredients}
                    </h2>
                    {recipe.ingredients.map((part, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            {part.title && (
                                <h3 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px 0', color: '#444' }}>
                                    {part.title}
                                </h3>
                            )}
                            <ul style={{ margin: 0, padding: '0 0 0 14px', listStyleType: 'disc' }}>
                                {part.ingredients.map((ing, j) => (
                                    <li key={j} style={{ fontSize: '11px', lineHeight: '1.6', color: '#222' }}>
                                        {ing.quantity} {ing.ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Instructions */}
                <div>
                    <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>
                        {recipeText.instructions}
                    </h2>
                    {(() => {
                        let stepNum = 0
                        return recipe.instructions.map((section, sIdx) => (
                            <div key={sIdx} style={{ marginBottom: sIdx < recipe.instructions.length - 1 ? '10px' : 0 }}>
                                {section.title && (
                                    <h3 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px 0', color: '#444' }}>
                                        {section.title}
                                    </h3>
                                )}
                                <ol style={{ margin: 0, padding: '0 0 0 16px' }} start={stepNum + 1}>
                                    {section.steps.map((step, i) => {
                                        stepNum++
                                        return (
                                            <li key={i} style={{ fontSize: '11px', lineHeight: '1.65', marginBottom: '5px', color: '#222' }}>
                                                {step}
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        ))
                    })()}
                </div>
            </div>
        </div>
    )
}

export default function PrintButton({ recipe }: { recipe: RecipeProps }) {
    const contentRef = useRef<HTMLDivElement>(null)

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: recipe.title.replace(/\s+/g, '-'),
        pageStyle: `
            @page { size: A4; margin: 1.5cm; }
            body { -webkit-print-color-adjust: exact; }
        `,
    })

    return (
        <>
            <Button variant='outline' className='cursor-pointer gap-2' onClick={() => reactToPrintFn()}>
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' />
                </svg>
                Skriv ut
            </Button>
            <div ref={contentRef} className='hidden print:block'>
                <RecipeContent recipe={recipe} />
            </div>
        </>
    )
}
