import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "user-demo-default",
      topicSlug,
      topicTitle,
      category = "Computer Science",
      durationSeconds = 60,
      modeCompleted = "all",
    } = body;

    if (!topicSlug || !topicTitle) {
      return NextResponse.json(
        { error: "topicSlug and topicTitle are required" },
        { status: 400 }
      );
    }

    const session = await repository.recordSession(userId, {
      topicSlug,
      topicTitle,
      category,
      durationSeconds: Number(durationSeconds) || 60,
      modeCompleted,
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("[POST /api/sessions error]:", error);
    return NextResponse.json(
      { error: "Failed to record learning session" },
      { status: 500 }
    );
  }
}
