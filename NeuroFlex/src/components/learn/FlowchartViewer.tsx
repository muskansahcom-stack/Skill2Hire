"use client";

import React, { useState } from "react";
import { FlowchartRepresentation } from "@/types";
import { MermaidViewer } from "@/components/diagram/MermaidViewer";
import { Network, Layers, Info, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface FlowchartViewerProps {
  flowchart: FlowchartRepresentation;
}

export function FlowchartViewer({ flowchart }: FlowchartViewerProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(
    flowchart.steps.length > 0 ? flowchart.steps[0].id : null
  );

  return (
    <div className="space-y-6">
      {/* Header & Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="gap-1 px-3 py-1">
            <Network className="h-3 w-3 text-accent-cyan" />
            <span>Representation 2 of 3: Visual Flow & State Architecture</span>
          </Badge>
        </div>
        <span className="text-xs text-slate-400">
          Interactive Diagram • Zoomable • Real-Time Engine
        </span>
      </div>

      {/* Main Mermaid Diagram Viewer */}
      <MermaidViewer chart={flowchart.mermaidCode} />

      {/* Synchronized Process Steps Breakdown */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-400" />
            <CardTitle>Step-by-Step State Progression</CardTitle>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Click on any phase to inspect its structural mechanics and role in the whole pipeline:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {flowchart.steps.map((step, idx) => {
              const isSelected = selectedStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-brand-500/80 bg-brand-950/40 shadow-lg shadow-brand-500/10"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Phase {idx + 1} • {step.phase}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">{step.label}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Core Architectural Insight Alert */}
      <div className="flex items-start gap-4 rounded-xl border border-accent-cyan/30 bg-cyan-950/20 p-4 backdrop-blur-md">
        <div className="rounded-lg bg-cyan-500/10 p-2 border border-cyan-500/20 shrink-0 text-accent-cyan">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-cyan-300">System Flow Insight</h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {flowchart.coreInsight}
          </p>
        </div>
      </div>
    </div>
  );
}
