import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

let TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN; // mutable: refreshed in-memory on expiry (see refreshToken)
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const BASE = "https://graph.instagram.com/v21.0";

if (!TOKEN || !ACCOUNT_ID) {
  console.error("Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID");
  process.exit(1);
}

// ── token lifecycle ───────────────────────────────────────────────────────────────────────────────
// Long-lived IG tokens last ~60 days. We refresh REACTIVELY when Graph returns OAuthException/190, and
// nudge PROACTIVELY at startup if an optional INSTAGRAM_TOKEN_ISSUED_AT (ISO date) shows the token is
// past ~50 days old — re-generate before it dies mid-pipeline.
async function refreshToken() {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`token refresh failed: ${json.error.message}`);
  TOKEN = json.access_token;
  const days = Math.round((json.expires_in ?? 0) / 86400);
  console.error(`[instagram-mcp] access token refreshed — valid ~${days} more days`);
  return TOKEN;
}

function remindTokenAge() {
  const issued = process.env.INSTAGRAM_TOKEN_ISSUED_AT;
  if (!issued) {
    console.error("[instagram-mcp] auto-refresh-on-190 active; long-lived tokens last ~60 days. Set INSTAGRAM_TOKEN_ISSUED_AT (ISO date) to get a proactive expiry reminder.");
    return;
  }
  const ageDays = Math.floor((Date.now() - new Date(issued).getTime()) / 86_400_000);
  if (ageDays >= 50) console.error(`[instagram-mcp] ⚠ access token is ~${ageDays} days old (60-day ceiling) — refresh or re-generate it soon.`);
}

// All Graph calls go through here. On an expired/invalid token (OAuthException, code 190), refresh once
// and retry the same request transparently; any other error surfaces to the caller.
async function apiFetch(path, opts = {}, { retried = false } = {}) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE}${path}${sep}access_token=${TOKEN}`;
  const res = await fetch(url, opts);
  const json = await res.json();
  if (json.error) {
    if (!retried && (json.error.code === 190 || json.error.type === "OAuthException")) {
      console.error("[instagram-mcp] OAuthException (code 190) — refreshing access token and retrying once");
      await refreshToken();
      return apiFetch(path, opts, { retried: true });
    }
    throw new Error(json.error.message);
  }
  return json;
}

const server = new McpServer({ name: "instagram", version: "1.0.0" });

server.tool("get_profile", "Fetch Driftibo Instagram account name, followers, and bio", {}, async () => {
  const data = await apiFetch(`/${ACCOUNT_ID}?fields=name,username,biography,followers_count,website`);
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});

server.tool(
  "get_recent_posts",
  "Return the last N Instagram posts with caption, timestamp, and permalink",
  { limit: z.number().int().min(1).max(50).default(10).describe("Number of posts to return") },
  async ({ limit }) => {
    const data = await apiFetch(
      `/${ACCOUNT_ID}/media?fields=id,caption,timestamp,permalink,media_type&limit=${limit}`
    );
    return { content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }] };
  }
);

server.tool(
  "create_post",
  "Publish a photo to the Driftibo Instagram feed (two-step: create container then publish)",
  {
    image_url: z.string().url().describe("Publicly accessible URL of the image to post"),
    caption: z.string().describe("Caption text for the post"),
  },
  async ({ image_url, caption }) => {
    // Step 1: create media container
    const container = await apiFetch(`/${ACCOUNT_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url, caption }),
    });

    // Step 2: publish
    const result = await apiFetch(`/${ACCOUNT_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id }),
    });

    return { content: [{ type: "text", text: `Published. Post ID: ${result.id}` }] };
  }
);

server.tool(
  "create_reel",
  "Publish a Reel to the Driftibo Instagram feed: upload the video container, poll until IG finishes transcoding, then publish",
  {
    video_url: z.string().url().describe("Publicly accessible URL of the .mp4 to post as a Reel"),
    caption: z.string().describe("Caption text for the Reel"),
    cover_url: z.string().url().optional().describe("Publicly accessible URL of the cover/thumbnail frame"),
    share_to_feed: z.boolean().default(true).describe("Also show the Reel in the main feed grid"),
  },
  async ({ video_url, caption, cover_url, share_to_feed }) => {
    // Step 1: create the REELS media container.
    const container = await apiFetch(`/${ACCOUNT_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "REELS",
        video_url,
        caption,
        share_to_feed,
        ...(cover_url ? { cover_url } : {}),
      }),
    });

    // Step 2: poll until IG finishes transcoding — Reels are async (unlike photos), so we must wait for
    // status_code FINISHED before publishing, or media_publish fails with "media not ready".
    const POLL_MS = 5000, MAX_TRIES = 60; // ~5 min ceiling
    let status = "IN_PROGRESS";
    for (let i = 0; i < MAX_TRIES; i++) {
      const s = await apiFetch(`/${container.id}?fields=status_code`);
      status = s.status_code;
      if (status === "FINISHED") break;
      if (status === "ERROR") throw new Error(`Reel container ${container.id} failed processing (status ERROR)`);
      await new Promise((r) => setTimeout(r, POLL_MS));
    }
    if (status !== "FINISHED")
      throw new Error(`Reel container ${container.id} not ready after ${(POLL_MS * MAX_TRIES) / 1000}s (last status ${status})`);

    // Step 3: publish.
    const result = await apiFetch(`/${ACCOUNT_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: container.id }),
    });
    return { content: [{ type: "text", text: `Published Reel. Post ID: ${result.id}` }] };
  }
);

server.tool(
  "get_post_insights",
  "Return engagement insights for one Instagram media (Reel/post): shares, saves, reach, plays, avg watch time, follows. Needs a Professional account + instagram_manage_insights permission.",
  {
    media_id: z.string().describe("The IG media id (from get_recent_posts)"),
    metrics: z
      .string()
      .default("shares,saved,reach,plays,ig_reels_avg_watch_time,follows")
      .describe("Comma-separated insight metrics"),
  },
  async ({ media_id, metrics }) => {
    const data = await apiFetch(`/${media_id}/insights?metric=${encodeURIComponent(metrics)}`);
    // Flatten the verbose Graph shape to { metric: value } for readability.
    const out = {};
    for (const m of data.data ?? []) out[m.name] = m.values?.[0]?.value ?? m.total_value?.value ?? null;
    return { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] };
  }
);

server.tool(
  "get_account_insights",
  "Return account-level trend (follower_count by default; e.g. follower_count,reach) for the Driftibo account over a period. Needs a Professional account + instagram_manage_insights permission.",
  {
    metrics: z.string().default("follower_count").describe("Comma-separated account metrics"),
    period: z.enum(["day", "week", "days_28"]).default("day").describe("Aggregation period"),
    days: z.number().int().min(1).max(30).default(14).describe("How many days back to fetch"),
  },
  async ({ metrics, period, days }) => {
    const since = Math.floor((Date.now() - days * 86_400_000) / 1000);
    const until = Math.floor(Date.now() / 1000);
    const data = await apiFetch(
      `/${ACCOUNT_ID}/insights?metric=${encodeURIComponent(metrics)}&period=${period}&since=${since}&until=${until}`
    );
    return { content: [{ type: "text", text: JSON.stringify(data.data, null, 2) }] };
  }
);

remindTokenAge();
const transport = new StdioServerTransport();
await server.connect(transport);
// ponytail: get_post_insights passes the whole metric list in one call. If Graph rejects a mix of
// time_series + total_value metrics, split the call by metric_type — only worth doing if it actually errors.
