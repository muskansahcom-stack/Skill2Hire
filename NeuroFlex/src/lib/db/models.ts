export interface DbUser {
  id: string;
  email: string | null;
  name: string;
  passwordHash?: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbUserPreference {
  id: string;
  userId: string;
  fieldOfStudy?: string;
  learningPreference: string;
  difficulty: string;
  density: string;
  learningGoal?: string;
  onboardingCompleted?: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Alias for backward compatibility
export type DbLearningPreference = DbUserPreference;

export interface DbTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  description?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DbLearningSession {
  id: string;
  userId: string;
  topic: string;
  topicSlug?: string;
  difficulty: string;
  preference: string;
  generatedContent?: any;
  startedAt: Date;
  completedAt?: Date | null;
  durationSeconds: number;
  modeCompleted: "analogy" | "flowchart" | "socratic" | "all";
}

export interface DbTopicProgress {
  id: string;
  userId: string;
  topic: string;
  topicSlug: string;
  topicTitle?: string; // alias
  category: string;
  masteryScore: number; // 0 to 100 percentage
  mastery: number; // 0 to 100 percentage
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
  weakConcepts: string[];
  strongConcepts: string[];
  lastStudied: Date;
  lastStudiedAt?: Date; // alias
  createdAt: Date;
  updatedAt: Date;
}

export interface DbQuizQuestion {
  id: string;
  quizAttemptId: string;
  question: string;
  options: string[];
  selectedOption?: number | null;
  correctOption: number;
  isCorrect: boolean;
  explanation?: string | null;
  conceptTested?: string | null;
  createdAt: Date;
}

export interface DbQuizAttempt {
  id: string;
  userId: string;
  sessionId?: string | null;
  topicSlug: string;
  topicTitle: string;
  category: string;
  score: number;
  scorePercentage: number; // 0 to 100 percentage
  accuracy: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  weakConceptsDetected: string[];
  questions?: DbQuizQuestion[];
  completedAt: Date;
  createdAt?: Date; // alias
}

export interface DbRecommendation {
  id: string;
  userId: string;
  topic: string;
  topicSlug: string;
  category: string;
  reason: string;
  difficulty: string;
  recommendedMode: string;
  priority: string;
  createdAt: Date;
}

export interface UserFullProfile {
  user: DbUser;
  preference: DbUserPreference;
  sessions: DbLearningSession[];
  topicProgress: DbTopicProgress[];
  quizAttempts: DbQuizAttempt[];
  recommendations?: DbRecommendation[];
}
