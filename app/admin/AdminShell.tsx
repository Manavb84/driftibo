"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Admin chrome: left nav + top bar. Sections not built yet show a "soon" tag and
// don't link anywhere (avoids 404s while phases land).
const NAV: { href: string; label: string; ready: boolean }[] = [
  { href: "/admin", label: "Dashboard", ready: true },
  { href: "/admin/destinations", label: "Destinations", ready: true },
  { href: "/admin/blog", label: "Blog", ready: true },
  { href: "/admin/packages", label: "Packages", ready: true },
  { href: "/admin/offerings", label: "Offerings", ready: true },
  { href: "/admin/media", label: "Media", ready: true },
];

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "232px 1fr", minHeight: "100vh", background: "var(--pk-bg, oklch(0.97 0.01 220))" }}>
      {/* Sidebar */}
      <aside style={{ background: "var(--pk-ink, oklch(0.28 0.04 235))", color: "var(--pk-on-ink, #fff)", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "inherit", padding: "4px 8px 16px" }}>
          <span className="seal t-ink" style={{ width: 26 }}>
            <span className="ring" />
            <span className="star" />
          </span>
          <b style={{ fontFamily: "var(--display)", fontSize: "1.15rem" }}>Admin</b>
        </Link>
        {NAV.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          if (!n.ready)
            return (
              <span key={n.href} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 10px", fontSize: "0.88rem", opacity: 0.45, fontFamily: "var(--ui)" }}>
                {n.label}
                <span style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid currentColor", borderRadius: 6, padding: "1px 5px" }}>soon</span>
              </span>
            );
          return (
            <Link key={n.href} href={n.href} style={{ padding: "9px 10px", borderRadius: 9, fontSize: "0.9rem", fontWeight: active ? 700 : 500, fontFamily: "var(--ui)", textDecoration: "none", color: "inherit", background: active ? "oklch(1 0 0 / .14)" : "transparent" }}>
              {n.label}
            </Link>
          );
        })}
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid oklch(1 0 0 / .14)" }}>
          <p style={{ fontSize: "0.74rem", opacity: 0.7, padding: "0 8px", wordBreak: "break-all" }}>{email}</p>
          <button onClick={signOut} style={{ marginTop: 8, background: "none", border: 0, color: "inherit", opacity: 0.8, fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline", padding: "0 8px", fontFamily: "var(--ui)" }}>
            Sign out
          </button>
          <Link href="/" style={{ display: "block", marginTop: 8, fontSize: "0.78rem", opacity: 0.7, color: "inherit", textDecoration: "none", padding: "0 8px" }}>
            ↗ View site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div style={{ padding: "30px 34px", minWidth: 0 }}>{children}</div>
    </div>
  );
}
