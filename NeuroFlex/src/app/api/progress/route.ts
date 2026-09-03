import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-demo-default";

    const fullProfile = await repository.getUserFullProfile(userId);

    // Compute live analytics
    const totalSessions = fullProfile.sessions.length;
    const totalMinutes = Math.round(
      fullProfile.sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
    );

    const totalQuizzes = fullProfile.quizAttempts.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            fullProfile.quizAttempts.reduce((acc, q) => acc + q.scorePercentage, 0) / totalQuizzes
          )
        : 90;

    const overallMastery =
      fullProfile.topicProgress.length > 0
        ? Math.round(
            fullProfile.topicProgress.reduce((acc, t) => acc + t.mastery, 0) /
              fullProfile.topicProgress.length
          )
        : 72;

    const weakConcepts = Array.from(
      new Set(fullProfile.topicProgress.flatMap((t) => t.weakConcepts))
    );

    return NextResponse.json({
      success: true,
      profile: fullProfile,
      analytics: {
        overallMastery,
        totalSessions,
        totalMinutes,
        totalQuizzes,
        avgScore,
        weakConcepts,
      },
    });
  } catch (error) {
    console.error("[GET /api/progress error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch student progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "user-demo-default",
      topicSlug,
      topicTitle,
      category = "Computer Science",
      scorePercentage,
      totalQuestions,
      correctCount,
      incorrectCount,
      weakConceptsDetected = [],
    } = body;

    if (!topicSlug || !topicTitle) {
      return NextResponse.json(
        { error: "topicSlug and topicTitle are required" },
        { status: 400 }
      );
    }

    const result = await repository.recordQuizAttempt(userId, {
      topicSlug,
      topicTitle,
      category,
      scorePercentage: Number(scorePercentage) || 0,
      totalQuestions: Number(totalQuestions) || 4,
      correctCount: Number(correctCount) || 0,
      incorrectCount: Number(incorrectCount) || 0,
      weakConceptsDetected,
    });

    return NextResponse.json({
      success: true,
      attempt: result.attempt,
      progress: result.progress,
    });
  } catch (error) {
    console.error("[POST /api/progress error]:", error);
    return NextResponse.json(
      { error: "Failed to record topic progress" },
      { status: 500 }
    );
  }
}
