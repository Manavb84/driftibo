"use client";

import { useState } from "react";
import FormShell from "@/components/admin/FormShell";
import Field, { ArrayField } from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";
import { upsertPackage, deletePackage } from "@/lib/content-actions";
import type { Package } from "@/lib/content";

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
  const [even, setEven] = useState<string>(initial?.even === true ? "true" : "false");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [portraitImageUrl, setPortraitImageUrl] = useState<string | null>(
    initial?.portraitImageUrl ?? null,
  );

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
      even: even === "true",
      sortOrder: Number(sortOrder),
      portraitImageUrl,
    });
  }

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
