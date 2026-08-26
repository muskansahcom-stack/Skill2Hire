import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { hashOtp, compareOtp } from '../utils/password';
import { config } from '../config';

export class OTPService {
  /**
   * Generates a cryptographically secure 6-digit OTP
   */
  static generateNumericOtp(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      otp += digits[randomBytes[i] % 10];
    }
    return otp;
  }

  /**
   * Creates and stores a hashed OTP record for a user
   */
  static async createOtp(userId: string, purpose: string = 'REGISTER'): Promise<string> {
    // Check resend cooldown
    const recentOtp = await prisma.oTPVerification.findFirst({
      where: {
        userId,
        purpose,
        createdAt: {
          gte: new Date(Date.now() - config.otpResendCooldownSeconds * 1000)
        }
      }
    });

    if (recentOtp) {
      const waitSeconds = Math.ceil(
        (recentOtp.createdAt.getTime() + config.otpResendCooldownSeconds * 1000 - Date.now()) / 1000
      );
      throw new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP.`);
    }

    // Invalidate prior active OTPs
    await prisma.oTPVerification.updateMany({
      where: {
        userId,
        purpose,
        verified: false
      },
      data: {
        verified: true // Invalidate previous
      }
    });

    const plainOtp = this.generateNumericOtp(6);
    const otpHash = await hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + config.otpExpiryMinutes * 60 * 1000);

    await prisma.oTPVerification.create({
      data: {
        userId,
        otpHash,
        purpose,
        expiresAt,
        attempts: 0,
        verified: false
      }
    });

    // In production, dispatch via SMS/Email provider
    console.log(`[OTP DISPATCH] Real random OTP generated for user ${userId} (${purpose}): ${plainOtp}`);

    return plainOtp;
  }

  /**
   * Verifies an entered plain OTP against the stored hash
   */
  static async verifyOtp(userId: string, enteredOtp: string, purpose: string = 'REGISTER'): Promise<boolean> {
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        userId,
        purpose,
        verified: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otpRecord) {
      throw new Error('No pending OTP request found. Please request a new OTP.');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new Error('OTP has expired. Please request a new OTP.');
    }

    if (otpRecord.attempts >= 5) {
      throw new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
    }

    const isValid = await compareOtp(enteredOtp, otpRecord.otpHash);

    // Increment attempt count
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: {
        attempts: { increment: 1 },
        verified: isValid
      }
    });

    if (!isValid) {
      throw new Error('Invalid OTP code. Please check and try again.');
    }

    return true;
  }
}
