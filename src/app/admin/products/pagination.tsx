'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null

    const getPageUrl = (page: number) => {
        const url = new URL(baseUrl, 'http://localhost:3000')
        url.searchParams.set('page', page.toString())
        return url.pathname + url.search
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-sm text-slate-500">
                Page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
                    className={cn(
                        "flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium transition-colors hover:bg-slate-50",
                        currentPage <= 1 && "pointer-events-none opacity-50"
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Link>

                <div className="flex items-center gap-1">
                    {pages.map((page) => (
                        <Link
                            key={page}
                            href={getPageUrl(page)}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                                page === currentPage
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {page}
                        </Link>
                    ))}
                </div>

                <Link
                    href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                    className={cn(
                        "flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium transition-colors hover:bg-slate-50",
                        currentPage >= totalPages && "pointer-events-none opacity-50"
                    )}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}
