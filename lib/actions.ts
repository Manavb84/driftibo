"use server";

import { createClient } from "@/lib/supabase/server";

// One capture path for the whole funnel. The source plan named 7 near-identical
// capture tables; we collapse them into one `captures` table partitioned by `kind`
// (ponytail: 7 identical tables is machinery a lead funnel doesn't need — split
// later if a kind grows its own columns). starbook_stamps stays separate (user-scoped).
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

  // Trust-boundary length/size guards
  if (input.email && input.email.length > 320)
    return { ok: false, error: "Email address is too long." };
  if (input.name && input.name.length > 200)
    return { ok: false, error: "Name is too long." };
  if (input.whatsapp && input.whatsapp.length > 40)
    return { ok: false, error: "WhatsApp number is too long." };
  if (JSON.stringify(input.data ?? {}).length > 20000)
    return { ok: false, error: "Data payload is too large." };

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

  // Send emails via Resend — fully gated; inert when RESEND_API_KEY is unset.
  // Email failure must never fail the capture.
  if (process.env.RESEND_API_KEY) {
    const from = process.env.RESEND_FROM ?? "Driftibo <hello@driftibo.com>";
    try {
      // Lead acknowledgement
      if (input.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [input.email],
            subject: "Welcome to Driftibo ✈️",
            html: `<p>Hi${input.name ? ` ${input.name}` : ""},</p><p>Thanks for your interest in Driftibo. We'll be in touch shortly!</p><p>— The Driftibo Team</p>`,
          }),
        });
      }
      // Founder alert
      if (process.env.RESEND_FOUNDER_EMAIL) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [process.env.RESEND_FOUNDER_EMAIL],
            subject: `New ${input.kind} lead`,
            html: `<p>New capture: <b>${input.kind}</b></p><p>Email: ${input.email ?? "—"}</p><p>Name: ${input.name ?? "—"}</p><p>WhatsApp: ${input.whatsapp ?? "—"}</p>`,
          }),
        });
      }
    } catch {
      // Swallow — email failure must never bubble up to the caller
    }
  }

  return { ok: true };
}

// Add (idempotently) a stamp to the signed-in user's Starbook.
export async function addStarbookStamp(
  slug: string,
  label: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to collect stamps." };
  const { error } = await supabase
    .from("starbook_stamps")
    .upsert(
      { user_id: user.id, slug, label },
      { onConflict: "user_id,slug", ignoreDuplicates: true },
    );
  return error ? { ok: false, error: error.message } : { ok: true };
}
