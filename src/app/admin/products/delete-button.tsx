'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { DeleteProductModal } from './delete-modal'

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => setIsModalOpen(true)}
            >
                <Trash className="h-4 w-4" />
            </Button>

            <DeleteProductModal
                productId={productId}
                productName={productName}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    router.refresh()
                }}
            />
        </>
    )
}
