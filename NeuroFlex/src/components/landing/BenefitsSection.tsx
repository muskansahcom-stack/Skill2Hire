import React from "react";
import Link from "next/link";
import { GraduationCap, BookOpenCheck, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BenefitsSection() {
  const audiences = [
    {
      icon: GraduationCap,
      category: "For STEM Students",
      title: "Master Difficult Academic Concepts Without Cramming",
      benefits: [
        "Eliminate test anxiety with deep conceptual intuition",
        "Visual flowcharts reveal step-by-step causality",
        "Socratic checkpoints expose misconceptions before exam day",
      ],
      border: "border-brand-500/30",
    },
    {
      icon: BookOpenCheck,
      category: "For Educators & TAs",
      title: "Deliver Multi-Perspective Explanations Effortlessly",
      benefits: [
        "Instantly supply analogies for students struggling with abstract proofs",
        "Export clean Mermaid.js diagrams for slides and course notes",
        "Ready-made Socratic discussion prompts for recitation sessions",
      ],
      border: "border-accent-cyan/30",
    },
    {
      icon: Cpu,
      category: "For Engineers & Lifelong Learners",
      title: "Deconstruct New Frameworks & Architectures Rapidly",
      benefits: [
        "Rapidly grasp modern AI architectures (Transformers, Diffusion, Attention)",
        "Inspect complex protocol flows (TCP, Raft consensus, Cryptography)",
        "Micro-learning format fits cleanly into busy schedules",
      ],
      border: "border-purple-500/30",
    },
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent-cyan">
            Benefits
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Empowering students, educators, and engineers
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            Whether preparing for midterm exams or mastering advanced neural network architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border ${aud.border} bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {aud.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white leading-snug">{aud.title}</h4>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-800/60">
                    {aud.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-3xl border border-brand-500/40 bg-gradient-to-r from-brand-950 via-slate-900 to-cyan-950 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Ready to experience adaptive micro-learning?
            </h3>
            <p className="text-sm sm:text-base text-slate-300">
              Explore STEM concepts through synchronized analogies, flowcharts, and socratic checkpoints now.
            </p>
            <div className="pt-2">
              <Link href="/learn">
                <Button variant="primary" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  Launch Learn Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
