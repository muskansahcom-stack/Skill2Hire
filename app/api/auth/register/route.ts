import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, password, email, phone, name } = body;

    if (!role || !password || !email) {
      return NextResponse.json({ error: 'Role, Email, and Password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    let result;

    if (role === 'student') {
      result = db.registerStudentAccount({
        name: name || body.fullName || 'Student Candidate',
        email,
        phone: phone || '+91 98765 00000',
        password,
        collegeName: body.collegeName || body.college,
        department: body.department || body.course,
        graduationYear: parseInt(body.graduationYear, 10) || 2026
      });
    } else if (role === 'college') {
      result = db.registerCollegeAccount({
        name: name || body.collegeName || 'Institution Partner',
        email,
        phone: phone || '+91 98765 00001',
        password,
        website: body.website,
        address: body.address,
        contactPerson: body.contactPerson
      });
    } else if (role === 'company') {
      result = db.registerCompanyAccount({
        name: name || body.companyName || 'Enterprise Partner',
        email,
        phone: phone || '+91 98765 00002',
        password,
        website: body.website,
        industry: body.industry,
        recruiterName: body.recruiterName
      });
    } else {
      return NextResponse.json({ error: 'Invalid user role requested.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created verified ${role.toUpperCase()} account for ${result.user.name}`,
      user: result.user,
      profile: (result as any).student || (result as any).college || (result as any).company,
      token: `auth_token_${result.user.id}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 400 });
  }
}
