'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Printer,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { StudentAcademicReport } from '@/lib/types';

export default function CollegeStudentReportView() {
  const params = useParams();
  const studentId = (params?.id as string) || 'std_1';

  const [report, setReport] = useState<StudentAcademicReport | null>(null);
  const [activeSemester, setActiveSemester] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading Student Official Academic Transcript...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 text-center">
        <p className="text-slate-600 text-sm">Academic report not found for student.</p>
        <Link href="/college/students" className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:underline">
          ← Back to Student Roster
        </Link>
      </div>
    );
  }

  const displayedSemesters = activeSemester === 'all'
    ? report.semesters
    : report.semesters.filter(s => s.semesterNumber === activeSemester);

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between print:hidden">
          <Link href="/college/students" className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to College Student Roster</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Academic Transcript</span>
          </button>
        </div>

        {/* OFFICIAL TRANSCRIPT CARD */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-lg print:border-none print:shadow-none space-y-8">
          
          {/* 1. Header */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-white flex items-center justify-center shadow-md shrink-0">
                  <GraduationCap className="w-9 h-9 text-indigo-300" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black tracking-widest text-indigo-700 uppercase block">
                    Institutional Placement Record & Academic Transcript
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {report.collegeName}
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    Accredited Grade A+ • Student Telemetry File
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 block text-center">
                  Verified by Registrar ✓
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Issued: {new Date(report.issuedDate).toLocaleDateString()}
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Hash: {report.verificationHash}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Particulars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Student Name:</span>
                <span className="font-extrabold text-slate-900">{report.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Roll Number:</span>
                <span className="font-mono font-bold text-slate-900">{report.rollNumber}</span>
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
                <span className="text-slate-500 font-semibold">Program / Degree:</span>
                <span className="font-extrabold text-slate-900">{report.degree}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1">
                <span className="text-slate-500 font-semibold">Department:</span>
                <span className="font-bold text-slate-900">{report.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Placement Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {report.placementStatus} ({report.placementReadinessScore}%)
                </span>
              </div>
            </div>
          </div>

          {/* 3. Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Cumulative CGPA</span>
              <span className="text-2xl font-black text-indigo-950 mt-0.5 block">{report.cgpa.toFixed(2)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Credits Completed</span>
              <span className="text-2xl font-black text-emerald-950 mt-0.5 block">{report.totalCreditsEarned} / {report.totalCreditsRequired}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Attendance</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{report.overallAttendancePercentage}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Backlogs</span>
              <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{report.activeBacklogs}</span>
            </div>
          </div>

          {/* 4. Semester Tables */}
          <div className="space-y-6">
            {displayedSemesters.map((sem) => (
              <div key={sem.semesterNumber} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{sem.semesterName}</span>
                  <span className="text-xs font-bold text-indigo-900">SGPA: {sem.sgpa.toFixed(2)}</span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Course Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-4 text-center">Credits</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                      <th className="py-2.5 px-4 text-right">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {sem.subjects.map((sub) => (
                      <tr key={sub.code}>
                        <td className="py-2 px-4 font-mono font-bold">{sub.code}</td>
                        <td className="py-2 px-4">{sub.name}</td>
                        <td className="py-2 px-4 text-center font-mono">{sub.credits}</td>
                        <td className="py-2 px-4 text-center font-bold text-indigo-900">{sub.grade}</td>
                        <td className="py-2 px-4 text-right font-mono font-bold">{sub.gradePoint} / 10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 5. Verified Skills */}
          <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Verified Technical Competencies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.verifiedSkills.map((vs) => (
                <div key={vs.skillName} className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>{vs.skillName}</span>
                    <span className="text-emerald-700">{vs.level} ✓</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Score: {vs.score}% • Credibility: {vs.credibilityScore}%</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
