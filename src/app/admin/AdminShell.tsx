'use client'

import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, FolderTree } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    ]

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 border-r border-slate-200 bg-slate-50/50">
                <div className="p-6">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">Admin</h2>
                </div>
                <nav className="space-y-1 px-3">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== '/admin')
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-6 md:p-12">{children}</main>
        </div>
    )
}
