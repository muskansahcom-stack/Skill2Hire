"use client";

import React, { useState } from "react";
import { FlowchartRepresentation } from "@/types";
import { MermaidDiagram } from "@/components/learning/MermaidDiagram";
import { Network, Layers, Info, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface VisualTabProps {
  flowchart: FlowchartRepresentation;
}

export function VisualTab({ flowchart }: VisualTabProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(
    flowchart.steps.length > 0 ? flowchart.steps[0].id : null
  );

  const fallbackSteps = flowchart.steps.map((step, idx) => ({
    stepNumber: idx + 1,
    title: step.label,
    description: step.description,
    phase: step.phase,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <Network className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Mode 2: Interactive Visual Architecture</span>
          </Badge>
        </div>
        <span className="text-xs text-slate-400">
          Rendered dynamically with Mermaid.js • Zoom, Pan &amp; Horizontal Scroll
        </span>
      </div>

      {/* Production Mermaid Diagram Component */}
      <MermaidDiagram
        chart={flowchart.mermaidCode}
        title="Interactive System Diagram"
        fallbackSteps={fallbackSteps}
      />

      {/* Synchronized Process Step Inspection */}
      {flowchart.steps && flowchart.steps.length > 0 && (
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-400" />
              <CardTitle>Step-by-Step Architecture Progression</CardTitle>
            </div>
            <p className="text-xs md:text-sm text-slate-400">
              Select any stage below to inspect its operational role in the overall system:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {flowchart.steps.map((step, idx) => {
                const isSelected = selectedStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setSelectedStep(step.id)}
                    className={`text-left cursor-pointer rounded-xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 ${
                      isSelected
                        ? "border-accent-cyan bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-accent-cyan/30"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Phase {idx + 1} • {step.phase}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{step.label}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Architectural Insight Alert */}
      <div className="flex items-start gap-4 rounded-xl border border-accent-cyan/30 bg-cyan-950/20 p-5 backdrop-blur-md">
        <div className="rounded-lg bg-cyan-500/10 p-2.5 border border-cyan-500/20 shrink-0 text-accent-cyan">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
            System Flow Insight
          </h4>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {flowchart.coreInsight}
          </p>
        </div>
      </div>
    </div>
  );
}
