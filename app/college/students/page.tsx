'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Award,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CollegeStudentsRosterPage() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      let url = `/api/colleges/${collegeId}/students`;
      if (filter !== 'all') url += `?filter=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.students) {
        let list = data.students;
        if (searchQuery) {
          list = list.filter((s: any) =>
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.verifiedSkillsList?.some((vs: string) => vs.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        setStudents(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [collegeId, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* Header (Section 37) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Cohort Placement Roster</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Student Placement Readiness Tracking
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Monitor individual student skill verification progress, CGPAs, and readiness scores across departments.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilter('placement_ready')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'placement_ready' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Placement Ready ✓
              </button>
              <button
                onClick={() => setFilter('needs_training')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filter === 'needs_training' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Needs Training
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search student by name, department, or verified skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Department & Batch</th>
                  <th className="py-3.5 px-6">CGPA</th>
                  <th className="py-3.5 px-6">Verified Skills Passport</th>
                  <th className="py-3.5 px-6">Readiness</th>
                  <th className="py-3.5 px-6 text-right">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const isReady = s.placementReadiness >= 80 || s.placementStatus === 'Placement Ready';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                            {s.fullName?.charAt(0)}
                          </div>
                          <div>
                            <span className="block">{s.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {s.department} ({s.graduationYear})
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-800">
                        {s.cgpa?.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {s.verifiedSkillsList?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {s.verifiedSkillsList.map((vs: string) => (
                              <span key={vs} className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                                {vs} ✓
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No verified skills yet</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${s.placementReadiness}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold">{s.placementReadiness}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-y-1">
                        <div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            s.placementStatus === 'Placed' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            isReady ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {s.placementStatus === 'Placed' ? 'Placed 🎉' : isReady ? 'Placement Ready ✓' : 'Needs Training'}
                          </span>
                        </div>
                        <div>
                          <Link
                            href={`/college/students/${s.id}/report`}
                            className="text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            Academic Transcript →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
