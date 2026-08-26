"use client";

import React, { useState, useEffect, useRef } from "react";
import { getMockTopic, sampleTopics } from "@/lib/data/sampleTopics";
import { Topic } from "@/types";
import { AnalogyTab } from "@/components/learn/AnalogyTab";
import { VisualTab } from "@/components/learn/VisualTab";
import { SocraticTab } from "@/components/learn/SocraticTab";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Network,
  HelpCircle,
  Clock,
  Search,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  Share2,
  Loader2,
  BookOpen,
} from "lucide-react";

const EXAMPLE_TOPICS = [
  "TCP Three-Way Handshake",
  "Binary Search",
  "Neural Networks",
  "Photosynthesis",
  "Quantum Entanglement",
  "Stack Data Structure",
];

export default function LearnPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState<"analogy" | "visual" | "socratic">("analogy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleExplainTopic = (topicQuery: string) => {
    const trimmed = topicQuery.trim();
    if (!trimmed) {
      setError("Please enter a concept name to generate learning representations.");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStep("Analyzing academic concept...");

    // Simulated staggered loading steps for realistic micro-learning pipeline
    setTimeout(() => {
      setLoadingStep("Synthesizing real-world analogy & mental model...");
    }, 400);

    setTimeout(() => {
      setLoadingStep("Constructing dynamic Mermaid.js flowchart...");
    }, 800);

    setTimeout(() => {
      setLoadingStep("Formulating Socratic checkpoints...");
    }, 1200);

    setTimeout(() => {
      const topicData = getMockTopic(trimmed);
      setActiveTopic(topicData);
      setInputValue(topicData.title);
      setIsLoading(false);
      setLoadingStep("");

      // Smooth scroll down to learning workspace
      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 1600);
  };

  const handleChipClick = (chip: string) => {
    setInputValue(chip);
    handleExplainTopic(chip);
  };

  const handleClearWorkspace = () => {
    setActiveTopic(null);
    setInputValue("");
    setError(null);
    inputRef.current?.focus();
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (e) {
        console.error("Clipboard error", e);
      }
    }
  };

  const getDifficultyBadgeVariant = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "emerald";
      case "Intermediate":
        return "brand";
      case "Advanced":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Search & Topic Prompt Area */}
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-3.5 py-1 text-xs font-medium text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
              <span>Adaptive Micro-Learning Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
              What do you want to learn today?
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Enter any STEM or academic concept. NeuroFlex will transform it into three synchronized representations.
            </p>
          </div>

          {/* Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExplainTopic(inputValue);
            }}
            className="space-y-3"
          >
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter a concept such as TCP Three-Way Handshake, Binary Search, Photosynthesis..."
                  className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none"
                  aria-label="Academic concept to learn"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                icon={
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )
                }
                className="px-6 py-3.5 sm:py-3 whitespace-nowrap text-sm font-semibold rounded-xl"
              >
                {isLoading ? "Generating..." : "Explain with NeuroFlex"}
              </Button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 justify-center animate-fadeIn">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Example Topic Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Or try a recommended concept:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {EXAMPLE_TOPICS.map((chip) => {
                const isActive = activeTopic?.title.toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    disabled={isLoading}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                      isActive
                        ? "bg-brand-600/90 text-white border-brand-400/40 shadow-sm shadow-brand-500/30"
                        : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading State Spinner & Pipeline Steps */}
        {isLoading && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-brand-500/30 bg-slate-900/80 p-8 text-center space-y-5 backdrop-blur-xl shadow-2xl animate-fadeIn">
            <div className="relative flex justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-brand-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white font-display">
                Generating Tri-Modal Explanations
              </h3>
              <p className="text-xs sm:text-sm text-accent-cyan font-medium animate-pulse">
                {loadingStep}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                1. Analogy Model
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                2. Mermaid Diagram
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                3. Socratic Questions
              </div>
            </div>
          </div>
        )}

        {/* Empty State (Before Topic is Submitted) */}
        {!isLoading && !activeTopic && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 sm:p-12 text-center space-y-6 backdrop-blur-md">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
              <BookOpen className="h-8 w-8 text-brand-400" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white font-display">
                Your Learning Workspace is Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Select an example topic chip above or type any subject to reveal the 3 synchronized representations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4 border-t border-slate-800/60">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="text-xs font-semibold text-brand-400">1. ANALOGY</span>
                <p className="text-xs text-slate-400">Vivid everyday metaphors with ELI5 simpler modes.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="text-xs font-semibold text-accent-cyan">2. VISUAL</span>
                <p className="text-xs text-slate-400">Interactive live Mermaid.js flowcharts with zoom.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                <span className="text-xs font-semibold text-purple-400">3. SOCRATIC</span>
                <p className="text-xs text-slate-400">4-choice guided active recall checkpoints.</p>
              </div>
            </div>
          </div>
        )}

        {/* Learning Workspace (After Topic is Submitted) */}
        {!isLoading && activeTopic && (
          <div ref={workspaceRef} className="space-y-8 animate-fadeIn">
            {/* Learning Workspace Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-3xl">
                  {/* Topic Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getDifficultyBadgeVariant(activeTopic.difficulty)}>
                      {activeTopic.difficulty}
                    </Badge>
                    <Badge variant="cyan">{activeTopic.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono ml-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Estimated learning time: ~{activeTopic.estimatedMinutes} min
                    </span>
                  </div>

                  {/* Topic Name */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
                    {activeTopic.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeTopic.subtitle}
                  </p>
                </div>

                {/* Header Action Tools */}
                <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    icon={
                      <Bookmark
                        className={`h-4 w-4 ${
                          isBookmarked ? "fill-brand-400 text-brand-400" : "text-slate-400"
                        }`}
                      />
                    }
                    className="text-xs"
                  >
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    icon={<Share2 className="h-4 w-4 text-slate-400" />}
                    className="text-xs"
                    title="Share Concept"
                  >
                    {copiedLink ? "Copied!" : "Share"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearWorkspace}
                    icon={<RotateCcw className="h-3.5 w-3.5 text-slate-400" />}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    New Search
                  </Button>
                </div>
              </div>

              {/* Three Primary Tabs */}
              <div className="pt-4 border-t border-slate-800/80">
                <div
                  className="flex space-x-1.5 rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800"
                  role="tablist"
                  aria-label="Three Learning Modes"
                >
                  {/* TAB 1: ANALOGY */}
                  <button
                    role="tab"
                    aria-selected={activeTab === "analogy"}
                    onClick={() => setActiveTab("analogy")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                      activeTab === "analogy"
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-400/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-brand-300" />
                    <span>1. ANALOGY</span>
                  </button>

                  {/* TAB 2: VISUAL */}
                  <button
                    role="tab"
                    aria-selected={activeTab === "visual"}
                    onClick={() => setActiveTab("visual")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 ${
                      activeTab === "visual"
                        ? "bg-accent-cyan/90 text-slate-950 shadow-lg shadow-accent-cyan/20 border border-cyan-300/30 font-extrabold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <Network className="h-4 w-4" />
                    <span>2. VISUAL</span>
                  </button>

                  {/* TAB 3: SOCRATIC */}
                  <button
                    role="tab"
                    aria-selected={activeTab === "socratic"}
                    onClick={() => setActiveTab("socratic")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      activeTab === "socratic"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 text-purple-300" />
                    <span>3. SOCRATIC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Panels Content */}
            <div>
              {activeTab === "analogy" && (
                <AnalogyTab analogy={activeTopic.representations.analogy} />
              )}
              {activeTab === "visual" && (
                <VisualTab flowchart={activeTopic.representations.flowchart} />
              )}
              {activeTab === "socratic" && (
                <SocraticTab
                  socratic={activeTopic.representations.socratic}
                  topicTitle={activeTopic.title}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
