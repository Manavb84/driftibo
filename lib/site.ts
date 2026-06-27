// Central site config. Single source of truth for cross-page constants.
//
// Single source of truth for the wa.me number (India country code 91 + 10-digit mobile).
export const SITE = {
  name: "Driftibo",
  url: "https://driftibo.com",
  tagline: "Travel by your own star",
  whatsappNumber: "917011842360", // Driftibo WhatsApp
  instagram: "https://instagram.com/driftibo",
} as const;

/**
 * Build a wa.me deep-link with Driftibo's standard handoff message.
 * `context` fills the blank in: "Hi Driftibo ✦ — {context}. Can you make it real?"
 */
export function waLink(context: string, number: string = SITE.whatsappNumber): string {
  const msg = `Hi Driftibo ✦ — ${context}. Can you make it real?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}
