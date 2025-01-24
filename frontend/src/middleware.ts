import { APIURL } from '@/lib/utils';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function authenticate(token: string): Promise<boolean> {
    const response = await fetch(APIURL('users/auth'), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'POST',
    });

    return response.ok;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value ?? '';

    const isPublicRoute = ['/', '/signup'].includes(request.nextUrl.pathname);

    if (isPublicRoute) {
        if (token && (await authenticate(token))) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
        return NextResponse.next();
    }

    if (!token || !(await authenticate(token))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
