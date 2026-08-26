"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sampleTopics, defaultUserProgress } from "@/lib/data/sampleTopics";
import {
  Flame,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle2,
  PlayCircle,
  Network,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const progress = defaultUserProgress;

  const filteredTopics = sampleTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-950/80 via-slate-900 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                Student Learning Hub
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Welcome back to NeuroFlex
            </h1>
            <p className="text-sm text-slate-300">
              Ready to deconstruct a new STEM topic into synchronized analogies, visual flows, and Socratic checks?
            </p>
          </div>

          <Link href="/learn">
            <Button
              variant="accent"
              size="md"
              icon={<Sparkles className="h-4 w-4" />}
              className="w-full md:w-auto"
            >
              Resume Learn Studio
            </Button>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card glass className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Current Daily Streak</span>
              <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-white font-display">
                {progress.currentStreakDays} Days
              </h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" /> Consistent daily review
              </p>
            </div>
          </Card>

          <Card glass className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Micro-Learning Time</span>
              <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-white font-display">
                {progress.totalTimeMinutes} Mins
              </h3>
              <p className="text-xs text-slate-400 mt-1">Focused cognitive sessions</p>
            </div>
          </Card>

          <Card glass className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Retention Score</span>
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-white font-display">
                {progress.retentionScorePercentage}%
              </h3>
              <p className="text-xs text-emerald-400 mt-1">High conceptual accuracy</p>
            </div>
          </Card>

          <Card glass className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Completed Concepts</span>
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-extrabold text-white font-display">
                {progress.completedTopicIds.length} Modules
              </h3>
              <p className="text-xs text-slate-400 mt-1">Across 4 STEM disciplines</p>
            </div>
          </Card>
        </div>

        {/* Search Concept Launcher */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts to launch immediately (e.g. Attention, Recursion, Photosynthesis)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Modules Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List: In-Progress and Recommended Modules */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display">
                Curated STEM Micro-Modules
              </h2>
              <Link href="/learn" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="cyan" size="sm">
                        {topic.category}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {topic.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {topic.estimatedMinutes}m
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.subtitle}
                    </p>
                  </div>

                  <Link href="/learn">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<PlayCircle className="h-4 w-4 text-accent-cyan" />}
                      className="whitespace-nowrap"
                    >
                      Start Module
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Recent Study History & Modes Breakdown */}
          <div className="space-y-6">
            <Card glass>
              <CardHeader>
                <CardTitle className="text-base">Recent Study Activity</CardTitle>
                <p className="text-xs text-slate-400">Completed representations log</p>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {progress.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/60 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {activity.topicTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        {activity.modeCompleted === "all" ? (
                          <span className="text-brand-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Tri-Modal Mastered
                          </span>
                        ) : activity.modeCompleted === "flowchart" ? (
                          <span className="text-accent-cyan flex items-center gap-1">
                            <Network className="h-3 w-3" /> Flowchart
                          </span>
                        ) : (
                          <span className="text-purple-400 flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" /> Socratic Check
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm">
                      {activity.score}% Score
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card glass className="bg-brand-950/20 border-brand-500/20">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>Adaptive Tip</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Struggling with complex mathematical concepts? Review the <strong>Real-World Analogy</strong> first before inspecting the <strong>Mermaid Flowchart</strong>.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
