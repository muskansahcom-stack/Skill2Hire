'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Code2,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'practice' | 'resources'>('video');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoursePlayer() {
      setLoading(true);
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
          setModules(data.modules || []);
          setLessons(data.lessons || []);

          // Load completed lesson progress
          if (data.progress) {
            const completed = data.progress
              .filter((p: any) => p.status === 'completed')
              .map((p: any) => p.lessonId);
            setCompletedLessonIds(completed);
          }
        }
      } catch (err) {
        console.error('Error loading course player:', err);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) loadCoursePlayer();
  }, [courseId]);

  const currentLesson = lessons[currentLessonIndex] || {
    id: 'les_py_1_1',
    title: 'Python Variables & Memory Allocation',
    durationMinutes: 20,
    videoDuration: '18:42',
    contentMarkdown: '# Python Core Fundamentals\n\nVariables are references to allocated objects in memory...',
    notesMarkdown: '## Summary Notes\n- Dynamic Typing: No type declarations required\n- Mutable vs Immutable Objects\n- Time complexity of operations: O(1) assignments',
    practiceTask: 'Declare three variables representing job name, salary, and score. Print them using formatted strings.',
    checkQuestion: {
      question: 'Which of the following data types in Python is mutable?',
      options: ['Tuple', 'String', 'List', 'Integer'],
      correctIndex: 2,
      explanation: 'Lists can be mutated in-place with .append() or index assignments without changing memory address.'
    }
  };

  const handleMarkCompleted = async () => {
    if (!currentLesson) return;
    const isAlreadyCompleted = completedLessonIds.includes(currentLesson.id);

    try {
      await fetch(`/api/courses/${courseId}/lessons/${currentLesson.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          status: 'completed',
          lessonId: currentLesson.id
        })
      });

      if (!isAlreadyCompleted) {
        setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
      }

      // Auto advance to next lesson if available
      if (currentLessonIndex < lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        setSelectedOption(null);
        setQuizFeedback(null);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentLesson.checkQuestion) return;
    if (selectedOption === currentLesson.checkQuestion.correctIndex) {
      setQuizFeedback('🎉 Correct! ' + currentLesson.checkQuestion.explanation);
    } else {
      setQuizFeedback('❌ Incorrect. Hint: ' + currentLesson.checkQuestion.explanation);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Initializing video player and course modules...</p>
        </div>
      </div>
    );
  }

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 42;

  const isCurrentCompleted = completedLessonIds.includes(currentLesson?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 🌟 1. PLAYER TOP NAVBAR                                                    */}
      {/* ========================================================================= */}
      <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-sm sm:text-base font-black text-white line-clamp-1">
              {course?.title || 'Skill2Hire Video Course'}
            </h1>
            <div className="text-[11px] text-cyan-400 font-mono">
              Lesson {currentLessonIndex + 1} of {lessons.length || 1} • {currentLesson?.title}
            </div>
          </div>
        </div>

        {/* Progress & Assessment button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Progress:</span>
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
          </div>

          <Link
            href={`/assessments/asm_python`}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Take Assessment</span>
            <span className="sm:hidden">Test</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🎬 2. MAIN PLAYER BODY & SIDEBAR                                           */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Left 3 Cols: Video Stage & Interactive Tabs */}
        <div className="lg:col-span-3 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          
          {/* Video Stage Frame */}
          <div className="rounded-3xl bg-black border border-slate-800 overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
            {/* Realistic video playback screen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="text-center space-y-3 z-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white drop-shadow">
                  {currentLesson?.title}
                </h3>
                <p className="text-xs text-cyan-300 font-mono">
                  Duration: {currentLesson?.videoDuration || '18:42'} • High Definition 1080p
                </p>
              </div>
            </div>

            {/* Video Controls Bar Mock */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-950/80 backdrop-blur z-20 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-400">04:15 / {currentLesson?.videoDuration || '18:42'}</span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="hidden sm:inline text-slate-400">Speaker: Skill2Hire Principal Architect</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono">1.0x</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">1080p HD</span>
              </div>
            </div>
          </div>

          {/* Lesson Navigation Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentLessonIndex > 0) {
                    setCurrentLessonIndex(currentLessonIndex - 1);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }
                }}
                disabled={currentLessonIndex === 0}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (currentLessonIndex < lessons.length - 1) {
                    setCurrentLessonIndex(currentLessonIndex + 1);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }
                }}
                disabled={currentLessonIndex === lessons.length - 1}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleMarkCompleted}
              className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
                isCurrentCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCurrentCompleted ? 'Completed ✓ (Next)' : 'Mark as Completed'}</span>
            </button>
          </div>

          {/* Interactive Lesson Tabs (Video, Notes, Practice, Resources) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'video', label: 'Lesson Overview', icon: BookOpen },
                { id: 'notes', label: 'Study Notes & Cheatsheet', icon: FileText },
                { id: 'practice', label: 'Practice Check Question', icon: Code2 },
                { id: 'resources', label: 'Downloadable Resources', icon: Download }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Lesson Overview */}
            {activeTab === 'video' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <h3 className="text-base font-black text-white">{currentLesson?.title}</h3>
                <div className="whitespace-pre-line font-mono text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300">
                  {currentLesson?.contentMarkdown || 'Lesson markdown material and code explanations.'}
                </div>
              </div>
            )}

            {/* Tab 2: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <h3 className="text-base font-black text-white">Curated Placement Notes</h3>
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentLesson?.notesMarkdown || 'Comprehensive notes and syntax summary for quick placement revision.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Practice Question */}
            {activeTab === 'practice' && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-white">Placement Quick Check</h3>
                {currentLesson?.checkQuestion ? (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {currentLesson.checkQuestion.question}
                    </p>

                    <div className="space-y-2">
                      {currentLesson.checkQuestion.options.map((opt: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                            selectedOption === idx
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedOption === null}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs transition-colors"
                      >
                        Submit Check Answer
                      </button>
                      {quizFeedback && (
                        <span className="text-xs font-bold text-slate-200">
                          {quizFeedback}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No question for this lesson.</p>
                )}
              </div>
            )}

            {/* Tab 4: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-white">Downloadable Materials</h3>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-white">Official Cheatsheet (PDF)</div>
                    <div className="text-[10px] text-slate-500">Includes syntax, memory model, and placement interview questions</div>
                  </div>
                  <button
                    onClick={() => alert('Downloading official course materials')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📋 3. RIGHT SIDEBAR: COURSE MODULES & LESSON CHECKLIST                    */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Course Curriculum</h3>
            <p className="text-xs text-slate-500">{lessons.length} lessons • {modules.length || 7} modules</p>
          </div>

          <div className="space-y-4">
            {lessons.map((les: any, idx: number) => {
              const isCurrent = currentLessonIndex === idx;
              const isCompleted = completedLessonIds.includes(les.id);

              return (
                <button
                  key={les.id}
                  onClick={() => {
                    setCurrentLessonIndex(idx);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/30'
                      : isCompleted
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <PlayCircle className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-white font-black' : ''}`}>
                      {les.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {les.videoDuration || '15:00'} • Module {Math.floor(idx / 3) + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* End of Course Assessment Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-800/60 space-y-3 text-center">
            <Award className="w-7 h-7 text-purple-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-black text-xs text-white">Final Skill Verification</h4>
              <p className="text-[10px] text-purple-300">
                Score $\ge 70\%$ to verify this skill on your official Skill Passport.
              </p>
            </div>
            <Link
              href="/assessments/asm_python"
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-600/25 transition-all"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
