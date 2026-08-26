'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  GraduationCap,
  BookmarkPlus,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function CandidateSearchPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSkill, setSearchSkill] = useState('');
  const [minCgpa, setMinCgpa] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, boolean>>({});

  const loadCandidates = async () => {
    setLoading(true);
    try {
      let url = `/api/recruiter/candidates?verified=${onlyVerified}`;
      if (searchSkill) url += `&skill=${encodeURIComponent(searchSkill)}`;
      if (minCgpa > 0) url += `&minCgpa=${minCgpa}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.candidates) {
        setCandidates(data.candidates);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [searchSkill, minCgpa, onlyVerified]);

  const toggleShortlist = (candId: string) => {
    setShortlistedMap(prev => ({
      ...prev,
      [candId]: !prev[candId]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* Header & Search (Section 33) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Talent Discovery</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Search Verified Collegiate Candidates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Filter candidates by verified assessment scores, university, CGPA, and specific coding capabilities.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Filter by skill (Python, DSA, SQL, AWS)..."
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="0">All CGPA Ranges</option>
                <option value="7.5">Min CGPA 7.5+</option>
                <option value="8.0">Min CGPA 8.0+</option>
                <option value="8.5">Min CGPA 8.5+</option>
                <option value="9.0">Min CGPA 9.0+</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>Only Verified Skill Passports ✓</span>
              </label>
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid (Section 33) */}
        <div>
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Searching verified candidate directory...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No candidates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((cand) => {
                const isShortlisted = shortlistedMap[cand.id];

                return (
                  <div
                    key={cand.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      {/* Candidate Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h2 className="text-base font-extrabold text-slate-900">{cand.fullName}</h2>
                          <p className="text-xs text-slate-500">{cand.collegeName}</p>
                          <p className="text-[11px] text-slate-400">
                            {cand.degree} {cand.department} ({cand.graduationYear})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            CGPA: {cand.cgpa?.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-emerald-600 font-bold mt-1">
                            {cand.jobMatch || cand.placementReadiness}% Compatibility
                          </span>
                        </div>
                      </div>

                      {/* Verified Skills Passport Preview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Verified Skill Credentials:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.verifiedSkills?.length > 0 ? (
                            cand.verifiedSkills.map((vs: any) => (
                              <span
                                key={vs.skillName}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300"
                              >
                                {vs.skillName} ({vs.level}) ✓
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Self-declared portfolio only</span>
                          )}
                        </div>
                      </div>

                      {/* Bio summary */}
                      {cand.bio && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {cand.bio}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons (Section 33: View Profile, Shortlist) */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleShortlist(cand.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isShortlisted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isShortlisted ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                        <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}</span>
                      </button>

                      <Link
                        href={`/student/skills`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-primary-600 transition-colors"
                      >
                        View Passport
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
