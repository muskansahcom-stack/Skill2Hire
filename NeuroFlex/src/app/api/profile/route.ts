import { NextRequest, NextResponse } from "next/server";
import { ProfileUpdateSchema } from "@/validators";
import { repository } from "@/services";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-demo-default";

    const profile = await repository.getUserFullProfile(userId);

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/profile error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch student profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-demo-default";

    const body = await req.json();
    const validationResult = ProfileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid profile data",
          details: validationResult.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { name, email, avatarUrl } = validationResult.data;
    const current = await repository.getUser(userId);

    return NextResponse.json(
      {
        success: true,
        user: {
          ...current,
          name,
          email: email || current?.email,
          avatarUrl: avatarUrl || current?.avatarUrl,
          updatedAt: new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/profile error]:", error);
    return NextResponse.json(
      { error: "Failed to update student profile" },
      { status: 500 }
    );
  }
}
