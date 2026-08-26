'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  PlayCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function DemoWorkflowBanner() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  const steps = [
    { num: 1, title: 'Company Post', role: 'company', roleId: 'u_comp_1', action: 'Create Software Dev Job', link: '/recruiter/jobs/new', desc: 'TechNova posts Software Developer with Python, C++, DSA, SQL, Git, AWS.' },
    { num: 2, title: 'AI Extraction', role: 'company', roleId: 'u_comp_1', action: 'Inspect AI Extracted Skills', link: '/recruiter/jobs/new', desc: 'AI extracts required levels (Python Int, DSA Int, SQL Basic, Git Basic, AWS Basic).' },
    { num: 3, title: 'College Demand', role: 'college', roleId: 'u_col_1', action: 'View Demand & Curriculum Gap', link: '/college/curriculum-gap', desc: 'Apex University reviews high Python/DSA/SQL demand vs syllabus gap.' },
    { num: 4, title: 'Bootcamp', role: 'college', roleId: 'u_col_1', action: 'Create Placement Bootcamp', link: '/college/curriculum-gap', desc: 'College creates 1-click training program for Python + DSA + SQL.' },
    { num: 5, title: 'Student Match (62%)', role: 'student', roleId: 'u_student_1', action: 'Check Software Dev Job Match', link: '/jobs/job_1', desc: 'Alex Rivera sees 62% match: Missing Python Int, DSA Int, AWS Basic.' },
    { num: 6, title: 'Learning Roadmap', role: 'student', roleId: 'u_student_1', action: 'Click Become Eligible', link: '/jobs/job_1', desc: 'AI generates personalized roadmap: Alex starts Python Fundamentals.' },
    { num: 7, title: 'Python Verified (86%)', role: 'student', roleId: 'u_student_1', action: 'Take Python Assessment', link: '/assessments/asm_python', desc: 'Alex completes assessment, scores 86%, earns Python Verified ✓.' },
    { num: 8, title: 'DSA Verified', role: 'student', roleId: 'u_student_1', action: 'Take DSA Assessment', link: '/assessments/asm_dsa', desc: 'Alex verifies DSA Intermediate, updating Skill Passport.' },
    { num: 9, title: 'Match Recalculates (91%)', role: 'student', roleId: 'u_student_1', action: 'Verify Eligible 91%', link: '/jobs/job_1', desc: 'System automatically recalculates match to 91% (Status: Eligible ✓).' },
    { num: 10, title: 'Apply Now', role: 'student', roleId: 'u_student_1', action: 'Submit Job Application', link: '/jobs/job_1', desc: 'Alex clicks Apply Now; verified profile sent to TechNova.' },
    { num: 11, title: 'Company Review', role: 'company', roleId: 'u_comp_1', action: 'Review 91% Match Candidate', link: '/recruiter/applications', desc: 'TechNova recruiter reviews Alex with verified Python, DSA, SQL, Git.' },
    { num: 12, title: 'Placement Ready ✓', role: 'college', roleId: 'u_col_1', action: 'Verify Placement Readiness', link: '/college/students', desc: 'Apex University dashboard updates Alex to Placement Ready ✓.' }
  ];

  const handleStepClick = async (step: any) => {
    setActiveStep(step.num);
    await switchPersona(step.role, step.roleId);
    router.push(step.link);
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      await switchPersona('student', 'u_student_1');
      setActiveStep(1);
      router.push('/jobs/job_1');
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 text-white border-b border-primary-900/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Banner Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-primary-500/20 border border-primary-400/40 flex items-center justify-center text-primary-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs tracking-wide text-primary-200 uppercase">
                End-to-End Ecosystem Demo
              </span>
              <span className="hidden sm:inline text-xs text-slate-400">•</span>
              <span className="hidden md:inline text-xs text-slate-300">
                12-Step Real Flow: Company Post → College Gap → Student Training → Verification → 91% Match → Application
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-medium text-slate-200 transition-colors"
              title="Reset test data to initial pristine demo state"
            >
              <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded 12 Step Interactive Navigator */}
        {isExpanded && (
          <div className="mt-3 pt-2.5 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {steps.map((step) => {
                const isActive = activeStep === step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => handleStepClick(step)}
                    className={`text-left p-2 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                      isActive
                        ? 'bg-primary-600/30 border-primary-400 text-white shadow-sm ring-1 ring-primary-400'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-primary-300">
                        Step {step.num}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-1 rounded ${
                        step.role === 'company' ? 'bg-amber-500/20 text-amber-300' :
                        step.role === 'college' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {step.role}
                      </span>
                    </div>
                    <p className="font-semibold text-[11px] text-white truncate leading-snug">{step.title}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{step.action}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
