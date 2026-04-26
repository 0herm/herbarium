export default function LoadSVG({path, className}: {path: string, className?: string}) {
    return ( 
        <svg 
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            viewBox='0 0 1440 320'
            width='100%'
            height='100%'
            preserveAspectRatio='none'
        >
            <path d={path} />
        </svg>
    )
}