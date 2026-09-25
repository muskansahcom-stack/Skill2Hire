import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const settings = db.getPlatformSettings();
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const body = await request.json();
    const updated = db.updatePlatformSettings(body, adminCheck.session?.email);

    // Record audit event
    db.recordAdminAuditLog({
      adminId: adminCheck.session!.userId,
      adminEmail: adminCheck.session!.email,
      action: 'SETTINGS_UPDATE',
      targetType: 'platform_settings',
      targetDetails: `Platform configuration updated by ${adminCheck.session!.email}`,
      result: 'SUCCESS'
    });

    return NextResponse.json({
      success: true,
      message: 'Platform settings updated successfully.',
      settings: updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
