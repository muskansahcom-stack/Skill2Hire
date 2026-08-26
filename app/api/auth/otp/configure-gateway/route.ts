import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendSmsOtp } from '@/lib/otpService';

export async function GET() {
  return NextResponse.json({
    hasFast2Sms: !!process.env.FAST2SMS_API_KEY,
    hasTwilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    hasMsg91: !!process.env.MSG91_AUTH_KEY,
    hasSmtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    hasResend: !!process.env.RESEND_API_KEY
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, fast2SmsKey, twilioSid, twilioToken, twilioPhone, testPhone } = body;

    const envFilePath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf-8');
    }

    const updates: Record<string, string> = {};

    if (provider === 'fast2sms' && fast2SmsKey) {
      process.env.FAST2SMS_API_KEY = fast2SmsKey.trim();
      updates['FAST2SMS_API_KEY'] = fast2SmsKey.trim();
    } else if (provider === 'twilio' && twilioSid && twilioToken && twilioPhone) {
      process.env.TWILIO_ACCOUNT_SID = twilioSid.trim();
      process.env.TWILIO_AUTH_TOKEN = twilioToken.trim();
      process.env.TWILIO_PHONE_NUMBER = twilioPhone.trim();
      updates['TWILIO_ACCOUNT_SID'] = twilioSid.trim();
      updates['TWILIO_AUTH_TOKEN'] = twilioToken.trim();
      updates['TWILIO_PHONE_NUMBER'] = twilioPhone.trim();
    }

    // Write to .env.local
    let lines = envContent ? envContent.split('\n') : [];
    for (const [k, v] of Object.entries(updates)) {
      const idx = lines.findIndex(l => l.startsWith(`${k}=`));
      if (idx >= 0) {
        lines[idx] = `${k}=${v}`;
      } else {
        lines.push(`${k}=${v}`);
      }
    }
    fs.writeFileSync(envFilePath, lines.join('\n'), 'utf-8');

    // Test sending SMS if testPhone is provided
    let testResult = null;
    if (testPhone) {
      const testCode = Math.floor(100000 + Math.random() * 900000).toString();
      testResult = await sendSmsOtp({
        phone: testPhone.trim(),
        otp: testCode,
        purpose: 'test_dispatch'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'SMS Gateway credentials updated and saved to .env.local!',
      testResult
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gateway' }, { status: 500 });
  }
}
