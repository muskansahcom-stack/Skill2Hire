import { HeroSection } from "@/components/landing/HeroSection";
import { WhySection } from "@/components/landing/WhySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LearningModesSection } from "@/components/landing/LearningModesSection";
import { AccessibilitySection } from "@/components/landing/AccessibilitySection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Why NeuroFlex Section */}
      <WhySection />

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Three Learning Modes Section */}
      <LearningModesSection />

      {/* 5. Accessibility Section */}
      <AccessibilitySection />

      {/* 6. Benefits Section */}
      <BenefitsSection />
    </div>
  );
}
