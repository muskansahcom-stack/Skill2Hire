"use client";

import React, { useState } from "react";
import { Topic } from "@/types";
import { Download, FileText, FileCode, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ExportStudyGuideButtonProps {
  topic: Topic;
}

export function ExportStudyGuideButton({ topic }: ExportStudyGuideButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const generateMarkdownGuide = (): string => {
    const analogy = topic.representations.analogy;
    const flowchart = topic.representations.flowchart;
    const socratic = topic.representations.socratic;

    let md = `# ${topic.title} - NeuroFlex Study Guide\n\n`;
    md += `**Category**: ${topic.category} | **Difficulty**: ${topic.difficulty} | **Est. Time**: ~${topic.estimatedMinutes} min\n\n`;
    md += `## 1. Summary\n${topic.subtitle}\n\n`;

    md += `## 2. Real-World Analogy: ${analogy.title}\n`;
    md += `> "${analogy.metaphor}"\n\n`;
    md += `${analogy.narrative}\n\n`;

    if (analogy.breakdown && analogy.breakdown.length > 0) {
      md += `### Concept Mapping Table\n`;
      md += `| Academic Concept | Real-World Equivalent | Explanation |\n`;
      md += `| :--- | :--- | :--- |\n`;
      analogy.breakdown.forEach((b) => {
        md += `| **${b.conceptTerm}** | ${b.analogyEquivalent} | ${b.explanation} |\n`;
      });
      md += `\n`;
    }

    md += `**Key Takeaway**: ${analogy.keyTakeaway}\n\n`;

    md += `## 3. Visual Flowchart (Mermaid.js)\n`;
    md += `\`\`\`mermaid\n${flowchart.mermaidCode}\n\`\`\`\n\n`;
    md += `**Core Insight**: ${flowchart.coreInsight}\n\n`;

    if (socratic.questions && socratic.questions.length > 0) {
      md += `## 4. Active Recall Socratic Checkpoints\n\n`;
      socratic.questions.forEach((q, idx) => {
        md += `### Question ${idx + 1}: ${q.question}\n`;
        q.options.forEach((opt, oIdx) => {
          const letter = ["A", "B", "C", "D"][oIdx];
          md += `- [${opt.isCorrect ? "x" : " "}] **(${letter})** ${opt.text}\n`;
        });
        md += `\n**Explanation**: ${q.explanation}\n\n`;
      });
    }

    md += `---\n*Generated with NeuroFlex - Adaptive Micro-Learning Platform*\n`;
    return md;
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownGuide();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.slug}-study-guide.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleDownloadAnkiCSV = () => {
    let csv = `Front,Back,Tags\n`;
    const analogy = topic.representations.analogy;
    const questions = topic.representations.socratic.questions || [];

    // Card 1: Analogy
    csv += `"${topic.title} - Real-World Analogy","${analogy.title}: ${analogy.keyTakeaway}","NeuroFlex ${topic.category}"\n`;

    // Questions Cards
    questions.forEach((q) => {
      const correctOpt = q.options.find((o) => o.isCorrect)?.text || "";
      csv += `"${q.question.replace(/"/g, '""')}","${correctOpt.replace(/"/g, '""')} - ${q.explanation.replace(/"/g, '""')}","NeuroFlex ${topic.category}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.slug}-anki-deck.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdownGuide();
    try {
      await navigator.clipboard.writeText(md);
      setCopiedFormat("md");
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        icon={<Download className="h-3.5 w-3.5 text-accent-cyan" />}
        className="text-xs font-medium hover:border-accent-cyan/50"
        title="Export study notes or Anki cards"
      >
        Export
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Export Concept Study Guide"
        description={`Download or copy structured learning artifacts for ${topic.title}.`}
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Format 1: Markdown */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-400" />
                  <span className="text-xs font-bold text-white">Markdown Note (.md)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Formatted notes with analogy, Mermaid code block, and Q&A sequence.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadMarkdown}
                  className="w-full text-xs"
                >
                  Download .md
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyMarkdown}
                  className="text-xs shrink-0"
                >
                  {copiedFormat === "md" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : "Copy"}
                </Button>
              </div>
            </div>

            {/* Format 2: Anki Deck */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Anki Flashcard Deck</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  CSV format ready for instant import into Anki / Quizlet spaced repetition.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadAnkiCSV}
                className="w-full text-xs hover:border-purple-500/40"
              >
                Download Anki CSV
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
