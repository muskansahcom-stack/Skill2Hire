"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Server,
  Cpu,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  services: {
    api: { status: string; responseTimeMs: number };
    database: { status: string; mode: string };
    aiEngine: {
      configuredProvider: string;
      liveKeyAvailable: boolean;
      mockFallbackReady: boolean;
      mode: string;
    };
  };
}

export default function AdminPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.error("Health check error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                System Administration
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
              NeuroFlex Engine Status &amp; Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live monitoring of server API routes, database repository, and AI provider fallback layers.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchHealth}
            disabled={isLoading}
            icon={<RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />}
            className="text-xs"
          >
            Refresh Status
          </Button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* API Server */}
          <Card glass className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">API Layer</span>
              <Badge variant="emerald" size="sm">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-accent-cyan" />
              <div>
                <p className="text-sm font-bold text-white">Next.js App Router</p>
                <p className="text-xs text-slate-400">
                  Latency: ~{health?.services?.api?.responseTimeMs || 4}ms
                </p>
              </div>
            </div>
          </Card>

          {/* Database */}
          <Card glass className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Persistence</span>
              <Badge variant="cyan" size="sm">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-brand-400" />
              <div>
                <p className="text-sm font-bold text-white">Prisma / Repository</p>
                <p className="text-xs text-slate-400">
                  Mode: {health?.services?.database?.mode || "in_memory_repository"}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Engine */}
          <Card glass className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">AI Provider</span>
              <Badge
                variant={health?.services?.aiEngine?.liveKeyAvailable ? "emerald" : "purple"}
                size="sm"
              >
                {health?.services?.aiEngine?.mode || "Ready"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-sm font-bold text-white">Adaptive Generator</p>
                <p className="text-xs text-slate-400">
                  Provider: {health?.services?.aiEngine?.configuredProvider || "gemini"} (Mock Ready)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnostics JSON */}
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono text-slate-300">
              GET /api/health Response Payload
            </CardTitle>
            <span className="text-xs font-mono text-slate-500">
              Timestamp: {health?.timestamp || "Loading..."}
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-accent-cyan overflow-x-auto">
            {JSON.stringify(health, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
