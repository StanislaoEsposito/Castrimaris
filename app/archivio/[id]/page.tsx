import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   METADATA DINAMICA
   ───────────────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("translations")
    .select("title, authors(name)")
    .eq("id", id)
    .single();

  if (!data) return { title: "Documento non trovato — Castrimaris" };

  const author = Array.isArray(data.authors)
    ? data.authors[0]?.name
    : (data.authors as { name: string } | null)?.name;

  return {
    title: `${data.title} — Castrimaris`,
    description: author ? `Atto notarile di ${author}. Testo originale latino e traduzione italiana.` : undefined,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   PAGINA SINGOLO ARTICOLO — Server Component
   ───────────────────────────────────────────────────────────────────────── */
export default async function ArticolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: translation } = await supabase
    .from("translations")
    .select("*, authors(name)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!translation) notFound();

  const authorName = Array.isArray(translation.authors)
    ? (translation.authors[0]?.name ?? "")
    : ((translation.authors as { name: string } | null)?.name ?? "");

  const publishDate = new Date(translation.created_at).toLocaleDateString("it-IT", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <>
      {/* ── Articolo ── */}
      <article className="article-body">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.75rem",
            color: "var(--color-muted)", display: "flex",
            alignItems: "center", gap: "0.35rem", margin: 0,
          }}>
            <Link href="/" style={{ color: "var(--color-muted)", textDecoration: "none" }}
              className="bc-link">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/archivio" style={{ color: "var(--color-muted)", textDecoration: "none" }}
              className="bc-link">Archivio</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "var(--color-ink-light)" }}>{translation.title}</span>
          </p>
        </nav>

        {/* ── Intestazione documento ── */}
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          {/* Etichetta */}
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--color-burgundy)", margin: "0 0 1rem",
          }}>
            Protocollo Notarile · Archivio di Stato di Napoli
          </p>

          {/* Titolo */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
            fontWeight: 600, color: "var(--color-ink)",
            lineHeight: 1.25, letterSpacing: "-0.01em",
            margin: "0 0 1.25rem",
          }}>
            {translation.title}
          </h1>

          {/* Meta: autore + data */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "1rem", flexWrap: "wrap",
            fontFamily: "var(--font-sans)", fontSize: "0.8rem",
            color: "var(--color-muted)",
          }}>
            {authorName && (
              <Link href={`/archivio?notaio=${(translation as { author_id: string }).author_id}`}
                style={{ color: "var(--color-ink-light)", textDecoration: "none", fontWeight: 500 }}
                className="author-link">
                {authorName}
              </Link>
            )}
            <span aria-hidden="true" style={{ color: "var(--color-border)" }}>·</span>
            <time dateTime={translation.created_at}>{publishDate}</time>
          </div>

          {/* Divisore ornamentale */}
          <div aria-hidden="true" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.75rem", marginTop: "2rem",
          }}>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            <span style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>✦</span>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          </div>
        </header>

        {/* ── Testo Latino ── */}
        {translation.latin_text && (
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--color-muted)", marginBottom: "1.25rem",
              paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)",
            }}>
              Testo Latino Originale
            </h2>
            <div
              className="prose-latin"
              dangerouslySetInnerHTML={{ __html: translation.latin_text }}
            />
          </section>
        )}

        {/* ── Traduzione Italiana ── */}
        {translation.italian_translation && (
          <section style={{ marginBottom: "3rem" }}>
            {/* Separatore tra i due testi */}
            <div aria-hidden="true" style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "2rem",
            }}>
              <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-muted)",
                whiteSpace: "nowrap",
              }}>
                Traduzione
              </span>
              <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            </div>

            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--color-muted)", marginBottom: "1.25rem",
              paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)",
            }}>
              Traduzione Italiana
            </h2>
            <div
              className="prose-latin"
              dangerouslySetInnerHTML={{ __html: translation.italian_translation }}
            />
          </section>
        )}

        {/* ── Navigazione inferiore ── */}
        <footer style={{
          marginTop: "4rem", paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "0.75rem",
        }}>
          <Link href="/archivio" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.83rem",
            color: "var(--color-ink-light)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
          }} className="bc-link">
            ← Torna all&apos;Archivio
          </Link>

          {authorName && (
            <Link
              href={`/archivio?notaio=${(translation as { author_id: string }).author_id}`}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "0.83rem",
                color: "var(--color-burgundy)", textDecoration: "none",
                border: "1px solid var(--color-burgundy)",
                borderRadius: "var(--radius-md)", padding: "0.4rem 0.9rem",
                transition: "all 0.2s ease",
              }} className="read-link"
            >
              Altri atti di {authorName} →
            </Link>
          )}
        </footer>
      </article>

      <style>{`
        .bc-link:hover   { color: var(--color-burgundy) !important; }
        .author-link:hover { color: var(--color-burgundy) !important; }
      `}</style>
    </>
  );
}
