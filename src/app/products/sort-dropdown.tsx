'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface SortDropdownProps {
    defaultValue: string
    options: { label: string; value: string }[]
}

export function SortDropdown({ defaultValue, options }: SortDropdownProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value
        const params = new URLSearchParams(searchParams.toString())

        if (newValue === 'newest') {
            params.delete('sort')
        } else {
            params.set('sort', newValue)
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <select
            name="sort"
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 cursor-pointer"
            defaultValue={defaultValue}
            onChange={handleChange}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    )
}
