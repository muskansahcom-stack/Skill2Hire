'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  PlayCircle,
  ShieldCheck,
  Send,
  AlertCircle,
  FileCheck,
  Users
} from 'lucide-react';
import ReadinessGauge from '@/components/ReadinessGauge';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  const jobId = params?.id as string;

  const [jobData, setJobData] = useState<any>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<any>(null);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${jobId}?studentId=${studentId}`);
        const data = await res.json();
        if (data.job) {
          setJobData(data.job);
          setMatchAnalysis(data.matchAnalysis);
          setExistingApplication(data.existingApplication);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (jobId) loadJobDetails();
  }, [jobId, studentId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      const data = await res.json();
      if (data.success) {
        setExistingApplication(data.application);
        setApplySuccess('Application submitted successfully to ' + jobData.companyName + '!');
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Analyzing job requirements & verified skill gap...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Job position not found</h2>
        <Link href="/jobs" className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-block">
          Return to Job Search
        </Link>
      </div>
    );
  }

  const isEligible = matchAnalysis?.isEligible;
  const matchScore = matchAnalysis?.matchScore || 65;
  const skillsAnalysis = matchAnalysis?.skillsAnalysis || [];
  const readinessSteps = matchAnalysis?.readinessSteps || [];

  const applicationStages = ['Applied', 'Under Review', 'Shortlisted', 'Assessment', 'Interview', 'Selected'];
  const currentStageIndex = existingApplication ? applicationStages.indexOf(existingApplication.status) : -1;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/student/dashboard" className="hover:text-primary-600">Student</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-primary-600">Jobs</Link>
          <span>/</span>
          <span className="text-slate-900">{jobData.title}</span>
        </div>

        {/* ========================================================================= */}
        {/* 🏢 1. JOB HEADER HERO BANNER                                               */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-2 flex items-center justify-center font-bold text-slate-900 shrink-0 overflow-hidden shadow-lg">
              {jobData.companyLogo ? (
                <img src={jobData.companyLogo} alt={jobData.companyName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-xl">{jobData.companyName.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="space-y-2">
              <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 inline-block">
                {jobData.department}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {jobData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
                <span className="font-bold text-white">{jobData.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {jobData.location}
                </span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 font-bold text-cyan-300">
                  {jobData.workMode}
                </span>
                <span>•</span>
                <span className="font-black text-white">{jobData.salary}</span>
              </div>
            </div>
          </div>

          {/* Quick Match Indicator */}
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 text-center sm:text-right shrink-0 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-400">Skill Match Score</div>
            <div className="text-3xl font-black text-cyan-300">{matchScore}%</div>
            <div>
              {isEligible ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Eligible to Apply
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Preparation Needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Existing Application Status Tracker */}
        {existingApplication && (
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-emerald-900">Application Submitted & Active</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase">
                Status: {existingApplication.status}
              </span>
            </div>

            {/* Stages Progress Tracker */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
              {applicationStages.map((stg, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = existingApplication.status === stg;
                return (
                  <div
                    key={stg}
                    className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">Stage {idx + 1}</div>
                    <div>{stg}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================================================= */}
          {/* 📄 2. JOB DETAILS & REQUIREMENTS (2 COLS)                                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-black text-slate-900">Role Overview</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {jobData.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Key Responsibilities:</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {(jobData.responsibilities || []).map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic Requirements */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Academic Criteria:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="text-slate-400 font-bold">Minimum CGPA</div>
                    <div className="font-black text-slate-900">{jobData.minCgpa || 7.0} / 10.0</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="text-slate-400 font-bold">Graduation Year</div>
                    <div className="font-black text-slate-900">{jobData.graduationYear || 2026} Batch</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs col-span-2 sm:col-span-1">
                    <div className="text-slate-400 font-bold">Degree / Branch</div>
                    <div className="font-black text-slate-900">{jobData.degree || 'B.S. / B.Tech'}</div>
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">About {jobData.companyName}:</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Leading technology partner recruiting campus talent through Skill2Hire verified skill passports and direct evaluation pipelines.
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 250-500 Employees</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {jobData.deadline || 'Nov 2026'}</span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 🛠️ 3. HOW TO BECOME ELIGIBLE (Preparation Roadmap)                        */}
            {/* ========================================================================= */}
            {!isEligible && readinessSteps.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">How to Become Eligible</h2>
                    <p className="text-xs text-slate-600">Complete these targeted milestones to unlock eligibility for this role.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {readinessSteps.map((step: any) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-2xl bg-white border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs shrink-0">
                          {step.stepNumber}
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          {step.action}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {step.courseId ? (
                          <Link
                            href={`/courses/${step.courseId}/learn`}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Start Course</span>
                          </Link>
                        ) : step.assessmentId ? (
                          <Link
                            href={`/assessments/${step.assessmentId}`}
                            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Take Test</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/learn/${encodeURIComponent(step.skillName)}`}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <span>Learn</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Start Prep Button */}
                <div className="pt-2">
                  <Link
                    href={readinessSteps[0]?.courseId ? `/courses/${readinessSteps[0].courseId}/learn` : `/learn`}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>START MY PREPARATION NOW</span>
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* 🎯 3. RIGHT COLUMN: YOUR JOB READINESS & APPLY ACTION                     */}
          {/* ========================================================================= */}
          <div className="space-y-6">
            
            {/* Readiness Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-black text-base text-slate-900">Your Job Readiness</h3>
                <div className="flex justify-center py-2">
                  <ReadinessGauge score={matchScore} size="lg" title="Match Score" />
                </div>
              </div>

              {/* Skills Checklist (Section 6) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Required Skills Breakdown:</h4>

                <div className="space-y-2.5">
                  {skillsAnalysis.map((sk: any) => {
                    const isVerified = sk.status === 'VERIFIED';
                    const isLevelGap = sk.status === 'LEVEL_GAP';
                    const isMissing = sk.status === 'MISSING';

                    return (
                      <div
                        key={sk.skillName}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                          isVerified
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : isLevelGap
                            ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                            : 'bg-rose-50/60 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-black text-xs text-slate-900 flex items-center gap-1">
                            <span>{sk.skillName}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({sk.requiredLevel})</span>
                          </div>
                          <div className="text-[10px]">
                            {isVerified ? (
                              <span className="text-emerald-700 font-bold">Your Level: {sk.studentLevel} ✓</span>
                            ) : isLevelGap ? (
                              <span className="text-amber-700 font-bold">Your Level: {sk.studentLevel} ⚠</span>
                            ) : (
                              <span className="text-rose-700 font-bold">Not Verified ❌</span>
                            )}
                          </div>
                        </div>

                        <div>
                          {!isVerified && (
                            <Link
                              href={`/learn/${encodeURIComponent(sk.skillName)}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] hover:bg-primary-600 transition-colors inline-block"
                            >
                              Learn
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply / Status CTA Button */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {existingApplication ? (
                  <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Applied on {new Date(existingApplication.appliedAt).toLocaleDateString()}</span>
                  </div>
                ) : isEligible ? (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full py-3.5 px-6 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{applying ? 'Submitting Application...' : 'APPLY NOW'}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-3.5 px-6 rounded-2xl bg-slate-200 text-slate-500 font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <span>NOT YET ELIGIBLE (Need {matchAnalysis?.missingSkillsCount || 2} Skills)</span>
                    </button>
                    <p className="text-[11px] text-slate-500 text-center">
                      Complete preparation steps on the left to verify your skills and unlock the Apply button.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Verification Guarantee Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-3 text-center">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-cyan-300">Skill2Hire Zero-Fraud Guarantee</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you apply, {jobData.companyName} receives your tamper-proof cryptographic skill scorecard verified directly by Skill2Hire.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
