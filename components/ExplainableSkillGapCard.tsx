'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExplainableSkillGapReport,
  SkillGapItem,
  SkillGapStatus
} from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  FolderGit2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Zap,
  Target,
  ExternalLink,
  Info
} from 'lucide-react';

interface ExplainableSkillGapCardProps {
  report: ExplainableSkillGapReport | null;
  isLoading?: boolean;
  targetSelector?: React.ReactNode;
  compact?: boolean;
  showRoadmap?: boolean;
}

export default function ExplainableSkillGapCard({
  report,
  isLoading = false,
  targetSelector,
  compact = false,
  showRoadmap = true
}: ExplainableSkillGapCardProps) {
  const [filterStatus, setFilterStatus] = useState<'ALL' | SkillGapStatus>('ALL');
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Evaluating candidate portfolio against target competency model...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
        <p className="text-xs text-slate-500 font-bold">No skill gap analysis available for this target.</p>
      </div>
    );
  }

  const toggleExpand = (skillId: string) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  };

  const filteredSkills = filterStatus === 'ALL'
    ? report.skills
    : report.skills.filter(s => s.status === filterStatus);

  const getStatusBadge = (status: SkillGapStatus) => {
    switch (status) {
      case 'MATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>MATCHED</span>
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>PARTIAL</span>
          </span>
        );
      case 'UNASSESSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>UNASSESSED</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>MISSING</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. EXECUTIVE DIAGNOSTIC BANNER */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider">
                Explainable Skill Gap Intelligence
              </span>
              {report.targetCompany && (
                <span className="text-[11px] text-slate-300 font-bold">
                  {report.targetCompany}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Target: {report.targetTitle}</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {report.matchScoreExplanation}
            </p>
          </div>

          {/* Target Selector Dropdown if provided */}
          {targetSelector && (
            <div className="shrink-0">
              {targetSelector}
            </div>
          )}
        </div>

        {/* Diagnostic Score & Status Counters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center col-span-2 sm:col-span-1">
            <div className="text-2xl font-black text-white">{report.overallMatchScore}%</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Match Score</div>
          </div>
          
          <button
            onClick={() => setFilterStatus(filterStatus === 'MATCHED' ? 'ALL' : 'MATCHED')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              filterStatus === 'MATCHED'
                ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xl font-black text-emerald-400">{report.stats.matched}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Matched</div>
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'PARTIAL' ? 'ALL' : 'PARTIAL')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              filterStatus === 'PARTIAL'
                ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xl font-black text-amber-400">{report.stats.partial}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Partial</div>
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'UNASSESSED' ? 'ALL' : 'UNASSESSED')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              filterStatus === 'UNASSESSED'
                ? 'bg-purple-500/30 border-purple-400 ring-2 ring-purple-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xl font-black text-purple-300">{report.stats.unassessed}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Unassessed</div>
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'MISSING' ? 'ALL' : 'MISSING')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              filterStatus === 'MISSING'
                ? 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xl font-black text-rose-400">{report.stats.missing}</div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Missing</div>
          </button>
        </div>
      </div>

      {/* 2. FILTER TABS & SKILL BREAKDOWN */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Granular Skill Breakdown ({filteredSkills.length} skills)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Every skill requirement audited with verified evidence, level deltas, and actionable learning paths.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'MATCHED', 'PARTIAL', 'UNASSESSED', 'MISSING'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? `All (${report.stats.totalSkills})` : st}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Diagnostic Cards List */}
        <div className="space-y-3">
          {filteredSkills.map(item => {
            const isExpanded = expandedSkills[item.skillId] ?? (item.status !== 'MATCHED');

            return (
              <div
                key={item.skillId}
                className={`rounded-2xl border transition-all ${
                  item.status === 'MATCHED'
                    ? 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-300'
                    : item.status === 'PARTIAL'
                    ? 'bg-amber-50/20 border-amber-200/80 hover:border-amber-300'
                    : item.status === 'UNASSESSED'
                    ? 'bg-purple-50/20 border-purple-200/80 hover:border-purple-300'
                    : 'bg-rose-50/20 border-rose-200/80 hover:border-rose-300'
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(item.skillId)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-slate-900">
                        {item.skillName}
                      </span>
                      {getStatusBadge(item.status)}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold uppercase">
                        {item.category}
                      </span>
                      {item.isRequired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-black uppercase">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold uppercase">
                          Preferred
                        </span>
                      )}
                    </div>

                    {/* Level Comparison & Evidence Strip */}
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="text-slate-500">
                        Required: <strong className="text-slate-800">{item.requiredLevel}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">
                        Current: <strong className={item.currentLevel === 'None' ? 'text-rose-600' : 'text-slate-800'}>{item.currentLevel}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className={`font-bold ${
                        item.status === 'MATCHED' ? 'text-emerald-700' : item.status === 'MISSING' ? 'text-rose-700' : 'text-amber-700'
                      }`}>
                        {item.gapDescription}
                      </span>
                    </div>

                    {/* Evidence summary chip */}
                    <div className="pt-0.5">
                      <span className="text-[11px] font-medium text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Evidence: {item.evidence.summary}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Action / Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      aria-label="Toggle Details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. EXPANDABLE ACTIONABLE EXPLANATION DRAWER */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-200/60 space-y-4">
                    
                    {/* Why Required Context Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Why this skill is required:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {item.explanation.whyRequired}
                      </p>
                    </div>

                    {/* 3-Part Recommended Action Modules (Course, Assessment, Project) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* 1. Recommended Learning */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2.5 shadow-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Recommended Learning</span>
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-2">
                            {item.explanation.recommendedCourse.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 block">
                            Duration: {item.explanation.recommendedCourse.duration}
                          </span>
                        </div>
                        <Link
                          href={item.explanation.recommendedCourse.url}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Start Course</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 2. Recommended Assessment */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2.5 shadow-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-purple-600" />
                            <span>Verification Assessment</span>
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-2">
                            {item.explanation.recommendedAssessment.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 block">
                            Format: {item.explanation.recommendedAssessment.questionsCount} Questions • Timed
                          </span>
                        </div>
                        <Link
                          href={item.explanation.recommendedAssessment.url}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Verify Skill</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 3. Recommended Practical Project */}
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2.5 shadow-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1">
                            <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Hands-On Project</span>
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {item.explanation.recommendedProject.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 line-clamp-2">
                            {item.explanation.recommendedProject.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.explanation.recommendedProject.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRIORITIZED READINESS ROADMAP */}
      {showRoadmap && report.priorityActions && report.priorityActions.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Prioritized Path to 100% Eligibility</span>
            </h4>
            <span className="text-xs text-slate-400 font-bold">
              {report.priorityActions.length} Step Action Plan
            </span>
          </div>

          <div className="space-y-2.5">
            {report.priorityActions.map(act => (
              <div
                key={act.step}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                    {act.step}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      {act.title}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-emerald-700">{act.impact}</span>
                      {act.duration && <span>• Duration: {act.duration}</span>}
                    </div>
                  </div>
                </div>

                <Link
                  href={act.url}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shrink-0"
                >
                  <span>{act.actionType === 'ASSESS' ? 'Take Test' : act.actionType === 'LEARN' ? 'Start Course' : 'Build'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
