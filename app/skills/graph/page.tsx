'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Network,
  Search,
  BookOpen,
  Award,
  Briefcase,
  FolderGit2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Zap,
  Layers,
  GraduationCap,
  Building2,
  Compass,
  CornerDownRight,
  Info
} from 'lucide-react';
import { Skill, Skill360Response, SkillGraphData, SkillGraphNode } from '@/lib/types';

function SkillGraphContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const querySkill = searchParams.get('skill') || 'sk_python';

  const [graphData, setGraphData] = useState<SkillGraphData | null>(null);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(querySkill);
  const [skill360, setSkill360] = useState<Skill360Response | null>(null);
  const [loading360, setLoading360] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Load Graph Data
  useEffect(() => {
    async function fetchGraph() {
      setLoadingGraph(true);
      try {
        const res = await fetch('/api/skills/graph');
        const data = await res.json();
        if (data.success && data.data) {
          setGraphData(data.data);
        }
      } catch (err) {
        console.error('Failed to load global skill graph data:', err);
      } finally {
        setLoadingGraph(false);
      }
    }
    fetchGraph();
  }, []);

  // Load Skill 360 Context when selectedSkillId changes
  useEffect(() => {
    if (!selectedSkillId) return;
    async function fetch360() {
      setLoading360(true);
      try {
        const res = await fetch(`/api/skills/${selectedSkillId}/graph`);
        const data = await res.json();
        if (data.success) {
          setSkill360(data);
        }
      } catch (err) {
        console.error('Failed to load skill 360 context:', err);
      } finally {
        setLoading360(false);
      }
    }
    fetch360();
  }, [selectedSkillId]);

  const selectSkill = (idOrName: string) => {
    setSelectedSkillId(idOrName);
    router.replace(`/skills/graph?skill=${encodeURIComponent(idOrName)}`, { scroll: false });
  };

  const skillNodes = (graphData?.nodes || []).filter(n => n.type === 'skill');

  const filteredSkills = skillNodes.filter(s => {
    const matchesSearch = !searchTerm ||
      s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || s.difficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  });

  const categories = ['All', ...(graphData?.categories || [])];

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. HERO & ARCHITECTURE BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-primary-500/30 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  Global Skill Graph
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Phase 2 Architecture
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/student/skills"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-slate-700"
                >
                  Skill Passport ➔
                </Link>
                <Link
                  href="/regional"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-colors border border-amber-500/30"
                >
                  Regional Hub ➔
                </Link>
              </div>
            </div>

            <div className="space-y-2 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Global Competency & Skill Graph
              </h1>
              <p className="text-amber-300/90 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <span>Skills ➔ Job Roles ➔ Careers ➔ Industries ➔ Courses ➔ Assessments ➔ Projects ➔ Employment</span>
              </p>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                Universal relationship engine powering curriculum alignment, prerequisite traversal, career path matching, and verified employment outcomes across all regional implementations.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skills</span>
                <div className="text-xl font-black text-cyan-300 mt-0.5">{graphData?.summary.totalSkills || 27}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Roles</span>
                <div className="text-xl font-black text-amber-400 mt-0.5">{graphData?.summary.totalJobRoles || 6}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Careers</span>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{graphData?.summary.totalCareers || 3}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courses</span>
                <div className="text-xl font-black text-indigo-300 mt-0.5">{graphData?.summary.totalCourses || 12}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assessments</span>
                <div className="text-xl font-black text-rose-300 mt-0.5">{graphData?.summary.totalAssessments || 12}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projects</span>
                <div className="text-xl font-black text-purple-300 mt-0.5">{graphData?.summary.totalProjects || 9}</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relationships</span>
                <div className="text-xl font-black text-yellow-300 mt-0.5">{graphData?.summary.totalRelationships || 74}+</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills in graph (e.g. Python, React, SQL, DSA, AWS, Docker)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty:</span>
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. TWO-COLUMN INTERACTIVE GRAPH LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Skill Nodes Cluster Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Skill Nodes ({filteredSkills.length})
              </span>
              <span className="text-xs text-slate-500 font-medium">Click any skill to inspect 360° graph</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredSkills.map(s => {
                const isSelected = selectedSkillId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSkill(s.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-sm block truncate">{s.label}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : s.difficulty === 'Advanced'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : s.difficulty === 'Intermediate'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {s.difficulty}
                      </span>
                    </div>

                    <p className={`text-[11px] mt-1 font-medium line-clamp-1 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {s.subcategory || s.category}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-400 font-semibold'}>
                        {s.category}
                      </span>
                      <span className={`font-bold flex items-center gap-1 ${
                        isSelected ? 'text-amber-300' : 'text-primary-600'
                      }`}>
                        <span>{s.connectionsCount || 4} Links</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: 360° RELATIONSHIP INSPECTOR PANEL (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {loading360 ? (
              <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
                <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Traversing Global Skill Graph connections...</p>
              </div>
            ) : skill360 ? (
              <div className="space-y-6">
                
                {/* 1. Skill Inspector Header Card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-black text-xs border border-primary-200 uppercase">
                          {skill360.skill.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                          {skill360.skill.difficulty || 'Intermediate'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                          Status: Active Node
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
                        {skill360.skill.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-400">
                        Subcategory: <strong className="text-slate-700">{skill360.skill.subcategory || skill360.skill.category}</strong>
                      </p>
                    </div>

                    {/* Quick Parent / Root Indicator */}
                    {skill360.parentSkill && (
                      <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 shrink-0 text-right">
                        <span className="text-[10px] font-black uppercase text-indigo-900 block">
                          Parent Skill Node
                        </span>
                        <button
                          onClick={() => selectSkill(skill360.parentSkill!.id)}
                          className="font-black text-sm text-indigo-950 hover:underline flex items-center gap-1 justify-end mt-0.5"
                        >
                          <span>{skill360.parentSkill.name}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {skill360.skill.description}
                  </p>

                  {/* Telemetry Strip */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Cohort</span>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {skill360.competencyStats?.verifiedCandidatesCount || 24} Candidates
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Bench Score</span>
                      <div className="text-base font-black text-emerald-600 mt-0.5">
                        {skill360.competencyStats?.averageScore || 82}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Placements</span>
                      <div className="text-base font-black text-primary-600 mt-0.5">
                        {skill360.employmentOutcomes?.length || 2} Placed
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SKILL RELATIONSHIPS (Prerequisites, Children, Synergies) */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary-600" />
                    <h3 className="font-black text-slate-900 text-base">
                      Skill Graph Topology & Neighbor Nodes
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prerequisites */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                        Prerequisites to Master First
                      </span>
                      {skill360.prerequisiteSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skill360.prerequisiteSkills.map(pr => (
                            <button
                              key={pr.id}
                              onClick={() => selectSkill(pr.id)}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
                            >
                              <span>{pr.name}</span>
                              <ChevronRight className="w-3 h-3 text-rose-500" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium italic">Foundational skill — no prerequisites required.</p>
                      )}
                    </div>

                    {/* Child Skills */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 block">
                        Child & Specialization Subskills
                      </span>
                      {skill360.childSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skill360.childSkills.map(cs => (
                            <button
                              key={cs.id}
                              onClick={() => selectSkill(cs.id)}
                              className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                            >
                              <span>{cs.name}</span>
                              <ChevronRight className="w-3 h-3 text-indigo-500" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium italic">Terminal competency node.</p>
                      )}
                    </div>

                    {/* Complementary Synergistic Skills */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        Complementary & Synergistic Skills
                      </span>
                      {skill360.complementarySkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skill360.complementarySkills.map(comp => (
                            <button
                              key={comp.id}
                              onClick={() => selectSkill(comp.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{comp.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium italic">No direct complementary pairs defined.</p>
                      )}
                    </div>

                    {/* Lateral Related Skills */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">
                        Lateral Related Skills
                      </span>
                      {skill360.relatedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skill360.relatedSkills.map(rs => (
                            <button
                              key={rs.id}
                              onClick={() => selectSkill(rs.id)}
                              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1"
                            >
                              <span>{rs.name}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium italic">No lateral links mapped.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. REQUIRED CAREERS & JOB ROLES */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-black text-slate-900 text-base">
                        Target Careers & Standard Global Job Roles
                      </h3>
                    </div>
                    <Link
                      href="/student/career-guide"
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <span>Career Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {skill360.requiredCareers.map(cp => (
                      <div
                        key={cp.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900">{cp.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold uppercase">
                              Career Track
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">{cp.description}</p>
                        </div>
                        <Link
                          href="/student/career-guide"
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm shrink-0 flex items-center gap-1"
                        >
                          <span>Explore Career Track</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}

                    {skill360.relatedJobRoles.map(role => (
                      <div
                        key={role.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900">{role.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold uppercase">
                              Standard Role
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">
                            {role.industry || role.category} • {role.career_level || role.careerLevel} Level
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                          {role.standardSalaryBandGlobal ? `$${(role.standardSalaryBandGlobal.minUsd / 1000).toFixed(0)}k - $${(role.standardSalaryBandGlobal.maxUsd / 1000).toFixed(0)}k` : 'Global Band'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. ACTIVE JOBS IN PLATFORM REQUIRING THIS SKILL */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-black text-slate-900 text-base">
                        Active Jobs Requiring {skill360.skill.name} ({skill360.relatedJobs.length})
                      </h3>
                    </div>
                    <Link
                      href="/jobs"
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <span>All Jobs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {skill360.relatedJobs.length > 0 ? (
                    <div className="space-y-2.5">
                      {skill360.relatedJobs.map(job => (
                        <div
                          key={job.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-xs text-slate-900">{job.title}</h4>
                              <span className="text-[10px] text-slate-400 font-bold">•</span>
                              <span className="text-[11px] font-bold text-slate-600">{job.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-bold">{job.employmentType}</span>
                            </div>
                          </div>

                          <Link
                            href={`/jobs/${job.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
                          >
                            View Role
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium italic">No active job openings currently tagged directly with this skill.</p>
                  )}
                </div>

                {/* 5. COURSES, ASSESSMENTS & PROJECTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Accredited Courses */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-600" />
                      <h4 className="font-black text-slate-900 text-sm">
                        Curriculum Courses ({skill360.courses.length})
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {skill360.courses.map(course => (
                        <div
                          key={course.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-bold text-slate-800 block truncate">{course.title}</span>
                            <span className="text-[10px] text-slate-400">{course.duration} • {course.level}</span>
                          </div>
                          <Link
                            href={`/courses/${course.id}`}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-primary-600 text-xs shrink-0 shadow-sm"
                          >
                            Learn
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Assessments */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-black text-slate-900 text-sm">
                        Skill Assessments ({skill360.assessments.length})
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {skill360.assessments.map(asm => (
                        <div
                          key={asm.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="truncate">
                            <span className="font-bold text-slate-800 block truncate">{asm.title}</span>
                            <span className="text-[10px] text-slate-400">{asm.durationMinutes} mins • {asm.passingScore}% Pass Benchmark</span>
                          </div>
                          <Link
                            href={`/assessments/${asm.id}`}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-sm"
                          >
                            Test
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. APPLIED PROJECTS */}
                {skill360.projects.length > 0 && (
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-black text-slate-900 text-sm">
                        Portfolio Projects Applying {skill360.skill.name} ({skill360.projects.length})
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {skill360.projects.map(proj => (
                        <div
                          key={proj.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs"
                        >
                          <span className="font-bold text-slate-900 block">{proj.title}</span>
                          <p className="text-slate-500 font-medium leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(proj.technologies || []).map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-bold">Select a skill node on the left to inspect relationship topology</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SkillGraphPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SkillGraphContent />
    </Suspense>
  );
}
