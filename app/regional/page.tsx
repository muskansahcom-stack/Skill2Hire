'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Globe,
  MapPin,
  TrendingUp,
  Building2,
  Users,
  Award,
  Zap,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Languages,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { useRegion } from '@/context/RegionContext';
import { REGIONAL_DICTIONARIES } from '@/lib/regionalIntelligence';

function RegionalIntelligenceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'districts';

  const {
    selectedRegion,
    setRegion,
    selectedDistrict,
    setDistrict,
    selectedLanguage,
    setLanguage,
    currentProfile,
    isBiharActive,
    t
  } = useRegion();

  const [activeTab, setActiveTab] = useState<'districts' | 'migration' | 'schemes' | 'vernacular'>(
    initialTab === 'migration' || initialTab === 'schemes' || initialTab === 'vernacular'
      ? initialTab
      : 'districts'
  );

  // Data states
  const [districtData, setDistrictData] = useState<any>(null);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [corridors, setCorridors] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  // Active district selected in this page
  const activeDistrictId = selectedDistrict || 'in-br-patna';

  // Load Initial Metadata (corridors, schemes, all profiles)
  useEffect(() => {
    async function loadMeta() {
      setLoadingGlobal(true);
      try {
        const [regionsRes, pathwaysRes, schemesRes] = await Promise.all([
          fetch('/api/regional/regions'),
          fetch('/api/regional/pathways'),
          fetch('/api/regional/schemes')
        ]);

        if (regionsRes.ok) {
          const rData = await regionsRes.json();
          if (rData.profiles) setAllProfiles(rData.profiles);
        }
        if (pathwaysRes.ok) {
          const pData = await pathwaysRes.json();
          if (pData.corridors) setCorridors(pData.corridors);
        }
        if (schemesRes.ok) {
          const sData = await schemesRes.json();
          if (sData.schemes) setSchemes(sData.schemes);
        }
      } catch (err) {
        console.error('Failed to load regional meta:', err);
      } finally {
        setLoadingGlobal(false);
      }
    }
    loadMeta();
  }, []);

  // Load Selected District Analysis
  useEffect(() => {
    async function loadDistrict() {
      if (!activeDistrictId) return;
      setLoadingDistrict(true);
      try {
        const res = await fetch(`/api/regional/districts?districtId=${activeDistrictId}`);
        if (res.ok) {
          const data = await res.json();
          setDistrictData(data);
        }
      } catch (err) {
        console.error('Failed to load district data:', err);
      } finally {
        setLoadingDistrict(false);
      }
    }
    loadDistrict();
  }, [activeDistrictId]);

  // Fallback profile if currentProfile not yet loaded
  const profile = currentProfile || (allProfiles.length > 0 ? allProfiles[0] : null);
  const districts = profile?.districts || [];

  return (
    <div className="min-h-screen bg-slate-50 space-y-8 pb-16">
      
      {/* 1. HERO & ARCHITECTURE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-primary-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Global Architecture
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
                <span>🇮🇳</span>
                Flagship: Bihar Implementation
              </span>
            </div>

            {/* Dialect Switcher Pill */}
            <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur p-1 rounded-2xl border border-slate-700 text-xs">
              <span className="text-slate-400 px-2 font-bold flex items-center gap-1 text-[11px]">
                <Languages className="w-3.5 h-3.5" />
                Language:
              </span>
              {(['en', 'hi', 'bho'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all text-xs ${
                    selectedLanguage === l
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'भोजपुरी'}
                </button>
              ))}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t('regionalPortal')}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Decoupled regional intelligence engine powering localized demand-supply balancing, BSDM/KYP public scheme integration, and cross-state career migration corridors.
            </p>
          </div>

          {/* Region Switcher Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Scope:
            </span>
            <button
              onClick={() => setRegion('in-bihar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                selectedRegion === 'in-bihar'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🇮🇳</span>
              <span>India: Bihar (Deep Implementation)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-950/40 text-amber-950 font-black">
                8 Districts
              </span>
            </button>

            <button
              onClick={() => setRegion('in-karnataka')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                selectedRegion === 'in-karnataka'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🇮🇳</span>
              <span>India: Karnataka (Bengaluru Corridor)</span>
            </button>

            <button
              onClick={() => setRegion('in-maharashtra')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                selectedRegion === 'in-maharashtra'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🇮🇳</span>
              <span>India: Maharashtra (Pune)</span>
            </button>

            <button
              onClick={() => setRegion('us-ca')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                selectedRegion === 'us-ca'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🇺🇸</span>
              <span>USA: California</span>
            </button>

            <button
              onClick={() => setRegion('global')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                selectedRegion === 'global'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Global Aggregate</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Economic Districts
              </span>
              <div className="text-2xl font-black text-cyan-300 mt-1">8 Core Hubs</div>
              <span className="text-[11px] text-slate-400">Patna, Muzaffarpur, Gaya...</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Career Corridors
              </span>
              <div className="text-2xl font-black text-amber-400 mt-1">4 Active Routes</div>
              <span className="text-[11px] text-slate-400">Up to 2.8x wage multiplier</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Public Schemes
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1">4 State Missions</div>
              <span className="text-[11px] text-slate-400">BSDM, KYP, Startup, Udyami</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Mapped Capacity
              </span>
              <div className="text-2xl font-black text-indigo-300 mt-1">9,600+ Seats</div>
              <span className="text-[11px] text-slate-400">Across accredited centers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('districts')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'districts'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('districtIntelligence')}</span>
          <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px]">
            8 Hubs
          </span>
        </button>

        <button
          onClick={() => setActiveTab('migration')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'migration'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t('migrationPathways')}</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
            2.8x Boost
          </span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'schemes'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('publicSchemes')}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            BSDM/KYP
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vernacular')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'vernacular'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Vernacular Vocabulary</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">
            Dialect Mode
          </span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: DISTRICT SKILL INTELLIGENCE */}
      {activeTab === 'districts' && (
        <div className="space-y-6">
          {/* District Selector Pill Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Select Economic District to Analyze:
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Tier-1, Tier-2 & Rural Clusters
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {districts.map((d: any) => {
                const isSelected = activeDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDistrict(d.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs block truncate">{d.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d.tier}
                      </span>
                    </div>
                    <div
                      className={`text-[10px] mt-1 truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {d.economicHub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* District Analysis Dashboard */}
          {loadingDistrict ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Computing district skill gap index...</p>
            </div>
          ) : districtData ? (
            <div className="space-y-6">
              {/* District Overview Header Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">
                        {districtData.districtName} Skill Demand & Supply Index
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        BSDM Certified Region
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Telemetry data mapped against active vacancies, accredited training institutions, and local employer cohorts.
                    </p>
                  </div>

                  {/* Overall Gap Index Pill */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-right shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      District Skill Gap Index
                    </span>
                    <div className="text-3xl font-black text-amber-950">
                      {districtData.gapIndex} <span className="text-sm font-medium text-amber-700">/ 100</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800">
                      {districtData.gapIndex > 70 ? 'High Deficit — Bootcamps Required' : 'Moderate Balance'}
                    </span>
                  </div>
                </div>

                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('vacancies')}
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-0.5">
                      {districtData.demandMetrics?.activeVacancies || 240}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      +{districtData.demandMetrics?.yoyGrowthRate || 28}% YoY Growth
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Verified Talent Pool
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-0.5">
                      {districtData.supplyMetrics?.totalTalent || 140}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {districtData.supplyMetrics?.placementReady || 45} Placement-Ready
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('trainingCapacity')}
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-0.5">
                      {districtData.trainingCapacity?.seatCapacity || 1200}
                    </div>
                    <span className="text-[10px] text-indigo-600 font-bold">
                      {districtData.trainingCapacity?.activeInstitutions?.length || 4} Certified Centers
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('placementRate')}
                    </span>
                    <div className="text-xl font-black text-emerald-600 mt-0.5">
                      {districtData.employmentOutcomes?.placementRate || 74}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Avg {districtData.employmentOutcomes?.avgStartingSalary || '₹28,000/mo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Skill Deficits in District */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-slate-900">
                      High-Deficit Skills in {districtData.districtName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Direct mismatch between local corporate demand and available verified talent pool.
                    </p>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <span>View District Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {(districtData.criticalDeficitSkills || []).map((skill: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">{skill.skillName}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                              skill.urgency === 'Critical'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {skill.urgency || 'High Deficit'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>Demand Index: <strong className="text-slate-800">{skill.demandIndex || 85}/100</strong></span>
                          <span>•</span>
                          <span>Verified Ready: <strong className="text-slate-800">{skill.supplyReady || 12} Candidates</strong></span>
                          <span>•</span>
                          <span className="text-primary-700 font-bold">{skill.recommendedIntervention}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/learn/${encodeURIComponent(skill.skillName.toLowerCase().replace(/[^a-z0-9]/g, ''))}`}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-primary-600" />
                          <span>Start Learning</span>
                        </Link>
                        <Link
                          href="/student/coding-practice"
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Verify Competency</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Ecosystem: Employers & Training Centers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certified Training Centers */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-black text-slate-900 text-base">
                      Accredited Training Centers & Universities
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {(districtData.trainingCapacity?.activeInstitutions || []).map((inst: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{inst}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          BSDM Affiliated
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Local Employers */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    <h4 className="font-black text-slate-900 text-base">
                      Primary Hiring Partners in {districtData.districtName}
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {(districtData.topEmployers || ['Beltron State Projects', 'TCS Patna Center', 'DeHaat Technologies', 'Bihar State Power']).map((emp: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{emp}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          Active Recruiter
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold">Select a district above to view live gap analytics</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CAREER MIGRATION CORRIDORS & WAGE MULTIPLIERS */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-200/80 space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              Employment Corridors & Wage Multiplier Analytics
            </h3>
            <p className="text-xs text-slate-600 max-w-3xl font-medium leading-relaxed">
              Skill2Hire models pathways from emerging districts in Bihar to tier-1 technology hubs (Bengaluru, Noida, Pune). Candidates bridge localized readiness gaps using Skill2Hire Universal Compiler and AI Interview Coach to unlock up to <strong>2.8x starting salary multiples</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {corridors.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-primary-400 hover:shadow-md transition-all space-y-5"
              >
                {/* Route Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                      <span>{c.sourceRegion}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary-600" />
                      <span className="text-primary-700">{c.destinationCity}, {c.destinationRegion}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mt-1">
                      {c.sourceRegion} ➔ {c.destinationCity} Corridor
                    </h4>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300 text-right shrink-0">
                    <span className="text-[10px] font-black uppercase text-amber-900 block">
                      Wage Multiplier
                    </span>
                    <div className="text-2xl font-black text-amber-950">
                      {c.averageSalaryMultiplier}x
                    </div>
                  </div>
                </div>

                {/* Popular Roles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    High Demand Target Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.popularRoles.map((role: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bridge Skills Required */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    Essential Bridge Competencies to Qualify:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.topRequiredBridgeSkills.map((sk: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 font-medium">
                    Average Readiness Gap: <strong>{c.readinessGapAverage || 25}%</strong>
                  </span>
                  <Link
                    href={`/jobs?location=${encodeURIComponent(c.destinationCity)}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>View Corridor Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* In-State Retention Pathway Card */}
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-300 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
                    <span>Bihar In-State Retention Pathway</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mt-1">
                    Patna • Beltron • STPI • Startups
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-right shrink-0">
                  <span className="text-[10px] font-black uppercase text-emerald-900 block">
                    1-Year Retention
                  </span>
                  <div className="text-2xl font-black text-emerald-950">92%</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                High quality-of-life pathway with zero relocation friction, working with STPI Patna incubatees, Beltron e-governance systems, and state digital transformation units.
              </p>

              <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">
                  Zero Living Cost Overhead
                </span>
                <Link
                  href="/jobs?location=Patna"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Explore Bihar Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC SCHEMES & GOVERNMENT INITIATIVES */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Government Alignment & Subsidies
            </span>
            <h3 className="text-xl font-black">
              Integrated State Employment & Skilling Missions
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
              Skill2Hire integrates with official state skill missions to verify credentials, subsidize candidate training, and connect certified beneficiaries directly with technology employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {s.authority}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mt-0.5">{s.name}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs border border-primary-200 shrink-0">
                      Active Scheme
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {s.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="text-xs">
                      <strong className="text-slate-800">Key Benefits: </strong>
                      <span className="text-slate-600">{s.benefits}</span>
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-800">Target Audience: </strong>
                      <span className="text-slate-600">{s.targetAudience}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <Link
                    href={s.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/student/become-ready"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Check My Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VERNACULAR VOCABULARY & DIALECT MODE */}
      {activeTab === 'vernacular' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
              Inclusivity & Vernacular Localization
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Grassroots Accessibility Engine (हिन्दी एवं भोजपुरी शब्दावली)
            </h3>
            <p className="text-xs text-slate-700 max-w-3xl font-medium leading-relaxed">
              Bridging the digital divide for students in rural and semi-urban districts by delivering native-language mappings for modern software engineering concepts and hiring terminology.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-sm text-slate-900">
                Core Platform Lexicon Comparison
              </span>
              <div className="text-xs text-slate-500 font-medium">
                Active Locale: <strong className="text-purple-700 uppercase">{selectedLanguage}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider">
                    <th className="py-2.5 px-3">Standard Term (English)</th>
                    <th className="py-2.5 px-3">हिन्दी (Hindi)</th>
                    <th className="py-2.5 px-3">भोजपुरी / मैथिली (Bhojpuri/Maithili)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.keys(REGIONAL_DICTIONARIES.en).map((key) => (
                    <tr key={key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {REGIONAL_DICTIONARIES.en[key]}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">
                        {REGIONAL_DICTIONARIES.hi[key] || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-purple-800 font-bold">
                        {REGIONAL_DICTIONARIES.bho[key] || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function RegionalIntelligencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegionalIntelligenceContent />
    </Suspense>
  );
}
