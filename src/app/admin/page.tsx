import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
    Package,
    ShoppingCart,
    FolderTree,
    TrendingUp,
    PlusCircle,
    Eye,
    ArrowRight,
    Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const revalidate = 0

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const [
        { count: productsCount },
        { count: ordersCount },
        { count: categoriesCount },
        { count: reviewsCount },
        { data: recentOrders }
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(5)
    ])

    const stats = [
        {
            label: 'Total Products',
            value: productsCount ?? 0,
            icon: Package,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            href: '/admin/products'
        },
        {
            label: 'Total Orders',
            value: ordersCount ?? 0,
            icon: ShoppingCart,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            href: '/admin/orders'
        },
        {
            label: 'Categories',
            value: categoriesCount ?? 0,
            icon: FolderTree,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            href: '/admin/categories'
        },
        {
            label: 'Total Reviews',
            value: reviewsCount ?? 0,
            icon: Eye,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            href: '/admin/reviews'
        }
    ]

    return (
        <div className="space-y-10">
            {/* Header / Hero */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-8 rounded-3xl text-white overflow-hidden relative">
                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
                    <p className="text-slate-400 max-w-md">
                        Here's what's happening with Velora today. You have {ordersCount ?? 0} total orders to manage.
                    </p>
                    <div className="pt-4 flex gap-3">
                        <Button asChild className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-6">
                            <Link href="/admin/products">
                                <PlusCircle className="mr-2 h-4 w-4" /> New Product
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-slate-700 text-white hover:bg-slate-800 rounded-full px-6">
                            <Link href="/admin/orders">
                                View Orders <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 mr-12 mb-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />

                <div className="hidden lg:flex items-center gap-4 relative z-10 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <TrendingUp className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Growth Rate</p>
                        <p className="text-2xl font-bold">+12.5%</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-1",
                            stat.border
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-7 w-7", stat.color)} />
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 ring-2 ring-slate-50" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</p>
                        </div>
                        <div className="mt-6 flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                            VIEW DETAILS <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                        {/* Subtle background glow */}
                        <div className={cn("absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-3xl", stat.bg)} />
                    </Link>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" /> Recent Activity
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/orders">View All</Link>
                        </Button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                            {recentOrders && recentOrders.length > 0 ? recentOrders.map((order) => (
                                <div key={order.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs uppercase">
                                            {order.profiles?.full_name?.substring(0, 2) || 'CU'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{order.profiles?.full_name || 'Customer'}</p>
                                            <p className="text-xs text-slate-500">Order #{order.id.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-10 text-center text-slate-400 italic text-sm">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 text-emerald-500" /> Quick Shortcuts
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/products" className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-indigo-600 hover:border-indigo-600 transition-all hover:shadow-lg">
                            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Package className="h-5 w-5 text-indigo-600" />
                            </div>
                            <p className="font-bold text-slate-900 group-hover:text-white">Inventory</p>
                            <p className="text-xs text-slate-500 mt-1 group-hover:text-indigo-100">Check stock levels</p>
                        </Link>

                        <Link href="/admin/categories" className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-600 hover:border-emerald-600 transition-all hover:shadow-lg">
                            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <FolderTree className="h-5 w-5 text-emerald-600" />
                            </div>
                            <p className="font-bold text-slate-900 group-hover:text-white">Organize</p>
                            <p className="text-xs text-slate-500 mt-1 group-hover:text-emerald-100">Manage categories</p>
                        </Link>
                    </div>

                    {/* Stock Alert Placeholder */}
                    <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-rose-500 rounded-lg">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">System Alert</span>
                            </div>
                            <p className="text-lg font-bold leading-tight">Stock performance is up by 15% this week.</p>
                            <Button variant="link" className="text-white p-0 h-auto mt-4 text-xs font-bold hover:no-underline">
                                GENERATE REPORT <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    )
}
