/**
 * Supabase env config. Throws a clear error if not set (e.g. copy .env.example to .env.local).
 */
export function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !url.startsWith('http')) {
        throw new Error(
            'Missing or invalid NEXT_PUBLIC_SUPABASE_URL. ' +
                'Copy .env.example to .env.local and set your Supabase project URL from Settings → API.'
        )
    }
    if (!key || key === 'your-anon-key') {
        throw new Error(
            'Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
                'Copy .env.example to .env.local and set your Supabase anon key from Settings → API.'
        )
    }

    return { url, key }
}
