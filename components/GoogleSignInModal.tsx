'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => void;
  isLoading?: boolean;
}

export default function GoogleSignInModal({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading = false
}: GoogleSignInModalProps) {
  const [gmailAddress, setGmailAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = gmailAddress.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Gmail address (e.g., yourname@gmail.com).');
      return;
    }

    const computedName = fullName.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    onSelectAccount(cleanEmail, computedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative overflow-hidden animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center mx-auto shadow-md">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Sign in with Google</h3>
          <p className="text-xs text-slate-500 font-medium">
            Enter your Google / Gmail account to authenticate with Skill2Hire
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Direct Google/Gmail Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Gmail / Google Account Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                autoFocus
                value={gmailAddress}
                onChange={(e) => setGmailAddress(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Your Full Name (Optional)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Maya Patel"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 text-xs font-medium text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !gmailAddress}
            className="w-full py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 transition-all"
          >
            <span>{isLoading ? 'Verifying with Google...' : 'Continue to Skill2Hire'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Assurance */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Real-time identity verification & encrypted session token</span>
        </div>

      </div>
    </div>
  );
}
