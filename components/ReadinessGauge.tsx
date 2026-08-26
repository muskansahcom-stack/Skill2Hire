import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number; // 0 - 100
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReadinessGauge({
  score,
  title = 'Placement Readiness',
  subtitle = 'Calculated from verified skills, assessments, CGPA & course completions',
  size = 'md'
}: ReadinessGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine readiness status & colors
  let colorClass = 'text-amber-600';
  let bgClass = 'from-amber-500 to-orange-500';
  let statusText = 'Needs Training';
  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';

  if (normalizedScore >= 80) {
    colorClass = 'text-emerald-600';
    bgClass = 'from-emerald-500 to-teal-500';
    statusText = 'Placement Ready ✓';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (normalizedScore >= 60) {
    colorClass = 'text-blue-600';
    bgClass = 'from-blue-500 to-indigo-500';
    statusText = 'In Training';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {statusText}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">{subtitle}</p>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>
            {normalizedScore}%
          </span>
        </div>
      </div>

      {/* Progress Bar with Milestones */}
      <div className="mt-4">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${bgClass} transition-all duration-700 ease-out`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
          <span>0% Foundations</span>
          <span>50% In Training</span>
          <span className="font-bold text-emerald-600">80%+ Placement Ready</span>
          <span>100% Elite</span>
        </div>
      </div>

      {/* Criteria Breakdown Pillars */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-1.5 rounded-lg bg-slate-50">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Verified Skills</span>
          <span className="font-bold text-slate-700">40% Weight</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Assessments</span>
          <span className="font-bold text-slate-700">25% Weight</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Job Match</span>
          <span className="font-bold text-slate-700">20% Weight</span>
        </div>
        <div className="p-1.5 rounded-lg bg-slate-50">
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Education & CGPA</span>
          <span className="font-bold text-slate-700">15% Weight</span>
        </div>
      </div>
    </div>
  );
}
