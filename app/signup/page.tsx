'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Skill2HireLogo from '@/components/Skill2HireLogo';
import LiveOtpNotificationBanner from '@/components/LiveOtpNotificationBanner';
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
  EyeOff,
  Briefcase,
  Layers,
  BookOpen,
  Award
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setAuthSession } = useAuth();

  // Step 1: Role Selection
  const [selectedRole, setSelectedRole] = useState<UserRole | null>('student');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleVerified, setIsGoogleVerified] = useState(false);

  // Student specific details
  const [collegeName, setCollegeName] = useState('Apex University of Engineering');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [careerGoal, setCareerGoal] = useState('Full Stack Software Engineer');
  const [skillsInput, setSkillsInput] = useState('Python, Data Structures, SQL, Git');
  const [resumeUrl, setResumeUrl] = useState('https://storage.skill2hire.com/resumes/alex_resume.pdf');

  // College specific details
  const [website, setWebsite] = useState('https://apexuniversity.edu');
  const [address, setAddress] = useState('Academic City Campus, Tech Corridor');
  const [contactPerson, setContactPerson] = useState('Dean of Placements & Training');

  // Company specific details
  const [industry, setIndustry] = useState('Technology & Cloud Systems');
  const [recruiterName, setRecruiterName] = useState('Lead Technical Recruiter');

  // Verification Step: 'form' | 'otp_email' | 'completed'
  const [step, setStep] = useState<'form' | 'otp_email' | 'completed'>('form');
  
  // OTP States
  const [emailOtp, setEmailOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [emailCooldown, setEmailCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Prefill Google Identity if redirected from Google Auth
  useEffect(() => {
    const googleEmail = searchParams.get('email');
    const googleName = searchParams.get('name');
    if (googleEmail) {
      setEmail(googleEmail);
      setIsGoogleVerified(true);
      if (googleName) setName(googleName);
      setSuccessMsg(`Google identity verified for ${googleEmail}. Complete your profile below.`);
    }
  }, [searchParams]);

  // Start Cooldown timer
  const startCooldown = () => {
    setEmailCooldown(60);
    const timer = setInterval(() => {
      setEmailCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Submit Profile & Send Real-Time Email OTP
  const handleInitiateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedRole) {
      setError('Please select a role to register.');
      return;
    }

    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isGoogleVerified && (!password || password !== confirmPassword)) {
      setError('Passwords do not match or are missing.');
      return;
    }

    if (!isGoogleVerified && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create account in pending verification state
      const skillsList = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const payload: any = {
        role: selectedRole,
        name: name || (selectedRole === 'student' ? 'Student Candidate' : selectedRole === 'college' ? collegeName : 'Company Partner'),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+91 98765 00000',
        password: password || 'google_oauth_verified',
        isGoogleAuth: isGoogleVerified,
        collegeName,
        department,
        graduationYear,
        careerGoal,
        skills: skillsList,
        resumeUrl,
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

      if (!regRes.ok) throw new Error(regData.error || 'Registration failed.');

      // 2. Dispatch Real-Time 6-Digit Email OTP
      const otpRes = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email.trim().toLowerCase(),
          type: 'email',
          purpose: 'registration',
          name: name || 'Skill2Hire User'
        })
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) throw new Error(otpData.error || 'Failed to dispatch verification code.');

      setMaskedEmail(otpData.maskedIdentifier || email);
      startCooldown();
      setStep('otp_email');
      setSuccessMsg(otpData.message || `A 6-digit verification code has been dispatched to ${email}.`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Real-Time Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email.trim().toLowerCase(),
          code: emailOtp.trim(),
          purpose: 'registration'
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid verification code.');

      setStep('completed');
      if (data.user) {
        setAuthSession(data.user, data.profile);
      }

      setTimeout(() => {
        if (selectedRole === 'student') router.push('/student/dashboard');
        else if (selectedRole === 'college') router.push('/college/dashboard');
        else router.push('/recruiter/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (emailCooldown > 0) return;
    setError('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email.trim().toLowerCase(),
          type: 'email',
          purpose: 'registration'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      startCooldown();
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Skill2HireLogo variant="full" size="lg" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Create Your <span className="text-primary-600">Skill2Hire</span> Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto">
              Follow our secure 3-step verification process to access your dedicated role portal.
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-md mx-auto flex items-center justify-between text-xs font-bold text-slate-400">
          <div className={`flex items-center gap-1.5 ${step === 'form' ? 'text-primary-600' : 'text-emerald-600'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step === 'form' ? 'bg-primary-600 text-white' : 'bg-emerald-600 text-white'}`}>1</div>
            <span>Profile Details</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step === 'otp_email' ? 'text-primary-600' : step === 'completed' ? 'text-emerald-600' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step === 'otp_email' ? 'bg-primary-600 text-white' : step === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</div>
            <span>Email OTP</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step === 'completed' ? 'text-emerald-600' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${step === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</div>
            <span>Dashboard</span>
          </div>
        </div>

        {/* Alert Feedback */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Role Selection & Profile Form */}
        {step === 'form' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
            
            {/* 1. Role Picker */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Select User Role (Strict Permission Boundary)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { role: 'student' as UserRole, title: 'Student', icon: GraduationCap, desc: 'Learn, verify skills, view transcripts & apply to tech jobs' },
                  { role: 'college' as UserRole, title: 'College / University', icon: Building2, desc: 'Placement cell, track student cohort readiness & analyze curriculum gaps' },
                  { role: 'company' as UserRole, title: 'Company / Recruiter', icon: Briefcase, desc: 'Post opportunities, search verified talent & manage hiring pipeline' }
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-5 rounded-2xl border-2 text-left space-y-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/40 ring-2 ring-primary-500/20 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
                      </div>
                      <div className="font-black text-sm text-slate-900">{r.title}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Role Specific Form */}
            <form onSubmit={handleInitiateRegistration} className="space-y-6">
              
              {/* Common Account Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name / Account Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Verified Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {!isGoogleVerified && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Student Role Form Fields */}
              {selectedRole === 'student' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary-600 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Academic & Career Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">College / Institution</label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Branch / Department</label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Graduation Year</label>
                      <input
                        type="number"
                        required
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Declared Skills (Comma Separated)</label>
                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. Python, SQL, DSA, AWS"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Target Career Goal</label>
                      <input
                        type="text"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="e.g. Backend Software Engineer"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* College Role Form Fields */}
              {selectedRole === 'college' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Institution Verification Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Official Institutional Website</label>
                      <input
                        type="url"
                        required
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://university.edu"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Placement Officer / Contact Person</label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Company Role Form Fields */}
              {selectedRole === 'company' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-600 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>Company Verification Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Industry / Domain</label>
                      <input
                        type="text"
                        required
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Recruiter / Talent Lead Name</label>
                      <input
                        type="text"
                        required
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary-600/25 transition-all hover:scale-[1.01]"
              >
                <span>{loading ? 'Processing Registration...' : 'Continue to Email OTP Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Email OTP Input Screen */}
        {step === 'otp_email' && (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Enter 6-Digit Email OTP</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                We've sent a verification code to your email <strong className="text-slate-800">{maskedEmail}</strong>. Please check your Gmail inbox (and spam folder). Valid for 5 minutes.
              </p>
            </div>

            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-center font-mono font-black text-2xl tracking-[0.5em] text-slate-900"
              />

              <button
                type="submit"
                disabled={loading || emailOtp.length < 6}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>{loading ? 'Verifying Code...' : 'Verify OTP & Activate Portal'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={emailCooldown > 0}
                className="text-xs font-bold text-primary-600 hover:underline disabled:opacity-50"
              >
                {emailCooldown > 0 ? `Resend Code in ${emailCooldown}s` : 'Resend Verification Code'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
