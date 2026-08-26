'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  ArrowRight,
  BookOpen,
  Plus,
  Zap,
  Check
} from 'lucide-react';

export default function CurriculumGapPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [gapData, setGapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingBootcamp, setCreatingBootcamp] = useState(false);
  const [bootcampCreated, setBootcampCreated] = useState(false);

  const loadGapData = async () => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}/curriculum-gap`);
      const data = await res.json();
      if (data.curriculumGaps) {
        setGapData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGapData();
  }, [collegeId]);

  const handle1ClickCreateBootcamp = async () => {
    setCreatingBootcamp(true);
    try {
      const res = await fetch(`/api/colleges/${collegeId}/training-programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: gapData?.recommendedBootcampTitle || 'Industry Placement Bootcamp (Python + DSA + SQL)',
          description: 'Intensive 8-week placement training bootcamp covering practical Python OOP, Data Structures & Algorithms, and relational database queries.',
          durationWeeks: 8,
          targetSkills: gapData?.recommendedSkills || ['Python', 'DSA', 'SQL'],
          targetStudentCount: 200
        })
      });
      const data = await res.json();
      if (data.success) {
        setBootcampCreated(true);
        setTimeout(() => {
          router.push('/college/training');
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingBootcamp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Comparing college curriculum against live corporate demand...</p>
        </div>
      </div>
    );
  }

  const gaps = gapData?.curriculumGaps || [];
  const currentSyllabus = gapData?.currentCurriculum || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* 1. HERO AI GAP SPOTLIGHT (Sections 19 & 38) */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-primary-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Industry–Curriculum Gap Analysis Engine</span>
              </span>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Align University Syllabi with Real-Time Tech Hiring
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Skill2Hire continuously compares your accredited university syllabus against active company hiring postings to detect syllabus blindspots before placement season starts.
              </p>
            </div>

            {/* 1-Click AI Auto-Bootcamp Button (Section 38 & Step 4) */}
            <div className="shrink-0">
              <button
                onClick={handle1ClickCreateBootcamp}
                disabled={creatingBootcamp || bootcampCreated}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                {bootcampCreated ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Bootcamp Created & Populated! ✓</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>{creatingBootcamp ? 'Generating Bootcamp...' : '1-Click Create Placement Bootcamp (Step 4)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Recommendation Banner (Section 38 specification) */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>Skill2Hire AI Recommendation:</strong> “Based on current industry hiring demand, create a <span className="text-amber-300 font-bold">Python + DSA + SQL</span> placement training program to elevate cohort readiness from 62% to 90%+.”
            </p>
          </div>
        </div>

        {/* 2. CURRICULUM GAP MATRIX (Section 19) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Industry–Curriculum Gap Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed comparison of industry hiring demand vs university course coverage.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Industry Demand</th>
                  <th className="py-3 px-4">Curriculum Coverage</th>
                  <th className="py-3 px-4">Gap Status</th>
                  <th className="py-3 px-4">AI Recommendation</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gaps.map((item: any) => {
                  const isCritical = item.gapStatus === 'Critical Gap';
                  const isModerate = item.gapStatus === 'Moderate Gap';

                  return (
                    <tr key={item.skillName} className={`hover:bg-slate-50/80 transition-colors ${isCritical ? 'bg-rose-50/20' : ''}`}>
                      <td className="py-4 px-4 font-bold text-slate-900 text-sm">{item.skillName}</td>
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-slate-900">{item.demandPercent}%</span>
                        <span className="text-[10px] text-slate-400 block">({item.industryDemand})</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.curriculumCoverage === 'High' ? 'bg-emerald-100 text-emerald-800' :
                          item.curriculumCoverage === 'Medium' ? 'bg-blue-100 text-blue-800' :
                          item.curriculumCoverage === 'Low' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.curriculumCoverage}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.gapStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium max-w-xs">
                        {item.recommendation}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[11px] font-bold text-indigo-700 block">
                          {item.suggestedAction}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. CURRENT REGISTERED SYLLABUS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Current Department Syllabus on File</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Accredited Computer Science curriculum for Apex University.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentSyllabus.map((sub: any) => (
              <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Semester {sub.semester}</span>
                <h3 className="font-bold text-slate-900 text-xs">{sub.subjectName}</h3>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {sub.coveredSkills?.map((sk: string) => (
                    <span key={sk} className="text-[10px] font-semibold px-2 py-0.2 rounded bg-indigo-100 text-indigo-800">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
