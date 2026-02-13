'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Product = {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    stock: number
    images: string[] | null
    category_id: string | null
    is_featured: boolean
}

type Category = { id: string; name: string; slug: string }

export function EditProductForm({ product, categories }: { product: Product; categories: Category[] }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [form, setForm] = useState({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id ?? '',
        is_featured: product.is_featured,
    })

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const imageFile = formData.get('image') as File

        let images = product.images ?? []
        if (imageFile?.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile)
            if (uploadError) {
                alert('Error uploading image')
                setLoading(false)
                return
            }
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
            images = [publicUrl]
        }

        const { error } = await supabase
            .from('products')
            .update({
                name: form.name,
                slug: form.slug,
                description: form.description || null,
                price: form.price,
                stock: form.stock,
                category_id: form.category_id || null,
                is_featured: form.is_featured,
                images,
            })
            .eq('id', product.id)

        if (error) {
            alert('Error updating product')
        } else {
            router.push('/admin/products')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                <Input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                <Input
                    id="slug"
                    name="slug"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select
                    id="category"
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.category_id}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                >
                    <option value="">None</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        required
                        value={form.stock}
                        onChange={(e) => setForm((f) => ({ ...f, stock: parseInt(e.target.value, 10) || 0 }))}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_featured"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">Featured on homepage</label>
            </div>
            <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Replace Image (optional)</label>
                <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                {product.images?.[0] && (
                    <p className="text-xs text-slate-500">Current: {product.images[0].slice(0, 50)}…</p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
            </Button>
        </form>
    )
}
