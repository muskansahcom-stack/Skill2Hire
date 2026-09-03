"use client";

import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LearningModesSection } from "@/components/landing/LearningModesSection";
import { AdaptiveSection } from "@/components/landing/AdaptiveSection";
import { ActiveRecallSection } from "@/components/landing/ActiveRecallSection";
import { ProgressSection } from "@/components/landing/ProgressSection";
import { AccessibilitySection } from "@/components/landing/AccessibilitySection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Banner: NEUROFLEX - "One Concept. Three Ways to Understand." */}
      <HeroSection />

      {/* Section 1: The Problem */}
      <ProblemSection />

      {/* Section 2: How NeuroFlex Works */}
      <HowItWorksSection />

      {/* Section 3: Three Learning Modes */}
      <LearningModesSection />

      {/* Section 4: Adaptive Learning */}
      <AdaptiveSection />

      {/* Section 5: Active Recall */}
      <ActiveRecallSection />

      {/* Section 6: Learning Progress */}
      <ProgressSection />

      {/* Section 7: Accessibility */}
      <AccessibilitySection />

      {/* Section 8: Call To Action */}
      <CtaSection />
    </div>
  );
}
