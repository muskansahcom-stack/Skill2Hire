"use client";

import React, { useState } from "react";
import { AnalogyRepresentation, AnalogyVariation } from "@/types";
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  Compass,
  ArrowRight,
  RefreshCw,
  Baby,
  GraduationCap,
  Layers,
  Network,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Volume2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { VoiceNarrationButton } from "./VoiceNarrationButton";

interface AnalogyTabProps {
  analogy: AnalogyRepresentation;
  topicTitle?: string;
  difficulty?: string;
  onSwitchTab?: (tab: "analogy" | "visual" | "socratic") => void;
}

export function AnalogyTab({
  analogy,
  topicTitle,
  difficulty = "Beginner",
  onSwitchTab,
}: AnalogyTabProps) {
  const [isSimplerMode, setIsSimplerMode] = useState<boolean>(false);
  const [currentAnalogyIndex, setCurrentAnalogyIndex] = useState<number>(0);
  const [isGeneratingSimpler, setIsGeneratingSimpler] = useState<boolean>(false);
  const [isGeneratingAlternative, setIsGeneratingAlternative] = useState<boolean>(false);
  const [generatedSimplerText, setGeneratedSimplerText] = useState<string | null>(null);
  const [extraAnalogies, setExtraAnalogies] = useState<AnalogyVariation[]>([]);

  const allAnalogies: AnalogyVariation[] = [
    {
      title: analogy.title,
      metaphor: analogy.metaphor,
      narrative: analogy.narrative,
      breakdown: analogy.breakdown,
      keyTakeaway: analogy.keyTakeaway,
    },
    ...(analogy.alternativeAnalogies || []),
    ...extraAnalogies,
  ];

  const currentAnalogy = allAnalogies[currentAnalogyIndex % allAnalogies.length];

  // Dynamic in-place "Make It Simpler" (ELI5) handler
  const handleMakeItSimpler = async () => {
    if (isSimplerMode) {
      setIsSimplerMode(false);
      return;
    }

    if (analogy.simplerExplanation || generatedSimplerText) {
      setIsSimplerMode(true);
      return;
    }

    if (!topicTitle) {
      setIsSimplerMode(true);
      return;
    }

    setIsGeneratingSimpler(true);
    try {
      const response = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTitle,
          difficulty: "beginner",
          preference: "analogy",
          density: "simple",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analogy?.story) {
          setGeneratedSimplerText(data.analogy.story);
        }
      }
    } catch (e) {
      console.warn("Could not fetch remote simpler analogy, using local adaptation:", e);
    } finally {
      setIsGeneratingSimpler(false);
      setIsSimplerMode(true);
    }
  };

  // Dynamic in-place "Give Another Analogy" handler
  const handleGiveAnotherAnalogy = async () => {
    // If we already have multiple curated analogies, cycle through them
    if (allAnalogies.length > 1 && currentAnalogyIndex < allAnalogies.length - 1) {
      setCurrentAnalogyIndex((prev) => prev + 1);
      return;
    }

    if (!topicTitle) {
      setCurrentAnalogyIndex((prev) => (prev + 1) % allAnalogies.length);
      return;
    }

    setIsGeneratingAlternative(true);
    try {
      const response = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicTitle,
          difficulty: difficulty.toLowerCase(),
          preference: "example-based",
          density: "balanced",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analogy) {
          const newAnalogy: AnalogyVariation = {
            title: data.analogy.title || `Alternative Analogy for ${topicTitle}`,
            metaphor: data.analogy.metaphor || data.analogy.title,
            narrative: data.analogy.story,
            breakdown: (data.analogy.mapping || []).map((m: any) => ({
              conceptTerm: m.concept || m.conceptTerm,
              analogyEquivalent: m.realWorldEquivalent || m.analogyEquivalent,
              explanation: m.explanation || m.realWorldEquivalent,
            })),
            keyTakeaway: data.analogy.keyTakeaway,
          };

          setExtraAnalogies((prev) => [...prev, newAnalogy]);
          setCurrentAnalogyIndex(allAnalogies.length); // switch to newly appended
        }
      } else {
        setCurrentAnalogyIndex((prev) => (prev + 1) % allAnalogies.length);
      }
    } catch (e) {
      console.warn("Failed to fetch another analogy, cycling existing:", e);
      setCurrentAnalogyIndex((prev) => (prev + 1) % allAnalogies.length);
    } finally {
      setIsGeneratingAlternative(false);
    }
  };

  const activeNarrative = isSimplerMode
    ? generatedSimplerText || analogy.simplerExplanation || currentAnalogy.narrative
    : currentAnalogy.narrative;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ════════════ TOP ACTION BAR ════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2.5">
          <Badge variant="brand" className="gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            <span>Analogy Mode</span>
          </Badge>
          {allAnalogies.length > 1 && (
            <span className="text-xs text-slate-400 font-mono">
              Variation {(currentAnalogyIndex % allAnalogies.length) + 1} of {allAnalogies.length}
            </span>
          )}
          {isSimplerMode && (
            <Badge variant="amber" size="sm" className="text-[11px]">
              ELI5 Simple Mode Active
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Narration */}
          <VoiceNarrationButton
            textToRead={`${currentAnalogy.title}. ${currentAnalogy.metaphor}. ${activeNarrative}. Key Takeaway: ${currentAnalogy.keyTakeaway}`}
            label="Listen"
          />

          {/* [Make It Simpler] */}
          <Button
            variant={isSimplerMode ? "primary" : "secondary"}
            size="sm"
            onClick={handleMakeItSimpler}
            disabled={isGeneratingSimpler}
            icon={
              isGeneratingSimpler ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isSimplerMode ? (
                <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Baby className="h-3.5 w-3.5 text-amber-400" />
              )
            }
            className="text-xs font-semibold"
          >
            {isGeneratingSimpler
              ? "Simplifying..."
              : isSimplerMode
              ? "Standard Depth"
              : "Make It Simpler"}
          </Button>

          {/* [Give Another Analogy] */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGiveAnotherAnalogy}
            disabled={isGeneratingAlternative}
            icon={
              isGeneratingAlternative ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-cyan" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 text-accent-cyan" />
              )
            }
            className="text-xs font-semibold hover:border-accent-cyan/40"
          >
            {isGeneratingAlternative ? "Synthesizing..." : "Give Another Analogy"}
          </Button>

          {/* [Show Visual] */}
          {onSwitchTab && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchTab("visual")}
              icon={<Network className="h-3.5 w-3.5 text-accent-cyan" />}
              className="text-xs font-semibold hover:text-accent-cyan hover:border-cyan-500/40"
            >
              Show Visual
            </Button>
          )}

          {/* [Test Me] */}
          {onSwitchTab && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchTab("socratic")}
              icon={<HelpCircle className="h-3.5 w-3.5 text-purple-400" />}
              className="text-xs font-semibold hover:text-purple-300 hover:border-purple-500/40"
            >
              Test Me
            </Button>
          )}
        </div>
      </div>

      {/* ════════════ REAL-WORLD STORY CARD ════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-950/60 via-slate-900/90 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Analogy Title */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
              Real-World Situation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              {currentAnalogy.title}
            </h3>
          </div>

          {/* "Think of it like..." Quote Callout */}
          <div className="rounded-2xl border border-brand-500/30 bg-brand-950/50 p-4 sm:p-5 text-brand-200 text-sm sm:text-base leading-relaxed border-l-4 border-l-brand-400 font-medium">
            <span className="block text-xs font-bold uppercase tracking-wider text-brand-300 mb-1">
              Think of it like...
            </span>
            &ldquo;{currentAnalogy.metaphor}&rdquo;
          </div>

          {/* Real-World Story Narrative */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
            {activeNarrative.split("\n\n").map((paragraph, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════ CONCEPT MAPPING (Real World → Academic Concept) ════════════ */}
      {currentAnalogy.breakdown && currentAnalogy.breakdown.length > 0 && (
        <Card glass className="border-slate-800 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-accent-cyan" />
                <CardTitle className="text-lg text-white font-display">Concept Mapping</CardTitle>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
                <span className="text-brand-300 font-semibold">Real world</span>
                <ArrowRight className="h-3.5 w-3.5 text-accent-cyan" />
                <span className="text-accent-cyan font-semibold">Academic concept</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 pt-1">
              Direct mapping between elements of the everyday situation and underlying theoretical mechanics:
            </p>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAnalogy.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all duration-200 hover:border-accent-cyan/40 hover:bg-slate-900/80 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/70">
                    <span className="text-xs font-bold text-brand-300 bg-brand-950/80 px-2.5 py-1 rounded-lg border border-brand-800/50">
                      {item.analogyEquivalent}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-accent-cyan bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/50 font-mono">
                      {item.conceptTerm}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ════════════ CONCISE KEY TAKEAWAY ════════════ */}
      <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 backdrop-blur-md shadow-lg">
        <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20 shrink-0 text-emerald-400">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider">
            Key Takeaway
          </h4>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
            {currentAnalogy.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
