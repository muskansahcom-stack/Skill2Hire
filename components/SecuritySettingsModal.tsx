'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Mail,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Clock,
  RefreshCw,
  Sparkles,
  Lock
} from 'lucide-react';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecuritySettingsModal({ isOpen, onClose }: SecuritySettingsModalProps) {
  const { user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'password'>('email');
  
  // Step: 'input' | 'otp' | 'success'
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  
  const [newContact, setNewContact] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedNew, setMaskedNew] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // 1. Send OTP to new Contact Identifier
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: newContact.trim(),
          type: activeTab,
          purpose: 'contact_update'
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setMaskedNew(data.maskedIdentifier);
      startCooldown();
      setStep('otp');
      setSuccessMsg(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Update Contact Info
  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !user) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/update-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          newIdentifier: newContact,
          code: otp,
          type: activeTab
        })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Contact update failed');

      setStep('success');
      setSuccessMsg(data.message);
      await refreshProfile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-black text-slate-900">Security & Verified Contact Settings</h2>
          </div>
          <p className="text-xs text-slate-500">
            Update your registered email or phone number with 2-step OTP verification.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Selector */}
        {step !== 'success' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              onClick={() => { setActiveTab('email'); setStep('input'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-primary-600" />
              <span>Change Email</span>
            </button>

            <button
              onClick={() => { setActiveTab('phone'); setStep('input'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Change Phone</span>
            </button>
          </div>
        )}

        {/* STEP 1: INPUT NEW CONTACT */}
        {step === 'input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="text-slate-400 font-semibold block">Currently Registered {activeTab === 'email' ? 'Email' : 'Phone'}:</span>
              <span className="font-mono font-bold text-slate-900 block">
                {activeTab === 'email' ? user?.email : user?.phone || 'Not configured'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New {activeTab === 'email' ? 'Email Address' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                {activeTab === 'email' ? (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                )}
                <input
                  type={activeTab === 'email' ? 'email' : 'text'}
                  required
                  placeholder={activeTab === 'email' ? 'new.email@example.com' : '+91 98765 00000'}
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-semibold"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                We'll send a 6-digit OTP to verify your ownership before updating.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending OTP...' : `Send Verification OTP to New ${activeTab === 'email' ? 'Email' : 'Phone'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndUpdate} className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
                OTP Verification
              </span>
              <p className="text-xs text-slate-500 pt-1">
                Enter code sent to <strong className="font-mono text-slate-800">{maskedNew}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-center">6-Digit Code</label>
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 text-center tracking-[0.5em] font-mono text-lg bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Verifying & Updating...' : 'Verify OTP & Update Contact'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Contact Identity Updated!</h3>
              <p className="text-xs text-slate-500">{successMsg}</p>
            </div>
            <button
              onClick={() => { setStep('input'); onClose(); }}
              className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-primary-600 transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
