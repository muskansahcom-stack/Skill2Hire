"use client";

import React from "react";
import Link from "next/link";
import { LineChart, TrendingUp, Flame, Clock, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProgressSection() {
  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/60 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="cyan" size="sm">
            Section 6 • Mastery Analytics
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Track Conceptual Mastery &amp; Retention
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Real-time visual telemetry tracks your retention velocity, study streaks, and subject mastery over time.
          </p>
        </div>

        {/* Dashboard Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Daily Streak</span>
              <Flame className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">5 Days</div>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> +2 days ahead of target
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Overall Mastery</span>
              <Award className="h-5 w-5 text-accent-cyan" />
            </div>
            <div className="text-3xl font-black text-accent-cyan font-mono">72%</div>
            <p className="text-xs text-slate-400">12 STEM modules verified</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Study Time</span>
              <Clock className="h-5 w-5 text-brand-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">3.8 hrs</div>
            <p className="text-xs text-slate-400">Average 5m per micro-session</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Quiz Accuracy</span>
              <LineChart className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-purple-400 font-mono">91%</div>
            <p className="text-xs text-slate-400">First-pass recall rate</p>
          </div>
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link href="/progress">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              className="text-xs font-bold hover:border-accent-cyan"
            >
              Explore Full Progress Analytics Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
