'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Skill2HireLogo from '@/components/Skill2HireLogo';
import {
  GraduationCap,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Step 1: Role Selection
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student specific
  const [collegeName, setCollegeName] = useState('Apex University of Engineering');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');

  // College specific
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  // Company specific
  const [industry, setIndustry] = useState('Technology & Cloud Systems');
  const [recruiterName, setRecruiterName] = useState('');

  // Verification Step: 'form' | 'otp_email' | 'otp_phone' | 'completed'
  const [step, setStep] = useState<'form' | 'otp_email' | 'otp_phone' | 'completed'>('form');
  
  // OTP States
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Start Cooldown timer
  const startCooldown = (type: 'email' | 'phone') => {
    if (type === 'email') {
      setEmailCooldown(60);
      const timer = setInterval(() => {
        setEmailCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhoneCooldown(60);
      const timer = setInterval(() => {
        setPhoneCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // 1. Submit Form & Send Email OTP
  const handleInitiateVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role to register.');
      return;
    }

    if (!email || !password || !phone) {
      setError('All mandatory fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Send Real Email OTP
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: email.trim().toLowerCase(), 
          type: 'email', 
          purpose: 'registration',
          name: name || (selectedRole === 'student' ? 'Student' : selectedRole === 'college' ? collegeName : 'Company')
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send Email OTP');

      setMaskedEmail(data.maskedIdentifier);
      startCooldown('email');
      setStep('otp_email');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Email OTP & Send Phone OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim().toLowerCase(), code: emailOtp.trim(), purpose: 'registration' })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid Email OTP');

      // Email verified! Now trigger Real Phone OTP
      const phoneRes = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone.trim(), type: 'phone', purpose: 'registration' })
      });
      const phoneData = await phoneRes.json();

      if (!phoneRes.ok) throw new Error(phoneData.error || 'Failed to send Phone OTP');

      setMaskedPhone(phoneData.maskedIdentifier);
      startCooldown('phone');
      setStep('otp_phone');
      setSuccessMsg(`Email verified! ${phoneData.message}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Phone OTP & Complete Account Creation
  const handleVerifyPhoneAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verify Real Phone OTP
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone.trim(), code: phoneOtp.trim(), purpose: 'registration' })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid Phone OTP');

      // Both OTPs verified! Create the official account
      const payload: any = {
        role: selectedRole,
        name: name || (selectedRole === 'student' ? 'Student Candidate' : selectedRole === 'college' ? collegeName : 'Company Partner'),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        collegeName,
        department,
        graduationYear,
        website,
        address,
        contactPerson,
        industry,
        recruiterName
      };

      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const regData = await regRes.json();

      if (!regRes.ok) throw new Error(regData.error || 'Registration failed');

      setStep('completed');
      setSuccessMsg(`Account created and verified! Redirecting to ${selectedRole?.toUpperCase()} Dashboard...`);

      // Auto login user in context
      if (typeof window !== 'undefined') {
        localStorage.setItem('s2h_user_id', regData.user.id);
        localStorage.setItem('s2h_role', regData.user.role);
      }

      setTimeout(() => {
        if (selectedRole === 'student') router.push('/student/dashboard');
        else if (selectedRole === 'college') router.push('/college/dashboard');
        else router.push('/recruiter/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (emailCooldown > 0) return;
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim().toLowerCase(), type: 'email', purpose: 'registration' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      startCooldown('email');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (phoneCooldown > 0) return;
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone.trim(), type: 'phone', purpose: 'registration' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      startCooldown('phone');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Skill2HireLogo variant="full" size="md" showTagline={true} />
          </Link>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            Create Verified Account
          </h1>
          <p className="text-xs text-slate-500">
            Join the integrated Student–College–Company hiring ecosystem.
          </p>
        </div>

        {/* Status Alerts */}
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

        {/* ========================================================================= */}
        {/* STAGE 1: ROLE SELECTION & REGISTRATION FORM                               */}
        {/* ========================================================================= */}
        {step === 'form' && (
          <div className="space-y-6">
            
            {/* "Who are you?" Role Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Who are you?
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('student'); setError(''); }}
                  className={`p-3.5 rounded-2xl border text-center transition-all space-y-1.5 ${
                    selectedRole === 'student'
                      ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20 text-primary-950 font-black'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xl">👩🎓</div>
                  <span className="text-xs font-extrabold block">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole('college'); setError(''); }}
                  className={`p-3.5 rounded-2xl border text-center transition-all space-y-1.5 ${
                    selectedRole === 'college'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-950 font-black'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xl">🎓</div>
                  <span className="text-xs font-extrabold block">College</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole('company'); setError(''); }}
                  className={`p-3.5 rounded-2xl border text-center transition-all space-y-1.5 ${
                    selectedRole === 'company'
                      ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20 text-cyan-950 font-black'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xl">🏢</div>
                  <span className="text-xs font-extrabold block">Company</span>
                </button>
              </div>
            </div>

            {/* Role-Specific Form Fields */}
            {selectedRole && (
              <form onSubmit={handleInitiateVerification} className="space-y-4 pt-2">
                
                {/* 1. STUDENT REGISTRATION FORM */}
                {selectedRole === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Muskan Sah"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                      <input
                        type="text"
                        required
                        placeholder="Apex University of Engineering"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Course / Department</label>
                        <input
                          type="text"
                          required
                          placeholder="Computer Science & Engineering"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
                        <select
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold"
                        >
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. COLLEGE REGISTRATION FORM */}
                {selectedRole === 'college' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">College / Institution Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Apex University Placement Cell"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official College Email</label>
                        <input
                          type="email"
                          required
                          placeholder="admin@apexuniversity.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43211"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">College Website</label>
                        <input
                          type="url"
                          placeholder="https://apexuniversity.edu"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Placement Officer / Contact Person</label>
                        <input
                          type="text"
                          placeholder="Dr. Robert Evans (Dean Placements)"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 3. COMPANY REGISTRATION FORM */}
                {selectedRole === 'company' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                      <input
                        type="text"
                        required
                        placeholder="TechNova Systems"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Official Company Email</label>
                        <input
                          type="email"
                          required
                          placeholder="recruiter@technova.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43212"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                        <input
                          type="url"
                          placeholder="https://technova.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter / HR Lead Name</label>
                        <input
                          type="text"
                          placeholder="Sarah Jenkins (Head of Talent)"
                          value={recruiterName}
                          onChange={(e) => setRecruiterName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>{loading ? 'Sending Verification Code...' : 'Send Verification OTP →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary-600 hover:underline">
                Sign In →
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: EMAIL OTP VERIFICATION                                           */}
        {/* ========================================================================= */}
        {step === 'otp_email' && (
          <form onSubmit={handleVerifyEmailOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                Step 1 of 2: Verify Your Email
              </span>
              <h2 className="text-lg font-bold text-slate-900 pt-2">Enter 6-Digit Email Verification Code</h2>
              <p className="text-xs text-slate-500">
                We've sent a 6-digit verification code to: <strong className="font-mono text-slate-800">{maskedEmail || email}</strong>
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
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
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
                disabled={loading || emailOtp.length < 6}
                className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Verifying Code...' : 'Verify OTP & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendEmailOtp}
                  disabled={emailCooldown > 0}
                  className="text-xs font-bold text-slate-500 hover:text-primary-600 disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{emailCooldown > 0 ? `Resend OTP in ${emailCooldown}s` : 'Didn\'t receive the code? Resend OTP'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: PHONE OTP VERIFICATION                                           */}
        {/* ========================================================================= */}
        {step === 'otp_phone' && (
          <form onSubmit={handleVerifyPhoneAndRegister} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step 2 of 2: Verify Your Phone Number
              </span>
              <h2 className="text-lg font-bold text-slate-900 pt-2">Enter 6-Digit Mobile Verification Code</h2>
              <p className="text-xs text-slate-500">
                We've sent an SMS verification code to: <strong className="font-mono text-slate-800">{maskedPhone || phone}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-center">6-Digit SMS Code</label>
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-center tracking-[0.5em] font-mono text-lg bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
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
                disabled={loading || phoneOtp.length < 6}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Verifying & Activating Account...' : 'Verify OTP & Complete Registration ✓'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendPhoneOtp}
                  disabled={phoneCooldown > 0}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{phoneCooldown > 0 ? `Resend OTP in ${phoneCooldown}s` : 'Didn\'t receive the SMS? Resend OTP'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: REGISTRATION COMPLETED                                           */}
        {/* ========================================================================= */}
        {step === 'completed' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Account Verified & Activated!</h2>
              <p className="text-xs text-slate-500">
                Email and Phone verified. Connecting to your {selectedRole?.toUpperCase()} dashboard...
              </p>
            </div>
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </div>
        )}

      </div>
    </div>
  );
}
