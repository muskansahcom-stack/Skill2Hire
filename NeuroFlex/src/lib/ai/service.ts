import { AIProvider } from "./providers/base";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";
import { MockAIProvider, mockProvider } from "./providers/mock";
import { LearnResponse, Difficulty, LearningPreference, ExplanationDensity, EngineMode } from "./schema";

export interface AIServiceOptions {
  learningPreference?: LearningPreference;
  density?: ExplanationDensity;
  engineMode?: EngineMode;
  timeoutMs?: number;
  allowMockFallback?: boolean;
}

export interface AIServiceResult {
  response: LearnResponse;
  providerUsed: "gemini" | "openai" | "instant_demo" | "mock_fallback";
  fallbackOccurred: boolean;
  fallbackReason?: string;
}

export class AIService {
  private primaryProvider: AIProvider;
  private fallbackProvider: AIProvider;

  constructor() {
    this.fallbackProvider = mockProvider;
    this.primaryProvider = this.resolveProvider();
  }

  private resolveProvider(): AIProvider {
    const providerName = (process.env.AI_PROVIDER || "").toLowerCase().trim();
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (providerName === "gemini" && geminiKey) {
      return new GeminiProvider(geminiKey);
    }

    if (providerName === "openai" && openaiKey) {
      return new OpenAIProvider(openaiKey);
    }

    if (geminiKey) {
      return new GeminiProvider(geminiKey);
    }

    if (openaiKey) {
      return new OpenAIProvider(openaiKey);
    }

    return this.fallbackProvider;
  }

  async generate(
    topic: string,
    difficulty: Difficulty = "beginner",
    options: AIServiceOptions = {}
  ): Promise<AIServiceResult> {
    const {
      learningPreference = "mixed",
      density = "balanced",
      engineMode = "auto",
      timeoutMs = 25000,
      allowMockFallback = true,
    } = options;

    // 1. Direct Instant Demo Mode (For offline presentations or developer preference)
    if (engineMode === "demo") {
      const mockResult = await this.fallbackProvider.generateLearnContent(topic, difficulty, {
        learningPreference,
        density,
      });
      return {
        response: mockResult,
        providerUsed: "instant_demo",
        fallbackOccurred: false,
      };
    }

    // 2. Live AI Engine Execution with Robust Safety Guard
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      // If primary provider is mock (no keys), seamlessly execute mock without crash
      if (this.primaryProvider.name === "mock") {
        const result = await this.fallbackProvider.generateLearnContent(topic, difficulty, {
          learningPreference,
          density,
        });
        clearTimeout(timeoutId);
        return {
          response: result,
          providerUsed: "instant_demo",
          fallbackOccurred: true,
          fallbackReason: "Live AI keys not configured; using instant curated demo engine.",
        };
      }

      const result = await this.primaryProvider.generateLearnContent(topic, difficulty, {
        learningPreference,
        density,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return {
        response: result,
        providerUsed: this.primaryProvider.name as "gemini" | "openai",
        fallbackOccurred: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = controller.signal.aborted;
      const errorMessage = err instanceof Error ? err.message : "Unknown AI error";
      const reason = isTimeout ? "AI request timed out (25s)" : errorMessage;

      console.warn(
        `[AIService Demo Safety Guard] Live AI error (${this.primaryProvider.name}): ${reason}. Activating instant mock engine.`
      );

      if (allowMockFallback) {
        const fallbackResult = await this.fallbackProvider.generateLearnContent(
          topic,
          difficulty,
          { learningPreference, density }
        );
        return {
          response: fallbackResult,
          providerUsed: "mock_fallback",
          fallbackOccurred: true,
          fallbackReason: reason,
        };
      }

      if (isTimeout) {
        throw new Error("GATEWAY_TIMEOUT: AI generation exceeded time limit.");
      }

      throw err;
    }
  }
}

export const aiService = new AIService();
