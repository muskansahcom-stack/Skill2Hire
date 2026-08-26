import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'COLLEGE', 'COMPANY', 'ADMIN']).default('STUDENT'),
  
  // Optional profile details for Student
  collegeName: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  graduationYear: z.number().optional(),
  
  // Optional for College
  institutionEmail: z.string().optional(),
  
  // Optional for Company
  companyName: z.string().optional(),
  industry: z.string().optional()
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Phone is required'),
  password: z.string().optional(),
  otp: z.string().optional()
});

export const sendOtpSchema = z.object({
  identifier: z.string().min(1, 'Email or Phone is required'),
  purpose: z.enum(['REGISTER', 'LOGIN', 'PASSWORD_RESET']).default('REGISTER')
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Email or Phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['REGISTER', 'LOGIN', 'PASSWORD_RESET']).default('REGISTER')
});
