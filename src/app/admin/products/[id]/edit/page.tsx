import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditProductForm } from './edit-product-form'

export const revalidate = 0

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single()
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name')

    if (!product) notFound()

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
            <EditProductForm product={product} categories={categories ?? []} />
        </div>
    )
}
