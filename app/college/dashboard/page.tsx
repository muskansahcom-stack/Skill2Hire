'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Plus
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CollegeDashboard() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [collegeData, setCollegeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/colleges/${collegeId}`);
        const data = await res.json();
        if (data.college) {
          setCollegeData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [collegeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading placement center analytics...</p>
        </div>
      </div>
    );
  }

  const college = collegeData?.college;
  const stats = collegeData?.stats || {
    totalStudents: 2500,
    placementReady: 1420,
    needsTraining: 1080,
    companiesCount: 125,
    activeJobsCount: 86,
    applicationsCount: 4200,
    placementsCount: 820
  };
  const industryDemand = collegeData?.industryDemand || [];
  const trainingPrograms = collegeData?.trainingPrograms || [];

  return (
    <ProtectedRoute allowedRoles={['college']}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/20">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {college?.name || 'Apex University of Engineering'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  Placement Cell
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Institutional placement intelligence, real-time corporate demand telemetry, and curriculum gap mitigation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/college/curriculum-gap"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Curriculum Gap Analysis</span>
            </Link>
            <Link
              href="/college/training"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Bootcamp</span>
            </Link>
          </div>
        </div>

        {/* 7 KPI METRIC CARDS (Section 17 specification) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalStudents?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Placement Ready</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.placementReady?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Needs Training</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.needsTraining?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Companies</span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">{stats.companiesCount?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Jobs</span>
            <span className="text-2xl font-black text-primary-600 mt-1 block">{stats.activeJobsCount?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Applications</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.applicationsCount?.toLocaleString()}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-primary-50 shadow-sm">
            <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block">Placements</span>
            <span className="text-2xl font-black text-indigo-700 mt-1 block">{stats.placementsCount?.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. GRID: INDUSTRY DEMAND RADAR & CURRICULUM GAP SPOTLIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Skills Companies Currently Need (Section 18) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Skills Companies Currently Need</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live percentage of active corporate jobs requiring each technical skill.</p>
              </div>
              <Link href="/college/industry-demand" className="text-xs font-bold text-indigo-600 hover:underline">
                Full Radar →
              </Link>
            </div>

            <div className="space-y-4">
              {industryDemand.slice(0, 6).map((item: any) => (
                <div key={item.skillName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.skillName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {item.demandLevel}
                      </span>
                      <span className="font-mono font-bold text-slate-900">{item.demandPercent}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-primary-500 transition-all duration-500"
                      style={{ width: `${item.demandPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-indigo-900 font-medium">88% of openings require practical Python + DSA</span>
              <Link href="/college/curriculum-gap" className="font-bold text-indigo-700 hover:underline">
                View Curriculum Gaps →
              </Link>
            </div>
          </div>

          {/* Right Column: AI Placement Training Bootcamps (Section 20 & 38) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>College Placement Training Programs</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Active bootcamps targeted at closing critical student skill gaps.</p>
              </div>
              <Link href="/college/training" className="text-xs font-bold text-indigo-600 hover:underline">
                Manage All →
              </Link>
            </div>

            <div className="space-y-4">
              {trainingPrograms.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">AI Recommendation Available</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    “Based on current industry hiring demand, create a Python + DSA + SQL placement training program.”
                  </p>
                  <Link
                    href="/college/curriculum-gap"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
                  >
                    <span>1-Click Create Training Program (Step 4 Demo)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                trainingPrograms.map((tp: any) => (
                  <div key={tp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">{tp.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active ({tp.durationWeeks} wks)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {tp.targetSkills?.map((sk: string) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Target: {tp.targetStudentCount} students</span>
                      <span>Enrolled: <strong className="text-slate-800">{tp.enrolledStudentCount}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* 3. STUDENT ROSTER PREVIEW (Section 37) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-600" />
                <span>Student Placement Readiness Roster</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status of batch students, verified skills, and readiness scores.</p>
            </div>
            <Link href="/college/students" className="text-xs font-bold text-indigo-600 hover:underline">
              View All Students →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Placement Readiness</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeData?.students?.slice(0, 5).map((std: any) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{std.fullName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{std.department} ({std.graduationYear})</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{std.cgpa?.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${std.placementReadiness >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${std.placementReadiness}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold">{std.placementReadiness}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        std.placementReadiness >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {std.placementReadiness >= 80 ? 'Placement Ready ✓' : 'Needs Training'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href="/college/students" className="font-bold text-indigo-600 hover:underline">
                        Details →
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
  </ProtectedRoute>
  );
}
