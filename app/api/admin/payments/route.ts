import { requireAdmin } from "@/app/lib/auth";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function GET(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const admin = createAdminClient();
  let query = admin
    .from("payments")
    .select("id, user_id, amount, currency, status, description, created_at, profiles(email)")
    .order("created_at", { ascending: false });

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
