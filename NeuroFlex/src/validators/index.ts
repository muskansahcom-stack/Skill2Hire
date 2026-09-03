import { z } from "zod";

export * from "@/lib/ai/schema";

export const SignupSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(60),
    email: z.string().trim().email("Please provide a valid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const OnboardingSchema = z.object({
  userId: z.string().optional(),
  fieldOfStudy: z.enum([
    "Computer Science",
    "Engineering",
    "Mathematics",
    "Science",
    "Business",
    "Other",
  ]),
  learningPreference: z.enum([
    "visual",
    "example-based",
    "question-based",
    "mixed",
  ]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  density: z.enum(["simple", "balanced", "detailed"]),
  learningGoal: z.enum([
    "Understand concepts",
    "Exam preparation",
    "Interview preparation",
    "Practice",
    "Academic improvement",
  ]),
});
export type OnboardingInput = z.infer<typeof OnboardingSchema>;

export const QuizSubmissionSchema = z.object({
  userId: z.string().default("user-demo-default"),
  topicSlug: z.string().min(1, "Topic slug is required"),
  topicTitle: z.string().min(1, "Topic title is required"),
  category: z.string().default("Computer Science"),
  totalQuestions: z.number().int().min(1),
  correctCount: z.number().int().min(0),
  incorrectCount: z.number().int().min(0),
  scorePercentage: z.number().int().min(0).max(100),
  weakConceptsDetected: z.array(z.string()).default([]),
});
export type QuizSubmission = z.infer<typeof QuizSubmissionSchema>;

export const SessionCreateSchema = z.object({
  userId: z.string().default("user-demo-default"),
  topicSlug: z.string().min(1),
  topicTitle: z.string().min(1),
  category: z.string().default("Computer Science"),
  durationSeconds: z.number().int().min(0).default(60),
  modeCompleted: z.enum(["analogy", "flowchart", "socratic", "all"]).default("all"),
});
export type SessionCreate = z.infer<typeof SessionCreateSchema>;

export const ProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(60),
  email: z.string().email("Invalid email format").optional(),
  avatarUrl: z.string().url().optional().nullable(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
