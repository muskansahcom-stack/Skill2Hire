import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/services";
import { OnboardingSchema } from "@/validators";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("neuroflex_session")?.value;
    const body = await req.json();

    const validation = OnboardingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid onboarding submission",
          details: validation.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const {
      fieldOfStudy,
      learningPreference,
      difficulty,
      density,
      learningGoal,
      userId: bodyUserId,
    } = validation.data;

    const targetUserId = sessionCookie || bodyUserId || "user-demo-default";

    // Update preferences in database repository
    const updatedPreferences = await repository.updatePreferences(targetUserId, {
      fieldOfStudy,
      learningPreference,
      difficulty,
      density,
      learningGoal,
      onboardingCompleted: true,
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding preferences saved successfully",
      preferences: updatedPreferences,
      redirectUrl: "/dashboard",
    });
  } catch (error) {
    console.error("[POST /api/onboarding error]:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding preferences" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("neuroflex_session")?.value;
    const targetUserId = sessionCookie || "user-demo-default";
    const preferences = await repository.getPreferences(targetUserId);

    return NextResponse.json({
      preferences,
    });
  } catch (error) {
    console.error("[GET /api/onboarding error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve onboarding preferences" },
      { status: 500 }
    );
  }
}
