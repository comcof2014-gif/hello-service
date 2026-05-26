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
  const { is_public } = await req.json();

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("travel_plans")
    .update({ is_public })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("travel_plans").delete().eq("id", id);

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
