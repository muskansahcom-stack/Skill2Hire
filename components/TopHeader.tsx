'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, DEMO_PERSONAS } from '@/context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Building2,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Globe,
  MapPin,
  Check
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import SecuritySettingsModal from '@/components/SecuritySettingsModal';
import { useRegion } from '@/context/RegionContext';

interface TopHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isWorkflowOpen: boolean;
  setIsWorkflowOpen: (open: boolean) => void;
}

export default function TopHeader({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  isWorkflowOpen,
  setIsWorkflowOpen
}: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, switchPersona } = useAuth();
  const currentRole: UserRole = role || 'student';

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Notifications State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Persona & Security Menu State
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Region State
  const {
    selectedRegion,
    setRegion,
    regions,
    selectedLanguage,
    setLanguage,
    isBiharActive
  } = useRegion();
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setIsRegionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Search indexing across roles
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const searchableItems = [
      // Jobs
      { title: 'Software Developer (Python/DSA)', category: 'Jobs', link: '/jobs/job_1', role: 'all' },
      { title: 'Full Stack Engineer (React/Node)', category: 'Jobs', link: '/jobs', role: 'all' },
      { title: 'Data Scientist (Machine Learning)', category: 'Jobs', link: '/jobs', role: 'all' },
      
      // Courses
      { title: 'Python Fundamentals & OOP', category: 'Courses', link: '/courses', role: 'all' },
      { title: 'Data Structures & Algorithms', category: 'Courses', link: '/courses', role: 'all' },
      { title: 'SQL & Database Design', category: 'Courses', link: '/courses', role: 'all' },

      // Student Modules
      { title: 'Official Student Academic Report', category: 'Student', link: '/student/academic-report', role: 'student' },
      { title: 'AI Coding Practice Arena', category: 'Student', link: '/student/coding-practice', role: 'student' },
      { title: 'AI Interview Coach', category: 'Student', link: '/student/interview-coach', role: 'student' },
      { title: 'Skill Passport & Verification', category: 'Student', link: '/student/skills', role: 'student' },
      { title: 'Become Job Ready Pathway', category: 'Student', link: '/student/become-ready', role: 'student' },

      // College Modules
      { title: 'College Student Roster & Transcripts', category: 'College', link: '/college/students', role: 'college' },
      { title: 'Skill Gap Heatmap', category: 'College', link: '/college/skill-heatmap', role: 'college' },
      { title: 'Curriculum Gap Analysis', category: 'College', link: '/college/curriculum-gap', role: 'college' },
      { title: 'Batch Placement Readiness', category: 'College', link: '/college/placement-readiness', role: 'college' },

      // Recruiter Modules
      { title: 'Post New Job with AI Extraction', category: 'Recruiter', link: '/recruiter/jobs/new', role: 'company' },
      { title: 'Skill-First Candidate Search', category: 'Recruiter', link: '/recruiter/skill-search', role: 'company' },
      { title: 'Campus Talent Funnel', category: 'Recruiter', link: '/recruiter/campus-pipeline', role: 'company' },
      { title: 'Candidate Applications', category: 'Recruiter', link: '/recruiter/applications', role: 'company' },

      // Regional Intelligence & Global Framework
      { title: 'Regional Skills Intelligence Portal', category: 'Regional', link: '/regional', role: 'all' },
      { title: 'Bihar District Skill Gap Analytics', category: 'Regional', link: '/regional?tab=districts', role: 'all' },
      { title: 'Career & Wage Migration Corridors', category: 'Regional', link: '/regional?tab=migration', role: 'all' },
      { title: 'Government Schemes (BSDM, KYP, Udyami)', category: 'Regional', link: '/regional?tab=schemes', role: 'all' },
      { title: 'Global Skill Graph (360° Relationships)', category: 'Skills', link: '/skills/graph', role: 'all' },
      { title: 'Python Skill Graph Ecosystem', category: 'Skills', link: '/skills/graph?skill=sk_python', role: 'all' },
    ];

    const filtered = searchableItems.filter(item =>
      item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Generate dynamic breadcrumbs (Section 14)
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return ['Skill2Hire', 'Portal Home'];
    
    return [
      'Skill2Hire',
      currentRole.charAt(0).toUpperCase() + currentRole.slice(1),
      ...parts.map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 min-h-[70px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 print:hidden">
      
      {/* LEFT: Mobile Menu Toggle & Dynamic Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs Navigation */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold overflow-hidden max-w-md">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'font-extrabold text-slate-800' : 'hover:text-slate-600 truncate'}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CENTER: Global Search Bar (Section 13) */}
      <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${currentRole === 'student' ? 'jobs, courses, skills...' : currentRole === 'college' ? 'students, demand, heatmap...' : 'candidates, skills, jobs...'}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-10 pr-8 py-2 text-xs bg-slate-100/80 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Navigation Matches
            </div>
            {searchResults.map((res, i) => (
              <Link
                key={i}
                href={res.link}
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-primary-50 text-slate-700 hover:text-primary-900 transition-colors"
              >
                <span className="font-bold">{res.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                  {res.category}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT CONTROLS: Skill Graph, Regional Switcher, Notifications, Persona Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Skill Graph Quick Access */}
        <Link
          href="/skills/graph"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 transition-all text-xs font-bold"
          title="Global Skill Graph: 360° Relationships"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline font-extrabold">Skill Graph</span>
        </Link>

        {/* Global / Regional Context Selector */}
        <div ref={regionRef} className="relative">
          <button
            onClick={() => setIsRegionOpen(!isRegionOpen)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border transition-all text-xs font-bold ${
              isBiharActive
                ? 'bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/20'
                : selectedRegion === 'global'
                ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
            title="Switch Operating Geographic Context"
          >
            {isBiharActive ? (
              <>
                <span className="text-sm leading-none">🇮🇳</span>
                <span className="hidden md:inline font-extrabold text-amber-950">Bihar</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 uppercase font-black tracking-wider hidden sm:inline">
                  Active Flagship
                </span>
              </>
            ) : selectedRegion === 'in-tamilnadu' ? (
              <>
                <span className="text-sm leading-none">🇮🇳</span>
                <span className="hidden md:inline font-extrabold text-slate-900">Tamil Nadu</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold hidden sm:inline">
                  Expansion • Demo
                </span>
              </>
            ) : selectedRegion === 'in-telangana' ? (
              <>
                <span className="text-sm leading-none">🇮🇳</span>
                <span className="hidden md:inline font-extrabold text-slate-900">Telangana</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-900 font-bold hidden sm:inline">
                  Expansion • Demo
                </span>
              </>
            ) : selectedRegion === 'in-maharashtra' ? (
              <>
                <span className="text-sm leading-none">🇮🇳</span>
                <span className="hidden md:inline font-extrabold text-slate-900">Maharashtra</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold hidden sm:inline">
                  Expansion • Demo
                </span>
              </>
            ) : selectedRegion === 'kr-seoul' ? (
              <>
                <span className="text-sm leading-none">🇰🇷</span>
                <span className="hidden md:inline font-extrabold text-slate-900">South Korea</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold hidden sm:inline">
                  Expansion • Demo
                </span>
              </>
            ) : selectedRegion === 'cn-guangdong' ? (
              <>
                <span className="text-sm leading-none">🇨🇳</span>
                <span className="hidden md:inline font-extrabold text-slate-900">China</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-900 font-bold hidden sm:inline">
                  Expansion • Demo
                </span>
              </>
            ) : selectedRegion === 'global' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline text-blue-900 font-extrabold">Global Architecture</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline capitalize">{selectedRegion.replace('in-', '').replace('us-', '')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold hidden sm:inline">Planned</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {isRegionOpen && (
            <div className="absolute right-0 top-full mt-2 w-92 bg-white rounded-3xl border border-slate-200 shadow-2xl p-3 z-50 space-y-2.5 max-h-[85vh] overflow-y-auto">
              <div className="px-2 pt-1 pb-1.5 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Operating Geographic Scope
                </span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">
                  Global Architecture with Bihar Flagship
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Bihar is the live flagship implementation. Other regions display modeled expansion demo data.
                </p>
              </div>

              {/* 1. ACTIVE REGIONAL IMPLEMENTATION */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 px-2 block">
                  Active Regional Implementation
                </span>
                <button
                  onClick={() => { setRegion('in-bihar'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left text-xs transition-colors ${
                    selectedRegion === 'in-bihar'
                      ? 'bg-amber-50 text-amber-950 font-extrabold border border-amber-300 shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🇮🇳</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>India: Bihar</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-950 font-black">ACTIVE FLAGSHIP</span>
                      </div>
                      <div className="text-[10px] text-slate-500">8 Economic Districts • Verified BSDM/KYP Missions • 4 Corridors</div>
                    </div>
                  </div>
                  {selectedRegion === 'in-bihar' && <Check className="w-4 h-4 text-amber-700 shrink-0" />}
                </button>
              </div>

              {/* 2. EXPANSION REGIONS (DEMO DATA) */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Expansion Regions (Modeled)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                    Demo Data
                  </span>
                </div>

                <button
                  onClick={() => { setRegion('in-tamilnadu'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    selectedRegion === 'in-tamilnadu'
                      ? 'bg-indigo-50 text-indigo-950 font-extrabold border border-indigo-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>India: Tamil Nadu</span>
                        <span className="text-[9px] px-1 rounded bg-indigo-100 text-indigo-800 font-bold">தமிழ்</span>
                        <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600 font-medium">DEMO</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Chennai SaaS Corridor • Coimbatore Engineering</div>
                    </div>
                  </div>
                  {selectedRegion === 'in-tamilnadu' && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>

                <button
                  onClick={() => { setRegion('in-telangana'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    selectedRegion === 'in-telangana'
                      ? 'bg-cyan-50 text-cyan-950 font-extrabold border border-cyan-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>India: Telangana</span>
                        <span className="text-[9px] px-1 rounded bg-cyan-100 text-cyan-800 font-bold">తెలుగు</span>
                        <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600 font-medium">DEMO</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Cyberabad AI & Cloud • T-Hub Innovation</div>
                    </div>
                  </div>
                  {selectedRegion === 'in-telangana' && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                </button>

                <button
                  onClick={() => { setRegion('in-maharashtra'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    selectedRegion === 'in-maharashtra'
                      ? 'bg-rose-50 text-rose-950 font-extrabold border border-rose-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>India: Maharashtra</span>
                        <span className="text-[9px] px-1 rounded bg-rose-100 text-rose-800 font-bold">मराठी</span>
                        <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600 font-medium">DEMO</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Mumbai FinTech • Pune Automotive IT</div>
                    </div>
                  </div>
                  {selectedRegion === 'in-maharashtra' && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                </button>
              </div>

              {/* 3. GLOBAL ARCHITECTURE & ROADMAP */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block">
                  National & Global Architecture
                </span>

                <button
                  onClick={() => { setRegion('global'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    selectedRegion === 'global'
                      ? 'bg-blue-50 text-blue-950 font-extrabold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌐</span>
                    <div>
                      <div className="font-bold">Global View (All Ecosystems)</div>
                      <div className="text-[10px] text-slate-400">Decoupled multi-regional architecture</div>
                    </div>
                  </div>
                  {selectedRegion === 'global' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>

                <button
                  onClick={() => { setRegion('in-karnataka'); setIsRegionOpen(false); }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    selectedRegion === 'in-karnataka'
                      ? 'bg-slate-100 text-slate-900 font-extrabold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>India: Karnataka</span>
                        <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-700 font-bold">PLANNED</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Bengaluru Destination Hub</div>
                    </div>
                  </div>
                  {selectedRegion === 'in-karnataka' && <Check className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                </button>
              </div>

              {/* Vernacular Language Switcher */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Vernacular Language & Dialect
                </span>
                <div className="grid grid-cols-3 gap-1 px-1">
                  {([
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'bho', label: 'भोजपुरी' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'te', label: 'తెలుగు' },
                    { code: 'mr', label: 'मराठी' },
                  ] as const).map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`py-1 px-1 rounded-lg text-center text-[11px] font-bold transition-all truncate ${
                        selectedLanguage === l.code
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={l.label}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portal Quick Access Link */}
              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/regional"
                  onClick={() => setIsRegionOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-between hover:opacity-95 transition-opacity shadow-sm"
                >
                  <span>Regional Intelligence Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-xs text-slate-900">Ecosystem Notifications</span>
                <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
                  {notifications.length} Total
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Role / Persona Switcher Dropdown */}
        <div ref={personaRef} className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 hover:border-primary-400 hover:bg-slate-50 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {currentRole === 'student' ? '👩' : currentRole === 'college' ? '🎓' : currentRole === 'company' ? '🏢' : '👑'}
            </div>
            <div className="hidden sm:block text-xs leading-tight">
              <span className="block font-bold text-slate-900 capitalize truncate max-w-[110px]">
                {profile?.name || user?.name || 'Alex Rivera'}
              </span>
              <span className="text-[10px] font-bold text-primary-600 capitalize block">
                {currentRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl border border-slate-200 shadow-2xl p-3 z-50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                Fast Switch Demo Persona:
              </span>

              <div className="space-y-1">
                {DEMO_PERSONAS.map((p) => (
                  <button
                    key={p.userId}
                    onClick={async () => {
                      await switchPersona(p.role, p.userId);
                      setIsPersonaOpen(false);
                      if (p.role === 'student') router.push('/student/dashboard');
                      else if (p.role === 'college') router.push('/college/dashboard');
                      else if (p.role === 'company') router.push('/recruiter/dashboard');
                      else router.push('/admin/dashboard');
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-2xl text-left text-xs transition-colors ${
                      currentRole === p.role ? 'bg-primary-50 text-primary-900 font-extrabold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base">{p.role === 'student' ? '👩🎓' : p.role === 'college' ? '🎓' : p.role === 'company' ? '🏢' : '👑'}</span>
                    <div className="overflow-hidden flex-1 leading-tight">
                      <span className="block font-bold truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{p.badge}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs px-2">
                <button
                  type="button"
                  onClick={() => { setIsPersonaOpen(false); setIsSecurityOpen(true); }}
                  className="w-full text-left font-bold text-slate-700 hover:text-primary-600 flex items-center gap-1.5 py-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                  <span>Update Verified Email / Phone (OTP)</span>
                </button>
                <Link
                  href="/login"
                  onClick={() => setIsPersonaOpen(false)}
                  className="font-bold text-primary-600 hover:underline py-1"
                >
                  Unified Login & Switch Account →
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Security & Contact OTP Settings Modal */}
      <SecuritySettingsModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />
    </header>
  );
}
