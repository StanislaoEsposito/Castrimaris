import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ZoomableContent from "@/components/ZoomableContent";

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
    description: author
      ? `Atto notarile di ${author}. Testo originale latino e traduzione italiana.`
      : undefined,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
type ImagePosition = "top" | "left" | "right";

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENTE IMMAGINE DOCUMENTO
   ───────────────────────────────────────────────────────────────────────── */
function DocumentImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure style={{ margin: 0 }}>
      <Image
        src={src}
        alt={alt}
        width={560}
        height={420}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "6px",
          boxShadow: "0 2px 16px rgba(51,33,33,0.14)",
          display: "block",
        }}
        priority
      />
    </figure>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BLOCCO TESTI (latino + italiano impilati)
   ───────────────────────────────────────────────────────────────────────── */
function TextBlock({
  latinText,
  italianTranslation,
}: {
  latinText: string | null;
  italianTranslation: string | null;
}) {
  return (
    <div>
      {/* Testo Latino */}
      {latinText && (
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={sectionLabelStyle}>Testo Latino Originale</h2>
          <ZoomableContent
            className="prose-latin"
            html={latinText}
          />
        </section>
      )}

      {/* Traduzione Italiana */}
      {italianTranslation && (
        <section style={{ marginBottom: "3rem" }}>
          <div aria-hidden="true" style={{
            display: "flex", alignItems: "center",
            gap: "0.75rem", marginBottom: "2rem",
          }}>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--color-muted)", whiteSpace: "nowrap",
            }}>
              Traduzione
            </span>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          </div>
          <h2 style={sectionLabelStyle}>Traduzione Italiana</h2>
          <ZoomableContent
            className="prose-latin"
            html={italianTranslation}
          />
        </section>
      )}
    </div>
  );
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

  const imageUrl      = (translation as { image_url?: string }).image_url ?? null;
  const imagePosition = ((translation as { image_position?: string }).image_position ?? "top") as ImagePosition;

  return (
    <>
      <article className="article-body">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.75rem",
            color: "var(--color-muted)", display: "flex",
            alignItems: "center", gap: "0.35rem", margin: 0,
          }}>
            <Link href="/" style={{ color: "var(--color-muted)", textDecoration: "none" }} className="bc-link">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/archivio" style={{ color: "var(--color-muted)", textDecoration: "none" }} className="bc-link">Archivio</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "var(--color-ink-light)" }}>{translation.title}</span>
          </p>
        </nav>

        {/* ── Intestazione ── */}
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--color-burgundy)", margin: "0 0 1rem",
          }}>
            Protocollo Notarile · Archivio di Stato di Napoli
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
            fontWeight: 600, color: "var(--color-ink)",
            lineHeight: 1.25, letterSpacing: "-0.01em",
            margin: "0 0 1.25rem",
          }}>
            {translation.title}
          </h1>
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
          <div aria-hidden="true" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.75rem", marginTop: "2rem",
          }}>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            <span style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>✦</span>
            <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────────
            LAYOUT DINAMICO — 3 varianti basate su image_position
            ───────────────────────────────────────────────────────────────── */}

        {/* Variante: NESSUNA IMMAGINE — solo testo */}
        {!imageUrl && (
          <TextBlock
            latinText={translation.latin_text}
            italianTranslation={translation.italian_translation}
          />
        )}

        {/* Variante: IMMAGINE SOPRA */}
        {imageUrl && imagePosition === "top" && (
          <div>
            <div style={{ marginBottom: "2.5rem", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
              <DocumentImage src={imageUrl} alt={`Documento: ${translation.title}`} />
            </div>
            <TextBlock
              latinText={translation.latin_text}
              italianTranslation={translation.italian_translation}
            />
          </div>
        )}

        {/* Variante: IMMAGINE A SINISTRA */}
        {imageUrl && imagePosition === "left" && (
          <div className="doc-layout-left">
            <div className="doc-image-col">
              <DocumentImage src={imageUrl} alt={`Documento: ${translation.title}`} />
            </div>
            <div className="doc-text-col">
              <TextBlock
                latinText={translation.latin_text}
                italianTranslation={translation.italian_translation}
              />
            </div>
          </div>
        )}

        {/* Variante: IMMAGINE A DESTRA */}
        {imageUrl && imagePosition === "right" && (
          <div className="doc-layout-right">
            <div className="doc-text-col">
              <TextBlock
                latinText={translation.latin_text}
                italianTranslation={translation.italian_translation}
              />
            </div>
            <div className="doc-image-col">
              <DocumentImage src={imageUrl} alt={`Documento: ${translation.title}`} />
            </div>
          </div>
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
        /* Layout a due colonne (sinistra o destra) */
        .doc-layout-left,
        .doc-layout-right {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .doc-layout-right {
          grid-template-columns: 1fr 380px;
        }
        /* Immagine: sticky per restare visibile durante lo scroll del testo lungo */
        .doc-image-col {
          position: sticky;
          top: 6rem; /* Aumentato per non collidere con la navbar fissa */
        }
        /* Mobile: sempre colonna singola, immagine sopra */
        @media (max-width: 768px) {
          .doc-layout-left,
          .doc-layout-right {
            grid-template-columns: 1fr !important;
          }
          .doc-image-col {
            position: static;
            order: -1;
          }
        }
        .bc-link:hover    { color: var(--color-burgundy) !important; }
        .author-link:hover { color: var(--color-burgundy) !important; }
      `}</style>
    </>
  );
}

/* ── Stile etichetta sezione ── */
const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "var(--color-muted)", marginBottom: "1.25rem",
  paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)",
};
