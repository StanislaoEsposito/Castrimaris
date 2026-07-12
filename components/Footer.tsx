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
          <div className="footer-brand-logo" style={{
            display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem"
          }}>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem",
              color: "var(--color-gold)",
              lineHeight: 1,
              marginTop: "-0.15rem",
            }} aria-hidden="true">
              ❧
            </span>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.45rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
            }}>
              Castrimaris
            </span>
          </div>
          <p className="footer-brand-desc" style={{
            fontSize: "0.8rem",
            lineHeight: 1.6,
          }}>
            Un archivio di fonti storiche del &apos;500 e protocolli notarili
            dell&apos;Archivio di Stato di Napoli.
          </p>
        </div>

        {/* ── Griglia Navigazione + Contatti (Centrati su mobile, griglia su desktop) ── */}
        <div className="footer-cols">

          {/* Navigazione */}
          <div className="footer-col-item hidden md:block">
            <h3 style={colHeadStyle}>Navigazione</h3>
            <ul className="footer-list">
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
          <div className="footer-col-item">
            <h3 style={colHeadStyle}>Contatti</h3>
            <p className="footer-contact-text" style={{ fontSize: "0.8rem", margin: "0 0 0.4rem", lineHeight: 1.5 }}>
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
        .footer-brand-logo {
          justify-content: center;
        }

        /* Colonne navigazione e contatti: incolonnate e centrate su mobile */
        .footer-cols {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .footer-col-item {
          text-align: center;
        }
        .footer-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
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
          .footer-brand-logo {
            justify-content: flex-start;
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
          /* Ripristino dell'allineamento a sinistra e naturale su desktop */
          .footer-col-item {
            text-align: left;
          }
          .footer-list {
            align-items: flex-start;
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
          color: var(--color-gold);
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1;
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

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row; /* Orizzontale su desktop */
            justify-content: space-between;
            gap: 1rem;
            text-align: left;
            padding: 1rem 1.25rem;
          }
          
          /* Bilanciamento: sx e dx liberi agli estremi */
          .footer-copyright { flex: 1; text-align: left; }
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
