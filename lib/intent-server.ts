import { cookies, headers } from "next/headers";
import { normalizeIntent, type Intent } from "@/lib/intent";

// SERVER-ONLY. The intent spine's server end: any Server Component / page can call
// getIntent() and branch its SSR copy, featured product, and <head> per lane — no
// hydration gap, because the value is resolved before render. Middleware mirrors the
// `driftiboIntent` cookie into an `x-driftibo-intent` request header (read first, the
// cheapest path); the cookie is the fallback + the single source of truth that the
// client IntentProvider writes. Returns null on organic landings (chooser gates).
export const INTENT_COOKIE = "driftiboIntent";
export const INTENT_HEADER = "x-driftibo-intent";

export async function getIntent(): Promise<Intent | null> {
  try {
    const h = await headers();
    const fromHeader = normalizeIntent(h.get(INTENT_HEADER));
    if (fromHeader) return fromHeader;
  } catch {}
  try {
    const c = await cookies();
    return normalizeIntent(c.get(INTENT_COOKIE)?.value ?? null);
  } catch {}
  return null;
}
