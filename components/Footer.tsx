import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   FOOTER — compatto su mobile, tre colonne su desktop
   Struttura mobile: Brand centrato → griglia Navigazione + Contatti
   affiancati → bottom bar copyright + admin
   ───────────────────────────────────────────────────────────────────────── */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: "var(--color-papyrus-dark)",
        borderTop: "1px solid var(--color-border)",
        fontFamily: "var(--font-sans)",
        color: "var(--color-muted)",
      }}
    >
      {/* ── Barra decorativa superiore ── */}
      <div
        aria-hidden="true"
        style={{
          height: 2,
          background:
            "linear-gradient(to right, transparent, var(--color-border), var(--color-gold), var(--color-border), transparent)",
        }}
      />

      {/* ── Corpo principale ── */}
      <div className="footer-body">

        {/* ── Brand — centrato su mobile, sinistra su desktop ── */}
        <div className="footer-brand">
          <p style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            margin: "0 0 0.4rem",
            letterSpacing: "-0.01em",
          }}>
            Castrimaris
          </p>
          <p className="footer-brand-desc" style={{
            fontSize: "0.8rem",
            lineHeight: 1.6,
          }}>
            Un archivio di fonti storiche del &apos;500 e protocolli notarili
            dell&apos;Archivio di Stato di Napoli.
          </p>
        </div>

        {/* ── Griglia Navigazione + Contatti (affiancati su mobile) ── */}
        <div className="footer-cols">

          {/* Navigazione */}
          <div>
            <h3 style={colHeadStyle}>Navigazione</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {[
                { label: "Home",      href: "/" },
                { label: "Archivio", href: "/archivio" },
                { label: "L'Autore", href: "/autore" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-nav-link"
                    style={{ fontSize: "0.85rem", color: "var(--color-muted)", textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 style={colHeadStyle}>Contatti</h3>
            <p style={{ fontSize: "0.8rem", margin: "0 0 0.4rem", lineHeight: 1.5 }}>
              Per corrispondenza accademica:
            </p>
            <Link href="mailto:info@castrimaris.it" className="footer-email-link"
              style={{ fontSize: "0.85rem", color: "var(--color-burgundy)", textDecoration: "none", fontWeight: 500 }}>
              info@castrimaris.it
            </Link>
          </div>
        </div>
      </div>

      {/* ── Link Legali ── */}
      <div className="footer-legal">
        <div className="legal-links-wrapper" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.8rem", rowGap: "0.5rem" }}>
          <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
          <span className="legal-sep" aria-hidden="true">·</span>
          <Link href="/cookies" className="footer-legal-link">Cookie Policy</Link>
          <span className="legal-sep" aria-hidden="true">·</span>
          <Link href="/accessibilita" className="footer-legal-link">Accessibilità</Link>
          <span className="legal-sep" aria-hidden="true">·</span>
          <Link href="/note-legali" className="footer-legal-link">Note Legali</Link>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p className="footer-copyright" style={{ margin: 0 }}>
          © {currentYear}{" "}
          <span style={{ color: "var(--color-ink-light)", fontWeight: 500 }}>Castrimaris</span>
          . Tutti i diritti riservati.
        </p>

        <span aria-hidden="true" className="footer-ornament" style={{
          fontFamily: "var(--font-serif)", fontSize: "0.9rem",
          color: "var(--color-gold)", letterSpacing: "0.3em",
        }}>
          ❧
        </span>

        {/* Motto + link admin nella stessa riga finale */}
        <div className="footer-admin-row" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <em style={{ fontStyle: "italic", fontSize: "0.72rem" }}>«Littera scripta manet.»</em>
          <Link
            href="/admin"
            className="admin-link"
            title="Area amministrazione"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.65rem", color: "var(--color-border)",
              textDecoration: "none", letterSpacing: "0.05em",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Amministrazione
          </Link>
        </div>
      </div>

      <style>{`
        /* ── Layout footer body ── */
        .footer-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Brand: centrato su mobile */
        .footer-brand {
          text-align: center;
        }

        /* Griglia 2 colonne già su mobile */
        .footer-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        /* Brand description: centrata su mobile */
        .footer-brand-desc {
          margin: 0 auto;
          max-width: 26ch;
          text-align: center;
        }

        /* ── Desktop: Layout a Griglia (Senza toccare Mobile) ── */
        @media (min-width: 768px) {
          .footer-body {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr; /* Colonna Brand più larga, Nav e Contatti affiancati */
            gap: 2rem;
            padding: 3rem 1.5rem 2.5rem;
            align-items: start;
          }
          .footer-brand {
            text-align: left;
            padding-right: 2rem;
          }
          /* Su desktop il paragrafo si allinea a sinistra e non ha un max-width stretto */
          .footer-brand-desc {
            margin: 0;
            max-width: none;
            text-align: left;
          }
          /* "Unwrappiamo" footer-cols in modo che i suoi figli entrino nella grid principale */
          .footer-cols {
            display: contents;
          }
        }

        /* ── Link Legali ── */
        .footer-legal {
          border-top: 1px solid var(--color-border);
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.25rem;
          text-align: center;
        }
        .footer-legal-link {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-legal-link:hover {
          color: var(--color-ink-light);
        }
        .legal-sep {
          color: var(--color-border);
          font-size: 0.75rem;
        }
        /* Su schermi piccoli nascondiamo il puntino per far fluire i link puri e compatti a griglia o wrap */
        @media (max-width: 480px) {
          .legal-sep { display: none; }
        }
        @media (min-width: 768px) {
          .legal-links-wrapper {
            column-gap: 2rem !important; /* Molto ariosi su desktop (come gap-8) */
          }
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          border-top: 1px solid var(--color-border);
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column; /* Impilato su mobile */
          align-items: center;
          gap: 1rem;
          font-size: 0.72rem;
          color: var(--color-muted);
          text-align: center;
        }

        /* Nasconde l'ornamento su mobile */
        .footer-ornament { display: none; }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row; /* Orizzontale su desktop */
            justify-content: space-between;
            gap: 1rem;
            text-align: left;
            padding: 1rem 1.25rem;
          }
          .footer-ornament { display: block; }
          
          /* Bilanciamento perfetto: sx e dx occupano uguale spazio, così l'icona è 100% centrale */
          .footer-copyright { flex: 1; text-align: left; }
          .footer-ornament { flex: 0 0 auto; text-align: center; }
          .footer-admin-row { flex: 1; justify-content: flex-end; }
        }

        /* ── Hover link ── */
        .footer-nav-link  { transition: color 0.2s ease; }
        .footer-nav-link:hover  { color: var(--color-burgundy) !important; }
        .footer-email-link { transition: color 0.2s ease; }
        .footer-email-link:hover { color: var(--color-burgundy-dark) !important; }
        .admin-link { transition: color 0.2s ease; }
        .admin-link:hover { color: var(--color-muted) !important; }
      `}</style>
    </footer>
  );
}

/* ── Stile intestazioni colonne ── */
const colHeadStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "var(--color-ink-light)",
  margin: "0 0 0.75rem",
};
