'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  PlayCircle,
  Code2,
  ChevronRight,
  Zap,
  ArrowRight,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function LearnHubPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skills, setSkills] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLearnData() {
      try {
        const [skRes, crRes] = await Promise.all([
          fetch('/api/search?q=&studentId=std_1'),
          fetch('/api/courses')
        ]);
        const skData = await skRes.json();
        const crData = await crRes.json();

        if (skData.skills) setSkills(skData.skills);
        if (crData.courses) setCourses(crData.courses);
      } catch (err) {
        console.error('Error loading learn data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLearnData();
  }, []);

  const categories = ['All', 'Programming', 'Data Structures', 'Databases', 'Web Development', 'AI/ML', 'Cloud', 'Soft Skills'];

  const filteredSkills = skills.filter(s => {
    const matchesSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularSkills = [
    'Python',
    'DSA',
    'SQL',
    'React',
    'Java',
    'C++',
    'AWS',
    'AI/ML',
    'Node.js',
    'Aptitude & Problem Solving'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 inline-block">
              Skill2Hire Skill & Video Academy
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Master In-Demand Placement Skills
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Interactive video lessons, code execution sandboxes, cheatsheets, and verified skill certifications designed to bridge campus-to-corporate gaps.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-3xl">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
              <Search className="w-5 h-5 text-emerald-600 ml-3 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search any skill (e.g. Python, DSA, SQL, React, AWS, Machine Learning)..."
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium px-3 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="px-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Skill Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Popular Skills:</span>
            {popularSkills.map((sk) => (
              <button
                key={sk}
                onClick={() => router.push(`/learn/${encodeURIComponent(sk)}`)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-emerald-500 transition-all"
              >
                {sk}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              Technical Skill Ecosystems ({filteredSkills.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((sk) => (
              <div
                key={sk.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase">
                      Demand: {sk.industryDemandPercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                      <Link href={`/learn/${encodeURIComponent(sk.name)}`}>{sk.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {sk.description}
                    </p>
                  </div>

                  {/* Level Badges */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">Beginner</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">Intermediate</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">Advanced</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/learn/${encodeURIComponent(sk.name)}`}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 group-hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Explore {sk.name} Ecosystem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
