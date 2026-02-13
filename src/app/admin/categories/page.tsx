import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'
import { DeleteCategoryButton } from '../categories/delete-button'

export const revalidate = 0

export default async function AdminCategoriesPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase.from('categories').select('*').order('name')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h1>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" /> New Category
                    </Link>
                </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Slug</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories?.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                                <td className="px-6 py-4 text-slate-600">{cat.slug}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/categories/${cat.id}/edit`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteCategoryButton categoryId={cat.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!categories || categories.length === 0) && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                    No categories. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
