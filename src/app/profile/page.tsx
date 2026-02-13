import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: orders } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', user.id).order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Account</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/profile/edit">Edit profile</Link>
                    </Button>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline">Sign Out</Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-4">
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-900">Profile</h3>
                        <p className="mt-2 text-sm text-slate-500">{profile?.full_name ?? 'User'}</p>
                        <p className="text-sm text-slate-500">{profile?.email ?? user.email}</p>
                        <div className="mt-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${profile?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                                {profile?.role ?? 'USER'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Order History</h2>
                    {orders && orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="rounded-xl border border-slate-200 p-6 shadow-sm">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                                {order.status}
                                            </span>
                                            <p className="font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {order.order_items.map((item: any) => (
                                            <div key={item.id} className="py-2 text-sm flex justify-between">
                                                <span className="text-slate-600">{item.products?.name ?? 'Product'} x {item.quantity}</span>
                                                <span>${item.price_at_purchase.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No orders yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
