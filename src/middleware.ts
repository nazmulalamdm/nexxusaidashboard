import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // পাবলিক রুটগুলো (যেগুলোতে লগইন ছাড়াই ঢোকা যাবে)
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/') ||
    pathname.includes('_next') ||
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // ইউজার অথেন্টিকেশন কুকি বা টোকেন চেক
  const token = request.cookies.get('tp_auth_token')?.value;

  // যদি টোকেন না থাকে এবং ড্যাশবোর্ডে ঢুকতে চায়, তবে লগইনে পাঠিয়ে দেওয়া হবে
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};