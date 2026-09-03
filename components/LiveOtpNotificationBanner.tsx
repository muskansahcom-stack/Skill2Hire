'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Check, Copy, KeyRound, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface LiveOtpBannerProps {
  filterDestination?: string;
  onSelectOtp?: (code: string) => void;
}

export default function LiveOtpNotificationBanner({ filterDestination, onSelectOtp }: LiveOtpBannerProps) {
  const [latestDispatch, setLatestDispatch] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      try {
        const url = filterDestination
          ? `/api/auth/otp/live-feed?destination=${encodeURIComponent(filterDestination)}`
          : '/api/auth/otp/live-feed';
        const res = await fetch(url);
        const data = await res.json();
        if (data.dispatches && data.dispatches.length > 0 && isMounted) {
          setLatestDispatch(data.dispatches[0]);
        }
      } catch (e) {}
    };

    poll();
    const interval = setInterval(poll, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [filterDestination]);

  if (!latestDispatch) return null;

  const handleCopy = () => {
    if (latestDispatch?.otpCode) {
      navigator.clipboard.writeText(latestDispatch.otpCode);
      setCopied(true);
      if (onSelectOtp) onSelectOtp(latestDispatch.otpCode);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-2 border-emerald-500/50 shadow-xl text-white space-y-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Real-Time Live OTP Inbox Feed
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Just Now
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        <div className="space-y-0.5 min-w-0">
          <div className="text-xs text-slate-300 font-mono truncate">
            To: <strong className="text-white">{latestDispatch.destination}</strong>
          </div>
          <div className="text-[11px] text-slate-400">
            Verification code delivered via {latestDispatch.provider}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-base tracking-widest">
            {latestDispatch.otpCode}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-700" />}
            <span>{copied ? 'Copied!' : 'Auto-Fill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
