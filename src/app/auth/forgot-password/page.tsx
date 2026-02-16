'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/reset-password`,
        })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Check your email for the password reset link.')
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <Link href="/">
                        <Logo className="justify-center mb-6" />
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Forgot password?
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    <div className="space-y-4">
                        <div>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="w-full"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? 'Sending...' : 'Reset Password'}
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            &larr; Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
