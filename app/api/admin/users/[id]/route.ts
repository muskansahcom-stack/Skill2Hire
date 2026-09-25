import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/authMiddleware';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const targetUserId = params.id;
    const result = db.deleteUser(adminCheck.session!.userId, targetUserId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'User account and associated records deleted successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
