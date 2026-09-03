import { NextResponse } from "next/server";
import { HealthService } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const healthData = HealthService.getHealthStatus();
  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
