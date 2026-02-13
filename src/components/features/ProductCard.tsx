'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { useAuth } from '@/context/auth-context'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row'] & {
    categories: Database['public']['Tables']['categories']['Row'] | null
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart()
    const { toggle, isInWishlist } = useWishlist()
    const { user } = useAuth()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
        })
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (user) toggle(product.id)
    }

    return (
        <Link href={`/products/${product.slug}`} className="group relative block overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                        No Image
                    </div>
                )}

                {user && (
                    <button
                        onClick={handleWishlist}
                        className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-slate-700 shadow-md hover:bg-white"
                        aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                )}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 translate-y-full rounded-full bg-white p-2 text-slate-900 shadow-md transition-transform duration-300 group-hover:translate-y-0 hover:bg-slate-50"
                    aria-label="Add to cart"
                >
                    <ShoppingCart className="h-5 w-5" />
                </button>
            </div>

            <div className="p-4">
                <p className="text-xs text-slate-500 mb-1">{product.categories?.name ?? 'Uncategorized'}</p>
                <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700 truncate">
                    {product.name}
                </h3>
                <p className="mt-1 font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </Link>
    )
}
