'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ChevronDown,
  Building2,
  ShieldCheck,
  Compass,
  Bell,
  Code2,
  Sparkles,
  Zap,
  FileText,
  Flame,
  CheckCircle2,
  FolderGit2,
  Cpu,
  Menu,
  X,
  BookOpen
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, switchPersona } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotifs = notifications.filter(n => !n.read);

  const navLinks = {
    student: [
      { href: '/student/dashboard', label: 'Dashboard', icon: Layers },
      { href: '/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/student/become-ready', label: 'Become Ready', icon: Zap },
      { href: '/student/academic-report', label: 'Academic Report', icon: GraduationCap },
      { href: '/courses', label: 'Learn', icon: BookOpen },
      { href: '/student/coding-practice', label: 'Coding Arena', icon: Code2 },
      { href: '/student/interview-coach', label: 'AI Interview', icon: Sparkles },
      { href: '/student/skills', label: 'Skill Passport', icon: Award },
      { href: '/student/resume-matcher', label: 'Resume Match', icon: FileText },
      { href: '/student/career-guide', label: 'Career Guide', icon: Compass },
      { href: '/student/projects', label: 'Projects', icon: FolderGit2 },
      { href: '/student/applications', label: 'Applications', icon: CheckCircle2 }
    ],
    college: [
      { href: '/college/dashboard', label: 'Dashboard', icon: Layers },
      { href: '/college/skill-heatmap', label: 'Skill Heatmap', icon: Flame },
      { href: '/college/curriculum-gap', label: 'Curriculum Gap', icon: Sparkles },
      { href: '/college/training', label: 'Bootcamps', icon: GraduationCap },
      { href: '/college/placement-readiness', label: 'Batch Readiness', icon: Award },
      { href: '/college/demand-signals', label: 'Demand Signals', icon: Zap },
      { href: '/college/students', label: 'Student Roster', icon: GraduationCap },
      { href: '/college/industry-demand', label: 'Demand Radar', icon: Compass }
    ],
    company: [
      { href: '/recruiter/dashboard', label: 'Dashboard', icon: Layers },
      { href: '/recruiter/jobs/new', label: 'Post Job (AI)', icon: Sparkles },
      { href: '/recruiter/skill-search', label: 'Skill-First Search', icon: Cpu },
      { href: '/recruiter/campus-pipeline', label: 'Campus Pipeline', icon: Zap },
      { href: '/recruiter/candidates', label: 'Candidates', icon: GraduationCap },
      { href: '/recruiter/applications', label: 'Applications', icon: Briefcase }
    ],
    admin: [
      { href: '/admin/dashboard', label: 'Overview', icon: Layers },
      { href: '/college/skill-heatmap', label: 'Global Heatmap', icon: Flame },
      { href: '/college/industry-demand', label: 'Demand Radar', icon: Compass },
      { href: '/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/courses', label: 'Courses', icon: GraduationCap }
    ]
  };

  const currentRole = user?.role || 'student';
  const links = navLinks[currentRole] || navLinks.student;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                  Skill2<span className="text-primary-600">Hire</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
                  Learn. Verify. Get Hired.
                </span>
              </div>
            </Link>

            {/* Platform Differentiation link */}
            <Link
              href="/differentiation"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
            >
              <Sparkles className="w-3 h-3 text-primary-600" />
              <span>How It's Different</span>
            </Link>
          </div>

          {/* DESKTOP ROLE NAV LINKS */}
          <nav className="hidden xl:flex items-center space-x-1">
            {links.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT TOOLS: NOTIFICATIONS & DEMO PERSONA SWITCHER */}
          <div className="flex items-center space-x-3">
            
            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                    <span className="text-[11px] font-semibold text-primary-600">{unreadNotifs.length} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 p-4 text-center">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-xs space-y-1 ${
                            !n.read ? 'bg-primary-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DEMO PERSONA SWITCHER */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white ${
                  currentRole === 'student' ? 'bg-primary-600' :
                  currentRole === 'college' ? 'bg-indigo-600' :
                  currentRole === 'company' ? 'bg-emerald-600' : 'bg-slate-900'
                }`}>
                  {currentRole === 'student' ? '👩🎓' :
                   currentRole === 'college' ? '🎓' :
                   currentRole === 'company' ? '🏢' : '👑'}
                </div>
                <div className="hidden sm:block leading-none">
                  <span className="block text-xs font-bold text-slate-800 truncate max-w-[110px]">
                    {profile?.name || user?.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold capitalize">
                    {currentRole} Role
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      1-Click Demo Persona Switcher
                    </span>
                    <span className="text-xs text-slate-500">Instantly experience other roles:</span>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => { switchPersona('student'); setDropdownOpen(false); }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        currentRole === 'student' ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">👩🎓</span>
                      <div>
                        <span className="block">Student (Alex Rivera)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Apex Univ • 62% Initial Match</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { switchPersona('college'); setDropdownOpen(false); }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        currentRole === 'college' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">🎓</span>
                      <div>
                        <span className="block">College (Apex Univ)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Placement Cell & Curriculum</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { switchPersona('company'); setDropdownOpen(false); }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        currentRole === 'company' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">🏢</span>
                      <div>
                        <span className="block">Company (TechNova)</span>
                        <span className="text-[10px] text-slate-400 font-normal">Recruiter & AI Job Extractor</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { switchPersona('admin'); setDropdownOpen(false); }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                        currentRole === 'admin' ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">👑</span>
                      <div>
                        <span className="block">Platform Admin</span>
                        <span className="text-[10px] text-slate-400 font-normal">System-Wide Telemetry</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/differentiation"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary-700 bg-primary-50"
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>How Skill2Hire is Different →</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
