"use client";

import React from "react";
import Link from "next/link";
import { defaultUserProgress, sampleTopics } from "@/lib/data/sampleTopics";
import {
  Award,
  LineChart,
  Brain,
  CheckCircle,
  Calendar,
  Sparkles,
  Network,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProgressPage() {
  const progress = defaultUserProgress;

  const categoryEntries = Object.entries(progress.categoryMastery) as [string, number][];

  const reviewQueue = [
    {
      topicTitle: "Transformer Architecture & Self-Attention",
      category: "Artificial Intelligence",
      dueIn: "Today",
      retentionConfidence: "94%",
      mode: "Socratic Active Recall",
    },
    {
      topicTitle: "Recursion & Call Stack Frames",
      category: "Computer Science",
      dueIn: "In 2 days",
      retentionConfidence: "88%",
      mode: "Interactive Flowchart",
    },
    {
      topicTitle: "Photosynthesis: Light-Dependent Reactions",
      category: "Biology & Life Sciences",
      dueIn: "In 4 days",
      retentionConfidence: "82%",
      mode: "Real-World Analogy",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="gap-1">
                <LineChart className="h-3 w-3" />
                <span>Mastery Intelligence</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-2">
              Concept Mastery & Retention Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Visual analytics tracking your understanding across disciplines and cognitive representations.
            </p>
          </div>

          <Link href="/learn">
            <Button variant="primary" size="sm" icon={<Sparkles className="h-4 w-4" />}>
              Practice Review Concepts
            </Button>
          </Link>
        </div>

        {/* Top Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Retention Index
              </span>
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">92.4%</div>
              <p className="text-xs text-slate-400 mt-1">
                Calculated from Socratic self-check accuracy and reflection depth.
              </p>
            </div>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Streak
              </span>
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">
                {progress.currentStreakDays} Days
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Daily micro-learning helps prevent memory decay curves.
              </p>
            </div>
          </Card>

          <Card glass className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Synchronized Mastery
              </span>
              <Brain className="h-5 w-5 text-accent-cyan" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">4 / 4</div>
              <p className="text-xs text-slate-400 mt-1">
                Curated foundational STEM modules explored.
              </p>
            </div>
          </Card>
        </div>

        {/* Discipline Mastery Progress Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card glass>
              <CardHeader>
                <CardTitle className="text-base">STEM Discipline Mastery</CardTitle>
                <p className="text-xs text-slate-400">
                  Comprehension depth by subject based on multi-choice and flowchart checkpoints.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {categoryEntries.map(([category, score]) => (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{category}</span>
                      <span className="font-mono text-slate-400">{score}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tri-Modal Strength Distribution */}
          <div className="lg:col-span-5">
            <Card glass>
              <CardHeader>
                <CardTitle className="text-base">Cognitive Representation Balance</CardTitle>
                <p className="text-xs text-slate-400">
                  How effectively you engage each synchronized learning mode:
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                      1. Real-World Analogy
                    </span>
                    <span>96% Accuracy</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Excellent intuitive metaphor translation and mental mapping.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-accent-cyan">
                    <span className="flex items-center gap-1.5">
                      <Network className="h-3.5 w-3.5 text-accent-cyan" />
                      2. Visual Flowcharts
                    </span>
                    <span>91% Accuracy</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Strong comprehension of state machine transitions and branch pathways.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
                      3. Socratic Self-Check
                    </span>
                    <span>89% Accuracy</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Solid active recall and misconception discrimination under scenario testing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Spaced Repetition Review Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white font-display">
                Adaptive Spaced Repetition Schedule
              </h2>
            </div>
            <span className="text-xs text-slate-400">Optimized for long-term retention</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewQueue.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={idx === 0 ? "rose" : "default"} size="sm">
                      {item.dueIn}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      Confidence: {item.retentionConfidence}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.topicTitle}</h4>
                  <p className="text-xs text-slate-400">{item.category}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{item.mode}</span>
                  <Link
                    href="/learn"
                    className="text-accent-cyan font-semibold hover:text-accent-teal flex items-center gap-0.5"
                  >
                    <span>Review</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
