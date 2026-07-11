"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import { saveTranslationAction, type SaveState } from "./actions";

/* Carica l'editor solo lato client (Tiptap non è SSR-safe) */
const SimpleEditor = dynamic(
  () => import("@/components/admin/SimpleEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

/* ── Skeleton mentre l'editor carica ── */
function EditorSkeleton() {
  return (
    <div style={{
      border: "1px solid #e2e8f0", borderRadius: "8px",
      height: "16rem", backgroundColor: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#94a3b8" }}>
        Caricamento editor…
      </span>
    </div>
  );
}

/* ── Bottoni submit con stato pending ── */
function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <button
        type="submit"
        name="action"
        value="draft"
        disabled={pending}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600,
          color: "#475569", backgroundColor: "#fff",
          border: "1px solid #cbd5e1", borderRadius: "6px",
          padding: "0.7rem 1.5rem", cursor: pending ? "not-allowed" : "pointer",
          transition: "all 0.2s ease", opacity: pending ? 0.6 : 1,
        }}
        className="draft-btn"
      >
        {pending ? "Salvataggio…" : "Salva come Bozza"}
      </button>

      <button
        type="submit"
        name="action"
        value="publish"
        disabled={pending}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 700,
          letterSpacing: "0.03em", color: "#fff", backgroundColor: "#722F37",
          border: "1px solid #722F37", borderRadius: "6px",
          padding: "0.7rem 1.5rem", cursor: pending ? "not-allowed" : "pointer",
          transition: "all 0.2s ease", opacity: pending ? 0.6 : 1,
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }}
        className="publish-btn"
      >
        {pending ? "Pubblicazione…" : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
            </svg>
            Pubblica Traduzione
          </>
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FORM PRINCIPALE — Client Component
   ───────────────────────────────────────────────────────────────────────── */
export default function NewTranslationForm() {
  const initialState: SaveState = { error: null, fields: { title: "", author_name: "" } };
  const [state, formAction] = useActionState(saveTranslationAction, initialState);

  /* Ref per i campi hidden che contengono l'HTML degli editor */
  const latinRef   = useRef<HTMLInputElement>(null);
  const italianRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* ── Errore globale ── */}
      {state.error && (
        <div role="alert" style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          backgroundColor: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "8px", padding: "0.875rem 1rem",
          marginBottom: "1.5rem", color: "#991b1b",
          fontFamily: "var(--font-sans)", fontSize: "0.85rem",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {state.error}
        </div>
      )}

      <form action={formAction}>
        {/* ── Campi nascosti per il contenuto degli editor ── */}
        <input type="hidden" name="latin_text"   ref={latinRef}   defaultValue="" />
        <input type="hidden" name="italian_text" ref={italianRef} defaultValue="" />

        {/* ════ SEZIONE: Metadati ════ */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "1.75rem", marginBottom: "1.5rem",
        }}>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#94a3b8", margin: "0 0 1.25rem",
          }}>
            Informazioni
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
               className="meta-grid">

            {/* Titolo */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="title" style={labelStyle}>Titolo *</label>
              <input
                id="title" name="title" type="text" required
                placeholder="es. De Bello Gallico, Libro I"
                defaultValue={state.fields?.title ?? ""}
                style={inputStyle}
                className="form-input"
              />
            </div>

            {/* Autore — testo libero, lookup/create nel server action */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="author_name" style={labelStyle}>Autore / Notaio *</label>
              <input
                id="author_name" name="author_name" type="text" required
                placeholder="es. Cicerone, Giovanni Notaio…"
                defaultValue={state.fields?.author_name ?? ""}
                style={inputStyle}
                className="form-input"
              />
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "0.7rem",
                color: "#94a3b8", fontStyle: "italic",
              }}>
                Se l&apos;autore non esiste ancora, verrà creato automaticamente.
              </span>
            </div>
          </div>
        </div>

        {/* ════ SEZIONE: Testo Latino ════ */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <LatinIcon /> Testo Latino Originale
          </h2>
          <SimpleEditor
            placeholder="Incolla o digita il testo latino originale…"
            minHeight="18rem"
            onUpdate={(html) => {
              if (latinRef.current) latinRef.current.value = html;
            }}
          />
        </div>

        {/* ════ SEZIONE: Traduzione Italiana ════ */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <ItalianIcon /> Traduzione Italiana
          </h2>
          <SimpleEditor
            placeholder="Scrivi qui la traduzione italiana…"
            minHeight="18rem"
            onUpdate={(html) => {
              if (italianRef.current) italianRef.current.value = html;
            }}
          />
        </div>

        {/* ════ AZIONI ════ */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "1.25rem 1.75rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <Link href="/admin/dashboard" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.83rem",
            color: "#64748b", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
          }}>
            ← Annulla
          </Link>
          <FormActions />
        </div>
      </form>

      <style>{`
        .form-input:focus {
          border-color: #722F37 !important;
          box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.10);
          outline: none;
        }
        .draft-btn:hover:not(:disabled) {
          border-color: #94a3b8 !important;
          background-color: #f8fafc !important;
        }
        .publish-btn:hover:not(:disabled) {
          background-color: #5a2029 !important;
          border-color: #5a2029 !important;
        }
        @media (max-width: 640px) {
          .meta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ── Stili condivisi ── */
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600,
  letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.9rem", color: "#0f172a",
  backgroundColor: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "6px", padding: "0.65rem 0.875rem",
  width: "100%", transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "1.75rem", marginBottom: "1.5rem",
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "#94a3b8", margin: "0 0 1rem",
  display: "flex", alignItems: "center", gap: "0.4rem",
};

/* ── Icone sezione ── */
function LatinIcon() {
  return (
    <span style={{ color: "#722F37", fontSize: "0.85rem", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
      L
    </span>
  );
}
function ItalianIcon() {
  return (
    <span style={{ color: "#2563eb", fontSize: "0.85rem", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
      I
    </span>
  );
}
