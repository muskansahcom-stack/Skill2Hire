"use client";

import React, { useState } from "react";
import { SocraticRepresentation } from "@/types";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SocraticTabProps {
  socratic: SocraticRepresentation;
  topicTitle?: string;
}

export function SocraticTab({ socratic, topicTitle }: SocraticTabProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [scoreHistory, setScoreHistory] = useState<Record<number, boolean>>({});

  const questions = socratic.questions;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const hasAnswered = selectedOptionId !== null;
  const selectedOption = currentQuestion.options.find((opt) => opt.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return; // Prevent changing after answer
    setSelectedOptionId(optionId);
    const chosen = currentQuestion.options.find((o) => o.id === optionId);
    setScoreHistory((prev) => ({
      ...prev,
      [currentQuestionIndex]: chosen?.isCorrect ?? false,
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setShowHint(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setShowHint(false);
    setScoreHistory({});
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="gap-1.5 px-3 py-1">
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
            <span>Mode 3: Socratic Self-Check</span>
          </Badge>
          <span className="text-xs font-mono text-slate-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentQuestion.hint && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              icon={<Lightbulb className="h-4 w-4 text-amber-400" />}
              className="text-xs text-slate-300 hover:text-amber-300"
            >
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </Button>
          )}

          {Object.keys(scoreHistory).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetQuiz}
              icon={<RefreshCw className="h-3 w-3 text-slate-400" />}
              className="text-xs text-slate-400 hover:text-white"
            >
              Restart
            </Button>
          )}
        </div>
      </div>

      {/* Main Interactive Question Card */}
      <Card glass className="border-slate-800">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Checkpoint Challenge
            </span>
            <div className="flex items-center gap-1">
              {questions.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentQuestionIndex
                      ? "w-6 bg-purple-500"
                      : scoreHistory[idx] === true
                      ? "w-2 bg-emerald-500"
                      : scoreHistory[idx] === false
                      ? "w-2 bg-rose-500"
                      : "w-2 bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <CardTitle className="text-lg md:text-xl leading-snug font-sans">
            {currentQuestion.question}
          </CardTitle>

          {currentQuestion.context && (
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-slate-300">Context: </span>
              {currentQuestion.context}
            </div>
          )}

          {showHint && currentQuestion.hint && (
            <div className="rounded-xl bg-amber-950/25 border border-amber-500/30 p-3 text-xs text-amber-200 animate-fadeIn">
              <span className="font-semibold text-amber-300">💡 Socratic Guide Hint: </span>
              {currentQuestion.hint}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* 4 Multiple Choice Options */}
          <div className="space-y-3" role="radiogroup" aria-label="Socratic question options">
            {currentQuestion.options.map((option, oIdx) => {
              const isSelected = selectedOptionId === option.id;
              const optionLetters = ["A", "B", "C", "D"];

              let optionButtonClass =
                "border-slate-800/80 bg-slate-900/40 hover:border-purple-500/50 hover:bg-slate-900/80 text-slate-200";

              if (hasAnswered) {
                if (option.isCorrect) {
                  optionButtonClass =
                    "border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50";
                } else if (isSelected && !option.isCorrect) {
                  optionButtonClass =
                    "border-rose-500 bg-rose-950/40 text-rose-100 ring-1 ring-rose-500/50";
                } else {
                  optionButtonClass = "border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-50";
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/60 ${optionButtonClass}`}
                >
                  <div
                    className={`h-6 w-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
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
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isSelected ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        optionLetters[oIdx]
                      )
                    ) : (
                      optionLetters[oIdx]
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium leading-relaxed">{option.text}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Answer Explanation & Feedback after selection */}
          {hasAnswered && (
            <div className="space-y-4 pt-4 border-t border-slate-800/80 animate-fadeIn">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isCorrect
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">
                    {isCorrect ? "Correct! Excellent Conceptual Understanding." : "Not quite right."}
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-slate-300">
                    {selectedOption?.explanation}
                  </p>
                </div>
              </div>

              {/* Next Question / Continue button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {questions.length > 1
                    ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                    : "Checkpoint complete"}
                </span>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNextQuestion}
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Review Next Question"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Socratic Overall Summary */}
      {socratic.overallSummary && (
        <div className="flex items-start gap-4 rounded-xl border border-purple-500/30 bg-purple-950/20 p-5 backdrop-blur-md">
          <div className="rounded-lg bg-purple-500/10 p-2.5 border border-purple-500/20 shrink-0 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              Socratic Synthesis
            </h4>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
              {socratic.overallSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
