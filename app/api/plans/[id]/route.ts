import { requireAuth } from "@/app/lib/auth";
import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("travel_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    const body: ApiResponse = { success: false, error: "Not found" };
    return NextResponse.json(body, { status: 404 });
  }

  const body: ApiResponse = { success: true, data };
  return NextResponse.json(body);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const { title, messages } = await req.json();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("travel_plans")
    .update({ title, messages, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    const body: ApiResponse = { success: false, error: "Not found" };
    return NextResponse.json(body, { status: 404 });
  }

  const body: ApiResponse = { success: true, data };
  return NextResponse.json(body);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("travel_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse = { success: true };
  return NextResponse.json(body);
}
