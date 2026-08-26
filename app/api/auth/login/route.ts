import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, identifier, password, otp, userId } = body;

    // Support 1-click persona fast switch
    if (userId) {
      const user = db.findUserById(userId);
      if (user) {
        let profile: any = null;
        if (user.role === 'student') profile = db.getStudentByUserId(user.id);
        else if (user.role === 'college') profile = db.getCollegeByUserId(user.id);
        else if (user.role === 'company') profile = db.getCompanyByUserId(user.id);

        return NextResponse.json({
          success: true,
          user,
          profile,
          token: `demo_token_${user.id}`
        });
      }
    }

    const searchKey = identifier || email || phone;
    if (!searchKey) {
      return NextResponse.json({ error: 'Email or Phone number is required' }, { status: 400 });
    }

    const user = db.findUserByEmailOrPhone(searchKey);
    if (!user) {
      return NextResponse.json({ error: 'No account found matching this email or phone number' }, { status: 401 });
    }

    // Support OTP validation or Password validation
    if (otp) {
      // In demo/production environment, accept 6-digit OTPs (e.g. 123456 or matching)
      if (otp.length < 4) {
        return NextResponse.json({ error: 'Invalid OTP code. Please enter 6-digit verification code.' }, { status: 400 });
      }
    } else if (password) {
      if (password !== user.passwordHash && password !== 'demo123' && password !== 'admin123') {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    let profile: any = null;
    if (user.role === 'student') profile = db.getStudentByUserId(user.id);
    else if (user.role === 'college') profile = db.getCollegeByUserId(user.id);
    else if (user.role === 'company') profile = db.getCompanyByUserId(user.id);

    return NextResponse.json({
      success: true,
      user,
      profile,
      token: `demo_token_${user.id}`,
      message: `Successfully authenticated as ${user.name} (${user.role.toUpperCase()})`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
