import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PassportClient from "./PassportClient";

export const metadata: Metadata = {
  title: "Star Passport · Driftibo",
};
export const dynamic = "force-dynamic";

export default async function Page() {
  let user = null;
  let stamps: Array<{ slug: string; label: string }> = [];
  try {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u ?? null;
    if (user) {
      const { data } = await supabase
        .from("passport_stamps")
        .select("*")
        .eq("user_id", user.id);
      stamps = data ?? [];
    }
  } catch {}
  return <PassportClient user={user} stamps={stamps} />;
}
