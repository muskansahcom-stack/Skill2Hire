"use client";

import React, { useState } from "react";
import { Topic, TopicCategory } from "@/types";
import { Search, Sparkles, Clock, BookOpen, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TopicSelectorProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topic: Topic) => void;
  onGenerateCustom: (prompt: string) => void;
  isGenerating?: boolean;
}

const categories: (TopicCategory | "All")[] = [
  "All",
  "Artificial Intelligence",
  "Computer Science",
  "Biology & Life Sciences",
  "Physics & Quantum",
];

export function TopicSelector({
  topics,
  activeTopicId,
  onSelectTopic,
  onGenerateCustom,
  isGenerating = false,
}: TopicSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | "All">("All");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  const filteredTopics = topics.filter((topic) => {
    const matchesCategory =
      selectedCategory === "All" || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onGenerateCustom(customPrompt);
      setCustomPrompt("");
      setShowAIPrompt(false);
    }
  };

  const getDifficultyBadgeVariant = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "emerald";
      case "Intermediate":
        return "brand";
      case "Advanced":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search STEM concepts, algorithms, biology..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>

        <Button
          variant={showAIPrompt ? "primary" : "secondary"}
          size="sm"
          onClick={() => setShowAIPrompt(!showAIPrompt)}
          icon={<Sparkles className="h-4 w-4 text-amber-300" />}
          className="text-xs"
        >
          {showAIPrompt ? "Close AI Prompt" : "AI Custom Concept"}
        </Button>
      </div>

      {/* AI Custom Concept Box */}
      {showAIPrompt && (
        <form
          onSubmit={handleCustomSubmit}
          className="rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-950/60 via-slate-900 to-slate-950 p-4 space-y-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <h4 className="text-sm font-semibold text-white">Generate 3-Way Synchronized Concept</h4>
          </div>
          <p className="text-xs text-slate-300">
            Type any difficult academic or STEM topic (e.g. &quot;Gradient Descent&quot;, &quot;CRISPR Gene Editing&quot;, &quot;Fourier Transform&quot;) to generate an analogy, flowchart, and socratic quiz:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Backpropagation, Special Relativity, Dijkstra Algorithm..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={isGenerating || !customPrompt.trim()}
              className="text-xs"
            >
              {isGenerating ? "Generating..." : "Generate Concept"}
            </Button>
          </div>
        </form>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="h-3 w-3" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all duration-150 cursor-pointer ${
              selectedCategory === cat
                ? "bg-brand-600 text-white font-medium shadow-sm shadow-brand-600/30"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Horizontal Carousel / Grid of Topic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {filteredTopics.map((topic) => {
          const isActive = topic.id === activeTopicId;
          return (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? "border-brand-500 bg-brand-950/40 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/50"
                  : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <Badge variant={getDifficultyBadgeVariant(topic.difficulty)} size="sm">
                    {topic.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {topic.estimatedMinutes}m
                  </span>
                </div>

                <h4 className="text-xs md:text-sm font-semibold text-white line-clamp-1">
                  {topic.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {topic.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/60 text-[11px]">
                <span className="text-slate-400 font-medium truncate max-w-[120px]">
                  {topic.category}
                </span>
                <span className="text-brand-400 flex items-center font-medium">
                  {isActive ? "Active" : "Explore"}
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
