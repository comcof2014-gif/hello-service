import { requireAdmin } from "@/app/lib/auth";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
