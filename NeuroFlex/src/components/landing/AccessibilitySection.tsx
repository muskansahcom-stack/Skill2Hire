import React from "react";
import Link from "next/link";
import { Eye, Type, Sliders, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function AccessibilitySection() {
  const features = [
    {
      icon: Type,
      title: "Dyslexia-Friendly Layouts",
      description:
        "Switchable high-legibility fonts, increased line spacing, and clean visual chunking to reduce visual stress and reading fatigue.",
    },
    {
      icon: Eye,
      title: "High-Contrast & Themes",
      description:
        "Engineered for WCAG AAA contrast compliance with dedicated high-contrast mode, dark aesthetic, and optimized diagram colors.",
    },
    {
      icon: Sliders,
      title: "Adaptive Pacing & Reduced Motion",
      description:
        "Total control over animations, step transitions, and cognitive density so every learner can proceed at their ideal tempo.",
    },
    {
      icon: ShieldCheck,
      title: "Neurodivergent-First Design",
      description:
        "Synchronized visual and narrative tracks help neurodivergent students (including ADHD and autistic learners) anchor attention with clear structure.",
    },
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Universal Accessibility</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display leading-tight">
              Designed for every brain. No learner left behind.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              True understanding shouldn&apos;t depend on how well someone processes dense academic prose. NeuroFlex provides multimodal pathways so every student can thrive.
            </p>

            <div className="pt-2">
              <Link href="/settings">
                <Button
                  variant="outline"
                  size="md"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Configure Accessibility Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} glass className="p-5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{feat.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
