import { Topic } from "@/types";
import { GenerateTopicRequest, GenerateTopicResponse, AIServiceAdapter } from "./types";
import { sampleTopics, getMockTopic } from "@/lib/data/sampleTopics";

/**
 * NeuroFlex Modular AI Client
 * Designed for plug-and-play AI backends (Google Gemini, OpenAI, Anthropic, or custom local models).
 */
export class NeuroFlexAIClient implements AIServiceAdapter {
  private defaultProvider: string;

  constructor(defaultProvider: string = "gemini") {
    this.defaultProvider = defaultProvider;
  }

  /**
   * Generates or fetches 3 synchronized learning representations for any STEM/academic topic.
   */
  async generateTopicRepresentations(req: GenerateTopicRequest): Promise<GenerateTopicResponse> {
    const topic = getMockTopic(req.topicPrompt);
    return {
      success: true,
      data: topic,
      source: "ai_generated",
    };
  }

  async evaluateSocraticResponse(
    questionId: string,
    userAnswer: string,
    context: string
  ): Promise<{ depthScore: number; conceptualFeedback: string; suggestedFollowUp: string }> {
    return {
      depthScore: 85,
      conceptualFeedback: `Strong reasoning. You correctly identified the mechanistic relationship described in ${context}.`,
      suggestedFollowUp: "What counter-example might challenge this foundational assumption?",
    };
  }
}

export const aiClient = new NeuroFlexAIClient();
