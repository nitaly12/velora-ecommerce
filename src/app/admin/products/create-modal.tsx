'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'

interface CreateProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateProductModal({ isOpen, onClose, onSuccess }: CreateProductModalProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                const { data } = await supabase.from('categories').select('id, name').order('name')
                setCategories(data ?? [])
            }
            fetchCategories()
        } else {
            // Reset state when closing
            setPreviewImage(null)
            setLoading(false)
        }
    }, [isOpen])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewImage(url)
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        try {
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

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
                imageUrl = publicUrl
            }

            // 2. Insert Product
            const { error: insertError } = await supabase.from('products').insert({
                name,
                slug,
                price,
                stock,
                description: description || null,
                category_id: category_id || null,
                images: imageUrl ? [imageUrl] : [],
                is_featured,
            })

            if (insertError) throw insertError

            onSuccess()
            onClose()
        } catch (error: any) {
            console.error('Error creating product:', error)
            alert(error.message || 'Error creating product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Product">
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                            <select id="category_id" name="category_id" className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
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

                        <div className="flex items-center gap-2 py-2">
                            <input type="checkbox" id="is_featured" name="is_featured" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950" />
                            <label htmlFor="is_featured" className="text-sm font-medium text-slate-700">Featured on homepage</label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">Product Image</label>

                        {previewImage ? (
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 group">
                                <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewImage(null)
                                        const input = document.getElementById('image') as HTMLInputElement
                                        if (input) input.value = ''
                                    }}
                                    className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full text-slate-600 hover:text-red-600 shadow-sm transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center aspect-square w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                                <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                <p className="text-xs">No image selected</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Product details..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="min-w-[120px]">
                        Create Product
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
