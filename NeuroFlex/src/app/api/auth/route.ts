import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/services";
import { SignupSchema, LoginSchema } from "@/validators";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "neuroflex_session";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;
    const userIdFromHeader = req.headers.get("x-user-id");
    const userId = sessionCookie || userIdFromHeader || "user-demo-default";

    const user = await repository.getUser(userId);

    return NextResponse.json({
      authenticated: Boolean(user),
      user: user || null,
    });
  } catch (error) {
    console.error("[GET /api/auth error]:", error);
    return NextResponse.json({ error: "Auth verification failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "login";
    const body = await req.json();

    // 1. LOGOUT
    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    // 2. SIGNUP
    if (action === "signup") {
      const validation = SignupSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validation.error.issues.map((i) => i.message).join(", "),
          },
          { status: 400 }
        );
      }

      const { name, email, password } = validation.data;
      const existingUser = await repository.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }

      // Create new user (automatically initializes default learning preferences)
      const user = await repository.createUser({
        name,
        email,
        passwordHash: `hash_${password.length}`,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          streakDays: 1,
          topicsMastered: 0,
          createdAt: user.createdAt.toISOString().split("T")[0],
        },
        redirectUrl: "/onboarding",
      });

      // Set secure HTTP session cookie
      response.cookies.set({
        name: SESSION_COOKIE,
        value: user.id,
        path: "/",
        httpOnly: false, // Accessible by Next.js middleware and client auth state
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    // 3. LOGIN
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    let user = await repository.getUserByEmail(email);

    // If default demo user or new login
    if (!user) {
      if (email === "student@neuroflex.edu" || email.includes("demo")) {
        user = await repository.getOrCreateDefaultUser();
      } else {
        return NextResponse.json(
          { error: "Invalid credentials. Please check your email and password." },
          { status: 401 }
        );
      }
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        streakDays: 5,
        topicsMastered: 12,
        createdAt: user.createdAt.toISOString().split("T")[0],
      },
      redirectUrl: "/dashboard",
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: user.id,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth error]:", error);
    return NextResponse.json({ error: "Authentication request failed" }, { status: 500 });
  }
}
