import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/r/"] },
    sitemap: "https://driftibo.com/sitemap.xml",
    host: "https://driftibo.com",
  };
}
