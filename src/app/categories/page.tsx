import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FolderTree } from 'lucide-react'

export const revalidate = 3600 // Cache for 1 hour

export default async function CategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('*, products(count)')
        .order('name')

    return (
        <div className="container mx-auto px-4 py-16 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Shop by Category</h1>
                <p className="text-lg text-slate-500">
                    Find exactly what you're looking for by exploring our curated collections.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories?.map((category: any) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="group relative h-80 rounded-3xl overflow-hidden bg-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        {category.image_url ? (
                            <img
                                src={category.image_url}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                                <FolderTree className="h-12 w-12 text-slate-400" />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-slate-200 text-sm">
                                    {category.products?.[0]?.count || 0} Products
                                </p>
                                <span className="text-white font-medium text-sm group-hover:underline">Explore &rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
