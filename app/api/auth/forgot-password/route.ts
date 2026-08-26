import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmailOtp, sendSmsOtp } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json({ error: 'Email address or Phone number is required.' }, { status: 400 });
    }

    const user = db.findUserByEmailOrPhone(identifier.trim());
    if (!user) {
      return NextResponse.json({ error: 'No account registered with this email or phone number.' }, { status: 404 });
    }

    const isEmail = identifier.includes('@');
    const channelType = isEmail ? 'email' : 'phone';

    const otpSession = db.generateOtp(identifier.trim(), channelType, 'forgot_password');

    // Real-Time Delivery
    if (channelType === 'email') {
      await sendEmailOtp({
        to: user.email,
        otp: otpSession.otpCodeForDispatcher,
        recipientName: user.name,
        purpose: 'forgot_password'
      });
    } else {
      await sendSmsOtp({
        phone: user.phone || identifier.trim(),
        otp: otpSession.otpCodeForDispatcher,
        purpose: 'forgot_password'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Password reset verification code sent to ${otpSession.maskedIdentifier}`,
      maskedIdentifier: otpSession.maskedIdentifier,
      resendAvailableAt: otpSession.resendAvailableAt,
      expiresAt: otpSession.expiresAt
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send reset code.' }, { status: 400 });
  }
}
