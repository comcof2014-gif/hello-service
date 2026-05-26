import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import type { ApiResponse, AuthUser } from "@/app/lib/constants";

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  return {
    id: user.id,
    email: user.email,
    role: (user.app_metadata?.role as string | undefined) ?? undefined,
  };
}

export async function requireAuth(): Promise<
  { user: AuthUser; response?: never } | { user?: never; response: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    const body: ApiResponse = { success: false, error: "Unauthorized" };
    return { response: NextResponse.json(body, { status: 401 }) };
  }
  return { user };
}

export async function requireAdmin(): Promise<
  { user: AuthUser; response?: never } | { user?: never; response: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    const body: ApiResponse = { success: false, error: "Unauthorized" };
    return { response: NextResponse.json(body, { status: 401 }) };
  }
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    const body: ApiResponse = { success: false, error: "Forbidden" };
    return { response: NextResponse.json(body, { status: 403 }) };
  }
  return { user: { ...user, role: "admin" } };
}
