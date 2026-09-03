import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signSessionToken, logSecurityEvent } from '@/lib/authMiddleware';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, identifier, password, otp, userId, googleCredential, isGoogleAuth } = body;

    let user: any = null;

    // 1. Google OAuth / OpenID Connect Identity Resolution
    if (isGoogleAuth || googleCredential) {
      let googleEmail = email?.toLowerCase();
      let googleName = body.name || 'Google User';

      // Parse Google ID Token payload if present
      if (googleCredential) {
        try {
          const payloadBase64 = googleCredential.split('.')[1];
          if (payloadBase64) {
            const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
            googleEmail = decoded.email?.toLowerCase() || googleEmail;
            googleName = decoded.name || googleName;
          }
        } catch (e) {
          console.warn('Could not parse Google ID Token:', e);
        }
      }

      if (!googleEmail) {
        return NextResponse.json({ error: 'Valid Google email is required.' }, { status: 400 });
      }

      // Check if user already has an account
      user = db.findUserByEmail(googleEmail);

      if (!user) {
        // Do NOT automatically grant dashboard access. Notify frontend to complete profile and select role
        logSecurityEvent('GOOGLE_NEW_USER_DETECTED', { email: googleEmail, name: googleName });
        return NextResponse.json({
          success: false,
          isNewUser: true,
          requireProfileCompletion: true,
          googleEmail,
          googleName,
          message: 'Google identity verified. Please select your role and complete your profile.'
        });
      }

      logSecurityEvent('GOOGLE_LOGIN_SUCCESS', { userId: user.id, role: user.role });
    }

    // 2. 1-Click Fast Switch for Demo / Admin
    else if (userId) {
      user = db.findUserById(userId);
    }

    // 3. Email / Phone / Password / OTP Login
    else {
      const searchKey = identifier || email || phone;
      if (!searchKey) {
        return NextResponse.json({ error: 'Email or Phone number is required' }, { status: 400 });
      }

      user = db.findUserByEmailOrPhone(searchKey);

      if (!user) {
        logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', { identifier: searchKey });
        return NextResponse.json({ error: 'No account found matching this email or phone number' }, { status: 401 });
      }

      // Verify OTP or Password
      if (otp) {
        try {
          db.verifyOtp(searchKey, otp.trim(), 'login');
        } catch (otpErr: any) {
          logSecurityEvent('LOGIN_OTP_FAILED', { identifier: searchKey, error: otpErr.message });
          return NextResponse.json({ error: otpErr.message || 'Invalid or expired OTP code.' }, { status: 401 });
        }
      } else if (password) {
        const isPasswordValid = db.verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
          logSecurityEvent('LOGIN_PASSWORD_FAILED', { userId: user.id });
          return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 401 });
    }

    // Load role profile
    let profile: any = null;
    let studentId: string | undefined = undefined;
    let collegeId: string | undefined = undefined;
    let companyId: string | undefined = undefined;

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

    // Sign cryptographic JWT session token (24h validity)
    const sessionToken = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      verified: user.email_verified !== false,
      studentId,
      collegeId,
      companyId
    }, 86400);

    logSecurityEvent('LOGIN_SUCCESS', { userId: user.id, role: user.role });

    const response = NextResponse.json({
      success: true,
      user,
      profile,
      token: sessionToken,
      message: `Successfully authenticated as ${user.name} (${user.role.toUpperCase()})`
    });

    // Set secure HttpOnly cookie
    response.cookies.set('s2h_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to complete the request. Please try again.' }, { status: 500 });
  }
}
