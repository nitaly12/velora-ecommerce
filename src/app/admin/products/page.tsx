import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, ImageIcon } from 'lucide-react'
import { DeleteProductButton } from './delete-button'
import { CopyUrlButton } from './copy-url-button'
import { EditProductButton } from './edit-button'
import { ViewProductButton } from './view-button'
import { Pagination } from './pagination'
import Image from 'next/image'

import { CreateProductButton } from './create-button'

export const revalidate = 0

const ITEMS_PER_PAGE = 8

export default async function AdminProductsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page } = await searchParams
    const currentPage = parseInt(page || '1')
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE - 1

    const supabase = await createClient()

    // Fetch products with range and total count
    const { data: products, count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end)

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
                    <p className="text-sm text-slate-500">Manage your product inventory and details.</p>
                </div>
                <CreateProductButton />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Image</th>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Price</th>
                            <th className="px-6 py-3 font-medium">Stock</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products?.map((product) => {
                            const imageUrl = product.images?.[0]
                            return (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                                                {imageUrl ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                        <ImageIcon className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            {imageUrl && <CopyUrlButton url={imageUrl} />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                                    <td className="px-6 py-4 text-slate-600">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <ViewProductButton productId={product.id} />
                                            <EditProductButton productId={product.id} />
                                            <DeleteProductButton productId={product.id} productName={product.name} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {products?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No products found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/products" />
            </div>
        </div>
    )
}
