import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from './db';
import { User, UserRole } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'skill2hire-super-jwt-secret-key-2026-production';
const SESSION_COOKIE_NAME = 's2h_session';

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  verified: boolean;
  studentId?: string;
  collegeId?: string;
  companyId?: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Base64URL encoding/decoding helper
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Create a cryptographically signed HMAC-SHA256 session token
 */
export function signSessionToken(payload: Omit<AuthSession, 'issuedAt' | 'expiresAt'>, expiresInSeconds: number = 86400): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresInSeconds;
  const sessionData: AuthSession = {
    ...payload,
    issuedAt,
    expiresAt
  };

  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(JSON.stringify(sessionData));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Cryptographically verify and decode a session token
 */
export function verifySessionToken(token: string): AuthSession | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AuthSession = JSON.parse(base64UrlDecode(encodedPayload));
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Check expiration
    if (payload.expiresAt < currentTimestamp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract authenticated session from incoming NextRequest (Cookie or Bearer Header)
 */
export function getAuthenticatedSession(request: Request | NextRequest): AuthSession | null {
  // 1. Check HttpOnly Cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const sessionCookie = cookies[SESSION_COOKIE_NAME];
  if (sessionCookie) {
    const verified = verifySessionToken(sessionCookie);
    if (verified) return verified;
  }

  // 2. Check Authorization Header (Bearer token)
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    
    // Support demo session tokens
    if (bearerToken.startsWith('demo_token_') || bearerToken.startsWith('auth_token_')) {
      const userId = bearerToken.replace('demo_token_', '').replace('auth_token_', '');
      const user = db.findUserById(userId);
      if (user) {
        let student = user.role === 'student' ? db.getStudentByUserId(user.id) : null;
        let college = user.role === 'college' ? db.getCollegeByUserId(user.id) : null;
        let company = user.role === 'company' ? db.getCompanyByUserId(user.id) : null;

        return {
          userId: user.id,
          email: user.email,
          role: user.role,
          verified: user.email_verified !== false,
          studentId: student?.id,
          collegeId: college?.id,
          companyId: company?.id,
          issuedAt: Math.floor(Date.now() / 1000),
          expiresAt: Math.floor(Date.now() / 1000) + 86400
        };
      }
    }

    const verified = verifySessionToken(bearerToken);
    if (verified) return verified;
  }

  // 3. Fallback header for demo fast simulation / tests (x-user-id)
  const simulatedUserId = request.headers.get('x-user-id');
  if (simulatedUserId) {
    const user = db.findUserById(simulatedUserId);
    if (user) {
      let student = user.role === 'student' ? db.getStudentByUserId(user.id) : null;
      let college = user.role === 'college' ? db.getCollegeByUserId(user.id) : null;
      let company = user.role === 'company' ? db.getCompanyByUserId(user.id) : null;

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        verified: true,
        studentId: student?.id,
        collegeId: college?.id,
        companyId: company?.id,
        issuedAt: Math.floor(Date.now() / 1000),
        expiresAt: Math.floor(Date.now() / 1000) + 86400
      };
    }
  }

  return null;
}

/**
 * Server-Side Role Enforcement Guard
 */
export function authorizeRole(session: AuthSession | null, allowedRoles: UserRole[]): { authorized: boolean; errorResponse?: NextResponse } {
  if (!session) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Authentication required. Please login.', code: 'UNAUTHENTICATED' },
        { status: 401 }
      )
    };
  }

  if (!session.verified) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Account verification required. Please complete email OTP verification.', code: 'UNVERIFIED' },
        { status: 403 }
      )
    };
  }

  if (!allowedRoles.includes(session.role) && session.role !== 'admin') {
    // Log unauthorized attempt
    logSecurityEvent('UNAUTHORIZED_ROLE_ACCESS', {
      userId: session.userId,
      attemptedRole: session.role,
      allowedRoles
    });

    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Access denied. You do not have permission to access this resource.', code: 'FORBIDDEN' },
        { status: 403 }
      )
    };
  }

  return { authorized: true };
}

/**
 * Server-Side Ownership Guard (Verifies caller owns the student / college / company record)
 */
export function authorizeOwnership(
  session: AuthSession | null,
  targetResourceId: string,
  resourceType: 'student' | 'college' | 'company'
): { authorized: boolean; errorResponse?: NextResponse } {
  if (!session) {
    return {
      authorized: false,
      errorResponse: NextResponse.json({ error: 'Authentication required', code: 'UNAUTHENTICATED' }, { status: 401 })
    };
  }

  // Admin bypass
  if (session.role === 'admin') return { authorized: true };

  let isOwner = false;

  if (resourceType === 'student') {
    // Match by studentId, userId, or email
    const student = db.getStudentById(targetResourceId) || db.getStudentByUserId(targetResourceId);
    if (student) {
      isOwner = student.userId === session.userId || student.id === session.studentId;
    } else {
      isOwner = targetResourceId === session.userId || targetResourceId === session.studentId;
    }

    // College can view their own enrolled students
    if (!isOwner && session.role === 'college' && session.collegeId) {
      if (student && student.collegeId === session.collegeId) {
        isOwner = true;
      }
    }
  } else if (resourceType === 'college') {
    const college = db.getCollegeById(targetResourceId);
    isOwner = college ? college.userId === session.userId || college.id === session.collegeId : targetResourceId === session.collegeId;
  } else if (resourceType === 'company') {
    const company = db.getCompanyById(targetResourceId);
    isOwner = company ? company.userId === session.userId || company.id === session.companyId : targetResourceId === session.companyId;
  }

  if (!isOwner) {
    logSecurityEvent('RESOURCE_OWNERSHIP_VIOLATION', {
      userId: session.userId,
      userRole: session.role,
      targetResourceId,
      resourceType
    });

    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Access denied. You cannot view or modify another entity\'s private records.', code: 'FORBIDDEN_OWNERSHIP' },
        { status: 403 }
      )
    };
  }

  return { authorized: true };
}

/**
 * Security Event Audit Logger (Safe logging without exposing passwords or plaintext OTPs)
 */
export function logSecurityEvent(eventType: string, metadata: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const safeLog: Record<string, any> = {
    timestamp,
    eventType,
    ...metadata
  };

  // Strip any accidental sensitive credentials
  delete safeLog.password;
  delete safeLog.otp;
  delete safeLog.code;
  delete safeLog.token;

  console.log(`🛡️ [SECURITY AUDIT] ${timestamp} | EVENT: ${eventType}`, JSON.stringify(safeLog));
}
