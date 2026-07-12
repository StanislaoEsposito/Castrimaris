import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Castrimaris",
  description: "Informativa sull'utilizzo dei cookie nel sito Castrimaris.",
};

export default function CookiePolicyPage() {
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
          Cookie Policy
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
          In conformità alla normativa vigente, <strong>Castrimaris</strong> fornisce all&apos;utente 
          le seguenti informazioni relative all&apos;utilizzo dei cookie all&apos;interno del sito web.
        </p>

        <h2>1. Cosa sono i Cookie?</h2>
        <p>
          I cookie sono stringhe di testo di piccole dimensioni che i siti visitati dall&apos;utente 
          inviano al suo terminale (solitamente al browser), dove vengono memorizzati per essere 
          poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.
        </p>

        <h2>2. Quali Cookie utilizziamo</h2>
        <p>
          Questo sito utilizza <strong>esclusivamente cookie tecnici</strong>, ovvero quelli 
          utilizzati al solo fine di &quot;effettuare la trasmissione di una comunicazione su 
          una rete di comunicazione elettronica, o nella misura strettamente necessaria al 
          fornitore di un servizio della società dell&apos;informazione esplicitamente richiesto 
          dall&apos;abbonato o dall&apos;utente a erogare tale servizio&quot;.
        </p>
        <ul>
          <li>
            <strong>Cookie di navigazione o di sessione:</strong> Garantiscono la normale 
            navigazione e fruizione del sito web (ad esempio, consentendo di autenticarsi per accedere all&apos;area amministrativa).
          </li>
          <li>
            <strong>Cookie analitici anonimizzati:</strong> Utilizzati per raccogliere 
            informazioni, in forma aggregata, sul numero degli utenti e su come questi 
            visitano il sito stesso.
          </li>
        </ul>

        <h2>3. Cookie di Profilazione e Terze Parti</h2>
        <p>
          <strong>Castrimaris NON utilizza cookie di profilazione</strong> propri per inviare 
          messaggi pubblicitari in linea con le preferenze manifestate dall&apos;utente 
          nell&apos;ambito della navigazione in rete.
        </p>

        <h2>4. Gestione delle preferenze tramite Browser</h2>
        <p>
          L&apos;utente può gestire le preferenze relative ai Cookie direttamente all&apos;interno 
          del proprio browser ed impedire che terze parti possano installarne. Tramite le 
          preferenze del browser è inoltre possibile eliminare i Cookie installati in passato.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "3rem 0" }} />
        
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>
          Ultimo aggiornamento: Luglio 2026
        </p>
      </div>
    </article>
  );
}
