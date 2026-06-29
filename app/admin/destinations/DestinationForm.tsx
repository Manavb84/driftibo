"use client";

import { useState } from "react";
import FormShell from "@/components/admin/FormShell";
import Field, { ArrayField } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";
import { upsertDestination, deleteDestination } from "@/lib/content-actions";
import type { Destination, ItinDay } from "@/lib/content";

const SCENE_OPTIONS = [
  { value: "", label: "— none —" },
  { value: "s-chopta", label: "s-chopta" },
  { value: "s-spiti", label: "s-spiti" },
  { value: "s-ziro", label: "s-ziro" },
  { value: "s-gokarna", label: "s-gokarna" },
  { value: "s-gangtey", label: "s-gangtey" },
  { value: "s-dusk", label: "s-dusk" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "published" },
  { value: "draft", label: "draft" },
];

// Lane = the intent this product surfaces under (international | india | spiritual).
const LANE_OPTIONS = [
  { value: "india", label: "India" },
  { value: "international", label: "International" },
  { value: "spiritual", label: "Spiritual" },
];

interface Props {
  initial?: Destination;
}

export default function DestinationForm({ initial }: Props) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [lookLike, setLookLike] = useState(initial?.lookLike ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [scene, setScene] = useState(initial?.scene ?? "");
  const [rate, setRate] = useState(initial?.rate ?? "");
  const [dayCount, setDayCount] = useState(initial?.dayCount ?? "");
  const [lede, setLede] = useState(initial?.lede ?? "");
  const [mood, setMood] = useState(initial?.mood ?? "");
  const [catches, setCatches] = useState<string[]>(initial?.catches ?? []);
  const [numbers, setNumbers] = useState<string[]>(initial?.numbers ?? []);
  const [inclusions, setInclusions] = useState<string[]>(initial?.inclusions ?? []);
  const [exclusions, setExclusions] = useState<string[]>(initial?.exclusions ?? []);
  const [status, setStatus] = useState(initial?.status ?? "published");
  const [lane, setLane] = useState<string>(initial?.lane ?? "india");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(
    initial?.heroImageUrl ?? null,
  );
  const [portraitImageUrl, setPortraitImageUrl] = useState<string | null>(
    initial?.portraitImageUrl ?? null,
  );
  const [days, setDays] = useState<ItinDay[]>(initial?.days ?? []);

  function addDay() {
    setDays((prev) => [...prev, { d: "", t: "", p: "" }]);
  }

  function updateDay(index: number, field: keyof ItinDay, value: string) {
    setDays((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day)),
    );
  }

  function removeDay(index: number) {
    setDays((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit() {
    return upsertDestination({
      id: initial?.id,
      slug,
      name,
      lookLike,
      region,
      alt,
      tag,
      photo,
      scene,
      rate,
      dayCount,
      lede,
      mood,
      catches,
      numbers,
      inclusions,
      exclusions,
      status,
      lane: lane as Destination["lane"],
      sortOrder: Number(sortOrder),
      heroImageUrl,
      portraitImageUrl,
      days,
    });
  }

  const INPUT_STYLE: React.CSSProperties = {
    fontFamily: "var(--ui)",
    fontSize: "0.92rem",
    padding: "9px 12px",
    border: "1px solid var(--pk-line)",
    borderRadius: 10,
    background: "var(--pk-card, #fff)",
    color: "var(--pk-text)",
    boxSizing: "border-box",
    outline: "none",
    flex: 1,
  };

  const LABEL_STYLE: React.CSSProperties = {
    fontFamily: "var(--ui)",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--pk-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 4,
    display: "block",
  };

  return (
    <>
      <FormShell
        title={initial ? "Edit destination" : "New destination"}
        backHref="/admin/destinations"
        onSubmit={onSubmit}
      >
        <Field label="Slug" value={slug} onChange={setSlug} placeholder="e.g. chopta" />
        <Field label="Name" value={name} onChange={setName} placeholder="e.g. Chopta" />
        <Field label="Look Like" value={lookLike} onChange={setLookLike} placeholder="e.g. A Himalayan hamlet" />
        <Field label="Region" value={region} onChange={setRegion} placeholder="e.g. Uttarakhand" />
        <Field label="Alt" value={alt} onChange={setAlt} placeholder="Image alt text" />
        <Field label="Tag" value={tag} onChange={setTag} placeholder="e.g. Himalayan escape" />
        <Field label="Photo" value={photo} onChange={setPhoto} placeholder="Scene CSS class or identifier" />
        <Field
          label="Scene"
          value={scene}
          onChange={setScene}
          type="select"
          options={SCENE_OPTIONS}
        />
        <Field label="Rate" value={rate} onChange={setRate} placeholder="e.g. ₹18,000" />
        <Field label="Day Count" value={dayCount} onChange={setDayCount} placeholder="e.g. 5 days" />
        <Field label="Lede" value={lede} onChange={setLede} type="textarea" placeholder="Short intro paragraph" />
        <Field label="Mood" value={mood} onChange={setMood} type="textarea" placeholder="Mood/vibe description" />
        <ArrayField
          label="Catches (one per line)"
          value={catches}
          onChange={setCatches}
          hint="Each line becomes one catch item"
        />
        <ArrayField
          label="Numbers (one per line)"
          value={numbers}
          onChange={setNumbers}
          hint="Each line becomes one stat"
        />
        <ArrayField
          label="What's included (one per line)"
          value={inclusions}
          onChange={setInclusions}
          hint="Shown as a ✓ list on the destination page"
        />
        <ArrayField
          label="Not included (one per line)"
          value={exclusions}
          onChange={setExclusions}
          hint="Shown as a ✗ list on the destination page"
        />
        <Field
          label="Status"
          value={status}
          onChange={setStatus}
          type="select"
          options={STATUS_OPTIONS}
        />
        <Field
          label="Lane"
          value={lane}
          onChange={setLane}
          type="select"
          options={LANE_OPTIONS}
        />
        <Field
          label="Sort Order"
          value={sortOrder}
          onChange={setSortOrder}
          type="number"
        />

        <ImagePicker label="Hero Image" value={heroImageUrl} onChange={setHeroImageUrl} />
        <ImagePicker label="Portrait Image" value={portraitImageUrl} onChange={setPortraitImageUrl} />

        {/* Days inline repeatable editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={LABEL_STYLE}>Itinerary Days</label>
          {days.map((day, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 3fr auto",
                gap: 8,
                alignItems: "center",
                padding: "10px 12px",
                background: "var(--pk-panel)",
                borderRadius: 10,
                border: "1px solid var(--pk-line)",
              }}
            >
              <input
                type="text"
                value={day.d}
                onChange={(e) => updateDay(i, "d", e.target.value)}
                placeholder="Day (e.g. Day 1)"
                style={INPUT_STYLE}
              />
              <input
                type="text"
                value={day.t}
                onChange={(e) => updateDay(i, "t", e.target.value)}
                placeholder="Title"
                style={INPUT_STYLE}
              />
              <input
                type="text"
                value={day.p}
                onChange={(e) => updateDay(i, "p", e.target.value)}
                placeholder="Description"
                style={INPUT_STYLE}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeDay(i)}
                style={{ color: "oklch(0.5 0.15 20)", whiteSpace: "nowrap" }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm"
            onClick={addDay}
            style={{ alignSelf: "flex-start" }}
          >
            + Add day
          </button>
        </div>
      </FormShell>

      {initial?.id && (
        <div style={{ maxWidth: 720, marginTop: 24 }}>
          <DeleteButton
            id={initial.id}
            onDelete={deleteDestination}
            afterHref="/admin/destinations"
          />
        </div>
      )}
    </>
  );
}
