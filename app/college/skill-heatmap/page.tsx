'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Flame,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CollegeSkillHeatmapItem } from '@/lib/types';

export default function CollegeSkillHeatmapPage() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [heatmap, setHeatmap] = useState<CollegeSkillHeatmapItem[]>([]);
  const [avgProficiency, setAvgProficiency] = useState(58);
  const [highestDeficit, setHighestDeficit] = useState('Python');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/colleges/${collegeId}/skill-heatmap`)
      .then(res => res.json())
      .then(data => {
        if (data.heatmapItems) {
          setHeatmap(data.heatmapItems);
          if (data.averageCohortProficiency) setAvgProficiency(data.averageCohortProficiency);
          if (data.highestDeficitSkill) setHighestDeficit(data.highestDeficitSkill);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [collegeId]);

  const filteredItems = filter === 'All'
    ? heatmap
    : filter === 'Deficits'
    ? heatmap.filter(h => h.status === 'Severe Deficit' || h.status === 'Moderate Gap')
    : heatmap.filter(h => h.status === 'Well Balanced' || h.status === 'Leading');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 13) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Institutional Gap Telemetry</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Industry → College Skill Heatmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Visual matrix comparing live corporate hiring demand vs student cohort proficiency across Apex University departments.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Skills ({heatmap.length})
              </button>
              <button
                onClick={() => setFilter('Deficits')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'Deficits' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Critical Gaps Only
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Average Cohort Proficiency</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">{avgProficiency}%</span>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-rose-700 block font-semibold uppercase text-[10px]">Highest Deficit Skill</span>
              <span className="text-xl font-black text-rose-900 mt-1 block">{highestDeficit} (29% Gap)</span>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
              <span className="text-indigo-700 block font-semibold uppercase text-[10px]">Auto-Generated Bootcamps</span>
              <span className="text-xl font-black text-indigo-900 mt-1 block">4 Active Cohorts</span>
            </div>
          </div>
        </div>

        {/* 2. HEATMAP MATRIX TABLE (Section 13) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Skill Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Industry Demand</th>
                  <th className="py-3.5 px-6">Student Proficiency</th>
                  <th className="py-3.5 px-6">Gap Deficit</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.skillName} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-slate-900 text-sm">
                      {item.skillName}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.industryDemandPercent}%` }} />
                        </div>
                        <span>{item.industryDemandPercent}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.studentCohortProficiency}%` }} />
                        </div>
                        <span>{item.studentCohortProficiency}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-rose-600">
                      {item.gapPercentage > 0 ? `-${item.gapPercentage}%` : 'Balanced'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.status === 'Severe Deficit' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        item.status === 'Moderate Gap' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href="/college/curriculum-gap"
                        className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        Create Bootcamp
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
