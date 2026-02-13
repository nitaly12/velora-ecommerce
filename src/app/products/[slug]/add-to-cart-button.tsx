'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useWishlist } from '@/context/wishlist-context'
import { useAuth } from '@/context/auth-context'
import { Database } from '@/types/database.types'
import { useState } from 'react'
import { Heart } from 'lucide-react'

type Product = Database['public']['Tables']['products']['Row']

export function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCart()
    const { toggle, isInWishlist } = useWishlist()
    const { user } = useAuth()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="flex gap-4">
            <Button
                size="lg"
                className="flex-1 text-base"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
            >
                {product.stock === 0 ? 'Out of Stock' : isAdded ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
            {user && (
                <Button
                    variant="outline"
                    size="lg"
                    className="aspect-square p-0 w-12 flex items-center justify-center"
                    onClick={() => toggle(product.id)}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
            )}
        </div>
    )
}
