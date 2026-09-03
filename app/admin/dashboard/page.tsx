'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStatsData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading ecosystem administration hub...</p>
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {};
  const topSkills = statsData?.topDemandedSkills || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner (Section 40) */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-primary-400" />
              <span>Skill2Hire SuperAdmin Center</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Ecosystem Governance & Global Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Platform-wide telemetry tracking verified collegiate talent, company hiring engagement, and automated curriculum gap resolution.
            </p>
          </div>
        </div>

        {/* 8 Global KPI Metrics (Section 40) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Students</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{stats.totalStudents?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Colleges</span>
            <span className="text-xl font-black text-indigo-600 mt-1 block">{stats.totalColleges}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Companies</span>
            <span className="text-xl font-black text-amber-600 mt-1 block">{stats.totalCompanies}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jobs</span>
            <span className="text-xl font-black text-primary-600 mt-1 block">{stats.totalJobs}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applications</span>
            <span className="text-xl font-black text-slate-800 mt-1 block">{stats.totalApplications?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courses</span>
            <span className="text-xl font-black text-slate-800 mt-1 block">{stats.totalCourses}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Verified Skills</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">{stats.verifiedSkillsCount?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-primary-50 shadow-sm">
            <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Placements</span>
            <span className="text-xl font-black text-indigo-700 mt-1 block">{stats.placementsCount?.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. GRID: PLATFORM DEMAND ANALYTICS & PARTICIPATING ENTITIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Top Demanded Skills */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span>Most Demanded Platform Skills</span>
              </h2>
            </div>

            <div className="space-y-3">
              {topSkills.map((sk: any) => (
                <div key={sk.skillName} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{sk.skillName}</span>
                    <span className="text-[10px] text-slate-500">({sk.category})</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-primary-700">{sk.demandPercent}% Demand</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Registered Colleges & Companies */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Connected Enterprise Partners & Universities</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {statsData?.companies?.slice(0, 6).map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-xs text-slate-900 block truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{c.industry}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
