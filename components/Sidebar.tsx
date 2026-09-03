'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, DEMO_PERSONAS } from '@/context/AuthContext';
import Skill2HireLogo from '@/components/Skill2HireLogo';
import {
  ShieldCheck,
  LayoutDashboard,
  Briefcase,
  Zap,
  BookOpen,
  GraduationCap,
  Award,
  FileCheck2,
  Code2,
  Sparkles,
  Compass,
  FolderGit2,
  FileText,
  Send,
  Users,
  Flame,
  PlusCircle,
  Cpu,
  Layers,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Search,
  User as UserIcon
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, switchPersona, logout } = useAuth();
  const currentRole: UserRole = role || 'student';

  // Navigation Items Config grouped by sections per role
  const getNavSections = (): NavSection[] => {
    if (currentRole === 'student') {
      return [
        {
          title: 'MAIN',
          items: [
            { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/jobs', label: 'Jobs', icon: Briefcase, badge: '25+' },
            { href: '/learn', label: 'Learn', icon: BookOpen, badge: 'Skill Hub', badgeColor: 'bg-emerald-600' },
            { href: '/student/become-ready', label: 'Become Job Ready', icon: Zap, badge: 'AI', badgeColor: 'bg-amber-500' },
          ]
        },
        {
          title: 'LEARNING',
          items: [
            { href: '/courses', label: 'Courses', icon: Layers },
            { href: '/student/become-ready', label: 'My Learning', icon: BookOpen },
            { href: '/student/skills', label: 'Skills', icon: Award },
            { href: '/student/academic-report', label: 'Skill Passport', icon: ShieldCheck, badge: 'Verified', badgeColor: 'bg-indigo-600' },
            { href: '/assessments/asm_python', label: 'Assessments', icon: FileCheck2 },
            { href: '/student/coding-practice', label: 'Coding Practice', icon: Code2 },
            { href: '/student/compiler', label: 'Universal Compiler', icon: Cpu, badge: 'Full IDE', badgeColor: 'bg-emerald-600' },
          ]
        },
        {
          title: 'CAREER',
          items: [
            { href: '/student/career-guide', label: 'Career Roadmap', icon: Compass },
            { href: '/student/projects', label: 'Projects', icon: FolderGit2 },
            { href: '/student/interview-coach', label: 'Interview Coach', icon: Sparkles },
            { href: '/student/resume-matcher', label: 'Resume Builder', icon: FileText },
            { href: '/student/applications', label: 'Applications', icon: Send },
            { href: '/student/certificates', label: 'Certificates', icon: Award },
          ]
        },
        {
          title: 'ACCOUNT & SECURITY',
          items: [
            { href: '/security-audit', label: 'Security & Access Control', icon: ShieldCheck, badge: 'Audit' },
            { href: '/brand', label: 'Brand & Identity', icon: Sparkles },
            { href: '/differentiation', label: 'Platform Philosophy', icon: Flame },
          ]
        }
      ];
    } else if (currentRole === 'college') {
      return [
        {
          title: 'MAIN',
          items: [
            { href: '/college/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/college/industry-demand', label: 'Industry Demand', icon: Compass },
            { href: '/college/skill-heatmap', label: 'Skill Heatmap', icon: Flame, badge: 'Live' },
            { href: '/college/curriculum-gap', label: 'Curriculum Gap', icon: Sparkles },
          ]
        },
        {
          title: 'TRAINING',
          items: [
            { href: '/college/training', label: 'Training Programs', icon: GraduationCap },
            { href: '/courses', label: 'Courses', icon: BookOpen },
            { href: '/college/students', label: 'Students', icon: Users, badge: 'Roster' },
            { href: '/college/skill-heatmap', label: 'Student Skills', icon: Award },
            { href: '/assessments/asm_python', label: 'Assessments', icon: FileCheck2 },
          ]
        },
        {
          title: 'PLACEMENT',
          items: [
            { href: '/college/placement-readiness', label: 'Placement Readiness', icon: Award },
            { href: '/college/demand-signals', label: 'Companies', icon: Building2 },
            { href: '/jobs', label: 'Jobs', icon: Briefcase },
            { href: '/college/placement-readiness', label: 'Placement Drives', icon: Zap },
          ]
        },
        {
          title: 'ANALYTICS',
          items: [
            { href: '/college/training', label: 'Training Analytics', icon: Compass },
            { href: '/college/placement-readiness', label: 'Placement Analytics', icon: Flame },
            { href: '/college/curriculum-gap', label: 'Reports', icon: FileText },
          ]
        },
        {
          title: 'ACCOUNT',
          items: [
            { href: '/brand', label: 'Brand Identity', icon: Sparkles },
            { href: '/differentiation', label: 'Ecosystem Intelligence', icon: Flame },
          ]
        }
      ];
    } else if (currentRole === 'company') {
      return [
        {
          title: 'MAIN',
          items: [
            { href: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/recruiter/jobs/new', label: 'Create Job', icon: PlusCircle, badge: 'AI' },
            { href: '/jobs', label: 'My Jobs', icon: Briefcase },
          ]
        },
        {
          title: 'TALENT',
          items: [
            { href: '/recruiter/skill-search', label: 'Talent Intelligence', icon: Cpu, badge: 'Direct' },
            { href: '/recruiter/skill-search', label: 'Skill Search', icon: Search },
            { href: '/recruiter/candidates', label: 'Candidates', icon: Users },
            { href: '/recruiter/applications', label: 'Shortlisted', icon: CheckCircle2 },
            { href: '/recruiter/applications', label: 'Applications', icon: Send, badge: 'Pipeline' },
          ]
        },
        {
          title: 'HIRING',
          items: [
            { href: '/assessments/asm_python', label: 'Assessments', icon: FileCheck2 },
            { href: '/recruiter/campus-pipeline', label: 'Campus Hiring', icon: Layers },
            { href: '/college/demand-signals', label: 'Colleges', icon: Building2 },
            { href: '/recruiter/applications', label: 'Hiring Pipeline', icon: Zap },
          ]
        },
        {
          title: 'ANALYTICS',
          items: [
            { href: '/college/industry-demand', label: 'Industry Skill Demand', icon: Compass },
            { href: '/recruiter/dashboard', label: 'Analytics', icon: Flame },
            { href: '/recruiter/dashboard', label: 'Reports', icon: FileText },
          ]
        },
        {
          title: 'ACCOUNT',
          items: [
            { href: '/brand', label: 'Brand Identity', icon: Sparkles },
            { href: '/differentiation', label: 'Platform Philosophy', icon: Flame },
          ]
        }
      ];
    } else {
      // Admin
      return [
        {
          title: 'MANAGEMENT',
          items: [
            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/college/students', label: 'Students', icon: Users },
            { href: '/college/dashboard', label: 'Colleges', icon: GraduationCap },
            { href: '/recruiter/dashboard', label: 'Companies', icon: Building2 },
            { href: '/jobs', label: 'Jobs', icon: Briefcase },
            { href: '/courses', label: 'Courses', icon: Layers },
            { href: '/learn', label: 'Skills', icon: Award },
            { href: '/learn', label: 'Videos', icon: BookOpen },
            { href: '/assessments/asm_python', label: 'Assessments', icon: FileCheck2 },
            { href: '/student/projects', label: 'Projects', icon: FolderGit2 },
            { href: '/student/compiler', label: 'Compiler Playground', icon: Cpu },
            { href: '/college/training', label: 'Training Programs', icon: GraduationCap },
            { href: '/recruiter/applications', label: 'Applications', icon: Send },
            { href: '/college/industry-demand', label: 'Industry Demand', icon: Compass },
            { href: '/admin/dashboard', label: 'Analytics', icon: Flame },
            { href: '/admin/dashboard', label: 'Reports', icon: FileText },
            { href: '/brand', label: 'Brand & Identity', icon: Sparkles },
          ]
        }
      ];
    }
  };

  const navSections = getNavSections();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* LEFT-SIDE VERTICAL SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out select-none print:hidden ${
          isCollapsed ? 'w-[76px]' : 'w-64 sm:w-72'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRANDING (Section 2) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[72px]">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center overflow-hidden group"
          >
            <Skill2HireLogo
              variant={isCollapsed ? 'icon' : 'full'}
              size="md"
              role={currentRole}
              showTagline={!isCollapsed}
            />
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* NAVIGATION ITEMS LIST (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/student/dashboard' && item.href !== '/college/dashboard' && item.href !== '/recruiter/dashboard');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative group ${
                        isActive
                          ? 'bg-primary-50 text-primary-900 font-extrabold shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary-600 rounded-r-full" />
                      )}

                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white shrink-0 ${
                            item.badgeColor || 'bg-primary-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM USER PERSONA & ACTIONS (Section 8) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          {/* Quick Account Links */}
          <div className="space-y-0.5">
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
              title={isCollapsed ? 'Settings & Switch Persona' : undefined}
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Settings & Role Switch</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Sign Out</span>}
            </button>
          </div>

          {/* Current Active Persona Card */}
          <div className={`p-2 bg-white rounded-2xl border border-slate-200 flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {currentRole === 'student' ? '👩🎓' : currentRole === 'college' ? '🎓' : currentRole === 'company' ? '🏢' : '👑'}
            </div>
            
            {!isCollapsed && (
              <div className="overflow-hidden leading-tight flex-1">
                <span className="block font-bold text-xs text-slate-800 truncate">
                  {profile?.name || user?.name || 'Alex Rivera'}
                </span>
                <span className="text-[10px] font-semibold text-primary-600 capitalize block">
                  {currentRole} Role
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
