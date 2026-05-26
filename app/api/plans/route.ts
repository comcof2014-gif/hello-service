import { requireAuth } from "@/app/lib/auth";
import { createClient } from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/lib/constants";

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("travel_plans")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse = { success: true, data };
  return NextResponse.json(body);
}

export async function POST(req: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { title, messages } = await req.json();
  if (!title || !Array.isArray(messages)) {
    const body: ApiResponse = { success: false, error: "title and messages required" };
    return NextResponse.json(body, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("travel_plans")
    .insert({ user_id: user.id, title, messages })
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: error.message };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse = { success: true, data };
  return NextResponse.json(body, { status: 201 });
}
