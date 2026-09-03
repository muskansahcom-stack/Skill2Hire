"use client";

import { useState, useEffect } from "react";
import { ProgressService, ProgressAnalytics } from "@/lib/progress/progressService";

export function useLearningSession(topicTitle: string) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const pauseSession = () => setIsActive(false);
  const resumeSession = () => setIsActive(true);
  const resetSession = () => setSecondsElapsed(0);

  return {
    secondsElapsed,
    isActive,
    pauseSession,
    resumeSession,
    resetSession,
  };
}

export function useProgressAnalytics() {
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const data = ProgressService.getProgressAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.warn("[useProgressAnalytics error]:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = () => {
    const data = ProgressService.getProgressAnalytics();
    setAnalytics(data);
  };

  return {
    analytics,
    isLoading,
    refresh,
  };
}
