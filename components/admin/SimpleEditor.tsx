"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/* ─────────────────────────────────────────────────────────────────────────
   TOOLBAR BUTTON — riutilizzabile
   ───────────────────────────────────────────────────────────────────────── */
function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2rem",
        height: "2rem",
        padding: "0 0.4rem",
        border: "1px solid",
        borderColor: active ? "#722F37" : "#e2e8f0",
        borderRadius: "4px",
        backgroundColor: active ? "rgba(114,47,55,0.08)" : "transparent",
        color: active ? "#722F37" : "#475569",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: active ? 700 : 400,
        fontFamily: "var(--font-sans)",
        transition: "all 0.15s ease",
      }}
      className="toolbar-btn"
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SIMPLE EDITOR — Client Component
   Props:
     initialContent  → HTML iniziale (per editing futuro)
     onUpdate        → callback chiamata ogni volta che il contenuto cambia
     placeholder     → testo segnaposto
   ───────────────────────────────────────────────────────────────────────── */
interface SimpleEditorProps {
  initialContent?: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function SimpleEditor({
  initialContent = "",
  onUpdate,
  placeholder = "Inizia a scrivere…",
  minHeight = "16rem",
}: SimpleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disabilita elementi che non usiamo
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        code: false,
      }),
      Image.configure({ inline: false }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        // Stile del documento — identico al frontend pubblico
        style: [
          `font-family: var(--font-serif)`,
          `font-size: 1.05rem`,
          `line-height: 1.85`,
          `color: var(--color-ink)`,
          `min-height: ${minHeight}`,
          `padding: 1.25rem`,
          `outline: none`,
        ].join(";"),
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
  });

  // Sincronizza il contenuto iniziale se cambia dall'esterno
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [initialContent, editor]);

  /* ── Hook dichiarati PRIMA di qualsiasi return condizionale ── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  /* Apre il selettore file nativo */
  const handleImageInsert = () => {
    fileInputRef.current?.click();
  };

  /* Upload su Supabase Storage → inserimento nell'editor */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Resetta l'input così lo stesso file può essere selezionato di nuovo
    e.target.value = "";

    // Validazione MIME e dimensione (max 8 MB)
    if (!file.type.startsWith("image/")) {
      alert("Seleziona un file immagine valido (JPG, PNG, WebP, GIF…).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Il file supera il limite di 8 MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase  = createClient();
      const ext       = file.name.split(".").pop() ?? "jpg";
      const fileName  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath  = `editor/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      alert(`Upload fallito: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "border-color 0.2s ease",
      }}
      className="editor-wrapper"
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.5rem 0.75rem",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          flexWrap: "wrap",
        }}
      >
        {/* Grassetto */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Grassetto (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>

        {/* Corsivo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Corsivo (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>

        {/* Separatore */}
        <span
          aria-hidden="true"
          style={{ width: 1, height: "1.25rem", backgroundColor: "#e2e8f0" }}
        />

        {/* H2 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Sottotitolo (H2)"
        >
          H2
        </ToolbarButton>

        {/* Paragrafo normale */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragrafo normale"
        >
          ¶
        </ToolbarButton>

        {/* Separatore */}
        <span
          aria-hidden="true"
          style={{ width: 1, height: "1.25rem", backgroundColor: "#e2e8f0" }}
        />

        {/* Lista puntata */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista puntata"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
            <line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/>
            <circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
          </svg>
        </ToolbarButton>

        {/* Separatore */}
        <span
          aria-hidden="true"
          style={{ width: 1, height: "1.25rem", backgroundColor: "#e2e8f0" }}
        />

        {/* Immagine — upload reale su Supabase Storage */}
        <ToolbarButton
          onClick={handleImageInsert}
          title={uploading ? "Caricamento in corso…" : "Inserisci immagine"}
          active={uploading}
        >
          {uploading ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              aria-hidden="true"
              style={{ animation: "spin 0.8s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
        </ToolbarButton>

        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
          aria-hidden="true"
        />

      </div>{/* ── fine toolbar ── */}

      {/* ── Area di scrittura ── */}
      <EditorContent editor={editor} />

      {/* ── Stili globali dell'editor ── */}
      <style>{`
        /* Placeholder */
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
          font-style: italic;
          font-family: var(--font-serif);
        }
        /* H2 nell'editor */
        .tiptap h2 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--color-ink);
          margin: 1.25rem 0 0.5rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.25rem;
        }
        /* Paragrafi */
        .tiptap p { margin: 0 0 0.75rem; }
        /* Bold + Italic */
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        /* Lista */
        .tiptap ul {
          padding-left: 1.5rem;
          margin: 0 0 0.75rem;
          list-style: disc;
        }
        /* Focus wrapper */
        .editor-wrapper:focus-within {
          border-color: #722F37 !important;
          box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.10);
        }
        /* Toolbar hover */
        .toolbar-btn:hover {
          border-color: #722F37 !important;
          color: #722F37 !important;
        }
        /* Immagini nell'editor */
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 0.5rem 0;
        }
        /* Spinner upload */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
