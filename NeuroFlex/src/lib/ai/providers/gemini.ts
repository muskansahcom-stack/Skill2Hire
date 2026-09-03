import { AIProvider, buildSystemPrompt, buildUserPrompt } from "./base";
import { LearnResponse, Difficulty, LearningPreference, ExplanationDensity, LearnResponseSchema } from "../schema";
import { sanitizeMermaid } from "../mermaidSanitizer";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-2.0-flash") {
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
      throw new Error("GEMINI_API_KEY is not configured in server environment");
    }

    const { learningPreference = "mixed", density = "balanced", signal } = options;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(
      this.apiKey
    )}`;

    const systemPrompt = buildSystemPrompt(learningPreference, density);
    const userPrompt = buildUserPrompt(topic, difficulty, learningPreference, density);

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 2500,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED: Gemini API rate limit reached. Please try again shortly.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Gemini API returned error (${response.status})`;
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
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("MALFORMED_AI_RESPONSE: Gemini returned an empty response candidate.");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(candidateText);
    } catch {
      const cleaned = candidateText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
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
