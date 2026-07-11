import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Castrimaris — Fonti storiche del '500",
  description:
    "Fonti storiche del '500 e protocolli notarili dell'Archivio di Stato di Napoli relativi a Castellammare di Stabia.",
};

/* ─────────────────────────────────────────────────────────────────────────
   TIPO TRADUZIONE
   ───────────────────────────────────────────────────────────────────────── */
type LatestTranslation = {
  id: string;
  title: string;
  created_at: string;
  authors: { name: string } | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   HOME PAGE — Server Component
   ───────────────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const supabase = await createClient();

  const { data: latestRaw } = await supabase
    .from("translations")
    .select("id, title, created_at, authors(name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  const latest: LatestTranslation[] = (latestRaw ?? []).map((t) => ({
    ...t,
    authors: Array.isArray(t.authors) ? t.authors[0] ?? null : t.authors,
  }));

  return (
    <>
      {/* ═══ HERO — dipinto + titolo sovrapposto ═════════════════════════ */}
      <header className="hero-container">
        {/* Dipinto di sfondo */}
        <Image
          src="/images/porto-salvo.webp"
          alt="Porto Salvo — veduta storica di Castellammare di Stabia"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />

        {/* Velo scuro per leggibilità del testo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(15,10,5,0.38) 0%, rgba(15,10,5,0.62) 100%)",
          }}
        />

        {/* Testo centrato */}
        <div style={{ position: "relative", textAlign: "center", padding: "0 1.5rem" }}>
          {/* Sopratitolo */}
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(201,168,76,0.9)",
            marginBottom: "0.75rem",
          }}>
            Archivio di Stato di Napoli · XVI Secolo
          </p>

          {/* Titolo principale a caratteri cubitali */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 600,
            color: "#f5ede0",
            letterSpacing: "0.06em",
            lineHeight: 1,
            marginBottom: "1rem",
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}>
            Castrimaris
          </h1>

          {/* Divisore ornamentale */}
          <div aria-hidden="true" style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "0.75rem",
            marginBottom: "1rem",
          }}>
            <span style={{ flex: 1, maxWidth: "6rem", height: 1, backgroundColor: "rgba(201,168,76,0.5)" }} />
            <span style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.75rem" }}>✦</span>
            <span style={{ flex: 1, maxWidth: "6rem", height: 1, backgroundColor: "rgba(201,168,76,0.5)" }} />
          </div>

          {/* Sottotitolo */}
          <p style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 2vw, 1.15rem)",
            color: "rgba(245,237,224,0.85)",
            letterSpacing: "0.02em",
          }}>
            Castellammare di Stabia
          </p>
        </div>
      </header>

      {/* ═══ INTRO ═══════════════════════════════════════════════════════ */}
      <section className="pub-section" style={{
        textAlign: "center",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
          color: "var(--color-ink)",
          lineHeight: 1.7,
          maxWidth: "58ch",
          margin: "0 auto 1.5rem",
          fontStyle: "italic",
        }}>
          Fonti storiche del &apos;500 e protocolli notarili dell&apos;Archivio di Stato di Napoli.
        </p>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          color: "var(--color-muted)",
          maxWidth: "62ch",
          margin: "0 auto",
          lineHeight: 1.75,
        }}>
          Un archivio di trascrizioni e traduzioni di atti notarili del XVI secolo riguardanti
          Castellammare di Stabia, tratti dai protocolli conservati presso l&apos;Archivio di Stato di Napoli.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
          <Link href="/archivio" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.85rem", fontWeight: 700,
            letterSpacing: "0.05em", textTransform: "uppercase",
            color: "#fff", backgroundColor: "var(--color-burgundy)",
            borderRadius: "var(--radius-md)", padding: "0.75rem 1.75rem",
            textDecoration: "none", transition: "background-color 0.2s ease",
          }} className="cta-primary">
            Esplora l&apos;Archivio →
          </Link>
          <Link href="/autore" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.85rem",
            letterSpacing: "0.04em",
            color: "var(--color-ink-light)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-md)", padding: "0.75rem 1.75rem",
            textDecoration: "none", transition: "border-color 0.2s ease",
          }} className="cta-secondary">
            L&apos;Autore
          </Link>
        </div>
      </section>

      {/* ═══ ULTIME PUBBLICAZIONI ════════════════════════════════════════ */}
      <section style={{ padding: "3rem 1.5rem 4rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "baseline",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "0.5rem", marginBottom: "2rem",
        }}>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 600,
            color: "var(--color-ink)", letterSpacing: "-0.01em", margin: 0,
          }}>
            Ultime Pubblicazioni
          </h2>
          <Link href="/archivio" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.8rem",
            color: "var(--color-burgundy)", textDecoration: "none",
            letterSpacing: "0.04em",
          }} className="see-all-link">
            Vedi tutto →
          </Link>
        </div>

        {latest.length === 0 ? (
          <p style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            color: "var(--color-muted)", textAlign: "center",
            padding: "3rem 0",
          }}>
            Nessuna traduzione pubblicata ancora.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {latest.map((t, i) => (
              <article
                key={t.id}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1.5rem 0",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                }}
                className="article-row"
              >
                <div>
                  {/* Numero ordine + autore */}
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "0.7rem",
                    fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--color-muted)",
                    margin: "0 0 0.35rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "1.3rem", height: "1.3rem", borderRadius: "50%",
                      backgroundColor: "var(--color-burgundy)", color: "#fff",
                      fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    {t.authors?.name ?? "Autore sconosciuto"}
                    <span style={{ color: "var(--color-border)" }}>·</span>
                    {formatDate(t.created_at)}
                  </p>

                  {/* Titolo */}
                  <h3 style={{
                    fontFamily: "var(--font-serif)", fontSize: "1.2rem",
                    fontWeight: 500, color: "var(--color-ink)",
                    margin: 0, lineHeight: 1.4,
                  }}>
                    {t.title}
                  </h3>
                </div>

                {/* Link */}
                <Link href={`/archivio/${t.id}`} style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                  fontWeight: 600, letterSpacing: "0.04em",
                  color: "var(--color-burgundy)",
                  border: "1px solid var(--color-burgundy)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.4rem 0.9rem",
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

      {/* ═══ CITAZIONE FINALE ════════════════════════════════════════════ */}
      <section style={{
        backgroundColor: "rgba(114,47,55,0.04)",
        borderTop: "1px solid var(--color-border)",
        textAlign: "center", padding: "3rem 1.5rem",
      }}>
        <blockquote style={{
          fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: "1.2rem", color: "var(--color-ink-light)",
          maxWidth: "44ch", margin: "0 auto",
          lineHeight: 1.75,
        }}>
          «Littera scripta manet.»
          <cite style={{
            display: "block", fontStyle: "normal",
            fontFamily: "var(--font-sans)", fontSize: "0.65rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "var(--color-muted)", marginTop: "0.75rem",
          }}>
            — Adagio medievale
          </cite>
        </blockquote>
      </section>

      <style>{`
        .cta-primary:hover  { background-color: var(--color-burgundy-dark) !important; }
        .cta-secondary:hover { border-color: var(--color-burgundy) !important; color: var(--color-burgundy) !important; }
        .see-all-link:hover  { text-decoration: underline !important; }
        .article-row:hover   { background-color: rgba(114,47,55,0.02) !important; }
        .read-link:hover     { background-color: var(--color-burgundy) !important; color: #fff !important; }
      `}</style>
    </>
  );
}
