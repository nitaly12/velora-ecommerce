import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/features/ProductCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const revalidate = 60 // ISR

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; q?: string }
}) {
    const supabase = await createClient()

    let categoryId: string | null = null
    if (searchParams.category) {
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', searchParams.category).single()
        categoryId = cat?.id ?? null
    }

    let query = supabase.from('products').select('*, categories(*)')
    if (categoryId) query = query.eq('category_id', categoryId)
    if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`)

    const { data: products } = await query
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name')

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {searchParams.q ? `Search results for "${searchParams.q}"` :
                        searchParams.category
                            ? `Category: ${categories?.find((c) => c.slug === searchParams.category)?.name ?? searchParams.category}`
                            : 'All Products'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{products?.length ?? 0} products</span>
                    {/* Add sorting dropdown here if needed */}
                </div>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters (Hidden on mobile for now) */}
                <div className="hidden w-64 shrink-0 lg:block space-y-6">
                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className={`hover:text-slate-900 ${!searchParams.category ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                                    All Categories
                                </Link>
                            </li>
                            {categories?.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className={searchParams.category === cat.slug ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No products found matching your criteria.</p>
                            <Button variant="link" asChild className="mt-2">
                                <Link href="/products">Clear filters</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
