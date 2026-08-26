'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Award,
  TrendingUp,
  Mic,
  MicOff,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { InterviewQuestion, InterviewAnswerEvaluation } from '@/lib/types';

export default function InterviewCoachPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [category, setCategory] = useState('All');
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewAnswerEvaluation | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        let url = '/api/interview/questions?role=Software Developer';
        if (category !== 'All') url += `&category=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
          if (data.questions.length > 0 && !selectedQuestion) {
            setSelectedQuestion(data.questions[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadQuestions();
  }, [category]);

  const handleSelectQuestion = (q: InterviewQuestion) => {
    setSelectedQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !userAnswer.trim()) return;

    setEvaluating(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          questionText: selectedQuestion.question,
          category: selectedQuestion.category,
          answerText: userAnswer,
          studentId
        })
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speech-to-text insertion
      setUserAnswer(prev => prev + (prev ? ' ' : '') + 'Python handles memory through reference counting and a cyclic garbage collector with generations.');
    }
  };

  const categories = ['All', 'Technical', 'Behavioral'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
        </div>

        {/* 1. HEADER (Section 11) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                <span>AI Technical & Behavioral Simulator</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                AI Interview Coach & Readiness Evaluator
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Practice interview questions generated specifically for Software Developer openings. Evaluated across 4 rubric dimensions.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    category === c ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. GRID: QUESTION SELECTOR & ANSWER EVALUATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Questions List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Interview Prompts</h2>
            {questions.map((q) => {
              const isSelected = selectedQuestion?.id === q.id;

              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-white border-primary-500 shadow-md ring-2 ring-primary-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.category} • {q.skillName}
                    </span>
                    <span className="text-[10px] font-bold text-primary-600">{q.difficulty}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{q.question}</p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Question Answer Form & AI Evaluation */}
          {selectedQuestion && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Question Header */}
              <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                    {selectedQuestion.category} Question ({selectedQuestion.skillName})
                  </span>
                  <span className="text-xs font-bold text-slate-400">{selectedQuestion.difficulty} Level</span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 leading-relaxed">
                  {selectedQuestion.question}
                </h2>
              </div>

              {/* Response Form */}
              <form onSubmit={handleEvaluate} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">Your Response:</label>
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        isRecording ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isRecording ? <Mic className="w-3 h-3 text-rose-600" /> : <MicOff className="w-3 h-3 text-slate-400" />}
                      <span>{isRecording ? 'Listening (Voice)...' : 'Enable Speech-to-Text'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    required
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Provide your structured explanation detailing technical mechanisms, data structures, and trade-offs..."
                    className="w-full p-4 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary-600/25 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{evaluating ? 'AI Evaluating Response...' : 'Submit & Grade Answer'}</span>
                  </button>
                </div>
              </form>

              {/* AI Evaluation Report (Section 11) */}
              {evaluation && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Rubric Evaluation</span>
                      <h3 className="font-extrabold text-sm text-slate-900">Interview Readiness Score</h3>
                    </div>
                    <span className="text-2xl font-black font-mono text-primary-600">
                      {evaluation.overallScore}%
                    </span>
                  </div>

                  {/* 4 Rubric Criteria Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Technical</span>
                      <span className="font-bold text-slate-900">{evaluation.criteriaScores.technicalCorrectness}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Relevance</span>
                      <span className="font-bold text-slate-900">{evaluation.criteriaScores.relevance}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Structure</span>
                      <span className="font-bold text-slate-900">{evaluation.criteriaScores.structure}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Communication</span>
                      <span className="font-bold text-slate-900">{evaluation.criteriaScores.communication}%</span>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-emerald-700 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Key Strengths:</span>
                      </span>
                      <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                        {evaluation.feedback.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-amber-700 flex items-center gap-1 mb-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Suggested Refinements:</span>
                      </span>
                      <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {evaluation.feedback.suggestedRefinement}
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
