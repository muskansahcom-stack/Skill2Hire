'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Award,
  ChevronRight,
  Sparkles,
  Code,
  Terminal,
  FileText,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CourseViewerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [courseData, setCourseData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${params.id}?studentId=${studentId}`);
      const data = await res.json();
      if (data.course) {
        setCourseData(data);
        // Default to first lesson if not set
        if (!activeLesson && data.lessons?.length > 0) {
          setActiveLesson(data.lessons[0]);
        } else if (activeLesson) {
          const refreshed = data.lessons.find((l: any) => l.id === activeLesson.id);
          if (refreshed) setActiveLesson(refreshed);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [params.id, studentId]);

  const handleSelectLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setCodeOutput(null);
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setTimeout(() => {
      // Simulate live python evaluation
      if (activeLesson?.id === 'les_py_1_1') {
        setCodeOutput(`Candidate: Alex Rivera, Score: 94.5, Verified: True\nMemory address of score: 0x104b9e280\n\nProcess finished with exit code 0`);
      } else if (activeLesson?.id === 'les_py_1_2') {
        setCodeOutput(`Floor division: 4\nRemainder: 1\nPower: 32\nIs Python present? True\n\nProcess finished with exit code 0`);
      } else if (activeLesson?.id === 'les_py_2_1') {
        setCodeOutput(`Placement Ready ✓ - High Match\n\nProcess finished with exit code 0`);
      } else if (activeLesson?.id === 'les_py_5_1') {
        setCodeOutput(`Alex Readiness: 70%\n\nProcess finished with exit code 0`);
      } else {
        setCodeOutput(`Execution successful.\nOutput generated correctly without errors.\n\nProcess finished with exit code 0`);
      }
      setIsRunningCode(false);
    }, 400);
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    setMarkingComplete(true);
    try {
      const res = await fetch(`/api/courses/${courseData.course.id}/lessons/${activeLesson.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          status: 'completed'
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadCourse();
        await refreshProfile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading lesson workspace...</p>
        </div>
      </div>
    );
  }

  const course = courseData?.course;
  const modules = courseData?.modules || [];
  const progress = courseData?.userProgress;
  const assessment = courseData?.associatedAssessment;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Learning Workspace Header */}
      <header className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/courses" className="text-xs font-bold text-slate-400 hover:text-white">
            ← All Courses
          </Link>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-sm hidden sm:inline">{course?.title}</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Progress:</span>
            <span className="font-mono font-bold text-emerald-400">{progress?.completionPercentage || 0}%</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress?.completionPercentage || 0}%` }} />
            </div>
          </div>

          <Link
            href={`/assessments/${assessment?.id || 'asm_python'}`}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Take Skill Assessment</span>
          </Link>
        </div>
      </header>

      {/* Main Learning Hub Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar: Course Modules & Lessons Navigation */}
        <aside className="w-full lg:w-80 bg-slate-950 border-r border-slate-800 overflow-y-auto max-h-[calc(100vh-60px)] p-4 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Course Syllabus</span>
            <h2 className="text-sm font-bold text-white mt-0.5">{course?.title}</h2>
          </div>

          <div className="space-y-4">
            {modules.map((mod: any) => (
              <div key={mod.id} className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  {mod.title}
                </p>
                <div className="space-y-1">
                  {mod.lessons?.map((les: any) => {
                    const isSelected = activeLesson?.id === les.id;
                    const isCompleted = les.isCompleted;

                    return (
                      <button
                        key={les.id}
                        onClick={() => handleSelectLesson(les)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-primary-600/30 text-white border border-primary-500/50'
                            : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0 pr-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{les.durationMinutes}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center/Right: Active Lesson Content & Interactive Sandbox */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-60px)] p-6 sm:p-10 space-y-8 bg-slate-900">
          
          {/* Lesson Header */}
          <div className="space-y-2 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/20 text-primary-300 border border-primary-400/30">
                Interactive Lesson
              </span>
              <span className="text-xs text-slate-400">• {activeLesson?.durationMinutes || 25} minutes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeLesson?.title}
            </h1>
          </div>

          {/* Lesson Markdown Notes */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
            {activeLesson?.contentMarkdown}
          </div>

          {/* Interactive Code Snippet Sandbox */}
          {activeLesson?.codeExample && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">python_runtime.py</span>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>{isRunningCode ? 'Executing...' : 'Run Code'}</span>
                </button>
              </div>

              {/* Code Editor View */}
              <div className="p-4 font-mono text-xs text-emerald-300 bg-slate-950 overflow-x-auto">
                <pre>{activeLesson.codeExample}</pre>
              </div>

              {/* Console Output Terminal */}
              {codeOutput && (
                <div className="border-t border-slate-800 bg-black/80 p-4 font-mono text-xs text-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 mb-1 text-[10px] uppercase font-bold tracking-wider">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Terminal Execution Output</span>
                  </div>
                  <pre className="text-emerald-400 whitespace-pre-wrap">{codeOutput}</pre>
                </div>
              )}
            </div>
          )}

          {/* Check Question (Knowledge Validation) */}
          {activeLesson?.checkQuestion && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary-300">Quick Check Question</span>
              </div>

              <p className="text-sm font-bold text-white">{activeLesson.checkQuestion.question}</p>

              <div className="space-y-2">
                {activeLesson.checkQuestion.options.map((opt: string, idx: number) => {
                  const isCorrect = idx === activeLesson.checkQuestion.correctIndex;
                  const isSelected = selectedOption === idx;

                  let optClass = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500';
                  if (quizSubmitted) {
                    if (isCorrect) optClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                    else if (isSelected) optClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                  } else if (isSelected) {
                    optClass = 'bg-primary-950/80 border-primary-500 text-primary-200';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${optClass}`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => selectedOption !== null && setQuizSubmitted(true)}
                  disabled={selectedOption === null}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                >
                  Verify Answer
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-1">
                    {selectedOption === activeLesson.checkQuestion.correctIndex ? '✓ Correct!' : '✕ Explanation:'}
                  </span>
                  {activeLesson.checkQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {/* Action Footer: Mark Complete & Next Lesson */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleCompleteLesson}
              disabled={markingComplete}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{markingComplete ? 'Saving...' : 'Complete Lesson ✓'}</span>
            </button>

            <Link
              href={`/assessments/${assessment?.id || 'asm_python'}`}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Take Official Skill Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </main>
      </div>

    </div>
  );
}
