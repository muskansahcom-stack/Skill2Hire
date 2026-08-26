import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'skill2hire_super_secret_jwt_key_2026_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
  otpResendCooldownSeconds: parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
  }
};
