"use client";

import { useState } from "react";
import FormShell from "@/components/admin/FormShell";
import Field from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";
import BlockEditor from "@/components/admin/BlockEditor";
import { upsertArticle, deleteArticle } from "@/lib/content-actions";
import type { BodyBlock } from "@/lib/content";

interface ArticleShape {
  id: string;
  slug: string;
  title: string;
  dek: string;
  kind: string;
  read: string;
  photo: string;
  scene: string;
  body: BodyBlock[];
  heroImageUrl: string | null;
  status: string;
  sortOrder: number;
}

interface BlogFormProps {
  initial?: ArticleShape;
}

const SCENE_OPTIONS = [
  { value: "s-chopta", label: "Chopta" },
  { value: "s-spiti", label: "Spiti" },
  { value: "s-ziro", label: "Ziro" },
  { value: "s-gokarna", label: "Gokarna" },
  { value: "s-gangtey", label: "Gangtey" },
  { value: "s-dusk", label: "Dusk" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export default function BlogForm({ initial }: BlogFormProps) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [dek, setDek] = useState(initial?.dek ?? "");
  const [kind, setKind] = useState(initial?.kind ?? "");
  const [read, setRead] = useState(initial?.read ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [scene, setScene] = useState(initial?.scene ?? "s-chopta");
  const [status, setStatus] = useState(initial?.status ?? "published");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(
    initial?.heroImageUrl ?? null,
  );
  const [body, setBody] = useState<BodyBlock[]>(initial?.body ?? []);

  async function onSubmit() {
    return upsertArticle({
      id: initial?.id,
      slug,
      title,
      dek,
      kind,
      read,
      photo,
      scene,
      status,
      sortOrder: Number(sortOrder),
      heroImageUrl,
      body,
    });
  }

  return (
    <>
      <FormShell
        title={initial ? "Edit post" : "New post"}
        backHref="/admin/blog"
        onSubmit={onSubmit}
      >
        <Field label="Slug" value={slug} onChange={setSlug} placeholder="e.g. best-cafes-in-chopta" />
        <Field label="Title" value={title} onChange={setTitle} placeholder="Article title" />
        <Field label="Kind" value={kind} onChange={setKind} placeholder="e.g. guide, story, list" />
        <Field label="Read time" value={read} onChange={setRead} placeholder="e.g. 5 min read" />
        <Field label="Photo credit / caption" value={photo} onChange={setPhoto} placeholder="e.g. Photo: Unsplash" />
        <Field
          label="Dek"
          value={dek}
          onChange={setDek}
          type="textarea"
          placeholder="Short article description shown in cards"
        />
        <Field
          label="Scene palette"
          value={scene}
          onChange={setScene}
          type="select"
          options={SCENE_OPTIONS}
        />
        <Field
          label="Status"
          value={status}
          onChange={setStatus}
          type="select"
          options={STATUS_OPTIONS}
        />
        <Field
          label="Sort order"
          value={sortOrder}
          onChange={setSortOrder}
          type="number"
          hint="Lower numbers appear first."
        />
        <ImagePicker label="Hero image" value={heroImageUrl} onChange={setHeroImageUrl} />
        <BlockEditor value={body} onChange={setBody} label="Article body" />
      </FormShell>

      {initial?.id && (
        <div style={{ maxWidth: 720, marginTop: 24 }}>
          <DeleteButton
            id={initial.id}
            onDelete={deleteArticle}
            afterHref="/admin/blog"
          />
        </div>
      )}
    </>
  );
}
