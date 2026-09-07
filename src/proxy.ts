// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// সাইডবারের সমস্ত প্রটেক্টেড রুট তালিকা
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
  '/Security',
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tp_auth_token')?.value;

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // রুটটি প্রটেক্টেড তালিকার অন্তর্ভুক্ত কি না যাচাই
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ১. লগইন না থাকলে প্রটেক্টেড পেজ ব্লক -> সরাসরি /login এ রিডাইরেক্ট
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. লগইন থাকা অবস্থায় /login বা /register পেজে ঢুকতে চাইলে -> সরাসরি /overview তে রিডাইরেক্ট
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