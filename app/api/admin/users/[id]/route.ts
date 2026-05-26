import { requireAdmin } from "@/app/lib/auth";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.role !== undefined) update.role = body.role;
  if (body.is_active !== undefined) update.is_active = body.is_active;

  if (Object.keys(update).length === 0) {
    const res: ApiResponse = { success: false, error: "Nothing to update" };
    return NextResponse.json(res, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const res: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(res, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
