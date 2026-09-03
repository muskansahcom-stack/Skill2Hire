"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type TextSize = "normal" | "large" | "extra-large";
export type MotionPreference = "normal" | "reduced";
export type LearningPresentation = "visual" | "analogy" | "questions" | "mixed";

export interface AccessibilitySettings {
  textSize: TextSize;
  motion: MotionPreference;
  learningPresentation: LearningPresentation;
  highContrast: boolean;
  dyslexiaFont: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setTextSize: (size: TextSize) => void;
  setMotion: (motion: MotionPreference) => void;
  setLearningPresentation: (pres: LearningPresentation) => void;
  setHighContrast: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  resetAccessibility: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: "normal",
  motion: "normal",
  learningPresentation: "mixed",
  highContrast: false,
  dyslexiaFont: false,
};

const STORAGE_KEY = "neuroflex_accessibility_settings";

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } else {
        // Detect system preferences
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
          setSettings((prev) => ({ ...prev, motion: "reduced" }));
        }
      }
    } catch (e) {
      console.warn("[AccessibilityContext] Error reading settings from storage:", e);
    }
  }, []);

  // Apply DOM classes when settings change
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // 1. Text size class
    root.classList.remove("text-size-normal", "text-size-large", "text-size-extra-large");
    root.classList.add(`text-size-${settings.textSize}`);

    // 2. Motion class
    if (settings.motion === "reduced") {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // 3. High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // 4. Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add("dyslexia-font");
    } else {
      root.classList.remove("dyslexia-font");
    }

    // Save to localStorage
    if (isMounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn("[AccessibilityContext] Error persisting settings:", e);
      }
    }
  }, [settings, isMounted]);

  const setTextSize = (textSize: TextSize) => setSettings((s) => ({ ...s, textSize }));
  const setMotion = (motion: MotionPreference) => setSettings((s) => ({ ...s, motion }));
  const setLearningPresentation = (learningPresentation: LearningPresentation) =>
    setSettings((s) => ({ ...s, learningPresentation }));
  const setHighContrast = (highContrast: boolean) => setSettings((s) => ({ ...s, highContrast }));
  const setDyslexiaFont = (dyslexiaFont: boolean) => setSettings((s) => ({ ...s, dyslexiaFont }));

  const resetAccessibility = () => setSettings(DEFAULT_SETTINGS);

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setTextSize,
        setMotion,
        setLearningPresentation,
        setHighContrast,
        setDyslexiaFont,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
