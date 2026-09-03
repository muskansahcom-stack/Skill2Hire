import { AIProvider, buildSystemPrompt, buildUserPrompt } from "./base";
import { LearnResponse, Difficulty, LearningPreference, ExplanationDensity, LearnResponseSchema } from "../schema";
import { sanitizeMermaid } from "../mermaidSanitizer";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateLearnContent(
    topic: string,
    difficulty: Difficulty,
    options: {
      learningPreference?: LearningPreference;
      density?: ExplanationDensity;
      signal?: AbortSignal;
    } = {}
  ): Promise<LearnResponse> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured in server environment");
    }

    const { learningPreference = "mixed", density = "balanced", signal } = options;

    const endpoint = "https://api.openai.com/v1/chat/completions";
    const systemPrompt = buildSystemPrompt(learningPreference, density);
    const userPrompt = buildUserPrompt(topic, difficulty, learningPreference, density);

    const requestBody = {
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED: OpenAI API rate limit exceeded. Please try again shortly.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `OpenAI API returned error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMsg = errorJson.error.message;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("MALFORMED_AI_RESPONSE: OpenAI returned an empty response.");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      parsedJson = JSON.parse(cleaned);
    }

    if (typeof parsedJson === "object" && parsedJson !== null) {
      const obj = parsedJson as Record<string, any>;
      if (obj.visual && typeof obj.visual.mermaid === "string") {
        obj.visual.mermaid = sanitizeMermaid(obj.visual.mermaid, obj.topic || topic);
      }
      if (!Array.isArray(obj.keyConcepts)) {
        obj.keyConcepts = [obj.topic || topic, "STEM", "Core Principles"];
      }
      if (obj.visual && !Array.isArray(obj.visual.steps)) {
        obj.visual.steps = [];
      }
      if (typeof obj.difficulty === "string") {
        obj.difficulty = obj.difficulty.toLowerCase();
      }
    }

    return LearnResponseSchema.parse(parsedJson);
  }
}
