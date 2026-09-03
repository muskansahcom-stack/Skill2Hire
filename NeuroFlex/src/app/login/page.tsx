"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const { login, loginAsDemoStudent } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please provide a valid student email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push(redirectTarget);
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
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
          Sign in to access your synchronized analogies, flowcharts, and personal analytics.
        </p>
      </div>

      {/* Instant Demo One-Click Access Card */}
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
          Explore with preloaded STEM mastery data, daily streak, and active learning queues:
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

      {/* Main Auth Form Card */}
      <Card glass className="p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white">Student Sign In</h2>
          <p className="text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent-cyan hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div
              className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-500/40 p-3 rounded-xl animate-fadeIn"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Student Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@neuroflex.edu"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full justify-center font-bold text-xs py-3 mt-2"
          >
            {isLoading ? "Signing in..." : "Sign In to Dashboard"}
          </Button>
        </form>
      </Card>

      {/* Security Trust Footnote */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
        <span>NeuroFlex Encrypted Student Vault Active</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 text-slate-400 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
            <span className="text-xs">Loading authentication portal...</span>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
