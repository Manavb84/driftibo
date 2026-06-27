import { createClient } from "@/lib/supabase/server";

// Single gate for every admin surface. Reuses the email-OTP session; admin-ness is
// the is_admin() RPC (email allowlist, RLS-enforced). Server actions reuse this too.
export async function getAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: data === true };
}
