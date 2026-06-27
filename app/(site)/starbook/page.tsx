import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import StarbookClient from "./StarbookClient";

export const metadata: Metadata = {
  title: "Starbook · Driftibo",
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
        .from("starbook_stamps")
        .select("*")
        .eq("user_id", user.id);
      stamps = data ?? [];
    }
  } catch {}
  return <StarbookClient user={user} stamps={stamps} />;
}
