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
  Check
} from 'lucide-react';

export default function BecomeReadyPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/students/${studentId}/roadmap?jobId=job_1`)
      .then(res => res.json())
      .then(data => {
        if (data.roadmap) setRoadmap(data.roadmap);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Generating your personalized path to eligibility...</p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      step: 1,
      title: 'Python Intermediate',
      category: 'Core Language',
      courseTitle: 'Python Fundamentals & OOP for Placement',
      courseUrl: '/courses/crs_python',
      assessmentTitle: 'Python Verification Assessment',
      assessmentUrl: '/assessments/asm_python',
      status: 'Ready to Take',
      impact: '+14% Match'
    },
    {
      step: 2,
      title: 'DSA Intermediate',
      category: 'Algorithms & Data Structures',
      courseTitle: 'Data Structures & Algorithms Masterclass',
      courseUrl: '/courses/crs_dsa',
      assessmentTitle: 'DSA Timed Assessment',
      assessmentUrl: '/assessments/asm_dsa',
      status: 'Pending',
      impact: '+15% Match'
    },
    {
      step: 3,
      title: 'AWS Cloud Basics',
      category: 'Infrastructure',
      courseTitle: 'Cloud Fundamentals (AWS & Cloud Architecture)',
      courseUrl: '/courses/crs_cloud',
      assessmentTitle: 'Cloud Assessment',
      assessmentUrl: '/courses/crs_cloud',
      status: 'Pending',
      impact: '+8% Match'
    },
    {
      step: 4,
      title: 'AI Interview Simulation',
      category: 'Mock Evaluation',
      courseTitle: 'Simulate Technical & Behavioral Interview',
      courseUrl: '/student/interview-coach',
      assessmentTitle: 'Interview Coach Rubric',
      assessmentUrl: '/student/interview-coach',
      status: 'Pending',
      impact: '+6% Match'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 5) */}
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
                Your Path to: Software Developer Opening
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Target Employer: <strong>TechNova</strong> • Current Match: <strong className="text-amber-600">62%</strong> • Target: <strong className="text-emerald-600">90%+ Eligible ✓</strong>
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shrink-0">
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">Projected Eligibility</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">91%+ Eligible ✓</span>
            </div>
          </div>
        </div>

        {/* 2. SEQUENTIAL STEP PROGRESSION (Section 5) */}
        <div className="space-y-4">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
                    {st.step}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{st.category}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                        {st.impact}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{st.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Link
                    href={st.courseUrl}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Free Course</span>
                  </Link>

                  <Link
                    href={st.assessmentUrl}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Verify Skill →</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. STEP 6 RECALCULATE ELIGIBILITY CTA (Section 5) */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400 block">Final Milestone</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Step 6: Recalculate Compatibility & Submit Application
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Once Python and DSA assessments are passed (Score ≥ 75%), your match score will automatically jump from 62% to 91%, unlocking the <strong>"Apply Now"</strong> button.
          </p>

          <div className="pt-2">
            <Link
              href="/jobs/job_1"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
            >
              <span>View Software Developer Opening</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
