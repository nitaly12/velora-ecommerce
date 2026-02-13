import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 0

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at, user_id, profiles(full_name, email)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Order</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Total</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders?.map((order: any) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs text-slate-600">{order.id.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-slate-700">{order.profiles?.full_name ?? order.profiles?.email ?? '—'}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">${Number(order.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No orders yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
