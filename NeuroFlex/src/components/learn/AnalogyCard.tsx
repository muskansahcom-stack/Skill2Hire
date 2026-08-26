"use client";

import React from "react";
import { AnalogyRepresentation } from "@/types";
import { Sparkles, Compass, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AnalogyCardProps {
  analogy: AnalogyRepresentation;
}

export function AnalogyCard({ analogy }: AnalogyCardProps) {
  return (
    <div className="space-y-6">
      {/* Hero Metaphor Card */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-950/60 via-slate-900/80 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-accent-cyan/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="gap-1 px-3 py-1">
              <Sparkles className="h-3 w-3 text-brand-400" />
              <span>Representation 1 of 3: Intuitive Metaphor</span>
            </Badge>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            {analogy.title}
          </h2>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-brand-200 text-sm md:text-base italic leading-relaxed border-l-4 border-l-brand-500">
            &ldquo;{analogy.metaphor}&rdquo;
          </div>

          <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-3 pt-2">
            {analogy.narrative.split("\n\n").map((para, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Conceptual Mapping Breakdown */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-accent-cyan" />
            <CardTitle>Concept-to-Analogy Mapping</CardTitle>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            How each technical mechanic corresponds directly to everyday concepts you already understand:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analogy.breakdown.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all duration-200 hover:border-accent-cyan/40 hover:bg-slate-900/70"
              >
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
                  <span className="font-mono text-xs font-semibold text-accent-cyan bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {item.conceptTerm}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-accent-cyan transition-colors" />
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

      {/* Core Key Takeaway Alert */}
      <div className="flex items-start gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-md">
        <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20 shrink-0 text-emerald-400">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-emerald-300">Core Intuitive Takeaway</h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {analogy.keyTakeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
