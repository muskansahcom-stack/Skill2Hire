import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, code, purpose = 'registration' } = body;

    if (!identifier || !code) {
      return NextResponse.json({ error: 'Identifier and 6-digit verification code are required.' }, { status: 400 });
    }

    const result = db.verifyOtp(identifier, code.trim(), purpose);

    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'OTP verification failed.' }, { status: 400 });
  }
}
