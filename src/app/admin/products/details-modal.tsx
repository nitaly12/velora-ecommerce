'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { ImageIcon, Package, Tag, DollarSign, Layout, Info } from 'lucide-react'
import Image from 'next/image'

interface ProductDetailsModalProps {
    productId: string | null
    isOpen: boolean
    onClose: () => void
}

export function ProductDetailsModal({ productId, isOpen, onClose }: ProductDetailsModalProps) {
    const [fetching, setFetching] = useState(false)
    const [product, setProduct] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        if (isOpen && productId) {
            const fetchData = async () => {
                setFetching(true)
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*, categories(name)')
                        .eq('id', productId)
                        .single()

                    if (error) throw error
                    setProduct(data)
                } catch (err) {
                    console.error('Error fetching product details:', err)
                } finally {
                    setFetching(false)
                }
            }
            fetchData()
        } else if (!isOpen) {
            setProduct(null)
        }
    }, [isOpen, productId])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Product Details" className="max-w-3xl">
            {fetching ? (
                <div className="py-20 text-center text-slate-500">Loading product details...</div>
            ) : product ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Preview */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            {product.images?.[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <ImageIcon className="h-12 w-12" />
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Product Name</h4>
                                <p className="text-xl font-bold text-slate-900">{product.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-xs font-medium">Price</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Package className="h-4 w-4" />
                                        <span className="text-xs font-medium">Stock</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{product.stock}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">Category:</span>
                                    <span className="font-semibold text-slate-900">{product.categories?.name || 'None'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Layout className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">Slug:</span>
                                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700">{product.slug}</code>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Info className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">Featured:</span>
                                    <span className={`font-semibold ${product.is_featured ? 'text-blue-600' : 'text-slate-500'}`}>
                                        {product.is_featured ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-sm font-medium text-slate-900 mb-3">Description</h4>
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {product.description || 'No description provided for this product.'}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center text-slate-400 italic">No product data found.</div>
            )}
        </Modal>
    )
}
