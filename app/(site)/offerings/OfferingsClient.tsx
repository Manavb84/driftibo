"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import WhatsAppClose from "@/components/WhatsAppClose";
import { PERSONA } from "@/lib/persona";
import { submitCapture } from "@/lib/actions";
import type { Offering } from "@/lib/content";

// ─── Static UI constants ──────────────────────────────────────────────────────

const WHO_CHIPS = ["Just us two", "Squad", "Family", "A team"] as const;
type Who = (typeof WHO_CHIPS)[number];

// ─── Component ───────────────────────────────────────────────────────────────

export default function OfferingsClient({ offers }: { offers: Offering[] }) {
  const persona = PERSONA;
  const [offering, setOffering] = useState<string>(offers[0]?.name ?? "");
  const [who, setWho] = useState<Who>("Squad");

  // Form fields
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [consent, setConsent] = useState(false);

  // Submission state
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const intakeRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    try {
      if (intakeRef.current) {
        window.scrollTo({
          top: intakeRef.current.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }
    } catch (_) {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // DPDP consent guard — no capture write until the box is ticked.
    if (!consent) {
      setStatus("error");
      setErrorMsg("Please tick the consent box so we can reply.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const result = await submitCapture({
      kind: "offering",
      name,
      whatsapp,
      email,
      persona: persona ?? "mil",
      data: { dates, who, offeringType: offering },
    });
    if (result.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong. Please try again.");
    }
  }

  const formTitle =
    offering === "Surprise me"
      ? "Let the star send me"
      : `Plan my ${offering
          .toLowerCase()
          .replace(" & honeymoon", "")
          .replace(" offsites", "")} trip`;

  const formContext = `${offering} — ${who.toLowerCase()}`;

  // Shared label/input styles (matching prototype fl/fi)
  const fl: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    margin: "14px 0 0",
  };
  const fi: React.CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 6,
    padding: "11px 13px",
    borderRadius: 10,
    border: "1px solid var(--pk-line)",
    background: "var(--pk-paper)",
    fontFamily: "var(--ui)",
    fontSize: "0.9rem",
  };

  return (
    <main
      style={{ padding: "104px 22px 72px", maxWidth: 1000, margin: "0 auto", minHeight: "100vh" }}
    >
      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <p className="kicker">When you want a human, not a spin</p>
        <h1
          className="display-mega"
          style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", margin: "6px 0 6px" }}
        >
          Ways to be sent
        </h1>
        <p className="lede" style={{ maxWidth: "46ch", margin: "0 auto" }}>
          Pick a lane. Tell us a little. Everything closes on WhatsApp — a quote, never a booking
          form.
        </p>
      </div>

      {/* ── OFFERING CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {offers.map((o) => {
          const isOn = o.name === offering;
          return (
            <article
              key={o.name}
              style={{
                background: "var(--pk-card)",
                borderRadius: 20,
                overflow: "hidden",
                transition: "box-shadow .18s ease,transform .18s ease",
                boxShadow: isOn
                  ? "0 0 0 2px var(--pk-accent), var(--pk-shadow)"
                  : "var(--pk-shadow-sm)",
              }}
            >
              <div
                // Fall back to a scene class only when photo holds a scene token
                // (s-*); otherwise just the base .well gradient (photo may be prose).
                className={`well ${o.imageUrl ? "" : o.photo?.startsWith("s-") ? o.photo : ""}`}
                style={{
                  aspectRatio: "16/9",
                  ...(o.imageUrl
                    ? {
                        backgroundImage: `url(${o.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}),
                }}
                data-label={o.photo}
              />
              <div className="card-pad">
                <p className="kicker">{o.slug}</p>
                <h3
                  className="display"
                  style={{ fontSize: "1.4rem", margin: "2px 0 4px" }}
                >
                  {o.name}
                </h3>
                <p
                  style={{
                    color: "var(--pk-muted)",
                    fontSize: "0.86rem",
                    marginBottom: 12,
                  }}
                >
                  {o.descr}
                </p>
                <button
                  onClick={() => {
                    setOffering(o.name);
                    scrollToForm();
                  }}
                  className={isOn ? "btn btn-accent btn-sm" : "btn btn-primary btn-sm"}
                >
                  {isOn ? "Selected ✦" : "Start"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── INTAKE FORM ── */}
      <div
        ref={intakeRef}
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 18,
          maxWidth: 560,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div className="card card-pad">
          <p className="kicker">Tell us a little</p>
          <h3 className="display" style={{ fontSize: "1.6rem", margin: "4px 0 4px" }}>
            {formTitle}
          </h3>
          <p style={{ color: "var(--pk-muted)", fontSize: "0.88rem", marginBottom: 16 }}>
            {offers.find((o) => o.name === offering)?.formSub ?? ""}
          </p>

          {status === "success" ? (
            <div
              style={{
                padding: "20px",
                background: "var(--pk-panel)",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p
                className="display"
                style={{ fontSize: "1.3rem", color: "var(--pk-accent-deep)" }}
              >
                ✦ Sent!
              </p>
              <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginTop: 6 }}>
                We&apos;ll reach you on WhatsApp in under 60 seconds.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <label style={{ ...fl, flex: 1, minWidth: 160 }}>
                  Name
                  <input
                    style={fi}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label style={{ ...fl, flex: 1, minWidth: 160 }}>
                  WhatsApp
                  <input
                    type="tel"
                    placeholder="+91"
                    style={fi}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <label style={{ ...fl, flex: 1, minWidth: 160 }}>
                  Email
                  <input
                    type="email"
                    style={fi}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label style={{ ...fl, flex: 1, minWidth: 160 }}>
                  Rough dates
                  <input
                    placeholder="July, ~5 days"
                    style={fi}
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </label>
              </div>
              <p style={fl}>Who&apos;s coming</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                {WHO_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className={`pill${who === chip ? " is-on" : ""}`}
                    onClick={() => setWho(chip)}
                    style={{ cursor: "pointer" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <label style={{ display: "flex", gap: 10, fontSize: "0.74rem", color: "var(--pk-muted)", lineHeight: 1.5, marginTop: 16 }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: 3, accentColor: "var(--pk-ink)" }}
                />
                <span>
                  I agree Driftibo may contact me about this trip via WhatsApp/email, per the{" "}
                  <Link href="/legal#privacy" style={{ color: "var(--pk-accent-deep)" }}>Privacy Notice</Link>.{" "}
                  <em style={{ fontStyle: "normal", color: "var(--pk-accent-deep)", fontWeight: 600 }}>DPDP — not pre-ticked.</em>
                </span>
              </label>

              {status === "error" && (
                <p
                  style={{
                    color: "oklch(0.55 0.2 25)",
                    fontSize: "0.85rem",
                    marginTop: 10,
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-accent"
                disabled={status === "loading" || !consent}
                style={{ marginTop: 18, width: "100%" }}
              >
                {status === "loading" ? "Sending…" : "Send to a human →"}
              </button>
            </form>
          )}
        </div>

        <WhatsAppClose
          eyebrow={offering}
          heading="Send it to a human"
          sub="We read it, reply in under 60 seconds, and take it from there on chat."
          context={formContext}
        />
      </div>
    </main>
  );
}
