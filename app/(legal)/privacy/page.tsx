import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Castrimaris",
  description: "Informativa sul trattamento dei dati personali del progetto Castrimaris.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
          Benvenuti su <strong>Castrimaris</strong>. La presente informativa sulla privacy ha lo scopo di
          descrivere le modalità di gestione di questo sito web, in riferimento al trattamento dei dati
          personali degli utenti che lo consultano.
        </p>

        <h2>1. Titolare del Trattamento</h2>
        <p>
          A seguito della consultazione di questo sito possono essere trattati dati relativi a
          persone identificate o identificabili. Il Titolare del loro trattamento è il progetto di
          ricerca accademica <em>Castrimaris</em>. Potete contattarci per qualsiasi esigenza legata
          alla privacy scrivendo a: <strong>info@castrimaris.it</strong>.
        </p>

        <h2>2. Tipologie di Dati Raccolti</h2>
        <p>
          Durante la normale navigazione, il nostro sito può raccogliere le seguenti categorie di dati:
        </p>
        <ul>
          <li>
            <strong>Dati di navigazione:</strong> I sistemi informatici preposti al funzionamento
            del sito acquisiscono, nel corso del loro normale esercizio, alcuni dati la cui
            trasmissione è implicita nell&apos;uso dei protocolli di comunicazione di Internet
            (es. indirizzi IP, orari di visita, tipo di browser).
          </li>
          <li>
            <strong>Dati forniti volontariamente dall&apos;utente:</strong> L&apos;invio facoltativo,
            esplicito e volontario di posta elettronica agli indirizzi indicati su questo sito
            comporta la successiva acquisizione dell&apos;indirizzo del mittente.
          </li>
        </ul>

        <h2>3. Finalità del Trattamento</h2>
        <p>
          I dati personali forniti sono utilizzati al solo fine di permettere la corretta
          navigazione del sito web, per la manutenzione tecnica, e per ricavare informazioni
          statistiche anonime sull&apos;uso della piattaforma.
        </p>

        <h2>4. Modalità del Trattamento</h2>
        <p>
          Il trattamento viene effettuato mediante strumenti informatici e telematici, con logiche
          strettamente correlate alle finalità indicate e, comunque, in modo da garantire la
          sicurezza e la riservatezza dei dati stessi. I dati non saranno comunicati o diffusi a terzi.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "3rem 0" }} />
        
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}>
          Ultimo aggiornamento: Luglio 2026
        </p>
      </div>
    </article>
  );
}
