'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Zap,
  GraduationCap,
  Building2,
  Users,
  Layers,
  Award,
  Flame,
  Target,
  Code2
} from 'lucide-react';

export default function DifferentiationPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Competitive Differentiation & Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Don’t Just Find a Job.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              Become Ready For It.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Traditional portals only connect candidates to job postings. <strong>Skill2Hire</strong> is an 
            <strong> Education-to-Employment Intelligence Platform</strong> that bridges the gap between what companies require, what universities teach, and what students know.
          </p>
        </div>

        {/* THE 3-PILLAR COMPARISON MATRIX (Section 36) */}
        <div className="space-y-10">
          
          {/* 1. FOR STUDENTS */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">1. Student Journey</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  From "Am I Eligible?" to "How Do I Become Eligible?"
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Traditional */}
              <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Traditional Job Portals (Unstop, LinkedIn, Indeed)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Search 1,000s of generic job postings.<br />
                  2. Hit <strong>Apply</strong> with an unverified self-declared resume.<br />
                  3. Rejected by ATS algorithms without explanation or feedback.<br />
                  4. Left wondering what skills were actually missing.
                </p>
              </div>

              {/* Skill2Hire */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Skill2Hire Education-to-Employment Intelligence</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  1. Select target dream job.<br />
                  2. <strong>"Why Am I Not Eligible?"</strong> shows exact missing skill levels.<br />
                  3. <strong>"Become Job Ready"</strong> creates a free learning roadmap.<br />
                  4. Take interactive assessments & earn <strong>Verified ✓ Skill Passports</strong>.<br />
                  5. Recalculate match to <strong>91%+</strong> and apply as a pre-vetted candidate.
                </p>
              </div>
            </div>
          </div>

          {/* 2. FOR COLLEGES / UNIVERSITIES */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">2. College Placement Cells</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  From "Hoping for Placements" to "Industry Demand-Driven Training"
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Traditional */}
              <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Traditional University Placement Cells</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Teach legacy syllabus designed years ago.<br />
                  2. Hope companies come for on-campus drives during final semester.<br />
                  3. No visibility into student skill readiness until company rejections arrive.<br />
                  4. Placement rate drops due to unaddressed curriculum gaps.
                </p>
              </div>

              {/* Skill2Hire */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Skill2Hire Institutional Intelligence</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  1. <strong>Industry Skill Heatmap</strong> tracks corporate demand vs student proficiency.<br />
                  2. <strong>AI Curriculum Gap Engine</strong> flags critical syllabus deficits.<br />
                  3. Auto-generate 8-week bootcamps targeting missing competencies.<br />
                  4. Form intervention cohorts (e.g. <em>DSA Foundation Group</em>).<br />
                  5. Track placement readiness cohort improvement from 38% to 80%+.
                </p>
              </div>
            </div>
          </div>

          {/* 3. FOR COMPANIES & RECRUITERS */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">3. Corporate Recruiters</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  From "Sifting Thousands of Unvetted Resumes" to "Skill-First Sourcing"
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Traditional */}
              <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Traditional Recruitment Portals</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Post a job and receive 2,000 unverified resumes with keyword stuffing.<br />
                  2. Spend hundreds of recruiter hours on first-round filtering.<br />
                  3. High rejection rate at technical round because self-declared skills were fake.<br />
                  4. No collaboration mechanism with universities.
                </p>
              </div>

              {/* Skill2Hire */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Skill2Hire Talent Intelligence Hub</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  1. <strong>AI Skill Extractor</strong> parses exact required competencies & proficiency.<br />
                  2. <strong>Skill-First Search</strong> queries verified talent (e.g. <em>Python Int + DSA Int</em>).<br />
                  3. Candidates ranked by verified assessment scores & credibility index.<br />
                  4. Broadcast <strong>Demand Signals</strong> to colleges to prepare candidates before hiring season.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* THE FULL CLOSED LOOP DIAGRAM (Section 1 & 2) */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400 block">The Core Loop</span>
            <h2 className="text-2xl sm:text-3xl font-black">
              The Education-to-Employment Closed Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Every feature in Skill2Hire directly supports this continuous learning and hiring feedback loop:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-primary-400 font-black text-sm block">1. REQUIREMENT</span>
              <span className="text-slate-300 text-[11px]">Company defines skills</span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-indigo-400 font-black text-sm block">2. GAP</span>
              <span className="text-slate-300 text-[11px]">AI detects deficits</span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-black text-sm block">3. LEARNING</span>
              <span className="text-slate-300 text-[11px]">Free in-platform courses</span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-amber-400 font-black text-sm block">4. VERIFY</span>
              <span className="text-slate-300 text-[11px]">Timed coding assessment</span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-primary-400 font-black text-sm block">5. ELIGIBILITY</span>
              <span className="text-slate-300 text-[11px]">Match jumps to 90%+</span>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-400 font-black text-sm block">6. HIRING</span>
              <span className="text-slate-300 text-[11px]">Pre-vetted job placement</span>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all"
            >
              <span>Explore Platform Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
