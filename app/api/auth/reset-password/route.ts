import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, code, newPassword, confirmPassword } = body;

    if (!identifier || !code || !newPassword) {
      return NextResponse.json({ error: 'Identifier, verification code, and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    const user = db.findUserByEmailOrPhone(identifier.trim());
    if (user && (user.role === 'admin' || user.role === 'owner_admin' || user.isOwner)) {
      return NextResponse.json(
        { error: 'Forbidden: Administrative credentials cannot be reset via public OTP. Please use secure CLI provisioning.', code: 'FORBIDDEN_ADMIN_RESET' },
        { status: 403 }
      );
    }

    // Verify OTP first
    db.verifyOtp(identifier, code, 'forgot_password');

    // Reset password
    const updatedUser = db.resetUserPassword(identifier, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new credentials.',
      user: updatedUser
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Password reset failed.' }, { status: 400 });
  }
}
