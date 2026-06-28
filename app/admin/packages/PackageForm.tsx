"use client";

import { useState } from "react";
import FormShell from "@/components/admin/FormShell";
import Field, { ArrayField } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";
import { upsertPackage, deletePackage } from "@/lib/content-actions";
import type { Package, Tier } from "@/lib/content";

interface PackageFormProps {
  initial?: Package;
}

const GLOW_OPTIONS = [
  { value: "", label: "— none —" },
  { value: "glow-teal", label: "glow-teal" },
  { value: "glow-coral", label: "glow-coral" },
];

const SCENE_OPTIONS = [
  { value: "", label: "— none —" },
  { value: "s-chopta", label: "s-chopta" },
  { value: "s-spiti", label: "s-spiti" },
  { value: "s-ziro", label: "s-ziro" },
  { value: "s-gokarna", label: "s-gokarna" },
  { value: "s-gangtey", label: "s-gangtey" },
  { value: "s-dusk", label: "s-dusk" },
];

const EVEN_OPTIONS = [
  { value: "false", label: "false" },
  { value: "true", label: "true" },
];

export default function PackageForm({ initial }: PackageFormProps) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [kicker, setKicker] = useState(initial?.kicker ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [glow, setGlow] = useState(initial?.glow ?? "");
  const [rate, setRate] = useState(initial?.rate ?? "");
  const [nights, setNights] = useState(initial?.nights ?? "");
  const [cta, setCta] = useState(initial?.cta ?? "");
  const [context, setContext] = useState(initial?.context ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [wellScene, setWellScene] = useState(initial?.wellScene ?? "");
  const [departures, setDepartures] = useState(initial?.departures ?? "");
  const [tiers, setTiers] = useState<Tier[]>(initial?.tiers ?? []);
  const [even, setEven] = useState<string>(initial?.even === true ? "true" : "false");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [portraitImageUrl, setPortraitImageUrl] = useState<string | null>(
    initial?.portraitImageUrl ?? null,
  );

  // ── Tier inline editor helpers (mirrors DestinationForm's days editor) ──
  function addTier() {
    setTiers((prev) => [
      ...prev,
      { key: "", label: "", priceINR: 0, nights: "", blurb: "", inclusions: [], exclusions: [] },
    ]);
  }
  function updateTier<K extends keyof Tier>(index: number, field: K, value: Tier[K]) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }
  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit() {
    return upsertPackage({
      id: initial?.id,
      slug,
      kicker,
      name,
      region,
      photo,
      glow,
      rate,
      nights,
      cta,
      context,
      blurb,
      tags,
      wellScene,
      departures,
      // Default a tier key from its label if the founder left it blank.
      tiers: tiers.map((t) => ({ ...t, key: t.key || t.label.toLowerCase().replace(/\s+/g, "-") })),
      even: even === "true",
      sortOrder: Number(sortOrder),
      portraitImageUrl,
    });
  }

  const TIER_INPUT: React.CSSProperties = {
    fontFamily: "var(--ui)",
    fontSize: "0.92rem",
    padding: "9px 12px",
    border: "1px solid var(--pk-line)",
    borderRadius: 10,
    background: "var(--pk-card, #fff)",
    color: "var(--pk-text)",
    boxSizing: "border-box",
    outline: "none",
    width: "100%",
  };
  const TIER_LABEL: React.CSSProperties = {
    fontFamily: "var(--ui)",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--pk-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: 4,
  };

  return (
    <>
      <FormShell
        title={initial ? "Edit package" : "New package"}
        backHref="/admin/packages"
        onSubmit={onSubmit}
      >
        <Field label="Slug" value={slug} onChange={setSlug} placeholder="e.g. spiti-winter" />
        <Field label="Kicker" value={kicker} onChange={setKicker} placeholder="e.g. High Altitude" />
        <Field label="Name" value={name} onChange={setName} placeholder="e.g. Spiti Winter Escape" />
        <Field label="Region" value={region} onChange={setRegion} placeholder="e.g. Himachal Pradesh" />
        <Field label="Photo" value={photo} onChange={setPhoto} placeholder="scene token or colour class" />
        <Field
          label="Glow"
          value={glow}
          onChange={setGlow}
          type="select"
          options={GLOW_OPTIONS}
        />
        <Field label="Rate" value={rate} onChange={setRate} placeholder="e.g. ₹28,000" />
        <Field label="Nights" value={nights} onChange={setNights} placeholder="e.g. 7 nights" />
        <Field label="CTA" value={cta} onChange={setCta} placeholder="e.g. Book now" />
        <Field label="Context" value={context} onChange={setContext} placeholder="e.g. Per person, twin sharing" />
        <Field label="Blurb" value={blurb} onChange={setBlurb} type="textarea" placeholder="Short description…" />
        <ArrayField
          label="Tags"
          value={tags}
          onChange={setTags}
          hint="One tag per line"
        />
        <Field
          label="Well Scene"
          value={wellScene}
          onChange={setWellScene}
          type="select"
          options={SCENE_OPTIONS}
        />
        <Field
          label="Departures"
          value={departures}
          onChange={setDepartures}
          placeholder="e.g. Apr–Jun & Sep–Nov; fixed departures every 2 weeks"
          hint="Shown above the fold on the package page"
        />

        {/* Tiers — inline repeatable editor (Budget · Comfort · Luxury) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={TIER_LABEL}>Price tiers (budget → luxury)</label>
          {tiers.map((t, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gap: 8,
                padding: "12px 14px",
                background: "var(--pk-panel)",
                borderRadius: 12,
                border: "1px solid var(--pk-line)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, alignItems: "end" }}>
                <div>
                  <label style={TIER_LABEL}>Label</label>
                  <input
                    style={TIER_INPUT}
                    value={t.label}
                    onChange={(e) => updateTier(i, "label", e.target.value)}
                    placeholder="Comfort"
                  />
                </div>
                <div>
                  <label style={TIER_LABEL}>Price ₹</label>
                  <input
                    style={TIER_INPUT}
                    type="number"
                    value={String(t.priceINR ?? 0)}
                    onChange={(e) => updateTier(i, "priceINR", Number(e.target.value))}
                    placeholder="20500"
                  />
                </div>
                <div>
                  <label style={TIER_LABEL}>Nights</label>
                  <input
                    style={TIER_INPUT}
                    value={t.nights}
                    onChange={(e) => updateTier(i, "nights", e.target.value)}
                    placeholder="5 nights"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeTier(i)}
                  style={{ color: "oklch(0.5 0.15 20)", whiteSpace: "nowrap" }}
                >
                  Remove
                </button>
              </div>
              <div>
                <label style={TIER_LABEL}>Blurb</label>
                <input
                  style={TIER_INPUT}
                  value={t.blurb}
                  onChange={(e) => updateTier(i, "blurb", e.target.value)}
                  placeholder="One line on what this tier feels like"
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={TIER_LABEL}>Included (one per line)</label>
                  <textarea
                    style={{ ...TIER_INPUT, resize: "vertical", lineHeight: 1.5 }}
                    rows={4}
                    value={t.inclusions.join("\n")}
                    onChange={(e) => updateTier(i, "inclusions", e.target.value.split("\n"))}
                  />
                </div>
                <div>
                  <label style={TIER_LABEL}>Not included (one per line)</label>
                  <textarea
                    style={{ ...TIER_INPUT, resize: "vertical", lineHeight: 1.5 }}
                    rows={4}
                    value={t.exclusions.join("\n")}
                    onChange={(e) => updateTier(i, "exclusions", e.target.value.split("\n"))}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-sm" onClick={addTier} style={{ alignSelf: "flex-start" }}>
            + Add tier
          </button>
        </div>

        <Field
          label="Even"
          value={even}
          onChange={setEven}
          type="select"
          options={EVEN_OPTIONS}
          hint="Layout: even = image on right"
        />
        <Field
          label="Sort Order"
          value={sortOrder}
          onChange={setSortOrder}
          type="number"
        />
        <ImagePicker
          label="Portrait Image"
          value={portraitImageUrl}
          onChange={setPortraitImageUrl}
        />
      </FormShell>

      {initial?.id && (
        <div style={{ marginTop: 24, maxWidth: 720 }}>
          <DeleteButton
            id={initial.id}
            onDelete={deletePackage}
            afterHref="/admin/packages"
          />
        </div>
      )}
    </>
  );
}
