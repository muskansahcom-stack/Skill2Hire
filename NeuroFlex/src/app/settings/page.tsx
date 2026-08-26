"use client";

import React, { useState } from "react";
import { defaultUserSettings } from "@/lib/data/sampleTopics";
import { UserSettings, DifficultyLevel } from "@/types";
import {
  Settings,
  Eye,
  Sliders,
  Sparkles,
  Key,
  Shield,
  Check,
  Save,
  RotateCcw,
  Type,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    // Apply dyslexia font to document root if enabled
    if (settings.dyslexiaFont) {
      document.documentElement.classList.add("dyslexia-font");
    } else {
      document.documentElement.classList.remove("dyslexia-font");
    }

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setSettings(defaultUserSettings);
    document.documentElement.classList.remove("dyslexia-font");
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="gap-1">
                <Settings className="h-3 w-3" />
                <span>Configuration</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-2">
              Platform & Accessibility Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Customize your sensory preferences, default representation pathways, and AI engine parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="h-4 w-4" />}>
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              icon={savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            >
              {savedSuccess ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* 1. Accessibility & Sensory Settings */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-400" />
              <CardTitle>Universal Accessibility & Sensory Comfort</CardTitle>
            </div>
            <p className="text-xs text-slate-400">
              Tailor the reading environment to your neurotype and visual preferences.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 divide-y divide-slate-800/60">
            <div className="pt-2">
              <Switch
                checked={settings.dyslexiaFont}
                onChange={(val) => setSettings({ ...settings, dyslexiaFont: val })}
                label="Dyslexia-Friendly Typography"
                description="Increases character distinctiveness, letter spacing, and line height to eliminate visual distortion."
              />
            </div>

            <div className="pt-4">
              <Switch
                checked={settings.highContrast}
                onChange={(val) => setSettings({ ...settings, highContrast: val })}
                label="Enhanced High Contrast"
                description="Strengthens borders and text contrast to exceed WCAG AAA standards for low-vision readers."
              />
            </div>

            <div className="pt-4">
              <Switch
                checked={settings.reducedMotion}
                onChange={(val) => setSettings({ ...settings, reducedMotion: val })}
                label="Reduced Motion Mode"
                description="Disables background pulses, floating gradient animations, and smooth sliding transitions."
              />
            </div>

            <div className="pt-4">
              <Switch
                checked={settings.autoPlayFlowcharts}
                onChange={(val) => setSettings({ ...settings, autoPlayFlowcharts: val })}
                label="Interactive Step-by-Step Flowchart Mode"
                description="Enables interactive node highlights and phase inspections in Mermaid diagrams by default."
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Learning Pathway Preferences */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand-400" />
              <CardTitle>Learning Pathway & Pedagogical Preferences</CardTitle>
            </div>
            <p className="text-xs text-slate-400">
              Choose your primary mental on-ramp when opening a new micro-module.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Default Representation View
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "all", label: "Tri-Modal Split" },
                  { id: "analogy", label: "Analogy First" },
                  { id: "flowchart", label: "Flowchart First" },
                  { id: "socratic", label: "Socratic First" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        defaultMode: mode.id as UserSettings["defaultMode"],
                      })
                    }
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      settings.defaultMode === mode.id
                        ? "border-brand-500 bg-brand-950/60 text-white shadow-sm shadow-brand-500/20"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Conceptual Depth Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["Beginner", "Intermediate", "Advanced"] as DifficultyLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSettings({ ...settings, preferredDifficulty: level })}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      settings.preferredDifficulty === level
                        ? "border-accent-cyan bg-cyan-950/60 text-white shadow-sm shadow-accent-cyan/20"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Modular AI Engine Configuration (Ready for future backend) */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-accent-cyan" />
                <CardTitle>AI Engine & Model Backend</CardTitle>
              </div>
              <Badge variant="cyan">Modular AI Architecture</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Configure your preferred LLM provider for live generation of novel analogies and Mermaid diagrams.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Active AI Provider
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "gemini", label: "Google Gemini 2.0" },
                  { id: "openai", label: "OpenAI GPT-4o" },
                  { id: "claude", label: "Claude 3.5 Sonnet" },
                  { id: "local", label: "Local Ollama" },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        aiProvider: prov.id as UserSettings["aiProvider"],
                      })
                    }
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      settings.aiProvider === prov.id
                        ? "border-accent-cyan bg-cyan-950/60 text-white shadow-sm shadow-accent-cyan/20"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Custom Provider API Key (Optional)
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={settings.customApiKey || ""}
                  onChange={(e) => setSettings({ ...settings, customApiKey: e.target.value })}
                  placeholder="sk-... or AIzaSy... (stored locally in browser session)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Keys remain confidential within your local environment and are used solely for direct client API calls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
