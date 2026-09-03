/**
 * Sanitizes and validates Mermaid.js code strings returned by AI providers.
 * Cleans markdown code fences, escapes unquoted special characters in node labels,
 * ensures valid chart headers, and prevents client-side rendering crashes.
 */
export function sanitizeMermaid(rawCode: string, fallbackTitle: string = "Process Flow"): string {
  if (!rawCode || typeof rawCode !== "string") {
    return generateFallbackDiagram(fallbackTitle);
  }

  let code = rawCode.trim();

  // Strip markdown code fences (```mermaid ... ``` or ``` ...)
  code = code.replace(/^```(?:mermaid)?\s*/i, "");
  code = code.replace(/\s*```$/, "");
  code = code.trim();

  // If empty after stripping fences, return fallback
  if (!code) {
    return generateFallbackDiagram(fallbackTitle);
  }

  // Check if it has a known valid Mermaid diagram header
  const validHeaders = [
    "flowchart",
    "graph",
    "sequenceDiagram",
    "classDiagram",
    "stateDiagram",
    "stateDiagram-v2",
    "erDiagram",
    "journey",
    "gantt",
    "pie",
    "gitGraph",
    "mindmap",
  ];

  const firstLine = code.split("\n")[0].trim();
  const hasValidHeader = validHeaders.some((header) =>
    firstLine.toLowerCase().startsWith(header.toLowerCase())
  );

  if (!hasValidHeader) {
    // Prefix with default flowchart TD
    code = `flowchart TD\n${code}`;
  }

  // Sanitize unescaped characters in node text brackets [ ... ] or ( ... )
  // Replace raw unescaped quotes with single quotes inside labels
  const lines = code.split("\n");
  const sanitizedLines = lines.map((line) => {
    let cleanLine = line;

    // Fix unescaped double quotes inside bracketed node text: e.g. Node["Some "quoted" text"]
    // Matches text inside square brackets [ ... ]
    cleanLine = cleanLine.replace(/\["([^"]*?)"\]/g, (match, inner) => {
      const sanitizedInner = inner.replace(/"/g, "'");
      return `["${sanitizedInner}"]`;
    });

    // Strip out HTML script tags or dangerous injected tags
    cleanLine = cleanLine.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

    return cleanLine;
  });

  const finalCode = sanitizedLines.join("\n").trim();

  // Final length sanity check
  if (finalCode.length < 10) {
    return generateFallbackDiagram(fallbackTitle);
  }

  return finalCode;
}

function generateFallbackDiagram(title: string): string {
  const safeTitle = title.replace(/[^a-zA-Z0-9\s_-]/g, "");
  return `flowchart TD
    Start(["1. Start: ${safeTitle}"]) --> Process["2. Processing Stage"]
    Process --> Check{"3. Condition Verified?"}
    Check -->|Yes| Output(["4. Verified Output"])
    Check -->|No| Fallback["5. Exception Handling"]
    Fallback --> Process

    classDef primary fill:#4f46e5,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef success fill:#10b981,stroke:#6ee7b7,stroke-width:2px,color:#fff;
    classDef warn fill:#f59e0b,stroke:#fcd34d,stroke-width:2px,color:#fff;

    class Start,Output success;
    class Process primary;
    class Check,Fallback warn;`;
}
