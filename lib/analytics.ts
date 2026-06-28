// Thin analytics dispatch. Fans one event out to GA4 (gtag), Meta Pixel (fbq), and the
// GTM dataLayer. No-ops when those globals are absent — which is exactly the state until
// NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_FB_PIXEL_ID are set (see components/Analytics.tsx). So
// call track() freely across the funnel; it stays inert with no keys and lights up with them.
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof w.gtag === "function") w.gtag("event", event, params);
    if (typeof w.fbq === "function") w.fbq("trackCustom", event, params);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params });
  } catch {
    // analytics must never break the funnel
  }
}
