"use server";

import { randomUUID } from "crypto";
import sharp from "sharp";
import { getAdminContext } from "@/lib/admin";

export async function uploadMedia(
  formData: FormData,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const file = formData.get("file") as File | null;
  if (!file) return { ok: false, error: "No file provided." };
  if (!file.type.startsWith("image/")) return { ok: false, error: "File must be an image." };

  const buf = Buffer.from(await file.arrayBuffer());
  const out = await sharp(buf)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const path = `uploads/${randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, out, { contentType: "image/jpeg", upsert: false });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
