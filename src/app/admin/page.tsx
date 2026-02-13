import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 0

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const [
        { count: productsCount },
        { count: ordersCount },
        { count: categoriesCount },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
    ])

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Products</p>
                            <p className="text-2xl font-bold text-slate-900">{productsCount ?? 0}</p>
                        </div>
                        <Package className="h-10 w-10 text-slate-300" />
                    </div>
                    <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                        <Link href="/admin/products">Manage products</Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Orders</p>
                            <p className="text-2xl font-bold text-slate-900">{ordersCount ?? 0}</p>
                        </div>
                        <ShoppingCart className="h-10 w-10 text-slate-300" />
                    </div>
                    <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                        <Link href="/admin/orders">View orders</Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Categories</p>
                            <p className="text-2xl font-bold text-slate-900">{categoriesCount ?? 0}</p>
                        </div>
                        <FolderTree className="h-10 w-10 text-slate-300" />
                    </div>
                    <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                        <Link href="/admin/categories">Manage categories</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
