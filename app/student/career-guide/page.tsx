'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Search,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Check,
  ListTodo,
  Terminal,
  Zap
} from 'lucide-react';

const SKILL_DETAILS_MAP: Record<string, {
  category: string;
  milestones: string[];
  project: string;
  courseId: string;
  courseTitle: string;
  assessmentId: string;
}> = {
  'python': {
    category: 'Programming & Logic',
    milestones: ['Variables, Control Loops, & Dynamic Typing', 'Writing Modular Functions & Scope', 'Object-Oriented Design (Classes, Inheritance, Polymorphism)', 'Advanced Magic Methods (__init__, __str__, __repr__)'],
    project: 'Build a command-line automated Employee Directory Manager with OOP inheritance.',
    courseId: 'crs_python',
    courseTitle: 'Python Fundamentals & OOP for Placement',
    assessmentId: 'asm_python'
  },
  'cpp': {
    category: 'Systems Programming',
    milestones: ['Pointers, References, & Memory Addresses', 'Dynamic Allocation (new/delete) & Heap Management', 'Resource Acquisition Is Initialization (RAII) & Destructors', 'Standard Template Library (std::vector, std::list, std::map)'],
    project: 'Build a custom double-ended queue (deque) with explicit memory cleanup.',
    courseId: 'crs_cpp',
    courseTitle: 'C++ Systems & Memory Mastery',
    assessmentId: 'asm_cpp'
  },
  'java': {
    category: 'Enterprise Coding',
    milestones: ['JVM execution, Classpath, & Compilation flow', 'Object Lifecycle, Heap vs Stack memory', 'Checked vs Unchecked Exception handling', 'Multi-threading & Synchronized thread-safe locks'],
    project: 'Build a multi-threaded simulated banking transaction manager with locks.',
    courseId: 'crs_java',
    courseTitle: 'Java Enterprise & Core Concepts',
    assessmentId: 'asm_java'
  },
  'dsa': {
    category: 'Algorithms & Structures',
    milestones: ['Big-O Space & Time Complexity analysis', 'LinkedLists, Stack, & Queue structures', 'Graph Traversal algorithms (BFS & DFS)', 'Dynamic Programming & Memoization patterns'],
    project: 'Implement a pathfinding visualizer using Dijkstra\'s shortest-path algorithm.',
    courseId: 'crs_dsa',
    courseTitle: 'Data Structures & Algorithms Masterclass',
    assessmentId: 'asm_dsa'
  },
  'sql': {
    category: 'Database Management',
    milestones: ['Relational Schema Design & Constraints', 'Table Joins (INNER, LEFT, RIGHT, FULL OUTER)', 'Aggregate GROUP BY & HAVING filters', 'Index optimizations (B-Trees) & Normal Forms'],
    project: 'Design a normalized database schema for a campus logistics application.',
    courseId: 'crs_sql',
    courseTitle: 'SQL & Relational Database Architecture',
    assessmentId: 'asm_sql'
  },
  'git': {
    category: 'Version Control',
    milestones: ['Local repository staging & commit snapshots', 'Branching strategy & Checkout workflows', 'Merge vs Rebase history rewriting', 'Resolving merge conflicts & Pull Request reviews'],
    project: 'Publish a multi-branch open source library with pull request validation on GitHub.',
    courseId: 'crs_git',
    courseTitle: 'Git & GitHub Collaboration Essentials',
    assessmentId: 'asm_git'
  },
  'aws': {
    category: 'Cloud Infrastructure',
    milestones: ['Virtual Private Cloud (VPC) network planning', 'Provisioning EC2 computing instances', 'Secure object-based storage (Amazon S3)', 'Identity Access Management (IAM) permissions'],
    project: 'Deploy a high-availability server behind a load balancer inside a custom VPC.',
    courseId: 'crs_cloud',
    courseTitle: 'Cloud Fundamentals (AWS & Cloud Architecture)',
    assessmentId: 'asm_aws'
  },
  'pandas & numpy': {
    category: 'Data Science Foundations',
    milestones: ['NumPy array operations & vectorization', 'Pandas DataFrame loading, filtering & cleaning', 'Merging, grouping, & aggregating datasets', 'Data visualization & outlier detection'],
    project: 'Build a customer churn analytics pipeline from raw CSV data.',
    courseId: 'crs_python',
    courseTitle: 'Python Fundamentals & OOP for Placement',
    assessmentId: 'asm_python'
  },
  'ai/ml': {
    category: 'Machine Learning',
    milestones: ['Supervised learning (Linear/Logistic Regression)', 'Unsupervised clustering (K-Means)', 'Feature engineering & dataset splitting', 'Model validation using Precision/Recall metrics'],
    project: 'Develop a sentiment classifier for customer reviews using regression models.',
    courseId: 'crs_python',
    courseTitle: 'Python Fundamentals & OOP for Placement',
    assessmentId: 'asm_python'
  },
  'aptitude & problem solving': {
    category: 'Quantitative Aptitude',
    milestones: ['Quantitative speed math & shortcuts', 'Logical reasoning & series continuation puzzles', 'Time, Work, Speed & Distance word problems', 'Probability & combinatorics interview questions'],
    project: 'Solve 50 coding/logical placement challenges on the practice workspace.',
    courseId: 'crs_aptitude',
    courseTitle: 'Quantitative & Logical Aptitude for Placement',
    assessmentId: 'asm_python'
  }
};

export default function CareerGuidePage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [searchQuery, setSearchQuery] = useState('Data Analyst');
  const [careerResult, setCareerResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCareerData = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}/recommendations?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.recommendation) {
        setCareerResult(data.recommendation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCareerData(searchQuery.trim());
    }
  };

  const quickRoles = ['Data Analyst', 'Software Developer', 'Cloud DevOps', 'AI Engineer', 'Cybersecurity'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Prompt Input (Section 36) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-primary-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>AI Career Recommendation Navigator</span>
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Tell AI Your Target Role. Get the Complete Roadmap.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Input any technical position to receive instant skill requirements, a structured progression roadmap with milestones, and matching open jobs.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='e.g. "I want to become a Data Analyst"'
                className="w-full pl-10 pr-4 py-3 text-sm bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 font-bold text-xs text-white shadow-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Generate AI Roadmap</span>
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/10">
            <span className="text-xs text-slate-400">Popular Paths:</span>
            {quickRoles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSearchQuery(role);
                  fetchCareerData(role);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  searchQuery.toLowerCase() === role.toLowerCase()
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Output */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Synthesizing personalized career recommendation...</p>
          </div>
        ) : careerResult ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Required Skills Matrix (Section 36) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Essential Industry Skills for {careerResult.career?.title || searchQuery}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required skills and proficiency levels demanded by companies hiring for this position.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {careerResult.requiredSkills?.map((req: any) => (
                  <div key={req.skill} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="font-extrabold text-sm text-slate-900 block">{req.skill}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                      {req.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Structured Role Progression Roadmap (Step-by-step) */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-500" />
                  <span>Step-by-Step Learning & Verification Roadmap</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Progress sequentially through these tech-stack milestones to build and verify your skill passport.
                </p>
              </div>

              {/* Step list generation */}
              {careerResult.requiredSkills?.map((req: any, index: number) => {
                const skillLower = req.skill.toLowerCase();
                const skillDetails = SKILL_DETAILS_MAP[skillLower] || {
                  category: 'Technical Capability',
                  milestones: [`Master fundamentals of ${req.skill}`, `Understand best practices & architecture of ${req.skill}`],
                  project: `Build a functional prototype implementing ${req.skill} features.`,
                  courseId: '',
                  courseTitle: `${req.skill} Fundamentals`,
                  assessmentId: ''
                };

                const courseUrl = skillDetails.courseId ? `/courses/${skillDetails.courseId}` : '/courses';
                const assessmentUrl = skillDetails.assessmentId ? `/assessments/${skillDetails.assessmentId}` : '/courses';

                return (
                  <div
                    key={req.skill}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{skillDetails.category}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Target Level: {req.level}
                            </span>
                          </div>
                          <h2 className="text-lg font-black text-slate-900">Master {req.skill}</h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Link
                          href={courseUrl}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Study Materials</span>
                        </Link>

                        <Link
                          href={assessmentUrl}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5 text-white" />
                          <span>Verify Skill Badge</span>
                        </Link>
                      </div>
                    </div>

                    {/* Milestones and Project details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                      {/* Topics */}
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                          <ListTodo className="w-4 h-4 text-primary-600" />
                          <span>Learning Milestones</span>
                        </h3>
                        <ul className="space-y-2">
                          {skillDetails.milestones.map((m: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-medium text-slate-700">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Project */}
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                          <Terminal className="w-4 h-4 text-indigo-600" />
                          <span>Practical Project Milestone</span>
                        </h3>
                        <p className="font-semibold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                          {skillDetails.project}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Capstone Projects Step */}
              {careerResult.career?.recommendedProjects && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                      Proj
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Practical Integration</span>
                      <h2 className="text-lg font-black text-slate-900">Capstone Project Milestones</h2>
                      <p className="text-xs text-slate-500">
                        Build one of these recommended role-specific capstone projects to showcase to recruiters.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {careerResult.career.recommendedProjects.map((p: string, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 font-semibold text-slate-800 text-xs flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Interview Milestone */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Final Milestone</span>
                  <h3 className="text-xl font-black text-white">Simulated Technical & Behavioral Interview Coach</h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Prepare yourself for the corporate recruitment rounds by practicing core logic questions and behavioral scenarios with the AI Interview Coach.
                  </p>
                </div>
                <Link
                  href="/student/interview-coach"
                  className="px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-primary-500/20"
                >
                  <span>Practice Interviews →</span>
                </Link>
              </div>
            </div>

            {/* 3. Matching Open Jobs */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Matching Open Positions ({careerResult.jobs?.length || 0})</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live tech job postings aligned with this career trajectory.
                  </p>
                </div>
                <Link href="/jobs" className="text-xs font-bold text-primary-600 hover:underline">
                  Browse All Jobs →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careerResult.jobs?.map((j: any) => (
                  <div key={j.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase">{j.companyName}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{j.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{j.location} • {j.salary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">{j.workMode}</span>
                      <Link
                        href={`/jobs/${j.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-primary-600 transition-colors"
                      >
                        View & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
