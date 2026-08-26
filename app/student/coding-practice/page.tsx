'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Code2,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { CodingProblem } from '@/lib/types';

export default function CodingPracticePage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp'>('python');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTopic, setActiveTopic] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        let url = '/api/coding/problems';
        if (activeTopic !== 'All') url += `?topic=${activeTopic}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.problems) {
          setProblems(data.problems);
          if (data.problems.length > 0 && !selectedProblem) {
            setSelectedProblem(data.problems[0]);
            setCode(data.problems[0].initialCode.python);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, [activeTopic]);

  const handleSelectProblem = (prob: CodingProblem) => {
    setSelectedProblem(prob);
    setCode(prob.initialCode[language] || prob.initialCode.python);
    setResult(null);
  };

  const handleLanguageChange = (lang: 'python' | 'javascript' | 'cpp') => {
    setLanguage(lang);
    if (selectedProblem) {
      setCode(selectedProblem.initialCode[lang] || selectedProblem.initialCode.python);
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch('/api/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          language,
          code,
          studentId
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const topics = ['All', 'Arrays', 'Strings', 'Dynamic Programming', 'Trees'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
        </div>

        {/* 1. HEADER & TOPIC READINESS RADAR (Section 12) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Algorithmic Sandbox</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                AI Coding Problem Solving Arena
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Sharpen algorithmic problem-solving for enterprise technical interview rounds with automated test case validation.
              </p>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    activeTopic === t ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Readiness Breakdown (Section 12) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Arrays</span>
              <span className="text-lg font-black text-slate-900 block">82%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Strong</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Strings</span>
              <span className="text-lg font-black text-slate-900 block">76%</span>
              <span className="text-[10px] text-emerald-600 font-bold">Strong</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Lists</span>
              <span className="text-lg font-black text-slate-900 block">54%</span>
              <span className="text-[10px] text-amber-600 font-bold">Needs Practice</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Trees & BST</span>
              <span className="text-lg font-black text-slate-900 block">42%</span>
              <span className="text-[10px] text-rose-600 font-bold">Weak Area</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Dynamic Prog</span>
              <span className="text-lg font-black text-slate-900 block">68%</span>
              <span className="text-[10px] text-indigo-600 font-bold">Moderate</span>
            </div>
          </div>
        </div>

        {/* 2. GRID: PROBLEM SELECTOR & INTERACTIVE CODE RUNNER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Problem List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Problem Directory</h2>
            {problems.map((prob) => {
              const isSelected = selectedProblem?.id === prob.id;

              return (
                <button
                  key={prob.id}
                  onClick={() => handleSelectProblem(prob)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-primary-500 shadow-md ring-2 ring-primary-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{prob.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      prob.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Topic: <strong>{prob.topic}</strong></span>
                    <span className="text-primary-600 font-semibold">{prob.recommendedForSkills.join(', ')}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Code Editor & Test Cases */}
          {selectedProblem && (
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Problem Header */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedProblem.title}</h2>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {selectedProblem.topic}
                    </span>
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['python', 'javascript', 'cpp'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                          language === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Code Editor Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 font-mono">Solution Editor ({language})</span>
                  <span className="text-[11px] text-slate-400">O(n) Optimal Solution Expected</span>
                </div>

                <textarea
                  rows={10}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed shadow-inner"
                />
              </div>

              {/* Test Cases Validator & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sample Test Case:</span>
                  <p className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                    {selectedProblem.testCases[0]?.input} → Expected: <strong>{selectedProblem.testCases[0]?.expectedOutput}</strong>
                  </p>
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{running ? 'Running Tests...' : 'Run & Validate Solution'}</span>
                </button>
              </div>

              {/* Run Results Output */}
              {result && (
                <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
                  result.passed ? 'bg-emerald-50/80 border-emerald-300' : 'bg-rose-50/80 border-rose-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-slate-900">
                      {result.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                      <span>{result.passed ? 'All Test Cases Passed! ✓' : 'Test Case Execution Failed'}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Execution Time: {result.attempt.executionTimeMs}ms • Accuracy: {result.attempt.accuracy}%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    {result.testCaseResults?.map((tc: any) => (
                      <div key={tc.testCaseIndex} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                        <span>Case #{tc.testCaseIndex}: {tc.input}</span>
                        <span className={`font-bold ${tc.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tc.passed ? 'PASSED ✓' : 'FAILED'}
                        </span>
                      </div>
                    ))}
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
