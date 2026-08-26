'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  Building2,
  Users,
  Award,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function CampusPipelinePage() {
  const { profile } = useAuth();
  const companyName = profile?.name || 'TechNova';

  const [selectedCollege, setSelectedCollege] = useState('All');
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.colleges) setColleges(data.colleges);
      })
      .catch(e => console.error(e));
  }, []);

  const pipelineStages = [
    { stage: '1. Interested Students', count: 450, color: 'from-blue-500 to-indigo-500', desc: 'Saved or bookmarked openings' },
    { stage: '2. In-Training Bootcamps', count: 180, color: 'from-indigo-500 to-purple-500', desc: 'Enrolled in college placement bootcamps' },
    { stage: '3. Assessment-Ready', count: 120, color: 'from-purple-500 to-pink-500', desc: 'Completed courses, taking assessments' },
    { stage: '4. Verified Candidates', count: 94, color: 'from-pink-500 to-rose-500', desc: 'Passed Python & DSA assessments with >=75%' },
    { stage: '5. Fully Eligible (90%+)', count: 72, color: 'from-amber-500 to-emerald-500', desc: 'Meets academic & verified skill criteria' },
    { stage: '6. Shortlisted', count: 28, color: 'from-emerald-500 to-teal-500', desc: 'Pre-vetted for technical rounds' },
    { stage: '7. Technical Interviews', count: 16, color: 'from-teal-500 to-cyan-500', desc: 'AI & live engineering interviews' },
    { stage: '8. Selected for Hire 🎉', count: 12, color: 'from-emerald-600 to-emerald-800', desc: 'Final placement offers accepted' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-primary-600" />
                <span>Full-Funnel Campus Pipeline</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {companyName} Collegiate Talent Pipeline
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                End-to-end telemetry monitoring students from campus bootcamps through skill verification and final offer acceptance.
              </p>
            </div>

            {/* University Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Institution:</span>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="All">All Partner Universities</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. FULL PIPELINE FUNNEL (Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Campus Talent Progression Funnel</h2>

          <div className="space-y-3">
            {pipelineStages.map((ps, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-300 transition-all"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-slate-900 block">{ps.stage}</span>
                  <span className="text-[11px] text-slate-500">{ps.desc}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden hidden md:block">
                    <div
                      className={`h-full bg-gradient-to-r ${ps.color} rounded-full`}
                      style={{ width: `${Math.max(10, Math.min(100, (ps.count / 450) * 100))}%` }}
                    />
                  </div>
                  <span className="text-base font-black font-mono text-slate-900 min-w-[50px] text-right">
                    {ps.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Campus Conversion Rate: <strong className="text-slate-900">2.67% (Top Tier)</strong></span>
            <Link
              href="/recruiter/applications"
              className="text-primary-600 font-bold hover:underline"
            >
              Review Active Applications →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
