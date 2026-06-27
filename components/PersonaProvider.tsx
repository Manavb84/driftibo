"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
} from "react";

export type Persona = "genz" | "mil" | "classic";
const PERSONAS: Persona[] = ["genz", "mil", "classic"];

type PersonaContextValue = {
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  openOverlay: () => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within <PersonaProvider>");
  return ctx;
}

function applyPersonaClass(p: Persona) {
  const el = document.documentElement;
  el.classList.remove("persona-genz", "persona-mil", "persona-classic");
  el.classList.add("persona-" + p);
}

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [overlay, setOverlay] = useState(false);

  // On first visit (no stored persona) the no-FOUC script already applied 'mil';
  // we just open the chooser. Otherwise adopt the stored persona.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("driftibo-persona");
    } catch {}
    if (stored && (PERSONAS as string[]).includes(stored)) {
      setPersonaState(stored as Persona);
    } else {
      setOverlay(true);
    }
  }, []);

  const setPersona = useCallback((p: Persona) => {
    try {
      localStorage.setItem("driftibo-persona", p);
    } catch {}
    applyPersonaClass(p);
    setPersonaState(p);
    setOverlay(false);
  }, []);

  const pickRandom = useCallback(() => {
    setPersona(PERSONAS[Math.floor(Math.random() * PERSONAS.length)]);
  }, [setPersona]);

  const openOverlay = useCallback(() => setOverlay(true), []);

  return (
    <PersonaContext.Provider value={{ persona, setPersona, openOverlay }}>
      {children}
      {overlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "oklch(0.30 0.05 225 / 0.62)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Who's dreaming?"
            style={{
              background: "var(--pk-card)",
              borderRadius: 26,
              boxShadow: "var(--pk-shadow-lg)",
              maxWidth: 560,
              width: "100%",
              padding: "38px 30px",
              textAlign: "center",
            }}
          >
            <span className="seal t-coral breathe" style={{ width: 64, margin: "0 auto" }}>
              <span className="ring" />
              <span className="star" />
            </span>
            <p className="kicker" style={{ marginTop: 18 }}>
              Before your star spins
            </p>
            <h2 className="display" style={{ fontSize: "clamp(1.8rem,5vw,2.4rem)", margin: "4px 0 6px" }}>
              Who&apos;s dreaming?
            </h2>
            <p className="lede" style={{ maxWidth: "38ch", margin: "0 auto 24px" }}>
              Two taps. The whole place rearranges itself around you — type, pace, the words, the heat.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              <PersonaTile
                title="Gen-Z"
                blurb="Loud, springy, a little unhinged."
                onClick={() => setPersona("genz")}
              />
              <PersonaTile
                title="Millennial"
                blurb="Refined, airy, quietly expensive."
                onClick={() => setPersona("mil")}
              />
              <PersonaTile
                title="Timeless"
                blurb="Slow, serene, nothing to prove."
                onClick={() => setPersona("classic")}
              />
            </div>
            <button
              onClick={pickRandom}
              style={{
                marginTop: 18,
                background: "none",
                border: 0,
                color: "var(--pk-muted)",
                fontFamily: "var(--ui)",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Skip — surprise me
            </button>
          </div>
        </div>
      )}
    </PersonaContext.Provider>
  );
}

const tileStyle: CSSProperties = {
  cursor: "pointer",
  textAlign: "left",
  border: "1px solid var(--pk-line)",
  background: "var(--pk-paper)",
  borderRadius: 16,
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
  transition: "transform .15s ease,border-color .15s ease,box-shadow .15s ease",
};

function PersonaTile({
  title,
  blurb,
  onClick,
}: {
  title: string;
  blurb: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={tileStyle}>
      <span style={{ fontFamily: "var(--display)", fontSize: "1.3rem" }}>{title}</span>
      <span style={{ color: "var(--pk-muted)", fontSize: "0.86rem" }}>{blurb}</span>
    </button>
  );
}
