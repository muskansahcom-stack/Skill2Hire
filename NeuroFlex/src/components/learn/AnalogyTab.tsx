"use client";

import React, { useState } from "react";
import { AnalogyRepresentation } from "@/types";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AnalogyTabProps {
  analogy: AnalogyRepresentation;
}

export function AnalogyTab({ analogy }: AnalogyTabProps) {
  const [isSimplerMode, setIsSimplerMode] = useState<boolean>(false);
  const [currentAnalogyIndex, setCurrentAnalogyIndex] = useState<number>(0);

  const allAnalogies = [
    {
      title: analogy.title,
      metaphor: analogy.metaphor,
      narrative: analogy.narrative,
      breakdown: analogy.breakdown,
      keyTakeaway: analogy.keyTakeaway,
    },
    ...(analogy.alternativeAnalogies || []),
  ];

  const currentAnalogy = allAnalogies[currentAnalogyIndex % allAnalogies.length];
  const hasAlternatives = allAnalogies.length > 1;

  const handleNextAnalogy = () => {
    setCurrentAnalogyIndex((prev) => (prev + 1) % allAnalogies.length);
  };

  const toggleSimplerMode = () => {
    setIsSimplerMode((prev) => !prev);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Bar for Interactivity: "Make it simpler" & "Give another analogy" */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Mode 1: Intuitive Analogy</span>
          </Badge>
          {allAnalogies.length > 1 && (
            <span className="text-xs text-slate-400 font-mono">
              Analogy { (currentAnalogyIndex % allAnalogies.length) + 1 } of { allAnalogies.length }
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* "Make it simpler" button */}
          <Button
            variant={isSimplerMode ? "primary" : "secondary"}
            size="sm"
            onClick={toggleSimplerMode}
            icon={isSimplerMode ? <GraduationCap className="h-4 w-4 text-emerald-400" /> : <Baby className="h-4 w-4 text-amber-400" />}
            className="text-xs transition-all"
          >
            {isSimplerMode ? "Standard Depth" : "Make it simpler"}
          </Button>

          {/* "Give another analogy" button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNextAnalogy}
            icon={<RefreshCw className="h-3.5 w-3.5 text-accent-cyan" />}
            className="text-xs hover:border-accent-cyan/40"
            title="Switch to an alternative real-world analogy"
          >
            Give another analogy
          </Button>
        </div>
      </div>

      {/* 1. Simple Explanation Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
          <BookOpen className="h-4 w-4 text-accent-cyan" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Simple Explanation
          </h3>
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
          {isSimplerMode && analogy.simplerExplanation
            ? analogy.simplerExplanation
            : analogy.simpleExplanation}
        </p>
      </div>

      {/* 2. Real-World Analogy Metaphor Card */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/70 via-slate-900/80 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-accent-cyan/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-300">
              Real-World Analogy
            </span>
            {isSimplerMode && (
              <Badge variant="amber" size="sm">
                ELI5 Mode Active
              </Badge>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            {currentAnalogy.title}
          </h2>

          <div className="rounded-xl border border-brand-500/20 bg-brand-950/40 p-4 text-brand-200 text-sm md:text-base italic leading-relaxed border-l-4 border-l-brand-400">
            &ldquo;{currentAnalogy.metaphor}&rdquo;
          </div>

          <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-3 pt-2">
            {currentAnalogy.narrative.split("\n\n").map((para, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Breakdown Table */}
      {currentAnalogy.breakdown && currentAnalogy.breakdown.length > 0 && (
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent-cyan" />
              <CardTitle>Concept-to-Analogy Mapping</CardTitle>
            </div>
            <p className="text-xs md:text-sm text-slate-400">
              Direct mapping between technical terms and the everyday metaphor:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAnalogy.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all hover:border-accent-cyan/40 hover:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
                    <span className="font-mono text-xs font-semibold text-accent-cyan bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {item.conceptTerm}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-800/40">
                      {item.analogyEquivalent}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. Key Takeaway */}
      <div className="flex items-start gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-md">
        <div className="rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20 shrink-0 text-emerald-400">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
            Key Takeaway
          </h4>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            {currentAnalogy.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
