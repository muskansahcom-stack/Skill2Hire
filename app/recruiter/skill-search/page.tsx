'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Cpu,
  Search,
  CheckCircle2,
  Award,
  Sparkles,
  BookmarkPlus,
  ArrowRight,
  GraduationCap,
  Check,
  Building2
} from 'lucide-react';

export default function SkillFirstSearchPage() {
  const [queryText, setQueryText] = useState(
    'I need candidates with: Python Intermediate, DSA Intermediate, SQL Basic'
  );
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [targetSkills, setTargetSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, boolean>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('/api/recruiter/skill-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText,
          minCgpa: Number(minCgpa)
        })
      });
      const data = await res.json();
      if (data.candidates) {
        setCandidates(data.candidates);
        setTargetSkills(data.targetSkills || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleShortlist = (candId: string) => {
    setShortlistedMap(prev => ({
      ...prev,
      [candId]: !prev[candId]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* 1. HEADER & NATURAL LANGUAGE QUERY (Section 19) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-primary-600" />
              <span>Skill-First Talent Intelligence</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Direct Multi-Skill Candidate Sourcing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Query candidates based on exact required verified technical skills, proficiency levels, and minimum academic benchmarks.
            </p>
          </div>

          {/* Search Query Input */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <textarea
                rows={2}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder='e.g. "I need 50 candidates with: Python Intermediate, DSA Intermediate, SQL Basic"'
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700">Minimum CGPA:</span>
                <select
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none text-xs font-bold text-slate-800"
                >
                  <option value="0">Any CGPA</option>
                  <option value="7.0">7.0+ CGPA</option>
                  <option value="7.5">7.5+ CGPA</option>
                  <option value="8.0">8.0+ CGPA</option>
                  <option value="8.5">8.5+ CGPA</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md shadow-primary-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching Verified Passports...' : 'Search Verified Talent'}</span>
              </button>
            </div>
          </form>

          {/* Parsed Search Target Skills */}
          {targetSkills.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Parsed Required Skills:</span>
              {targetSkills.map(ts => (
                <span key={ts.name} className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {ts.name} ({ts.requiredLevel} ✓)
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. MATCHED CANDIDATES LIST (Section 19) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900">
              Matched Verified Talent ({candidates.length} candidates)
            </h2>
            <span className="text-xs text-slate-500">Ranked by verified assessment compatibility</span>
          </div>

          {candidates.map((cand, idx) => {
            const isShortlisted = shortlistedMap[cand.id];

            return (
              <div
                key={cand.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                      {cand.fullName?.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{cand.fullName}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          Credibility: {cand.credibilityScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {cand.collegeName} • {cand.degree} {cand.department} ({cand.graduationYear}) • CGPA: <strong>{cand.cgpa?.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-primary-600">
                        {cand.matchPercentage}% Match
                      </span>
                      <span className="block text-[10px] text-slate-400 font-semibold">Skill Compatibility</span>
                    </div>

                    <button
                      onClick={() => toggleShortlist(cand.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isShortlisted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      {isShortlisted ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                      <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Verified Skills Strip */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Verified Skill Passport:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.verifiedSkills?.length > 0 ? (
                      cand.verifiedSkills.map((vs: any) => (
                        <span key={vs.skillName} className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-semibold text-[11px]">
                          {vs.skillName} ({vs.level}) ✓ Score: {vs.score}%
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Python (Beginner), SQL (Basic)</span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
