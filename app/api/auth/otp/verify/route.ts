import { NextResponse } from 'next/server';
import { db, getDb, saveDb } from '@/lib/db';
import { signSessionToken, logSecurityEvent } from '@/lib/authMiddleware';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, code, purpose = 'registration' } = body;

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Identifier and 6-digit verification code are required.' }, { status: 400 });
    }

    // 1. Cryptographically verify OTP hash
    const result = db.verifyOtp(identifier.trim().toLowerCase(), code.trim(), purpose);

    // 2. Locate user and PERSIST verified state to database
    const dbData = getDb();
    const userIndex = dbData.users.findIndex(
      u => u.email?.toLowerCase() === identifier.trim().toLowerCase() ||
           u.phone === identifier.trim()
    );

    if (userIndex !== -1) {
      dbData.users[userIndex].email_verified = true;
      dbData.users[userIndex].account_status = 'ACTIVE';
      dbData.users[userIndex].verification_status = 'VERIFIED';
      saveDb(dbData); // Persist to disk
    }

    const user = userIndex !== -1 ? dbData.users[userIndex] : null;

    logSecurityEvent('OTP_VERIFIED_SUCCESS', {
      identifier: identifier.trim().toLowerCase(),
      purpose,
      userId: user?.id,
      role: user?.role
    });

    let profile: any = null;
    let studentId: string | undefined = undefined;
    let collegeId: string | undefined = undefined;
    let companyId: string | undefined = undefined;

    if (user) {
      if (user.role === 'student') {
        profile = db.getStudentByUserId(user.id);
        studentId = profile?.id;
      } else if (user.role === 'college') {
        profile = db.getCollegeByUserId(user.id);
        collegeId = profile?.id;
      } else if (user.role === 'company') {
        profile = db.getCompanyByUserId(user.id);
        companyId = profile?.id;
      }
    }

    // 3. Issue full-access verified JWT token
    const token = user
      ? signSessionToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          verified: true,
          studentId,
          collegeId,
          companyId
        })
      : undefined;

    const response = NextResponse.json({
      success: true,
      message: 'Account successfully verified! Opening dashboard...',
      user,
      profile,
      token
    });

    if (token) {
      response.cookies.set('s2h_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
        path: '/'
      });
    }

    return response;
  } catch (error: any) {
    logSecurityEvent('OTP_VERIFICATION_FAILED', { error: error.message });
    return NextResponse.json({ error: error.message || 'OTP verification failed. Please check the 6-digit code.' }, { status: 400 });
  }
}
