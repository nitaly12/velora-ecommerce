'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function EditProfilePage() {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ full_name: '', email: '' })
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setForm((f) => ({ ...f, email: user.email ?? '', full_name: user.user_metadata?.full_name ?? '' }))
                supabase.from('profiles').select('full_name').eq('id', user.id).single().then(({ data }) => {
                    if (data?.full_name) setForm((f) => ({ ...f, full_name: data.full_name }))
                })
            }
        })
    }, [])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            setLoading(false)
            return
        }
        const { error } = await supabase.from('profiles').update({ full_name: form.full_name }).eq('id', user.id)
        if (error) alert(error.message)
        else router.push('/profile')
        setLoading(false)
    }

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Edit Profile</h1>
            <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Display name</label>
                    <Input
                        value={form.full_name}
                        onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                        placeholder="Your name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <Input value={form.email} disabled className="bg-slate-50 text-slate-500" />
                    <p className="text-xs text-slate-400">Email cannot be changed here.</p>
                </div>
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href="/profile">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}
