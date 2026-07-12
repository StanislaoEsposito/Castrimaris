import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Archivio — Castrimaris",
  description:
    "Archivio dei protocolli notarili del XVI secolo di Castellammare di Stabia, per notaio.",
};

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
type Author = {
  id: string;
  name: string;
  notary_symbol_url: string | null;
};

type Translation = {
  id: string;
  title: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   ICONA PIUMA — fallback se notary_symbol_url è null
   ───────────────────────────────────────────────────────────────────────── */
function FeatherIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"/>
      <line x1="16" y1="8" x2="2" y2="22"/>
      <line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ARCHIVIO PAGE — Server Component
   Accetta searchParams.notaio per filtrare le traduzioni di un autore
   ───────────────────────────────────────────────────────────────────────── */
export default async function ArchivioPage({
  searchParams,
}: {
  searchParams: Promise<{ notaio?: string }>;
}) {
  const { notaio: selectedAuthorId } = await searchParams;
  const supabase = await createClient();

  /* Query autori con almeno una traduzione pubblicata */
  const { data: authorsRaw } = await supabase
    .from("authors")
    .select("id, name, notary_symbol_url, translations!inner(id)")
    .eq("translations.is_published", true)
    .order("name");

  // Formattiamo per aderire al tipo Author
  const authors: Author[] = (authorsRaw ?? []).map((a: any) => ({
    id: a.id,
    name: a.name,
    notary_symbol_url: a.notary_symbol_url,
  }));

  /* Query traduzioni (filtrate per autore se selezionato) */
  let translations: Translation[] = [];
  let selectedAuthor: Author | undefined;

  if (selectedAuthorId) {
    selectedAuthor = authors.find((a) => a.id === selectedAuthorId);

    const { data: tRaw } = await supabase
      .from("translations")
      .select("id, title, created_at")
      .eq("author_id", selectedAuthorId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    translations = tRaw ?? [];
  }

  return (
    <>
      {/* ── Intestazione pagina ── */}
      <div style={{
        borderBottom: "1px solid var(--color-border)",
        padding: "2.5rem 1.5rem 2rem",
        textAlign: "center",
        backgroundColor: "rgba(114,47,55,0.03)",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "var(--color-burgundy)", margin: "0 0 0.5rem",
        }}>
          Archivio di Stato di Napoli
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 600, color: "var(--color-ink)",
          letterSpacing: "-0.01em", margin: "0 0 0.75rem",
        }}>
          Protocolli Notarili del &apos;500
        </h1>
        <p style={{
          fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: "0.95rem", color: "var(--color-muted)",
          maxWidth: "52ch", margin: "0 auto",
        }}>
          Seleziona il segno di tabellionato di un notaio per consultare i suoi atti.
        </p>
      </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto" }} className="pub-section">

        {/* ── Griglia notai ── */}
        <section aria-label="Notai">
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--color-muted)", marginBottom: "1.5rem",
          }}>
            Notai &amp; Autori
          </h2>

          {authors.length === 0 ? (
            <p style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              color: "var(--color-muted)", textAlign: "center", padding: "2rem 0",
            }}>
              Nessun autore ancora presente in archivio.
            </p>
          ) : (
            <div className="notary-grid">
              {authors.map((author) => {
                const isSelected = author.id === selectedAuthorId;
                return (
                  <Link
                    key={author.id}
                    href={isSelected ? "/archivio" : `/archivio?notaio=${author.id}`}
                    title={author.name}
                    style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "0.6rem",
                      padding: "1.25rem 0.75rem",
                      border: isSelected
                        ? "2px solid var(--color-burgundy)"
                        : "1px solid var(--color-border)",
                      borderRadius: "10px",
                      backgroundColor: isSelected
                        ? "rgba(114,47,55,0.05)"
                        : "var(--color-papyrus)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      color: isSelected ? "var(--color-burgundy)" : "var(--color-ink-light)",
                    }}
                    className="notary-card"
                  >
                    {/* Simbolo notarile o piuma */}
                    <div style={{
                      width: "3.5rem", height: "3.5rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isSelected ? "var(--color-burgundy)" : "var(--color-muted)",
                    }}>
                      {author.notary_symbol_url ? (
                        <Image
                          src={author.notary_symbol_url}
                          alt={`Segno di tabellionato — ${author.name}`}
                          width={56} height={56}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <FeatherIcon size={42} />
                      )}
                    </div>

                    {/* Nome autore */}
                    <span style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.85rem",
                      fontWeight: isSelected ? 600 : 400,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}>
                      {author.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Lista traduzioni dell'autore selezionato ── */}
        {selectedAuthor && (
          <section style={{ marginTop: "3rem" }}>
            {/* Intestazione sezione */}
            <div style={{
              display: "flex", alignItems: "baseline",
              justifyContent: "space-between", flexWrap: "wrap",
              gap: "0.5rem",
              borderBottom: "2px solid var(--color-burgundy)",
              paddingBottom: "0.75rem", marginBottom: "1.5rem",
            }}>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontSize: "1.5rem",
                fontWeight: 600, color: "var(--color-ink)", margin: 0,
              }}>
                Atti di {selectedAuthor.name}
              </h2>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "0.75rem",
                color: "var(--color-muted)", fontStyle: "italic",
              }}>
                {translations.length} {translations.length === 1 ? "documento" : "documenti"}
              </span>
            </div>

            {translations.length === 0 ? (
              <p style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                color: "var(--color-muted)", padding: "1.5rem 0",
              }}>
                Nessun atto pubblicato per questo notaio.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {translations.map((t) => (
                  <article
                    key={t.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      padding: "1.25rem 0",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: "1rem",
                    }}
                    className="doc-row"
                  >
                    <div>
                      <p style={{
                        fontFamily: "var(--font-sans)", fontSize: "0.7rem",
                        color: "var(--color-muted)", letterSpacing: "0.08em",
                        margin: "0 0 0.25rem",
                      }}>
                        {formatDate(t.created_at)}
                      </p>
                      <h3 style={{
                        fontFamily: "var(--font-serif)", fontSize: "1.1rem",
                        fontWeight: 500, color: "var(--color-ink)", margin: 0,
                      }}>
                        {t.title}
                      </h3>
                    </div>
                    <Link href={`/archivio/${t.id}`} style={{
                      fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                      fontWeight: 600, color: "var(--color-burgundy)",
                      border: "1px solid var(--color-burgundy)",
                      borderRadius: "var(--radius-md)", padding: "0.4rem 0.9rem",
                      textDecoration: "none", whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                    }} className="read-link">
                      Leggi →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        .notary-card:hover {
          border-color: var(--color-burgundy) !important;
          background-color: rgba(114,47,55,0.04) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(114,47,55,0.1);
        }
        .doc-row:hover { background-color: rgba(114,47,55,0.02) !important; }
        .read-link:hover {
          background-color: var(--color-burgundy) !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
}
