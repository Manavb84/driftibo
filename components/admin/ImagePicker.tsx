"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/media-actions";
import { generateImage } from "@/lib/ai-image";

interface ImagePickerProps {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const [pasteUrl, setPasteUrl] = useState(value ?? "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadMedia(fd);
      if (result.ok && result.url) {
        onChange(result.url);
        setPasteUrl(result.url);
      } else {
        setUploadError(result.error ?? "Upload failed.");
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenError(null);
    setGenerating(true);
    try {
      const result = await generateImage(prompt);
      if (result.ok && result.url) {
        onChange(result.url);
        setPasteUrl(result.url);
      } else {
        setGenError(result.error ?? "Generation failed.");
      }
    } finally {
      setGenerating(false);
    }
  }

  function handlePasteUrl(e: React.ChangeEvent<HTMLInputElement>) {
    setPasteUrl(e.target.value);
    onChange(e.target.value);
  }

  const busy = uploading || generating;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {label && (
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--pk-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </label>
      )}

      {/* Preview */}
      {value ? (
        <img
          src={value}
          alt="Preview"
          style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: "1px solid var(--pk-line)" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 120,
            borderRadius: 10,
            border: "1px dashed var(--pk-line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--pk-muted)",
            fontSize: "0.82rem",
            background: "var(--pk-panel)",
          }}
        >
          No image
        </div>
      )}

      {/* Upload */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          className="btn btn-sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          style={{ opacity: busy ? 0.6 : 1 }}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={busy}
        />
        {uploadError && (
          <span style={{ fontSize: "0.78rem", color: "oklch(0.55 0.2 25)" }}>{uploadError}</span>
        )}
      </div>

      {/* AI generation */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe an image to generate with AI…"
          rows={2}
          disabled={busy}
          style={{
            resize: "vertical",
            fontSize: "0.85rem",
            padding: "7px 10px",
            borderRadius: 8,
            border: "1px solid var(--pk-line)",
            background: "var(--pk-panel)",
            color: "var(--pk-text)",
            fontFamily: "var(--ui)",
            opacity: busy ? 0.6 : 1,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="btn btn-sm btn-accent"
            disabled={busy || !prompt.trim()}
            onClick={handleGenerate}
            style={{ opacity: busy || !prompt.trim() ? 0.6 : 1 }}
          >
            {generating ? "Generating…" : "Generate with AI"}
          </button>
          {genError && (
            <span style={{ fontSize: "0.78rem", color: "oklch(0.55 0.2 25)" }}>{genError}</span>
          )}
        </div>
      </div>

      {/* Paste URL fallback */}
      <input
        type="url"
        value={pasteUrl}
        onChange={handlePasteUrl}
        placeholder="Or paste an image URL…"
        disabled={busy}
        style={{
          fontSize: "0.82rem",
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid var(--pk-line)",
          background: "var(--pk-panel)",
          color: "var(--pk-text)",
          fontFamily: "var(--ui)",
          opacity: busy ? 0.6 : 1,
        }}
      />
    </div>
  );
}
