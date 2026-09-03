import { NextRequest, NextResponse } from "next/server";
import { LearnRequestSchema, LearnResponseSchema } from "@/lib/ai/schema";
import { aiService } from "@/lib/ai/service";
import { repository } from "@/services";
import { AdaptiveLearningEngine } from "@/lib/adaptive/adaptiveEngine";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON format in request body",
          details: "Please provide a valid JSON payload.",
        },
        { status: 400 }
      );
    }

    const validationResult = LearnRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return NextResponse.json(
        {
          error: "Invalid request parameters",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    const { topic, difficulty, preference, density, mode } = validationResult.data;

    // 2. Query Adaptive Profile if using default settings
    const sessionCookie = req.cookies.get("neuroflex_session")?.value;
    const userId = sessionCookie || "user-demo-default";

    let adaptiveDifficulty = difficulty;
    let adaptiveDensity = density;
    let adaptivePreference = preference;

    try {
      const profileAnalysis = await AdaptiveLearningEngine.analyzeStudentProfile(userId);
      // If student has weak concepts on this topic or low accuracy, calibrate density
      if (profileAnalysis.recentAccuracy < 60 && density === "balanced") {
        adaptiveDensity = "simple";
      }
    } catch (e) {
      console.warn("Adaptive profile read warning:", e);
    }

    // 3. Execute AI Service with Provider Abstraction & Safe Fallback
    const { response, providerUsed, fallbackOccurred, fallbackReason } =
      await aiService.generate(topic, adaptiveDifficulty, {
        learningPreference: adaptivePreference,
        density: adaptiveDensity,
        engineMode: mode,
        timeoutMs: 20000,
        allowMockFallback: true,
      });

    // 4. Final schema validation check
    const verifiedResponse = LearnResponseSchema.parse(response);

    // 5. Record learning session in database (fire-and-forget / non-blocking)
    try {
      await repository.recordSession(userId, {
        topicSlug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        topicTitle: topic,
        category: "Computer Science",
        durationSeconds: verifiedResponse.estimatedMinutes * 60,
        modeCompleted: "all",
      });
    } catch (e) {
      console.warn("Non-fatal session recording warning:", e);
    }

    // 6. Return successful response with metadata
    return NextResponse.json(
      {
        ...verifiedResponse,
        _engine: {
          providerUsed,
          isDemoMode: providerUsed === "instant_demo" || providerUsed === "mock_fallback",
          fallbackOccurred,
          fallbackReason: fallbackReason || null,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[API /api/learn error]:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "AI response schema validation failed",
          details: error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
        },
        { status: 502 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal server error";

    if (message.includes("RATE_LIMIT_EXCEEDED")) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          details: "The AI service is receiving too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    if (message.includes("GATEWAY_TIMEOUT") || message.includes("aborted")) {
      return NextResponse.json(
        {
          error: "Request timed out",
          details: "The AI generation engine exceeded the timeout limit. Please retry.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "AI Learning Engine Error",
        details: "An unexpected error occurred during synthesis. Please retry shortly.",
      },
      { status: 500 }
    );
  }
}
