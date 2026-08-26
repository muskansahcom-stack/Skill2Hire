import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, newIdentifier, code, type } = body;

    if (!userId || !newIdentifier || !code) {
      return NextResponse.json({ error: 'User ID, new email/phone, and verification code are required.' }, { status: 400 });
    }

    const channelType = type || (newIdentifier.includes('@') ? 'email' : 'phone');

    // 1. Verify OTP on the new contact identity
    db.verifyOtp(newIdentifier, code, 'contact_update');

    // 2. Update contact on user record
    const updatedUser = db.updateUserContact(userId, newIdentifier, channelType);

    return NextResponse.json({
      success: true,
      message: `Successfully verified and updated ${channelType} to ${newIdentifier}`,
      user: updatedUser
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update contact info.' }, { status: 400 });
  }
}
