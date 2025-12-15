export default function Slider({
    min,
    max,
    step,
    value,
    onChange,
    onChangeEnd
}: {
    min: number
    max: number
    step: number
    value: number
    onChange: (value: number) => void
    onChangeEnd: (value: number) => void
}) {
    const percentage = ((value - min) / (max - min)) * 100

    return (
        <div className='relative w-full h-6 flex items-center'>
            <div className='relative w-full h-2 bg-muted rounded-full overflow-hidden'>
                <div 
                    className='absolute left-0 top-0 h-full bg-primary rounded-full transition-all'
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onMouseUp={(e) => onChangeEnd(Number((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => onChangeEnd(Number((e.target as HTMLInputElement).value))}
                className='absolute w-full h-full opacity-0 cursor-pointer'
            />
            <div 
                className='absolute w-5 h-5 bg-background border-2 border-primary rounded-full shadow-md pointer-events-none transition-all'
                style={{ left: `calc(${percentage}% - 10px)` }}
            />
        </div>
    )
}
