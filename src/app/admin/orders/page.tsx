import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Order ID</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Total</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs uppercase text-slate-500">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900 font-medium">{order.profiles?.full_name || 'Guest'}</div>
                                    <div className="text-slate-500 text-xs">{order.profiles?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        order.status === 'PAID' ? "bg-green-100 text-green-800" :
                                            order.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                "bg-slate-100 text-slate-800"
                                    )}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    ${order.total_amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {orders?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Inline helper for status colors
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
