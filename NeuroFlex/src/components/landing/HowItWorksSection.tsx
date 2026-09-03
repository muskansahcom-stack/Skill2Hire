"use client";

import React from "react";
import { Sparkles, Network, HelpCircle, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      stepNumber: "01",
      title: "Input Any Concept or Problem",
      description:
        "Select from curated STEM topics or prompt any academic subject—from quantum qubits to cellular respiration and recursive algorithms.",
      icon: Sparkles,
      color: "from-brand-500 to-brand-600",
    },
    {
      stepNumber: "02",
      title: "Tri-Modal Transformation",
      description:
        "NeuroFlex synchronizes three complementary perspectives: intuitive metaphor narrative, dynamic Mermaid.js flowchart, and reflective questions.",
      icon: Network,
      color: "from-accent-cyan to-accent-teal",
    },
    {
      stepNumber: "03",
      title: "Socratic Self-Verification",
      description:
        "Answer guided checkpoints that explain why plausible misconceptions fail, locking in structural conceptual mastery.",
      icon: HelpCircle,
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent-cyan">
            How It Works
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            One topic. Three synchronized representations.
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            A frictionless learning flow designed to build clarity from intuition to systematic mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-700 group-hover:text-slate-500 font-mono transition-colors">
                      {step.stepNumber}
                    </span>
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg shadow-brand-500/10`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center text-xs font-semibold text-accent-cyan gap-1">
                  <span>Explore in Learn Studio</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
