import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibilità — Castrimaris",
  description: "Dichiarazione di accessibilità per il progetto Castrimaris.",
};

export default function AccessibilitaPage() {
  return (
    <article className="article-body">
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "var(--color-burgundy)", margin: "0 0 1rem",
        }}>
          Impegno sociale
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 600, color: "var(--color-ink)",
          letterSpacing: "-0.01em", margin: "0 0 1.25rem",
        }}>
          Dichiarazione di Accessibilità
        </h1>
        <div aria-hidden="true" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "0.75rem", marginTop: "2rem",
        }}>
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          <span style={{ color: "var(--color-gold)", fontSize: "0.75rem" }}>✦</span>
          <span style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
        </div>
      </header>

      <div className="prose-latin">
        <p>
          Il progetto <strong>Castrimaris</strong> si impegna a rendere il proprio sito web 
          accessibile a tutti, conformemente alle linee guida sull&apos;accessibilità dei contenuti 
          web (WCAG 2.1), per garantire che la ricerca storica e accademica sia fruibile senza 
          alcuna barriera.
        </p>

        <h2>1. Struttura e Navigazione</h2>
        <p>
          Abbiamo progettato l&apos;interfaccia seguendo i principi di chiarezza e semplicità:
        </p>
        <ul>
          <li><strong>Semantica HTML:</strong> Il sito utilizza tag HTML semantici per facilitare l&apos;interpretazione da parte degli screen reader.</li>
          <li><strong>Contrasto del testo:</strong> I colori scelti per la tipografia rispettano un elevato rapporto di contrasto con gli sfondi.</li>
          <li><strong>Navigazione da tastiera:</strong> È possibile scorrere e interagire con i menu principali e l&apos;archivio utilizzando esclusivamente la tastiera.</li>
        </ul>

        <h2>2. Lettura dei Manoscritti</h2>
        <p>
          Consapevoli che le immagini dei protocolli notarili del &apos;500 non sono leggibili 
          dagli screen reader standard a causa della grafia antica, forniamo per ciascun 
          manoscritto la trascrizione fedele in latino e la relativa traduzione in italiano, 
          renderizzate come puro testo formattato.
        </p>

        <h2>3. Feedback e Recapiti</h2>
        <p>
          Nonostante i nostri sforzi per rendere tutte le pagine e i contenuti pienamente 
          accessibili, potresti riscontrare difficoltà in alcune sezioni del sito. Se incontri 
          problemi di accessibilità o vuoi fornirci suggerimenti per migliorare la tua 
          esperienza, ti invitiamo a scriverci all&apos;indirizzo email: 
          <strong> info@castrimaris.it</strong>.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "3rem 0" }} />
        
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>
          Ultimo aggiornamento: Luglio 2026
        </p>
      </div>
    </article>
  );
}
