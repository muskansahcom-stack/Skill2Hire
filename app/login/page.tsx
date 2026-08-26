'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Skill2HireLogo from '@/components/Skill2HireLogo';
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
  const { login, loginWithPhone, switchPersona, isLoading } = useAuth();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  
  // Active Role Tab
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Credentials
  const [identifier, setIdentifier] = useState('alex.rivera@student.skill2hire.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login Mode
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 3 Exact Login Credentials Config
  const THREE_ROLE_CREDENTIALS = [
    {
      role: 'student' as UserRole,
      userId: 'u_student_1',
      title: 'Student Login',
      name: 'Alex Rivera',
      subtitle: 'Candidate & Skill Learner',
      email: 'alex.rivera@student.skill2hire.com',
      password: 'demo123',
      phone: '+91 98765 43210',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Search jobs, analyze skill gaps, watch video courses, pass verified assessments & apply.',
      features: ['Skill Passport', 'Job Gap Analysis', 'Assessments & Practice', 'Job Applications']
    },
    {
      role: 'college' as UserRole,
      userId: 'u_col_1',
      title: 'College Login',
      name: 'Apex University',
      subtitle: 'Placement & Training Cell',
      email: 'admin@apexuniversity.edu',
      password: 'demo123',
      phone: '+91 98765 43211',
      icon: Building2,
      color: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Track cohort readiness, view student skill heatmaps, assign bootcamps & manage campus drives.',
      features: ['Skill Heatmap', 'Curriculum Gap Analysis', 'Training Programs', 'Placement Analytics']
    },
    {
      role: 'company' as UserRole,
      userId: 'u_comp_1',
      title: 'Company Login',
      name: 'TechNova HR',
      subtitle: 'Job Posting & Hiring Manager',
      email: 'recruiter@technova.com',
      password: 'demo123',
      phone: '+91 98765 43212',
      icon: Briefcase,
      color: 'from-cyan-600 to-blue-600',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Post technical jobs, define required skills, search verified talent & manage hiring pipeline.',
      features: ['Job Creation & AI Extraction', 'Skill Search', 'Verified Talent Pool', 'Hiring Pipeline']
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
    setSuccessMsg(`Loaded credentials for ${roleConfig.title} (${roleConfig.name})`);
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

  const handleSendLoginOtp = async () => {
    if (!identifier) {
      setError('Please enter your registered email address or phone number.');
      return;
    }
    setError('');
    try {
      const isEmail = identifier.includes('@');
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), type: isEmail ? 'email' : 'phone', purpose: 'login' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOtpSent(true);
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setError('');
    setSubmitting(true);

    try {
      let success = false;

      if (authMethod === 'password') {
        success = await login(identifier, password);
      } else {
        success = await loginWithPhone(identifier, otp || '123456');
      }

      if (success) {
        const role = (localStorage.getItem('s2h_role') as UserRole) || selectedRole;
        router.push(getDashboardRoute(role));
      } else {
        setError('Invalid credentials. Check email/password or use the 1-click role buttons above.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
              Select your role below for instant credentials, or enter your registered email/phone number.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. THREE ROLE LOGIN CREDENTIALS CARDS (STUDENT, COLLEGE, COMPANY)      */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary-600" />
              <span>Official Three Role Login Details</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Click any card to auto-fill or instant login</span>
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
                  {/* Top Bar */}
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

                    {/* Exact Credentials Box */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Email:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate max-w-[170px]">{cred.email}</span>
                          <button
                            onClick={() => copyToClipboard(cred.email, `${cred.role}_email`)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy Email"
                          >
                            {copiedKey === `${cred.role}_email` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Password:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{cred.password}</span>
                          <button
                            onClick={() => copyToClipboard(cred.password, `${cred.role}_pass`)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy Password"
                          >
                            {copiedKey === `${cred.role}_pass` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Phone:</span>
                        <span className="font-bold text-slate-900">{cred.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleQuickInstantLogin(cred)}
                      disabled={submitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>⚡ 1-Click Login as {cred.title.replace(' Login', '')}</span>
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
        {/* 🔐 2. MAIN LOGIN FORM CONTAINER                                            */}
        {/* ========================================================================= */}
        <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Method Tabs: Password vs Secure OTP */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              onClick={() => { setAuthMethod('password'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password Login</span>
            </button>

            <button
              onClick={() => { setAuthMethod('otp'); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'otp'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>Real-Time OTP Login</span>
            </button>
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

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email / Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Email Address or Phone Number</span>
                <span className="text-[10px] text-slate-400">e.g. alex.rivera@student.skill2hire.com</span>
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
                  placeholder="Enter email or +91 phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Password Login Mode */}
            {authMethod === 'password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-bold text-primary-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
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

            {/* OTP Login Mode */}
            {authMethod === 'otp' && (
              <div className="space-y-3 pt-1">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendLoginOtp}
                    className="w-full py-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Random 6-Digit OTP to My Email/Phone</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter received 6-digit OTP"
                      className="w-full text-center tracking-widest text-lg font-mono py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 transition-all hover:scale-[1.01]"
            >
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
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

    </div>
  );
}
