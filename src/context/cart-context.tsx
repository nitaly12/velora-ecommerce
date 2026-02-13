'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-context'

export type CartItem = {
    id: string // Product ID
    name: string
    price: number
    image?: string
    quantity: number
}

const CART_STORAGE_KEY = 'velora-cart'

type CartContextType = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
    syncing: boolean
}

const CartContext = createContext<CartContextType>({
    items: [],
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    cartCount: 0,
    cartTotal: 0,
    syncing: false,
})

function loadLocalCart(): CartItem[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as CartItem[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function saveLocalCart(items: CartItem[]) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {}
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([])
    const [cartId, setCartId] = useState<string | null>(null)
    const [syncing, setSyncing] = useState(false)
    const { user } = useAuth()

    const persistLocal = useCallback((next: CartItem[]) => {
        setItems(next)
        if (!user) saveLocalCart(next)
    }, [user])

    const fetchCart = useCallback(async () => {
        if (!user) return
        setSyncing(true)
        try {
            const supabase = createClient()
            let { data: cart } = await supabase.from('cart').select('id').eq('user_id', user.id).maybeSingle()
            if (!cart) {
                const { data: newCart, error: insertErr } = await supabase.from('cart').insert({ user_id: user.id }).select('id').single()
                if (insertErr) throw insertErr
                cart = newCart
            }
            setCartId(cart.id)
            const { data: rows } = await supabase
                .from('cart_items')
                .select('quantity, products(id, name, price, images)')
                .eq('cart_id', cart.id)
            const list: CartItem[] = (rows ?? [])
                .filter((r: any) => r.products)
                .map((r: any) => ({
                    id: r.products.id,
                    name: r.products.name,
                    price: r.products.price,
                    image: r.products.images?.[0],
                    quantity: r.quantity,
                }))
            setItems(list)
        } catch (e) {
            console.error('Cart fetch error', e)
        } finally {
            setSyncing(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            fetchCart()
        } else {
            setCartId(null)
            setItems(loadLocalCart())
        }
    }, [user?.id, fetchCart])

    const addItem = useCallback(
        (newItem: Omit<CartItem, 'quantity'>) => {
            setItems((prev) => {
                const existing = prev.find((i) => i.id === newItem.id)
                const next = existing
                    ? prev.map((i) => (i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i))
                    : [...prev, { ...newItem, quantity: 1 }]
                if (user && cartId) {
                    const qty = existing ? existing.quantity + 1 : 1
                    createClient()
                        .from('cart_items')
                        .upsert(
                            { cart_id: cartId, product_id: newItem.id, quantity: qty },
                            { onConflict: 'cart_id,product_id' }
                        )
                        .then(() => {})
                }
                if (!user) saveLocalCart(next)
                return next
            })
        },
        [user, cartId]
    )

    const removeItem = useCallback(
        (id: string) => {
            setItems((prev) => {
                const next = prev.filter((i) => i.id !== id)
                if (user && cartId) {
                    createClient()
                        .from('cart_items')
                        .delete()
                        .eq('cart_id', cartId)
                        .eq('product_id', id)
                        .then(() => {})
                }
                if (!user) saveLocalCart(next)
                return next
            })
        },
        [user, cartId]
    )

    const updateQuantity = useCallback(
        (id: string, quantity: number) => {
            if (quantity < 1) {
                removeItem(id)
                return
            }
            setItems((prev) => {
                const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i))
                if (user && cartId) {
                    createClient()
                        .from('cart_items')
                        .update({ quantity })
                        .eq('cart_id', cartId)
                        .eq('product_id', id)
                        .then(() => {})
                }
                if (!user) saveLocalCart(next)
                return next
            })
        },
        [user, cartId, removeItem]
    )

    const clearCart = useCallback(() => {
        if (user && cartId) {
            createClient()
                .from('cart_items')
                .delete()
                .eq('cart_id', cartId)
                .then(() => {})
        }
        setItems([])
        if (!user) saveLocalCart([])
    }, [user, cartId])

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                syncing,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
