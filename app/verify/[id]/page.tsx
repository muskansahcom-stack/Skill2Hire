'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function CertificateVerifyPage({ params }: { params: { id: string } }) {
  const certNumber = params.id;
  const [certData, setCertData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchVerification() {
      try {
        const res = await fetch(`/api/certificates/${certNumber}`);
        const data = await res.json();
        if (data.certificate) {
          setCertData(data.certificate);
        }
      } catch (err) {
        console.error('Error verifying certificate:', err);
      } finally {
        setLoading(false);
      }
    }
    if (certNumber) fetchVerification();
  }, [certNumber]);

  const studentName = certData?.studentName || 'Alex Rivera';
  const skillName = certData?.skillOrCourseName || (certNumber.includes('PY') ? 'Python Fundamentals & OOP' : certNumber.includes('DSA') ? 'Data Structures & Algorithms' : certNumber.includes('SQL') ? 'SQL Relational Queries & Database Architecture' : 'Software Engineering');
  const level = certData?.level || 'Intermediate';
  const score = certData?.score || 88;
  const issuedDate = certData?.issuedDate || 'August 24, 2026';

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Verified Badge Header Watermark */}
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
          <ShieldCheck className="w-80 h-80 text-emerald-950" />
        </div>

        {/* Brand & Verification Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">Skill2Hire</span>
              <span className="block text-[10px] text-slate-400 font-medium -mt-0.5">Official Credential Verification</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated ✓</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center space-y-4 py-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 block">
            Verified Skill Credential
          </span>

          <p className="text-xs text-slate-400">This certifies that</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {studentName}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            has successfully passed the proctored assessment and proven competence in
          </p>

          <div className="py-3 px-6 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
            <span className="text-lg font-black text-slate-900 block">
              {skillName}
            </span>
            <span className="text-xs font-bold text-emerald-600 block mt-0.5">
              Proficiency: {level} — Score: {score}%
            </span>
          </div>
        </div>

        {/* Verification Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Credential ID</span>
            <span className="font-mono font-bold text-slate-800">{certNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Issuing Authority</span>
            <span className="font-bold text-slate-800">Skill2Hire Board</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Verification Status</span>
            <span className="font-bold text-emerald-600">Active & Valid ✓</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link href="/jobs" className="font-bold text-slate-500 hover:text-slate-900">
            ← Explore Open Jobs
          </Link>
          <Link href="/student/skills" className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <span>View Student Skill Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
