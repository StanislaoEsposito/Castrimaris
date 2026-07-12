import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note Legali — Castrimaris",
  description: "Termini e condizioni, e note legali relative all'utilizzo del sito Castrimaris.",
};

export default function NoteLegaliPage() {
  return (
    <article className="article-body">
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "var(--color-burgundy)", margin: "0 0 1rem",
        }}>
          Informazioni Legali
        </p>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 600, color: "var(--color-ink)",
          letterSpacing: "-0.01em", margin: "0 0 1.25rem",
        }}>
          Note Legali
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
          Il presente documento contiene i termini e le condizioni legali per l&apos;accesso e 
          l&apos;utilizzo del sito web <strong>Castrimaris</strong>. Accedendo al sito, 
          l&apos;utente accetta di rispettare le condizioni qui riportate.
        </p>

        <h2>1. Proprietà Intellettuale</h2>
        <p>
          Tutti i contenuti presenti sul sito (testi, traduzioni, trascrizioni, immagini, 
          loghi e segni di tabellionato) sono da considerarsi proprietà intellettuale 
          del progetto Castrimaris e degli archivi di riferimento (laddove specificato), 
          protetti dalle leggi sul diritto d&apos;autore e sulla proprietà intellettuale.
        </p>
        <p>
          È severamente vietata la riproduzione, la distribuzione, la pubblicazione e 
          qualsiasi altro utilizzo dei contenuti del sito per scopi commerciali senza il 
          preventivo consenso scritto degli autori.
        </p>

        <h2>2. Limitazione di Responsabilità</h2>
        <p>
          Le traduzioni e le trascrizioni dei manoscritti notarili del &apos;500 sono frutto 
          di una minuziosa ricerca accademica, tuttavia il progetto Castrimaris non può 
          garantire l&apos;assoluta assenza di errori, inesattezze o omissioni. I testi sono 
          forniti &quot;così come sono&quot; a scopo puramente informativo e di studio.
        </p>
        <p>
          In nessun caso i responsabili del sito potranno essere ritenuti responsabili 
          per eventuali danni diretti o indiretti causati dall&apos;utilizzo delle informazioni 
          presenti su questo portale.
        </p>

        <h2>3. Link Esterni</h2>
        <p>
          Il sito potrebbe contenere link verso siti web gestiti da terzi. Tali collegamenti 
          sono forniti esclusivamente per comodità dell&apos;utente. Il progetto Castrimaris 
          non ha alcun controllo sui contenuti di tali siti e declina ogni responsabilità 
          in merito alla loro accuratezza o sicurezza.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "3rem 0" }} />
        
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>
          Ultimo aggiornamento: Luglio 2026
        </p>
      </div>
    </article>
  );
}
