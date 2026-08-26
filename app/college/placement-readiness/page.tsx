'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Plus
} from 'lucide-react';
import { StudentCohortGroup } from '@/lib/types';

export default function PlacementReadinessBatchPage() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [batchYear, setBatchYear] = useState('2026');
  const [data, setData] = useState<any>(null);
  const [cohorts, setCohorts] = useState<StudentCohortGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/colleges/${collegeId}/batch-analytics?batchYear=${batchYear}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.stats) {
          setData(resData.stats);
          setCohorts(resData.recommendedCohorts || []);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [collegeId, batchYear]);

  const stats = data || {
    totalStudents: 240,
    placementReady: 126,
    needsTraining: 114,
    placementRateExpected: 52
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 23) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Batch Readiness Telemetry</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Placement Readiness Batch Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Monitor student readiness across graduating batches and automatically assemble targeted skill intervention cohorts.
              </p>
            </div>

            {/* Batch Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Batch:</span>
              <select
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="2026">Class of 2026 (CSE & IT)</option>
                <option value="2027">Class of 2027 (Pre-final)</option>
              </select>
            </div>
          </div>

          {/* 4 KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Batch Students</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalStudents}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Placement Ready ✓</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats.placementReady}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Needs Training</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">{stats.needsTraining}</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Projected Placement Rate</span>
              <span className="text-2xl font-black text-indigo-700 mt-1 block">{stats.placementRateExpected}%</span>
            </div>
          </div>
        </div>

        {/* 2. AUTOMATED STUDENT COHORTS (Section 24) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Automated Student Intervention Cohorts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted student groupings dynamically assembled based on shared skill deficits.
              </p>
            </div>
            <Link
              href="/college/training"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
            >
              Manage Bootcamps
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cohorts.map((ch) => (
              <div
                key={ch.id}
                className="p-6 rounded-3xl border border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {ch.targetSkill} Intervention • {ch.recommendedDurationWeeks} Weeks
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{ch.name}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
                    {ch.studentCount} Students
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {ch.reason}
                </p>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500">Target: <strong className="text-slate-900">{ch.targetLevel} Level</strong></span>
                  <Link
                    href="/college/curriculum-gap"
                    className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Assign Training Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
