'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/context/cart-context'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
    const { cartTotal, items, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
    })
    const router = useRouter()

    if (items.length === 0 && !loading) {
        router.push('/cart')
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            setLoading(false)
            return
        }

        const shipping_address = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            address: form.address,
            city: form.city,
            zip: form.zip,
        }

        const { data: order, error: orderErr } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: cartTotal,
                shipping_address,
                status: 'PENDING',
            })
            .select('id')
            .single()

        if (orderErr || !order) {
            console.error(orderErr)
            alert('Failed to create order. Please try again.')
            setLoading(false)
            return
        }

        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
        }))
        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
        if (itemsErr) {
            console.error(itemsErr)
            alert('Order created but some items failed. Contact support.')
        }

        clearCart()
        setLoading(false)
        router.push('/profile')
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <h2 className="text-2xl font-bold mb-8">Shipping Information</h2>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input
                                    required
                                    placeholder="John"
                                    value={form.firstName}
                                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input
                                    required
                                    placeholder="Doe"
                                    value={form.lastName}
                                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                required
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input
                                required
                                placeholder="123 Main St"
                                value={form.address}
                                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input
                                    required
                                    placeholder="New York"
                                    value={form.city}
                                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Zip Code</label>
                                <Input
                                    required
                                    placeholder="10001"
                                    value={form.zip}
                                    onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm">
                            Payment: Order will be created as <strong>PENDING</strong>. You can integrate Stripe later for real payments.
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-slate-50 p-6 lg:p-8 space-y-6">
                        <h2 className="text-lg font-medium text-slate-900">Order Summary</h2>
                        <ul className="divide-y divide-slate-200">
                            {items.map((item) => (
                                <li key={item.id} className="flex justify-between py-2 text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? 'Placing order...' : `Place order — $${cartTotal.toFixed(2)}`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
