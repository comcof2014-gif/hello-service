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
  const { status } = await req.json();

  if (!["completed", "refunded", "pending"].includes(status)) {
    const body: ApiResponse = { success: false, error: "Invalid status" };
    return NextResponse.json(body, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("payments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
