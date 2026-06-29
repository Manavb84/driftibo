"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { normalizeIntent, type Intent } from "@/lib/intent";
import IntentChooser from "./IntentChooser";

// Trip-intent context — revives the old PersonaProvider pattern, repurposed for
// International / India / Spiritual. Reuses localStorage.driftiboIntent (now an
// Intent key; legacy catalog values are normalized on read). No <html> class /
// no-FOUC script: intent does not re-theme the page in v1, it only personalizes
// Explore pre-focus + calendar scope + the nav chip.
type IntentContextValue = {
  intent: Intent | null;
  setIntent: (i: Intent) => void;
  openChooser: () => void;
  closeChooser: () => void;
};

const IntentContext = createContext<IntentContextValue | null>(null);

// Persist intent to BOTH a cookie (read by middleware + Server Components for SSR
// personalization, 90d, SameSite=Lax) and localStorage (instant, FOUC-free client
// reads). The cookie is the SSR source of truth; localStorage avoids a flash on islands.
function persistIntent(i: Intent) {
  try {
    localStorage.setItem("driftiboIntent", i);
  } catch {}
  try {
    document.cookie = `driftiboIntent=${i}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
  } catch {}
}

// Read the stored intent, preferring the COOKIE (the SSR source of truth) over
// localStorage so the client never disagrees with what the server already rendered.
// Falls back to localStorage for legacy visitors who only have it.
function readStoredIntent(): string | null {
  try {
    const m = document.cookie.match(/(?:^|;\s*)driftiboIntent=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
  } catch {}
  try {
    return localStorage.getItem("driftiboIntent");
  } catch {}
  return null;
}

export function useIntent(): IntentContextValue {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within <IntentProvider>");
  return ctx;
}

export function IntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntentState] = useState<Intent | null>(null);
  const [overlay, setOverlay] = useState(false);
  const pathname = usePathname();

  // First visit (no stored intent) → open the chooser. Otherwise adopt silently,
  // normalizing any legacy catalog value (india-popular/offbeat → india, etc.).
  // /start has its own immersive chooser (the triptych), so we never auto-pop the
  // modal there — the two would stack.
  useEffect(() => {
    const stored = readStoredIntent();
    const normalized = normalizeIntent(stored);
    if (normalized) {
      setIntentState(normalized);
      // Re-persist on every adopt so the cookie exists for SSR even when only the
      // legacy localStorage value was present (or we just normalized it).
      persistIntent(normalized);
    } else if (pathname !== "/start") {
      // Auto-open the first-visit chooser at most ONCE per session — a dismissal
      // ("Skip"/✕) sets driftiboChooserSeen so the [pathname] effect can't re-nag on
      // every navigation. (The nav chip's openChooser still opens it on demand.)
      let seen = false;
      try {
        seen = !!sessionStorage.getItem("driftiboChooserSeen");
      } catch {}
      if (!seen) setOverlay(true);
    }
  }, [pathname]);

  const setIntent = useCallback((i: Intent) => {
    persistIntent(i);
    setIntentState(i);
    setOverlay(false);
  }, []);

  const openChooser = useCallback(() => setOverlay(true), []);
  const closeChooser = useCallback(() => {
    // Remember the dismissal so the first-visit chooser doesn't reappear on the next nav.
    try {
      sessionStorage.setItem("driftiboChooserSeen", "1");
    } catch {}
    setOverlay(false);
  }, []);

  return (
    <IntentContext.Provider value={{ intent, setIntent, openChooser, closeChooser }}>
      {children}
      {overlay && <IntentChooser />}
    </IntentContext.Provider>
  );
}
