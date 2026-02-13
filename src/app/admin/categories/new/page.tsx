'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewCategoryPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = (formData.get('description') as string) || null

        const { error } = await supabase.from('categories').insert({ name, slug, description })

        if (error) {
            alert(error.message)
        } else {
            router.push('/admin/categories')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-xl space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Category</h1>
            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" name="name" required placeholder="e.g. Electronics" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">Slug (URL)</label>
                    <Input id="slug" name="slug" required placeholder="e.g. electronics" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                        placeholder="Short description"
                    />
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Category'}</Button>
            </form>
        </div>
    )
}
