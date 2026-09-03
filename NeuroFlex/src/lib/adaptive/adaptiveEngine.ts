import { repository } from "@/lib/db/repository";
import { UserFullProfile } from "@/lib/db/repository";

export interface ConceptPrerequisiteNode {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  description: string;
  prerequisites: string[];
  coreConcepts: string[];
}

export const KNOWLEDGE_GRAPH: ConceptPrerequisiteNode[] = [
  {
    id: "c-1",
    slug: "tcp-three-way-handshake",
    title: "TCP Three-Way Handshake",
    discipline: "Computer Science",
    difficulty: "beginner",
    estimatedMinutes: 5,
    description: "Reliable bidirectional socket connection synchronization with SYN, SYN-ACK, and ACK packets.",
    prerequisites: [],
    coreConcepts: ["SYN", "ACK", "Sequence Numbers", "State Transitions"],
  },
  {
    id: "c-2",
    slug: "binary-search",
    title: "Binary Search",
    discipline: "Computer Science",
    difficulty: "beginner",
    estimatedMinutes: 4,
    description: "Logarithmic divide-and-conquer search strategy that halves sorted search spaces at each step.",
    prerequisites: [],
    coreConcepts: ["Sorted Arrays", "Midpoint Calculation", "Logarithmic Time", "Boundary Pointers"],
  },
  {
    id: "c-3",
    slug: "photosynthesis",
    title: "Photosynthesis: Light Reactions",
    discipline: "Science",
    difficulty: "beginner",
    estimatedMinutes: 6,
    description: "Chemiosmotic photolysis in thylakoid membranes driving ATP synthase and NADPH synthesis.",
    prerequisites: [],
    coreConcepts: ["Photolysis", "Chloroplasts", "Thylakoid Membrane", "ATP Synthase"],
  },
  {
    id: "c-4",
    slug: "neural-networks",
    title: "Neural Networks & Backpropagation",
    discipline: "Computer Science",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    description: "Forward inference with matrix multiplications and loss minimization via the chain rule of calculus.",
    prerequisites: ["linear-algebra", "calculus-derivatives"],
    coreConcepts: ["Forward Pass", "Activation Functions", "Loss Gradient", "Backpropagation"],
  },
  {
    id: "c-5",
    slug: "quantum-entanglement",
    title: "Quantum Entanglement & Bell States",
    discipline: "Science",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    description: "Non-local quantum state correlations governed by Bell State wavefunctions and the no-communication theorem.",
    prerequisites: [],
    coreConcepts: ["Bell States", "Superposition", "Wavefunction Collapse", "EPR Paradox"],
  },
  {
    id: "c-6",
    slug: "stack-data-structure",
    title: "Stack Data Structure & Memory Frames",
    discipline: "Computer Science",
    difficulty: "beginner",
    estimatedMinutes: 4,
    description: "LIFO memory management, push/pop mechanics, and recursive function call stack frames.",
    prerequisites: [],
    coreConcepts: ["LIFO", "Call Stack", "Stack Overflow", "Push/Pop"],
  },
  {
    id: "c-7",
    slug: "dynamic-programming",
    title: "Dynamic Programming & Memoization",
    discipline: "Computer Science",
    difficulty: "advanced",
    estimatedMinutes: 9,
    description: "Breaking complex optimization problems into overlapping subproblems with memoization lookup tables.",
    prerequisites: ["binary-search", "stack-data-structure"],
    coreConcepts: ["Overlapping Subproblems", "Optimal Substructure", "Memoization", "Tabulation"],
  },
  {
    id: "c-8",
    slug: "transformer-self-attention",
    title: "Transformer & Multi-Head Self-Attention",
    discipline: "Computer Science",
    difficulty: "advanced",
    estimatedMinutes: 10,
    description: "Scaled dot-product attention mapping Queries, Keys, and Values across parallel token vectors.",
    prerequisites: ["neural-networks"],
    coreConcepts: ["Query-Key-Value", "Scaled Dot-Product", "Positional Encoding", "Multi-Head Attention"],
  },
];

export interface AdaptiveProfileAnalysis {
  userId: string;
  fieldOfStudy: string;
  learningPreference: "visual" | "analogy" | "socratic" | "mixed";
  currentDifficulty: "beginner" | "intermediate" | "advanced";
  recentAccuracy: number;
  overallMasteryIndex: number;
  weakConcepts: string[];
  strongConcepts: string[];
  completedTopicSlugs: string[];
  totalSessionsCount: number;
  suggestedDifficulty: "beginner" | "intermediate" | "advanced";
  suggestedDensity: "simple" | "balanced" | "detailed";
  suggestedMode: "visual" | "analogy" | "socratic" | "mixed";
  adaptationReason: string;
}

export interface TopicRecommendation {
  id: string;
  topic: string;
  slug: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  recommendedMode: "Visual" | "Analogy" | "Socratic" | "Mixed";
  estimatedMinutes: number;
  reason: string;
  priority: "high" | "medium" | "standard";
  prerequisiteMet: boolean;
}

export class AdaptiveLearningEngine {
  /**
   * Evaluates student's full historical data across preferences, quizzes, sessions, and mastery.
   */
  static async analyzeStudentProfile(userId: string): Promise<AdaptiveProfileAnalysis> {
    const profile: UserFullProfile = await repository.getUserFullProfile(userId);

    const fieldOfStudy = profile.preference?.fieldOfStudy || "Computer Science";
    const learningPreference = (profile.preference?.learningPreference?.toLowerCase() || "mixed") as
      | "visual"
      | "analogy"
      | "socratic"
      | "mixed";
    const currentDifficulty = (profile.preference?.difficulty?.toLowerCase() || "beginner") as
      | "beginner"
      | "intermediate"
      | "advanced";

    // 1. Calculate recent quiz performance
    const quizAttempts = profile.quizAttempts || [];
    let recentAccuracy = 80;
    if (quizAttempts.length > 0) {
      const recentQuizzes = quizAttempts.slice(-5);
      const totalScore = recentQuizzes.reduce((acc, q) => acc + q.scorePercentage, 0);
      recentAccuracy = Math.round(totalScore / recentQuizzes.length);
    }

    // 2. Extract weak & strong concepts
    const allWeak = quizAttempts.flatMap((q) => q.weakConceptsDetected || []);
    const weakConcepts = Array.from(new Set(allWeak));

    const topicProgress = profile.topicProgress || [];
    const strongConcepts = topicProgress
      .filter((p) => p.mastery >= 80)
      .map((p) => p.topic || p.topicTitle || p.topicSlug);

    const completedTopicSlugs: string[] = Array.from(
      new Set([
        ...topicProgress.filter((p) => p.attempts > 0).map((p) => p.topicSlug),
        ...(profile.sessions || [])
          .map((s) => s.topicSlug || s.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
          .filter((s): s is string => Boolean(s)),
      ])
    );

    const overallMasteryIndex =
      topicProgress.length > 0
        ? Math.round(topicProgress.reduce((sum, p) => sum + p.mastery, 0) / topicProgress.length)
        : 75;
    const totalSessionsCount = (profile.sessions || []).length;

    // 3. Compute Adaptive Directives based on performance
    let suggestedDifficulty: "beginner" | "intermediate" | "advanced" = currentDifficulty;
    let suggestedDensity: "simple" | "balanced" | "detailed" = "balanced";
    let suggestedMode: "visual" | "analogy" | "socratic" | "mixed" = learningPreference;
    let adaptationReason = "";

    // Low performance triggers simplification & multi-modal support
    if (recentAccuracy < 60 || weakConcepts.length >= 3) {
      suggestedDifficulty = "beginner";
      suggestedDensity = "simple";
      // Direct student to visual / analogy for foundational remediation
      suggestedMode = learningPreference === "visual" ? "visual" : "analogy";
      adaptationReason =
        `Performance detected at ${recentAccuracy}% with ${weakConcepts.length} weak concept(s). Automatically simplifying explanations (ELI5) and recommending Visual/Analogy scaffolding.`;
    }
    // High performance triggers higher tier and advanced application
    else if (recentAccuracy >= 85 && overallMasteryIndex >= 70) {
      suggestedDifficulty = currentDifficulty === "beginner" ? "intermediate" : "advanced";
      suggestedDensity = "detailed";
      suggestedMode = "socratic";
      adaptationReason =
        `Strong mastery (${recentAccuracy}% accuracy). Elevating challenge tier to ${suggestedDifficulty.toUpperCase()} with deep Socratic evaluation.`;
    }
    // Steady balanced baseline
    else {
      suggestedDifficulty = currentDifficulty;
      suggestedDensity = "balanced";
      suggestedMode = learningPreference;
      adaptationReason =
        `Consistent progression. Maintaining ${suggestedDifficulty.toUpperCase()} tier with balanced tri-modal representations.`;
    }

    return {
      userId,
      fieldOfStudy,
      learningPreference,
      currentDifficulty,
      recentAccuracy,
      overallMasteryIndex,
      weakConcepts,
      strongConcepts,
      completedTopicSlugs,
      totalSessionsCount,
      suggestedDifficulty,
      suggestedDensity,
      suggestedMode,
      adaptationReason,
    };
  }

  /**
   * Generates tailored next topics using knowledge graph prerequisites and student analytics.
   */
  static async getAdaptiveRecommendations(userId: string): Promise<TopicRecommendation[]> {
    const analysis = await this.analyzeStudentProfile(userId);
    const recommendations: TopicRecommendation[] = [];

    // Helper to format difficulty
    const capitalize = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1)) as "Beginner" | "Intermediate" | "Advanced";
    const capitalizeMode = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1)) as "Visual" | "Analogy" | "Socratic" | "Mixed";

    // 1. High Priority: Remedial topic targeting detected weak concepts
    if (analysis.weakConcepts.length > 0) {
      const targetWeak = analysis.weakConcepts[0];
      // Find matching knowledge graph topic
      const weakMatch = KNOWLEDGE_GRAPH.find((node) =>
        node.coreConcepts.some((c) => c.toLowerCase().includes(targetWeak.toLowerCase())) ||
        targetWeak.toLowerCase().includes(node.slug)
      );

      if (weakMatch) {
        recommendations.push({
          id: `rec-weak-${weakMatch.slug}`,
          topic: weakMatch.title,
          slug: weakMatch.slug,
          category: weakMatch.discipline,
          difficulty: "Beginner",
          recommendedMode: "Visual",
          estimatedMinutes: weakMatch.estimatedMinutes,
          reason: `Targets your flagged concept: "${targetWeak}". Uses visual scaffolding to rebuild mental model.`,
          priority: "high",
          prerequisiteMet: true,
        });
      }
    }

    // 2. Next Sequential Concepts in Knowledge Graph (uncompleted topics with met prerequisites)
    const uncompletedNodes = KNOWLEDGE_GRAPH.filter(
      (node) => !analysis.completedTopicSlugs.includes(node.slug)
    );

    for (const node of uncompletedNodes) {
      // Avoid duplicating the weak concept match
      if (recommendations.some((r) => r.slug === node.slug)) continue;

      const hasPrereqs =
        node.prerequisites.length === 0 ||
        node.prerequisites.every((req) => analysis.completedTopicSlugs.includes(req) || analysis.strongConcepts.some(sc => sc.toLowerCase().includes(req)));

      let reason = "";
      let priority: "high" | "medium" | "standard" = "standard";

      if (hasPrereqs && node.difficulty === analysis.suggestedDifficulty) {
        priority = "high";
        reason = `Matches your calibrated ${analysis.suggestedDifficulty.toUpperCase()} tier and ${analysis.fieldOfStudy} focus.`;
      } else if (hasPrereqs) {
        priority = "medium";
        reason = `Unlocked by your completed STEM foundations. Ready for exploration.`;
      } else {
        priority = "standard";
        reason = `Advanced topic building upon ${node.prerequisites.join(", ")}.`;
      }

      recommendations.push({
        id: `rec-kg-${node.slug}`,
        topic: node.title,
        slug: node.slug,
        category: node.discipline,
        difficulty: capitalize(node.difficulty),
        recommendedMode: capitalizeMode(analysis.suggestedMode),
        estimatedMinutes: node.estimatedMinutes,
        reason,
        priority,
        prerequisiteMet: hasPrereqs,
      });

      if (recommendations.length >= 4) break;
    }

    // 3. Fallback: If student has completed all topics or graph is sparse
    if (recommendations.length < 3) {
      const fallbackNodes = KNOWLEDGE_GRAPH.filter((n) => !recommendations.some((r) => r.slug === n.slug));
      for (const node of fallbackNodes) {
        recommendations.push({
          id: `rec-fallback-${node.slug}`,
          topic: node.title,
          slug: node.slug,
          category: node.discipline,
          difficulty: capitalize(node.difficulty),
          recommendedMode: capitalizeMode(analysis.suggestedMode),
          estimatedMinutes: node.estimatedMinutes,
          reason: `Recommended for continuous micro-learning mastery.`,
          priority: "standard",
          prerequisiteMet: true,
        });
        if (recommendations.length >= 4) break;
      }
    }

    return recommendations;
  }
}
