'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Award,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

export default function CollegeTrainingPage() {
  const { profile } = useAuth();
  const collegeId = profile?.id || 'col_1';

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // New Training Form
  const [title, setTitle] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [targetStudentCount, setTargetStudentCount] = useState(200);
  const [targetSkillsText, setTargetSkillsText] = useState('Python, DSA, SQL');
  const [submitting, setSubmitting] = useState(false);

  const loadPrograms = async () => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}/training-programs`);
      const data = await res.json();
      if (data.programs) {
        setPrograms(data.programs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [collegeId]);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSubmitting(true);
    try {
      const skillsArray = targetSkillsText.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`/api/colleges/${collegeId}/training-programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          durationWeeks: Number(durationWeeks),
          targetStudentCount: Number(targetStudentCount),
          targetSkills: skillsArray
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setTitle('');
        await loadPrograms();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/college/dashboard" className="text-xs font-bold text-slate-500 hover:text-indigo-600">
            ← Back to College Dashboard
          </Link>
        </div>

        {/* Header (Section 20) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Placement Training Center</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Institutional Training Programs & Bootcamps
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create structured training cohorts, assign batches of students, and track assessment score improvements.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Training Program</span>
          </button>
        </div>

        {/* Training Programs Grid */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading active training programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-slate-800">No Training Programs Created Yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Auto-generate a placement bootcamp using AI curriculum recommendations or create one manually.
            </p>
            <Link
              href="/college/curriculum-gap"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>1-Click AI Bootcamp Generator</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                        {prog.status} • {prog.durationWeeks} Weeks
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">{prog.title}</h2>
                      <p className="text-xs text-slate-500 leading-relaxed">{prog.description}</p>
                    </div>
                  </div>

                  {/* Targeted Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Curriculum Focus:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {prog.targetSkills?.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Modules Breakdown */}
                  {prog.modules && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Modules Included:</span>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {prog.modules.slice(0, 4).map((mod: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Enrolled: <strong className="text-slate-900">{prog.enrolledStudentCount}</strong> / {prog.targetStudentCount} students
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Score Uplift: +28%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* CREATE PROGRAM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create New Training Program</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python for Placement Bootcamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Skills (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={targetSkillsText}
                  onChange={(e) => setTargetSkillsText(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Student Batch</label>
                  <input
                    type="number"
                    value={targetStudentCount}
                    onChange={(e) => setTargetStudentCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
