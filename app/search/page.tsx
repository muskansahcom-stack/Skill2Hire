'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import {
  Briefcase,
  BookOpen,
  Award,
  Video,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  PlayCircle,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';

function GlobalSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'ALL';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    jobs: [],
    courses: [],
    skills: [],
    videos: [],
    companies: [],
    totalCount: 0
  });

  useEffect(() => {
    async function executeSearch() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&studentId=std_1`);
        const json = await res.json();
        if (json.success) {
          setData(json);
          // If a specific detected type was returned and activeTab is ALL, we stay on ALL but can highlight
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [q]);

  const jobs = data.jobs || [];
  const courses = data.courses || [];
  const skills = data.skills || [];
  const videos = data.videos || [];
  const companies = data.companies || [];
  const totalCount = jobs.length + courses.length + skills.length + videos.length + companies.length;

  const tabs = [
    { id: 'ALL', label: 'All Results', count: totalCount, icon: Layers },
    { id: 'JOBS', label: 'Jobs', count: jobs.length, icon: Briefcase },
    { id: 'COURSES', label: 'Courses', count: courses.length, icon: BookOpen },
    { id: 'SKILLS', label: 'Skills', count: skills.length, icon: Award },
    { id: 'VIDEOS', label: 'Videos', count: videos.length, icon: Video },
    { id: 'COMPANIES', label: 'Companies', count: companies.length, icon: Building2 }
  ];

  const relatedSearches = [
    'Python Developer',
    'Data Scientist',
    'DSA Fundamentals',
    'SQL for Analytics',
    'React Full Stack',
    'Cloud AWS',
    'Software Engineer Internship'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-6">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider border border-primary-500/30 inline-block">
              Skill2Hire Universal Discovery
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {q ? (
                <>Results for <span className="text-cyan-400">"{q}"</span></>
              ) : (
                <>Explore Jobs, Skills & Learning</>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Discover real open positions, required skill paths, interactive courses, and verified hiring pipelines.
            </p>
          </div>

          <GlobalSearchBar initialQuery={q} size="hero" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Scanning jobs, skill ecosystems, and learning records...</p>
          </div>
        )}

        {/* Empty State / No Results */}
        {!loading && totalCount === 0 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">No exact results found for "{q}"</h3>
              <p className="text-xs text-slate-500">
                We couldn't find any direct matches. Try searching for related roles, languages, or skills below:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Try these related searches:</span>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                {relatedSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-bold text-xs border border-slate-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results Sections */}
        {!loading && totalCount > 0 && (
          <div className="space-y-10">

            {/* 1. JOBS SECTION */}
            {(activeTab === 'ALL' || activeTab === 'JOBS') && jobs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Matching Jobs ({jobs.length})
                    </h2>
                  </div>
                  {activeTab === 'ALL' && jobs.length > 4 && (
                    <button
                      onClick={() => setActiveTab('JOBS')}
                      className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      View all {jobs.length} jobs <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {(activeTab === 'ALL' ? jobs.slice(0, 4) : jobs).map((job: any) => {
                    const isEligible = job.isEligible;
                    const matchScore = job.matchScore || 70;
                    const missingCount = job.missingSkills?.length || 0;

                    return (
                      <div
                        key={job.id}
                        className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          {/* Top row: Company, Title, Match badge */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 shrink-0 overflow-hidden">
                                {job.companyLogo ? (
                                  <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{job.companyName?.substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div>
                                <h3 className="font-black text-base text-slate-900 hover:text-primary-600 transition-colors">
                                  <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold">{job.companyName}</p>
                              </div>
                            </div>

                            {/* Match Score Badge */}
                            <div className="text-right shrink-0">
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 text-xs font-black">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>{matchScore}% Match</span>
                              </div>
                              <div className="mt-1">
                                {isEligible ? (
                                  <span className="text-[11px] font-black text-emerald-600 flex items-center justify-end gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Eligible
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-black text-amber-600 flex items-center justify-end gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Missing {missingCount} skills
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Meta: Location, Mode, Type, Salary */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                              {job.employmentType}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-slate-900">{job.salary}</span>
                          </div>

                          {/* Required Skills tags */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Required Skills:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(job.requiredSkills || []).map((req: any) => {
                                const isMissing = job.missingSkills?.includes(req.skillName);
                                return (
                                  <span
                                    key={req.skillName}
                                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                                      isMissing
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}
                                  >
                                    {req.skillName} {isMissing ? '⚠' : '✓'}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-primary-600 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <span>{isEligible ? 'View Job & Apply' : 'See What I Need'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. COURSES SECTION */}
            {(activeTab === 'ALL' || activeTab === 'COURSES') && courses.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Interactive Courses ({courses.length})
                    </h2>
                  </div>
                  {activeTab === 'ALL' && courses.length > 3 && (
                    <button
                      onClick={() => setActiveTab('COURSES')}
                      className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      View all {courses.length} courses <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeTab === 'ALL' ? courses.slice(0, 3) : courses).map((course: any) => (
                    <div
                      key={course.id}
                      className="rounded-3xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Course Thumbnail */}
                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider">
                            {course.level}
                          </div>
                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                            ⭐ {course.rating} ({course.enrolledCount}+)
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          <h3 className="font-black text-base text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            <Link href={`/courses/${course.id}`}>{course.title}</Link>
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(course.targetSkills || []).map((sk: string) => (
                              <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div className="p-5 pt-0">
                        <Link
                          href={`/courses/${course.id}/learn`}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Start Learning</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SKILLS SECTION */}
            {(activeTab === 'ALL' || activeTab === 'SKILLS') && skills.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Skill Ecosystems ({skills.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(activeTab === 'ALL' ? skills.slice(0, 4) : skills).map((skill: any) => (
                    <Link
                      key={skill.id}
                      href={`/learn/${encodeURIComponent(skill.name)}`}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all space-y-3 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-base group-hover:scale-110 transition-transform">
                        ⚡
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{skill.description}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-400">Demand: {skill.industryDemandPercent}%</span>
                        <span className="font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Explore <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. VIDEOS SECTION */}
            {(activeTab === 'ALL' || activeTab === 'VIDEOS') && videos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Video Lessons ({videos.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeTab === 'ALL' ? videos.slice(0, 3) : videos).map((video: any) => (
                    <Link
                      key={video.id}
                      href={`/courses/${video.courseId}/learn`}
                      className="rounded-3xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                    >
                      <div className="relative h-40 bg-slate-900">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-7 h-7 text-primary-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-mono text-[10px] font-bold">
                          {video.duration}
                        </div>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="font-black text-sm text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-500">{video.courseTitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COMPANIES SECTION */}
            {(activeTab === 'ALL' || activeTab === 'COMPANIES') && companies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Companies Hiring ({companies.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(activeTab === 'ALL' ? companies.slice(0, 3) : companies).map((comp: any) => (
                    <div
                      key={comp.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold overflow-hidden border border-amber-100">
                          {comp.logo ? (
                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{comp.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-slate-900">{comp.name}</h3>
                          <p className="text-xs text-slate-500">{comp.industry}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">{comp.location}</span>
                        <Link
                          href={`/jobs?companyId=${comp.id}`}
                          className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          View Jobs <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Scanning jobs, skills & learning catalogue...</p>
        </div>
      </div>
    }>
      <GlobalSearchContent />
    </Suspense>
  );
}

