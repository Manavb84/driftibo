"use server";

import { randomUUID } from "crypto";
import sharp from "sharp";
import { getAdminContext } from "@/lib/admin";

// ponytail: anchoring a reference image (refUrl) via multimodal inlineData is a later enhancement.
export async function generateImage(
  prompt: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refUrl?: string,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { supabase, isAdmin } = await getAdminContext();
  if (!isAdmin) return { ok: false, error: "Not authorized." };

  const key = process.env.VERTEX_AI_API_KEY;
  if (!key)
    return {
      ok: false,
      error: "AI generation isn't configured (VERTEX_AI_API_KEY missing).",
    };

  const trimmed = prompt.trim();
  if (!trimmed) return { ok: false, error: "Prompt cannot be empty." };

  const MODEL = "gemini-3.1-flash-image-preview";
  // Security: key sent as Authorization header, not URL query param (prevents leaking into server logs)
  const ENDPOINT = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              trimmed +
              " Premium travel photography, natural light, no people, no text, no logos, no watermark.",
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
      temperature: 0.4,
    },
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false, error: `Gemini ${res.status}` };

  const data = await res.json();
  const img = data?.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data: string; mimeType: string } }) => p?.inlineData,
  )?.inlineData as { data: string; mimeType: string } | undefined;
  if (!img) return { ok: false, error: "No image returned." };

  const buf = Buffer.from(img.data, "base64");
  const out = await sharp(buf)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const path = `ai/${randomUUID()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, out, { contentType: "image/jpeg", upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
  return { ok: true, url: urlData.publicUrl };
}
