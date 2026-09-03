import {
  DbUser,
  DbUserPreference,
  DbLearningPreference,
  DbTopic,
  DbLearningSession,
  DbTopicProgress,
  DbQuizAttempt,
  DbRecommendation,
  UserFullProfile,
} from "./models";

export * from "./models";

export interface INeuroFlexRepository {
  getUser(userId: string): Promise<DbUser | null>;
  getUserByEmail(email: string): Promise<DbUser | null>;
  createUser(data: { name: string; email: string; passwordHash?: string }): Promise<DbUser>;
  getOrCreateDefaultUser(): Promise<DbUser>;
  getPreferences(userId: string): Promise<DbUserPreference>;
  updatePreferences(
    userId: string,
    data: Partial<Omit<DbUserPreference, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<DbUserPreference>;
  recordSession(
    userId: string,
    data: {
      topicSlug: string;
      topicTitle: string;
      category?: string;
      durationSeconds: number;
      modeCompleted: "analogy" | "flowchart" | "socratic" | "all";
      generatedContent?: any;
    }
  ): Promise<DbLearningSession>;
  recordQuizAttempt(
    userId: string,
    data: {
      topicSlug: string;
      topicTitle: string;
      category?: string;
      scorePercentage: number;
      totalQuestions: number;
      correctCount: number;
      incorrectCount: number;
      weakConceptsDetected?: string[];
    }
  ): Promise<{ attempt: DbQuizAttempt; progress: DbTopicProgress }>;
  getTopicProgress(userId: string, topicSlug: string): Promise<DbTopicProgress | null>;
  getAllTopicProgress(userId: string): Promise<DbTopicProgress[]>;
  getUserFullProfile(userId: string): Promise<UserFullProfile>;
}

const DEFAULT_USER: DbUser = {
  id: "user-demo-default",
  email: "student@neuroflex.edu",
  name: "Muskan",
  avatarUrl: null,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date(),
};

const DEFAULT_PREFERENCES: DbUserPreference = {
  id: "pref-demo-default",
  userId: "user-demo-default",
  fieldOfStudy: "Computer Science",
  learningPreference: "mixed",
  difficulty: "beginner",
  density: "balanced",
  learningGoal: "Understand concepts",
  onboardingCompleted: true,
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
  createdAt: new Date("2026-08-01T00:00:00.000Z"),
  updatedAt: new Date(),
};

const INITIAL_SESSIONS: DbLearningSession[] = [
  {
    id: "sess-1",
    userId: "user-demo-default",
    topic: "TCP Three-Way Handshake",
    topicSlug: "tcp-three-way-handshake",
    difficulty: "beginner",
    preference: "mixed",
    durationSeconds: 300,
    modeCompleted: "all",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 55 * 2),
  },
  {
    id: "sess-2",
    userId: "user-demo-default",
    topic: "Binary Search",
    topicSlug: "binary-search",
    difficulty: "beginner",
    preference: "visual",
    durationSeconds: 240,
    modeCompleted: "socratic",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 56 * 24),
  },
];

const INITIAL_PROGRESS: DbTopicProgress[] = [
  {
    id: "prog-1",
    userId: "user-demo-default",
    topic: "TCP Three-Way Handshake",
    topicSlug: "tcp-three-way-handshake",
    category: "Computer Science",
    masteryScore: 85,
    mastery: 85,
    attempts: 4,
    correctAnswers: 17,
    totalQuestions: 20,
    weakConcepts: ["Sequence Number Reset"],
    strongConcepts: ["SYN-ACK Flow", "Handshake States"],
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 2),
    lastStudiedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date("2026-08-10T00:00:00.000Z"),
    updatedAt: new Date(),
  },
  {
    id: "prog-2",
    userId: "user-demo-default",
    topic: "Binary Search",
    topicSlug: "binary-search",
    category: "Computer Science",
    masteryScore: 92,
    mastery: 92,
    attempts: 5,
    correctAnswers: 23,
    totalQuestions: 25,
    weakConcepts: [],
    strongConcepts: ["Midpoint Calculation", "Boundary Halving"],
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 24),
    lastStudiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date("2026-08-12T00:00:00.000Z"),
    updatedAt: new Date(),
  },
  {
    id: "prog-3",
    userId: "user-demo-default",
    topic: "Neural Networks & Backpropagation",
    topicSlug: "neural-networks",
    category: "Computer Science",
    masteryScore: 65,
    mastery: 65,
    attempts: 3,
    correctAnswers: 11,
    totalQuestions: 15,
    weakConcepts: ["Chain Rule Derivatives", "Loss Gradient Propagation"],
    strongConcepts: ["Forward Pass Matrix Multiply"],
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 48),
    lastStudiedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    createdAt: new Date("2026-08-15T00:00:00.000Z"),
    updatedAt: new Date(),
  },
];

export class MemoryNeuroFlexRepository implements INeuroFlexRepository {
  private users: Map<string, DbUser> = new Map([[DEFAULT_USER.id, DEFAULT_USER]]);
  private preferences: Map<string, DbUserPreference> = new Map([
    [DEFAULT_PREFERENCES.userId, DEFAULT_PREFERENCES],
  ]);
  private sessions: DbLearningSession[] = [...INITIAL_SESSIONS];
  private topicProgress: Map<string, DbTopicProgress> = new Map(
    INITIAL_PROGRESS.map((p) => [`${p.userId}:${p.topicSlug}`, p])
  );
  private quizAttempts: DbQuizAttempt[] = [
    {
      id: "att-1",
      userId: "user-demo-default",
      topicSlug: "tcp-three-way-handshake",
      topicTitle: "TCP Three-Way Handshake",
      category: "Computer Science",
      score: 100,
      scorePercentage: 100,
      accuracy: 100,
      totalQuestions: 4,
      correctCount: 4,
      incorrectCount: 0,
      weakConceptsDetected: [],
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "att-2",
      userId: "user-demo-default",
      topicSlug: "neural-networks",
      topicTitle: "Neural Networks & Backpropagation",
      category: "Computer Science",
      score: 60,
      scorePercentage: 60,
      accuracy: 60,
      totalQuestions: 5,
      correctCount: 3,
      incorrectCount: 2,
      weakConceptsDetected: ["Chain Rule Derivatives"],
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
  ];

  async getUser(userId: string): Promise<DbUser | null> {
    return this.users.get(userId) || null;
  }

  async getUserByEmail(email: string): Promise<DbUser | null> {
    for (const user of this.users.values()) {
      if (user.email?.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async createUser(data: { name: string; email: string; passwordHash?: string }): Promise<DbUser> {
    const user: DbUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash || null,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);

    const preference: DbUserPreference = {
      id: `pref-${Date.now()}`,
      userId: user.id,
      fieldOfStudy: "Computer Science",
      learningPreference: "mixed",
      difficulty: "beginner",
      density: "balanced",
      learningGoal: "Understand concepts",
      onboardingCompleted: true,
      highContrast: false,
      dyslexiaFont: false,
      reducedMotion: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.preferences.set(user.id, preference);

    return user;
  }

  async getOrCreateDefaultUser(): Promise<DbUser> {
    return DEFAULT_USER;
  }

  async getPreferences(userId: string): Promise<DbUserPreference> {
    const pref = this.preferences.get(userId);
    if (pref) return pref;

    const newPref: DbUserPreference = {
      id: `pref-${Date.now()}`,
      userId,
      fieldOfStudy: "Computer Science",
      learningPreference: "mixed",
      difficulty: "beginner",
      density: "balanced",
      learningGoal: "Understand concepts",
      onboardingCompleted: true,
      highContrast: false,
      dyslexiaFont: false,
      reducedMotion: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.preferences.set(userId, newPref);
    return newPref;
  }

  async updatePreferences(
    userId: string,
    data: Partial<Omit<DbUserPreference, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<DbUserPreference> {
    const existing = await this.getPreferences(userId);
    const updated: DbUserPreference = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.preferences.set(userId, updated);
    return updated;
  }

  async recordSession(
    userId: string,
    data: {
      topicSlug: string;
      topicTitle: string;
      category?: string;
      durationSeconds: number;
      modeCompleted: "analogy" | "flowchart" | "socratic" | "all";
      generatedContent?: any;
    }
  ): Promise<DbLearningSession> {
    const session: DbLearningSession = {
      id: `sess-${Date.now()}`,
      userId,
      topic: data.topicTitle,
      topicSlug: data.topicSlug,
      difficulty: "beginner",
      preference: "mixed",
      durationSeconds: data.durationSeconds,
      modeCompleted: data.modeCompleted,
      startedAt: new Date(),
      completedAt: new Date(),
    };

    this.sessions.unshift(session);
    return session;
  }

  async recordQuizAttempt(
    userId: string,
    data: {
      topicSlug: string;
      topicTitle: string;
      category?: string;
      scorePercentage: number;
      totalQuestions: number;
      correctCount: number;
      incorrectCount: number;
      weakConceptsDetected?: string[];
    }
  ): Promise<{ attempt: DbQuizAttempt; progress: DbTopicProgress }> {
    const attempt: DbQuizAttempt = {
      id: `att-${Date.now()}`,
      userId,
      topicSlug: data.topicSlug,
      topicTitle: data.topicTitle,
      category: data.category || "Computer Science",
      score: data.scorePercentage,
      scorePercentage: data.scorePercentage,
      accuracy: data.scorePercentage,
      totalQuestions: data.totalQuestions,
      correctCount: data.correctCount,
      incorrectCount: data.incorrectCount,
      weakConceptsDetected: data.weakConceptsDetected || [],
      completedAt: new Date(),
    };

    this.quizAttempts.unshift(attempt);

    // Update or create TopicProgress
    const progressKey = `${userId}:${data.topicSlug}`;
    const existing = this.topicProgress.get(progressKey);

    const attempts = (existing?.attempts || 0) + 1;
    const correctAnswers = (existing?.correctAnswers || 0) + data.correctCount;
    const totalQuestions = (existing?.totalQuestions || 0) + data.totalQuestions;
    const calculatedMastery = Math.min(
      100,
      Math.round((correctAnswers / totalQuestions) * 100)
    );

    const updatedWeakConcepts = Array.from(
      new Set([...(existing?.weakConcepts || []), ...(data.weakConceptsDetected || [])])
    );
    const updatedStrongConcepts =
      data.scorePercentage >= 80
        ? Array.from(new Set([...(existing?.strongConcepts || []), data.topicTitle]))
        : existing?.strongConcepts || [];

    const progress: DbTopicProgress = {
      id: existing?.id || `prog-${Date.now()}`,
      userId,
      topic: data.topicTitle,
      topicSlug: data.topicSlug,
      category: data.category || existing?.category || "Computer Science",
      masteryScore: calculatedMastery,
      mastery: calculatedMastery,
      attempts,
      correctAnswers,
      totalQuestions,
      weakConcepts: updatedWeakConcepts,
      strongConcepts: updatedStrongConcepts,
      lastStudied: new Date(),
      lastStudiedAt: new Date(),
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    this.topicProgress.set(progressKey, progress);

    return { attempt, progress };
  }

  async getTopicProgress(userId: string, topicSlug: string): Promise<DbTopicProgress | null> {
    const key = `${userId}:${topicSlug}`;
    return this.topicProgress.get(key) || null;
  }

  async getAllTopicProgress(userId: string): Promise<DbTopicProgress[]> {
    return Array.from(this.topicProgress.values()).filter((p) => p.userId === userId);
  }

  async getUserFullProfile(userId: string): Promise<UserFullProfile> {
    const user = (await this.getUser(userId)) || DEFAULT_USER;
    const preference = await this.getPreferences(userId);
    const sessions = this.sessions.filter((s) => s.userId === userId);
    const topicProgress = await this.getAllTopicProgress(userId);
    const quizAttempts = this.quizAttempts.filter((q) => q.userId === userId);

    return {
      user,
      preference,
      sessions,
      topicProgress,
      quizAttempts,
    };
  }
}

// Central Repository Singleton with PostgreSQL/Prisma Support
export const repository: INeuroFlexRepository = new MemoryNeuroFlexRepository();
