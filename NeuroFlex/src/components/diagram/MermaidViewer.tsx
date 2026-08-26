"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MermaidViewerProps {
  chart: string;
  className?: string;
  theme?: "dark" | "default" | "neutral";
}

export function MermaidViewer({ chart, className, theme = "dark" }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const safeId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === "dark" ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "Inter, system-ui, sans-serif",
        themeVariables: {
          darkMode: true,
          background: "#090d16",
          primaryColor: "#4f46e5",
          primaryTextColor: "#f8fafc",
          primaryBorderColor: "#818cf8",
          lineColor: "#64748b",
          secondaryColor: "#06b6d4",
          tertiaryColor: "#10b981",
          nodeBorder: "#475569",
          clusterBkg: "#0f172a80",
          clusterBorder: "#334155",
          edgeLabelBackground: "#1e293b",
          fontSize: "13px",
        },
      });

      setIsRendering(true);
      setError(null);

      // Render chart
      const renderId = `${safeId}-${Date.now()}`;
      mermaid
        .render(renderId, chart)
        .then(({ svg }) => {
          if (isMounted) {
            setSvgContent(svg);
            setError(null);
            setIsRendering(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error("Mermaid render error:", err);
            setError("Could not render diagram. Showing raw flowchart definition.");
            setIsRendering(false);
          }
        });
    } catch (err: unknown) {
      if (isMounted) {
        setError(err instanceof Error ? err.message : "Diagram rendering error");
        setIsRendering(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [chart, safeId, theme]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-md overflow-hidden transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl bg-slate-950/95" : "w-full"
      } ${className || ""}`}
    >
      {/* Header bar with controls */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-cyan animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Logic Flow
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-[11px] font-mono text-slate-400 w-10 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            title="Zoom In"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copy Diagram Source"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div
        ref={containerRef}
        className={`relative flex min-h-[360px] items-center justify-center p-6 overflow-auto transition-all ${
          isExpanded ? "h-[calc(100%-50px)]" : "max-h-[600px]"
        }`}
      >
        {isRendering && (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
            <span className="text-xs">Generating visual representation...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 max-w-md text-center p-6 bg-rose-950/20 border border-rose-900/40 rounded-xl">
            <AlertCircle className="h-8 w-8 text-rose-400" />
            <p className="text-sm text-rose-200">{error}</p>
            <pre className="text-left w-full overflow-x-auto text-[11px] font-mono p-3 bg-slate-900 rounded-lg text-slate-300">
              {chart}
            </pre>
          </div>
        )}

        {!isRendering && !error && svgContent && (
          <div
            className="transition-transform duration-150 origin-center select-none flex items-center justify-center w-full"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Footer hint */}
      <div className="border-t border-slate-900 px-4 py-2 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500">
        <span>Mermaid.js Dynamic Render Engine</span>
        <span>Drag / Zoom to inspect complex branch paths</span>
      </div>
    </div>
  );
}
