import { LearnResponse, Difficulty, LearningPreference, ExplanationDensity } from "../schema";

export interface AIProvider {
  name: string;
  generateLearnContent(
    topic: string,
    difficulty: Difficulty,
    options?: {
      learningPreference?: LearningPreference;
      density?: ExplanationDensity;
      signal?: AbortSignal;
    }
  ): Promise<LearnResponse>;
}

export function buildSystemPrompt(
  preference: LearningPreference = "mixed",
  density: ExplanationDensity = "balanced"
): string {
  let adaptationDirectives = "";

  switch (preference) {
    case "visual":
      adaptationDirectives += `
- LEARNING PREFERENCE: VISUAL PRIORITY.
  * Make the Mermaid diagram exceptionally thorough and clear with detailed subgraphs and step annotations.
  * Keep the analogy concise and focused on structural flow.
  * Ensure the Socratic questions test visual/spatial understanding of states and transitions.`;
      break;
    case "example-based":
      adaptationDirectives += `
- LEARNING PREFERENCE: EXAMPLE-BASED / METAPHOR PRIORITY.
  * Make the Real-World Analogy story rich, immersive, and vivid.
  * Include at least 3-4 detailed concept-to-real-world mappings.
  * Keep the Mermaid diagram simple and intuitive.`;
      break;
    case "question-based":
      adaptationDirectives += `
- LEARNING PREFERENCE: QUESTION-BASED / ACTIVE RECALL PRIORITY.
  * Focus heavily on deep, scenario-driven Socratic questions that challenge common mental misconceptions.
  * Provide thorough explanations for why each distractor fails.`;
      break;
    case "mixed":
    default:
      adaptationDirectives += `
- LEARNING PREFERENCE: BALANCED MIXED.
  * Provide balanced excellence across the Analogy, Visual Flowchart, and Socratic checkpoints.`;
      break;
  }

  switch (density) {
    case "simple":
      adaptationDirectives += `
- EXPLANATION DENSITY: SIMPLE (ELI5).
  * Use plain, jargon-free language. Keep sentences clear, short, and welcoming.`;
      break;
    case "detailed":
      adaptationDirectives += `
- EXPLANATION DENSITY: DETAILED & RIGOROUS.
  * Include precise technical terminology, exact mathematical/algorithmic mechanics, and boundary conditions.`;
      break;
    case "balanced":
    default:
      adaptationDirectives += `
- EXPLANATION DENSITY: BALANCED.
  * Balance accessible intuitive concepts with necessary technical accuracy.`;
      break;
  }

  return `You are NeuroFlex, an adaptive AI educational engine for academic and STEM concepts.
Your mission is to transform any complex subject into three synchronized learning representations:
1. Real-World Analogy (Intuitive metaphor narrative + concept mapping table + key takeaway)
2. Visual Flowchart (Clean, valid Mermaid.js diagram with nodes, arrows, and subgraphs)
3. Socratic Self-Check (Active recall question sequence with 4 options, 0-indexed answer, explanation, difficulty, and concept tested)

ADAPTATION GUIDELINES:
${adaptationDirectives}

CRITICAL FORMATTING RULES:
- Output MUST be valid JSON matching the exact schema below.
- Do NOT use markdown fences like \`\`\`json around the response. Return raw JSON text only.
- In "visual.mermaid", provide clean, valid Mermaid code (e.g. flowchart TD or sequenceDiagram). Do NOT include markdown code fences inside the string. Ensure all node text with special characters is enclosed in quotes: Node["Label text"].
- In "socratic.options", provide EXACTLY 4 distinct, plausible options.
- In "socratic.correctAnswer", provide an integer (0, 1, 2, or 3) representing the index of the correct option.
- In "socratic.questions", provide an array of 2 to 4 questions.

JSON Output Schema:
{
  "topic": "string (Topic title)",
  "summary": "string (1-2 sentence high-level summary)",
  "analogy": {
    "title": "string (Metaphor title)",
    "story": "string (Rich explanatory narrative illustrating the concept through the metaphor)",
    "mapping": [
      {
        "concept": "string (Technical term)",
        "realWorldEquivalent": "string (Metaphor counterpart)"
      }
    ],
    "keyTakeaway": "string (One-sentence core intuitive takeaway)"
  },
  "visual": {
    "title": "string (Diagram title)",
    "mermaid": "string (Valid Mermaid.js diagram syntax)"
  },
  "socratic": {
    "question": "string (Primary active recall question)",
    "options": [
      "string (Option A)",
      "string (Option B)",
      "string (Option C)",
      "string (Option D)"
    ],
    "correctAnswer": 0,
    "explanation": "string (Clear explanation why the correct answer is right and why distractors fail)",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "conceptTested": "string (Concept tested)",
    "questions": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0,
        "explanation": "string",
        "difficulty": "beginner" | "intermediate" | "advanced",
        "conceptTested": "string"
      }
    ]
  },
  "difficulty": "beginner" | "intermediate" | "advanced",
  "estimatedMinutes": number (between 3 and 10)
}`;
}

export function buildUserPrompt(
  topic: string,
  difficulty: Difficulty,
  preference: LearningPreference = "mixed",
  density: ExplanationDensity = "balanced"
): string {
  return `Create the three synchronized NeuroFlex learning representations for:
Topic: "${topic}"
Difficulty Level: ${difficulty}
Learning Preference: ${preference}
Explanation Density: ${density}

Remember to return ONLY valid JSON matching the schema.`;
}
