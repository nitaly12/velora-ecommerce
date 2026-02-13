'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CopyPlus, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

export default function CartPage() {
    const { items, updateQuantity, removeItem, cartTotal } = useCart()

    if (items.length === 0) {
        return (
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                    <ShoppingBag className="h-10 w-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Your cart is empty</h2>
                <p className="text-slate-500">Looks like you haven't added anything yet.</p>
                <Button asChild className="mt-4">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Shopping Cart</h1>

            <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <ul className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <li key={item.id} className="flex py-6 sm:py-10">
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                                            No Img
                                        </div>
                                    )}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex justify-between">
                                                <h3 className="text-sm">
                                                    <Link href={`/products/${item.id}`} className="font-medium text-slate-700 hover:text-slate-800">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-slate-900">${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="absolute right-0 top-0">
                                                <button
                                                    type="button"
                                                    className="-m-2 inline-flex p-2 text-slate-400 hover:text-slate-500"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-slate-50 p-6 lg:p-8">
                        <h2 className="text-lg font-medium text-slate-900">Order Summary</h2>
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                <dt className="text-base font-medium text-slate-900">Order total</dt>
                                <dd className="text-base font-medium text-slate-900">${cartTotal.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
