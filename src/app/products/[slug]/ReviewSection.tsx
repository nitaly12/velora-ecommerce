'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    user_id: string
    profiles: {
        full_name: string
        avatar_url: string
    }
}

interface ReviewSectionProps {
    productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchReviews()
        checkUser()
    }, [productId])

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    async function fetchReviews() {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles(full_name, avatar_url)')
                .eq('product_id', productId)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReviews(data || [])
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return

        setSubmitting(true)
        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                user_id: user.id,
                rating: newRating,
                comment: newComment
            })

            if (error) throw error

            setNewComment('')
            setNewRating(5)
            fetchReviews()
        } catch (error) {
            console.error('Error submitting review:', error)
            alert('Failed to submit review. Make sure you haven\'t already reviewed this product.')
        } finally {
            setSubmitting(false)
        }
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-current' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="text-slate-600 font-medium">
                            {averageRating.toFixed(1)} out of 5
                        </span>
                        <span className="text-slate-400">
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {user ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setNewRating(s)}
                                        className={`transition-colors ${s <= newRating ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-500`}
                                    >
                                        <Star className={`w-8 h-8 ${s <= newRating ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                            <textarea
                                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-slate-950 focus:outline-none min-h-[120px]"
                                placeholder="Share your thoughts about this product..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Post Review'}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center">
                    <p className="text-slate-600">Please sign in to write a review.</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        {review.profiles?.avatar_url ? (
                                            <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                                {review.profiles?.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{review.profiles?.full_name || 'Anonymous User'}</p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${s <= review.rating ? 'fill-current' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                            <div className="border-b border-slate-100" />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
