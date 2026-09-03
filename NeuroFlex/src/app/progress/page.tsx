"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProgressService } from "@/lib/progress/progressService";
import {
  MasteryRadialGauge,
  WeeklySessionsBarChart,
  QuizPerformanceAreaChart,
} from "@/components/analytics/AnalyticsCharts";
import { SpacedReviewDeck } from "@/components/analytics/SpacedReviewDeck";
import {
  Award,
  LineChart,
  Brain,
  CheckCircle2,
  Calendar,
  Sparkles,
  Network,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  BookOpen,
  Search,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProgressPage() {
  const { user } = useAuth();
  const analytics = ProgressService.getProgressAnalytics();
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "weak" | "strong">("all");

  const filteredTopics = analytics.topicMasteryList.filter(
    (t) =>
      t.topicTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Mastered":
        return "emerald";
      case "Proficient":
        return "brand";
      case "Developing":
        return "purple";
      case "Needs Review":
        return "rose";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header with Review Weak Areas CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="gap-1 px-3 py-1 font-semibold">
                <LineChart className="h-3.5 w-3.5" />
                <span>Student Learning Analytics</span>
              </Badge>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                <TrendingUp className="h-3.5 w-3.5" /> +{analytics.recentImprovementPercentage}% This Month
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
              {user ? `${user.name}'s Mastery & Retention` : "Mastery & Retention Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized analytics tracking your conceptual retention, active recall velocity, and focus areas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent "Review Weak Areas" Button */}
            <Link href="/learn">
              <Button
                variant="accent"
                size="md"
                icon={<AlertTriangle className="h-4 w-4" />}
                className="font-semibold shadow-lg shadow-cyan-500/10"
              >
                Review Weak Areas
              </Button>
            </Link>
          </div>
        </div>

        {/* 1. Overall Mastery & Top Level KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Radial Overall Mastery Index (4 cols) */}
          <div className="md:col-span-4 flex">
            <Card glass className="p-6 w-full flex flex-col items-center justify-center text-center space-y-4 border-brand-500/30">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Overall Mastery
              </h3>
              
              <MasteryRadialGauge percentage={analytics.overallMasteryPercentage} size={190} />

              <div className="space-y-1 text-xs text-slate-400 max-w-xs">
                <p>
                  Calculated from multi-concept Socratic accuracy, flowchart steps, and recall speed.
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Metrics & Velocity Highlights (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card glass className="p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quiz Accuracy
                </span>
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white font-display">
                  {analytics.quizPerformance.averageScorePercentage}%
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {analytics.quizPerformance.correctAnswersCount} correct of {analytics.quizPerformance.totalQuestionsAnswered} answered
                </p>
              </div>
            </Card>

            <Card glass className="p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Streak
                </span>
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400">
                  <Flame className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white font-display">
                  {analytics.activeStreakDays} Days
                </div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" /> Habit prevents Ebbinghaus memory decay
                </p>
              </div>
            </Card>

            <Card glass className="p-5 flex flex-col justify-between hover:border-brand-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Learning Time
                </span>
                <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white font-display">
                  {analytics.totalStudyMinutes} Mins
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ~{(analytics.totalStudyMinutes / 60).toFixed(1)} hours of active engagement
                </p>
              </div>
            </Card>

            <Card glass className="p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recent Improvement
                </span>
                <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-white font-display">
                  +{analytics.recentImprovementPercentage}%
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  Significant gains in Data Structures &amp; Networks
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* 2. Visual Charts: Learning Sessions & Quiz Performance Velocity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Learning Sessions Bar Chart */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-400" />
                <CardTitle className="text-base font-bold">Weekly Learning Sessions</CardTitle>
              </div>
              <span className="text-xs text-slate-400 font-mono">Minutes studied per day</span>
            </div>
            
            <WeeklySessionsBarChart sessions={analytics.weeklySessions} />
            
            <p className="text-[11px] text-slate-400 text-center pt-2">
              Consistent 30-45 minute micro-sessions maximize long-term neural pathway consolidation.
            </p>
          </Card>

          {/* Quiz Performance Accuracy Trend Chart */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent-cyan" />
                <CardTitle className="text-base font-bold">Quiz Performance &amp; Recall Velocity</CardTitle>
              </div>
              <span className="text-xs text-slate-400 font-mono">Recent scores (%)</span>
            </div>

            <QuizPerformanceAreaChart data={analytics.quizPerformance.recentQuizScores} />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <span>Avg Score: <strong className="text-emerald-400">{analytics.quizPerformance.averageScorePercentage}%</strong></span>
              <span>Total Checkpoints: <strong className="text-white">{analytics.quizPerformance.totalQuestionsAnswered}</strong></span>
            </div>
          </Card>
        </div>

        {/* 3. Strong Concepts vs Weak Concepts Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strong Concepts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white font-display">Strong Concepts</h2>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">High Recall Retention</span>
            </div>

            <div className="space-y-3">
              {analytics.strongConcepts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300">{item.topicTitle}</span>
                    <Badge variant="emerald" size="sm">
                      {item.masteryScore}% Mastery
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.conceptName}</h4>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.category}</span>
                    <span className="text-emerald-400 font-mono">🔥 {item.retentionStreak} perfect reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Concepts (Needs Review) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <h2 className="text-lg font-bold text-white font-display">Needs Review (Weak Concepts)</h2>
              </div>
              <Link href="/learn">
                <span className="text-xs text-accent-cyan font-bold hover:text-accent-teal flex items-center gap-1 cursor-pointer">
                  <span>Review All</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>

            <div className="space-y-3">
              {analytics.weakConcepts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-2 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-300">{item.topicTitle}</span>
                    <Badge variant="rose" size="sm">
                      Recommend: {item.recommendedMode}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.conceptName}</h4>
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{item.category}</span>
                    <Link href="/learn">
                      <button className="text-xs font-bold text-accent-cyan hover:text-white flex items-center gap-1 cursor-pointer">
                        <span>Reinforce Concept</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spaced Repetition Flashcard Review Deck */}
        <SpacedReviewDeck />

        {/* 4. Topic Mastery Comprehensive Table & Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-400" />
              <h2 className="text-lg md:text-xl font-bold text-white font-display">
                Topic Mastery Breakdown
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter topics by name or discipline..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <Card glass className="p-0 overflow-hidden">
            <div className="divide-y divide-slate-800/80">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {topic.topicTitle}
                      </h4>
                      <Badge variant={getStatusBadgeVariant(topic.status)} size="sm">
                        {topic.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {topic.category} • Last studied: {topic.lastStudiedDate} • {topic.quizzesTaken} quiz check(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-start sm:self-center w-full sm:w-auto">
                    {/* Mastery Bar */}
                    <div className="space-y-1 w-full sm:w-40">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Mastery</span>
                        <span className="font-bold text-white">{topic.masteryPercentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            topic.masteryPercentage >= 80
                              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                              : topic.masteryPercentage >= 60
                              ? "bg-gradient-to-r from-brand-500 to-indigo-400"
                              : "bg-gradient-to-r from-rose-500 to-amber-500"
                          }`}
                          style={{ width: `${topic.masteryPercentage}%` }}
                        />
                      </div>
                    </div>

                    <Link href="/learn">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs whitespace-nowrap"
                      >
                        Study
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
