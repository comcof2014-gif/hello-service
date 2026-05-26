import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function GET() {
  const body: ApiResponse<{ status: string; uptime: number; timestamp: string }> = {
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  };
  return NextResponse.json(body);
}
