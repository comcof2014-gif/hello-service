import { redirect } from "next/navigation";
import { getAuthUser } from "@/app/lib/auth";
import { createAdminClient } from "@/app/lib/supabase/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return <>{children}</>;
}
