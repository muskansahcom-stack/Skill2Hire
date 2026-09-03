import { NextResponse } from 'next/server';
import { logSecurityEvent, getAuthenticatedSession } from '@/lib/authMiddleware';

export async function POST(request: Request) {
  const session = getAuthenticatedSession(request);
  if (session) {
    logSecurityEvent('USER_LOGOUT', { userId: session.userId, role: session.role });
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.'
  });

  // Clear session cookie
  response.cookies.set('s2h_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });

  return response;
}
