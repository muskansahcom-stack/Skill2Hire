"use client";

import React from "react";
import { LearningPreference, ExplanationDensity } from "@/lib/ai/schema";
import { DifficultyLevel } from "@/types";
import { SlidersHorizontal, Eye, BookOpen, HelpCircle, Layers, Gauge, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdaptiveControlsProps {
  learningPreference: LearningPreference;
  onSelectPreference: (pref: LearningPreference) => void;
  difficulty: DifficultyLevel;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  density: ExplanationDensity;
  onSelectDensity: (density: ExplanationDensity) => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  compact?: boolean;
}

const PREFERENCE_OPTIONS: { id: LearningPreference; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "mixed", label: "Mixed", icon: Layers, desc: "Balanced across all three representations" },
  { id: "visual", label: "Visual", icon: Eye, desc: "Prioritizes diagrams & step-by-step causality" },
  { id: "example-based", label: "Example-based", icon: BookOpen, desc: "Prioritizes rich real-world metaphors" },
  { id: "question-based", label: "Question-based", icon: HelpCircle, desc: "Prioritizes active recall checkpoints" },
];

const DIFFICULTY_OPTIONS: DifficultyLevel[] = ["Beginner", "Intermediate", "Advanced"];

const DENSITY_OPTIONS: { id: ExplanationDensity; label: string; desc: string }[] = [
  { id: "simple", label: "Simple (ELI5)", desc: "Plain language, concise" },
  { id: "balanced", label: "Balanced", desc: "Intuition + technical clarity" },
  { id: "detailed", label: "Detailed", desc: "Rigorous mechanisms & edge cases" },
];

export function AdaptiveControls({
  learningPreference,
  onSelectPreference,
  difficulty,
  onSelectDifficulty,
  density,
  onSelectDensity,
  onRegenerate,
  isLoading = false,
  compact = false,
}: AdaptiveControlsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-accent-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Adaptive Learning Layer
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Personalizes depth, metaphor style, and diagram focus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Learning Preference */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Learning Preference
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PREFERENCE_OPTIONS.map((pref) => {
              const Icon = pref.icon;
              const isSelected = learningPreference === pref.id;
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => onSelectPreference(pref.id)}
                  title={pref.desc}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-500 bg-brand-950/70 text-white shadow-sm shadow-brand-500/20 font-bold"
                      : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-brand-300" : "text-slate-400"}`} />
                  <span className="truncate">{pref.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Difficulty Tier
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {DIFFICULTY_OPTIONS.map((diff) => {
              const isSelected = difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onSelectDifficulty(diff)}
                  className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-accent-cyan bg-cyan-950/70 text-white shadow-sm shadow-cyan-500/20 font-bold"
                      : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Explanation Density */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Explanation Density
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {DENSITY_OPTIONS.map((dens) => {
              const isSelected = density === dens.id;
              return (
                <button
                  key={dens.id}
                  type="button"
                  onClick={() => onSelectDensity(dens.id)}
                  title={dens.desc}
                  className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-500 bg-purple-950/70 text-white shadow-sm shadow-purple-500/20 font-bold"
                      : "border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="truncate">{dens.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Optional Regenerate Button */}
      {onRegenerate && (
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Adapted mode: <strong className="text-white capitalize">{learningPreference}</strong> • <strong className="text-white capitalize">{difficulty}</strong> • <strong className="text-white capitalize">{density}</strong>
          </span>
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
            icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            className="text-xs font-semibold"
          >
            {isLoading ? "Adapting..." : "Regenerate for me"}
          </Button>
        </div>
      )}
    </div>
  );
}
