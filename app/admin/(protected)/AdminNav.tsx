import { logoutAction } from "@/app/admin/actions";

/* ─────────────────────────────────────────────────────────────────────────
   ADMIN NAV BAR — Server Component
   Riceve l'email dell'utente come prop dal layout.
   Il form di logout è un Server Action nativo — nessun "use client" necessario.
   ───────────────────────────────────────────────────────────────────────── */
interface AdminNavProps {
  userEmail: string | undefined;
}

export default function AdminNav({ userEmail }: AdminNavProps) {
  return (
    <header
      style={{
        backgroundColor: "#1e293b",   /* slate-800 — distinguibile dal frontend */
        borderBottom: "1px solid #334155",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Banda colorata superiore */}
      <div
        aria-hidden="true"
        style={{
          height: 2,
          background: "linear-gradient(to right, #722F37, #C9A84C, #722F37)",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "3.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* ── Brand admin ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Badge "ADMIN" */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#C9A84C",
              backgroundColor: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "3px",
              padding: "2px 6px",
            }}
          >
            Admin
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#f1f5f9",
              letterSpacing: "-0.01em",
            }}
          >
            Castrimaris
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "#64748b",
            }}
          >
            · Amministrazione
          </span>
        </div>

        {/* ── Destra: utente + logout ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Email utente */}
          {userEmail && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="admin-email">{userEmail}</span>
            </span>
          )}

          {/* Separatore */}
          <span aria-hidden="true" style={{ color: "#334155", fontSize: "1rem" }}>|</span>

          {/* Form logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              id="logout-btn"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "#94a3b8",
                backgroundColor: "transparent",
                border: "1px solid #334155",
                borderRadius: "4px",
                padding: "0.3rem 0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "color 0.2s, border-color 0.2s",
              }}
              className="logout-btn"
            >
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Esci
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .logout-btn:hover {
          color: #f1f5f9 !important;
          border-color: #64748b !important;
        }
        /* Nasconde l'email su schermi molto piccoli */
        @media (max-width: 480px) {
          .admin-email { display: none; }
        }
      `}</style>
    </header>
  );
}
