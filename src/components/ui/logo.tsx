import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
    iconOnly?: boolean
}

export function Logo({ className, size = 'md', iconOnly = false }: LogoProps) {
    const sizes = {
        sm: 'h-6',
        md: 'h-8',
        lg: 'h-12'
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(sizes[size], "w-auto text-slate-900")}
            >
                <path
                    d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
                <path
                    d="M30 35L50 75L70 35"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {!iconOnly && (
                <span className={cn(
                    "font-bold tracking-tight text-slate-900",
                    size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-3xl'
                )}>
                    Velora
                </span>
            )}
        </div>
    )
}
