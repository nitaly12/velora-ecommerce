import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from './add-to-cart-button' // Client component for interactivity

export const revalidate = 60

export default async function ProductPage({
    params,
}: {
    params: { slug: string }
}) {
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', params.slug)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
                {/* Product Images */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    {product.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-2">
                            {product.categories?.name}
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-2xl font-bold text-slate-900">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p>{product.description}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                        <AddToCartButton product={product} />
                    </div>

                    <div className="pt-6 space-y-2 text-sm text-slate-500">
                        <div className="flex gap-2">
                            <span className="font-medium text-slate-900">Stock:</span>
                            {product.stock > 0 ? (
                                <span className="text-green-600">In Stock ({product.stock})</span>
                            ) : (
                                <span className="text-red-600">Out of Stock</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <span className="font-medium text-slate-900">SKU:</span>
                            {product.id.slice(0, 8).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
