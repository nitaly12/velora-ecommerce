import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, FolderTree, Trash2 } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminCategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('*, products(count)')
        .order('name')

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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category: any) => (
                    <div key={category.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                                <FolderTree className="h-6 w-6 text-slate-400" />
                            </div>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold text-slate-900">{category.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{category.description || 'No description'}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>{category.products?.[0]?.count || 0} Products</span>
                            <Button variant="link" className="p-0 h-auto text-xs" asChild>
                                <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                            </Button>
                        </div>
                    </div>
                ))}
                {categories?.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
