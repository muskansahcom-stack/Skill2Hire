'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function JobsSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const initialQuery = searchParams.get('q') || searchParams.get('role') || '';
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || 'All');
  const [requiredSkill, setRequiredSkill] = useState(searchParams.get('skill') || 'All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [sort, setSort] = useState<'relevance' | 'best_match' | 'newest' | 'highest_salary'>('best_match');

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick preset roles
  const presetRoles = [
    'Python Developer',
    'Data Scientist',
    'Software Engineer',
    'Java Developer',
    'Frontend Developer',
    'Data Analyst',
    'AI Engineer',
    'Internship'
  ];

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (location !== 'All') params.set('location', location);
        if (workMode !== 'All') params.set('workMode', workMode);
        if (employmentType !== 'All') params.set('employmentType', employmentType);
        if (requiredSkill !== 'All') params.set('skill', requiredSkill);
        if (onlyEligible) params.set('onlyEligible', 'true');
        params.set('sort', sort);
        params.set('studentId', studentId);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [query, location, workMode, employmentType, requiredSkill, onlyEligible, sort, studentId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Search Section */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full bg-primary-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-primary-500/30 inline-block">
              Skill2Hire Placement Directory
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Verified Job & Internship Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Discover verified technical roles with instant AI Skill Gap analysis and personalized learning bridges.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 sm:p-2 shadow-lg border border-slate-200 gap-2">
              <Search className="w-5 h-5 text-primary-600 ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by role, company, or skill (e.g., Python Developer, Data Scientist)..."
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium px-2 text-sm sm:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600 text-xs font-bold shrink-0"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Preset Roles Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Popular Roles:</span>
            {presetRoles.map((role) => (
              <button
                key={role}
                onClick={() => setQuery(role)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  query === role
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Main Workspace: Filters Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ========================================================================= */}
          {/* 🎛️ 1. FILTERS SIDEBAR                                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                  <h3 className="font-black text-sm text-slate-900">Job Filters</h3>
                </div>
                <button
                  onClick={() => {
                    setQuery('');
                    setLocation('All');
                    setWorkMode('All');
                    setEmploymentType('All');
                    setRequiredSkill('All');
                    setOnlyEligible(false);
                    setSort('best_match');
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-primary-600"
                >
                  Reset
                </button>
              </div>

              {/* Eligibility Checkbox */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyEligible}
                    onChange={(e) => setOnlyEligible(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300"
                  />
                  <span className="text-xs font-black text-emerald-900">Only Show Eligible Roles</span>
                </label>
                <p className="text-[10px] text-emerald-700 pl-6 leading-tight">
                  Filters roles where your verified skills meet all requirements.
                </p>
              </div>

              {/* Work Mode */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 focus:border-primary-500 focus:outline-none"
                >
                  <option value="All">All Modes (Remote, Hybrid, On-site)</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">Job Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 focus:border-primary-500 focus:outline-none"
                >
                  <option value="All">All Types (Full-time & Internship)</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Required Skill */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">Required Skill</label>
                <select
                  value={requiredSkill}
                  onChange={(e) => setRequiredSkill(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 focus:border-primary-500 focus:outline-none"
                >
                  <option value="All">All Skills</option>
                  <option value="Python">Python</option>
                  <option value="DSA">Data Structures (DSA)</option>
                  <option value="SQL">SQL</option>
                  <option value="React">React</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="AWS">AWS Cloud</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Linux CLI">Linux CLI</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 p-2.5 focus:border-primary-500 focus:outline-none"
                >
                  <option value="All">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="Palo Alto">Palo Alto, CA</option>
                  <option value="New York">New York, NY</option>
                  <option value="Seattle">Seattle, WA</option>
                  <option value="Chicago">Chicago, IL</option>
                  <option value="Austin">Austin, TX</option>
                </select>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 📄 2. JOB RESULTS FEED                                                    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Results Header + Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
              <div className="text-xs font-bold text-slate-600">
                Found <span className="font-black text-slate-900">{jobs.length}</span> matching opportunities
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e: any) => setSort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
                >
                  <option value="best_match">Best Match %</option>
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest Posted</option>
                  <option value="highest_salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
                <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Matching jobs with your verified skills...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                  💼
                </div>
                <h3 className="font-black text-lg text-slate-900">No jobs found matching current filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing some filters or searching for broader terms like "Software", "Python", or "Internship".
                </p>
                <button
                  onClick={() => {
                    setQuery('');
                    setLocation('All');
                    setWorkMode('All');
                    setEmploymentType('All');
                    setRequiredSkill('All');
                    setOnlyEligible(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-primary-600 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Job Cards */}
            {!loading && jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const isEligible = job.isEligible;
                  const matchScore = job.matchScore || 70;
                  const missingCount = job.missingSkills?.length || 0;

                  return (
                    <div
                      key={job.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all space-y-4"
                    >
                      {/* Top Row: Company Logo, Job Title, Match Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 shrink-0 overflow-hidden">
                            {job.companyLogo ? (
                              <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{job.companyName?.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-black text-base sm:text-lg text-slate-900 hover:text-primary-600 transition-colors">
                              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
                              <span>{job.companyName}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                              </span>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                                {job.workMode}
                              </span>
                              <span>•</span>
                              <span className="font-bold text-slate-900">{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Percentage & Status */}
                        <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-cyan-300 text-xs font-black shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{matchScore}% Match</span>
                          </div>

                          <div>
                            {isEligible ? (
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-black border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Missing {missingCount} skills
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Required Skills Tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Required Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(job.requiredSkills || []).map((req: any) => {
                            const isMissing = job.missingSkills?.includes(req.skillName);
                            return (
                              <span
                                key={req.skillName}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                                  isMissing
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                }`}
                              >
                                <span>{req.skillName}</span>
                                <span className="text-[10px] opacity-80 font-normal">({req.minLevel})</span>
                                <span>{isMissing ? '⚠' : '✓'}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div className="text-xs text-slate-400 font-medium">
                          Min CGPA: <strong>{job.minCgpa || 7.0}</strong> • Openings: <strong>{job.openings || 3}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/jobs/${job.id}`}
                            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm ${
                              isEligible
                                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <span>{isEligible ? 'View Job & Apply' : 'See What I Need'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function JobsSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading verified job openings...</p>
        </div>
      </div>
    }>
      <JobsSearchContent />
    </Suspense>
  );
}

