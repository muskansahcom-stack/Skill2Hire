import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Shield, Terminal, BookOpen, Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white font-display">
                Neuro<span className="text-accent-cyan">Flex</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adaptive micro-learning that synchronizes real-world analogies, dynamic flowcharts, and Socratic self-checks for deep conceptual understanding.
            </p>
          </div>

          {/* Learning Modes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Synchronized Modes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/learn" className="hover:text-accent-cyan transition-colors">
                  1. Real-World Analogy
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-accent-cyan transition-colors">
                  2. Interactive Visual Flowchart
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-accent-cyan transition-colors">
                  3. Socratic Self-Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Routes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Landing Overview
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-white transition-colors">
                  Learn Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Learning Dashboard
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-white transition-colors">
                  Concept Mastery & Analytics
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Accessibility & AI Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Pedagogy & Design */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Cognitive Principles
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-brand-400" />
                <span>Dual-Coding Theory</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-accent-cyan" />
                <span>Cognitive Load Optimization</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Universal Accessibility First</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/60 pt-6 text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} NeuroFlex EdTech. Production frontend foundation.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span className="hover:text-slate-400">Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
