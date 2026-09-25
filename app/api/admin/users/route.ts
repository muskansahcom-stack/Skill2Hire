import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/authMiddleware';
import { UserRole } from '@/lib/types';

export async function GET(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const searchQuery = searchParams.get('q')?.toLowerCase() || '';

    let users = db.getUsers().map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      phone: u.phone,
      account_status: u.account_status || 'ACTIVE',
      verification_status: u.verification_status || 'VERIFIED',
      email_verified: u.email_verified,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    if (roleFilter && roleFilter !== 'all') {
      users = users.filter(u => u.role.toLowerCase() === roleFilter.toLowerCase());
    }

    if (searchQuery) {
      users = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery) ||
        u.name.toLowerCase().includes(searchQuery) ||
        (u.phone && u.phone.includes(searchQuery))
      );
    }

    return NextResponse.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminCheck = requireAdmin(request);
  if (!adminCheck.authorized) {
    return adminCheck.errorResponse!;
  }

  try {
    const body = await request.json();
    const { targetUserId, newRole } = body;

    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { error: 'targetUserId and newRole are required.', code: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['student', 'college', 'company', 'admin', 'owner_admin'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role specified. Must be student, college, company, admin, or owner_admin.', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    const targetUser = db.findUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found.' }, { status: 404 });
    }

    // STRICT OWNER IMMUTABILITY
    if (targetUser.role === 'owner_admin' || targetUser.isOwner || targetUser.id === 'u_admin') {
      return NextResponse.json(
        { error: 'Forbidden: The OWNER_ADMIN account cannot be demoted, modified, or altered.', code: 'FORBIDDEN_OWNER_IMMUTABLE' },
        { status: 403 }
      );
    }

    const result = db.updateUserRole(adminCheck.session!.userId, targetUserId, newRole);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole.toUpperCase()} successfully.`,
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        role: result.user?.role
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
