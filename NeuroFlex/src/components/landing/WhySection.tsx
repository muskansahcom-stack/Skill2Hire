import React from "react";
import { Brain, Layers, Split, Zap, Eye, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function WhySection() {
  const pillars = [
    {
      icon: Split,
      title: "Eliminates Cognitive Overload",
      description:
        "Textbooks dump definitions, math, and jargon simultaneously. NeuroFlex separates the conceptual model, the structural pipeline, and active verification into three clean digestible passes.",
    },
    {
      icon: Eye,
      title: "Dual-Coding Architecture",
      description:
        "Combining verbal metaphors with synchronized visual flowcharts anchors concepts in both visual and verbal memory channels for durable mental retention.",
    },
    {
      icon: Zap,
      title: "Active Reflection Over Passive Reading",
      description:
        "Passive highlighting produces an illusion of competence. Socratic checkpoints force active reasoning so students discover edge-cases and boundary conditions firsthand.",
    },
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Why NeuroFlex
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Built on proven cognitive learning science
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            Traditional STEM education forces students to decode syntax and logic at the same time. NeuroFlex scaffolds understanding step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} hoverEffect glass className="flex flex-col justify-between">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-brand-950/80 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
