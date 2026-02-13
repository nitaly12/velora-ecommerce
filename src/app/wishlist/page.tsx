'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { useWishlist } from '@/context/wishlist-context'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/features/ProductCard'
import { Heart } from 'lucide-react'

type ProductRow = {
    id: string
    name: string
    slug: string
    price: number
    images: string[] | null
    categories: { name: string } | null
}

function normalizeProduct(row: {
    id: string
    name: string
    slug: string
    price: number
    images: string[] | null
    categories?: { name: string } | { name: string }[] | null
}): ProductRow {
    const categories = row.categories
    const category = Array.isArray(categories) ? categories[0] ?? null : categories ?? null
    return { ...row, categories: category }
}

export default function WishlistPage() {
    const { user } = useAuth()
    const { productIds } = useWishlist()
    const [products, setProducts] = useState<ProductRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || productIds.size === 0) {
            setProducts([])
            setLoading(false)
            return
        }
        const supabase = createClient()
        supabase
            .from('products')
            .select('id, name, slug, price, images, categories(name)')
            .in('id', Array.from(productIds))
            .then(({ data }) => {
                const list = Array.isArray(data) ? data.map(normalizeProduct) : []
                setProducts(list)
            })
            .finally(() => setLoading(false))
    }, [user?.id, productIds])

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 md:px-6 text-center">
                <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Sign in to view your wishlist</h2>
                <p className="text-slate-500 mt-2">Save items you love and access them from any device.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Sign in</Link>
                </Button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 md:px-6">
                <p className="text-slate-500">Loading wishlist...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 md:px-6 text-center">
                <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
                <p className="text-slate-500 mt-2">Save products you like by clicking the heart on product cards.</p>
                <Button asChild className="mt-6">
                    <Link href="/products">Browse products</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Wishlist</h1>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    )
}
