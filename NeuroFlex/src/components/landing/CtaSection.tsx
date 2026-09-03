"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 to-[#04060a] relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-brand-600/15 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          <Badge variant="cyan" size="md">
            Section 8 • Ready to Master Any Concept?
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-[1.1]">
            Experience Adaptive Micro-Learning Today
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Enter any difficult STEM concept and see it transformed instantly into a synchronized analogy, flowchart, and active recall checkpoint.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/learn" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
              className="w-full sm:w-auto text-base px-8 py-3.5 font-bold shadow-2xl shadow-brand-500/30"
            >
              Start Learning Now
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              icon={<Play className="h-4 w-4 text-accent-cyan" />}
              className="w-full sm:w-auto text-base px-8 py-3.5 hover:border-slate-600"
            >
              ⚡ Explore Demo Student Portal
            </Button>
          </Link>
        </div>

        {/* Quick Launch Concept Chips */}
        <div className="pt-6 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Instant starter concepts:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "TCP Three-Way Handshake",
              "Binary Search",
              "Photosynthesis",
              "Neural Networks",
              "Quantum Entanglement",
            ].map((chip) => (
              <Link key={chip} href="/learn">
                <span className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-brand-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                  {chip}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
