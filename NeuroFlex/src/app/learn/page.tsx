"use client";

import React, { useState, useRef, useEffect } from "react";
import { getMockTopic } from "@/lib/data/sampleTopics";
import { Topic, DifficultyLevel, SocraticQuestion } from "@/types";
import { LearnResponse, LearningPreference, ExplanationDensity, EngineMode } from "@/lib/ai/schema";
import { AnalogyTab } from "@/components/learn/AnalogyTab";
import { VisualTab } from "@/components/learn/VisualTab";
import { SocraticTab } from "@/components/learn/SocraticTab";
import { AdaptiveControls } from "@/components/learn/AdaptiveControls";
import { ExportStudyGuideButton } from "@/components/learn/ExportStudyGuideButton";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Sparkles,
  Network,
  HelpCircle,
  Clock,
  Search,
  RotateCcw,
  AlertCircle,
  Bookmark,
  Share2,
  Loader2,
  BookOpen,
  RefreshCw,
  Zap,
  Info,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sliders,
  TrendingUp,
} from "lucide-react";

const EXAMPLE_TOPICS = [
  "Binary Search",
  "TCP Three-Way Handshake",
  "Neural Networks",
  "Photosynthesis",
  "Quantum Entanglement",
  "Data Structures",
];

interface EngineStatus {
  providerUsed: string;
  isDemoMode: boolean;
  fallbackOccurred: boolean;
}

export default function LearnPage() {
  const { learningPresentation } = useAccessibility();

  const [inputValue, setInputValue] = useState<string>("");
  const [learningPreference, setLearningPreference] = useState<LearningPreference>("mixed");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("Beginner");
  const [density, setDensity] = useState<ExplanationDensity>("balanced");
  const [engineMode, setEngineMode] = useState<EngineMode>("auto");

  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState<"analogy" | "visual" | "socratic">("analogy");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Sync initial tab with accessibility presentation preference
  useEffect(() => {
    if (learningPresentation === "visual") setActiveTab("visual");
    else if (learningPresentation === "analogy") setActiveTab("analogy");
    else if (learningPresentation === "questions") setActiveTab("socratic");
  }, [learningPresentation]);

  // Micro-learning session active timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTopic && !isLoading) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTopic, isLoading]);

  const convertApiResponseToTopic = (data: any): Topic => {
    const capitalizedDiff = (
      typeof data.difficulty === "string"
        ? data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)
        : "Beginner"
    ) as DifficultyLevel;

    const slug =
      data.slug ||
      data.topic?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      "concept";

    let socraticQuestions: SocraticQuestion[] = [];

    if (data.socratic?.questions && data.socratic.questions.length > 0) {
      socraticQuestions = data.socratic.questions.map((q: any, qIdx: number) => ({
        id: `q-${qIdx + 1}`,
        question: q.question,
        options: (q.options || []).map((optText: string, idx: number) => ({
          id: `opt-${idx}`,
          text: optText,
          explanation:
            idx === q.correctAnswer
              ? q.explanation
              : "This choice does not represent the correct causal mechanism.",
          isCorrect: idx === q.correctAnswer,
        })),
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || "Correct conceptual reasoning.",
        difficulty: (
          typeof q.difficulty === "string"
            ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)
            : capitalizedDiff
        ) as DifficultyLevel,
        conceptTested: q.conceptTested || data.topic || "Core Mechanism",
        context: `Checkpoint evaluating ${data.topic}.`,
      }));
    } else if (data.socratic?.question && data.socratic?.options) {
      socraticQuestions = [
        {
          id: "q-1",
          question: data.socratic.question,
          options: data.socratic.options.map((optText: string, idx: number) => ({
            id: `opt-${idx}`,
            text: optText,
            explanation:
              idx === data.socratic.correctAnswer
                ? data.socratic.explanation
                : "This choice does not represent the correct causal mechanism.",
            isCorrect: idx === data.socratic.correctAnswer,
          })),
          correctAnswer: data.socratic.correctAnswer ?? 0,
          explanation: data.socratic.explanation || "Correct conceptual reasoning.",
          difficulty: capitalizedDiff,
          conceptTested: data.socratic.conceptTested || data.topic || "Core Mechanism",
          context: `Checkpoint evaluating ${data.topic}.`,
        },
      ];
    }

    const mapping =
      data.analogy?.mapping?.map((m: any) => ({
        conceptTerm: m.concept || m.conceptTerm || "",
        analogyEquivalent: m.realWorldEquivalent || m.analogyEquivalent || "",
        explanation: m.explanation || m.realWorldEquivalent || "",
      })) ||
      data.analogy?.breakdown ||
      [];

    return {
      id: `topic-${slug}-${Date.now()}`,
      slug,
      title: data.topic,
      subtitle: data.summary || "Synchronized Tri-Modal Learning Representation",
      category: (data.category || "Computer Science") as any,
      difficulty: capitalizedDiff,
      estimatedMinutes: data.estimatedMinutes || 5,
      tags: [
        data.category || "Computer Science",
        data.topic,
        capitalizedDiff,
        data.analogy?.metaphor || data.analogy?.title || "STEM Concept",
      ],
      representations: {
        analogy: {
          title: data.analogy?.title || `${data.topic} Analogy`,
          simpleExplanation:
            data.analogy?.simpleExplanation ||
            data.summary ||
            `Intuitive breakdown of ${data.topic}.`,
          metaphor: data.analogy?.metaphor || data.analogy?.title || "Everyday Metaphor",
          narrative: data.analogy?.story || data.analogy?.narrative || "",
          breakdown: mapping,
          keyTakeaway: data.analogy?.keyTakeaway || "Core conceptual intuition.",
        },
        flowchart: {
          diagramType: "flowchart",
          mermaidCode:
            data.visual?.mermaid ||
            data.flowchart?.mermaidCode ||
            `graph TD\n  A[Start] --> B[${data.topic}]\n  B --> C[Finish]`,
          steps: data.flowchart?.steps || [],
          coreInsight:
            data.visual?.title ||
            data.flowchart?.coreInsight ||
            data.summary ||
            "Visual causal progression of the concept.",
        },
        socratic: {
          questions: socraticQuestions,
          overallSummary:
            data.socratic?.conceptualSynthesis ||
            data.socratic?.overallSummary ||
            data.summary,
        },
      },
    };
  };

  const handleExplainTopic = async (topicName: string) => {
    if (!topicName || !topicName.trim()) {
      setError("Please enter an academic or STEM concept to explain.");
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setError(null);
    setIsLoading(true);
    setSessionSeconds(0);
    setLoadingStep("1. Connecting to Adaptive Learning Engine...");

    const stepTimer1 = setTimeout(() => {
      setLoadingStep("2. Synthesizing Real-World Metaphors & Concept Mappings...");
    }, 450);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep("3. Compiling Live Interactive Mermaid Flowchart...");
    }, 900);

    const stepTimer3 = setTimeout(() => {
      setLoadingStep("4. Generating Socratic Active Recall Checkpoints...");
    }, 1350);

    try {
      const response = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicName.trim(),
          learningPreference,
          difficulty: selectedDifficulty.toLowerCase(),
          density,
          mode: engineMode,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate learning representation.");
      }

      if (data._engine) {
        setEngineStatus({
          providerUsed: data._engine.providerUsed || "Gemini 2.5",
          isDemoMode: Boolean(data._engine.isDemoMode),
          fallbackOccurred: Boolean(data._engine.fallbackOccurred),
        });
      }

      const formattedTopic = convertApiResponseToTopic(data);
      setActiveTopic(formattedTopic);
      setIsLoading(false);

      if (learningPreference === "visual") setActiveTab("visual");
      else if (learningPreference === "question-based") setActiveTab("socratic");
      else setActiveTab("analogy");

      setTimeout(() => {
        if (workspaceRef.current) {
          workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      console.warn("[LearnPage] API call error, applying instant safe mock fallback:", err);

      const fallbackMock = getMockTopic(topicName.trim());
      setActiveTopic(fallbackMock);
      setEngineStatus({
        providerUsed: "Instant Mock Engine (Safe Fallback)",
        isDemoMode: true,
        fallbackOccurred: true,
      });

      setIsLoading(false);

      setTimeout(() => {
        if (workspaceRef.current) {
          workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleChipClick = (topicName: string) => {
    setInputValue(topicName);
    handleExplainTopic(topicName);
  };

  const handleRegenerateForMe = () => {
    if (activeTopic) {
      handleExplainTopic(activeTopic.title);
    }
  };

  const handleClearWorkspace = () => {
    setActiveTopic(null);
    setInputValue("");
    setEngineStatus(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleShare = async () => {
    if (!activeTopic) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const tabs: ("analogy" | "visual" | "socratic")[] = ["analogy", "visual", "socratic"];
    const currentIndex = tabs.indexOf(activeTab);

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex]);
    }
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getDifficultyBadgeVariant = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return "emerald";
      case "intermediate":
        return "brand";
      case "advanced":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Main Search & Topic Prompt Area */}
        <section aria-labelledby="learn-hero-heading" className="mx-auto max-w-3xl text-center space-y-6">
          {/* Header Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-3.5 py-1 text-xs font-medium text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
              <span>AI-Powered Adaptive Engine</span>
            </div>

            <h1
              id="learn-hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight"
            >
              What do you want to learn today?
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Enter any STEM or academic concept. NeuroFlex will synthesize synchronized analogies, flowcharts, and socratic checks for you.
            </p>
          </div>

          {/* Adaptive Preferences Configuration Bar */}
          <div className="text-left">
            <AdaptiveControls
              learningPreference={learningPreference}
              onSelectPreference={setLearningPreference}
              difficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              density={density}
              onSelectDensity={setDensity}
              onRegenerate={activeTopic ? handleRegenerateForMe : undefined}
              isLoading={isLoading}
            />
          </div>

          {/* Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExplainTopic(inputValue);
            }}
            className="space-y-3"
            role="search"
            aria-label="Concept explanation search"
          >
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter a topic such as Binary Search, TCP Handshake, Neural Networks..."
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
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
                  )
                }
                className="px-6 py-3.5 sm:py-3 whitespace-nowrap text-sm font-semibold rounded-xl"
              >
                {isLoading ? "Adapting..." : "Learn with NeuroFlex"}
              </Button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                className="flex items-center gap-2 text-xs text-rose-400 justify-center animate-fadeIn"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Example Topic Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Or try a recommended concept:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1" role="group" aria-label="Suggested concepts">
              {EXAMPLE_TOPICS.map((chip) => {
                const isActive = activeTopic?.title.toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    disabled={isLoading}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500 ${
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
        </section>

        {/* ════════════ LOADING STATES (Never a Blank Screen) ════════════ */}
        {isLoading && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn" role="status" aria-live="polite" aria-busy="true">
            {/* Step Status Banner */}
            <div className="rounded-3xl border border-brand-500/30 bg-slate-900/80 p-6 sm:p-8 text-center space-y-4 backdrop-blur-xl shadow-2xl">
              <div className="relative flex justify-center">
                <div className="h-14 w-14 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-brand-400 animate-pulse" aria-hidden="true" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-display">
                  Synthesizing Synchronized Tri-Modal Curriculum
                </h3>
                <p className="text-xs sm:text-sm text-accent-cyan font-medium animate-pulse">
                  {loadingStep}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400 max-w-lg mx-auto">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-brand-500/30 text-brand-300 font-medium animate-pulse">
                  1. Analogy Model
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-300 font-medium animate-pulse">
                  2. Mermaid Diagram
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-purple-500/30 text-purple-300 font-medium animate-pulse">
                  3. Socratic Recall
                </div>
              </div>
            </div>

            {/* Skeletons Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        )}

        {/* ════════════ EMPTY STATE (Before Topic is Submitted) ════════════ */}
        {!isLoading && !activeTopic && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/30 p-8 sm:p-12 text-center space-y-6 backdrop-blur-md">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
              <BookOpen className="h-8 w-8 text-brand-400" aria-hidden="true" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white font-display">
                Your Adaptive Learning Workspace is Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose your learning preference and difficulty tier above, then select or type any concept.
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
                <p className="text-xs text-slate-400">Active recall question sequences with mastery summaries.</p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ LEARNING WORKSPACE (After Topic is Submitted) ════════════ */}
        {!isLoading && activeTopic && (
          <section
            ref={workspaceRef}
            aria-labelledby="topic-title-heading"
            className="space-y-8 animate-fadeIn"
          >
            {/* Learning Workspace Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  {/* Topic Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getDifficultyBadgeVariant(activeTopic.difficulty)}>
                      {activeTopic.difficulty} Tier
                    </Badge>
                    <Badge variant="cyan" className="capitalize">
                      {learningPreference} Mode
                    </Badge>
                    <Badge variant="purple" className="capitalize">
                      {density} Density
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono ml-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      ~{activeTopic.estimatedMinutes}m est. read
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h2
                    id="topic-title-heading"
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight"
                  >
                    {activeTopic.title}
                  </h2>

                  {/* Topic Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeTopic.subtitle}
                  </p>

                  {/* Key Concepts Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-semibold uppercase text-slate-500 mr-1">
                      Key Concepts:
                    </span>
                    {[
                      activeTopic.category,
                      activeTopic.representations.analogy.metaphor,
                      activeTopic.difficulty,
                    ].map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Header Action Tools */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                  {/* "Regenerate for me" button */}
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleRegenerateForMe}
                    disabled={isLoading}
                    icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />}
                    className="text-xs font-semibold"
                  >
                    Regenerate for me
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    icon={
                      <Bookmark
                        className={`h-4 w-4 ${
                          isBookmarked ? "fill-brand-400 text-brand-400" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    }
                    className="text-xs"
                    aria-label={isBookmarked ? "Remove from bookmarks" : "Save concept to bookmarks"}
                  >
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>

                  <ExportStudyGuideButton topic={activeTopic} />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    icon={<Share2 className="h-4 w-4 text-slate-400" aria-hidden="true" />}
                    className="text-xs"
                    title="Share Concept"
                    aria-label="Copy share link"
                  >
                    {copiedLink ? "Copied!" : "Share"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearWorkspace}
                    icon={<RotateCcw className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    New Search
                  </Button>
                </div>
              </div>

              {/* Accessible Three Primary Tabs (Keyboard Arrow Navigable) */}
              <div className="pt-4 border-t border-slate-800/80">
                <div
                  className="flex space-x-1.5 rounded-2xl bg-slate-950/80 p-1.5 border border-slate-800"
                  role="tablist"
                  aria-label="Three Learning Representations"
                  onKeyDown={handleTabKeyDown}
                >
                  {/* TAB 1: ANALOGY */}
                  <button
                    id="tab-analogy"
                    role="tab"
                    aria-selected={activeTab === "analogy"}
                    aria-controls="panel-analogy"
                    tabIndex={activeTab === "analogy" ? 0 : -1}
                    onClick={() => setActiveTab("analogy")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-400 ${
                      activeTab === "analogy"
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-400/30 ring-1 ring-brand-400/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-brand-300" aria-hidden="true" />
                    <span>ANALOGY</span>
                  </button>

                  {/* TAB 2: VISUAL */}
                  <button
                    id="tab-visual"
                    role="tab"
                    aria-selected={activeTab === "visual"}
                    aria-controls="panel-visual"
                    tabIndex={activeTab === "visual" ? 0 : -1}
                    onClick={() => setActiveTab("visual")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                      activeTab === "visual"
                        ? "bg-accent-cyan/90 text-slate-950 shadow-lg shadow-accent-cyan/20 border border-cyan-300/30 font-extrabold ring-1 ring-cyan-300/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <Network className="h-4 w-4" aria-hidden="true" />
                    <span>VISUAL</span>
                  </button>

                  {/* TAB 3: SOCRATIC */}
                  <button
                    id="tab-socratic"
                    role="tab"
                    aria-selected={activeTab === "socratic"}
                    aria-controls="panel-socratic"
                    tabIndex={activeTab === "socratic" ? 0 : -1}
                    onClick={() => setActiveTab("socratic")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 ${
                      activeTab === "socratic"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 ring-1 ring-purple-400/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4 text-purple-300" aria-hidden="true" />
                    <span>SOCRATIC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Synchronized Tab Content Views */}
            <div className="pt-2">
              {/* TAB PANEL 1: ANALOGY */}
              <div
                id="panel-analogy"
                role="tabpanel"
                aria-labelledby="tab-analogy"
                hidden={activeTab !== "analogy"}
                className={activeTab === "analogy" ? "block animate-fadeIn" : "hidden"}
              >
                <AnalogyTab
                  analogy={activeTopic.representations.analogy}
                  topicTitle={activeTopic.title}
                  difficulty={activeTopic.difficulty}
                  onSwitchTab={setActiveTab}
                />
              </div>

              {/* TAB PANEL 2: VISUAL */}
              <div
                id="panel-visual"
                role="tabpanel"
                aria-labelledby="tab-visual"
                hidden={activeTab !== "visual"}
                className={activeTab === "visual" ? "block animate-fadeIn" : "hidden"}
              >
                <VisualTab flowchart={activeTopic.representations.flowchart} />
              </div>

              {/* TAB PANEL 3: SOCRATIC */}
              <div
                id="panel-socratic"
                role="tabpanel"
                aria-labelledby="tab-socratic"
                hidden={activeTab !== "socratic"}
                className={activeTab === "socratic" ? "block animate-fadeIn" : "hidden"}
              >
                <SocraticTab
                  socratic={activeTopic.representations.socratic}
                  topicTitle={activeTopic.title}
                  topicSlug={activeTopic.slug}
                  category={activeTopic.category}
                  onSwitchTab={setActiveTab}
                  onContinueLearning={handleClearWorkspace}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
