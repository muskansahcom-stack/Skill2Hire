import { NextRequest, NextResponse } from "next/server";
import { AdaptiveLearningEngine } from "@/lib/adaptive/adaptiveEngine";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("neuroflex_session")?.value;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || sessionCookie || "user-demo-default";

    // 1. Run full adaptive profile analysis
    const profileAnalysis = await AdaptiveLearningEngine.analyzeStudentProfile(userId);

    // 2. Generate calibrated next topic recommendations
    const recommendations = await AdaptiveLearningEngine.getAdaptiveRecommendations(userId);

    return NextResponse.json(
      {
        success: true,
        recommendations,
        adaptiveProfile: {
          currentMasteryIndex: profileAnalysis.overallMasteryIndex,
          recentAccuracy: profileAnalysis.recentAccuracy,
          fieldOfStudy: profileAnalysis.fieldOfStudy,
          learningPreference: profileAnalysis.learningPreference,
          currentDifficulty: profileAnalysis.currentDifficulty,
          suggestedDifficulty: profileAnalysis.suggestedDifficulty,
          suggestedDensity: profileAnalysis.suggestedDensity,
          suggestedMode: profileAnalysis.suggestedMode,
          weakConceptsCount: profileAnalysis.weakConcepts.length,
          weakConcepts: profileAnalysis.weakConcepts,
          strongConcepts: profileAnalysis.strongConcepts,
          adaptationReason: profileAnalysis.adaptationReason,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/recommendations error]:", error);
    return NextResponse.json(
      { error: "Failed to generate adaptive recommendations" },
      { status: 500 }
    );
  }
}
