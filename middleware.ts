import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-protected URL paths
const PROTECTED_ROUTES = [
  { prefix: '/student', allowedRole: 'student' },
  { prefix: '/college', allowedRole: 'college' },
  { prefix: '/recruiter', allowedRole: 'company' },
  { prefix: '/company', allowedRole: 'company' },
  { prefix: '/admin', allowedRole: 'admin' },
];

/**
 * Lightweight Edge-compatible JWT Payload extraction
 */
function parseEdgeSession(token: string): { role: string; expiresAt: number } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && payload.expiresAt < nowSec) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page without interception
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // Match protected page routes
  const matchedRoute = PROTECTED_ROUTES.find(r => pathname.startsWith(r.prefix));
  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Retrieve session token from cookie or authorization header
  const sessionCookie = request.cookies.get('s2h_session')?.value;
  const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = sessionCookie || authHeader;

  // If unauthenticated or no session token
  if (!token) {
    const targetLogin = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const loginUrl = new URL(targetLogin, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = parseEdgeSession(token);
  if (!session) {
    const targetLogin = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const loginUrl = new URL(targetLogin, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Strict Admin Isolation: Only 'admin' role can access any /admin routes
  if (pathname.startsWith('/admin')) {
    if (session.role !== 'admin') {
      let redirectDashboard = '/student/dashboard';
      if (session.role === 'college') redirectDashboard = '/college/dashboard';
      else if (session.role === 'company') redirectDashboard = '/recruiter/dashboard';

      const safeRedirect = new URL(redirectDashboard, request.url);
      safeRedirect.searchParams.set('denied', 'true');
      return NextResponse.redirect(safeRedirect);
    }
    return NextResponse.next();
  }

  // General Role verification guard for student/college/company routes
  if (session.role !== matchedRoute.allowedRole && session.role !== 'admin') {
    let redirectDashboard = '/student/dashboard';
    if (session.role === 'college') redirectDashboard = '/college/dashboard';
    if (session.role === 'company') redirectDashboard = '/recruiter/dashboard';
    if (session.role === 'admin') redirectDashboard = '/admin/dashboard';

    const safeRedirect = new URL(redirectDashboard, request.url);
    safeRedirect.searchParams.set('denied', 'true');
    return NextResponse.redirect(safeRedirect);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/college/:path*',
    '/recruiter/:path*',
    '/company/:path*',
    '/admin/:path*',
  ]
};
