"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  BookOpen,
  LayoutDashboard,
  LineChart,
  Settings,
  Menu,
  X,
  Compass,
  User,
  LogOut,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/explore", label: "Curriculum", icon: Compass },
  { href: "/learn", label: "Learn Studio", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-accent-cyan rounded-xl"
          aria-label="NeuroFlex - Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/neuroflex-logo.png"
            alt="NeuroFlex Logo"
            width={36}
            height={36}
            style={{ width: "36px", height: "36px", minWidth: "36px", maxWidth: "36px" }}
            className="h-9 w-9 rounded-xl object-cover shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-display">
              Neuro<span className="text-accent-cyan">Flex</span>
            </span>
            <span className="text-[10px] -mt-1 font-medium uppercase tracking-widest text-slate-400">
              One Concept. Three Ways.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs lg:text-sm font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                  isActive
                    ? "bg-slate-800/90 text-white shadow-sm border border-slate-700/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-accent-cyan" : "text-slate-400"}`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Auth Profile / Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent-cyan"
                title="View Student Dashboard"
              >
                <div className="h-6 w-6 rounded-lg bg-brand-600/40 border border-brand-500/50 flex items-center justify-center text-brand-300 text-[11px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                <span className="flex items-center gap-0.5 text-amber-400 font-mono text-[11px]">
                  <Flame className="h-3 w-3" /> {user.streakDays}d
                </span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors focus-visible:ring-2 focus-visible:ring-rose-400"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Log In
                </Button>
              </Link>
              <Link href="/login?tab=signup">
                <Button variant="primary" size="sm" className="text-xs font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2 animate-fadeIn"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                  isActive
                    ? "bg-brand-950/60 text-white border border-brand-500/40"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-accent-cyan" : "text-slate-400"}`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-brand-600/40 border border-brand-500/50 flex items-center justify-center text-brand-300 text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">{user.name}</span>
                    <span className="block text-[10px] text-slate-400">{user.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs text-rose-400 font-semibold px-2 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button variant="primary" size="md" className="w-full justify-center">
                  Student Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
