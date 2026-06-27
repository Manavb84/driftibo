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
  return {
    title: `${article.title} · Driftibo`,
    description: article.dek,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <main
      style={{
        padding: "96px 22px 72px",
        maxWidth: 820,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <article>
        <Link
          href="/journal"
          style={{
            color: "var(--pk-muted)",
            fontFamily: "var(--ui)",
            fontWeight: 600,
            fontSize: "0.84rem",
            display: "inline-block",
            marginBottom: 16,
            textDecoration: "none",
          }}
        >
          ← the journal
        </Link>

        <p className="kicker">
          {article.kind} · {article.read}
        </p>

        <h1
          className="display"
          style={{
            fontSize: "clamp(2rem,5vw,3rem)",
            maxWidth: "20ch",
            margin: "6px 0 8px",
          }}
        >
          {article.title}
        </h1>

        <p className="eyebrow" style={{ fontSize: "1.15rem" }}>
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
              26 Jun 2026 · faceless on purpose
            </p>
          </div>
        </div>

        <div
          className={`well ${article.scene}`}
          style={{
            aspectRatio: "16/9",
            borderRadius: 18,
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
