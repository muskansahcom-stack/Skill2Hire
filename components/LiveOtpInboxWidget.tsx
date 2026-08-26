'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Bell, X, Copy, Check, Sparkles, ChevronUp, ChevronDown, RefreshCw, Settings, Smartphone, Send, AlertCircle, Key } from 'lucide-react';

export default function LiveOtpInboxWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'sms_setup'>('feed');
  const [messages, setMessages] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState(0);

  // SMS Gateway config state
  const [provider, setProvider] = useState<'fast2sms' | 'twilio'>('fast2sms');
  const [fast2SmsKey, setFast2SmsKey] = useState('');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioPhone, setTwilioPhone] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [savingGateway, setSavingGateway] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<string | null>(null);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [activeProviders, setActiveProviders] = useState<any>({});

  const fetchLiveDispatches = async () => {
    try {
      const res = await fetch('/api/auth/otp/live-feed');
      const data = await res.json();
      if (data.dispatches && data.dispatches.length > 0) {
        if (data.dispatches.length > lastCount && lastCount > 0) {
          setIsOpen(true);
          setActiveTab('feed');
        }
        setMessages(data.dispatches);
        setLastCount(data.dispatches.length);
      }
    } catch (e) {}
  };

  const fetchGatewayStatus = async () => {
    try {
      const res = await fetch('/api/auth/otp/configure-gateway');
      const data = await res.json();
      setActiveProviders(data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchLiveDispatches();
    fetchGatewayStatus();
    const interval = setInterval(fetchLiveDispatches, 2000);
    return () => clearInterval(interval);
  }, [lastCount]);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGateway(true);
    setGatewayStatus(null);
    setGatewayError(null);

    try {
      const res = await fetch('/api/auth/otp/configure-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          fast2SmsKey,
          twilioSid,
          twilioToken,
          twilioPhone,
          testPhone: testPhone || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to configure gateway');

      setGatewayStatus(data.testResult ? `Gateway active! Test SMS dispatched to ${testPhone}` : 'Gateway credentials saved successfully!');
      fetchGatewayStatus();
      fetchLiveDispatches();
    } catch (err: any) {
      setGatewayError(err.message);
    } finally {
      setSavingGateway(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full shadow-2xl transition-all">
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-cyan-400">
              Live OTP & SMS Gateway
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'feed' ? 'sms_setup' : 'feed')}
              className={`p-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ${
                activeTab === 'sms_setup' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Configure Real SMS Gateway"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[10px]">Real SMS</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab 1: Live Messages Feed */}
        {isOpen && activeTab === 'feed' && (
          <div className="max-h-80 overflow-y-auto p-3 space-y-2.5 bg-slate-950/90 divide-y divide-slate-850">
            {messages.length === 0 ? (
              <div className="text-center py-6 text-slate-400 space-y-2">
                <Mail className="w-8 h-8 mx-auto opacity-30 text-cyan-400" />
                <p className="text-xs">No OTPs dispatched yet.</p>
                <p className="text-[10px] text-slate-500">Click "Send OTP" to receive codes here & on phone.</p>
              </div>
            ) : (
              messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="pt-2.5 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold">
                      {msg.channel === 'EMAIL' ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 flex items-center gap-1 text-[10px]">
                          <Mail className="w-3 h-3" /> Email
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center gap-1 text-[10px]">
                          <Phone className="w-3 h-3" /> SMS
                        </span>
                      )}
                      <span className="text-slate-300 font-mono truncate max-w-[140px]">
                        {msg.destination}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  {/* OTP Code Box */}
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">Verification Code:</span>
                      <span className="text-xl font-black font-mono tracking-widest text-emerald-400">
                        {msg.otpCode}
                      </span>
                    </div>

                    <button
                      onClick={() => copyCode(msg.id, msg.otpCode)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Route: {msg.provider}</span>
                    <span className="text-emerald-400 font-bold">● {msg.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Connect Real Phone SMS Gateway */}
        {isOpen && activeTab === 'sms_setup' && (
          <form onSubmit={handleSaveGateway} className="p-3.5 space-y-3 bg-slate-950/95 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Connect Real Mobile SMS</span>
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                ← Back to Inbox
              </button>
            </div>

            {/* Provider Switcher */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setProvider('fast2sms')}
                className={`py-1 rounded-lg font-bold text-[11px] transition-all ${
                  provider === 'fast2sms' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fast2SMS (India Free)
              </button>
              <button
                type="button"
                onClick={() => setProvider('twilio')}
                className={`py-1 rounded-lg font-bold text-[11px] transition-all ${
                  provider === 'twilio' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Twilio (Global)
              </button>
            </div>

            {provider === 'fast2sms' ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">
                    Fast2SMS Authorization API Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Paste Fast2SMS API Key..."
                    value={fast2SmsKey}
                    onChange={(e) => setFast2SmsKey(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">
                    Get free instant key from <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">fast2sms.com</a> (Dev API)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    required
                    placeholder="ACxxxxxxxxxxxxxxxx"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Twilio Auth Token</label>
                  <input
                    type="password"
                    required
                    placeholder="Auth Token"
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Twilio Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1234567890"
                    value={twilioPhone}
                    onChange={(e) => setTwilioPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-300 mb-1">Test Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {gatewayStatus && (
              <div className="p-2 bg-emerald-950/80 border border-emerald-800 rounded-xl text-[10px] text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{gatewayStatus}</span>
              </div>
            )}

            {gatewayError && (
              <div className="p-2 bg-rose-950/80 border border-rose-800 rounded-xl text-[10px] text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{gatewayError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={savingGateway}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{savingGateway ? 'Connecting...' : 'Save & Send Test SMS to Phone'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
