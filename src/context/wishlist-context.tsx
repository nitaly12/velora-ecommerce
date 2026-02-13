'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-context'

type WishlistContextType = {
    productIds: Set<string>
    toggle: (productId: string) => Promise<void>
    isInWishlist: (productId: string) => boolean
    loading: boolean
}

const WishlistContext = createContext<WishlistContextType>({
    productIds: new Set(),
    toggle: async () => {},
    isInWishlist: () => false,
    loading: false,
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [productIds, setProductIds] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setProductIds(new Set())
            return
        }
        setLoading(true)
        try {
            const supabase = createClient()
            const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', user.id)
            setProductIds(new Set((data ?? []).map((r) => r.product_id)))
        } catch (e) {
            console.error('Wishlist fetch error', e)
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])

    const toggle = useCallback(
        async (productId: string) => {
            if (!user) return
            const supabase = createClient()
            const inList = productIds.has(productId)
            setProductIds((prev) => {
                const next = new Set(prev)
                if (inList) next.delete(productId)
                else next.add(productId)
                return next
            })
            if (inList) {
                await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
            } else {
                await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
            }
        },
        [user?.id, productIds]
    )

    const isInWishlist = useCallback((productId: string) => productIds.has(productId), [productIds])

    return (
        <WishlistContext.Provider value={{ productIds, toggle, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => useContext(WishlistContext)
