'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/logo'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setMessage(null)
        setError(null)

        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Password updated successfully! Redirecting to login...')
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Logo className="justify-center mb-6" />
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Set new password
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Please enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
                    <div className="space-y-4">
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="w-full"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm text-center text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
