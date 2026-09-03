"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Layers, Network, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 transform-gpu">
        <div className="h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-brand-600/20 via-accent-cyan/15 to-purple-600/20 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Official Emblem & Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/30 bg-brand-950/70 px-4 py-1.5 text-xs font-medium text-brand-300 backdrop-blur-md shadow-lg shadow-brand-500/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/neuroflex-logo.png"
              alt="NeuroFlex Emblem"
              width={18}
              height={18}
              style={{ width: "18px", height: "18px", minWidth: "18px", maxWidth: "18px" }}
              className="h-4.5 w-4.5 rounded-md object-cover shrink-0"
            />
            <span className="font-semibold text-white">NEUROFLEX</span>
            <span className="text-slate-500">|</span>
            <span className="text-accent-cyan">AI-Powered Adaptive Micro-Learning</span>
          </div>

          {/* Exact Brand Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-display leading-[1.08]">
              One Concept. <br />
              <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-purple-400 bg-clip-text text-transparent">
                Three Ways to Understand.
              </span>
            </h1>

            {/* Exact Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
              Transform difficult academic concepts into visual explanations, real-world analogies and interactive self-checks.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
                className="w-full sm:w-auto text-base px-8 py-3.5 font-bold shadow-xl shadow-brand-500/25"
              >
                Start Learning
              </Button>
            </Link>

            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                icon={<Play className="h-4 w-4 text-accent-cyan" />}
                className="w-full sm:w-auto text-base px-8 py-3.5 hover:border-slate-600"
              >
                Try Demo
              </Button>
            </Link>
          </div>

          {/* 3 Synchronized Pathways Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Layers className="h-4 w-4 text-brand-400" />
              <span className="text-slate-200">1. Real-World Analogy</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Network className="h-4 w-4 text-accent-cyan" />
              <span className="text-slate-200">2. Visual Flowchart</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <HelpCircle className="h-4 w-4 text-purple-400" />
              <span className="text-slate-200">3. Socratic Self-Check</span>
            </div>
          </div>
        </div>

        {/* Live Synchronized Preview Showcase */}
        <div className="mt-12 relative rounded-3xl border border-slate-800/90 bg-slate-900/70 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-5 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-200 font-semibold">
                Synchronized Tri-Modal Learning Representation
              </span>
            </div>
            <Badge variant="cyan">Concept: TCP Three-Way Handshake</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Analogy */}
            <div className="rounded-2xl border border-brand-500/30 bg-brand-950/30 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-brand-300">
                <span>1. Real-World Analogy</span>
                <span className="text-[10px] bg-brand-900/80 px-2 py-0.5 rounded text-brand-200 font-mono">Metaphor</span>
              </div>
              <p className="text-sm font-bold text-white">The Walkie-Talkie Radio Check</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Can you hear me?&rdquo; (SYN), &ldquo;I hear you, can you hear me?&rdquo; (SYN-ACK), &ldquo;Loud and clear!&rdquo; (ACK).
              </p>
            </div>

            {/* Box 2: Flowchart */}
            <div className="rounded-2xl border border-accent-cyan/30 bg-cyan-950/30 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-accent-cyan">
                <span>2. Visual Flowchart</span>
                <span className="text-[10px] bg-cyan-900/80 px-2 py-0.5 rounded text-cyan-200 font-mono">Mermaid.js</span>
              </div>
              <p className="text-sm font-bold text-white">Client ⇄ Server Sequence</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                SYN (Seq=x) → SYN-ACK (Seq=y, Ack=x+1) → ACK (Ack=y+1) establishes full-duplex socket buffer.
              </p>
            </div>

            {/* Box 3: Socratic */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/30 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span>3. Socratic Self-Check</span>
                <span className="text-[10px] bg-purple-900/80 px-2 py-0.5 rounded text-purple-200 font-mono">Active Recall</span>
              </div>
              <p className="text-sm font-bold text-white">Conceptual Checkpoint</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Why is a 2-way handshake insufficient for bidirectional sequence verification?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
