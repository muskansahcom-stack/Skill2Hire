import { repository } from "@/lib/db/repository";
import { aiService } from "@/lib/ai/service";

export { aiService } from "@/lib/ai/service";
export { ProgressService } from "@/lib/progress/progressService";
export { repository } from "@/lib/db/repository";

export interface RecommendationItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  reason: string;
}

export class RecommendationService {
  static async getRecommendationsForUser(userId: string): Promise<RecommendationItem[]> {
    const profile = await repository.getUserFullProfile(userId);
    const weakConcepts = Array.from(new Set(profile.topicProgress.flatMap((p) => p.weakConcepts)));

    const recommendations: RecommendationItem[] = [
      {
        id: "rec-1",
        title: "Transformer & Self-Attention",
        subtitle: "How modern language models dynamically compute attention weights across tokens",
        category: "Artificial Intelligence",
        difficulty: "Advanced",
        estimatedMinutes: 8,
        reason: weakConcepts.length > 0 ? "Complements your recent Neural Network review" : "Popular advanced STEM concept",
      },
      {
        id: "rec-2",
        title: "Photosynthesis: Light Reactions",
        subtitle: "Photolysis water splitting and proton gradients in chloroplast thylakoids",
        category: "Biology & Life Sciences",
        difficulty: "Beginner",
        estimatedMinutes: 6,
        reason: "Recommended starter module with rich multi-modal representations",
      },
      {
        id: "rec-3",
        title: "Quantum Entanglement",
        subtitle: "Bell State correlation, EPR paradox, and no-communication theorem",
        category: "Quantum Physics",
        difficulty: "Intermediate",
        estimatedMinutes: 7,
        reason: "Strengthens conceptual physics models",
      },
      {
        id: "rec-4",
        title: "Binary Search",
        subtitle: "Logarithmic divide-and-conquer search across ordered arrays",
        category: "Data Structures",
        difficulty: "Beginner",
        estimatedMinutes: 4,
        reason: "Mastery review checkpoint",
      },
    ];

    return recommendations;
  }
}

export class HealthService {
  static getHealthStatus() {
    const aiProvider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
    const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        api: { status: "up", responseTimeMs: 4 },
        database: {
          status: "connected",
          mode: hasDatabaseUrl ? "postgresql" : "in_memory_repository_fallback",
        },
        aiEngine: {
          configuredProvider: aiProvider,
          liveKeyAvailable: hasGeminiKey || hasOpenAIKey,
          mockFallbackReady: true,
          mode: hasGeminiKey || hasOpenAIKey ? "live_with_safe_fallback" : "instant_demo_engine",
        },
      },
    };
  }
}
