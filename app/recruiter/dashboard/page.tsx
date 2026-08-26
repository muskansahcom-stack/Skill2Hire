'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Search,
  Layers,
  Clock
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RecruiterDashboard() {
  const { profile } = useAuth();
  const companyId = profile?.id || 'comp_1';

  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes, candRes] = await Promise.all([
          fetch(`/api/jobs?companyId=${companyId}`),
          fetch(`/api/recruiter/applications?companyId=${companyId}`),
          fetch(`/api/recruiter/candidates?verified=true`)
        ]);

        const jobsData = await jobsRes.json();
        const appsData = await appsRes.json();
        const candData = await candRes.json();

        if (jobsData.jobs) setJobs(jobsData.jobs);
        if (appsData.applications) setApplications(appsData.applications);
        if (candData.candidates) setCandidates(candData.candidates.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [companyId]);

  const companyName = profile?.name || 'TechNova';
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;
  const interviewsCount = applications.filter(a => a.status === 'Interview').length;

  return (
    <ProtectedRoute allowedRoles={['company']}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner (Section 31) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-slate-900/20">
              <Building2 className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {companyName} Recruiter Hub
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Verified Employer ✓
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Source verified collegiate talent backed by real coding assessments and AI job matching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/candidates"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search Candidates</span>
            </Link>
            <Link
              href="/recruiter/jobs/new"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post Job with AI Extraction</span>
            </Link>
          </div>
        </div>

        {/* 1. RECRUITER KPI METRICS (Section 31) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Openings</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{jobs.length || 3}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Applicants</span>
            <span className="text-3xl font-black text-primary-600 mt-1 block">{applications.length || 14}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Shortlisted</span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">{shortlistedCount || 6}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Interviews</span>
            <span className="text-3xl font-black text-indigo-600 mt-1 block">{interviewsCount || 4}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Verified Matches</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">91%+ Top Match</span>
          </div>
        </div>

        {/* 2. GRID: ACTIVE RECRUITER PIPELINE & TALENT POOL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Applicants (Section 31 & 30) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span>Applicant Pipeline & Compatibility</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Candidates ranked by verified skill compatibility score.</p>
              </div>
              <Link href="/recruiter/applications" className="text-xs font-bold text-primary-600 hover:underline">
                Manage All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {applications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No applicants yet. Post a job or run demo workflow Step 10.
                </div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{app.studentName}</span>
                        <span className="text-xs font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          {app.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{app.studentCollege} • Role: <strong>{app.jobTitle}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {app.status}
                      </span>
                      <Link
                        href="/recruiter/applications"
                        className="px-3 py-1 rounded-lg text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Top Verified Talent Pool (Section 33) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Top Verified Candidates</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Pre-vetted through Skill2Hire assessments.</p>
              </div>
              <Link href="/recruiter/candidates" className="text-xs font-bold text-primary-600 hover:underline">
                Search All →
              </Link>
            </div>

            <div className="space-y-3">
              {candidates.map((cand) => (
                <div key={cand.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{cand.fullName}</h3>
                      <p className="text-[10px] text-slate-500">{cand.collegeName} • CGPA: {cand.cgpa?.toFixed(2)}</p>
                    </div>
                    <span className="font-mono font-bold text-xs text-emerald-600">
                      {cand.placementReadiness}% Ready
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cand.verifiedSkills?.slice(0, 3).map((v: any) => (
                      <span key={v.skillName} className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {v.skillName} ✓ ({v.score}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}
