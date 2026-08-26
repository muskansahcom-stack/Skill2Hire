import { Topic, DifficultyLevel } from "@/types";

export interface GenerateTopicRequest {
  topicPrompt: string;
  difficulty?: DifficultyLevel;
  targetAudience?: "Student" | "Educator" | "Self-Learner";
  focusArea?: string;
  apiKey?: string;
  provider?: "gemini" | "openai" | "claude" | "local";
}

export interface GenerateTopicResponse {
  success: boolean;
  data?: Topic;
  error?: string;
  source: "ai_generated" | "curated_fallback";
}

export interface AIServiceAdapter {
  generateTopicRepresentations(req: GenerateTopicRequest): Promise<GenerateTopicResponse>;
  evaluateSocraticResponse(questionId: string, userAnswer: string, context: string): Promise<{
    depthScore: number;
    conceptualFeedback: string;
    suggestedFollowUp: string;
  }>;
}
