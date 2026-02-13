'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewProductPage() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.from('categories').select('id, name, slug').order('name').then(({ data }) => setCategories(data ?? []))
    }, [])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const price = parseFloat(formData.get('price') as string)
        const stock = parseInt(formData.get('stock') as string)
        const description = formData.get('description') as string
        const category_id = (formData.get('category_id') as string) || null
        const is_featured = (formData.get('is_featured') as string) === 'on'
        const imageFile = formData.get('image') as File

        // 1. Upload Image
        let imageUrl = null
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile)

            if (uploadError) {
                console.error('Upload Error', uploadError)
                alert('Error uploading image')
                setLoading(false)
                return
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
            imageUrl = publicUrl
        }

        // 2. Insert Product
        const { error } = await supabase.from('products').insert({
            name,
            slug,
            price,
            stock,
            description: description || null,
            category_id: category_id || null,
            images: imageUrl ? [imageUrl] : [],
            is_featured,
        })

        if (error) {
            console.error(error)
            alert('Error creating product')
        } else {
            router.push('/admin/products')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Product</h1>

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                    <Input id="name" name="name" required placeholder="e.g. Minimalist Watch" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                    <Input id="slug" name="slug" required placeholder="e.g. minimalist-watch" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category_id" className="text-sm font-medium">Category</label>
                    <select id="category_id" name="category_id" className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option value="">None</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                        <Input id="price" name="price" type="number" step="0.01" required placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                        <Input id="stock" name="stock" type="number" required placeholder="100" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_featured" name="is_featured" className="h-4 w-4 rounded border-slate-300" />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured on homepage</label>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Product details..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">Product Image</label>
                    <div className="flex items-center gap-4">
                        <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                </Button>
            </form>
        </div>
    )
}
