"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  BookOpen,
  Sliders,
  Target,
  Gauge,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Calculator,
  Compass,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

// 1. Field of Study Options
const STUDY_FIELDS = [
  {
    id: "Computer Science",
    title: "Computer Science",
    subtitle: "Software, algorithms, operating systems, networks & architecture",
    icon: Cpu,
  },
  {
    id: "Engineering",
    title: "Engineering",
    subtitle: "Electrical, mechanical, robotics, biomedical & civil systems",
    icon: Sliders,
  },
  {
    id: "Mathematics",
    title: "Mathematics",
    subtitle: "Linear algebra, calculus, discrete math & probability",
    icon: Calculator,
  },
  {
    id: "Science",
    title: "Science",
    subtitle: "Physics, biology, chemistry & life sciences",
    icon: FlaskConical,
  },
  {
    id: "Business",
    title: "Business",
    subtitle: "Economics, finance, management & analytics",
    icon: Briefcase,
  },
  {
    id: "Other",
    title: "Other",
    subtitle: "Interdisciplinary, humanities & exploratory studies",
    icon: Compass,
  },
];

// 2. Learning Style Options
const LEARNING_STYLES = [
  {
    id: "visual",
    title: "Visual",
    subtitle: "Diagrams, flowcharts, state transitions and spatial representations",
    badge: "Mermaid.js Flowcharts",
  },
  {
    id: "example-based",
    title: "Real-world examples",
    subtitle: "Everyday analogies and relatable metaphors before equations",
    badge: "Intuitive Analogies",
  },
  {
    id: "question-based",
    title: "Questions",
    subtitle: "Socratic checkpoints and active retrieval interrogation",
    badge: "Active Recall",
  },
  {
    id: "mixed",
    title: "Mixed",
    subtitle: "Synchronized analogies, interactive diagrams and self-checks together",
    badge: "Recommended Tri-Modal",
  },
];

// 3. Difficulty Options
const DIFFICULTY_TIERS = [
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "Foundational conceptual intuition with zero jargon",
    badge: "Intuitive Core",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "Structured system mechanics, causal steps & trade-offs",
    badge: "Standard University",
  },
  {
    id: "advanced",
    title: "Advanced",
    subtitle: "Rigorous mathematical formulations and architectural constraints",
    badge: "High Rigor",
  },
];

// 4. Explanation Preference
const DENSITY_OPTIONS = [
  {
    id: "simple",
    title: "Simple",
    subtitle: "Concise executive summaries and high-level bullet takeaways",
    badge: "Fast Scan",
  },
  {
    id: "balanced",
    title: "Balanced",
    subtitle: "Optimal balance of intuition, diagrams and step-by-step depth",
    badge: "Standard",
  },
  {
    id: "detailed",
    title: "Detailed",
    subtitle: "Comprehensive deep-dives including edge cases and caveats",
    badge: "Exhaustive",
  },
];

// 5. Main Learning Goal
const LEARNING_GOALS = [
  {
    id: "Understand concepts",
    title: "Understand concepts",
    subtitle: "Build robust intuitive mental models that actually stick long-term",
    icon: BrainIcon,
  },
  {
    id: "Exam preparation",
    title: "Exam preparation",
    subtitle: "Master high-yield questions, definitions, and problem-solving sequences",
    icon: GraduationCap,
  },
  {
    id: "Interview preparation",
    title: "Interview preparation",
    subtitle: "Be ready to clearly explain complex systems and algorithms out loud",
    icon: Target,
  },
  {
    id: "Practice",
    title: "Practice",
    subtitle: "Continually test mental retrieval loops with active recall checkpoints",
    icon: Zap,
  },
  {
    id: "Academic improvement",
    title: "Academic improvement",
    subtitle: "Turn difficult STEM coursework into high-confidence mastery",
    icon: Layers,
  },
];

function BrainIcon(props: any) {
  return <Sparkles {...props} />;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [fieldOfStudy, setFieldOfStudy] = useState("Computer Science");
  const [learningPreference, setLearningPreference] = useState<"visual" | "example-based" | "question-based" | "mixed">("mixed");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [density, setDensity] = useState<"simple" | "balanced" | "detailed">("balanced");
  const [learningGoal, setLearningGoal] = useState("Understand concepts");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding", {
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to save preferences");
      }

      // Transition to Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || "Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-6 animate-fadeIn">
        {/* Header Branding & Student Welcome */}
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/neuroflex-logo.png"
            alt="NeuroFlex Logo"
            width={48}
            height={48}
            style={{ width: "48px", height: "48px", minWidth: "48px", maxWidth: "48px" }}
            className="h-12 w-12 rounded-2xl mx-auto object-cover shadow-lg shadow-brand-500/20 shrink-0"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Welcome to NeuroFlex, {user?.name || "Student"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Personalize your adaptive micro-learning engine. You can change these preferences at any time in Settings.
          </p>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-accent-cyan">
              Question {currentStep} of {totalSteps}
            </span>
            <span className="text-slate-400 font-mono font-medium">
              {progressPercent}% Completed
            </span>
          </div>
          <Progress value={progressPercent} variant="cyan" size="sm" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs animate-fadeIn">
            {error}
          </div>
        )}

        {/* Dynamic Question Container */}
        <Card glass className="p-6 md:p-8 space-y-6">
          {/* ════════════ QUESTION 1: Field of Study ════════════ */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Badge variant="cyan" size="sm">
                  1. Academic Focus
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  What are you studying?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select your primary field to customize starter STEM concepts and analogies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {STUDY_FIELDS.map((field) => {
                  const Icon = field.icon;
                  const isSelected = fieldOfStudy === field.id;
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => setFieldOfStudy(field.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent-cyan bg-cyan-950/40 text-white ring-1 ring-accent-cyan shadow-lg shadow-cyan-500/10"
                          : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-accent-cyan/20 text-accent-cyan"
                            : "bg-slate-850 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">{field.title}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{field.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════ QUESTION 2: Preferred Learning Style ════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Badge variant="brand" size="sm">
                  2. Cognitive Style
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Preferred learning style:
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Choose which sensory representation you want prioritized in your micro-sessions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {LEARNING_STYLES.map((style) => {
                  const isSelected = learningPreference === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setLearningPreference(style.id as any)}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/40 text-white ring-1 ring-brand-400 shadow-lg shadow-brand-500/10"
                          : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{style.title}</span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-brand-300">
                          {style.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{style.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════ QUESTION 3: Default Difficulty ════════════ */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Badge variant="purple" size="sm">
                  3. Rigor Level
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Default difficulty:
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Adjust the baseline depth of equations, formal vocabulary, and system mechanics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {DIFFICULTY_TIERS.map((tier) => {
                  const isSelected = difficulty === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDifficulty(tier.id as any)}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-400 shadow-lg shadow-purple-500/10"
                          : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{tier.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{tier.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════ QUESTION 4: Explanation Preference ════════════ */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Badge variant="emerald" size="sm">
                  4. Explanation Density
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Explanation preference:
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  How much detail do you prefer in your initial synthesis passes?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {DENSITY_OPTIONS.map((dens) => {
                  const isSelected = density === dens.id;
                  return (
                    <button
                      key={dens.id}
                      type="button"
                      onClick={() => setDensity(dens.id as any)}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-400 shadow-lg shadow-emerald-500/10"
                          : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{dens.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                          {dens.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{dens.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════ QUESTION 5: Main Learning Goal ════════════ */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Badge variant="amber" size="sm">
                  5. Learning Objective
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Main learning goal:
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  What is your primary milestone right now?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {LEARNING_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = learningGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setLearningGoal(goal.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "border-amber-500 bg-amber-950/40 text-white ring-1 ring-amber-400 shadow-lg shadow-amber-500/10"
                          : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-850 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">{goal.title}</p>
                        <p className="text-[11px] text-slate-400 leading-snug">{goal.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleBack}
                icon={<ArrowLeft className="h-4 w-4" />}
                className="text-xs font-semibold"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={isSaving}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              className="text-xs font-bold px-7"
            >
              {currentStep === totalSteps
                ? isSaving
                  ? "Saving to Database..."
                  : "Finish & Enter Dashboard"
                : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
