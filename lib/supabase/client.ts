import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (anon key + RLS). Used by client islands for auth
// (email OTP) and any client-side reads. Safe to call repeatedly.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
