import { getProfile } from '@/service/requests';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
    const user = await getProfile();

    const shouldRedirectUrls = ['/sign-in', '/sign-up'];
    const shouldRedirect = shouldRedirectUrls.includes(request.url);
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');

    if (shouldRedirect && user) {
        return NextResponse.redirect(new URL(redirectTo ?? '/rooms', request.url));
    }
}
