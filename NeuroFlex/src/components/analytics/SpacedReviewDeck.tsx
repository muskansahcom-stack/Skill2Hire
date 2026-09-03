"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ReviewCard {
  id: string;
  question: string;
  answer: string;
  topicTitle: string;
  category: string;
  difficulty: string;
  rationale: string;
}

const DEFAULT_REVIEW_CARDS: ReviewCard[] = [
  {
    id: "rc-1",
    question: "Why does the TCP Handshake require 3 packets rather than 2?",
    answer: "To reliably synchronize sequence numbers bidirectionally so both client and server verify mutual readiness before allocating socket memory.",
    topicTitle: "TCP Three-Way Handshake",
    category: "Computer Networks",
    difficulty: "Beginner",
    rationale: "Prevents delayed duplicate packets from causing phantom server connections.",
  },
  {
    id: "rc-2",
    question: "What gives Binary Search its O(log n) time complexity?",
    answer: "Every comparison halves the remaining search space, halving problem size geometrically.",
    topicTitle: "Binary Search",
    category: "Data Structures",
    difficulty: "Beginner",
    rationale: "Requires array elements to be monotonically sorted.",
  },
  {
    id: "rc-3",
    question: "What is the primary function of Thylakoids in Photosynthesis?",
    answer: "To host light-dependent reactions, splitting H₂O into oxygen and generating ATP & NADPH.",
    topicTitle: "Photosynthesis",
    category: "Biology",
    difficulty: "Beginner",
    rationale: "Powers the Calvin Cycle in the stroma.",
  },
  {
    id: "rc-4",
    question: "What is Backpropagation in Neural Networks?",
    answer: "Applying the chain rule of calculus backward from output loss to compute weight gradient updates.",
    topicTitle: "Neural Networks",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    rationale: "Iteratively minimizes the loss objective via gradient descent.",
  },
];

export function SpacedReviewDeck() {
  const [cards, setCards] = useState<ReviewCard[]>(DEFAULT_REVIEW_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setMasteredIds((prev) => [...prev, currentCard.id]);
    }
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setMasteredIds([]);
  };

  return (
    <Card glass className="p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Daily Spaced Repetition Review Deck
            </h3>
            <p className="text-xs text-slate-400">
              Active retrieval flashcards generated from tested concepts.
            </p>
          </div>
        </div>

        {!completed && (
          <Badge variant="purple" size="sm" className="font-mono">
            Card {currentIndex + 1} of {cards.length}
          </Badge>
        )}
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Flip Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer group relative min-h-[200px] rounded-2xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 flex flex-col justify-between hover:border-accent-cyan/40 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <Badge variant="cyan" size="sm">
                {currentCard.category}
              </Badge>
              <span className="text-[11px] font-mono text-slate-500 group-hover:text-accent-cyan transition-colors">
                {isFlipped ? "Click to see question" : "Click to flip answer ↷"}
              </span>
            </div>

            <div className="py-4 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isFlipped ? "Target Principle (Recall Solution)" : "Conceptual Retrieval Prompt"}
              </span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
              {isFlipped && (
                <p className="text-xs text-accent-cyan pt-2 font-medium">
                  💡 Rationale: {currentCard.rationale}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-3">
              <span>Topic: {currentCard.topicTitle}</span>
              <span className="text-purple-400 font-medium">{currentCard.difficulty}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs"
            >
              {isFlipped ? "Show Question" : "Reveal Answer"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNext(false)}
                icon={<XCircle className="h-4 w-4 text-rose-400" />}
                className="text-xs hover:border-rose-500/50"
              >
                Needs Practice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleNext(true)}
                icon={<CheckCircle2 className="h-4 w-4 text-white" />}
                className="text-xs font-bold"
              >
                Mastered
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Completion State */
        <div className="text-center py-8 space-y-5 animate-fadeIn">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <Award className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white font-display">
              Daily Review Complete!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              You reviewed {cards.length} concept flashcards with {masteredIds.length} marked as mastered.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRestart}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              className="text-xs"
            >
              Practice Again
            </Button>
            <Link href="/learn">
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="h-3.5 w-3.5" />}
                iconPosition="right"
                className="text-xs font-bold"
              >
                Explore New Topic in Learn Studio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
