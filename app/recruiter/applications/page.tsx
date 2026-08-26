'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Award,
  ChevronRight,
  Send
} from 'lucide-react';
import { ApplicationStatus } from '@/lib/types';

export default function RecruiterApplicationsPage() {
  const { profile } = useAuth();
  const companyId = profile?.id || 'comp_1';

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      let url = `/api/recruiter/applications?companyId=${companyId}`;
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [companyId, statusFilter]);

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingId(appId);
    try {
      const res = await fetch('/api/recruiter/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          status: newStatus,
          notes: `Candidate advanced to ${newStatus} based on verified skills profile.`
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadApplications();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const stages: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Assessment', 'Interview', 'Selected'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/recruiter/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* Header & Stage Filter (Section 30 & 31) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Hiring Pipeline</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Review & Manage Job Applicants
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Applicants ranked by verified skill matching percentage. Transition candidates across hiring stages.
              </p>
            </div>

            {/* Quick Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  statusFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({applications.length})
              </button>
              {stages.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    statusFilter === st ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants List (Section 49 Step 11) */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading candidate applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-base font-bold text-slate-800">No Applicants in this Stage</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Follow demo workflow Step 10 to submit an application as Alex Rivera (91% match) and review it here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900">{app.studentName}</h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {app.matchPercentage}% Match Score
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.studentCollege} • Applied for <strong>{app.jobTitle}</strong> on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Stage:</span>
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    >
                      {stages.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Verified Skills Strip (Section 49 Step 11) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Candidate Verified Skills Passport:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.verifiedSkills?.length > 0 ? (
                      app.verifiedSkills.map((vs: any) => (
                        <span
                          key={vs.skillName}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300"
                        >
                          {vs.skillName} ({vs.level}) ✓ {vs.score}%
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Self-declared profile (Python, SQL, Git)</span>
                    )}
                  </div>
                </div>

                {/* Recruiter Quick Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-semibold">Verified Candidate ID: {app.studentId}</span>
                    <Link
                      href={`/college/students/${app.studentId}/report`}
                      className="font-bold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Official Academic Transcript →</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {app.status !== 'Shortlisted' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                        className="px-3 py-1 rounded-lg font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                      >
                        Shortlist Candidate
                      </button>
                    )}
                    {app.status !== 'Interview' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Interview')}
                        className="px-3 py-1 rounded-lg font-bold text-primary-700 bg-primary-50 hover:bg-primary-100"
                      >
                        Schedule Interview
                      </button>
                    )}
                    {app.status !== 'Selected' && (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Selected')}
                        className="px-3 py-1 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                      >
                        Select for Hire 🎉
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
