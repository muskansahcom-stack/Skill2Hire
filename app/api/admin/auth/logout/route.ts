import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedSession, logSecurityEvent } from '@/lib/authMiddleware';

export async function POST(request: Request) {
  try {
    const session = getAuthenticatedSession(request);

    if (session && session.role === 'admin') {
      logSecurityEvent('ADMIN_LOGOUT', { userId: session.userId, email: session.email });
      try {
        db.recordAdminAuditLog({
          adminId: session.userId,
          adminEmail: session.email,
          action: 'ADMIN_LOGOUT',
          targetType: 'security',
          targetDetails: `Admin ${session.email} logged out and session was invalidated`,
          result: 'SUCCESS'
        });
      } catch (e) {
        // Ignore DB log error during edge execution
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin session invalidated successfully.'
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
  } catch (error: any) {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
