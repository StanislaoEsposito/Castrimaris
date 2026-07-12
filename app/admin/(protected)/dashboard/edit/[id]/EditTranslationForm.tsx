"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  updateTranslationAction,
  deleteTranslationAction,
  type EditState,
} from "./actions";

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

/* ── Bottoni submit ── */
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
   SEZIONE IMMAGINE — con preview dell'immagine corrente e possibilità di
   sostituzione + cambio posizione
   ───────────────────────────────────────────────────────────────────────── */
function ImageSection({
  currentImageUrl,
  currentPosition,
}: {
  currentImageUrl: string | null;
  currentPosition: "top" | "left" | "right";
}) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [position, setPosition] = useState<"top" | "left" | "right">(currentPosition);
  const [replacing, setReplacing] = useState(false);

  /* ── Drag & Drop States ── */
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={sectionHeadStyle}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        Immagine del Documento
      </h2>

      {/* Campo nascosto per preservare l'URL corrente (la action lo legge se non arriva un nuovo file) */}
      <input type="hidden" name="keep_existing_image" value={currentImageUrl ?? ""} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}
           className="img-section-grid">

        {/* Upload / Preview */}
        <div>
          {currentImageUrl && !replacing ? (
            <>
              <p style={labelStyle}>Immagine attuale</p>
              <div style={{ marginTop: "0.5rem" }}>
                <Image
                  src={currentImageUrl}
                  alt="Immagine documento attuale"
                  width={240}
                  height={180}
                  style={{
                    width: "100%", maxWidth: "240px",
                    height: "auto", borderRadius: "6px",
                    border: "1px solid #e2e8f0", objectFit: "cover",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => { setReplacing(true); setPreview(null); }}
                style={{
                  marginTop: "0.6rem",
                  fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                  color: "#722F37", background: "none", border: "none",
                  cursor: "pointer", textDecoration: "underline", padding: 0,
                }}
              >
                Sostituisci immagine
              </button>
            </>
          ) : (
            <>
              <label style={labelStyle}>
                {currentImageUrl ? "Nuova immagine (sostituirà quella attuale)" : "Carica immagine (JPG, PNG, WebP — max 8 MB)"}
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                style={{
                  marginTop: "0.5rem",
                  border: `2px dashed ${isDragOver ? "#722F37" : "#cbd5e1"}`,
                  backgroundColor: isDragOver ? "rgba(114,47,55,0.05)" : "#f8fafc",
                  borderRadius: "8px",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragOver ? "#722F37" : "#94a3b8"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem", display: "block" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: isDragOver ? "#722F37" : "#64748b", fontWeight: 500 }}>
                  Trascina qui l'immagine o clicca per caricare
                </span>
                <input
                  id="image_file"
                  name="image_file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFile}
                  ref={inputRef}
                  style={{ display: "none" }}
                />
              </div>
              {currentImageUrl && (
                <button
                  type="button"
                  onClick={() => { setReplacing(false); setPreview(currentImageUrl); }}
                  style={{
                    marginTop: "0.4rem",
                    fontFamily: "var(--font-sans)", fontSize: "0.78rem",
                    color: "#64748b", background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline", padding: 0,
                  }}
                >
                  ← Mantieni immagine attuale
                </button>
              )}
              {preview && (
                <div style={{ marginTop: "0.75rem" }}>
                  <p style={{ ...labelStyle, marginBottom: "0.4rem" }}>Anteprima nuova immagine</p>
                  <Image
                    src={preview}
                    alt="Anteprima nuova immagine"
                    width={240}
                    height={180}
                    style={{
                      width: "100%", maxWidth: "240px",
                      height: "auto", borderRadius: "6px",
                      border: "1px solid #e2e8f0", objectFit: "cover",
                    }}
                    unoptimized={preview.startsWith("blob:")}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Posizione */}
        <div>
          <p style={labelStyle}>Posizione Immagine</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.5rem" }}>
            {(["top", "left", "right"] as const).map((pos) => {
              const labels = { top: "Sopra il testo", left: "A Sinistra del testo", right: "A Destra del testo" };
              const icons  = { top: "⬆", left: "⬅", right: "➡" };
              return (
                <label key={pos} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  fontFamily: "var(--font-sans)", fontSize: "0.85rem",
                  color: position === pos ? "#722F37" : "#475569",
                  cursor: "pointer",
                }}>
                  <input
                    type="radio"
                    name="image_position"
                    value={pos}
                    checked={position === pos}
                    onChange={() => setPosition(pos)}
                    style={{ accentColor: "#722F37" }}
                  />
                  <span>{icons[pos]}</span>
                  <span>{labels[pos]}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
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
  initialImageUrl: string | null;
  initialImagePosition: "top" | "left" | "right";
}

export default function EditTranslationForm({
  id,
  initialTitle,
  initialAuthorName,
  initialLatinText,
  initialItalianTranslation,
  initialImageUrl,
  initialImagePosition,
}: EditTranslationFormProps) {
  const initState: EditState = {
    error: null,
    fields: { title: initialTitle, author_name: initialAuthorName },
  };
  const [updateState, updateAction] = useActionState(updateTranslationAction, initState);
  const [deleteState, deleteAction] = useActionState(deleteTranslationAction, { error: null });

  const latinRef   = useRef<HTMLInputElement>(null);
  const italianRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const errorMsg = updateState.error ?? deleteState.error;

  return (
    <>
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

      <form action={updateAction}>
        <input type="hidden" name="id"           value={id} />
        <input type="hidden" name="latin_text"   ref={latinRef}   defaultValue={initialLatinText} />
        <input type="hidden" name="italian_text" ref={italianRef} defaultValue={initialItalianTranslation} />

        {/* ── Metadati ── */}
        <div style={cardStyle}>
          <h2 style={sectionHeadStyle}>Informazioni</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
               className="meta-grid">
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="title" style={labelStyle}>Titolo *</label>
              <input id="title" name="title" type="text" required
                defaultValue={updateState.fields?.title ?? initialTitle}
                style={inputStyle} className="form-input" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="author_name" style={labelStyle}>Autore / Notaio *</label>
              <input id="author_name" name="author_name" type="text" required
                defaultValue={updateState.fields?.author_name ?? initialAuthorName}
                style={inputStyle} className="form-input" />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic" }}>
                Se l&apos;autore non esiste ancora, verrà creato automaticamente.
              </span>
            </div>
          </div>
        </div>

        {/* ── Immagine ── */}
        <ImageSection
          currentImageUrl={initialImageUrl}
          currentPosition={initialImagePosition}
        />

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

      {/* ── Zona eliminazione ── */}
      <div style={{
        marginTop: "2rem", padding: "1.25rem 1.75rem",
        border: "1px solid #fecaca", borderRadius: "12px",
        backgroundColor: "#fff5f5",
      }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.83rem", color: "#64748b", margin: "0 0 0.75rem" }}>
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
          .img-section-grid { grid-template-columns: 1fr !important; }
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
const sectionStyle: React.CSSProperties = { ...cardStyle };
const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 700,
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "#94a3b8", margin: "0 0 1rem",
  display: "flex", alignItems: "center", gap: "0.4rem",
};
