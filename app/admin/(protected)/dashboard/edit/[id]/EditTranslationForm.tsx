"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  updateTranslationAction,
  deleteTranslationAction,
  type EditState,
} from "./actions";

/* Carica Tiptap solo lato client */
const SimpleEditor = dynamic(
  () => import("@/components/admin/SimpleEditor"),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

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
      <button type="submit" name="action" value="draft" disabled={pending}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 600,
          color: "#475569", backgroundColor: "#fff",
          border: "1px solid #cbd5e1", borderRadius: "6px",
          padding: "0.7rem 1.5rem", cursor: pending ? "not-allowed" : "pointer",
          transition: "all 0.2s ease", opacity: pending ? 0.6 : 1,
        }} className="draft-btn">
        {pending ? "Salvataggio…" : "Salva come Bozza"}
      </button>

      <button type="submit" name="action" value="publish" disabled={pending}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 700,
          letterSpacing: "0.03em", color: "#fff", backgroundColor: "#722F37",
          border: "1px solid #722F37", borderRadius: "6px",
          padding: "0.7rem 1.5rem", cursor: pending ? "not-allowed" : "pointer",
          transition: "all 0.2s ease", opacity: pending ? 0.6 : 1,
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
        }} className="publish-btn">
        {pending ? "Salvataggio…" : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
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
   EDIT FORM — Client Component
   ───────────────────────────────────────────────────────────────────────── */
interface EditTranslationFormProps {
  id: string;
  initialTitle: string;
  initialAuthorName: string;
  initialLatinText: string;
  initialItalianTranslation: string;
}

export default function EditTranslationForm({
  id,
  initialTitle,
  initialAuthorName,
  initialLatinText,
  initialItalianTranslation,
}: EditTranslationFormProps) {
  const initState: EditState = {
    error: null,
    fields: { title: initialTitle, author_name: initialAuthorName },
  };
  const [updateState, updateAction] = useActionState(updateTranslationAction, initState);
  const [deleteState, deleteAction] = useActionState(deleteTranslationAction, { error: null });

  const latinRef   = useRef<HTMLInputElement>(null);
  const italianRef = useRef<HTMLInputElement>(null);

  /* Conferma eliminazione */
  const [confirmDelete, setConfirmDelete] = useState(false);

  const errorMsg = updateState.error ?? deleteState.error;

  return (
    <>
      {/* ── Errore globale ── */}
      {errorMsg && (
        <div role="alert" style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          backgroundColor: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "8px", padding: "0.875rem 1rem",
          marginBottom: "1.5rem", color: "#991b1b",
          fontFamily: "var(--font-sans)", fontSize: "0.85rem",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {errorMsg}
        </div>
      )}

      {/* ════ FORM AGGIORNAMENTO ════ */}
      <form action={updateAction}>
        {/* Campi nascosti */}
        <input type="hidden" name="id"           value={id} />
        <input type="hidden" name="latin_text"   ref={latinRef}   defaultValue={initialLatinText} />
        <input type="hidden" name="italian_text" ref={italianRef} defaultValue={initialItalianTranslation} />

        {/* ── Metadati ── */}
        <div style={cardStyle}>
          <h2 style={sectionHeadStyle}>Informazioni</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
               className="meta-grid">

            {/* Titolo */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="title" style={labelStyle}>Titolo *</label>
              <input id="title" name="title" type="text" required
                placeholder="es. De Bello Gallico, Libro I"
                defaultValue={updateState.fields?.title ?? initialTitle}
                style={inputStyle} className="form-input" />
            </div>

            {/* Autore */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="author_name" style={labelStyle}>Autore / Notaio *</label>
              <input id="author_name" name="author_name" type="text" required
                placeholder="es. Cicerone, Giovanni Notaio…"
                defaultValue={updateState.fields?.author_name ?? initialAuthorName}
                style={inputStyle} className="form-input" />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic" }}>
                Se l&apos;autore non esiste ancora, verrà creato automaticamente.
              </span>
            </div>
          </div>
        </div>

        {/* ── Testo Latino ── */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadStyle}>
            <span style={{ color: "#722F37", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>L</span>
            {" "}Testo Latino Originale
          </h2>
          <SimpleEditor
            initialContent={initialLatinText}
            placeholder="Incolla o digita il testo latino originale…"
            minHeight="18rem"
            onUpdate={(html) => { if (latinRef.current) latinRef.current.value = html; }}
          />
        </div>

        {/* ── Traduzione Italiana ── */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadStyle}>
            <span style={{ color: "#2563eb", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>I</span>
            {" "}Traduzione Italiana
          </h2>
          <SimpleEditor
            initialContent={initialItalianTranslation}
            placeholder="Scrivi qui la traduzione italiana…"
            minHeight="18rem"
            onUpdate={(html) => { if (italianRef.current) italianRef.current.value = html; }}
          />
        </div>

        {/* ── Barra azioni ── */}
        <div style={{
          ...cardStyle, padding: "1.25rem 1.75rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}>
          <Link href="/admin/dashboard" style={{
            fontFamily: "var(--font-sans)", fontSize: "0.83rem",
            color: "#64748b", textDecoration: "none",
          }}>
            ← Annulla
          </Link>
          <FormActions />
        </div>
      </form>

      {/* ════ ZONA ELIMINAZIONE ════ */}
      <div style={{
        marginTop: "2rem", padding: "1.25rem 1.75rem",
        border: "1px solid #fecaca", borderRadius: "12px",
        backgroundColor: "#fff5f5",
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.83rem",
          color: "#64748b", margin: "0 0 0.75rem",
        }}>
          <strong style={{ color: "#991b1b" }}>Zona pericolosa</strong>
          {" "}— l&apos;eliminazione è irreversibile.
        </p>

        {!confirmDelete ? (
          <button type="button" onClick={() => setConfirmDelete(true)}
            style={{
              fontFamily: "var(--font-sans)", fontSize: "0.83rem", fontWeight: 600,
              color: "#991b1b", backgroundColor: "transparent",
              border: "1px solid #fca5a5", borderRadius: "6px",
              padding: "0.45rem 1rem", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "0.35rem",
              transition: "all 0.2s ease",
            }} className="delete-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Elimina Traduzione
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.83rem", color: "#991b1b" }}>
              Sei sicuro? Quest&apos;azione non può essere annullata.
            </span>
            <form action={deleteAction} style={{ display: "inline" }}>
              <input type="hidden" name="id" value={id} />
              <button type="submit"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.83rem", fontWeight: 700,
                  color: "#fff", backgroundColor: "#991b1b",
                  border: "none", borderRadius: "6px",
                  padding: "0.45rem 1rem", cursor: "pointer",
                }}>
                Sì, elimina
              </button>
            </form>
            <button type="button" onClick={() => setConfirmDelete(false)}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "0.83rem",
                color: "#64748b", backgroundColor: "transparent",
                border: "1px solid #cbd5e1", borderRadius: "6px",
                padding: "0.45rem 1rem", cursor: "pointer",
              }}>
              Annulla
            </button>
          </div>
        )}
      </div>

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
        .delete-btn:hover {
          background-color: #fef2f2 !important;
          border-color: #f87171 !important;
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
const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff", border: "1px solid #e2e8f0",
  borderRadius: "12px", padding: "1.75rem", marginBottom: "1.5rem",
};
const sectionStyle: React.CSSProperties = {
  ...cardStyle,
};
const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "#94a3b8", margin: "0 0 1rem",
  display: "flex", alignItems: "center", gap: "0.4rem",
};
