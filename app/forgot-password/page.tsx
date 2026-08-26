'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Skill2HireLogo from '@/components/Skill2HireLogo';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step: 'input' | 'otp' | 'reset_password' | 'success'
  const [step, setStep] = useState<'input' | 'otp' | 'reset_password' | 'success'>('input');
  
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedIdentifier, setMaskedIdentifier] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // 1. Send Password Reset OTP
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send reset code');

      setMaskedIdentifier(data.maskedIdentifier);
      startCooldown();
      setStep('otp');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Advance to New Password
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), code: otp.trim(), purpose: 'forgot_password' })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setStep('reset_password');
      setSuccessMsg('Identity verified! Please create your new secure password.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          code: otp.trim(),
          newPassword,
          confirmPassword
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Password reset failed');

      setStep('success');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      startCooldown();
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Skill2HireLogo variant="full" size="md" showTagline={true} />
          </Link>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500">
            Recover access through secure OTP verification.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: IDENTIFIER INPUT */}
        {step === 'input' && (
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="user@example.com or +91 98765 43210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                We'll send a 6-digit OTP code to verify your identity.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending Code...' : 'Send Password Reset Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              Remember your password?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:underline">
                Sign In →
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                Identity Verification
              </span>
              <p className="text-xs text-slate-500 pt-2">
                Enter the 6-digit code sent to <strong className="font-mono text-slate-800">{maskedIdentifier}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-center">6-Digit Verification Code</label>
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-center tracking-[0.5em] font-mono text-lg bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Code expires in 5 minutes</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Verifying Code...' : 'Verify OTP & Set New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className="text-xs font-bold text-slate-500 hover:text-primary-600 disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Didn\'t receive code? Resend OTP'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: CREATE NEW PASSWORD */}
        {step === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Saving New Password...' : 'Save New Password & Log In'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Password Reset Complete!</h2>
              <p className="text-xs text-slate-500">
                You can now log into your account with your new password.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all mt-4"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
