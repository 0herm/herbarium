import { Check } from 'lucide-react'

export default function Checkbox({ 
    id, 
    checked, 
    onChange, 
    label 
}: { 
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
}) {
    return (
        <div className='flex items-center gap-3'>
            <button
                type='button'
                role='checkbox'
                aria-checked={checked}
                id={id}
                onClick={() => onChange(!checked)}
                className={`
                    flex items-center justify-center w-5 h-5 rounded border-2 transition-all cursor-pointer
                    ${checked ? 'bg-primary border-primary' : 'bg-background border-muted-foreground/30 hover:border-primary/50'}
                `}
            >
                {checked && <Check className='h-3.5 w-3.5 text-primary-foreground' strokeWidth={3} />}
            </button>
            <label
                htmlFor={id}
                className='text-sm cursor-pointer text-foreground/80 hover:text-foreground transition-colors capitalize'
            >
                {label}
            </label>
        </div>
    )
}