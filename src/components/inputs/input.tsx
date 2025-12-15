export default function Input({
    type,
    name,
    placeholder,
    value,
    onChange,
    onKeyDown,
    icon
}: {
    type: string
    name: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    icon?: React.ReactNode
}) {
    return (
        <div className='relative'>
            {icon && (
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                className={`
                    w-full h-10 px-3 bg-background border border-input rounded-lg text-sm
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    transition-all
                    ${icon ? 'pl-10' : ''}
                `}
            />
        </div>
    )
}