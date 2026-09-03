"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SocraticRepresentation, SocraticQuestion } from "@/types";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Network,
  RotateCcw,
  Check,
  Compass,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SocraticTabProps {
  socratic: SocraticRepresentation;
  topicTitle?: string;
  topicSlug?: string;
  category?: string;
  onSwitchTab?: (tab: "analogy" | "visual" | "socratic") => void;
  onContinueLearning?: () => void;
}

export function SocraticTab({
  socratic,
  topicTitle = "Academic Concept",
  topicSlug,
  category = "Computer Science",
  onSwitchTab,
  onContinueLearning,
}: SocraticTabProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answersState, setAnswersState] = useState<
    Record<
      number,
      {
        selectedOptionId: string;
        isCorrect: boolean;
        conceptTested: string;
      }
    >
  >({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasPersisted, setHasPersisted] = useState<boolean>(false);

  const questions: SocraticQuestion[] =
    socratic.questions && socratic.questions.length > 0
      ? socratic.questions
      : [
          {
            id: "fallback-q",
            question: "What is the primary governing principle of this system?",
            options: [
              { id: "opt-1", text: "Synchronized state transitions under verified boundary conditions.", isCorrect: true },
              { id: "opt-2", text: "Arbitrary random memory allocations without cleanup.", isCorrect: false },
              { id: "opt-3", text: "Ignoring input validation checks when network load spikes.", isCorrect: false },
              { id: "opt-4", text: "Permanent freezing of hardware threads.", isCorrect: false },
            ],
            correctAnswer: 0,
            explanation: "Verified conditions and coordinated transitions guarantee reliable execution.",
            difficulty: "Beginner",
            conceptTested: "State transition integrity",
          },
        ];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const currentAnswerRecord = answersState[currentQuestionIndex];
  const hasAnswered = currentAnswerRecord !== undefined;
  const isCurrentCorrect = currentAnswerRecord?.isCorrect ?? false;

  // Tally metrics
  const answeredCount = Object.keys(answersState).length;
  const correctCount = Object.values(answersState).filter((a) => a.isCorrect).length;
  const incorrectCount = answeredCount - correctCount;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Strong & weak concepts tracking
  const weakConcepts = Array.from(
    new Set(
      Object.values(answersState)
        .filter((a) => !a.isCorrect)
        .map((a) => a.conceptTested)
    )
  );

  const strongConcepts = Array.from(
    new Set(
      Object.values(answersState)
        .filter((a) => a.isCorrect)
        .map((a) => a.conceptTested)
    )
  ).filter((c) => !weakConcepts.includes(c));

  // Determine recommended review based on mistakes
  const recommendedReview =
    weakConcepts.length > 0
      ? "Review Visual Flowchart Mode to inspect the step-by-step state transitions and causality."
      : "Review Real-World Analogy Mode to reinforce intuition and connect with higher-level mental models.";

  // Persist quiz attempt to the database when complete
  useEffect(() => {
    if (isQuizCompleted && !hasPersisted) {
      setHasPersisted(true);
      const safeSlug = topicSlug || topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-demo-default",
          topicSlug: safeSlug,
          topicTitle,
          category,
          scorePercentage,
          totalQuestions,
          correctCount,
          incorrectCount,
          weakConceptsDetected: weakConcepts,
        }),
      }).catch((err) => {
        console.warn("[SocraticTab] Non-blocking quiz persistence log:", err);
      });
    }
  }, [
    isQuizCompleted,
    hasPersisted,
    topicSlug,
    topicTitle,
    category,
    scorePercentage,
    totalQuestions,
    correctCount,
    incorrectCount,
    weakConcepts,
  ]);

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;

    const selectedOpt = currentQuestion.options.find((o) => o.id === optionId);
    const isCorrect = selectedOpt?.isCorrect ?? false;

    setAnswersState((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedOptionId: optionId,
        isCorrect,
        conceptTested: currentQuestion.conceptTested || "Core Mechanics",
      },
    }));
    setSelectedOptionId(optionId);
  };

  const handleNextQuestion = () => {
    setShowHint(false);
    setSelectedOptionId(null);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswersState({});
    setIsQuizCompleted(false);
    setShowHint(false);
    setHasPersisted(false);
  };

  const handleContinueLearning = () => {
    if (onContinueLearning) {
      onContinueLearning();
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" role="region" aria-label="Socratic Active Recall Section">
      {/* ════════════ TOP STATUS BAR ════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2.5">
          <Badge variant="purple" className="gap-1.5 px-3 py-1 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
            <span>Socratic Self-Check</span>
          </Badge>
          {!isQuizCompleted && (
            <span
              className="text-xs font-mono text-slate-200 font-semibold bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 shadow-sm"
              aria-live="polite"
            >
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          )}
        </div>

        {/* Live Score Tally */}
        <div className="flex items-center gap-3 text-xs" aria-label="Current Score Status">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{correctCount} Correct</span>
            </span>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{incorrectCount} Incorrect</span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleTryAgain}
            icon={<RotateCcw className="h-3 w-3 text-slate-400" aria-hidden="true" />}
            className="text-xs text-slate-400 hover:text-white"
            title="Reset Quiz"
            aria-label="Reset Quiz"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ════════════ PROGRESS BAR ════════════ */}
      <div
        className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={currentQuestionIndex + (hasAnswered ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-brand-500 to-accent-cyan transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100}%`,
          }}
        />
      </div>

      {/* ════════════ VIEW A: ACTIVE QUESTION STATE ════════════ */}
      {!isQuizCompleted && (
        <Card glass className="border-slate-800 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="sm">
                  {currentQuestion.difficulty || "Beginner"} Tier
                </Badge>
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider font-mono">
                  Concept: {currentQuestion.conceptTested}
                </span>
              </div>

              {currentQuestion.hint && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer p-1 rounded-lg"
                  aria-expanded={showHint}
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <CardTitle className="text-lg sm:text-xl font-bold text-white leading-snug font-sans pt-1">
              {currentQuestion.question}
            </CardTitle>

            {/* Hint Box (if toggled) */}
            {showHint && currentQuestion.hint && (
              <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-3.5 text-xs text-amber-200 animate-fadeIn">
                <span className="font-semibold text-amber-300">💡 Socratic Clue: </span>
                {currentQuestion.hint}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* 4 Interactive Option Cards: A, B, C, D */}
            <div
              className="space-y-2.5"
              role="radiogroup"
              aria-label={`Options for: ${currentQuestion.question}`}
            >
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected =
                  (currentAnswerRecord?.selectedOptionId || selectedOptionId) === option.id;
                const optionLetters = ["A", "B", "C", "D"];

                let optionClass =
                  "border-slate-800/80 bg-slate-900/40 hover:border-purple-500/60 hover:bg-slate-900/80 text-slate-200";

                // Reveal answers ONLY after student makes a selection
                if (hasAnswered) {
                  if (option.isCorrect) {
                    optionClass =
                      "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/80";
                  } else if (isSelected && !option.isCorrect) {
                    optionClass =
                      "border-rose-500 bg-rose-950/40 text-rose-100 ring-2 ring-rose-500/80";
                  } else {
                    optionClass = "border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-40";
                  }
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 ${optionClass}`}
                  >
                    {/* Visual A, B, C, D Badge */}
                    <div
                      className={`h-7 w-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                        hasAnswered
                          ? option.isCorrect
                            ? "bg-emerald-500 border-emerald-400 text-white"
                            : isSelected
                            ? "bg-rose-500 border-rose-400 text-white"
                            : "bg-slate-800 border-slate-700 text-slate-500"
                          : "bg-slate-800/80 border-slate-700 text-slate-300"
                      }`}
                    >
                      {hasAnswered ? (
                        option.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        ) : isSelected ? (
                          <XCircle className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          optionLetters[oIdx]
                        )
                      ) : (
                        optionLetters[oIdx]
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {option.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Immediate Explanation & Feedback (Revealed after answering) */}
            {hasAnswered && (
              <div
                className="space-y-4 pt-4 border-t border-slate-800/80 animate-fadeIn"
                role="status"
                aria-live="polite"
              >
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    isCurrentCorrect
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                  }`}
                >
                  {isCurrentCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold">
                        {isCurrentCorrect ? "Correct Answer" : "Incorrect"}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                        Tested: {currentQuestion.conceptTested}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                {/* Next Question Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {currentQuestionIndex + 1} of {totalQuestions} Answered
                  </span>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNextQuestion}
                    icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    iconPosition="right"
                    className="font-semibold text-xs rounded-xl"
                  >
                    {currentQuestionIndex < totalQuestions - 1
                      ? "Next Question"
                      : "Complete Learning Check"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ════════════ VIEW B: LEARNING CHECK COMPLETE SUMMARY ════════════ */}
      {isQuizCompleted && (
        <div
          className="space-y-6 animate-fadeIn"
          role="region"
          aria-label="Quiz Completion Mastery Summary"
        >
          <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-500/20 shrink-0">
                  <Award className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                    Learning Check Complete
                  </h3>
                  <p className="text-xs text-slate-300">
                    Active recall analysis saved for {topicTitle}.
                  </p>
                </div>
              </div>

              <Badge variant="purple" size="md" className="text-sm px-3.5 py-1 font-mono self-start sm:self-center">
                {scorePercentage}% Accuracy
              </Badge>
            </div>

            {/* Score & Accuracy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-400">Score</span>
                <div className="text-3xl font-black text-white font-display">
                  {correctCount} / {totalQuestions}
                </div>
                <p className="text-xs text-slate-400">
                  {correctCount === totalQuestions
                    ? "Flawless score! All concepts mastered on first try."
                    : `${incorrectCount} question(s) flagged for reinforcement.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-400">Accuracy</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white font-display">
                    {scorePercentage}%
                  </span>
                  <Badge variant={scorePercentage >= 80 ? "emerald" : "amber"} size="sm">
                    {scorePercentage >= 80 ? "Mastered" : "Review Suggested"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {scorePercentage >= 80
                    ? "Deep conceptual retention verified."
                    : "Review suggested to solidify edge cases."}
                </p>
              </div>
            </div>

            {/* Strong Concepts List */}
            {strongConcepts.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>Strong concepts:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {strongConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/40 border border-emerald-600/40 text-emerald-200 font-medium"
                    >
                      ✓ {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weak Concepts List */}
            {weakConcepts.length > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span>Weak concepts:</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {weakConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-900/40 border border-amber-600/40 text-amber-200 font-medium"
                    >
                      ⚠ {concept}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
                <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold">
                  Zero weak concepts detected! All active recall checkpoints passed.
                </span>
              </div>
            )}

            {/* Recommended Review Insight */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Recommended Review:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {recommendedReview}
              </p>
            </div>

            {/* 4 Action Buttons: [Review Visual], [Review Analogy], [Try Again], [Continue Learning] */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* [Review Visual] */}
                {onSwitchTab && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onSwitchTab("visual")}
                    icon={<Network className="h-4 w-4 text-accent-cyan" aria-hidden="true" />}
                    className="text-xs font-semibold hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    Review Visual
                  </Button>
                )}

                {/* [Review Analogy] */}
                {onSwitchTab && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => onSwitchTab("analogy")}
                    icon={<BookOpen className="h-4 w-4 text-brand-300" aria-hidden="true" />}
                    className="text-xs font-semibold hover:border-brand-500/40 hover:text-brand-300"
                  >
                    Review Analogy
                  </Button>
                )}

                {/* [Try Again] */}
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleTryAgain}
                  icon={<RotateCcw className="h-4 w-4 text-purple-400" aria-hidden="true" />}
                  className="text-xs font-semibold"
                >
                  Try Again
                </Button>
              </div>

              {/* [Continue Learning] */}
              <Button
                variant="primary"
                size="md"
                onClick={handleContinueLearning}
                icon={<ArrowRight className="h-4 w-4 text-white" aria-hidden="true" />}
                iconPosition="right"
                className="text-xs font-semibold rounded-xl"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocraticTab;
