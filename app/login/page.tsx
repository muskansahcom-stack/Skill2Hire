'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Skill2HireLogo from '@/components/Skill2HireLogo';
import GoogleSignInModal from '@/components/GoogleSignInModal';
import LiveOtpNotificationBanner from '@/components/LiveOtpNotificationBanner';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Send,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithPhone, loginWithGoogle, switchPersona, isLoading } = useAuth();

  // Google Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  // Active Role Tab
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Credentials
  const [identifier, setIdentifier] = useState('alex.rivera@student.skill2hire.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login Mode
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3 Role Cards
  const THREE_ROLE_CREDENTIALS = [
    {
      role: 'student' as UserRole,
      userId: 'u_student_1',
      title: 'Student Portal',
      name: 'Alex Rivera',
      subtitle: 'Candidate & Skill Learner',
      email: 'alex.rivera@student.skill2hire.com',
      password: 'demo123',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Access student dashboard, skill passport, courses, assessments & job applications.'
    },
    {
      role: 'college' as UserRole,
      userId: 'u_col_1',
      title: 'College Portal',
      name: 'Apex University',
      subtitle: 'Placement & Training Cell',
      email: 'admin@apexuniversity.edu',
      password: 'demo123',
      icon: Building2,
      color: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Access institutional cohort analytics, skill heatmaps, bootcamps & campus placement drives.'
    },
    {
      role: 'company' as UserRole,
      userId: 'u_comp_1',
      title: 'Company Portal',
      name: 'TechNova HR',
      subtitle: 'Job Posting & Hiring Lead',
      email: 'recruiter@technova.com',
      password: 'demo123',
      icon: Briefcase,
      color: 'from-cyan-600 to-blue-600',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Post technical opportunities, filter verified candidates, review applications & manage pipelines.'
    }
  ];

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case 'student': return '/student/dashboard';
      case 'college': return '/college/dashboard';
      case 'company': return '/recruiter/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/student/dashboard';
    }
  };

  const handleSelectRoleCredentials = (roleConfig: typeof THREE_ROLE_CREDENTIALS[0]) => {
    setSelectedRole(roleConfig.role);
    setIdentifier(roleConfig.email);
    setPassword(roleConfig.password);
    setError('');
    setSuccessMsg(`Selected ${roleConfig.title} credentials (${roleConfig.name})`);
  };

  const handleQuickInstantLogin = async (roleConfig: typeof THREE_ROLE_CREDENTIALS[0]) => {
    setError('');
    setSubmitting(true);
    try {
      await switchPersona(roleConfig.role, roleConfig.userId);
      router.push(getDashboardRoute(roleConfig.role));
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setSubmitting(false);
    }
  };

  // Google OAuth Flow
  const handleGoogleAuth = () => {
    setError('');
    setSuccessMsg('');
    setGoogleModalOpen(true);
  };

  const handleGoogleSelectAccount = async (email: string, name: string) => {
    setGoogleModalOpen(false);
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      const result = await loginWithGoogle(email);
      if (result.isNewUser) {
        setSuccessMsg(`Google identity verified for ${email}! Redirecting to select role...`);
        setTimeout(() => {
          router.push(`/signup?email=${encodeURIComponent(result.email || email)}&name=${encodeURIComponent(result.name || name)}`);
        }, 800);
      } else if (result.success) {
        setSuccessMsg(`Authenticated as ${email}`);
        const userRole = (result as any).user?.role || THREE_ROLE_CREDENTIALS.find(c => c.email === email)?.role || 'student';
        router.push(getDashboardRoute(userRole));
      } else {
        setError(result.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setSubmitting(false);
    }
  };

  // Send Email OTP for Login
  const handleSendOtp = async () => {
    if (!identifier) {
      setError('Please enter your email or phone number to receive a verification code.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          purpose: 'login'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setSuccessMsg(data.message || 'A 6-digit verification code has been dispatched.');
        setOtpCooldown(60);
        const timer = setInterval(() => {
          setOtpCooldown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Direct Login Form
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await login(identifier.trim(), useOtp ? otp.trim() : password, useOtp);
      if (res.success) {
        // Redirect dynamically according to actual authenticated user role
        const targetRole = (res as any).user?.role || THREE_ROLE_CREDENTIALS.find(c => c.email === identifier.trim())?.role || selectedRole;
        router.push(getDashboardRoute(targetRole));
      } else {
        setError(res.error || 'Invalid credentials or verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Skill2HireLogo variant="full" size="lg" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Sign In to Your <span className="text-primary-600">Skill2Hire</span> Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Secure role-based authentication for Students, Colleges, and Enterprise Recruiters.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. THREE ROLE SELECTOR CARDS (STUDENT, COLLEGE, COMPANY)               */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary-600" />
              <span>Select Your Portal Role</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Click any role to load demo credentials</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {THREE_ROLE_CREDENTIALS.map((cred) => {
              const Icon = cred.icon;
              const isSelected = selectedRole === cred.role && identifier === cred.email;

              return (
                <div
                  key={cred.role}
                  className={`rounded-3xl bg-white border-2 p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cred.color} text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-black text-base text-slate-900">{cred.title}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{cred.subtitle}</div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${cred.badgeColor}`}>
                        {cred.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {cred.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div className="text-slate-500">Email: <span className="text-slate-900 font-bold">{cred.email}</span></div>
                      <div className="text-slate-500">Password: <span className="text-slate-900 font-bold">{cred.password}</span></div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => handleQuickInstantLogin(cred)}
                      disabled={submitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>⚡ 1-Click Login as {cred.title.replace(' Portal', '')}</span>
                    </button>

                    <button
                      onClick={() => handleSelectRoleCredentials(cred)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] text-center transition-colors"
                    >
                      Fill into Form Below ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🔐 2. MAIN LOGIN FORM & GOOGLE OAUTH CONTAINER                              */}
        {/* ========================================================================= */}
        <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Primary: Continue with Google Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm transition-all hover:scale-[1.005]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{submitting ? 'Verifying Google Identity...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center pt-2 pb-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Or Sign In with Email & Password
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Direct Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email / Identifier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Email Address or Registered Identifier</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Password or OTP Toggle */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-slate-700">{useOtp ? '6-Digit Email OTP' : 'Password'}</span>
              <button
                type="button"
                onClick={() => { setUseOtp(!useOtp); setError(''); setSuccessMsg(''); }}
                className="text-primary-600 font-bold hover:underline"
              >
                {useOtp ? 'Switch to Password Login' : 'Login with Email OTP instead'}
              </button>
            </div>

            {/* Password Input */}
            {!useOtp && (
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (default: demo123)"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            {/* OTP Input with Send Code Button */}
            {useOtp && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP code"
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-mono font-bold tracking-widest text-slate-900 text-center"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpCooldown > 0 || submitting}
                    className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Send OTP Code'}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 transition-all hover:scale-[1.01]"
            >
              <span>{submitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* New to Skill2Hire */}
          <div className="text-center pt-2 border-t border-slate-100 space-y-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link href="/signup" className="font-bold text-primary-600 hover:underline">
                Create Account (Student, College, Company)
              </Link>
            </p>
          </div>

        </div>

      </div>

      {/* Google Sign-In Account Selector Modal */}
      <GoogleSignInModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleGoogleSelectAccount}
        isLoading={submitting}
      />

    </div>
  );
}
