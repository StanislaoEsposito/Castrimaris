import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L'Autore — Castrimaris",
  description:
    "Biografia di Salvatore, studioso dei protocolli notarili del XVI secolo dell'Archivio di Stato di Napoli e delle fonti storiche di Castellammare di Stabia.",
};

/* ─────────────────────────────────────────────────────────────────────────
   PAGINA AUTORE — Server Component
   ───────────────────────────────────────────────────────────────────────── */
export default function AutorePage() {
  return (
    <>
      {/* ── Intestazione ── */}
      <div style={{
        borderBottom: "1px solid var(--color-border)",
        padding: "2.5rem 1.25rem 2rem",
        textAlign: "center",
        backgroundColor: "rgba(114,47,55,0.03)",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "var(--color-burgundy)", margin: "0 0 0.5rem",
        }}>
          Il Progetto
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 600, color: "var(--color-ink)",
          letterSpacing: "-0.01em", margin: "0 0 0.75rem",
        }}>
          L&apos;Autore
        </h1>
        <div aria-hidden="true" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.75rem", marginTop: "1rem",
        }}>
          <span style={{ flex: 1, maxWidth: "4rem", height: 1, backgroundColor: "var(--color-border)" }} />
          <span style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>✦</span>
          <span style={{ flex: 1, maxWidth: "4rem", height: 1, backgroundColor: "var(--color-border)" }} />
        </div>
      </div>

      {/* ── Corpo ── */}
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.25rem 5rem" }}>

        {/* Nome e titolo */}
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--color-muted)", margin: "0 0 0.35rem",
        }}>
          Ricercatore &amp; Autore
        </p>
        <h2 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 600, color: "var(--color-ink)",
          margin: "0 0 2rem", letterSpacing: "-0.01em",
        }}>
          Salvatore
        </h2>

        {/* ── Biografia ── */}
        <section style={{ marginBottom: "3rem" }}>

          <p style={paraStyle}>
            Salvatore è uno studioso appassionato di storia locale e di fonti archivistiche del
            Cinquecento, con una specializzazione nei protocolli notarili conservati presso
            l&apos;Archivio di Stato di Napoli. Da anni dedica la sua ricerca alla ricostruzione
            della vita civile, economica e sociale di Castellammare di Stabia attraverso la lettura
            diretta degli atti notarili prodotti nel corso del XVI secolo, un periodo di straordinaria
            vitalità per il territorio campano.
          </p>

          <p style={paraStyle}>
            Il suo lavoro si distingue per il rigore filologico con cui affronta le fonti: ogni
            documento viene trascritto nella sua forma originale latina, quindi tradotto in italiano
            moderno con l&apos;attenzione necessaria a preservare il lessico tecnico-giuridico
            dell&apos;epoca. Questa doppia lettura — testuale e storica — consente di restituire al
            lettore contemporaneo non soltanto il contenuto degli atti, ma l&apos;intera atmosfera
            di una società che si esprimeva attraverso le forme solenni del diritto notarile.
          </p>

          <p style={paraStyle}>
            Frutto di anni di ricerche sul campo tra le sale dell&apos;Archivio di Stato di Napoli,
            il progetto <em>Castrimaris</em> nasce dalla convinzione che le fonti storiche del
            &apos;500 rappresentino un patrimonio ancora in larga parte inesplorato, capace di
            gettare nuova luce sulla storia di Castellammare di Stabia e del suo territorio.
            A queste ricerche Salvatore ha dedicato anche un volume pubblicato, che raccoglie
            e commenta una selezione significativa di atti notarili inediti, offrendo agli studiosi
            e agli appassionati di storia locale uno strumento di consultazione agile e scientificamente
            fondato.
          </p>
        </section>

        {/* ── Divisore ── */}
        <div aria-hidden="true" style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          margin: "0 0 2.5rem",
        }}>
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--color-muted)", whiteSpace: "nowrap",
          }}>
            Contatti
          </span>
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
        </div>

        {/* ── Sezione contatti ── */}
        <section style={{
          backgroundColor: "rgba(114,47,55,0.03)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "1.5rem 1.75rem",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: "1rem", color: "var(--color-ink-light)",
            lineHeight: 1.7, margin: "0 0 1.25rem",
          }}>
            Per segnalazioni, collaborazioni o richieste di informazioni
            sulle fonti archivistiche:
          </p>
          <a
            href="mailto:info@castrimaris.it"
            className="mail-link"
            style={{
              fontFamily: "var(--font-sans)", fontSize: "0.9rem", fontWeight: 600,
              letterSpacing: "0.04em", color: "var(--color-burgundy)",
              border: "1.5px solid var(--color-burgundy)",
              borderRadius: "8px", padding: "0.65rem 1.5rem",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            info@castrimaris.it
          </a>
        </section>
      </main>

      <style>{`
        .mail-link:hover {
          background-color: var(--color-burgundy) !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
}

const paraStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.05rem",
  lineHeight: 1.9,
  color: "var(--color-ink)",
  marginBottom: "1.5rem",
};
