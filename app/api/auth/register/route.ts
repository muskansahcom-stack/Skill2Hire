import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signSessionToken, logSecurityEvent } from '@/lib/authMiddleware';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, password, email, phone, name, isGoogleAuth } = body;

    if (!role || !email) {
      return NextResponse.json({ error: 'Role and verified Email are required.' }, { status: 400 });
    }

    if (!isGoogleAuth && (!password || password.length < 6)) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check duplicate account
    const existing = db.findUserByEmail(email.trim().toLowerCase());
    if (existing && existing.email_verified && existing.verification_status === 'VERIFIED') {
      return NextResponse.json({ error: 'An account with this email is already registered. Please login.' }, { status: 409 });
    }

    let result: any;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || '+91 98765 00000';
    const pwd = password || 'google_oauth_verified';

    if (role === 'student') {
      result = db.registerStudentAccount({
        name: name || body.fullName || 'Student Candidate',
        email: cleanEmail,
        phone: cleanPhone,
        password: pwd,
        collegeName: body.collegeName || body.college || 'Apex University of Engineering',
        department: body.department || body.course || 'Computer Science & Engineering',
        graduationYear: parseInt(body.graduationYear, 10) || 2026
      });

      // Update student profile with extended registration details
      if (result.student) {
        if (body.skills && Array.isArray(body.skills)) {
          body.skills.forEach((skName: string) => {
            db.addOrUpdateStudentSkill({
              id: `ss_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              studentId: result.student.id,
              skillId: `sk_${skName.toLowerCase().replace(/\s+/g, '_')}`,
              skillName: skName,
              category: 'Programming',
              status: 'Self-Declared',
              level: 'Intermediate'
            });
          });
        }
        if (body.careerGoal) {
          result.student.careerGoal = body.careerGoal;
        }
        if (body.resumeUrl) {
          result.student.resumeUrl = body.resumeUrl;
        }
      }
    } else if (role === 'college') {
      result = db.registerCollegeAccount({
        name: name || body.collegeName || 'Institution Partner',
        email: cleanEmail,
        phone: cleanPhone,
        password: pwd,
        website: body.website || 'https://university.edu',
        address: body.address || 'Academic City Campus',
        contactPerson: body.contactPerson || name || 'Dean of Placements'
      });
    } else if (role === 'company') {
      result = db.registerCompanyAccount({
        name: name || body.companyName || 'Enterprise Partner',
        email: cleanEmail,
        phone: cleanPhone,
        password: pwd,
        website: body.website || 'https://company.tech',
        industry: body.industry || 'Technology & Cloud Systems',
        recruiterName: body.recruiterName || name || 'Talent Lead'
      });
    } else {
      return NextResponse.json({ error: 'Invalid user role requested.' }, { status: 400 });
    }

    // Set initial verification status
    result.user.email_verified = false;

    // Issue cryptographic JWT session token
    const studentId = (result as any).student?.id;
    const collegeId = (result as any).college?.id;
    const companyId = (result as any).company?.id;

    const token = signSessionToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      verified: false,
      studentId,
      collegeId,
      companyId
    });

    logSecurityEvent('USER_REGISTERED_PENDING_OTP', { userId: result.user.id, role, email: cleanEmail });

    const response = NextResponse.json({
      success: true,
      requireOtp: true,
      message: `Account created for ${result.user.name}. Please enter the 6-digit verification code sent to ${cleanEmail}.`,
      user: result.user,
      profile: (result as any).student || (result as any).college || (result as any).company,
      token
    });

    // Set temporary session cookie
    response.cookies.set('s2h_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 400 });
  }
}
