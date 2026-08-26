'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Search,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function CareerGuidePage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [searchQuery, setSearchQuery] = useState('Data Analyst');
  const [careerResult, setCareerResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCareerData = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}/recommendations?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.recommendation) {
        setCareerResult(data.recommendation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCareerData(searchQuery.trim());
    }
  };

  const quickRoles = ['Data Analyst', 'Software Developer', 'Cloud DevOps', 'AI Engineer', 'Cybersecurity'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Prompt Input (Section 36) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-primary-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>AI Career Recommendation Navigator</span>
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Tell AI Your Target Role. Get the Complete Roadmap.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Input any dream technical position to receive instant skill requirements, structured course sequences, and live matching corporate jobs.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='e.g. "I want to become a Data Analyst"'
                className="w-full pl-10 pr-4 py-3 text-sm bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 font-bold text-xs text-white shadow-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Generate AI Roadmap</span>
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/10">
            <span className="text-xs text-slate-400">Popular Paths:</span>
            {quickRoles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSearchQuery(role);
                  fetchCareerData(role);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  searchQuery.toLowerCase() === role.toLowerCase()
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Output */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Synthesizing personalized career recommendation...</p>
          </div>
        ) : careerResult ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Required Skills Matrix (Section 36) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Essential Industry Skills for {careerResult.career?.targetRole || searchQuery}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required skills and proficiency levels demanded by companies hiring for this position.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {careerResult.requiredSkills?.map((req: any) => (
                  <div key={req.skill} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="font-extrabold text-sm text-slate-900 block">{req.skill}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      {req.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Structured In-Platform Courses */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <span>Recommended Free Courses to Master These Skills</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete these structured modules to build proficiency and unlock verified assessments.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerResult.courses?.map((c: any) => (
                  <div key={c.id} className="p-5 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{c.category}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">{c.duration}</span>
                      <Link
                        href={`/courses/${c.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>Start Course →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Matching Open Jobs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Matching Open Positions ({careerResult.jobs?.length || 0})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live tech job postings aligned with this career trajectory.
                  </p>
                </div>
                <Link href="/jobs" className="text-xs font-bold text-primary-600 hover:underline">
                  Browse All Jobs →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerResult.jobs?.map((j: any) => (
                  <div key={j.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">{j.companyName}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{j.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{j.location} • {j.salary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">{j.workMode}</span>
                      <Link
                        href={`/jobs/${j.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-primary-600 transition-colors"
                      >
                        View & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
