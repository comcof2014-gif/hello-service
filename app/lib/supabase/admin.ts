import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

let cached: ReturnType<typeof createClient> | null = null;

/**
 * Service-role Supabase client. Bypasses RLS.
 * Use ONLY in route handlers / server actions for admin ops.
 * Never import from client components.
 */
export function createAdminClient() {
  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY (and NEXT_PUBLIC_SUPABASE_URL) required for admin client.",
    );
  }
  if (!cached) {
    cached = createClient(supabaseUrl, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return cached;
}
