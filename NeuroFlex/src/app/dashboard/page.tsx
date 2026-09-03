"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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
  AlertTriangle,
  RotateCcw,
  Compass,
  Cpu,
  Layers,
  GraduationCap,
  Calendar,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ActiveTopicProgress {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  progressPercentage: number;
  nextMode: string;
  estimatedMinutesLeft: number;
  lastVisited: string;
}

interface RecommendedTopic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  reason: string;
}

interface WeakArea {
  id: string;
  concept: string;
  parentTopic: string;
  category: string;
  errorRate: string;
  recommendedMode: "Visual" | "Analogy" | "Socratic";
}

interface ActivityItem {
  id: string;
  topicTitle: string;
  category: string;
  timestamp: string;
  score: number;
  modeCompleted: "analogy" | "flowchart" | "socratic" | "all";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const studentStats = {
    streakDays: user?.streakDays || 5,
    topicsLearned: user?.topicsMastered || 12,
    learningTimeHours: 3.8,
    learningTimeMinutes: 228,
    averageQuizScore: 91,
  };

  // Mastery Overview by Subject Area
  const subjectMastery = [
    { subject: "Data Structures", progress: 78, color: "from-brand-500 to-indigo-600", count: "4/5 Topics" },
    { subject: "Computer Networks", progress: 65, color: "from-accent-cyan to-teal-500", count: "3/5 Topics" },
    { subject: "AI Fundamentals", progress: 52, color: "from-purple-500 to-pink-600", count: "2/4 Topics" },
    { subject: "Biology & Life Sciences", progress: 44, color: "from-emerald-500 to-green-600", count: "2/4 Topics" },
    { subject: "Quantum Physics", progress: 60, color: "from-amber-500 to-orange-600", count: "3/5 Topics" },
  ];

  // Continue Learning Cards (In-progress topics)
  const continueLearning: ActiveTopicProgress[] = [
    {
      id: "tcp-handshake",
      title: "TCP Three-Way Handshake",
      category: "Computer Networks",
      difficulty: "Beginner",
      progressPercentage: 66,
      nextMode: "Socratic Active Recall",
      estimatedMinutesLeft: 3,
      lastVisited: "25m ago",
    },
    {
      id: "binary-search",
      title: "Binary Search",
      category: "Data Structures",
      difficulty: "Beginner",
      progressPercentage: 33,
      nextMode: "Visual Flowchart",
      estimatedMinutesLeft: 4,
      lastVisited: "2h ago",
    },
  ];

  // Recommended Topics
  const recommendedTopics: RecommendedTopic[] = [
    {
      id: "transformer-self-attention",
      title: "Transformer & Self-Attention",
      subtitle: "How modern language models dynamically weigh importance of every token simultaneously",
      category: "AI Fundamentals",
      difficulty: "Advanced",
      estimatedMinutes: 8,
      reason: "Builds upon your Neural Network foundation",
    },
    {
      id: "photosynthesis",
      title: "Photosynthesis: Light Reactions",
      subtitle: "Photolysis water splitting and proton gradients in chloroplast thylakoids",
      category: "Biology & Life Sciences",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      reason: "Popular starter concept with rich visual models",
    },
    {
      id: "stack-data-structure",
      title: "Stack Data Structure",
      subtitle: "LIFO memory management, push/pop mechanics, and recursive call frames",
      category: "Data Structures",
      difficulty: "Beginner",
      estimatedMinutes: 4,
      reason: "Prerequisite for graph search & call stack debugging",
    },
  ];

  // Weak Areas Flagged from Socratic Checkpoints
  const weakAreas: WeakArea[] = [
    {
      id: "w1",
      concept: "Connection Termination (FIN Handshake)",
      parentTopic: "TCP Protocol Mechanics",
      category: "Computer Networks",
      errorRate: "Missed on first attempt",
      recommendedMode: "Visual",
    },
    {
      id: "w2",
      concept: "Integer Overflow in Midpoint Formula",
      parentTopic: "Binary Search Implementation",
      category: "Data Structures",
      errorRate: "Requires reinforcement",
      recommendedMode: "Analogy",
    },
    {
      id: "w3",
      concept: "Thylakoid Proton Gradient Chemiosmosis",
      parentTopic: "Photosynthesis Reactions",
      category: "Biology & Life Sciences",
      errorRate: "Low confidence rating",
      recommendedMode: "Socratic",
    },
  ];

  // Recent Learning Activity Timeline
  const recentActivities: ActivityItem[] = [
    {
      id: "act-1",
      topicTitle: "TCP Three-Way Handshake",
      category: "Computer Networks",
      timestamp: "Today, 10:42 AM",
      score: 100,
      modeCompleted: "all",
    },
    {
      id: "act-2",
      topicTitle: "Binary Search",
      category: "Data Structures",
      timestamp: "Yesterday, 3:15 PM",
      score: 95,
      modeCompleted: "socratic",
    },
    {
      id: "act-3",
      topicTitle: "Photosynthesis",
      category: "Biology",
      timestamp: "Aug 25, 6:30 PM",
      score: 85,
      modeCompleted: "flowchart",
    },
    {
      id: "act-4",
      topicTitle: "Stack Data Structure",
      category: "Data Structures",
      timestamp: "Aug 24, 11:20 AM",
      score: 90,
      modeCompleted: "analogy",
    },
  ];

  const filteredRecommended = recommendedTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. Welcome Section & Quick Launcher Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-950/80 via-slate-900 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/neuroflex-logo.png"
              alt="NeuroFlex Logo"
              width={48}
              height={48}
              style={{ width: "48px", height: "48px", minWidth: "48px", maxWidth: "48px" }}
              className="h-12 w-12 rounded-2xl object-cover shadow-xl shadow-brand-500/20 shrink-0 hidden sm:block"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                  Student Learning Hub
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
                {user ? `Welcome back, ${user.name}` : "Continue Learning"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You&apos;re maintaining an active {studentStats.streakDays}-day streak with {studentStats.topicsLearned} concepts mastered. Pick up where you left off or explore recommended modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/learn">
              <Button
                variant="primary"
                size="md"
                icon={<Sparkles className="h-4 w-4" />}
                className="w-full sm:w-auto font-semibold px-6"
              >
                Open Learn Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* 2, 3, 4, 5. Core Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 2. Current learning streak */}
          <Card glass className="p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Streak
              </span>
              <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/10">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">
                {studentStats.streakDays} Days
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="h-3 w-3" /> Active daily learning habit
              </p>
            </div>
          </Card>

          {/* 3. Topics learned */}
          <Card glass className="p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Topics Mastered
              </span>
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shadow-sm shadow-purple-500/10">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">
                {studentStats.topicsLearned} Topics
              </div>
              <p className="text-xs text-slate-400 mt-1">Across 5 STEM disciplines</p>
            </div>
          </Card>

          {/* 4. Learning time */}
          <Card glass className="p-5 flex flex-col justify-between hover:border-brand-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Learning Time
              </span>
              <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400 shadow-sm shadow-brand-500/10">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">
                {studentStats.learningTimeHours} Hours
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {studentStats.learningTimeMinutes} mins focused micro-learning
              </p>
            </div>
          </Card>

          {/* 5. Average quiz score */}
          <Card glass className="p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Average Score
              </span>
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white font-display">
                {studentStats.averageQuizScore}%
              </div>
              <p className="text-xs text-emerald-400 mt-1 font-medium">
                High active recall accuracy
              </p>
            </div>
          </Card>
        </div>

        {/* 6. Mastery Overview (Subjects with Progress Bars) */}
        <Card glass className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <CardTitle className="text-lg md:text-xl font-bold font-display">
                Mastery Overview
              </CardTitle>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Comprehension and concept completion by academic subject area:
              </p>
            </div>
            <Badge variant="cyan" size="sm" className="self-start sm:self-center">
              Adaptive Tracking Active
            </Badge>
          </div>

          <div className="space-y-4">
            {subjectMastery.map((item) => (
              <div key={item.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-white">{item.subject}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-xs">{item.count}</span>
                    <span className="font-bold text-white">{item.progress}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 7. Continue Learning Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-accent-cyan" />
              <h2 className="text-lg md:text-xl font-bold text-white font-display">
                Continue Learning
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">2 modules in progress</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueLearning.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6 backdrop-blur-xl hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="cyan" size="sm">
                      {item.category}
                    </Badge>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Active {item.lastVisited}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-brand-300">Next:</span> {item.nextMode} (~{item.estimatedMinutesLeft} min)
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Module Progress</span>
                      <span>{item.progressPercentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan"
                        style={{ width: `${item.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{item.difficulty} Tier</span>
                  <Link href={`/learn`}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="h-4 w-4" />}
                      iconPosition="right"
                      className="text-xs font-semibold"
                    >
                      Resume Module
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Recommended Topics & 9. Weak Areas Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 8. Recommended Topics (Left Column) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-brand-400" />
                <h2 className="text-lg md:text-xl font-bold text-white font-display">
                  Recommended Topics
                </h2>
              </div>
              <Link
                href="/learn"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-0.5"
              >
                <span>Browse All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {filteredRecommended.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        {topic.category}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        {topic.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {topic.estimatedMinutes}m
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.subtitle}
                    </p>
                    <p className="text-[11px] text-accent-cyan font-medium">
                      💡 {topic.reason}
                    </p>
                  </div>

                  <Link href="/learn" className="self-end sm:self-center shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Sparkles className="h-3.5 w-3.5 text-accent-cyan" />}
                      className="text-xs whitespace-nowrap"
                    >
                      Start Concept
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Weak Areas Section (Right Column) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg md:text-xl font-bold text-white font-display">
                  Weak Areas to Reinforce
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">From Socratic Checks</span>
            </div>

            <div className="space-y-3">
              {weakAreas.map((area) => (
                <div
                  key={area.id}
                  className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2.5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      {area.parentTopic}
                    </span>
                    <Badge variant="amber" size="sm">
                      {area.recommendedMode} Mode
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-white">{area.concept}</h4>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-amber-300/80 font-medium text-[11px]">
                      {area.errorRate}
                    </span>
                    <Link href="/learn">
                      <button className="text-xs font-bold text-accent-cyan hover:text-accent-teal flex items-center gap-1 cursor-pointer">
                        <span>Reinforce</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Recommendation Banner */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-bold">
                <Sparkles className="h-4 w-4 text-brand-400" />
                <span>Pedagogy Tip</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reviewing a concept through the <strong>Visual Flowchart</strong> after a missed Socratic question improves recall retention on follow-up evaluations.
              </p>
            </div>
          </div>
        </div>

        {/* 10. Recent Learning Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-400" />
              <h2 className="text-lg md:text-xl font-bold text-white font-display">
                Recent Learning Activity
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Latest completed sessions</span>
          </div>

          <Card glass className="p-0 overflow-hidden">
            <div className="divide-y divide-slate-800/80">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{act.topicTitle}</h4>
                      <Badge variant="default" size="sm">
                        {act.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                      <span>{act.timestamp}</span>
                      <span>•</span>
                      {act.modeCompleted === "all" ? (
                        <span className="text-brand-300 font-sans font-medium flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Tri-Modal Mastered
                        </span>
                      ) : act.modeCompleted === "flowchart" ? (
                        <span className="text-accent-cyan font-sans font-medium flex items-center gap-1">
                          <Network className="h-3 w-3" /> Visual Flowchart
                        </span>
                      ) : act.modeCompleted === "socratic" ? (
                        <span className="text-purple-300 font-sans font-medium flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" /> Socratic Check
                        </span>
                      ) : (
                        <span className="text-amber-300 font-sans font-medium flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Real-World Analogy
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <Badge variant="emerald" size="md" className="font-mono">
                      {act.score}% Score
                    </Badge>
                    <Link href="/learn">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Review
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
