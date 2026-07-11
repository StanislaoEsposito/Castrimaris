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

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p style={{ margin: 0 }}>
          © {currentYear}{" "}
          <span style={{ color: "var(--color-ink-light)", fontWeight: 500 }}>Castrimaris</span>
          . Tutti i diritti riservati.
        </p>

        <span aria-hidden="true" style={{
          fontFamily: "var(--font-serif)", fontSize: "0.9rem",
          color: "var(--color-gold)", letterSpacing: "0.3em",
        }}>
          ❧
        </span>

        {/* Motto + link admin nella stessa riga finale */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

        /* ── Desktop: tutto su una riga ── */
        @media (min-width: 768px) {
          .footer-body {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            padding: 2.75rem 1.5rem 2rem;
            gap: 3rem;
          }
          .footer-brand {
            text-align: left;
            flex: 1;
          }
          /* Su desktop il paragrafo si allinea a sinistra col titolo */
          .footer-brand-desc {
            margin: 0;
            max-width: 28ch;
          }
          .footer-cols {
            flex: 1;
            gap: 2rem;
          }
        }

        /* ── Bottom bar ── */
        .footer-bottom {
          border-top: 1px solid var(--color-border);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.875rem 1.25rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.72rem;
          color: var(--color-muted);
        }

        /* Nasconde l'ornamento su schermi molto stretti */
        @media (max-width: 400px) {
          .footer-bottom span[aria-hidden="true"] { display: none; }
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
