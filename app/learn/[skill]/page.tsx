'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Video,
  FileText,
  Code2,
  Briefcase,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Download,
  ShieldCheck,
  TrendingUp,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function SkillEcosystemPage() {
  const params = useParams();
  const router = useRouter();
  const skillName = decodeURIComponent(params?.skill as string);

  const [ecosystem, setEcosystem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'videos' | 'notes' | 'practice' | 'jobs'>('courses');

  useEffect(() => {
    async function loadEcosystem() {
      setLoading(true);
      try {
        const res = await fetch(`/api/learn/${encodeURIComponent(skillName)}`);
        const data = await res.json();
        if (data.ecosystem) {
          setEcosystem(data.ecosystem);
        }
      } catch (err) {
        console.error('Error fetching skill ecosystem:', err);
      } finally {
        setLoading(false);
      }
    }

    if (skillName) loadEcosystem();
  }, [skillName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading {skillName} complete learning & verification ecosystem...</p>
        </div>
      </div>
    );
  }

  if (!ecosystem) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Skill not found</h2>
        <Link href="/learn" className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-block">
          Return to Learn Hub
        </Link>
      </div>
    );
  }

  const skill = ecosystem.skill;
  const levels = ecosystem.levels || { beginner: [], intermediate: [], advanced: [] };
  const videos = ecosystem.videos || [];
  const notes = ecosystem.notes || [];
  const practiceProblems = ecosystem.practiceProblems || [];
  const assessments = ecosystem.assessments || [];
  const unlockedJobs = ecosystem.unlockedJobs || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/student/dashboard" className="hover:text-primary-600">Student</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-primary-600">Learn</Link>
          <span>/</span>
          <span className="text-slate-900">{skill.name}</span>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. SKILL HERO BANNER                                                    */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                {skill.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
                Industry Demand: {skill.industryDemandPercent}%
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {skill.name} Learning & Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Verification Assessment CTA */}
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 text-center sm:text-right shrink-0 space-y-3">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase text-slate-400">Skill Passport</div>
              <div className="text-base font-black text-cyan-300">Ready to Get Verified?</div>
            </div>
            {assessments.length > 0 ? (
              <Link
                href={`/assessments/${assessments[0].id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Take {skill.name} Assessment</span>
              </Link>
            ) : (
              <Link
                href="/student/coding-practice"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Practice Challenges</span>
              </Link>
            )}
          </div>
        </div>

        {/* Ecosystem Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'courses', label: 'Courses & Levels', count: levels.beginner.length + levels.intermediate.length + levels.advanced.length, icon: BookOpen },
            { id: 'videos', label: 'Videos', count: videos.length, icon: Video },
            { id: 'notes', label: 'Notes & Cheatsheets', count: notes.length, icon: FileText },
            { id: 'practice', label: 'Practice Problems', count: practiceProblems.length, icon: Code2 },
            { id: 'jobs', label: 'Unlocked Jobs', count: unlockedJobs.length, icon: Briefcase }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 📚 2. TAB: COURSES & THREE-LEVEL SYSTEM (Beginner, Intermediate, Adv)       */}
        {/* ========================================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            
            {/* Level 1: Beginner */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                  Level 1: Beginner
                </span>
                <span className="text-xs text-slate-500 font-semibold">Foundations, syntax, primitive memory & control flow</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(levels.beginner.length > 0 ? levels.beginner : [levels.intermediate[0]]).filter(Boolean).map((course: any) => (
                  <div key={course.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="relative h-44 bg-slate-900">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black uppercase">
                          Beginner
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-black text-base text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                          <Link href={`/courses/${course.id}`}>{course.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <Link
                        href={`/courses/${course.id}/learn`}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Beginner Track</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 2: Intermediate */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase">
                  Level 2: Intermediate
                </span>
                <span className="text-xs text-slate-500 font-semibold">OOP, algorithmic patterns, collections & data structures</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(levels.intermediate.length > 0 ? levels.intermediate : levels.beginner).map((course: any) => (
                  <div key={course.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="relative h-44 bg-slate-900">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black uppercase">
                          Intermediate
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-black text-base text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                          <Link href={`/courses/${course.id}`}>{course.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <Link
                        href={`/courses/${course.id}/learn`}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Intermediate Track</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 3: Advanced */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase">
                  Level 3: Advanced
                </span>
                <span className="text-xs text-slate-500 font-semibold">Placement interview rounds, system design & high-performance code</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                      Placement Special
                    </span>
                    <h3 className="font-black text-base text-slate-900">
                      {skill.name} Interview Mastery & Problem Defense
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Advanced problem solving, edge case handling, and live code walkthroughs for top campus hiring rounds.
                    </p>
                  </div>
                  <Link
                    href="/courses/crs_interview/learn"
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Start Advanced Track</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 🎬 3. TAB: VIDEOS                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Video Masterclasses ({videos.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid: any) => (
                <div key={vid.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm group">
                  <div className="relative h-44 bg-slate-900">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-7 h-7 text-primary-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-mono text-[10px] font-bold">
                      {vid.duration}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 line-clamp-1">{vid.title}</h4>
                      <p className="text-xs text-slate-500">{vid.courseTitle}</p>
                    </div>
                    <Link
                      href={`/courses/crs_python/learn`}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Watch & Learn</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📝 4. TAB: NOTES & CHEATSHEETS                                            */}
        {/* ========================================================================= */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Notes & Placement Cheatsheets ({notes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note: any) => (
                <div key={note.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-base text-slate-900">{note.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{note.preview}</p>
                  </div>
                  <button
                    onClick={() => alert(`Downloading official study note: ${note.title}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Notes</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 💻 5. TAB: PRACTICE PROBLEMS                                              */}
        {/* ========================================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Live Coding Sandbox Challenges ({practiceProblems.length})</h2>
            <div className="space-y-3">
              {practiceProblems.map((prob: any) => (
                <div key={prob.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900">{prob.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                  </div>
                  <Link
                    href={`/student/coding-practice`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Solve in Compiler</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 💼 6. TAB: UNLOCKED JOBS (Course -> Job Connection Section 16)             */}
        {/* ========================================================================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 space-y-1">
              <h2 className="text-lg font-black text-slate-900">Jobs Requiring {skill.name}</h2>
              <p className="text-xs text-slate-600">
                Mastering and verifying this skill may improve your match score for the following open positions:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedJobs.map((job: any) => (
                <div key={job.id} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-primary-300 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">{job.companyName}</span>
                      <span className="font-bold text-xs text-slate-900">{job.salary}</span>
                    </div>
                    <h3 className="font-black text-base text-slate-900">
                      <Link href={`/jobs/${job.id}`} className="hover:text-primary-600">{job.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{job.location} ({job.workMode})</span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Check Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
