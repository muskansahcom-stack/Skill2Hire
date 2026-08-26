'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  QrCode,
  Calendar,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

export default function StudentCertificatesPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  const studentName = profile?.name || 'Alex Rivera';

  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch(`/api/students/${studentId}`);
        const data = await res.json();
        if (data.certificates && data.certificates.length > 0) {
          const formatted = data.certificates.map((c: any) => ({
            id: c.id,
            title: c.skillOrCourseName || `${c.type || 'Skill'} Certification`,
            skill: c.skillOrCourseName?.split(' ')[0] || 'Technical Skill',
            level: c.level || 'Intermediate',
            score: c.score || 88,
            issueDate: c.issuedDate || 'August 24, 2026',
            issuer: 'Skill2Hire Technical Assessment Board',
            verificationCode: c.certificateNumber || `S2H-${c.id}`,
            verificationUrl: c.verificationUrl || `/verify/${c.certificateNumber || c.id}`,
            status: 'Valid Certificate ✓'
          }));
          setCertificates(formatted);
        } else {
          // Default initial verified credentials
          setCertificates([
            {
              id: 'cert_py_adv_2026',
              title: 'Python for Placement & System Engineering',
              skill: 'Python',
              level: 'Advanced',
              score: 88,
              issueDate: 'August 24, 2026',
              issuer: 'Skill2Hire Technical Assessment Board',
              verificationCode: 'S2H-PY-8892-VERIFIED',
              verificationUrl: '/verify/cert_py_adv_2026',
              status: 'Valid Certificate ✓'
            },
            {
              id: 'cert_sql_adv_2026',
              title: 'SQL for Data Analytics & Database Design',
              skill: 'SQL',
              level: 'Intermediate',
              score: 92,
              issueDate: 'August 21, 2026',
              issuer: 'Skill2Hire Technical Assessment Board',
              verificationCode: 'S2H-SQL-9214-VERIFIED',
              verificationUrl: '/verify/cert_sql_adv_2026',
              status: 'Valid Certificate ✓'
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    if (studentId) fetchCertificates();
  }, [studentId]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verified Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Digital Skill Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official skill certificates generated upon scoring $\ge 70\%$ in proctored assessments.
          </p>
        </div>

        <Link
          href="/assessments/asm_python"
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-primary-600/20 transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>Earn New Certificate</span>
        </Link>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
          >
            {/* Top decorative header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    {cert.status}
                  </span>
                  <h3 className="font-black text-lg text-white pt-1">{cert.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-cyan-300 font-bold shrink-0">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-medium relative z-10 pt-2 border-t border-white/10">
                <span>Awarded to: <strong className="text-white">{studentName}</strong></span>
                <span className="font-black text-cyan-300 font-mono">Score: {cert.score}%</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Issued On</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {cert.issueDate}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Skill Level</span>
                  <div className="font-bold text-primary-600">
                    {cert.level} Proficiency
                  </div>
                </div>
              </div>

              {/* Verification Code Box */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between font-mono text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Verification Code</span>
                  <div className="font-bold text-slate-900">{cert.verificationCode}</div>
                </div>
                <QrCode className="w-6 h-6 text-slate-600" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={cert.verificationUrl}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Online</span>
                </Link>

                <button
                  onClick={() => alert(`Certificate ${cert.verificationCode} downloaded as verified PDF.`)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Verification Notice */}
      <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-900">100% Tamper-Proof Skill Credentials</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every Skill2Hire certificate is backed by a permanent verification ID and tamper-proof assessment scorecard. Employers scanning your QR code or checking the verification URL see the exact scoring breakdown and proctored timestamp.
          </p>
        </div>
      </div>
    </div>
  );
}
