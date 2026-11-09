import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, readSessionToken } from '@/lib/auth/session-token';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};