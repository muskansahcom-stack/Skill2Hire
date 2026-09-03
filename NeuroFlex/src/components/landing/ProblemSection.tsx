"use client";

import React from "react";
import { AlertCircle, FileText, BrainCircuit, RefreshCw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ProblemSection() {
  const problems = [
    {
      icon: FileText,
      badge: "Wall of Text",
      title: "Dense Academic Textbooks",
      description:
        "Students are confronted with abstract mathematical notation and hundreds of pages of unsegmented text, causing immediate cognitive overload.",
    },
    {
      icon: BrainCircuit,
      badge: "False Confidence",
      title: "The Illusion of Explanatory Depth",
      description:
        "Passive reading creates a deceptive feeling of mastery. When tested on core mechanics, conceptual gaps immediately surface.",
    },
    {
      icon: RefreshCw,
      badge: "Ineffective Habits",
      title: "Passive Highlighting & Rereading",
      description:
        "Standard study methods focus on rote consumption instead of multi-sensory dual-coding and active conceptual retrieval.",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/40 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="rose" size="sm">
            Section 1 • The Learning Crisis
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Why Difficult Concepts Don&apos;t Stick
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Conventional STEM and academic education relies on single-mode, text-heavy explanations that fail to engage how the brain constructs mental models.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/40 p-6 md:p-8 space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
                    {prob.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display">{prob.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {prob.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
