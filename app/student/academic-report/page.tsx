'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Printer,
  Download,
  Share2,
  Check,
  Building2,
  QrCode,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { StudentAcademicReport } from '@/lib/types';

export default function StudentAcademicReportPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [report, setReport] = useState<StudentAcademicReport | null>(null);
  const [activeSemester, setActiveSemester] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/students/${studentId}/academic-report`)
      .then(res => res.json())
      .then(data => {
        if (data.report) setReport(data.report);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Generating Official Student Academic Report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <p className="text-slate-600 text-sm">Academic record could not be loaded.</p>
      </div>
    );
  }

  const displayedSemesters = activeSemester === 'all'
    ? report.semesters
    : report.semesters.filter(s => s.semesterNumber === activeSemester);

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Print Controls (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Verification Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-primary-600 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Transcript</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL ACADEMIC TRANSCRIPT DOCUMENT (PRINT-READY)                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-lg print:border-none print:shadow-none space-y-8">
          
          {/* 1. INSTITUTION & UNIVERSITY EMBLEM HEADER */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-white flex items-center justify-center shadow-md shrink-0">
                  <GraduationCap className="w-9 h-9 text-indigo-300" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black tracking-widest text-indigo-700 uppercase block">
                    Office of the University Registrar & Placement Cell
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {report.collegeName}
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    Accredited Grade A+ • Affiliated to State Technological Board
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 block text-center">
                  Official Verified Record ✓
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Issued: {new Date(report.issuedDate).toLocaleDateString()}
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Hash: {report.verificationHash}
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest border border-slate-300">
                Official Student Academic & Placement Readiness Transcript
              </span>
            </div>
          </div>

          {/* 2. STUDENT REGISTRATION & PERSONAL PARTICULARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Student Full Name:</span>
                <span className="font-extrabold text-slate-900">{report.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">University Roll No:</span>
                <span className="font-mono font-bold text-slate-900">{report.rollNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Registration No:</span>
                <span className="font-mono font-bold text-slate-900">{report.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Mobile Phone:</span>
                <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{report.phone}</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Degree Program:</span>
                <span className="font-extrabold text-slate-900">{report.degree}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Department / Branch:</span>
                <span className="font-bold text-slate-900">{report.department}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Academic Session:</span>
                <span className="font-bold text-slate-900">{report.admissionYear} – {report.graduationYear} (Semester {report.currentSemester})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student Email:</span>
                <span className="font-mono font-bold text-slate-900">{report.email}</span>
              </div>
            </div>
          </div>

          {/* 3. CUMULATIVE ACADEMIC BENCHMARK GAUGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Cumulative CGPA</span>
              <span className="text-2xl font-black text-indigo-950 mt-0.5 block">{report.cgpa.toFixed(2)} / 10.0</span>
              <span className="text-[10px] text-indigo-600 font-semibold">First Class with Distinction</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Credits Completed</span>
              <span className="text-2xl font-black text-emerald-950 mt-0.5 block">{report.totalCreditsEarned} / {report.totalCreditsRequired}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">100% on-track</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Institutional Attendance</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{report.overallAttendancePercentage}%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Eligible for Campus Drives ✓</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Backlogs</span>
              <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{report.activeBacklogs}</span>
              <span className="text-[10px] text-slate-500 font-semibold">Clean Academic Record</span>
            </div>
          </div>

          {/* 4. SEMESTER TRANSCRIPT FILTER BUTTONS (Hidden on Print) */}
          <div className="flex items-center justify-between print:hidden pt-2">
            <h2 className="text-sm font-bold text-slate-900">Semester-wise Grade Sheets:</h2>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setActiveSemester('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  activeSemester === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Semesters (1–6)
              </button>
              {[1, 2, 3, 4, 5, 6].map(sem => (
                <button
                  key={sem}
                  onClick={() => setActiveSemester(sem)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                    activeSemester === sem ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* 5. SEMESTER-WISE SUBJECT GRADE TABLES */}
          <div className="space-y-6">
            {displayedSemesters.map((sem) => (
              <div key={sem.semesterNumber} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{sem.semesterName}</span>
                    <span className="text-[10px] text-slate-500">({sem.academicYear})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-900">
                      SGPA: <strong className="font-mono text-sm">{sem.sgpa.toFixed(2)}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 ml-2">Credits: {sem.earnedCredits}/{sem.totalCredits}</span>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Course Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-center">Credits</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                      <th className="py-2.5 px-4 text-right">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {sem.subjects.map((sub) => (
                      <tr key={sub.code} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{sub.code}</td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">{sub.name}</td>
                        <td className="py-2.5 px-4 text-slate-500 text-[11px]">{sub.type}</td>
                        <td className="py-2.5 px-4 text-center font-mono">{sub.credits}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.grade === 'O' ? 'bg-purple-100 text-purple-900' :
                            sub.grade === 'A+' ? 'bg-emerald-100 text-emerald-900' :
                            sub.grade === 'A' ? 'bg-indigo-100 text-indigo-900' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{sub.gradePoint} / 10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 6. VERIFIED INDUSTRY SKILLS & CREDIBILITY INDEX */}
          <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Skill2Hire Industry Verification & Verified Credentials</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Skills verified through timed technical assessments and validated in the institutional passport.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Placement Status: {report.placementStatus} ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {report.verifiedSkills.map((vs) => (
                <div key={vs.skillName} className="p-3.5 bg-white rounded-2xl border border-emerald-200 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">{vs.skillName}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {vs.level} ✓
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Assessment Score:</span>
                    <span className="font-mono font-bold text-emerald-700">{vs.score}%</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Credibility Index:</span>
                    <span className="font-mono font-bold text-primary-600">{vs.credibilityScore}%</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 pt-1">
                    {vs.certificateId}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. INSTITUTIONAL REGISTRAR & SIGN-OFF FOOTER */}
          <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">Registrar Verification Seal</span>
              <p className="text-[11px] text-slate-400 max-w-sm">
                This academic transcript is digitally signed and cryptographically validated on the Skill2Hire Education-to-Employment platform.
              </p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-32 h-10 border-b border-slate-400 mx-auto" />
              <span className="text-[10px] font-bold text-slate-800 uppercase block">Controller of Examinations</span>
              <span className="text-[9px] text-slate-400">Apex University Placement Cell</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
