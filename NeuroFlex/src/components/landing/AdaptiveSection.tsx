"use client";

import React from "react";
import Link from "next/link";
import { Sliders, Sparkles, RefreshCw, Layers, Gauge, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AdaptiveSection() {
  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="cyan" size="sm">
            Section 4 • Adaptive Intelligence
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Tailored to Your Cognitive Preference
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Configure learning style, difficulty tier, and explanation density. NeuroFlex dynamically recalibrates the AI synthesis engine for you.
          </p>
        </div>

        {/* Adaptive Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dimension 1: Learning Style */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/60 p-6 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">01. Preference</span>
              <Sliders className="h-4 w-4 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Sensory Style</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Choose between <strong>Visual-first</strong>, <strong>Example-based</strong>, <strong>Question-based</strong>, or <strong>Balanced Mixed</strong> modes.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono">
              <span className="px-2 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">Visual</span>
              <span className="px-2 py-1 rounded-md bg-brand-950/80 text-brand-300 border border-brand-800/50">Example</span>
              <span className="px-2 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">Question</span>
              <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Mixed</span>
            </div>
          </div>

          {/* Dimension 2: Difficulty Tier */}
          <div className="rounded-3xl border border-brand-500/30 bg-slate-900/60 p-6 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">02. Tier</span>
              <Gauge className="h-4 w-4 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Difficulty Depth</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Scale from foundational <strong>Beginner</strong> intuitions to rigorous <strong>Intermediate</strong> and <strong>Advanced</strong> mathematical mechanics.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono">
              <span className="px-2 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">Beginner</span>
              <span className="px-2 py-1 rounded-md bg-brand-950/80 text-brand-300 border border-brand-800/50">Intermediate</span>
              <span className="px-2 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">Advanced</span>
            </div>
          </div>

          {/* Dimension 3: Density */}
          <div className="rounded-3xl border border-purple-500/30 bg-slate-900/60 p-6 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">03. Density</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Explanation Density</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Toggle between concise <strong>Simple</strong> executive summaries, <strong>Balanced</strong> clarity, or comprehensive <strong>Detailed</strong> breakdowns.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono">
              <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">Simple</span>
              <span className="px-2 py-1 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/50">Balanced</span>
              <span className="px-2 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">Detailed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
