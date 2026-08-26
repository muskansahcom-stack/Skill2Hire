'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Check, Copy, X, MessageSquare, Sparkles } from 'lucide-react';

export default function SmsNotificationBanner() {
  const [activeBanner, setActiveBanner] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastDispatchedId, setLastDispatchedId] = useState<string | null>(null);

  // Sound Chime using native Web Audio API (zero audio file dependencies)
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  };

  // Trigger Native OS Notification
  const triggerNativeOsNotification = (msg: any) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`💬 SMS Message from Skill2Hire`, {
          body: `Verification Code: ${msg.otpCode} for ${msg.destination}`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(`💬 SMS Message from Skill2Hire`, {
              body: `Verification Code: ${msg.otpCode} for ${msg.destination}`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  const checkIncomingSms = async () => {
    try {
      const res = await fetch('/api/auth/otp/live-feed');
      const data = await res.json();
      if (data.dispatches && data.dispatches.length > 0) {
        const latest = data.dispatches[0];
        if (latest.id !== lastDispatchedId) {
          setLastDispatchedId(latest.id);
          setActiveBanner(latest);
          playChime();
          triggerNativeOsNotification(latest);

          // Auto dismiss banner after 12 seconds
          setTimeout(() => {
            setActiveBanner((current: any) => (current?.id === latest.id ? null : current));
          }, 12000);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    // Request permission once on mount
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkIncomingSms, 1500);
    return () => clearInterval(interval);
  }, [lastDispatchedId]);

  if (!activeBanner) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
      <div className="pointer-events-auto max-w-md w-full bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-3xl border border-slate-700/80 shadow-2xl shadow-cyan-950/40 space-y-2.5">
        
        {/* App Notification Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-200">
                {activeBanner.channel === 'SMS' ? 'MESSAGES • MOBILE SMS' : 'MAIL • VERIFICATION'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                To: {activeBanner.destination}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">now</span>
            <button
              onClick={() => setActiveBanner(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Your Skill2Hire verification code is{' '}
              <span className="text-lg font-black font-mono tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                {activeBanner.otpCode}
              </span>
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block">
              ⏱️ Valid for 5 minutes. Do not share this code.
            </span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(activeBanner.otpCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-cyan-500/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
