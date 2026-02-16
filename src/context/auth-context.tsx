'use client'

import { createClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
    user: User | null
    session: Session | null
    profile: { role: string } | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<{ role: string } | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId: string) => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single()
            if (error) {
                console.error('Error fetching profile:', error)
                return
            }
            setProfile(data)
        } catch (err) {
            console.error('Profile fetch unexpected error:', err)
        }
    }

    useEffect(() => {
        const supabase = createClient()

        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false) // Set loading to false as soon as we know the user
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }
        }

        getSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false) // Set loading to false as soon as we know the user
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, session, loading, profile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
