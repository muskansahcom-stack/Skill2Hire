'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Eye,
  Server,
  UserCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SecurityTestCase {
  id: string;
  title: string;
  category: 'ROLE_GUARD' | 'OWNERSHIP' | 'OTP_SECURITY' | 'PRIVACY';
  description: string;
  attackerRole: 'student' | 'college' | 'company' | 'unauthenticated';
  targetEndpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  expectedStatus: number;
  expectedMessage: string;
}

export default function SecurityAuditPage() {
  const { user, role, profile, switchPersona } = useAuth();

  const [testResults, setTestResults] = useState<Record<string, { status: 'PASS' | 'FAIL' | 'RUNNING'; httpCode?: number; responseData?: any }>>({});
  const [runningAll, setRunningAll] = useState(false);

  const SECURITY_TEST_SUITE: SecurityTestCase[] = [
    {
      id: 'test_1',
      title: 'Student Attempting College Dashboard API',
      category: 'ROLE_GUARD',
      description: 'A student session attempts to query private college curriculum gap signals.',
      attackerRole: 'student',
      targetEndpoint: '/api/colleges/col_1/curriculum-gap',
      method: 'GET',
      expectedStatus: 403,
      expectedMessage: 'Access denied. You do not have permission.'
    },
    {
      id: 'test_2',
      title: 'Student Attempting Recruiter Applications API',
      category: 'ROLE_GUARD',
      description: 'A student session attempts to inspect company job applications and applicants list.',
      attackerRole: 'student',
      targetEndpoint: '/api/recruiter/applications',
      method: 'GET',
      expectedStatus: 403,
      expectedMessage: 'Access denied.'
    },
    {
      id: 'test_3',
      title: 'Cross-Student ID Tampering (Profile Ownership)',
      category: 'OWNERSHIP',
      description: 'Alex Rivera (std_1) changes URL ID to request private profile of another student (std_2).',
      attackerRole: 'student',
      targetEndpoint: '/api/students/std_2',
      method: 'GET',
      expectedStatus: 403,
      expectedMessage: 'Access denied. You cannot view or modify another entity\'s private records.'
    },
    {
      id: 'test_4',
      title: 'Cross-Student Academic Transcript ID Tampering',
      category: 'OWNERSHIP',
      description: 'Student attempts to view official semester grades and SGPA report of another student.',
      attackerRole: 'student',
      targetEndpoint: '/api/students/std_2/academic-report',
      method: 'GET',
      expectedStatus: 403,
      expectedMessage: 'Access denied.'
    },
    {
      id: 'test_5',
      title: 'Unauthenticated API Request Block',
      category: 'ROLE_GUARD',
      description: 'An anonymous caller without JWT session cookie requests protected student skills.',
      attackerRole: 'unauthenticated',
      targetEndpoint: '/api/students/std_1/skills',
      method: 'GET',
      expectedStatus: 401,
      expectedMessage: 'Authentication required. Please login.'
    },
    {
      id: 'test_6',
      title: 'Incorrect OTP Code Rejection',
      category: 'OTP_SECURITY',
      description: 'Attacker enters wrong 6-digit verification code.',
      attackerRole: 'student',
      targetEndpoint: '/api/auth/otp/verify',
      method: 'POST',
      expectedStatus: 400,
      expectedMessage: 'Invalid verification code.'
    },
    {
      id: 'test_7',
      title: 'Student Accessing Authorized Own Profile',
      category: 'PRIVACY',
      description: 'Student requests their own profile (std_1) with valid ownership session.',
      attackerRole: 'student',
      targetEndpoint: '/api/students/std_1',
      method: 'GET',
      expectedStatus: 200,
      expectedMessage: 'Authorized and successful response.'
    }
  ];

  const runSingleTest = async (test: SecurityTestCase) => {
    setTestResults(prev => ({ ...prev, [test.id]: { status: 'RUNNING' } }));

    try {
      // Simulate caller headers based on attackerRole
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (test.attackerRole === 'student') {
        headers['x-user-id'] = 'u_student_1';
      } else if (test.attackerRole === 'college') {
        headers['x-user-id'] = 'u_col_1';
      } else if (test.attackerRole === 'company') {
        headers['x-user-id'] = 'u_comp_1';
      }

      let res: Response;
      if (test.method === 'POST') {
        res = await fetch(test.targetEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ identifier: 'test@student.com', code: '000000', purpose: 'registration' })
        });
      } else {
        res = await fetch(test.targetEndpoint, { method: 'GET', headers });
      }

      const data = await res.json().catch(() => ({}));
      const isPassed = res.status === test.expectedStatus;

      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          status: isPassed ? 'PASS' : 'FAIL',
          httpCode: res.status,
          responseData: data
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          status: 'FAIL',
          httpCode: 500,
          responseData: { error: err.message }
        }
      }));
    }
  };

  const runAllTests = async () => {
    setRunningAll(true);
    for (const test of SECURITY_TEST_SUITE) {
      await runSingleTest(test);
    }
    setRunningAll(false);
  };

  const passCount = Object.values(testResults).filter(r => r.status === 'PASS').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Live Hackathon Security & Access Control Suite</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Role-Based Access Control & Ownership Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify that student, college, and company boundaries are strictly enforced on backend APIs with server-side ownership and cryptographic session checks.
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={runningAll}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 shrink-0"
          >
            <Play className={`w-4 h-4 ${runningAll ? 'animate-spin' : ''}`} />
            <span>{runningAll ? 'Executing Suite...' : 'Run All Security Tests'}</span>
          </button>
        </div>

        {/* Live Score Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Security Tests</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{SECURITY_TEST_SUITE.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Passed Checks</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{passCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active User Session</span>
            <span className="text-base font-black text-primary-600 mt-2 block font-mono">{user?.name} ({role.toUpperCase()})</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Protection Architecture</span>
            <span className="text-xs font-black text-slate-800 mt-2 block">JWT + HttpOnly + RBAC</span>
          </div>
        </div>

        {/* Test Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <span>Interactive Penetration & Authorization Matrix</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Click "Run Test" on any vector to inspect live HTTP response</span>
          </div>

          <div className="divide-y divide-slate-100">
            {SECURITY_TEST_SUITE.map((test) => {
              const res = testResults[test.id];

              return (
                <div key={test.id} className="p-6 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          test.category === 'ROLE_GUARD' ? 'bg-purple-100 text-purple-700' :
                          test.category === 'OWNERSHIP' ? 'bg-rose-100 text-rose-700' :
                          test.category === 'OTP_SECURITY' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {test.category}
                        </span>
                        <h3 className="text-sm font-black text-slate-900">{test.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{test.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {res && (
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                          {res.status === 'PASS' ? (
                            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> PASS (HTTP {res.httpCode})
                            </span>
                          ) : res.status === 'RUNNING' ? (
                            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 flex items-center gap-1">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RUNNING...
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 flex items-center gap-1 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" /> FAIL (HTTP {res.httpCode})
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => runSingleTest(test)}
                        disabled={res?.status === 'RUNNING'}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 text-cyan-400" /> Run Test
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                    <div>
                      <span className="text-cyan-400 font-bold">{test.method}</span> {test.targetEndpoint}
                    </div>
                    <div className="text-slate-400">
                      Caller Role: <strong className="text-amber-400">{test.attackerRole}</strong> | Expected: <strong className="text-emerald-400">{test.expectedStatus}</strong>
                    </div>
                  </div>

                  {res?.responseData && (
                    <div className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <span className="text-slate-500 block mb-1">Server Response Payload:</span>
                      <code>{JSON.stringify(res.responseData, null, 2)}</code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
