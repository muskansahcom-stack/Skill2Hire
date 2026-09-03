"use client";

import React, { useEffect, useRef, useState, useId, useMemo } from "react";
import mermaid from "mermaid";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Sparkles,
  RefreshCw,
  Network,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface FallbackStep {
  stepNumber: number;
  title: string;
  description?: string;
  phase?: string;
}

export interface MermaidDiagramProps {
  /**
   * The Mermaid syntax to render. Can be passed as `chart`, `code`, or `syntax`.
   */
  chart?: string;
  code?: string;
  syntax?: string;
  title?: string;
  className?: string;
  fallbackSteps?: FallbackStep[];
  theme?: "dark" | "default" | "neutral";
  onRenderSuccess?: () => void;
  onRenderError?: (error: Error) => void;
}

/**
 * Extracts intuitive learning steps from raw Mermaid code when visual rendering fails.
 */
function extractStepsFromMermaid(mermaidCode: string): FallbackStep[] {
  const lines = mermaidCode.split("\n");
  const extracted: FallbackStep[] = [];
  let stepIndex = 1;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    // Ignore diagram declarations, styling, comments, classes
    if (
      !line ||
      line.startsWith("%%") ||
      line.startsWith("classDef") ||
      line.startsWith("class ") ||
      line.startsWith("style ") ||
      line.startsWith("subgraph") ||
      line.startsWith("end") ||
      line.startsWith("flowchart") ||
      line.startsWith("graph") ||
      line.startsWith("sequenceDiagram") ||
      line.startsWith("stateDiagram") ||
      line.startsWith("autonumber") ||
      line.startsWith("Note ")
    ) {
      continue;
    }

    // Match sequence diagram messages: Client->>Server: 1. SYN (seq = 100)
    const seqMatch = line.match(/(?:->>|-->>|->|-->)\s*(.+?):\s*(.+)/);
    if (seqMatch) {
      const [, target, msg] = seqMatch;
      extracted.push({
        stepNumber: stepIndex++,
        title: msg.replace(/["']/g, "").trim(),
        description: `Signal dispatched towards ${target.trim()}`,
      });
      continue;
    }

    // Match flowchart nodes: Node["1. Label"] or Node("Label") or Node{"Decision"}
    const nodeMatch = line.match(/(?:\[|\(|\{)"?([^"\]\)\}]*?)"?(?:\]|\)|\})/);
    if (nodeMatch && nodeMatch[1]) {
      const label = nodeMatch[1].replace(/["']/g, "").trim();
      if (label && !extracted.some((s) => s.title === label)) {
        extracted.push({
          stepNumber: stepIndex++,
          title: label,
          description: "System logic execution transition state",
        });
      }
    }
  }

  // If extraction was too sparse, provide standard default 3 steps
  if (extracted.length < 2) {
    return [
      { stepNumber: 1, title: "Step 1: Input & Initialization", description: "Parameters enter system boundary" },
      { stepNumber: 2, title: "Step 2: Core State Transformation", description: "Logical conditions and transitions evaluated" },
      { stepNumber: 3, title: "Step 3: Verified Output", description: "Terminal state or synchronized connection established" },
    ];
  }

  return extracted.slice(0, 6); // Keep to a clean readable set
}

export function MermaidDiagram({
  chart,
  code,
  syntax,
  title = "Interactive Visual Representation",
  className = "",
  fallbackSteps,
  theme = "dark",
  onRenderSuccess,
  onRenderError,
}: MermaidDiagramProps) {
  const rawMermaid = chart || code || syntax || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const safeId = `mermaid-diag-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [svgContent, setSvgContent] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [renderAttempt, setRenderAttempt] = useState<number>(0);

  // Derive fallback visual steps
  const derivedSteps = useMemo(() => {
    if (fallbackSteps && fallbackSteps.length > 0) return fallbackSteps;
    return extractStepsFromMermaid(rawMermaid);
  }, [fallbackSteps, rawMermaid]);

  // Clean raw mermaid code safely
  const cleanedCode = useMemo(() => {
    let clean = rawMermaid.trim();
    // Remove markdown fences
    clean = clean.replace(/^```(?:mermaid)?\s*/i, "");
    clean = clean.replace(/\s*```$/, "");
    // Remove HTML scripts
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    return clean.trim();
  }, [rawMermaid]);

  useEffect(() => {
    let isMounted = true;

    if (!cleanedCode) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("No diagram syntax provided.");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          useMaxWidth: true,
        },
        sequence: {
          diagramMarginX: 20,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 50,
          boxMargin: 10,
          boxTextMargin: 5,
          noteMargin: 10,
          messageMargin: 35,
          mirrorActors: false,
          useMaxWidth: true,
        },
        themeVariables: {
          darkMode: true,
          background: "#080c14",
          primaryColor: "#4f46e5",
          primaryTextColor: "#f8fafc",
          primaryBorderColor: "#818cf8",
          lineColor: "#64748b",
          secondaryColor: "#06b6d4",
          tertiaryColor: "#10b981",
          nodeBorder: "#475569",
          clusterBkg: "#0f172a99",
          clusterBorder: "#334155",
          edgeLabelBackground: "#1e293b",
          fontSize: "13px",
          actorBkg: "#1e1b4b",
          actorBorder: "#818cf8",
          actorTextColor: "#f8fafc",
          signalColor: "#38bdf8",
          signalTextColor: "#f8fafc",
          labelBoxBkgColor: "#1e293b",
          labelBoxBorderColor: "#475569",
          labelTextColor: "#f8fafc",
          loopTextColor: "#f8fafc",
          noteBorderColor: "#f59e0b",
          noteBkgColor: "#78350f40",
          noteTextColor: "#fef3c7",
        },
      });

      const uniqueRenderId = `${safeId}-${Date.now()}`;

      // Render safely with promise catch
      mermaid
        .render(uniqueRenderId, cleanedCode)
        .then(({ svg }) => {
          if (!isMounted) return;

          // Sanitization for safe SVG string injection
          const safeSvg = svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

          setSvgContent(safeSvg);
          setHasError(false);
          setIsLoading(false);
          onRenderSuccess?.();
        })
        .catch((err: unknown) => {
          if (!isMounted) return;
          console.warn("[MermaidDiagram] Rendering fallback activated:", err);
          const errObj = err instanceof Error ? err : new Error("Invalid Mermaid syntax");
          setHasError(true);
          setErrorMessage(errObj.message || "Failed to parse diagram syntax.");
          setIsLoading(false);
          onRenderError?.(errObj);
        });
    } catch (err: unknown) {
      if (!isMounted) return;
      console.warn("[MermaidDiagram] Initialization fallback activated:", err);
      const errObj = err instanceof Error ? err : new Error("Diagram render initialization failed");
      setHasError(true);
      setErrorMessage(errObj.message);
      setIsLoading(false);
      onRenderError?.(errObj);
    }

    return () => {
      isMounted = false;
    };
  }, [cleanedCode, safeId, theme, renderAttempt, onRenderSuccess, onRenderError]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleRetry = () => {
    setRenderAttempt((prev) => prev + 1);
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl bg-slate-950/95" : "w-full"
      } ${className}`}
    >
      {/* ════════════ TOP CONTROLS TOOLBAR ════════════ */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/70 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </span>
          <span className="hidden sm:inline-block text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60 font-mono">
            Mermaid.js v11 • Vector SVG
          </span>
        </div>

        {/* Viewport Action Controls */}
        <div className="flex items-center gap-1.5">
          {!hasError && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                title="Zoom Out (-20%)"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-[11px] font-mono text-slate-400 w-11 text-center select-none">
                {Math.round(zoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                title="Zoom In (+20%)"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                title="Reset Zoom (100%)"
                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>

              <div className="h-4 w-px bg-slate-800 mx-1" />
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title="Copy Diagram Syntax"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            aria-label="Copy diagram source"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen View"}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            aria-label="Toggle fullscreen"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* ════════════ MAIN DIAGRAM VIEWPORT CANVAS ════════════ */}
      <div
        ref={containerRef}
        className={`relative flex min-h-[340px] items-center justify-center p-4 sm:p-8 overflow-x-auto overflow-y-auto scrollbar-thin transition-all ${
          isExpanded ? "h-[calc(100%-75px)]" : "max-h-[640px]"
        }`}
      >
        {/* 1. Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-slate-400 py-12" role="status" aria-live="polite">
            <div className="relative">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent-cyan animate-pulse" />
              </div>
            </div>
            <span className="text-xs font-medium tracking-wide">
              Rendering interactive visual architecture...
            </span>
          </div>
        )}

        {/* 2. Fallback Visual Step Cards (Step 1 ↓ Step 2 ↓ Step 3) */}
        {!isLoading && hasError && (
          <div className="w-full max-w-xl mx-auto py-4 space-y-5 animate-fadeIn">
            {/* Visual Explanation Banner */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-accent-cyan/30 bg-cyan-950/20 text-accent-cyan">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <Eye className="h-4 w-4 text-accent-cyan shrink-0" />
                <span>Visual explanation</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="h-7 text-xs text-accent-cyan hover:text-white"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Retry
              </Button>
            </div>

            {/* Visual Step Cards (Step 1 ↓ Step 2 ↓ Step 3) */}
            <div className="space-y-3">
              {derivedSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="rounded-2xl border border-brand-500/30 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md flex items-start gap-3.5 hover:border-brand-400/50 transition-all">
                    <div className="h-7 w-7 rounded-xl bg-brand-600/30 border border-brand-500/40 font-mono text-xs font-bold text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">
                          Step {step.stepNumber}: {step.title.replace(/^Step \d+:\s*/i, "")}
                        </h4>
                        {step.phase && (
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {step.phase}
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {idx < derivedSteps.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-accent-cyan">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* 3. Successful SVG Diagram Render */}
        {!isLoading && !hasError && svgContent && (
          <div
            className="transition-transform duration-150 origin-center select-none flex items-center justify-center min-w-full [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:w-auto [&>svg]:mx-auto"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* ════════════ FOOTER METADATA BAR ════════════ */}
      <div className="border-t border-slate-900 px-4 py-2.5 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Layers className="h-3.5 w-3.5 text-accent-cyan" />
          <span>Flowchart, Sequence &amp; Process Diagram Architecture</span>
        </span>
        <span className="hidden sm:inline-block">
          Scroll horizontally on mobile • Use controls to zoom
        </span>
      </div>
    </div>
  );
}

export default MermaidDiagram;
