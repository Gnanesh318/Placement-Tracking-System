import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isStudentRoute = request.nextUrl.pathname.startsWith('/student')
    const isSetupPage = request.nextUrl.pathname === '/student/setup'

    // Redirect to login if not authenticated
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if already authenticated and on auth page
    if (token && isAuthPage) {
        const dashboardUrl = token.role === 'ADMIN' ? '/admin' : '/student'
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }

    // Enforce profile completion for students
    if (
        token &&
        token.role === 'STUDENT' &&
        !token.profileCompleted &&
        !isSetupPage &&
        !isAuthPage
    ) {
        return NextResponse.redirect(new URL('/student/setup', request.url))
    }

    // Prevent accessing setup page if profile already completed
    if (
        token &&
        token.role === 'STUDENT' &&
        token.profileCompleted &&
        isSetupPage
    ) {
        return NextResponse.redirect(new URL('/student', request.url))
    }

    // Role-based route protection
    if (token) {
        if (isAdminRoute && token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/student', request.url))
        }
        if (isStudentRoute && token.role !== 'STUDENT') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/student/:path*',
        '/login',
        '/register',
    ],
}
