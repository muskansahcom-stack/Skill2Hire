'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  RotateCcw,
  Check
} from 'lucide-react';

export default function AssessmentTestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await fetch(`/api/assessments/${params.id}`);
        const data = await res.json();
        if (data.assessment) {
          setAssessment(data.assessment);
          setQuestions(data.questions || []);
          setTimeLeft((data.assessment.durationMinutes || 20) * 60);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadAssessment();
  }, [params.id]);

  // Timer countdown
  useEffect(() => {
    if (results || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [results, loading, timeLeft]);

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assessments/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          answers
        })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
        await refreshProfile();
        
        // Trigger celebratory confetti on passing
        if (data.passed) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-16 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Preparing secure assessment environment...</p>
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <p className="text-base font-bold text-slate-800">Assessment not found</p>
        <Link href="/courses" className="text-xs font-bold text-primary-600 mt-2 inline-block">← Back to Courses</Link>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Test Navigation Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-white">{assessment.title}</h1>
              <p className="text-[11px] text-slate-400">Target Level: <strong className="text-emerald-400">{assessment.targetLevel}</strong> • Passing Score: <strong>{assessment.passingScore}%</strong></p>
            </div>
          </div>

          {!results && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS SCREEN (If submitted) */}
        {results ? (
          <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 space-y-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center max-w-md mx-auto space-y-3">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                results.passed ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400' : 'bg-rose-500/20 border border-rose-400/40 text-rose-400'
              }`}>
                {results.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                results.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}>
                {results.passed ? 'Assessment Passed ✓' : 'Did Not Pass'}
              </span>

              <h2 className="text-3xl font-black text-white">
                Score: {results.score}%
              </h2>

              <p className="text-xs text-slate-400">
                {results.passed
                  ? `Congratulations! You verified ${assessment.skillName} at the ${results.awardedLevel} level. Your Skill Passport and Job Match score have been updated!`
                  : `You scored below the ${assessment.passingScore}% passing threshold. Review the questions and retry to get verified.`}
              </p>

              {results.passed && results.certificate && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300">Skill Verified Badge Awarded</span>
                    <span className="font-mono text-[10px] text-emerald-400">{results.certificate.certificateNumber}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Badge: <strong>{assessment.skillName} — {results.awardedLevel} — Verified ✓</strong>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/jobs/job_1"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check Job Match (91% Updated!)</span>
                </Link>

                <Link
                  href="/student/skills"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>View Skill Passport</span>
                </Link>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Answer Analysis</h3>
              <div className="space-y-3">
                {results.feedback?.map((fb: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    fb.isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/30'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-white">Q{idx + 1}: {fb.questionText}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        fb.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {fb.isCorrect ? 'Correct ✓' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      <strong>Explanation:</strong> {fb.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE TEST TAKING SCREEN */
          <div className="space-y-6">
            {/* Progress Bar & Question Tabs */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Answered: {answeredCount}/{questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                      currentQuestionIndex === idx
                        ? 'bg-primary-600 text-white'
                        : answers[q.id] !== undefined
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-400">
                  Question {currentQuestionIndex + 1} ({currentQ.points} Points)
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.questionText}
                </h2>

                {currentQ.codeSnippet && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options?.map((opt: string, optIdx: number) => {
                  const isSelected = answers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-600/30 border-primary-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 transition-colors"
                >
                  Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{submitting ? 'Verifying...' : 'Submit Assessment & Verify'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
