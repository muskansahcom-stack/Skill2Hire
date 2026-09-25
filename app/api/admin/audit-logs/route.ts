import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const logs = db.getAdminAuditLogs(limit);

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
