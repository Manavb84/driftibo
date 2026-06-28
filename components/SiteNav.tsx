"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

type NavItem = { href: string; label: string; key: string };

const NAV: NavItem[] = [
  { href: "/play", label: "Play", key: "play" },
  { href: "/packages", label: "Packages", key: "packages" },
  { href: "/destinations", label: "Explore", key: "destinations" },
  { href: "/offerings", label: "Plan with us", key: "offerings" },
  { href: "/journal", label: "Journal", key: "journal" },
  { href: "/about", label: "About", key: "about" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const active = (pathname || "/").replace(/^\//, "").split("/")[0];

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
            {NAV.map((l) => (
              <Link key={l.key} href={l.href} style={{ ...linkBase, ...(l.key === active ? activeAdd : {}) }}>
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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
          {NAV.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ ...drawerBase, ...(l.key === active ? drawerActiveAdd : {}) }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
