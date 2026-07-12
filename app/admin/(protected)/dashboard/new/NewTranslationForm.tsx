"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { saveTranslationAction, type SaveState } from "./actions";

/* Carica l'editor solo lato client (Tiptap non è SSR-safe) */
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
   SEZIONE IMMAGINE — campo upload + selettore posizione
   ───────────────────────────────────────────────────────────────────────── */
function ImageSection({
  currentImageUrl = null,
}: {
  currentImageUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [position, setPosition] = useState<"top" | "left" | "right">("top");
  
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
      // Assegna il file droppato all'input nascosto tramite DataTransfer
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}
           className="img-section-grid">

        {/* Upload */}
        <div>
          <label style={labelStyle}>Carica immagine (JPG, PNG, WebP — max 8 MB)</label>
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
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.4rem" }}>
            Facoltativa. Se non caricata, il documento apparirà senza foto.
          </p>

          {/* Preview */}
          {preview && (
            <div style={{ marginTop: "0.75rem" }}>
              <p style={{ ...labelStyle, marginBottom: "0.4rem" }}>Anteprima</p>
              <Image
                src={preview}
                alt="Anteprima immagine documento"
                width={240}
                height={180}
                style={{
                  width: "100%", maxWidth: "240px",
                  height: "auto", borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  objectFit: "cover",
                }}
                unoptimized={preview.startsWith("blob:")}
              />
            </div>
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
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.6rem" }}>
            Scelta ignorata se non viene caricata un&apos;immagine.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FORM PRINCIPALE
   ───────────────────────────────────────────────────────────────────────── */
export default function NewTranslationForm() {
  const initialState: SaveState = { error: null, fields: { title: "", author_name: "" } };
  const [state, formAction] = useActionState(saveTranslationAction, initialState);

  const latinRef   = useRef<HTMLInputElement>(null);
  const italianRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {state.error && (
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
          {state.error}
        </div>
      )}

      {/* Il form con Server Action gestisce automaticamente il multipart */}
      <form action={formAction}>
        {/* Campi nascosti per l'HTML degli editor */}
        <input type="hidden" name="latin_text"   ref={latinRef}   defaultValue="" />
        <input type="hidden" name="italian_text" ref={italianRef} defaultValue="" />

        {/* ── Metadati ── */}
        <div style={cardStyle}>
          <h2 style={sectionHeadStyle}>Informazioni</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
               className="meta-grid">
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="title" style={labelStyle}>Titolo *</label>
              <input id="title" name="title" type="text" required
                placeholder="es. De Bello Gallico, Libro I"
                defaultValue={state.fields?.title ?? ""}
                style={inputStyle} className="form-input" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="author_name" style={labelStyle}>Autore / Notaio *</label>
              <input id="author_name" name="author_name" type="text" required
                placeholder="es. Cicerone, Giovanni Notaio…"
                defaultValue={state.fields?.author_name ?? ""}
                style={inputStyle} className="form-input" />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic" }}>
                Se l&apos;autore non esiste ancora, verrà creato automaticamente.
              </span>
            </div>
          </div>
        </div>

        {/* ── Immagine ── */}
        <ImageSection />

        {/* ── Testo Latino ── */}
        <div style={sectionStyle}>
          <h2 style={sectionHeadStyle}>
            <span style={{ color: "#722F37", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>L</span>
            {" "}Testo Latino Originale
          </h2>
          <SimpleEditor
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
            placeholder="Scrivi qui la traduzione italiana…"
            minHeight="18rem"
            onUpdate={(html) => { if (italianRef.current) italianRef.current.value = html; }}
          />
        </div>

        {/* ── Azioni ── */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", padding: "1.25rem 1.75rem",
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
