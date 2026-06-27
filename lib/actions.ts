"use server";

import { createClient } from "@/lib/supabase/server";

// One capture path for the whole funnel. The source plan named 7 near-identical
// capture tables; we collapse them into one `captures` table partitioned by `kind`
// (ponytail: 7 identical tables is machinery a lead funnel doesn't need — split
// later if a kind grows its own columns). passport_stamps stays separate (user-scoped).
export type CaptureKind = "lead" | "quiz" | "dream" | "offering" | "game" | "star_drop";
const KINDS: CaptureKind[] = ["lead", "quiz", "dream", "offering", "game", "star_drop"];

export type CaptureInput = {
  kind: CaptureKind;
  email?: string;
  name?: string;
  whatsapp?: string;
  persona?: string;
  data?: Record<string, unknown>;
};

export async function submitCapture(input: CaptureInput): Promise<{ ok: boolean; error?: string }> {
  // Trust-boundary validation: whitelist the kind, sanity-check the email shape.
  if (!KINDS.includes(input.kind)) return { ok: false, error: "Invalid submission." };
  if (input.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email))
    return { ok: false, error: "That email doesn't look right." };

  const supabase = await createClient();
  const { error } = await supabase.from("captures").insert({
    kind: input.kind,
    email: input.email ?? null,
    name: input.name ?? null,
    whatsapp: input.whatsapp ?? null,
    persona: input.persona ?? null,
    data: input.data ?? {},
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Add (idempotently) a stamp to the signed-in user's Star Passport.
export async function addPassportStamp(
  slug: string,
  label: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to collect stamps." };
  const { error } = await supabase
    .from("passport_stamps")
    .upsert({ user_id: user.id, slug, label }, { onConflict: "user_id,slug" });
  return error ? { ok: false, error: error.message } : { ok: true };
}
