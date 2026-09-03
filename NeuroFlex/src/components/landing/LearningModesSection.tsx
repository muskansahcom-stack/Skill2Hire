"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Network, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LearningModesSection() {
  const modes = [
    {
      id: "analogy",
      badge: "Mode 01",
      title: "Real-World Analogy",
      subtitle: "Grasp the intuitive 'Why' before diving into formulas",
      description:
        "Transforms abstract formulas into vivid, relatable metaphors like airport logistics, hydroelectric dams, or diplomat summits. Bridges new concepts to mental models you already possess.",
      features: [
        "Plain-language contextual narrative",
        "Concept-to-Metaphor mapping table",
        "Clear core intuitive takeaways",
      ],
      borderGradient: "border-brand-500/40",
      accentBg: "bg-brand-950/40",
      icon: Sparkles,
      iconColor: "text-brand-400",
    },
    {
      id: "flowchart",
      badge: "Mode 02",
      title: "Interactive Visual Flowchart",
      subtitle: "See the structural mechanics step-by-step",
      description:
        "Powered by live Mermaid.js rendering, flowcharts map inputs, decisions, transformations, and return states. Zoom, pan, and inspect each node to visualize causal relationships.",
      features: [
        "Dynamic SVG diagrams with zoom & pan",
        "Step-by-step phase breakdowns",
        "Causal state progression insights",
      ],
      borderGradient: "border-accent-cyan/40",
      accentBg: "bg-cyan-950/40",
      icon: Network,
      iconColor: "text-accent-cyan",
    },
    {
      id: "socratic",
      badge: "Mode 03",
      title: "Socratic Self-Check",
      subtitle: "Active recall that challenges mental blind spots",
      description:
        "No mindless multiple-choice quizzes. Socratic checkpoints ask probing 'what if' scenario questions that clarify subtle distinctions and provide deep conceptual feedback.",
      features: [
        "In-depth rationale for both right and wrong answers",
        "Step-by-step Socratic hints",
        "Reflective synthesis prompts",
      ],
      borderGradient: "border-purple-500/40",
      accentBg: "bg-purple-950/40",
      icon: HelpCircle,
      iconColor: "text-purple-400",
    },
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Three Learning Modes
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            A complete tri-modal cognitive toolkit
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            Switch between representations or study all three synchronously depending on your learning preference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className={`rounded-2xl border ${mode.borderGradient} ${mode.accentBg} p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between shadow-lg`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase">
                      {mode.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <Icon className={`h-5 w-5 ${mode.iconColor}`} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">{mode.title}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{mode.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {mode.description}
                  </p>

                  <div className="pt-2 space-y-2 border-t border-slate-800/60">
                    {mode.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6">
                  <Link href="/learn">
                    <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                      Try {mode.title}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
