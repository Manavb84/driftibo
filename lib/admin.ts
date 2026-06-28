import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Single gate for every admin surface. Reuses the email-OTP session; admin-ness is
// the is_admin() RPC (email allowlist, RLS-enforced). Server actions reuse this too.
// Wrapped in React.cache() so multiple calls within the same RSC render tree dedup to
// one Supabase round-trip (layout + page both call it during the same request).
export const getAdminContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };
  const { data } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: data === true };
});
