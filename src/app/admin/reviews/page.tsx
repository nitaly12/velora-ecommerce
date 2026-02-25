import { createClient } from '@/lib/supabase/server'
import { Star, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function AdminReviewsPage() {
    const supabase = await createClient()

    const { data: reviews } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url), products(name, slug)')
        .order('created_at', { ascending: false })

    async function deleteReview(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const supabase = await createClient()
        await supabase.from('reviews').delete().eq('id', id)
        revalidatePath('/admin/reviews')
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Reviews</h1>
                    <p className="text-slate-500 mt-1">Moderating customer feedback and ratings.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review: any) => (
                                    <tr key={review.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                    {review.profiles?.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{review.profiles?.full_name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/products/${review.products?.slug}`}
                                                className="text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-1"
                                            >
                                                {review.products?.name} <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 max-w-xs truncate" title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <form action={deleteReview}>
                                                <input type="hidden" name="id" value={review.id} />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="submit"
                                                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-24 text-center text-slate-400 italic">
                                        No reviews found to manage.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
