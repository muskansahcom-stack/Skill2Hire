"use client";

import React from "react";
import { HelpCircle, CheckCircle2, XCircle, Award, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ActiveRecallSection() {
  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-900/30 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="purple" size="sm">
            Section 5 • Cognitive Science
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Active Recall Over Passive Reading
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            NeuroFlex doesn&apos;t just present information—it immediately engages mental retrieval loops to solidify neural pathways.
          </p>
        </div>

        {/* Interactive Interactive Demonstration Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Pedagogical Explanation */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">
                Guided Socratic Interrogation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rather than testing memorized definitions, Socratic checkpoints present real-world failure states and architectural trade-offs:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Unrevealed Choice Architecture</h4>
                  <p className="text-xs text-slate-400">Forces authentic recall before displaying correct solutions.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Instant Conceptual Rationale</h4>
                  <p className="text-xs text-slate-400">Explains why misconceptions fail rather than just outputting right/wrong flags.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Misconception Diagnostics</h4>
                  <p className="text-xs text-slate-400">Flags specific weak concepts directly into your Spaced Review queue.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Mock Socratic Question Card */}
          <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <span className="text-xs font-mono text-purple-300 font-bold">Question 2 of 4</span>
              <Badge variant="purple" size="sm">Active Recall Checkpoint</Badge>
            </div>

            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              What happens if a TCP connection attempts data transfer without the final ACK packet?
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 opacity-60">
                A) Data transmits with infinite sequence numbers.
              </div>
              <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-950/40 text-xs text-emerald-200 font-semibold ring-2 ring-emerald-500/50 flex items-center justify-between">
                <span>B) Server remains in SYN-RECEIVED state and drops payload.</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400 opacity-60">
                C) Hardware router permanently reboots.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
              <span className="font-bold text-emerald-300">✓ Correct Recall: </span>
              The socket buffer is unallocated until the 3-way handshake fully transitions to ESTABLISHED.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
