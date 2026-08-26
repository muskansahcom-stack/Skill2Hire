import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, CheckCircle2, Network, HelpCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background glowing gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 transform-gpu">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-brand-600/20 to-accent-cyan/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-3.5 py-1 text-xs font-medium text-brand-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan animate-pulse" />
            <span>AI-Powered Adaptive Micro-Learning</span>
          </div>

          {/* Exact Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
            Learn differently. <br />
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-teal bg-clip-text text-transparent">
              Understand deeply.
            </span>
          </h1>

          {/* Exact Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            NeuroFlex transforms complex concepts into visual explanations, real-world analogies and interactive questions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="w-full sm:w-auto text-base px-8 py-3.5"
              >
                Start Learning
              </Button>
            </Link>

            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={<Play className="h-4 w-4 text-accent-cyan" />}
                className="w-full sm:w-auto text-base px-8 py-3.5"
              >
                Explore Demo
              </Button>
            </Link>
          </div>

          {/* Synchronized Modes Quick Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-brand-400" />
              <span>1. Real-World Analogy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Network className="h-4 w-4 text-accent-cyan" />
              <span>2. Interactive Visual Flowchart</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-purple-400" />
              <span>3. Socratic Self-Check</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="mt-14 relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-300">Live Synchronized Tri-Modal View</span>
            </div>
            <Badge variant="brand">Active Concept: Transformer Attention</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Analogy */}
            <div className="rounded-xl border border-brand-500/30 bg-brand-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-300">
                <span>1. Real-World Analogy</span>
                <span className="text-[10px] bg-brand-900/60 px-1.5 py-0.5 rounded">Metaphor</span>
              </div>
              <p className="text-xs font-medium text-white">The Diplomatic Cocktail Party</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Query is what you ask, Key is each diplomat&apos;s badge, and Value is their advice.
              </p>
            </div>

            {/* Box 2: Flowchart */}
            <div className="rounded-xl border border-accent-cyan/30 bg-cyan-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-accent-cyan">
                <span>2. Visual Flowchart</span>
                <span className="text-[10px] bg-cyan-900/60 px-1.5 py-0.5 rounded">Mermaid.js</span>
              </div>
              <p className="text-xs font-medium text-white">Q · Kᵀ → Softmax → Weighted Sum</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Live interactive flowcharts map mathematical transformations directly into clear visual pathways.
              </p>
            </div>

            {/* Box 3: Socratic */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                <span>3. Socratic Self-Check</span>
                <span className="text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded">Active Recall</span>
              </div>
              <p className="text-xs font-medium text-white">Conceptual Checkpoint</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Why divide by √d_k? Guided choices verify true mental models over rote memorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
