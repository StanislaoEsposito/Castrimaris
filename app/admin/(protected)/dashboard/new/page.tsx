import type { Metadata } from "next";
import Link from "next/link";
import NewTranslationForm from "./NewTranslationForm";

export const metadata: Metadata = {
  title: "Nuova Traduzione",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────────────────────
   NEW TRANSLATION PAGE — Server Component
   Il form interattivo (editor Tiptap, stato pending) è in NewTranslationForm
   ───────────────────────────────────────────────────────────────────────── */
export default function NewTranslationPage() {
  return (
    <>
      {/* ── Intestazione ── */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: "0.75rem", marginBottom: "1.75rem",
      }}>
        <Link
          href="/admin/dashboard"
          title="Torna alla dashboard"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "2rem", height: "2rem",
            border: "1px solid #e2e8f0", borderRadius: "6px",
            color: "#64748b", backgroundColor: "#fff", textDecoration: "none",
            flexShrink: 0, transition: "all 0.2s ease",
          }}
          className="back-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>

        <div>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "1.875rem",
            fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em",
          }}>
            Nuova Traduzione
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.8rem",
            color: "#64748b", margin: "0.2rem 0 0",
          }}>
            Compila i campi e scegli se salvare in bozza o pubblicare subito.
          </p>
        </div>
      </div>

      {/* ── Form (Client Component) ── */}
      <NewTranslationForm />

      <style>{`
        .back-btn:hover {
          border-color: #94a3b8 !important;
          color: #0f172a !important;
        }
      `}</style>
    </>
  );
}
