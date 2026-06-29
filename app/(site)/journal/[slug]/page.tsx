import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticle, getArticles } from "@/lib/content";

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  const image = article.heroImageUrl ?? "/og.jpg";
  return {
    title: `${article.title} · Driftibo`,
    description: article.dek,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.dek,
      images: [image],
      type: "article",
      url: `/journal/${article.slug}`,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.dek, images: [image] },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const displayDate = formatDate(article.publishedAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    author: { "@type": "Organization", name: "Driftibo", url: "https://driftibo.com" },
    publisher: { "@type": "Organization", name: "Driftibo", url: "https://driftibo.com" },
    mainEntityOfPage: `https://driftibo.com/journal/${article.slug}`,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://driftibo.com" },
      { "@type": "ListItem", position: 2, name: "Journal", item: "https://driftibo.com/journal" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://driftibo.com/journal/${article.slug}` },
    ],
  };

  return (
    <main
      style={{
        padding: "96px 22px 72px",
        maxWidth: 820,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article>
        <Link
          href="/journal"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 16 }}
        >
          ← the journal
        </Link>

        <p className="kicker">
          {article.kind} · {article.read}
        </p>

        <h1
          className="display-xl"
          style={{
            maxWidth: "20ch",
            margin: "6px 0 8px",
          }}
        >
          {article.title}
        </h1>

        <p className="lede">
          {article.dek}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "18px 0",
          }}
        >
          <span className="seal t-paper" style={{ width: 32 }}>
            <span className="ring"></span>
            <span className="star"></span>
          </span>
          <div>
            <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: "0.82rem" }}>
              By the Driftibo desk
            </p>
            <p style={{ color: "var(--pk-muted)", fontSize: "0.76rem" }}>
              {displayDate ? `${displayDate} · ` : ""}faceless on purpose
            </p>
          </div>
        </div>

        <div
          className={`well ${article.scene}`}
          style={{
            aspectRatio: "16/9",
            borderRadius: "var(--r-lg)",
            margin: "18px 0 24px",
            ...(article.heroImageUrl
              ? { backgroundImage: `url(${article.heroImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}),
          }}
          data-label={article.photo}
        ></div>

        <div style={{ display: "grid", gap: 16, maxWidth: "64ch" }}>
          {article.body.map((block, i) => {
            if (block.type === "p") {
              return (
                <p key={i} style={{ color: "var(--pk-text)", fontSize: "1.02rem" }}>
                  {block.text}
                </p>
              );
            }
            if (block.type === "h") {
              return (
                <p key={i} className="display" style={{ fontSize: "1.4rem", marginTop: 8 }}>
                  {block.text}
                </p>
              );
            }
            if (block.type === "q") {
              return (
                <p
                  key={i}
                  className="poetry"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--pk-accent-deep)",
                    margin: "6px 0",
                  }}
                >
                  {block.text}
                </p>
              );
            }
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid var(--pk-line-soft)",
          }}
        >
          <Link href="/game" className="btn btn-accent">
            Let the star send me ✦
          </Link>
          <Link href="/dream" className="btn btn-ghost">
            Dream My Trip instead
          </Link>
        </div>
      </article>
    </main>
  );
}
