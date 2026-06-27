"use client";

import { useState } from "react";
import FormShell from "@/components/admin/FormShell";
import Field from "@/components/admin/Field";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";
import { upsertOffering, deleteOffering } from "@/lib/content-actions";

interface OfferingInitial {
  id: string;
  slug: string;
  name: string;
  photo: string;
  descr: string;
  formSub: string;
  imageUrl: string | null;
  sortOrder: number;
}

interface OfferingFormProps {
  initial?: OfferingInitial;
}

export default function OfferingForm({ initial }: OfferingFormProps) {
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [descr, setDescr] = useState(initial?.descr ?? "");
  const [formSub, setFormSub] = useState(initial?.formSub ?? "");
  const [sortOrder, setSortOrder] = useState(
    String(initial?.sortOrder ?? 0),
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );

  async function onSubmit() {
    return upsertOffering({
      id: initial?.id,
      slug,
      name,
      photo,
      descr,
      formSub,
      sortOrder: Number(sortOrder),
      imageUrl,
    });
  }

  return (
    <>
      <FormShell
        title={initial ? "Edit offering" : "New offering"}
        backHref="/admin/offerings"
        onSubmit={onSubmit}
      >
        <Field
          label="Slug"
          value={slug}
          onChange={setSlug}
          hint="display label e.g. /surprise"
        />
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Photo" value={photo} onChange={setPhoto} />
        <Field
          label="Description"
          value={descr}
          onChange={setDescr}
          type="textarea"
        />
        <Field
          label="Form sub"
          value={formSub}
          onChange={setFormSub}
          type="textarea"
        />
        <Field
          label="Sort order"
          value={sortOrder}
          onChange={setSortOrder}
          type="number"
        />
        <ImagePicker
          label="Image"
          value={imageUrl}
          onChange={setImageUrl}
        />
      </FormShell>

      {initial?.id && (
        <div style={{ marginTop: 24 }}>
          <DeleteButton
            id={initial.id}
            onDelete={deleteOffering}
            afterHref="/admin/offerings"
          />
        </div>
      )}
    </>
  );
}
