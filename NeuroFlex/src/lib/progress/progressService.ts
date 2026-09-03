export interface TopicMastery {
  id: string;
  topicTitle: string;
  category: string;
  masteryPercentage: number;
  status: "Mastered" | "Proficient" | "Developing" | "Needs Review";
  quizzesTaken: number;
  lastStudiedDate: string;
  weakConcepts: string[];
}

export interface QuizPerformanceStats {
  averageScorePercentage: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  recentQuizScores: { date: string; score: number; topic: string }[];
}

export interface LearningSessionStat {
  day: string;
  minutes: number;
  sessionsCount: number;
}

export interface WeakConcept {
  id: string;
  conceptName: string;
  topicTitle: string;
  category: string;
  errorFrequency: number;
  recommendedMode: "Visual Flowchart" | "Real-World Analogy" | "Socratic Check";
}

export interface StrongConcept {
  id: string;
  conceptName: string;
  topicTitle: string;
  category: string;
  masteryScore: number;
  retentionStreak: number;
}

export interface ProgressAnalytics {
  overallMasteryPercentage: number;
  recentImprovementPercentage: number;
  totalStudyMinutes: number;
  activeStreakDays: number;
  strongConcepts: StrongConcept[];
  weakConcepts: WeakConcept[];
  topicMasteryList: TopicMastery[];
  quizPerformance: QuizPerformanceStats;
  weeklySessions: LearningSessionStat[];
}

const DEFAULT_ANALYTICS: ProgressAnalytics = {
  overallMasteryPercentage: 72,
  recentImprovementPercentage: 14,
  totalStudyMinutes: 228,
  activeStreakDays: 5,
  strongConcepts: [
    {
      id: "sc-1",
      conceptName: "Binary Search Midpoint Halving",
      topicTitle: "Binary Search",
      category: "Data Structures",
      masteryScore: 96,
      retentionStreak: 4,
    },
    {
      id: "sc-2",
      conceptName: "TCP 3-Way Handshake (SYN/ACK)",
      topicTitle: "TCP Handshake",
      category: "Computer Networks",
      masteryScore: 94,
      retentionStreak: 5,
    },
    {
      id: "sc-3",
      conceptName: "LIFO Call Stack Frame Removal",
      topicTitle: "Stack Data Structure",
      category: "Data Structures",
      masteryScore: 92,
      retentionStreak: 3,
    },
    {
      id: "sc-4",
      conceptName: "Quantum Bell State Entanglement",
      topicTitle: "Quantum Entanglement",
      category: "Physics & Quantum",
      masteryScore: 88,
      retentionStreak: 2,
    },
  ],
  weakConcepts: [
    {
      id: "wc-1",
      conceptName: "Tree Balancing & In-Order Traversal",
      topicTitle: "Trees & Binary Search Trees",
      category: "Data Structures",
      errorFrequency: 3,
      recommendedMode: "Visual Flowchart",
    },
    {
      id: "wc-2",
      conceptName: "Overlapping Subproblems & Memoization",
      topicTitle: "Dynamic Programming",
      category: "Algorithms",
      errorFrequency: 4,
      recommendedMode: "Real-World Analogy",
    },
    {
      id: "wc-3",
      conceptName: "Thylakoid Proton Gradient Chemiosmosis",
      topicTitle: "Photosynthesis Reactions",
      category: "Biology & Life Sciences",
      errorFrequency: 2,
      recommendedMode: "Socratic Check",
    },
    {
      id: "wc-4",
      conceptName: "TCP Connection Teardown (FIN Handshake)",
      topicTitle: "TCP Protocol Mechanics",
      category: "Computer Networks",
      errorFrequency: 2,
      recommendedMode: "Visual Flowchart",
    },
  ],
  topicMasteryList: [
    {
      id: "t-1",
      topicTitle: "Binary Search",
      category: "Data Structures",
      masteryPercentage: 96,
      status: "Mastered",
      quizzesTaken: 4,
      lastStudiedDate: "Yesterday",
      weakConcepts: [],
    },
    {
      id: "t-2",
      topicTitle: "TCP Three-Way Handshake",
      category: "Computer Networks",
      masteryPercentage: 94,
      status: "Mastered",
      quizzesTaken: 5,
      lastStudiedDate: "Today",
      weakConcepts: [],
    },
    {
      id: "t-3",
      topicTitle: "Stack Data Structure",
      category: "Data Structures",
      masteryPercentage: 92,
      status: "Mastered",
      quizzesTaken: 3,
      lastStudiedDate: "2 days ago",
      weakConcepts: [],
    },
    {
      id: "t-4",
      topicTitle: "Neural Networks: Backprop",
      category: "Artificial Intelligence",
      masteryPercentage: 74,
      status: "Proficient",
      quizzesTaken: 3,
      lastStudiedDate: "3 days ago",
      weakConcepts: ["Gradient vanishing"],
    },
    {
      id: "t-5",
      topicTitle: "Quantum Entanglement",
      category: "Physics & Quantum",
      masteryPercentage: 68,
      status: "Proficient",
      quizzesTaken: 2,
      lastStudiedDate: "4 days ago",
      weakConcepts: ["No-communication theorem"],
    },
    {
      id: "t-6",
      topicTitle: "Trees & Binary Search Trees",
      category: "Data Structures",
      masteryPercentage: 48,
      status: "Needs Review",
      quizzesTaken: 2,
      lastStudiedDate: "5 days ago",
      weakConcepts: ["Tree balancing", "In-order traversal"],
    },
    {
      id: "t-7",
      topicTitle: "Dynamic Programming",
      category: "Algorithms",
      masteryPercentage: 42,
      status: "Needs Review",
      quizzesTaken: 2,
      lastStudiedDate: "6 days ago",
      weakConcepts: ["Memoization state tables", "Overlapping subproblems"],
    },
  ],
  quizPerformance: {
    averageScorePercentage: 89,
    totalQuestionsAnswered: 48,
    correctAnswersCount: 43,
    incorrectAnswersCount: 5,
    recentQuizScores: [
      { date: "Aug 20", score: 75, topic: "Dynamic Programming" },
      { date: "Aug 21", score: 80, topic: "Trees" },
      { date: "Aug 22", score: 85, topic: "Neural Networks" },
      { date: "Aug 23", score: 90, topic: "Stack" },
      { date: "Aug 24", score: 95, topic: "Binary Search" },
      { date: "Aug 25", score: 100, topic: "TCP Handshake" },
      { date: "Today", score: 100, topic: "TCP Handshake Recall" },
    ],
  },
  weeklySessions: [
    { day: "Mon", minutes: 35, sessionsCount: 2 },
    { day: "Tue", minutes: 45, sessionsCount: 3 },
    { day: "Wed", minutes: 20, sessionsCount: 1 },
    { day: "Thu", minutes: 50, sessionsCount: 3 },
    { day: "Fri", minutes: 30, sessionsCount: 2 },
    { day: "Sat", minutes: 15, sessionsCount: 1 },
    { day: "Sun", minutes: 40, sessionsCount: 2 },
  ],
};

const STORAGE_KEY = "neuroflex_progress_analytics";

export class ProgressService {
  /**
   * Fetch student progress analytics. Reads from local storage if available, falls back to default.
   * Can later be switched to an async API / PostgreSQL / Prisma call with zero interface changes.
   */
  static getProgressAnalytics(): ProgressAnalytics {
    if (typeof window === "undefined") {
      return DEFAULT_ANALYTICS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("[ProgressService] Error reading localStorage:", e);
    }

    return DEFAULT_ANALYTICS;
  }

  /**
   * Records a completed quiz or representation session.
   */
  static recordSession(
    topicTitle: string,
    score: number,
    correct: number,
    total: number
  ): ProgressAnalytics {
    const current = this.getProgressAnalytics();

    const newScoreItem = {
      date: "Today",
      score,
      topic: topicTitle,
    };

    const updatedScores = [...current.quizPerformance.recentQuizScores.slice(-6), newScoreItem];
    const totalAnswered = current.quizPerformance.totalQuestionsAnswered + total;
    const totalCorrect = current.quizPerformance.correctAnswersCount + correct;
    const avgScore = Math.round((totalCorrect / totalAnswered) * 100);

    const updated: ProgressAnalytics = {
      ...current,
      quizPerformance: {
        ...current.quizPerformance,
        totalQuestionsAnswered: totalAnswered,
        correctAnswersCount: totalCorrect,
        incorrectAnswersCount: totalAnswered - totalCorrect,
        averageScorePercentage: avgScore,
        recentQuizScores: updatedScores,
      },
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("[ProgressService] Error saving localStorage:", e);
      }
    }

    return updated;
  }
}
