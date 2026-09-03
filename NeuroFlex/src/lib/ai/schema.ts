import { z } from "zod";

export const DifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const LearningPreferenceSchema = z.enum([
  "visual",
  "analogy",
  "example-based",
  "socratic",
  "question-based",
  "mixed",
]);
export type LearningPreference = z.infer<typeof LearningPreferenceSchema>;

export const ExplanationDensitySchema = z.enum(["simple", "balanced", "detailed"]);
export type ExplanationDensity = z.infer<typeof ExplanationDensitySchema>;

export const EngineModeSchema = z.enum(["auto", "live", "demo"]).default("auto");
export type EngineMode = z.infer<typeof EngineModeSchema>;

export const LearnRequestSchema = z.object({
  topic: z.string().trim().min(1, "Topic cannot be empty").max(200, "Topic is too long"),
  difficulty: DifficultySchema.default("beginner"),
  preference: LearningPreferenceSchema.optional(),
  learningPreference: LearningPreferenceSchema.optional(),
  density: ExplanationDensitySchema.default("balanced"),
  mode: EngineModeSchema.optional(),
  engineMode: EngineModeSchema.optional(),
}).transform((data) => ({
  topic: data.topic,
  difficulty: data.difficulty,
  preference: (data.preference || data.learningPreference || "mixed") as LearningPreference,
  density: data.density,
  mode: (data.mode || data.engineMode || "auto") as EngineMode,
}));
export type LearnRequest = z.infer<typeof LearnRequestSchema>;

export const ConceptMappingItemSchema = z.object({
  concept: z.string().min(1, "Concept term cannot be empty"),
  realWorldEquivalent: z.string().min(1, "Real-world equivalent cannot be empty"),
  explanation: z.string().optional(),
});
export type ConceptMappingItem = z.infer<typeof ConceptMappingItemSchema>;

export const AnalogyOutputSchema = z.object({
  title: z.string().min(1, "Analogy title is required"),
  story: z.string().min(10, "Analogy story is required"),
  mapping: z.array(ConceptMappingItemSchema).min(1, "At least one mapping item is required"),
  keyTakeaway: z.string().min(5, "Key takeaway is required"),
});
export type AnalogyOutput = z.infer<typeof AnalogyOutputSchema>;

export const VisualStepItemSchema = z.union([
  z.string(),
  z.object({
    stepNumber: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
]);

export const VisualOutputSchema = z.object({
  title: z.string().min(1, "Visual title is required"),
  mermaid: z.string().min(5, "Mermaid diagram code is required"),
  steps: z.array(VisualStepItemSchema).default([]),
});
export type VisualOutput = z.infer<typeof VisualOutputSchema>;

export const SocraticQuestionItemSchema = z.object({
  question: z.string().min(5, "Socratic question is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
  correctAnswer: z.number().int().min(0).max(3, "correctAnswer must be index 0, 1, 2, or 3"),
  explanation: z.string().min(5, "Explanation is required"),
  difficulty: z.string().default("beginner"),
});
export type SocraticQuestionItem = z.infer<typeof SocraticQuestionItemSchema>;

export const SocraticOutputSchema = z.object({
  questions: z.array(SocraticQuestionItemSchema).min(1, "At least one question is required"),
  conceptualSynthesis: z.string().optional(),
  overallSummary: z.string().optional(),
});
export type SocraticOutput = z.infer<typeof SocraticOutputSchema>;

export const LearnResponseSchema = z.object({
  topic: z.string().min(1),
  summary: z.string().min(5),
  keyConcepts: z.array(z.string()).default([]),
  analogy: AnalogyOutputSchema,
  visual: VisualOutputSchema,
  socratic: SocraticOutputSchema,
  difficulty: DifficultySchema.default("beginner"),
  estimatedMinutes: z.number().int().min(1).max(60).default(5),
});
export type LearnResponse = z.infer<typeof LearnResponseSchema>;
