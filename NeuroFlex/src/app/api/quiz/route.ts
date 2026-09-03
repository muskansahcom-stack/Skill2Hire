import { NextRequest, NextResponse } from "next/server";
import { QuizSubmissionSchema } from "@/validators";
import { repository } from "@/services";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }

    const validationResult = QuizSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid quiz submission data",
          details: validationResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
        },
        { status: 400 }
      );
    }

    const {
      userId,
      topicSlug,
      topicTitle,
      category,
      scorePercentage,
      totalQuestions,
      correctCount,
      incorrectCount,
      weakConceptsDetected,
    } = validationResult.data;

    const result = await repository.recordQuizAttempt(userId, {
      topicSlug,
      topicTitle,
      category,
      scorePercentage,
      totalQuestions,
      correctCount,
      incorrectCount,
      weakConceptsDetected,
    });

    return NextResponse.json(
      {
        success: true,
        attempt: result.attempt,
        progress: result.progress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/quiz error]:", error);
    return NextResponse.json(
      { error: "Failed to record quiz attempt" },
      { status: 500 }
    );
  }
}
