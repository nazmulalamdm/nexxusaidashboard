// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/overview',
  '/playground',
  '/prompts',
  '/keys',
  '/clients',
  '/orders',
  '/transactions',
  '/token-calculator',
  '/payments',
  '/settings',
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tp_auth_token')?.value;

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ১. লগইন টোকেন না থাকলে সোজা /login এ রিডাইরেক্ট
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. লগইন থাকা অবস্থায় /login বা /register এ যাওয়া ব্লক
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};