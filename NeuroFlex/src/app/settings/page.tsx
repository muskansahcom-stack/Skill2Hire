"use client";

import React, { useState, useEffect } from "react";
import { defaultUserSettings } from "@/lib/data/sampleTopics";
import { UserSettings } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
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
  SlidersHorizontal,
  GraduationCap,
  Target,
  Layers,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  const { user } = useAuth();

  const [fieldOfStudy, setFieldOfStudy] = useState("Computer Science");
  const [learningPreference, setLearningPreference] = useState("mixed");
  const [difficulty, setDifficulty] = useState("beginner");
  const [density, setDensity] = useState("balanced");
  const [learningGoal, setLearningGoal] = useState("Understand concepts");

  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load existing user preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/onboarding");
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            if (data.preferences.fieldOfStudy) setFieldOfStudy(data.preferences.fieldOfStudy);
            if (data.preferences.learningPreference) setLearningPreference(data.preferences.learningPreference);
            if (data.preferences.difficulty) setDifficulty(data.preferences.difficulty);
            if (data.preferences.density) setDensity(data.preferences.density);
            if (data.preferences.learningGoal) setLearningGoal(data.preferences.learningGoal);
          }
        }
      } catch (e) {
        console.warn("Could not fetch user preferences:", e);
      }
    }
    loadPreferences();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          fieldOfStudy,
          learningPreference,
          difficulty,
          density,
          learningGoal,
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultUserSettings);
    setFieldOfStudy("Computer Science");
    setLearningPreference("mixed");
    setDifficulty("beginner");
    setDensity("balanced");
    setLearningGoal("Understand concepts");
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="gap-1 px-3 py-1 font-semibold">
                <Settings className="h-3.5 w-3.5" />
                <span>Configuration</span>
              </Badge>
              <Badge variant="cyan">WCAG AAA Accessible</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight mt-1">
              Platform &amp; Student Learning Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Customize your academic focus, learning preferences, difficulty tier, and accessibility modes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              icon={savedSuccess ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              className="text-xs font-semibold"
            >
              {savedSuccess ? "Saved to Database!" : isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* 1. Academic Focus & Learning Preferences (Configured during Onboarding) */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent-cyan" />
                <CardTitle>Academic Focus &amp; Learning Preferences</CardTitle>
              </div>
              <Badge variant="cyan">Database Synced</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Adjust the 5 core learning dimensions set during onboarding.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 1. Field of Study */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                1. What are you studying?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Computer Science",
                  "Engineering",
                  "Mathematics",
                  "Science",
                  "Business",
                  "Other",
                ].map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setFieldOfStudy(field)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      fieldOfStudy === field
                        ? "border-accent-cyan bg-cyan-950/40 text-white ring-1 ring-accent-cyan"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Preferred Learning Style */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                2. Preferred learning style:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "visual", label: "Visual" },
                  { id: "example-based", label: "Real-world examples" },
                  { id: "question-based", label: "Questions" },
                  { id: "mixed", label: "Mixed" },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setLearningPreference(style.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      learningPreference === style.id
                        ? "border-brand-500 bg-brand-950/40 text-white ring-1 ring-brand-400"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Difficulty Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                3. Default difficulty:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "beginner", label: "Beginner" },
                  { id: "intermediate", label: "Intermediate" },
                  { id: "advanced", label: "Advanced" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setDifficulty(tier.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      difficulty === tier.id
                        ? "border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-400"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Explanation Preference */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                4. Explanation preference:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "simple", label: "Simple" },
                  { id: "balanced", label: "Balanced" },
                  { id: "detailed", label: "Detailed" },
                ].map((dens) => (
                  <button
                    key={dens.id}
                    type="button"
                    onClick={() => setDensity(dens.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      density === dens.id
                        ? "border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-400"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {dens.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Main Learning Goal */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                5. Main learning goal:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Understand concepts",
                  "Exam preparation",
                  "Interview preparation",
                  "Practice",
                  "Academic improvement",
                ].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setLearningGoal(goal)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      learningGoal === goal
                        ? "border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-400"
                        : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Universal Accessibility Preference Panel */}
        <AccessibilityPanel />

        {/* 3. AI Engine & Model Backend */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-accent-cyan" />
                <CardTitle>AI Engine &amp; Model Backend</CardTitle>
              </div>
              <Badge variant="cyan">Modular Architecture</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Configure your preferred LLM provider for live generation of analogies, flowcharts, and Socratic checks.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Active AI Generation Engine
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-brand-500 bg-brand-950/30 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-400" />
                    <span className="text-xs font-semibold">Gemini 2.5 Flash / Pro (Primary)</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="text-xs font-medium">OpenAI GPT-4o / Mini (Fallback)</span>
                  </div>
                  <Badge variant="default" size="sm">Available</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
