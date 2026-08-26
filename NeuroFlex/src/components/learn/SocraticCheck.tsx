"use client";

import React, { useState } from "react";
import { SocraticRepresentation } from "@/types";
import { HelpCircle, CheckCircle, XCircle, Lightbulb, MessageSquare, RefreshCw, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SocraticCheckProps {
  socratic: SocraticRepresentation;
}

export function SocraticCheck({ socratic }: SocraticCheckProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [userReflection, setUserReflection] = useState<Record<string, string>>({});
  const [submittedReflections, setSubmittedReflections] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleHint = (questionId: string) => {
    setShowHints((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleReflectionSubmit = (questionId: string) => {
    if (userReflection[questionId]?.trim()) {
      setSubmittedReflections((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowHints({});
    setUserReflection({});
    setSubmittedReflections({});
  };

  const totalQuestions = socratic.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = socratic.questions.filter((q) => {
    const selected = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return selected === correctOpt?.id;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header & Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="gap-1 px-3 py-1">
            <HelpCircle className="h-3 w-3 text-purple-400" />
            <span>Representation 3 of 3: Socratic Self-Check & Active Recall</span>
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Progress: {answeredCount}/{totalQuestions} Checkpoints
          </span>
          {answeredCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Socratic Questions List */}
      <div className="space-y-6">
        {socratic.questions.map((q, qIndex) => {
          const selectedOptId = selectedAnswers[q.id];
          const hasAnswered = !!selectedOptId;
          const selectedOption = q.options.find((opt) => opt.id === selectedOptId);
          const isHintVisible = showHints[q.id];
          const isReflectionDone = submittedReflections[q.id];

          return (
            <Card key={q.id} glass className="border-slate-800">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Checkpoint {qIndex + 1}
                  </span>
                  <button
                    onClick={() => toggleHint(q.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span>{isHintVisible ? "Hide Socratic Hint" : "Need a Hint?"}</span>
                  </button>
                </div>

                <CardTitle className="text-base md:text-lg leading-snug">
                  {q.question}
                </CardTitle>

                {q.context && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                    💡 Context: {q.context}
                  </p>
                )}

                {isHintVisible && (
                  <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-3 text-xs text-amber-200 animate-fadeIn">
                    <span className="font-semibold">Guide Hint: </span>
                    {q.hint}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Options list */}
                <div className="space-y-2.5">
                  {q.options.map((option) => {
                    const isSelected = selectedOptId === option.id;
                    let optionStyle =
                      "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80 text-slate-200";

                    if (hasAnswered) {
                      if (option.isCorrect) {
                        optionStyle =
                          "border-emerald-500/80 bg-emerald-950/30 text-emerald-100 shadow-sm shadow-emerald-500/20";
                      } else if (isSelected && !option.isCorrect) {
                        optionStyle =
                          "border-rose-500/80 bg-rose-950/30 text-rose-100";
                      } else {
                        optionStyle = "border-slate-800/50 bg-slate-900/20 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(q.id, option.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${optionStyle}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {hasAnswered ? (
                            option.isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : isSelected ? (
                              <XCircle className="h-4 w-4 text-rose-400" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-slate-700" />
                            )
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-600 group-hover:border-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs md:text-sm font-medium">{option.text}</p>
                          {hasAnswered && (isSelected || option.isCorrect) && (
                            <p
                              className={`text-xs pt-1 leading-relaxed ${
                                option.isCorrect ? "text-emerald-300" : "text-rose-300"
                              }`}
                            >
                              {option.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Reflection Prompt */}
                {hasAnswered && (
                  <div className="pt-3 border-t border-slate-800/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Socratic Reflection Prompt</span>
                    </div>
                    <p className="text-xs text-slate-300">{q.reflectionPrompt}</p>

                    {!isReflectionDone ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={userReflection[q.id] || ""}
                          onChange={(e) =>
                            setUserReflection((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="Synthesize your understanding in your own words..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleReflectionSubmit(q.id)}
                          disabled={!userReflection[q.id]?.trim()}
                          className="text-xs"
                        >
                          Lock Reflection
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-purple-950/20 border border-purple-800/40 p-2.5 text-xs text-purple-200">
                        <span className="font-semibold">Your Synthesis: </span>
                        {userReflection[q.id]}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Summary Card */}
      {answeredCount === totalQuestions && (
        <div className="flex items-center justify-between rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-950/80 via-purple-950/40 to-slate-900 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-500/20 p-3 border border-brand-500/30 text-brand-400">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Checkpoint Mastery Complete!</h3>
              <p className="text-xs md:text-sm text-slate-300">
                You got {correctCount} of {totalQuestions} correct. {socratic.overallSummary}
              </p>
            </div>
          </div>
          <Badge variant="brand" size="md">
            +50 Mastery XP
          </Badge>
        </div>
      )}
    </div>
  );
}
