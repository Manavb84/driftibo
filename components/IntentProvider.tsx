"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

export function useIntent(): IntentContextValue {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within <IntentProvider>");
  return ctx;
}

export function IntentProvider({ children }: { children: React.ReactNode }) {
  const [intent, setIntentState] = useState<Intent | null>(null);
  const [overlay, setOverlay] = useState(false);

  // First visit (no stored intent) → open the chooser. Otherwise adopt silently,
  // normalizing any legacy catalog value (india-popular/offbeat → india, etc.).
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("driftiboIntent");
    } catch {}
    const normalized = normalizeIntent(stored);
    if (normalized) {
      setIntentState(normalized);
      // Re-persist if we normalized a legacy value so the stored key is current.
      if (normalized !== stored) {
        try {
          localStorage.setItem("driftiboIntent", normalized);
        } catch {}
      }
    } else {
      setOverlay(true);
    }
  }, []);

  const setIntent = useCallback((i: Intent) => {
    try {
      localStorage.setItem("driftiboIntent", i);
    } catch {}
    setIntentState(i);
    setOverlay(false);
  }, []);

  const openChooser = useCallback(() => setOverlay(true), []);
  const closeChooser = useCallback(() => setOverlay(false), []);

  return (
    <IntentContext.Provider value={{ intent, setIntent, openChooser, closeChooser }}>
      {children}
      {overlay && <IntentChooser mode="overlay" />}
    </IntentContext.Provider>
  );
}
