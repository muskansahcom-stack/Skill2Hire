'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
  Check,
  Target
} from 'lucide-react';
import ExplainableSkillGapCard from '@/components/ExplainableSkillGapCard';
import { ExplainableSkillGapReport } from '@/lib/types';

export default function BecomeReadyPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [selectedTarget, setSelectedTarget] = useState<string>('job_1');
  const [gapReport, setGapReport] = useState<ExplainableSkillGapReport | null>(null);
  const [loadingGap, setLoadingGap] = useState(true);

  const fetchGap = async (targetId: string) => {
    setLoadingGap(true);
    try {
      const url = targetId.startsWith('job_')
        ? `/api/skill-gap?studentId=${studentId}&jobId=${targetId}`
        : `/api/skill-gap?studentId=${studentId}&roleId=${targetId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.report) setGapReport(data.report);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGap(false);
    }
  };

  useEffect(() => {
    fetchGap(selectedTarget);
  }, [studentId, selectedTarget]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Target Opportunity:</span>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs"
            >
              <option value="job_1">TechNova: Software Developer</option>
              <option value="job_2">CloudScale: Cloud DevOps Engineer</option>
              <option value="job_3">DataMinds: Junior Data Analyst</option>
              <option value="role_data_analyst">Role: Data Analyst & BI Specialist</option>
              <option value="role_cloud_devops">Role: Cloud & DevOps Associate</option>
              <option value="role_ai_ml">Role: AI & Machine Learning Engineer</option>
            </select>
          </div>
        </div>

        {/* 1. HEADER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-primary-600" />
              <span>Eligibility Acceleration Engine</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Path to Eligibility: {gapReport?.targetTitle || 'Target Opportunity'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {gapReport?.targetCompany ? `Employer: ${gapReport.targetCompany} • ` : ''}
                Overall Match: <strong className="text-amber-600">{gapReport?.overallMatchScore || 0}%</strong> • Target to Unlock Application: <strong className="text-emerald-600">75%+ Eligible ✓</strong>
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shrink-0">
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">Status</span>
              <span className={`text-xl font-black font-mono ${gapReport?.isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                {gapReport?.isEligible ? 'Eligible to Apply ✓' : 'Preparation Required'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. EXPLAINABLE SKILL GAP ENGINE DIAGNOSTIC & ROADMAP */}
        <ExplainableSkillGapCard
          report={gapReport}
          isLoading={loadingGap}
          showRoadmap={true}
        />

        {/* 3. RECALCULATE ELIGIBILITY CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400 block">Final Milestone</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Verify Your Competency to Fast-Track Shortlisting
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Once you take the recommended verification assessments and build practical project evidence, your match score will update in real-time across company recruiter dashboards.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/assessments/asm_python"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Take Verification Assessment</span>
            </Link>

            {selectedTarget.startsWith('job_') && (
              <Link
                href={`/jobs/${selectedTarget}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>View Job Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
