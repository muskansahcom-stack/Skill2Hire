"use client";

import React from "react";
import {
  useAccessibility,
  TextSize,
  MotionPreference,
  LearningPresentation,
} from "@/contexts/AccessibilityContext";
import {
  Sliders,
  Type,
  Zap,
  Eye,
  BookOpen,
  HelpCircle,
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  Shield,
} from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AccessibilityPanelProps {
  className?: string;
  showLivePreview?: boolean;
}

export function AccessibilityPanel({
  className = "",
  showLivePreview = true,
}: AccessibilityPanelProps) {
  const {
    textSize,
    setTextSize,
    motion,
    setMotion,
    learningPresentation,
    setLearningPresentation,
    highContrast,
    setHighContrast,
    dyslexiaFont,
    setDyslexiaFont,
    resetAccessibility,
  } = useAccessibility();

  const TEXT_SIZES: { id: TextSize; label: string; desc: string }[] = [
    { id: "normal", label: "Normal", desc: "100% standard baseline font scale" },
    { id: "large", label: "Large", desc: "112.5% enlarged body typography" },
    { id: "extra-large", label: "Extra Large", desc: "125% maximum legibility scale" },
  ];

  const MOTION_OPTIONS: { id: MotionPreference; label: string; desc: string }[] = [
    { id: "normal", label: "Normal", desc: "Full animations and transitions" },
    { id: "reduced", label: "Reduced", desc: "Disables animations, transitions & pulses" },
  ];

  const PRESENTATION_MODES: {
    id: LearningPresentation;
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    { id: "visual", label: "Visual", icon: Eye, desc: "Prioritizes diagrams & flowcharts" },
    { id: "analogy", label: "Analogy", icon: BookOpen, desc: "Prioritizes everyday metaphors" },
    { id: "questions", label: "Questions", icon: HelpCircle, desc: "Prioritizes active recall checks" },
    { id: "mixed", label: "Mixed", icon: Layers, desc: "Balanced tri-modal layout" },
  ];

  return (
    <div
      className={`rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 backdrop-blur-xl space-y-6 ${className}`}
      role="region"
      aria-label="Accessibility Preferences Panel"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Universal Accessibility Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Settings automatically adjust contrast, typography, and motion across the app.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetAccessibility}
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          className="text-xs text-slate-400 hover:text-white self-start sm:self-center"
        >
          Reset Defaults
        </Button>
      </div>

      <div className="space-y-6">
        {/* 1. Text Size Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Type className="h-4 w-4 text-accent-cyan" />
              <span>Text Size</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono capitalize">
              Active: {textSize}
            </span>
          </div>

          <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Select typography scale"
          >
            {TEXT_SIZES.map((option) => {
              const isSelected = textSize === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setTextSize(option.id)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                    isSelected
                      ? "border-accent-cyan bg-cyan-950/60 text-white shadow-md shadow-cyan-500/20 ring-1 ring-accent-cyan/40"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{option.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:block">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Motion Preference */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-purple-400" />
              <span>Motion Preference</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono capitalize">
              Active: {motion}
            </span>
          </div>

          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Select motion preference"
          >
            {MOTION_OPTIONS.map((option) => {
              const isSelected = motion === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setMotion(option.id)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    isSelected
                      ? "border-purple-500 bg-purple-950/60 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-500/40"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{option.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Learning Presentation Mode */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-400" />
              <span>Learning Presentation</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono capitalize">
              Default: {learningPresentation}
            </span>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            role="radiogroup"
            aria-label="Select default learning presentation mode"
          >
            {PRESENTATION_MODES.map((option) => {
              const Icon = option.icon;
              const isSelected = learningPresentation === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setLearningPresentation(option.id)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    isSelected
                      ? "border-brand-500 bg-brand-950/60 text-white shadow-md shadow-brand-500/20 ring-1 ring-brand-500/40"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isSelected ? "text-brand-300" : "text-slate-400"}`}
                  />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. High Contrast & Dyslexia Switches */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <Switch
            checked={highContrast}
            onChange={setHighContrast}
            label="Enhanced High Contrast (WCAG AAA)"
            description="Increases contrast ratios and border definitions to maximum visibility standards."
          />

          <Switch
            checked={dyslexiaFont}
            onChange={setDyslexiaFont}
            label="Dyslexia-Friendly Typography"
            description="Increases character distinctiveness and line spacing to eliminate visual crowding."
          />
        </div>

        {/* Live Preview Box */}
        {showLivePreview && (
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Accessibility Preview
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              NeuroFlex transforms difficult STEM concepts into three synchronized representations: Real-World Analogy, Interactive Visual Flowchart, and Socratic Self-Check.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessibilityPanel;
