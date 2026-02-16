'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreateProductModal } from './create-modal'
import { useRouter } from 'next/navigation'

export function CreateProductButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Product
            </Button>

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    router.refresh()
                }}
            />
        </>
    )
}
