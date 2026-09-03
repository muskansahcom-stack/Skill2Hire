import { prisma } from "./prisma";
import {
  DbUser,
  DbUserPreference,
  DbLearningSession,
  DbTopicProgress,
  DbQuizAttempt,
  DbRecommendation,
  UserFullProfile,
} from "./models";
import { INeuroFlexRepository } from "./repository";

export class PrismaNeuroFlexRepository implements INeuroFlexRepository {
  async getUser(userId: string): Promise<DbUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return user ? (user as DbUser) : null;
    } catch (e) {
      console.error("[Prisma] getUser error:", e);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<DbUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user ? (user as DbUser) : null;
    } catch (e) {
      console.error("[Prisma] getUserByEmail error:", e);
      return null;
    }
  }

  async createUser(data: { name: string; email: string; passwordHash?: string }): Promise<DbUser> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash || null,
        preference: {
          create: {
            fieldOfStudy: "Computer Science",
            learningPreference: "mixed",
            difficulty: "beginner",
            density: "balanced",
            learningGoal: "Understand concepts",
            highContrast: false,
            dyslexiaFont: false,
            reducedMotion: false,
          },
        },
      },
    });
    return user as DbUser;
  }

  async getOrCreateDefaultUser(): Promise<DbUser> {
    let user = await prisma.user.findFirst({
      where: { email: "student@neuroflex.edu" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "user-demo-default",
          email: "student@neuroflex.edu",
          name: "Muskan",
          preference: {
            create: {
              fieldOfStudy: "Computer Science",
              learningPreference: "mixed",
              difficulty: "beginner",
              density: "balanced",
              learningGoal: "Understand concepts",
              highContrast: false,
              dyslexiaFont: false,
              reducedMotion: false,
            },
          },
        },
      });
    }

    return user as DbUser;
  }

  async getPreferences(userId: string): Promise<DbUserPreference> {
    let pref = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.userPreference.create({
        data: {
          userId,
          fieldOfStudy: "Computer Science",
          learningPreference: "mixed",
          difficulty: "beginner",
          density: "balanced",
          learningGoal: "Understand concepts",
          highContrast: false,
          dyslexiaFont: false,
          reducedMotion: false,
        },
      });
    }

    return pref as DbUserPreference;
  }

  async updatePreferences(
    userId: string,
    data: Partial<Omit<DbUserPreference, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<DbUserPreference> {
    const updated = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        userId,
        fieldOfStudy: data.fieldOfStudy || "Computer Science",
        learningPreference: data.learningPreference || "mixed",
        difficulty: data.difficulty || "beginner",
        density: data.density || "balanced",
        learningGoal: data.learningGoal || "Understand concepts",
        highContrast: data.highContrast ?? false,
        dyslexiaFont: data.dyslexiaFont ?? false,
        reducedMotion: data.reducedMotion ?? false,
      },
    });

    return updated as DbUserPreference;
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
    const session = await prisma.learningSession.create({
      data: {
        userId,
        topic: data.topicTitle,
        topicSlug: data.topicSlug,
        difficulty: "beginner",
        preference: "mixed",
        generatedContent: data.generatedContent || null,
        durationSeconds: data.durationSeconds,
        modeCompleted: data.modeCompleted,
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      topic: session.topic,
      topicSlug: session.topicSlug || data.topicSlug,
      difficulty: session.difficulty,
      preference: session.preference,
      generatedContent: session.generatedContent,
      durationSeconds: session.durationSeconds,
      modeCompleted: session.modeCompleted as "analogy" | "flowchart" | "socratic" | "all",
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    };
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
      questions?: Array<{
        question: string;
        options: string[];
        correctOption: number;
        selectedOption?: number;
        isCorrect: boolean;
        explanation?: string;
        conceptTested?: string;
      }>;
    }
  ): Promise<{ attempt: DbQuizAttempt; progress: DbTopicProgress }> {
    // 1. Create Quiz Attempt with nested Quiz Questions
    const createdAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        topicSlug: data.topicSlug,
        topicTitle: data.topicTitle,
        category: data.category || "Computer Science",
        score: data.scorePercentage,
        accuracy: data.scorePercentage,
        totalQuestions: data.totalQuestions,
        correctCount: data.correctCount,
        incorrectCount: data.incorrectCount,
        weakConceptsDetected: data.weakConceptsDetected || [],
        completedAt: new Date(),
        questions: data.questions
          ? {
              create: data.questions.map((q) => ({
                question: q.question,
                options: q.options,
                correctOption: q.correctOption,
                selectedOption: q.selectedOption ?? null,
                isCorrect: q.isCorrect,
                explanation: q.explanation || null,
                conceptTested: q.conceptTested || null,
              })),
            }
          : undefined,
      },
      include: {
        questions: true,
      },
    });

    // 2. Upsert Topic Progress
    const existingProgress = await prisma.topicProgress.findUnique({
      where: {
        userId_topicSlug: {
          userId,
          topicSlug: data.topicSlug,
        },
      },
    });

    const attempts = (existingProgress?.attempts || 0) + 1;
    const correctAnswers = (existingProgress?.correctAnswers || 0) + data.correctCount;
    const totalQuestions = (existingProgress?.totalQuestions || 0) + data.totalQuestions;
    const calculatedMastery = Math.min(100, Math.round((correctAnswers / totalQuestions) * 100));

    const updatedWeak = Array.from(
      new Set([...(existingProgress?.weakConcepts || []), ...(data.weakConceptsDetected || [])])
    );
    const updatedStrong =
      data.scorePercentage >= 80
        ? Array.from(new Set([...(existingProgress?.strongConcepts || []), data.topicTitle]))
        : existingProgress?.strongConcepts || [];

    const updatedProgress = await prisma.topicProgress.upsert({
      where: {
        userId_topicSlug: {
          userId,
          topicSlug: data.topicSlug,
        },
      },
      update: {
        masteryScore: calculatedMastery,
        attempts,
        correctAnswers,
        totalQuestions,
        weakConcepts: updatedWeak,
        strongConcepts: updatedStrong,
        lastStudied: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        topic: data.topicTitle,
        topicSlug: data.topicSlug,
        category: data.category || "Computer Science",
        masteryScore: calculatedMastery,
        attempts: 1,
        correctAnswers: data.correctCount,
        totalQuestions: data.totalQuestions,
        weakConcepts: updatedWeak,
        strongConcepts: updatedStrong,
        lastStudied: new Date(),
      },
    });

    const attemptFormatted: DbQuizAttempt = {
      id: createdAttempt.id,
      userId: createdAttempt.userId,
      sessionId: createdAttempt.sessionId,
      topicSlug: createdAttempt.topicSlug,
      topicTitle: createdAttempt.topicTitle,
      category: createdAttempt.category,
      score: createdAttempt.score,
      scorePercentage: createdAttempt.score,
      accuracy: createdAttempt.accuracy,
      totalQuestions: createdAttempt.totalQuestions,
      correctCount: createdAttempt.correctCount,
      incorrectCount: createdAttempt.incorrectCount,
      weakConceptsDetected: createdAttempt.weakConceptsDetected,
      completedAt: createdAttempt.completedAt,
    };

    const progressFormatted: DbTopicProgress = {
      id: updatedProgress.id,
      userId: updatedProgress.userId,
      topic: updatedProgress.topic,
      topicSlug: updatedProgress.topicSlug,
      category: updatedProgress.category,
      masteryScore: updatedProgress.masteryScore,
      mastery: updatedProgress.masteryScore,
      attempts: updatedProgress.attempts,
      correctAnswers: updatedProgress.correctAnswers,
      totalQuestions: updatedProgress.totalQuestions,
      weakConcepts: updatedProgress.weakConcepts,
      strongConcepts: updatedProgress.strongConcepts,
      lastStudied: updatedProgress.lastStudied,
      lastStudiedAt: updatedProgress.lastStudied,
      createdAt: updatedProgress.createdAt,
      updatedAt: updatedProgress.updatedAt,
    };

    return { attempt: attemptFormatted, progress: progressFormatted };
  }

  async getTopicProgress(userId: string, topicSlug: string): Promise<DbTopicProgress | null> {
    const progress = await prisma.topicProgress.findUnique({
      where: {
        userId_topicSlug: {
          userId,
          topicSlug,
        },
      },
    });
    if (!progress) return null;

    return {
      id: progress.id,
      userId: progress.userId,
      topic: progress.topic,
      topicSlug: progress.topicSlug,
      category: progress.category,
      masteryScore: progress.masteryScore,
      mastery: progress.masteryScore,
      attempts: progress.attempts,
      correctAnswers: progress.correctAnswers,
      totalQuestions: progress.totalQuestions,
      weakConcepts: progress.weakConcepts,
      strongConcepts: progress.strongConcepts,
      lastStudied: progress.lastStudied,
      lastStudiedAt: progress.lastStudied,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  async getAllTopicProgress(userId: string): Promise<DbTopicProgress[]> {
    const list = await prisma.topicProgress.findMany({
      where: { userId },
      orderBy: { lastStudied: "desc" },
    });

    return list.map((p: any) => ({
      id: p.id,
      userId: p.userId,
      topic: p.topic,
      topicSlug: p.topicSlug,
      category: p.category,
      masteryScore: p.masteryScore,
      mastery: p.masteryScore,
      attempts: p.attempts,
      correctAnswers: p.correctAnswers,
      totalQuestions: p.totalQuestions,
      weakConcepts: p.weakConcepts,
      strongConcepts: p.strongConcepts,
      lastStudied: p.lastStudied,
      lastStudiedAt: p.lastStudied,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async getUserFullProfile(userId: string): Promise<UserFullProfile> {
    const user = (await this.getUser(userId)) || (await this.getOrCreateDefaultUser());
    const preference = await this.getPreferences(userId);

    const [sessions, topicProgress, quizAttempts, recommendations] = await Promise.all([
      prisma.learningSession.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 20,
      }),
      this.getAllTopicProgress(userId),
      prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 20,
      }),
      prisma.recommendation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return {
      user: user as DbUser,
      preference,
      sessions: sessions.map((s: any) => ({
        id: s.id,
        userId: s.userId,
        topic: s.topic,
        topicSlug: s.topicSlug || undefined,
        difficulty: s.difficulty,
        preference: s.preference,
        generatedContent: s.generatedContent,
        durationSeconds: s.durationSeconds,
        modeCompleted: s.modeCompleted as "analogy" | "flowchart" | "socratic" | "all",
        startedAt: s.startedAt,
        completedAt: s.completedAt,
      })),
      topicProgress,
      quizAttempts: quizAttempts.map((q: any) => ({
        id: q.id,
        userId: q.userId,
        sessionId: q.sessionId,
        topicSlug: q.topicSlug,
        topicTitle: q.topicTitle,
        category: q.category,
        score: q.score,
        scorePercentage: q.score,
        accuracy: q.accuracy,
        totalQuestions: q.totalQuestions,
        correctCount: q.correctCount,
        incorrectCount: q.incorrectCount,
        weakConceptsDetected: q.weakConceptsDetected,
        completedAt: q.completedAt,
      })),
      recommendations: recommendations.map((r: any) => ({
        id: r.id,
        userId: r.userId,
        topic: r.topic,
        topicSlug: r.topicSlug,
        category: r.category,
        reason: r.reason,
        difficulty: r.difficulty,
        recommendedMode: r.recommendedMode,
        priority: r.priority,
        createdAt: r.createdAt,
      })),
    };
  }
}
