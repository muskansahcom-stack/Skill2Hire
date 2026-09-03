"use client";

import React, { use } from "react";
import Link from "next/link";
import { getMockTopic } from "@/lib/data/sampleTopics";
import { AnalogyTab } from "@/components/learn/AnalogyTab";
import { VisualTab } from "@/components/learn/VisualTab";
import { SocraticTab } from "@/components/learn/SocraticTab";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Sparkles,
  Network,
  HelpCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function LearningSessionPage({ params }: SessionPageProps) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.sessionId;

  // Derive topic slug from sessionId or fallback
  const topicTitle = sessionId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const topic = getMockTopic(topicTitle);
  const [activeTab, setActiveTab] = React.useState<"analogy" | "visual" | "socratic">("analogy");

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Session Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3">
            <Link href="/learn">
              <Button
                variant="secondary"
                size="sm"
                icon={<ArrowLeft className="h-4 w-4" />}
                className="text-xs"
              >
                Learn Studio
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-xs font-mono text-slate-400">
                Session ID: <strong className="text-white font-semibold">{sessionId}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              Active Curriculum
            </Badge>
            <Badge variant="cyan" size="sm">
              ~{topic.estimatedMinutes} min
            </Badge>
          </div>
        </div>

        {/* Workspace Card Header */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald">{topic.difficulty} Tier</Badge>
              <Badge variant="purple">{topic.category}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
              {topic.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {topic.subtitle}
            </p>
          </div>

          {/* Tri-Modal Tab Selector */}
          <div className="pt-4 border-t border-slate-800/80">
            <div
              className="flex space-x-1.5 rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800"
              role="tablist"
              aria-label="Three Learning Representations"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "analogy"}
                onClick={() => setActiveTab("analogy")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "analogy"
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-400/30 ring-1 ring-brand-400/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Sparkles className="h-4 w-4 text-brand-300" aria-hidden="true" />
                <span>1. Analogy</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "visual"}
                onClick={() => setActiveTab("visual")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "visual"
                    ? "bg-accent-cyan text-slate-950 shadow-lg shadow-accent-cyan/20 border border-cyan-300/30 font-extrabold ring-1 ring-cyan-300/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Network className="h-4 w-4" aria-hidden="true" />
                <span>2. Visual</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "socratic"}
                onClick={() => setActiveTab("socratic")}
                className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "socratic"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 ring-1 ring-purple-400/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-purple-300" aria-hidden="true" />
                <span>3. Socratic</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === "analogy" && <AnalogyTab analogy={topic.representations.analogy} />}
          {activeTab === "visual" && <VisualTab flowchart={topic.representations.flowchart} />}
          {activeTab === "socratic" && (
            <SocraticTab
              socratic={topic.representations.socratic}
              topicTitle={topic.title}
              onSwitchTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}
