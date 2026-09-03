import { AIProvider } from "./base";
import { LearnResponse, Difficulty, LearningPreference, ExplanationDensity, LearnResponseSchema } from "../schema";
import { getMockTopic } from "@/lib/data/sampleTopics";
import { sanitizeMermaid } from "../mermaidSanitizer";

export class MockAIProvider implements AIProvider {
  name = "mock";

  async generateLearnContent(
    topic: string,
    difficulty: Difficulty,
    options: {
      learningPreference?: LearningPreference;
      density?: ExplanationDensity;
      signal?: AbortSignal;
    } = {}
  ): Promise<LearnResponse> {
    const { learningPreference = "mixed", density = "balanced", signal } = options;

    if (signal?.aborted) {
      throw new Error("Request aborted");
    }

    const mockData = getMockTopic(topic);

    // Adapt narrative based on density preference
    let narrative = mockData.representations.analogy.narrative;
    let summary = mockData.subtitle;

    if (density === "simple" && mockData.representations.analogy.simplerExplanation) {
      narrative = `${mockData.representations.analogy.simplerExplanation}\n\n${mockData.representations.analogy.metaphor}`;
      summary = `Simple intuitive overview: ${mockData.representations.analogy.simplerExplanation}`;
    } else if (density === "detailed") {
      narrative = `${mockData.representations.analogy.narrative}\n\nKey Mechanistic Principle: Under standard conditions, ${mockData.title} coordinates state synchronization across boundary layers to maintain algorithmic and physical stability without data loss.`;
      summary = `Comprehensive architectural breakdown of ${mockData.title} with boundary state transitions and causality analysis.`;
    }

    // Format analogy mapping
    const mapping = mockData.representations.analogy.breakdown.map((item) => ({
      concept: item.conceptTerm,
      realWorldEquivalent: item.analogyEquivalent,
      explanation: item.explanation,
    }));

    // Format Socratic questions sequence
    const rawQuestions = mockData.representations.socratic.questions || [];
    const questions = rawQuestions.map((q) => {
      const opts = q.options.map((o) => o.text);
      const options4: [string, string, string, string] = [
        opts[0] || "State transition verified.",
        opts[1] || "Alternative boundary condition.",
        opts[2] || "Unintended exception.",
        opts[3] || "Invalid terminal configuration.",
      ];
      let cIdx = q.options.findIndex((o) => o.isCorrect);
      if (cIdx < 0 || cIdx > 3) cIdx = 0;

      return {
        question: q.question,
        options: options4,
        correctAnswer: cIdx,
        explanation: q.explanation || "Correct mechanism identified.",
        difficulty,
      };
    });

    const primaryQ = questions[0] || {
      question: `What is the core principle of ${mockData.title}?`,
      options: [
        "State transitions validated across boundary conditions.",
        "Random memory allocation without deallocation.",
        "Bypassing validation checks when load spikes.",
        "Freezing CPU execution threads.",
      ],
      correctAnswer: 0,
      explanation: "Validation ensures correctness across execution cycles.",
      difficulty,
    };

    const sanitizedMermaid = sanitizeMermaid(
      mockData.representations.flowchart.mermaidCode,
      mockData.title
    );

    const rawResponse = {
      topic: mockData.title,
      summary,
      keyConcepts: [
        mockData.category,
        mockData.title,
        mockData.representations.analogy.metaphor,
      ],
      analogy: {
        title: mockData.representations.analogy.title,
        story: narrative,
        mapping:
          mapping.length > 0
            ? mapping
            : [
                { concept: "Input Vector", realWorldEquivalent: "Incoming Signal" },
                { concept: "Transformation Engine", realWorldEquivalent: "Processing Conveyor" },
              ],
        keyTakeaway: mockData.representations.analogy.keyTakeaway,
      },
      visual: {
        title: `${mockData.title} Flowchart (${learningPreference.toUpperCase()} Adaptation)`,
        mermaid: sanitizedMermaid,
        steps: mockData.representations.flowchart.steps.map((s) => s.description || s.label),
      },
      socratic: {
        questions: questions.length > 0 ? questions : [primaryQ],
        conceptualSynthesis: summary,
        overallSummary: summary,
      },
      difficulty,
      estimatedMinutes: mockData.estimatedMinutes || 5,
    };

    return LearnResponseSchema.parse(rawResponse);
  }
}

export const mockProvider = new MockAIProvider();
