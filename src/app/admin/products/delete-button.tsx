'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { deleteProduct } from './actions'

export function DeleteProductButton({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Delete this product? This cannot be undone.')) return
        setLoading(true)
        try {
            await deleteProduct(productId)
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Failed to delete product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={handleDelete} disabled={loading}>
            <Trash className="h-4 w-4" />
        </Button>
    )
}
