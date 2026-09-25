import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  const { adminUser } = adminCheck;
  return NextResponse.json({
    success: true,
    user: {
      id: adminUser?.id,
      email: adminUser?.email,
      name: adminUser?.name,
      role: adminUser?.role,
      avatar: adminUser?.avatar,
      createdAt: adminUser?.createdAt
    }
  });
}
