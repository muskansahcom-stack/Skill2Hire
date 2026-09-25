import { NextResponse } from 'next/server';
import { requireAdmin, logSecurityEvent } from '@/lib/authMiddleware';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  // Check if caller is authenticated admin
  const adminCheck = requireAdmin(request);

  if (!adminCheck.authorized) {
    logSecurityEvent('UNAUTHORIZED_ROLE_CHANGE_ATTEMPT', {
      url: request.url,
      method: request.method
    });

    return NextResponse.json(
      {
        error: 'Forbidden: Self-service role modification is prohibited. Only system administrators can assign or modify user roles.',
        code: 'FORBIDDEN_ROLE_ESCALATION'
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { targetUserId, role } = body;

    if (!targetUserId || !role) {
      return NextResponse.json({ error: 'targetUserId and role are required.' }, { status: 400 });
    }

    const result = db.updateUserRole(adminCheck.session!.userId, targetUserId, role);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully by administrator.',
      user: result.user
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
