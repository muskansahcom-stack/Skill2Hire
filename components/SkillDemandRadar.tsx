'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Filter,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Award,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Layers,
  RefreshCw,
  BarChart3,
  Search,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Sliders,
  Database
} from 'lucide-react';
import { SkillDemandItem, SkillDemandAggregateReport, SkillDemandFilterOptions } from '@/lib/types';

interface SkillDemandRadarProps {
  initialRegion?: string;
  initialIndustry?: string;
  showComparisonSection?: boolean;
}

export default function SkillDemandRadar({
  initialRegion = '',
  initialIndustry = '',
  showComparisonSection = true
}: SkillDemandRadarProps) {
  // Filters state
  const [country, setCountry] = useState<string>('');
  const [region, setRegion] = useState<string>(initialRegion);
  const [city, setCity] = useState<string>('');
  const [industry, setIndustry] = useState<string>(initialIndustry);
  const [role, setRole] = useState<string>('');
  const [searchSkill, setSearchSkill] = useState<string>('');

  // Data states
  const [filterOptions, setFilterOptions] = useState<SkillDemandFilterOptions | null>(null);
  const [report, setReport] = useState<SkillDemandAggregateReport | null>(null);
  const [comparisonReports, setComparisonReports] = useState<{
    bihar: SkillDemandAggregateReport | null;
    tamilNadu: SkillDemandAggregateReport | null;
    us: SkillDemandAggregateReport | null;
  }>({ bihar: null, tamilNadu: null, us: null });

  const [loading, setLoading] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter options on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch('/api/demand/filters');
        const data = await res.json();
        if (data.success) {
          setFilterOptions(data.filterOptions);
        }
      } catch (err: any) {
        console.error('Error fetching demand filters:', err);
      }
    }
    loadFilters();
  }, []);

  // Fetch demand report whenever filters change
  const fetchDemandReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (country) params.set('country', country);
      if (region) params.set('region', region);
      if (city) params.set('city', city);
      if (industry) params.set('industry', industry);
      if (role) params.set('role', role);
      if (searchSkill) params.set('skill', searchSkill);

      const res = await fetch(`/api/demand?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || 'Failed to fetch demand report');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching demand report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandReport();
  }, [country, region, city, industry, role, searchSkill]);

  // Fetch comparison reports for Bihar, Tamil Nadu, United States if comparison enabled
  useEffect(() => {
    if (!showComparisonSection) return;

    async function loadComparisons() {
      setLoadingComparison(true);
      try {
        const [biharRes, tnRes, usRes] = await Promise.all([
          fetch('/api/demand?region=Bihar'),
          fetch('/api/demand?region=Tamil Nadu'),
          fetch('/api/demand?country=United States')
        ]);
        const [biharData, tnData, usData] = await Promise.all([
          biharRes.json(),
          tnRes.json(),
          usRes.json()
        ]);
        setComparisonReports({
          bihar: biharData.report || null,
          tamilNadu: tnData.report || null,
          us: usData.report || null
        });
      } catch (e) {
        console.error('Failed to load comparison reports:', e);
      } finally {
        setLoadingComparison(false);
      }
    }

    loadComparisons();
  }, [showComparisonSection]);

  // Quick preset shortcuts
  const handleSelectScopePreset = (type: 'global' | 'bihar' | 'tamilnadu' | 'us') => {
    setCity('');
    setRole('');
    setSearchSkill('');
    if (type === 'global') {
      setCountry('');
      setRegion('');
    } else if (type === 'bihar') {
      setCountry('India');
      setRegion('Bihar');
    } else if (type === 'tamilnadu') {
      setCountry('India');
      setRegion('Tamil Nadu');
    } else if (type === 'us') {
      setCountry('United States');
      setRegion('');
    }
  };

  const isBiharScope =
    region.toLowerCase() === 'bihar' ||
    city.toLowerCase() === 'patna' ||
    city.toLowerCase() === 'muzaffarpur' ||
    city.toLowerCase() === 'gaya' ||
    city.toLowerCase() === 'bhagalpur';

  return (
    <div className="space-y-8">
      {/* 1. TOP HEADER & INTRO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Deterministic Platform Demand Engine</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">Zero Simulated Random Data</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Global & Regional Employer Skill Demand Radar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time aggregation computed directly from active employer job postings published on Skill2Hire.
              Track which technical skills, minimum proficiency levels, and competencies companies are actively hiring for.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchDemandReport()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <Link
              href="/recruiter/jobs/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Post Opening</span>
            </Link>
          </div>
        </div>

        {/* Quick Regional Scope Shortcuts */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Scope Presets:</span>
          </span>
          <button
            onClick={() => handleSelectScopePreset('global')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !region && !country
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🌐 Global Aggregate
          </button>
          <button
            onClick={() => handleSelectScopePreset('bihar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              region === 'Bihar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🇮🇳 Bihar Ecosystem</span>
            <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold">Active</span>
          </button>
          <button
            onClick={() => handleSelectScopePreset('tamilnadu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              region === 'Tamil Nadu'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🇮🇳 Tamil Nadu
          </button>
          <button
            onClick={() => handleSelectScopePreset('us')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              country === 'United States'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🇺🇸 United States
          </button>
        </div>
      </div>

      {/* 2. BIHAR PROVENANCE & STRICT DISCLAIMER BANNER (Prompt Mandate) */}
      {isBiharScope && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-900 tracking-tight flex items-center gap-2">
                <span>Skill2Hire Platform Data ({report?.totalActiveJobs || 5} active jobs in Bihar)</span>
                <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Provable Audit Trace
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/90 font-medium leading-relaxed">
                <strong className="font-bold underline">Platform Data Integrity Notice:</strong> Platform data does not represent entire Bihar statewide workforce demand. This index reflects strictly verified job postings published by registered employers on Skill2Hire (including TechNova STPI Patna, BELTRON, Bihar Digital Health Mission, Muzaffarpur Smart AgriTech, and Gaya Clean Energy).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200/60 text-xs font-semibold text-amber-900">
            <div className="bg-amber-100/60 p-2 rounded-lg">
              <span className="text-[10px] text-amber-700 block uppercase">Anchor Corridor</span>
              <span>Patna STPI & IT Park</span>
            </div>
            <div className="bg-amber-100/60 p-2 rounded-lg">
              <span className="text-[10px] text-amber-700 block uppercase">AgriTech Hub</span>
              <span>Muzaffarpur Smart Grid</span>
            </div>
            <div className="bg-amber-100/60 p-2 rounded-lg">
              <span className="text-[10px] text-amber-700 block uppercase">Clean Energy</span>
              <span>Gaya Solar & Telemetry</span>
            </div>
            <div className="bg-amber-100/60 p-2 rounded-lg">
              <span className="text-[10px] text-amber-700 block uppercase">Methodology</span>
              <span>100% Deterministic SQL/Jobs</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-LEVEL FILTER CONTROL BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Regional & Industry Demand Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Country */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setRegion('');
                setCity('');
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50 font-semibold"
            >
              <option value="">All Countries (Global)</option>
              {filterOptions?.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Region / State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Region / State</label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setCity('');
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50 font-semibold"
            >
              <option value="">All Regions</option>
              {filterOptions?.regions.map((r) => {
                const rName = typeof r === 'string' ? r : r.name;
                return (
                  <option key={rName} value={rName}>
                    {rName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* City / District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">City / District</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50 font-semibold"
            >
              <option value="">All Cities / Districts</option>
              {filterOptions?.cities.map((ct) => {
                const ctName = typeof ct === 'string' ? ct : ct.name;
                return (
                  <option key={ctName} value={ctName}>
                    {ctName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50 font-semibold"
            >
              <option value="">All Industries</option>
              {filterOptions?.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Search Specific Skill */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Skill</label>
            <div className="relative">
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="e.g. SQL, Excel, Python"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-slate-50 font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Clear Filters Button if any active */}
        {(country || region || city || industry || role || searchSkill) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Active Scope: <strong className="text-slate-800">{report?.scopeLabel}</strong>
            </span>
            <button
              onClick={() => {
                setCountry('');
                setRegion('');
                setCity('');
                setIndustry('');
                setRole('');
                setSearchSkill('');
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Jobs Analyzed</span>
          <div className="text-3xl font-black text-slate-900">{report?.totalActiveJobs || 0}</div>
          <span className="text-[11px] text-slate-500">In current filtered scope</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unique Competencies</span>
          <div className="text-3xl font-black text-indigo-600">{report?.uniqueSkillsTracked || 0}</div>
          <span className="text-[11px] text-slate-500">Distinct technical skills</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Signals Extracted</span>
          <div className="text-3xl font-black text-emerald-600">{report?.totalSkillSignals || 0}</div>
          <span className="text-[11px] text-slate-500">Required + preferred points</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contributing Employers</span>
          <div className="text-3xl font-black text-amber-600">{report?.activeEmployersCount || 0}</div>
          <span className="text-[11px] text-slate-500">Publishing active postings</span>
        </div>
      </div>

      {/* 5. SKILL DEMAND LEADERBOARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Skill Demand Leaderboard: {report?.scopeLabel}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by exact employer hiring volume and proficiency requirements from published jobs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Required
            </span>
            <span className="flex items-center gap-1 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Preferred
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Calculating platform skill demand...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold">
            {error}
          </div>
        ) : !report || report.skills.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600">No active job postings match this specific regional filter.</p>
            <p className="text-xs text-slate-400">Try broadening your filter to &quot;All Regions&quot; or post a new job to start tracking demand in this location.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {report.skills.map((item: SkillDemandItem, index: number) => {
              const totalReqPref = item.requiredCount + item.preferredCount;
              const reqPct = totalReqPref > 0 ? (item.requiredCount / totalReqPref) * 100 : 0;
              const prefPct = totalReqPref > 0 ? (item.preferredCount / totalReqPref) * 100 : 0;

              return (
                <div
                  key={item.skillId}
                  className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">{item.skillName}</h4>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          In <strong className="text-slate-800">{item.demandCount}</strong> of {report.totalActiveJobs} active jobs ({item.percentage}% platform penetration)
                        </p>
                      </div>
                    </div>

                    {/* Required vs Preferred Pill */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        {item.requiredCount} Required
                      </span>
                      {item.preferredCount > 0 && (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          {item.preferredCount} Preferred
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar: Penetration & Required vs Preferred */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Requirement Weighting:</span>
                      <span>{reqPct.toFixed(0)}% Mandatory / {prefPct.toFixed(0)}% Preferred</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${reqPct}%` }}
                        className="bg-rose-500 h-full transition-all"
                        title={`${item.requiredCount} Mandatory Requirements`}
                      />
                      <div
                        style={{ width: `${prefPct}%` }}
                        className="bg-blue-500 h-full transition-all"
                        title={`${item.preferredCount} Preferred Signals`}
                      />
                    </div>
                  </div>

                  {/* Proficiency Distribution */}
                  {(() => {
                    const prof = item.proficiencyDistribution || item.proficiencyBreakdown;
                    return (
                      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">Min Proficiency Demanded:</span>
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            {prof && prof.Beginner > 0 && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Beginner: {prof.Beginner}
                              </span>
                            )}
                            {prof && prof.Intermediate > 0 && (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                                Intermediate: {prof.Intermediate}
                              </span>
                            )}
                            {prof && prof.Advanced > 0 && (
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                                Advanced: {prof.Advanced}
                              </span>
                            )}
                            {prof && prof.Expert > 0 && (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                                Expert: {prof.Expert}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Hiring Employers */}
                        {item.topEmployers && item.topEmployers.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-600">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold">Hiring:</span>
                            <span className="font-bold text-slate-800 truncate max-w-[220px]">
                              {item.topEmployers.map((e: any) => typeof e === 'string' ? e : e.companyName).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. REGIONAL COMPARATIVE MATRIX (Prompt Mandate: Bihar vs Tamil Nadu vs United States) */}
      {showComparisonSection && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Regional Demand Variance</span>
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                Comparative Regional Skill Demand: Bihar vs. Tamil Nadu vs. United States
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact comparison computed from verified platform jobs across distinct industrial corridors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bihar Column */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
                    <span>🇮🇳 Bihar Ecosystem</span>
                  </h4>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    {comparisonReports.bihar?.totalActiveJobs || 0} Platform Jobs
                  </span>
                </div>
                <button
                  onClick={() => handleSelectScopePreset('bihar')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  View Scope →
                </button>
              </div>

              <div className="space-y-2">
                {comparisonReports.bihar?.skills.slice(0, 5).map((s, i) => (
                  <div key={s.skillId} className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{s.skillName}</span>
                    </div>
                    <span className="font-extrabold text-emerald-700">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamil Nadu Column */}
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-blue-950 text-sm flex items-center gap-1.5">
                    <span>🇮🇳 Tamil Nadu</span>
                  </h4>
                  <span className="text-[11px] text-blue-800 font-semibold">
                    {comparisonReports.tamilNadu?.totalActiveJobs || 0} Platform Jobs
                  </span>
                </div>
                <button
                  onClick={() => handleSelectScopePreset('tamilnadu')}
                  className="text-[11px] font-bold text-blue-700 hover:underline"
                >
                  View Scope →
                </button>
              </div>

              <div className="space-y-2">
                {comparisonReports.tamilNadu?.skills.slice(0, 5).map((s, i) => (
                  <div key={s.skillId} className="p-2.5 bg-white rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{s.skillName}</span>
                    </div>
                    <span className="font-extrabold text-blue-700">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* United States Column */}
            <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-purple-950 text-sm flex items-center gap-1.5">
                    <span>🇺🇸 United States</span>
                  </h4>
                  <span className="text-[11px] text-purple-800 font-semibold">
                    {comparisonReports.us?.totalActiveJobs || 0} Platform Jobs
                  </span>
                </div>
                <button
                  onClick={() => handleSelectScopePreset('us')}
                  className="text-[11px] font-bold text-purple-700 hover:underline"
                >
                  View Scope →
                </button>
              </div>

              <div className="space-y-2">
                {comparisonReports.us?.skills.slice(0, 5).map((s, i) => (
                  <div key={s.skillId} className="p-2.5 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900">{s.skillName}</span>
                    </div>
                    <span className="font-extrabold text-purple-700">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
