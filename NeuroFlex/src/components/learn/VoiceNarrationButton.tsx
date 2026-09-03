"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceNarrationButtonProps {
  textToRead: string;
  label?: string;
}

export function VoiceNarrationButton({ textToRead, label = "Listen to Analogy" }: VoiceNarrationButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  const handleToggleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToRead.replace(/[#*`_~]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  return (
    <Button
      variant={isSpeaking ? "primary" : "secondary"}
      size="sm"
      onClick={handleToggleSpeak}
      icon={
        isSpeaking ? (
          <VolumeX className="h-3.5 w-3.5 text-accent-cyan animate-pulse" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-slate-400" />
        )
      }
      className="text-xs transition-all"
      title={isSpeaking ? "Stop voice narration" : "Listen to audio explanation"}
      aria-label={isSpeaking ? "Stop voice narration" : "Listen to audio explanation"}
    >
      <span>{isSpeaking ? "Stop Audio" : label}</span>
    </Button>
  );
}
