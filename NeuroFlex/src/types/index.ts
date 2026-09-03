export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export type TopicCategory = 
  | "Computer Science" 
  | "Artificial Intelligence" 
  | "Biology & Life Sciences" 
  | "Physics & Quantum" 
  | "Mathematics";

export interface AnalogyBreakdownItem {
  conceptTerm: string;
  analogyEquivalent: string;
  explanation: string;
}

export interface AnalogyVariation {
  title: string;
  metaphor: string;
  narrative: string;
  breakdown: AnalogyBreakdownItem[];
  keyTakeaway: string;
}

export interface AnalogyRepresentation {
  title: string;
  simpleExplanation: string;
  metaphor: string;
  narrative: string;
  breakdown: AnalogyBreakdownItem[];
  keyTakeaway: string;
  simplerExplanation?: string;
  alternativeAnalogies?: AnalogyVariation[];
}

export interface FlowchartStep {
  id: string;
  nodeKey: string;
  label: string;
  description: string;
  phase: string;
}

export interface FlowchartRepresentation {
  diagramType: "flowchart" | "sequence" | "stateDiagram";
  mermaidCode: string;
  steps: FlowchartStep[];
  coreInsight: string;
}

export interface SocraticOption {
  id: string;
  text: string;
  explanation?: string;
  isCorrect: boolean;
}

export interface SocraticQuestion {
  id: string;
  question: string;
  options: SocraticOption[]; // Exactly 4 options for active recall
  correctAnswer?: number; // 0-3 index
  explanation: string;
  difficulty?: DifficultyLevel;
  conceptTested: string;
  context?: string;
  reflectionPrompt?: string;
  hint?: string;
}

export interface SocraticRepresentation {
  questions: SocraticQuestion[];
  overallSummary?: string;
}

export interface Topic {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: TopicCategory;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  tags: string[];
  representations: {
    analogy: AnalogyRepresentation;
    flowchart: FlowchartRepresentation;
    socratic: SocraticRepresentation;
  };
}

export interface UserProgress {
  completedTopicIds: string[];
  currentStreakDays: number;
  totalTimeMinutes: number;
  retentionScorePercentage: number;
  categoryMastery: Record<TopicCategory, number>; // 0 to 100
  recentActivity: {
    topicId: string;
    topicTitle: string;
    timestamp: string;
    score: number;
    modeCompleted: "analogy" | "flowchart" | "socratic" | "all";
  }[];
}

export interface UserSettings {
  theme: "dark" | "light" | "system";
  dyslexiaFont: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  autoPlayFlowcharts: boolean;
  defaultMode: "all" | "analogy" | "flowchart" | "socratic";
  aiProvider: "gemini" | "openai" | "claude" | "local";
  customApiKey?: string;
  preferredDifficulty: DifficultyLevel;
}
