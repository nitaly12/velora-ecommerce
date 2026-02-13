import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditCategoryForm } from './edit-category-form'

export const revalidate = 0

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: category } = await supabase.from('categories').select('*').eq('id', params.id).single()
    if (!category) notFound()
    return (
        <div className="max-w-xl space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Category</h1>
            <EditCategoryForm category={category} />
        </div>
    )
}
