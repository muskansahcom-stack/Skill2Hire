'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  Building2,
  Calendar,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { CompanyDemandSignal } from '@/lib/types';

export default function CollegeDemandSignalsPage() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [signals, setSignals] = useState<CompanyDemandSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/colleges/${collegeId}/demand-signals`)
      .then(res => res.json())
      .then(data => {
        if (data.signals) setSignals(data.signals);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [collegeId]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 20) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Hiring Forecasts</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Corporate Industry Demand Signals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Partner employers broadcast upcoming hiring headcount and required technical skills directly to your placement cell ahead of recruitment season.
          </p>
        </div>

        {/* 2. DEMAND SIGNALS GRID */}
        <div className="space-y-6">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">{sig.companyName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active Forecast Signal ✓
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-indigo-900">{sig.targetRole}</h2>
                    <p className="text-xs text-slate-500">
                      Expected Headcount: <strong className="text-slate-900">{sig.expectedHiringCount} Students</strong> • Salary: {sig.offeredSalaryBand}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl block">
                    Target Batch: {sig.targetBatchYear} ({sig.targetGraduationDate})
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">Min CGPA: {sig.minCgpa}+</span>
                </div>
              </div>

              {/* Required Skills Matrix */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Mandatory Verified Skills Expected by Employer:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sig.requiredSkills?.map((req: any) => (
                    <span
                      key={req.skill}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5"
                    >
                      <span>{req.skill}</span>
                      <span className="text-[10px] text-indigo-500 font-normal">({req.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Message to Colleges */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
                "{sig.messageToColleges}"
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold">Recommended: Prepare 25+ students via Bootcamp</span>
                <Link
                  href="/college/curriculum-gap"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Create Training Bootcamp</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
