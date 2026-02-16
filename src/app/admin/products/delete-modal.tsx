'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { AlertTriangle } from 'lucide-react'
import { deleteProduct } from './actions'

interface DeleteProductModalProps {
    productId: string
    productName: string
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function DeleteProductModal({ productId, productName, isOpen, onClose, onSuccess }: DeleteProductModalProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        try {
            await deleteProduct(productId)
            onSuccess()
            onClose()
        } catch (e) {
            console.error(e)
            alert('Failed to delete product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" className="max-w-md">
            <div className="space-y-6">
                <div className="flex items-center gap-4 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold">Warning: This action is permanent</p>
                        <p className="text-xs opacity-80">Are you sure you want to delete <span className="font-bold">"{productName}"</span>?</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        loading={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete Product
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
