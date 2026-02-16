import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // List of public routes that don't need authentication checks in middleware
    const publicRoutes = [
        '/',
        '/products',
        '/categories',
        '/about',
        '/login',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/faq',
        '/shipping',
        '/returns',
        '/contact',
        '/terms',
        '/privacy',
        '/cookies',
    ]

    const isPublicRoute = publicRoutes.some(path =>
        request.nextUrl.pathname === path ||
        (path !== '/' && request.nextUrl.pathname.startsWith(path))
    )

    // Skip heavy auth check for public routes unless we are explicitly checking for a session
    // We still call updateSession to handle cookie refreshes if a session EXISTS,
    // but we can be smarter about when we FORCE a redirect.

    let user = null
    if (!isPublicRoute || request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/checkout')) {
        const { data } = await supabase.auth.getUser()
        user = data.user
    }

    // Example Protected Admin Route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Check role - this requires database access which might be slow in middleware
        // Ideally, encoded in JWT or just check on the page level/layout level
    }

    if (request.nextUrl.pathname.startsWith('/profile') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/checkout') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
