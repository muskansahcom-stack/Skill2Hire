'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Code,
  FileText,
  Mic,
  Laptop,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  ExternalLink,
  Check,
  Building2,
  Compass
} from 'lucide-react';
import { EmploymentReadinessReport, ReadinessChecklistItem, PersonalizedPriorityItem } from '@/lib/types';

export default function BecomeReadyPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  // Target selection: category + targetId
  const [targetCategory, setTargetCategory] = useState<'role' | 'career' | 'job'>('role');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('jr-data-analyst');
  const [report, setReport] = useState<EmploymentReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [selectedPillarKey, setSelectedPillarKey] = useState<string | null>(null);

  // Available options
  const targetOptions = [
    // Job Roles
    { id: 'jr-data-analyst', title: 'Data Analyst & BI Specialist', category: 'role', badge: 'Standard Job Role', icon: '📊' },
    { id: 'jr-fullstack-dev', title: 'Full Stack Web Developer', category: 'role', badge: 'Standard Job Role', icon: '💻' },
    { id: 'jr-cloud-devops', title: 'Cloud & DevOps Engineer', category: 'role', badge: 'Standard Job Role', icon: '☁️' },
    { id: 'jr-aiml', title: 'AI & Machine Learning Engineer', category: 'role', badge: 'Standard Job Role', icon: '🤖' },
    { id: 'jr-backend', title: 'Backend Systems Engineer', category: 'role', badge: 'Standard Job Role', icon: '⚙️' },
    
    // Career Paths
    { id: 'cp_data_analyst', title: 'Data Analyst & ML Specialist Career', category: 'career', badge: 'Career Path', icon: '🚀' },
    { id: 'cp_sw_dev', title: 'Full Stack Software Developer Career', category: 'career', badge: 'Career Path', icon: '🚀' },
    { id: 'cp_cloud_devops', title: 'Cloud & DevOps Engineer Career', category: 'career', badge: 'Career Path', icon: '🚀' },
    
    // Active Jobs
    { id: 'job_3', title: 'DataMinds: Junior Data Analyst', category: 'job', badge: 'Published Job', icon: '🏢' },
    { id: 'job_1', title: 'TechNova: Software Developer', category: 'job', badge: 'Published Job', icon: '🏢' },
    { id: 'job_2', title: 'CloudScale: Cloud DevOps Engineer', category: 'job', badge: 'Published Job', icon: '🏢' },
    { id: 'job_4', title: 'QuantumAI: ML Research Associate', category: 'job', badge: 'Published Job', icon: '🏢' }
  ];

  const fetchReadiness = async (targetId: string, category: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}/readiness?targetType=${category}&targetId=${targetId}`);
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to load readiness report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness(selectedTargetId, targetCategory);
  }, [studentId, selectedTargetId, targetCategory]);

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedTargetId(newId);
    const match = targetOptions.find(o => o.id === newId);
    if (match) {
      setTargetCategory(match.category as any);
    }
  };

  const getPillarIcon = (key: string) => {
    switch (key) {
      case 'skillCoverage': return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'assessmentResults': return <Award className="w-5 h-5 text-emerald-600" />;
      case 'projects': return <Laptop className="w-5 h-5 text-amber-600" />;
      case 'practicalEvidence': return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'resume': return <FileText className="w-5 h-5 text-violet-600" />;
      case 'interviewPrep': return <Mic className="w-5 h-5 text-pink-600" />;
      case 'relevantExperience': return <GraduationCap className="w-5 h-5 text-cyan-600" />;
      default: return <Sparkles className="w-5 h-5 text-primary-600" />;
    }
  };

  const getPriorityCategoryIcon = (category: string) => {
    switch (category) {
      case 'Assessments': return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Projects': return <Laptop className="w-4 h-4 text-amber-600" />;
      case 'Interview Coach': return <Mic className="w-4 h-4 text-pink-600" />;
      case 'Courses': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Resume Builder': return <FileText className="w-4 h-4 text-violet-600" />;
      default: return <Sparkles className="w-4 h-4 text-primary-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Target Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
            ← Back to Student Dashboard
          </Link>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary-600" />
              <span>Target Career or Role:</span>
            </span>
            <select
              value={selectedTargetId}
              onChange={handleTargetChange}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs w-full sm:w-72"
            >
              <optgroup label="Standard Job Roles">
                {targetOptions.filter(t => t.category === 'role').map(o => (
                  <option key={o.id} value={o.id}>
                    {o.icon} {o.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Career Paths">
                {targetOptions.filter(t => t.category === 'career').map(o => (
                  <option key={o.id} value={o.id}>
                    {o.icon} {o.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Active Job Openings">
                {targetOptions.filter(t => t.category === 'job').map(o => (
                  <option key={o.id} value={o.id}>
                    {o.icon} {o.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* 1. HERO HEADER: NON-ARBITRARY READINESS SCORECARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-black uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-primary-600" />
                  <span>Phase 5 • Employment Readiness Engine</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {report?.targetIndustry || 'Technology & Digital Systems'}
                </span>
                {report?.targetCompany && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{report.targetCompany}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {report?.targetTitle || 'Target Opportunity'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                The Employment Readiness Engine evaluates your verified qualifications across 7 core competency pillars. 
                Know exactly if you are ready to apply, and if not, the exact steps to unlock top-tier candidate consideration.
              </p>
            </div>

            {/* Scorecard Hero Badge */}
            <div className="flex items-center gap-5 p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-lg shrink-0">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-emerald-400">
                  {report?.overallReadinessScore || 0}%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Readiness Score
                </div>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div>
                <div className="text-xs font-bold text-slate-300">Status</div>
                <div className={`text-sm font-black mt-0.5 ${
                  (report?.overallReadinessScore || 0) >= 75
                    ? 'text-emerald-400'
                    : (report?.overallReadinessScore || 0) >= 55
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {report?.readinessLabel || 'Evaluating...'}
                </div>
                <button
                  onClick={() => setShowFormulaModal(!showFormulaModal)}
                  className="mt-1 text-[11px] font-semibold text-primary-400 hover:text-primary-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>How was this calculated?</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mathematical Calculation Formula Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-slate-900">Explainable Non-Arbitrary Formula: </strong>
                <span className="font-mono text-[11px] text-slate-600">
                  Score = (Skills × 25%) + (Assessments × 20%) + (Projects × 15%) + (Evidence × 10%) + (Resume × 10%) + (Interview × 10%) + (Experience × 10%)
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowFormulaModal(!showFormulaModal)}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 shrink-0 flex items-center gap-1"
            >
              <span>{showFormulaModal ? 'Hide Formula Details' : 'View Point Breakdown'}</span>
              {showFormulaModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expanded Mathematical Formula Breakdown */}
          {showFormulaModal && report && (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <span>Verified Pillar Weights & Point Contribution Table</span>
                </h3>
                <span className="text-xs text-slate-400">Total Weight: 100% (100 Max Points)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-2">Evaluation Pillar</th>
                      <th className="pb-2">Weight</th>
                      <th className="pb-2">Pillar Score</th>
                      <th className="pb-2">Points Contributed</th>
                      <th className="pb-2">Mathematical Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(report.dimensions).map(([key, dim]) => (
                      <tr key={key} className="hover:bg-slate-50/60">
                        <td className="py-2.5 font-bold text-slate-800 flex items-center gap-2">
                          {getPillarIcon(key)}
                          <span>{dim.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-600 font-mono">{Math.round(dim.weight * 100)}%</td>
                        <td className="py-2.5 font-mono font-bold text-slate-900">{dim.score}%</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-600">{dim.pointsEarned} / {dim.maxPoints} pts</td>
                        <td className="py-2.5 text-slate-500 text-[11px]">{dim.formulaDescription}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 font-bold bg-slate-50/70">
                      <td className="py-3 text-slate-900">Total Overall Readiness</td>
                      <td className="py-3 font-mono">100%</td>
                      <td className="py-3 text-slate-500">—</td>
                      <td className="py-3 font-mono text-emerald-700 text-sm font-black">{report.overallReadinessScore} / 100 pts</td>
                      <td className="py-3 text-slate-700 text-[11px]">Direct sum of 7 verified competency dimensions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 2. PROMPT-MATCHING CHECKLIST HERO SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Target Requirement Checklist</span>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>TARGET:</span>
                <span className="text-primary-600">{report?.targetTitle || 'Selected Role'}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Instant diagnostic of verified proficiencies, project evidence, and interview preparation.
            </p>
          </div>

          {/* Clean Prompt-Matching List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {report?.checklist.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  item.symbol === '✓'
                    ? 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-300'
                    : item.symbol === '⚠'
                    ? 'bg-amber-50/50 border-amber-200/80 hover:border-amber-300'
                    : 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">
                      {item.name}
                    </h4>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 ${
                    item.symbol === '✓'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.symbol === '⚠'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    <span className="font-mono">{item.symbol}</span>
                    <span>{item.statusText}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-200/40">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.detail}
                  </p>

                  {item.actionUrl && item.actionLabel && (
                    <Link
                      href={item.actionUrl}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                        item.symbol === '✓'
                          ? 'text-emerald-700 hover:text-emerald-800'
                          : item.symbol === '⚠'
                          ? 'text-amber-700 hover:text-amber-800'
                          : 'text-rose-700 hover:text-rose-800'
                      }`}
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 7 CORE ANALYZED DIMENSIONS OVERVIEW */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                7 Dimensions of Employment Readiness
              </h3>
              <p className="text-xs text-slate-500">
                Click any pillar to inspect underlying proof points, tests, and evidence records.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">Total Pillars: 7</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {report && Object.entries(report.dimensions).map(([key, dim]) => (
              <div
                key={key}
                onClick={() => setSelectedPillarKey(selectedPillarKey === key ? null : key)}
                className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer hover:shadow-md ${
                  selectedPillarKey === key
                    ? 'border-primary-500 ring-2 ring-primary-100 shadow-sm'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-2xl bg-slate-100">
                    {getPillarIcon(key)}
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    dim.status === 'OPTIMAL'
                      ? 'bg-emerald-50 text-emerald-700'
                      : dim.status === 'ADEQUATE'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {dim.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{dim.name}</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900">{dim.score}%</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      +{dim.pointsEarned} / {dim.maxPoints} pts
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.score >= 80 ? 'bg-emerald-500' : dim.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1.5 line-clamp-2">
                    {dim.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. PERSONALIZED 3-PRIORITY PLAN */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block">
                Targeted Action Plan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Your Personalized 3-Priority Readiness Plan</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Completing these 3 prioritized milestones will boost your readiness score and satisfy key employer filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {report?.personalizedPlan.map((planItem) => (
              <div
                key={planItem.priority}
                className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between gap-4 hover:border-primary-500/50 transition-all hover:bg-slate-800"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-primary-600/30 text-primary-300 font-mono text-xs font-black">
                      Priority {planItem.priority}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-black">
                      +{planItem.estimatedReadinessUplift}% Readiness
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      {getPriorityCategoryIcon(planItem.targetCategory)}
                      <span>{planItem.targetCategory}</span>
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {planItem.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {planItem.rationale}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Target Milestone</div>
                    <div className="text-xs font-medium text-amber-300">{planItem.targetMilestone}</div>
                  </div>
                </div>

                <Link
                  href={planItem.actionUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md shadow-primary-600/25 transition-all mt-2"
                >
                  <span>{planItem.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 4 DIAGNOSTIC BUCKETS: STRENGTHS, GAPS, MISSING EVIDENCE, RECOMMENDED ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Current Strengths</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">{report?.currentStrengths.length || 0} Verified</span>
            </div>
            <div className="space-y-3">
              {report?.currentStrengths.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s.title}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">{s.evidence}</p>
                </div>
              ))}
              {(!report?.currentStrengths || report.currentStrengths.length === 0) && (
                <p className="text-xs text-slate-400 py-3 text-center">No verified strengths recorded yet.</p>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Identified Skill Gaps</span>
              </h3>
              <span className="text-xs font-bold text-amber-600">{report?.skillGaps.length || 0} Identified</span>
            </div>
            <div className="space-y-3">
              {report?.skillGaps.map((g, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <div className="text-xs font-black text-amber-950 flex items-center justify-between">
                    <span>{g.skill}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-800">
                      Req: {g.requiredLevel} • Cur: {g.currentLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">{g.gap}</p>
                </div>
              ))}
              {(!report?.skillGaps || report.skillGaps.length === 0) && (
                <p className="text-xs text-emerald-600 py-3 text-center font-bold">✓ All core skill prerequisites fully satisfied!</p>
              )}
            </div>
          </div>

          {/* Missing Evidence */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Missing Practical Evidence</span>
              </h3>
              <span className="text-xs font-bold text-rose-600">{report?.missingEvidence.length || 0} Items</span>
            </div>
            <div className="space-y-3">
              {report?.missingEvidence.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-rose-950">{m.item}</div>
                    <p className="text-[11px] text-rose-800">{m.reason}</p>
                  </div>
                  <Link
                    href={m.actionUrl}
                    className="shrink-0 text-[11px] font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-0.5"
                  >
                    <span>Fix</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
              {(!report?.missingEvidence || report.missingEvidence.length === 0) && (
                <p className="text-xs text-emerald-600 py-3 text-center font-bold">✓ Complete practical evidence portfolio on record.</p>
              )}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span>Recommended Actions</span>
              </h3>
              <span className="text-xs font-bold text-primary-600">Immediate Steps</span>
            </div>
            <div className="space-y-3">
              {report?.recommendedActions.map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-primary-50/40 border border-primary-100 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-primary-950">{a.title}</div>
                    <p className="text-[11px] text-primary-800">{a.description}</p>
                  </div>
                  <Link
                    href={a.actionUrl}
                    className="shrink-0 px-2.5 py-1.5 rounded-xl bg-primary-600 text-white text-[11px] font-bold hover:bg-primary-700 transition-colors"
                  >
                    {a.actionText}
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6. PLATFORM TOOL CONNECTIONS: 5 DIRECT HUBS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Preparation Toolkit</span>
              <h3 className="text-lg font-black text-slate-900">
                Direct Platform Tool Connections
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Execute your readiness plan seamlessly with Skill2Hire integrated tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Courses */}
            <Link
              href={report?.toolLinks.courses.url || '/courses'}
              className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Courses</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {report?.toolLinks.courses.title || 'Structured curriculum'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                <span>Browse {report?.toolLinks.courses.count || 6} Courses</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            {/* 2. Projects */}
            <Link
              href={report?.toolLinks.projects.url || '/student/projects'}
              className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Projects</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {report?.toolLinks.projects.title || 'Portfolio evidence'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                <span>View {report?.toolLinks.projects.count || 4} Projects</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            {/* 3. Assessments */}
            <Link
              href={report?.toolLinks.assessments.url || '/assessments'}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Assessments</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {report?.toolLinks.assessments.title || 'Proctored verification'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>Take {report?.toolLinks.assessments.count || 5} Tests</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            {/* 4. Interview Coach */}
            <Link
              href={report?.toolLinks.interviewCoach.url || '/student/interview-coach'}
              className="p-4 rounded-2xl border border-slate-200 hover:border-pink-400 hover:bg-pink-50/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors">Interview Coach</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {report?.toolLinks.interviewCoach.title || 'AI mock interviews'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-pink-600 flex items-center gap-1">
                <span>Start Practice</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>

            {/* 5. Resume Builder */}
            <Link
              href={report?.toolLinks.resumeBuilder.url || '/student/resume-matcher'}
              className="p-4 rounded-2xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/30 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-600 transition-colors">Resume Builder</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {report?.toolLinks.resumeBuilder.title || 'ATS keyword matcher'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-violet-600 flex items-center gap-1">
                <span>Match Resume</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>

        {/* 7. PURPOSE & ETHICAL DISCLAIMER */}
        <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 text-center text-xs leading-relaxed max-w-3xl mx-auto">
          <strong>Purpose Notice: </strong>
          The Skill2Hire Employment Readiness Engine is designed to empower candidates with transparent diagnostic guidance before applying.
          Scores are derived directly from verified coursework, proctored tests, and code submissions, serving as preparation milestones rather than automated hiring gates.
        </div>

      </div>
    </div>
  );
}
