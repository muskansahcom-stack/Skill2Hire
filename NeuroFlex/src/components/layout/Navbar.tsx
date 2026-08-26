"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BookOpen, LayoutDashboard, LineChart, Settings, Menu, X, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/learn", label: "Learn Studio", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-display">
              Neuro<span className="text-accent-cyan">Flex</span>
            </span>
            <span className="text-[10px] -mt-1 font-medium uppercase tracking-widest text-slate-400">
              Adaptive Micro-Learning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs lg:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-slate-800/90 text-white shadow-sm border border-slate-700/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-accent-cyan" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/learn">
            <Button variant="primary" size="sm" icon={<Sparkles className="h-4 w-4" />}>
              Start Learning
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-brand-950/60 text-white border border-brand-500/40"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-accent-cyan" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/learn" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full justify-center">
                Start Learning Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
