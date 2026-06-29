"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useIntent } from "./IntentProvider";
import { INTENT_LABEL } from "@/lib/intent";
import { waLink } from "@/lib/site";
import { track } from "@/lib/analytics";

type NavItem = { href: string; label: string; key: string };

// Explore (the catalogue) leads — games are an add-on, so Play sits after the
// book-a-trip surfaces (Explore → Plan with us → Packages), not first.
const NAV: NavItem[] = [
  { href: "/destinations", label: "Explore", key: "destinations" },
  { href: "/offerings", label: "Plan with us", key: "offerings" },
  { href: "/packages", label: "Packages", key: "packages" },
  { href: "/play", label: "Play", key: "play" },
  { href: "/journal", label: "Journal", key: "journal" },
  { href: "/about", label: "About", key: "about" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const active = (pathname || "/").replace(/^\//, "").split("/")[0];
  const { intent, openChooser } = useIntent();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Home has a dark hero → nav is transparent until scrolled. Every other route
  // is light at the top, so the nav stays in its solid "sky" state for legibility.
  const sky = pathname === "/" ? scrolled : true;

  const navStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 120,
    transition: "background .3s ease,box-shadow .3s ease,color .3s ease",
    ...(sky
      ? { background: "var(--pk-sky)", color: "var(--pk-text)", boxShadow: "var(--pk-shadow-sm)" }
      : { background: "transparent", color: "var(--pk-on-ink)" }),
  };

  const linkBase: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    fontFamily: "var(--ui)",
    fontWeight: 600,
    fontSize: "0.84rem",
    padding: "7px 11px",
    borderRadius: 99,
    transition: "opacity .15s ease",
    opacity: 0.9,
    ...(sky ? {} : { textShadow: "0 1px 8px oklch(0.30 0.05 225 / .5)" }),
  };
  const activeAdd: CSSProperties = {
    fontWeight: 800,
    textDecoration: "underline",
    textUnderlineOffset: 4,
    opacity: 1,
    color: "var(--pk-accent-deep)",
  };
  const drawerBase: CSSProperties = {
    textDecoration: "none",
    color: "var(--pk-text)",
    fontFamily: "var(--ui)",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "11px 6px",
    borderBottom: "1px solid var(--pk-line-soft)",
  };
  const drawerActiveAdd: CSSProperties = { color: "var(--pk-accent-deep)", fontWeight: 800 };

  const burgerStyle: CSSProperties = {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    border: 0,
    cursor: "pointer",
    fontSize: "1.2rem",
    borderRadius: 12,
    ...(sky
      ? { background: "var(--pk-panel)", color: "var(--pk-text)" }
      : { background: "oklch(1 0 0 / .16)", color: "var(--pk-on-ink)", backdropFilter: "blur(6px)" }),
  };

  // Trip-intent chip — lifted verbatim from the old persona nav; adapts to the
  // transparent/solid sky state. Opens the chooser to switch intent anytime.
  const chipStyle: CSSProperties = {
    cursor: "pointer",
    border: 0,
    fontFamily: "var(--ui)",
    fontWeight: 700,
    fontSize: "0.74rem",
    padding: "7px 12px",
    borderRadius: 99,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    ...(sky
      ? {
          background: "var(--pk-panel)",
          color: "var(--pk-text)",
          boxShadow: "inset 0 0 0 1px var(--pk-line-soft)",
        }
      : {
          // Transparent-nav state sits over hero imagery that can be light or dark —
          // an ink-tinted scrim + ring + text-shadow keeps the chip legible either way.
          background: "oklch(0.30 0.05 225 / .35)",
          color: "var(--pk-on-ink)",
          backdropFilter: "blur(6px)",
          boxShadow: "inset 0 0 0 1px oklch(1 0 0 / .3)",
          textShadow: "0 1px 8px oklch(0.30 0.05 225 / .55)",
        }),
  };

  return (
    <>
      <nav style={navStyle}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 22px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              color: "inherit",
              fontFamily: "var(--display)",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            <span className={`seal ${sky ? "t-ink" : "t-paper"}`} style={{ width: 30 }}>
              <span className="ring" />
              <span className="star" />
            </span>
            <span>Driftibo</span>
          </Link>

          <div
            className="nav-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              overflowX: "auto",
              whiteSpace: "nowrap",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {NAV.map((l) => {
              // Thread the chosen lane into Explore so the catalogue opens on it.
              const href =
                l.key === "destinations" && intent ? `${l.href}?intent=${intent}` : l.href;
              return (
                <Link key={l.key} href={href} style={{ ...linkBase, ...(l.key === active ? activeAdd : {}) }}>
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button
              onClick={openChooser}
              title="Change your trip type"
              className="nav-cta"
              style={chipStyle}
            >
              <span style={{ opacity: 0.65 }}>✦</span>{" "}
              {intent ? (
                <>
                  {INTENT_LABEL[intent]} <span style={{ opacity: 0.55, fontWeight: 600 }}>✦ not you?</span>
                </>
              ) : (
                "Where to?"
              )}
            </button>
            {/* Persistent desktop WhatsApp entry — the audit flagged it unreachable on desktop.
                Hidden on mobile (.nav-cta) where StickyWhatsApp already floats. */}
            <a
              href={waLink("a trip my star sent me")}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
              onClick={() => track("whatsapp_click", { source: "nav" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "var(--r-pill)",
                flexShrink: 0,
                ...(sky
                  ? { background: "var(--pk-panel)", color: "var(--pk-ink)", boxShadow: "inset 0 0 0 1px var(--pk-line-soft)" }
                  : { background: "oklch(1 0 0 / .16)", color: "var(--pk-on-ink)", backdropFilter: "blur(6px)", boxShadow: "inset 0 0 0 1px oklch(1 0 0 / .3)" }),
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.057 23.571a.5.5 0 0 0 .614.614l5.723-1.474A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.946 9.946 0 0 1-5.063-1.377l-.363-.214-3.756.967.994-3.643-.236-.376A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </a>
            <Link href="/game" className="nav-cta btn btn-primary btn-sm">
              Spin my star
            </Link>
            <button
              className="nav-burger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              style={burgerStyle}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="nav-drawer"
          style={{
            position: "fixed",
            top: 62,
            left: 0,
            right: 0,
            zIndex: 119,
            background: "var(--pk-sky)",
            boxShadow: "var(--pk-shadow)",
            padding: "14px 22px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <button
            onClick={() => {
              setMenuOpen(false);
              openChooser();
            }}
            style={{
              ...drawerBase,
              textAlign: "left",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--pk-accent-deep)",
              fontWeight: 700,
            }}
          >
            <span style={{ opacity: 0.7 }}>✦</span>{" "}
            {intent ? `${INTENT_LABEL[intent]} ✦ not you?` : "What kind of trip?"}
          </button>
          {NAV.map((l) => (
            <Link
              key={l.key}
              href={l.key === "destinations" && intent ? `${l.href}?intent=${intent}` : l.href}
              onClick={() => setMenuOpen(false)}
              style={{ ...drawerBase, ...(l.key === active ? drawerActiveAdd : {}) }}
            >
              {l.label}
            </Link>
          ))}
          {/* The top-bar Spin CTA is hidden on mobile — surface it (and WhatsApp) in the drawer. */}
          <Link
            href="/game"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary btn-sm"
            style={{ marginTop: 12, justifyContent: "center" }}
          >
            ✦ Spin my star
          </Link>
          <a
            href={waLink("a trip my star sent me")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("whatsapp_click", { source: "drawer" });
              setMenuOpen(false);
            }}
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8, justifyContent: "center" }}
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
