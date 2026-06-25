import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const BASE = "https://graph.instagram.com/v21.0";

if (!TOKEN || !ACCOUNT_ID) {
  console.error("Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID");
  process.exit(1);
}

async function apiFetch(path, opts = {}) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${BASE}${path}${sep}access_token=${TOKEN}`;
  const res = await fetch(url, opts);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
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

const transport = new StdioServerTransport();
await server.connect(transport);
