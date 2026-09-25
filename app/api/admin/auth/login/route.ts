import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signSessionToken, logSecurityEvent, isOwnerAdmin } from '@/lib/authMiddleware';

// In-memory rate limiting & brute-force protection
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

function getClientIdentifier(request: Request, email: string): string {
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const realIp = request.headers.get('x-real-ip') || '';
  const clientIp = forwardedFor.split(',')[0].trim() || realIp || '127.0.0.1';
  return `${clientIp}_${email.trim().toLowerCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.', code: 'MISSING_CREDENTIALS' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const rateLimitKey = getClientIdentifier(request, cleanEmail);
    const now = Date.now();

    // 1. Check Brute-Force Rate Limiting & Lockout
    const rateLimit = loginAttempts.get(rateLimitKey);
    if (rateLimit && rateLimit.lockedUntil > now) {
      const remainingMinutes = Math.ceil((rateLimit.lockedUntil - now) / 60000);
      logSecurityEvent('ADMIN_LOGIN_LOCKED_OUT', { email: cleanEmail, remainingMinutes });
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Account temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
          code: 'RATE_LIMITED',
          remainingMinutes
        },
        { status: 429 }
      );
    }

    // 2. Query user from database
    const user = db.findUserByEmail(cleanEmail);

    // 3. Verify user exists and has ADMIN or OWNER_ADMIN role
    if (!user || !isOwnerAdmin(user)) {
      // Record failed attempt
      const attempts = (rateLimit?.attempts || 0) + 1;
      const lockedUntil = attempts >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
      loginAttempts.set(rateLimitKey, { attempts, lockedUntil, lastAttemptAt: now });

      logSecurityEvent('ADMIN_LOGIN_FAILED', { email: cleanEmail, attempts, reason: 'INVALID_USER_OR_NOT_ADMIN' });
      db.recordAdminAuditLog({
        adminId: user ? user.id : 'unknown',
        adminEmail: cleanEmail,
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'security',
        targetDetails: `Failed login attempt for ${cleanEmail} (Attempts: ${attempts}/${MAX_ATTEMPTS})`,
        result: 'FAILURE'
      });

      return NextResponse.json(
        { error: 'Invalid credentials.', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 4. Constant-Time Password Verification (Zero Backdoors)
    const isPasswordValid = db.verifyAdminPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const attempts = (rateLimit?.attempts || 0) + 1;
      const lockedUntil = attempts >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
      loginAttempts.set(rateLimitKey, { attempts, lockedUntil, lastAttemptAt: now });

      logSecurityEvent('ADMIN_LOGIN_FAILED', { email: cleanEmail, attempts, reason: 'INVALID_PASSWORD' });
      db.recordAdminAuditLog({
        adminId: user.id,
        adminEmail: user.email,
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'security',
        targetDetails: `Invalid password attempt for admin ${user.email} (Attempts: ${attempts}/${MAX_ATTEMPTS})`,
        result: 'FAILURE'
      });

      return NextResponse.json(
        { error: 'Invalid credentials.', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 5. Successful Admin Authentication -> Reset Rate Limit
    loginAttempts.delete(rateLimitKey);

    // Issue cryptographic JWT session token (24h validity)
    const sessionToken = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isOwner: user.isOwner || user.role === 'owner_admin',
      verified: true
    }, 86400);

    // Record persistent audit log
    db.recordAdminAuditLog({
      adminId: user.id,
      adminEmail: user.email,
      action: 'ADMIN_LOGIN',
      targetType: 'security',
      targetDetails: `Admin ${user.email} authenticated successfully`,
      result: 'SUCCESS'
    });

    logSecurityEvent('ADMIN_LOGIN_SUCCESS', { userId: user.id, email: user.email });

    // Sanitized user profile (never expose passwordHash)
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    const response = NextResponse.json({
      success: true,
      user: sanitizedUser,
      token: sessionToken,
      message: 'Admin authenticated successfully.'
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
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
