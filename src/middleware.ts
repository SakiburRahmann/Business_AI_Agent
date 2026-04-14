import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

/**
 * OmniiChat 1.0 - Local Auth Middleware
 * Verified zero-dependency session management to eliminate 504 Gateway Timeouts.
 */
export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    
    let user = null;
    if (session) {
        try {
            const decoded = await decrypt(session);
            user = decoded?.user;
        } catch (err) {
            // Invalid session
        }
    }

    const isChatRoute = request.nextUrl.pathname.startsWith('/chat');
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

    // Protect /chat
    if (isChatRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect away from login/signup if authenticated
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/chat', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
