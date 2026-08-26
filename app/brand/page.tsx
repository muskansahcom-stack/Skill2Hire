'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  TrendingUp,
  Briefcase,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowRight,
  Code2,
  Zap,
  Target,
  Users,
  Building2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function BrandIdentityPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto py-6 px-4">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-primary-50 text-primary-700 font-black text-xs uppercase tracking-wider border border-primary-200 inline-block">
          Official Skill2Hire Identity
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Brand Architecture & Ecosystem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Learn. Verify. Get Hired. — The three-pillar career readiness framework.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 1. MASTER BRAND SHOWCASE BOARD                                         */}
      {/* ========================================================================= */}
      <div className="rounded-[32px] bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12 space-y-10">
        
        {/* Top Row: Hero Logo (Left) + About & Mission (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left 5 Cols: Primary Official Logo & Tagline */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4 py-4 lg:border-r lg:border-slate-100 lg:pr-10">
            <div className="relative w-56 sm:w-64 aspect-square rounded-[36px] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <img
                src="/logo-app-icon.png"
                alt="Skill2Hire Official Brand Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200">
                AI Education-to-Employment
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider border border-purple-200">
                Verified Skill Passport
              </span>
            </div>
          </div>

          {/* Right 7 Cols: About Skill2Hire & Our Mission */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* About Skill2Hire */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                About <span className="text-primary-600">Skill2Hire</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                <strong>Skill2Hire</strong> is an AI-powered Education-to-Employment Intelligence Platform that connects <strong>Students</strong>, <strong>Colleges</strong>, and <strong>Companies</strong> on a single platform. It helps students <span className="text-blue-600 font-bold">learn the right skills</span>, <span className="text-purple-600 font-bold">verify their abilities</span>, and <span className="text-emerald-600 font-bold">become job-ready</span>, while enabling colleges to prepare students based on real industry needs and helping companies find verified, skilled talent.
              </p>

              {/* 3 Pillars Badge Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-blue-600/20">
                    🎓
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900">Students</div>
                    <div className="text-[10px] text-blue-700 font-semibold">Learn, Practice, Prove, Get Hired</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-purple-600/20">
                    🏛️
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900">Colleges</div>
                    <div className="text-[10px] text-purple-700 font-semibold">Train, Track, Placement Ready</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/50 border border-pink-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-pink-600/20">
                    🏢
                  </div>
                  <div>
                    <div className="font-black text-xs text-slate-900">Companies</div>
                    <div className="text-[10px] text-pink-700 font-semibold">Post Jobs, Find Verified Talent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Mission */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Our Mission</span>
              </div>
              <blockquote className="text-xs sm:text-sm text-slate-700 font-semibold italic leading-relaxed">
                "To bridge the gap between <strong>education and employment</strong> by making <strong>skill-based learning, verification, and hiring</strong> smarter, faster, and more effective for everyone."
              </blockquote>
            </div>

          </div>

        </div>

        {/* Middle Row: What Makes Skill2Hire Different? (6 Core Pillars) */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 text-center uppercase tracking-wider text-slate-700">
            What Makes Skill2Hire Different?
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">AI Job Readiness Score</h4>
              <p className="text-[10px] text-slate-500">Real-time 0-100% calculation</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">Skill Gap Analysis</h4>
              <p className="text-[10px] text-slate-500">Role-specific missing skills</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                📈
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">Personalized Learning Path</h4>
              <p className="text-[10px] text-slate-500">Targeted video masterclasses</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">Verified Skill Passport</h4>
              <p className="text-[10px] text-slate-500">Cryptographic scorecards</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">Industry ↔ College Collaboration</h4>
              <p className="text-[10px] text-slate-500">Live demand radar & cohorts</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2 hover:border-primary-400 hover:bg-white hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl group-hover:scale-110 transition-transform">
                👥
              </div>
              <h4 className="font-black text-xs text-slate-900 leading-snug">Direct Hiring Pipeline</h4>
              <p className="text-[10px] text-slate-500">Zero-fraud instant applications</p>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-900 to-purple-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300">
              Don't Just Find a Job.
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              BECOME READY FOR IT.
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/jobs"
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-400/20 transition-transform hover:scale-105"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Jobs</span>
            </Link>
            <Link
              href="/learn"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Skill Academy</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
