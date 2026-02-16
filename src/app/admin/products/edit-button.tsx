'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UpdateProductModal } from './update-modal'
import { useRouter } from 'next/navigation'

export function EditProductButton({ productId }: { productId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
                <Pencil className="h-4 w-4" />
            </Button>

            <UpdateProductModal
                productId={productId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    router.refresh()
                }}
            />
        </>
    )
}
