import { getAdminContext } from "@/lib/admin";
import ImagePicker from "@/components/admin/ImagePicker";

export const dynamic = "force-dynamic";

type MediaFile = { name: string; url: string };

async function listFolder(
  supabase: Awaited<ReturnType<typeof getAdminContext>>["supabase"],
  prefix: string,
): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage.from("media").list(prefix, {
    limit: 50,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const path = prefix ? `${prefix}/${f.name}` : f.name;
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      return { name: f.name, url: urlData.publicUrl };
    });
}

export default async function MediaPage() {
  const { supabase } = await getAdminContext(); // layout already guaranteed admin

  const [uploadFiles, aiFiles] = await Promise.all([
    listFolder(supabase, "uploads"),
    listFolder(supabase, "ai"),
  ]);

  const files: MediaFile[] = [...uploadFiles, ...aiFiles];

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "var(--display)", fontSize: "1.9rem", marginBottom: 4 }}>Media</h1>
      <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
        Upload images or generate them with AI. Files are stored in the public{" "}
        <code style={{ fontSize: "0.8em" }}>media</code> bucket.
      </p>

      {/* Upload widget */}
      <div className="card card-pad" style={{ borderRadius: 14, maxWidth: 420, marginBottom: 32 }}>
        {/* ponytail: gallery below doesn't live-refresh after upload; reload the page to see new files. */}
        <ImagePicker value={null} onChange={() => {}} label="Upload to media" />
      </div>

      {/* Gallery */}
      <h2 style={{ fontFamily: "var(--display)", fontSize: "1.2rem", marginBottom: 14 }}>
        Library{" "}
        <span style={{ color: "var(--pk-muted)", fontFamily: "var(--ui)", fontSize: "0.85rem", fontWeight: 400 }}>
          ({files.length} files)
        </span>
      </h2>

      {files.length === 0 ? (
        <p style={{ color: "var(--pk-muted)", fontSize: "0.9rem" }}>
          No files yet. Upload something above.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {files.map((f) => (
            <div
              key={f.url}
              className="card"
              style={{ borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <img
                src={f.url}
                alt={f.name}
                style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "8px 10px" }}>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--pk-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                    fontFamily: "var(--ui)",
                  }}
                  title={f.name}
                >
                  {f.name}
                </p>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.72rem", color: "var(--pk-accent-deep)", textDecoration: "none" }}
                >
                  Open ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
