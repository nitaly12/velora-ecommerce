import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './config'

const envError = new Error(
    'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. Vercel project settings).'
)

export function createClient(): ReturnType<typeof createBrowserClient> {
    try {
        const { url, key } = getSupabaseEnv()
        return createBrowserClient(url, key)
    } catch {
        const thrower = () => {
            throw envError
        }
        return new Proxy({} as ReturnType<typeof createBrowserClient>, {
            get() {
                return thrower
            },
        })
    }
}
