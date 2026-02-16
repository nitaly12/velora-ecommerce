'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
    const [product, setProduct] = useState<any>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Categories
            const { data: catData } = await supabase.from('categories').select('id, name, slug').order('name')
            setCategories(catData ?? [])

            // Fetch Product
            const { data: prodData, error } = await supabase.from('products').select('*').eq('id', id).single()
            if (error) {
                console.error('Error fetching product:', error)
                alert('Product not found')
                router.push('/admin/products')
                return
            }
            setProduct(prodData)
            if (prodData.images && prodData.images.length > 0) {
                setPreviewImage(prodData.images[0])
            }
            setLoading(false)
        }
        fetchData()
    }, [id])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaving(true)

        const formData = new FormData(event.currentTarget)
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const price = parseFloat(formData.get('price') as string)
        const stock = parseInt(formData.get('stock') as string)
        const description = formData.get('description') as string
        const category_id = (formData.get('category_id') as string) || null
        const is_featured = (formData.get('is_featured') as string) === 'on'
        const imageFile = formData.get('image') as File

        let imageUrl = previewImage

        // 1. Upload New Image if provided
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile)

            if (uploadError) {
                console.error('Upload Error', uploadError)
                alert('Error uploading image')
                setSaving(false)
                return
            }

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
            imageUrl = publicUrl
        }

        // 2. Update Product
        const { error } = await supabase.from('products').update({
            name,
            slug,
            price,
            stock,
            description: description || null,
            category_id: category_id || null,
            images: imageUrl ? [imageUrl] : [],
            is_featured,
        }).eq('id', id)

        if (error) {
            console.error(error)
            alert('Error updating product')
        } else {
            router.push('/admin/products')
            router.refresh()
        }
        setSaving(false)
    }

    if (loading) return <div className="p-12 text-center text-slate-500">Loading product...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                    <Input id="name" name="name" required defaultValue={product.name} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                    <Input id="slug" name="slug" required defaultValue={product.slug} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category_id" className="text-sm font-medium">Category</label>
                    <select id="category_id" name="category_id" className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" defaultValue={product.category_id || ''}>
                        <option value="">None</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                        <Input id="price" name="price" type="number" step="0.01" required defaultValue={product.price} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="stock" className="text-sm font-medium">Stock</label>
                        <Input id="stock" name="stock" type="number" required defaultValue={product.stock} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_featured" name="is_featured" className="h-4 w-4 rounded border-slate-300" defaultChecked={product.is_featured} />
                    <label htmlFor="is_featured" className="text-sm font-medium">Featured on homepage</label>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={product.description || ''}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">Product Image</label>

                    {previewImage && (
                        <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-slate-200 group">
                            <Image src={previewImage} alt="Preview" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1 rounded-full text-slate-600 hover:text-red-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {!previewImage && (
                        <div className="flex items-center justify-center h-40 w-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                            <ImageIcon className="h-10 w-10" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="image" className="text-xs text-slate-500">Upload {previewImage ? 'new' : ''} image</label>
                        <Input id="image" name="image" type="file" accept="image/*" className="cursor-pointer" />
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Saving...' : 'Update Product'}
                </Button>
            </form>
        </div>
    )
}
