'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Category = { id: string; name: string; slug: string; description: string | null }

export function EditCategoryForm({ category }: { category: Category }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [form, setForm] = useState({ name: category.name, slug: category.slug, description: category.description ?? '' })

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('categories')
            .update({ name: form.name, slug: form.slug, description: form.description || null })
            .eq('id', category.id)
        if (error) alert(error.message)
        else {
            router.push('/admin/categories')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    rows={3}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </form>
    )
}
