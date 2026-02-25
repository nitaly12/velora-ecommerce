import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/features/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { SortDropdown } from './sort-dropdown'

export const revalidate = 60 // ISR

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; q?: string; sort?: string; minPrice?: string; maxPrice?: string }
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

    if (searchParams.minPrice) {
        query = query.gte('price', parseFloat(searchParams.minPrice))
    }
    if (searchParams.maxPrice) {
        query = query.lte('price', parseFloat(searchParams.maxPrice))
    }

    // Handle Sorting
    const sort = searchParams.sort || 'newest'
    if (sort === 'price-low') {
        query = query.order('price', { ascending: true })
    } else if (sort === 'price-high') {
        query = query.order('price', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data: products } = await query
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name')

    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-low' },
        { label: 'Price: High to Low', value: 'price-high' },
    ]

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {searchParams.q ? `Search results for "${searchParams.q}"` :
                        searchParams.category
                            ? `Category: ${categories?.find((c) => c.slug === searchParams.category)?.name ?? searchParams.category}`
                            : 'All Products'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-slate-500 whitespace-nowrap">{products?.length ?? 0} products</span>

                    <SortDropdown defaultValue={sort} options={sortOptions} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 shrink-0 space-y-8">
                    <div>
                        <h3 className="font-semibold mb-4 text-slate-900">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href={{
                                        pathname: '/products',
                                        query: Object.fromEntries(
                                            Object.entries({ ...searchParams, category: undefined })
                                                .filter(([_, v]) => v !== undefined && v !== null)
                                        )
                                    }}
                                    className={`hover:text-slate-900 block py-1 ${!searchParams.category ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
                                >
                                    All Categories
                                </Link>
                            </li>
                            {categories?.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={{
                                            pathname: '/products',
                                            query: Object.fromEntries(
                                                Object.entries({ ...searchParams, category: cat.slug })
                                                    .filter(([_, v]) => v !== undefined && v !== null)
                                            )
                                        }}
                                        className={`block py-1 ${searchParams.category === cat.slug ? 'font-semibold text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="font-semibold mb-4 text-slate-900">Price Range</h3>
                        <form className="space-y-4">
                            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
                            {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
                            {searchParams.sort && <input type="hidden" name="sort" value={searchParams.sort} />}
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <Input
                                        name="minPrice"
                                        placeholder="Min"
                                        className="pl-7"
                                        defaultValue={searchParams.minPrice}
                                    />
                                </div>
                                <span className="text-slate-400">—</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <Input
                                        name="maxPrice"
                                        placeholder="Max"
                                        className="pl-7"
                                        defaultValue={searchParams.maxPrice}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Apply Filter</Button>
                            {(searchParams.minPrice || searchParams.maxPrice) && (
                                <Button variant="ghost" className="w-full text-xs text-slate-500" asChild>
                                    <Link href={{
                                        pathname: '/products',
                                        query: Object.fromEntries(
                                            Object.entries({ ...searchParams, minPrice: undefined, maxPrice: undefined })
                                                .filter(([_, v]) => v !== undefined && v !== null)
                                        )
                                    }}>
                                        Clear Price Filter
                                    </Link>
                                </Button>
                            )}
                        </form>
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
                        <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No products found matching your criteria.</p>
                            <Button variant="link" asChild className="mt-2 text-slate-900">
                                <Link href="/products">View all products</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
