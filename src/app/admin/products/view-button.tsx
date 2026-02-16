'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductDetailsModal } from './details-modal'

export function ViewProductButton({ productId }: { productId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" onClick={() => setIsModalOpen(true)}>
                <Eye className="h-4 w-4" />
            </Button>

            <ProductDetailsModal
                productId={productId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
