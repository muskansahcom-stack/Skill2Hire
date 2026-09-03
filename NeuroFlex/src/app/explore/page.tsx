"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Sparkles,
  Network,
  Cpu,
  Layers,
  Brain,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ConceptItem {
  id: string;
  slug: string;
  title: string;
  discipline: "Computer Science" | "Artificial Intelligence" | "Biology & Life Sciences" | "Physics & Quantum" | "Algorithms";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  description: string;
  prerequisites: string[];
  analogyHook: string;
}

const STEM_CONCEPTS: ConceptItem[] = [
  {
    id: "c-1",
    slug: "tcp-three-way-handshake",
    title: "TCP Three-Way Handshake",
    discipline: "Computer Science",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    description: "Reliable bidirectional socket connection synchronization with SYN, SYN-ACK, and ACK packets.",
    prerequisites: ["IP Addressing", "Packet Switching"],
    analogyHook: "The Walkie-Talkie Radio Check protocol",
  },
  {
    id: "c-2",
    slug: "binary-search",
    title: "Binary Search",
    discipline: "Algorithms",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    description: "Logarithmic divide-and-conquer search strategy that halves sorted search spaces at each step.",
    prerequisites: ["Array Indices", "Sorted Data"],
    analogyHook: "Tearing a phonebook down the exact middle",
  },
  {
    id: "c-3",
    slug: "photosynthesis",
    title: "Photosynthesis: Light Reactions",
    discipline: "Biology & Life Sciences",
    difficulty: "Beginner",
    estimatedMinutes: 6,
    description: "Chemiosmotic photolysis in thylakoid membranes driving ATP synthase and NADPH synthesis.",
    prerequisites: ["Cellular Structure", "Chloroplasts"],
    analogyHook: "The Solar Bakery and conveyor belts",
  },
  {
    id: "c-4",
    slug: "neural-networks",
    title: "Neural Networks & Backpropagation",
    discipline: "Artificial Intelligence",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    description: "Forward inference with matrix multiplications and loss minimization via the chain rule of calculus.",
    prerequisites: ["Matrix Operations", "Calculus Derivatives"],
    analogyHook: "Master chef refining soup seasoning iteratively",
  },
  {
    id: "c-5",
    slug: "quantum-entanglement",
    title: "Quantum Entanglement & Bell States",
    discipline: "Physics & Quantum",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    description: "Non-local quantum state correlations governed by Bell State wavefunctions and the no-communication theorem.",
    prerequisites: ["Superposition", "Wavefunctions"],
    analogyHook: "Magic sealed shoe boxes opened across galaxies",
  },
  {
    id: "c-6",
    slug: "stack-data-structure",
    title: "Stack Data Structure & Memory Frames",
    discipline: "Computer Science",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    description: "LIFO memory management, push/pop mechanics, and recursive function call stack frames.",
    prerequisites: ["Sequential Memory"],
    analogyHook: "Spring-loaded cafeteria tray dispenser",
  },
  {
    id: "c-7",
    slug: "dynamic-programming",
    title: "Dynamic Programming & Memoization",
    discipline: "Algorithms",
    difficulty: "Advanced",
    estimatedMinutes: 9,
    description: "Breaking complex optimization problems into overlapping subproblems with memoization lookup tables.",
    prerequisites: ["Recursion", "Big-O Notation"],
    analogyHook: "Remembering math answers on a scratchpad",
  },
  {
    id: "c-8",
    slug: "transformer-self-attention",
    title: "Transformer & Multi-Head Self-Attention",
    discipline: "Artificial Intelligence",
    difficulty: "Advanced",
    estimatedMinutes: 10,
    description: "Scaled dot-product attention mapping Queries, Keys, and Values across parallel token vectors.",
    prerequisites: ["Neural Networks", "Vector Embeddings"],
    analogyHook: "The Diplomatic Cocktail Party badges",
  },
];

const DISCIPLINES = [
  "All Disciplines",
  "Computer Science",
  "Artificial Intelligence",
  "Algorithms",
  "Biology & Life Sciences",
  "Physics & Quantum",
];

export default function ExplorePage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState("All Disciplines");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConcepts = STEM_CONCEPTS.filter((c) => {
    const matchesDiscipline =
      selectedDiscipline === "All Disciplines" || c.discipline === selectedDiscipline;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.analogyHook.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiscipline && matchesSearch;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "emerald";
      case "Intermediate":
        return "brand";
      case "Advanced":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-medium text-cyan-300">
            <Compass className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Curated STEM Knowledge Graph</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight">
            Explore Concept Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select any STEM discipline or concept to launch directly into synchronized analogies, interactive flowcharts, and active recall checks.
          </p>
        </div>

        {/* Search & Discipline Filter Bar */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts by name, metaphor, or topic..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-slate-900/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan shadow-xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2" role="radiogroup">
            {DISCIPLINES.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setSelectedDiscipline(disc)}
                className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  selectedDiscipline === disc
                    ? "bg-brand-600 text-white border-brand-400/40 shadow-sm"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900"
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredConcepts.map((concept) => (
            <Card
              key={concept.id}
              glass
              className="p-6 flex flex-col justify-between hover:border-accent-cyan/40 transition-all group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={getDifficultyBadge(concept.difficulty)} size="sm">
                    {concept.difficulty}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{concept.estimatedMinutes}m
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider">
                    {concept.discipline}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors">
                    {concept.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-brand-200">
                  <span className="font-semibold text-brand-300">💡 Metaphor: </span>
                  &ldquo;{concept.analogyHook}&rdquo;
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {concept.prerequisites.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <Link href={`/learn?topic=${encodeURIComponent(concept.title)}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight className="h-3.5 w-3.5" />}
                    iconPosition="right"
                    className="text-xs font-bold"
                  >
                    Learn
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
