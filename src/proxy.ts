import { profileShow } from '@/service/api/auth';
import { NextRequest, NextResponse, ProxyConfig } from 'next/server';

export async function proxy(request: NextRequest) {
    const testPaths = ['/', '/sign-in', '/sign-up'];
    const redirectUser = testPaths.includes(request.nextUrl.pathname);
    const redirectGuest = !testPaths.includes(request.nextUrl.pathname);
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const newRedirectTo = encodeURIComponent(request.nextUrl.pathname);

    try {
        const user = await profileShow();

        if (redirectUser && user) {
            return NextResponse.redirect(new URL(redirectTo ?? '/rooms', request.url));
        }

        if (redirectGuest && !user) {
            return NextResponse.redirect(
                new URL(`/sign-in?redirectTo=${newRedirectTo}`, request.url),
            );
        }
    } catch (error: any) {
        console.error(error);
    }
}

export const config: ProxyConfig = {
    matcher: '/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
};
