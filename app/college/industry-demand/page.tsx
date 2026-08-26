'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Layers
} from 'lucide-react';

export default function CollegeIndustryDemandPage() {
  const [demandData, setDemandData] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/demand-analysis')
      .then(res => res.json())
      .then(data => {
        if (data.allSkillsDemand) {
          setDemandData(data.allSkillsDemand);
          setCategoryStats(data.categoryStats || []);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* Header (Section 16 & 18) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Market Telemetry</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Industry Skill Demand Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time percentage breakdown of technical skills demanded across 25+ verified corporate job postings on Skill2Hire.
          </p>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryStats.slice(0, 4).map((cat) => (
            <div key={cat.category} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cat.category}</span>
              <span className="text-2xl font-black text-slate-900 block">{cat.averageDemand}%</span>
              <span className="text-xs text-indigo-600 font-semibold">{cat.skillCount} Tracked Skills</span>
            </div>
          ))}
        </div>

        {/* Full Skills Demand Breakdown (Section 16 & 18) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Current Industry Demand Index</span>
            </h2>
            <Link href="/college/curriculum-gap" className="text-xs font-bold text-indigo-600 hover:underline">
              Analyze College Gaps →
            </Link>
          </div>

          <div className="space-y-4">
            {demandData.map((item) => (
              <div key={item.skillName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{item.skillName}</span>
                    <span className="text-xs text-slate-500">({item.category})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      item.demandLevel === 'Very High' ? 'bg-rose-100 text-rose-800' :
                      item.demandLevel === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.demandLevel} Demand
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-base text-slate-900">{item.demandPercent}%</span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.demandPercent >= 75 ? 'bg-gradient-to-r from-rose-500 to-amber-500' :
                      item.demandPercent >= 50 ? 'bg-gradient-to-r from-indigo-500 to-primary-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${item.demandPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Required in {item.jobPostingsCount} active corporate job openings</span>
                  <span className="text-emerald-700 font-bold">+{item.growthRate}% YoY Growth</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
