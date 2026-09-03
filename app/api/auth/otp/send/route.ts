import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmailOtp, sendSmsOtp } from '@/lib/otpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, type, purpose = 'registration', name = 'Skill2Hire User' } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Valid email address or phone number is required.' }, { status: 400 });
    }

    const channelType: 'email' | 'phone' = type || (identifier.includes('@') ? 'email' : 'phone');

    // 1. Duplicate Account Prevention for Registration
    if (purpose === 'registration') {
      if (channelType === 'email') {
        const existing = db.findUserByEmail(identifier.trim());
        if (existing && existing.email_verified && existing.verification_status === 'VERIFIED') {
          return NextResponse.json(
            { error: 'This email is already registered and verified. Please login instead.' },
            { status: 409 }
          );
        }
      } else {
        const existing = db.findUserByPhone(identifier.trim());
        if (existing && existing.phone_verified && existing.verification_status === 'VERIFIED') {
          return NextResponse.json(
            { error: 'This phone number is already registered and verified. Please login instead.' },
            { status: 409 }
          );
        }
      }
    }

    // 2. Generate Brand New Secure 6-Digit OTP (Old OTP is purged)
    const otpSession = db.generateOtp(identifier.trim(), channelType, purpose);

    // 3. Dispatch via Real Transactional Email or SMS Provider
    let dispatchResult;
    try {
      if (channelType === 'email') {
        dispatchResult = await sendEmailOtp({
          to: identifier.trim().toLowerCase(),
          otp: otpSession.otpCodeForDispatcher,
          recipientName: name,
          purpose
        });
      } else {
        dispatchResult = await sendSmsOtp({
          phone: identifier.trim(),
          otp: otpSession.otpCodeForDispatcher,
          purpose
        });
      }
    } catch (dispatchErr: any) {
      return NextResponse.json(
        { 
          error: dispatchErr.message || 'Failed to dispatch verification code to provider. Please check provider configuration in .env.'
        }, 
        { status: 502 }
      );
    }

    // 4. Return Clean Success Response (NEVER EXPOSE OTP IN RESPONSE)
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${otpSession.maskedIdentifier}`,
      maskedIdentifier: otpSession.maskedIdentifier,
      resendAvailableAt: otpSession.resendAvailableAt,
      expiresAt: otpSession.expiresAt,
      provider: dispatchResult.provider
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate verification request.' }, { status: 400 });
  }
}
