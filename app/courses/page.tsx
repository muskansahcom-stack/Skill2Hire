'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Layers,
  Star
} from 'lucide-react';

export default function CoursesCatalogPage() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        let url = '/api/courses';
        if (selectedCategory !== 'All') url += `?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.courses) {
          let list = data.courses;
          if (searchQuery) {
            list = list.filter((c: any) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.targetSkills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
            );
          }
          setCourses(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [selectedCategory, searchQuery]);

  const categories = ['All', 'Programming', 'Data Structures', 'Databases', 'Tools', 'Cloud', 'Soft Skills'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header (Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Free In-Platform Learning Hub</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Master High-Demand Tech Skills for Free
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Zero external redirects. Learn directly inside Skill2Hire with interactive notes, runnable code examples, practice questions, and skill verification assessments.
            </p>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Python, DSA, SQL, AWS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading structured courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md">
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-white" /> {course.rating}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-primary-600">{course.category}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {course.title}
                      </h2>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Target Skills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {course.targetSkills?.map((s: string) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/courses/${course.id}`}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 group-hover:bg-primary-600 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <span>Start Learning for Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
