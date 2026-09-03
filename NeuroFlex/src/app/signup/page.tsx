"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginAsDemoStudent } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Requirement Checks
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Please provide a valid student email address.");
      return;
    }

    if (!hasMinLength || !hasLetter || !hasNumber) {
      setError("Password does not meet the complexity requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password, confirmPassword);
    setIsLoading(false);

    if (result.success) {
      router.push("/onboarding");
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/neuroflex-logo.png"
              alt="NeuroFlex Logo"
              width={52}
              height={52}
              style={{ width: "52px", height: "52px", minWidth: "52px", maxWidth: "52px" }}
              className="h-13 w-13 rounded-2xl object-cover shadow-xl shadow-brand-500/30 group-hover:scale-105 transition-transform shrink-0"
            />
            <span className="text-2xl font-black tracking-tight text-white font-display">
              Neuro<span className="text-accent-cyan">Flex</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400">
            Create your account to start adaptive micro-learning with synchronized representations.
          </p>
        </div>

        {/* Instant Demo Presentation Mode Card */}
        <div className="rounded-2xl border border-accent-cyan/40 bg-cyan-950/20 p-4 backdrop-blur-xl shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
              <span>Instant Presentation Mode</span>
            </span>
            <Badge variant="cyan" size="sm">
              Zero Password
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            Skip registration and test the platform immediately with preloaded STEM mastery data:
          </p>
          <Button
            type="button"
            variant="accent"
            size="md"
            onClick={loginAsDemoStudent}
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            iconPosition="right"
            className="w-full justify-center font-bold text-xs"
          >
            ⚡ Continue as Demo Student (Muskan)
          </Button>
        </div>

        {/* Main Signup Form Card */}
        <Card glass className="p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white">Create Student Account</h2>
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-accent-cyan hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div
                className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Student Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters with letters & numbers"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Real-Time Password Requirements Checklist */}
              <div className="pt-2 grid grid-cols-3 gap-1.5 text-[11px]">
                <span
                  className={`flex items-center gap-1 font-mono ${
                    hasMinLength ? "text-emerald-400 font-bold" : "text-slate-500"
                  }`}
                >
                  {hasMinLength ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 flex items-center justify-center">•</span>}
                  8+ chars
                </span>
                <span
                  className={`flex items-center gap-1 font-mono ${
                    hasLetter ? "text-emerald-400 font-bold" : "text-slate-500"
                  }`}
                >
                  {hasLetter ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 flex items-center justify-center">•</span>}
                  1+ letter
                </span>
                <span
                  className={`flex items-center gap-1 font-mono ${
                    hasNumber ? "text-emerald-400 font-bold" : "text-slate-500"
                  }`}
                >
                  {hasNumber ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 flex items-center justify-center">•</span>}
                  1+ number
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              {confirmPassword.length > 0 && (
                <p
                  className={`text-[11px] font-medium ${
                    passwordsMatch ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center font-bold text-xs py-3 mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account & Setup Preferences"}
            </Button>
          </form>
        </Card>

        {/* Security Footnote */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>NeuroFlex Encrypted Student Vault Active</span>
        </div>
      </div>
    </div>
  );
}
