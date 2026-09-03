'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FolderGit2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';
import { ProjectRecommendationItem } from '@/lib/types';

interface ScoredProjectItem extends ProjectRecommendationItem {
  matchScore?: number;
  matchReasons?: string[];
}

export default function ProjectsHubPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  
  const [role, setRole] = useState('Software Developer');
  const [projects, setProjects] = useState<ScoredProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/recommendations?role=${role}&studentId=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.recommendations) setProjects(data.recommendations);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [role, studentId]);

  const roles = ['Software Developer', 'Data Analyst', 'Cloud DevOps Associate'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
        </div>

        {/* Header (Section 25 & 26) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Proof of Work Hub</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Industry Project Recommendation Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Bridge the Skill → Project → Job connection with verified architectural capstones.
              </p>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    role === r ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                      {proj.difficulty} Level
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{proj.targetRole}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{proj.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  
                  {proj.matchReasons && proj.matchReasons.length > 0 && (
                    <div className="mt-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1">
                      <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" /> AI Recommendation Rationale:
                      </span>
                      <div className="flex flex-col gap-0.5 pl-4 text-[10px] text-purple-600 leading-snug">
                        {proj.matchReasons.map((reason: string, rIdx: number) => (
                          <span key={rIdx} className="relative before:content-['•'] before:absolute before:-left-3 font-medium">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Tech Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Key Deliverables:</span>
                  <ul className="space-y-1 text-slate-600">
                    {proj.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-bold">Strengthens Resume & Passport ✓</span>
                <Link
                  href={`/student/projects/${proj.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-primary-600 transition-colors flex items-center gap-1"
                >
                  <span>Build Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
