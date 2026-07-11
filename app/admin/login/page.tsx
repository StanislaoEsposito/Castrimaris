import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Accesso Riservato",
  description: "Area di accesso amministrativo — Castrimaris.",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────────────────────
   LOGIN PAGE — Server Component
   Il form interattivo (useActionState, useFormStatus) è in LoginForm.tsx
   ───────────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-papyrus)",
        padding: "1.5rem",
      }}
    >
      {/* ── Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "26rem",
          backgroundColor: "var(--color-papyrus)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "2.75rem 2.5rem 2.5rem",
          boxShadow:
            "0 4px 6px -1px rgba(51,33,33,0.06), 0 10px 40px -4px rgba(51,33,33,0.08)",
        }}
      >
        {/* ── Ornamento cima card ── */}
        <div
          aria-hidden="true"
          style={{
            height: 2,
            marginBottom: "2rem",
            borderRadius: "1px",
            background:
              "linear-gradient(to right, transparent, var(--color-burgundy), var(--color-gold), var(--color-burgundy), transparent)",
          }}
        />

        {/* ── Icona lucchetto ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "50%",
              backgroundColor: "rgba(114,47,55,0.08)",
              border: "1px solid rgba(114,47,55,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-burgundy)",
            }}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* ── Titolo ── */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "var(--color-ink)",
            textAlign: "center",
            marginBottom: "0.35rem",
            letterSpacing: "-0.01em",
          }}
        >
          Accesso Riservato
        </h1>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--color-muted)",
            textAlign: "center",
            marginBottom: "2rem",
            letterSpacing: "0.02em",
          }}
        >
          Castrimaris · Area Amministrativa
        </p>

        {/* ── Form interattivo (Client Component) ── */}
        <LoginForm />

        {/* ── Motto ── */}
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.75rem",
            fontStyle: "italic",
            color: "var(--color-border)",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          «Qui nescit tacere, nescit et loqui.»
        </p>
      </div>
    </div>
  );
}
