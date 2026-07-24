"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { useEffect, useRef, useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { createClient } from "@/utils/supabase/client";

/* ─────────────────────────────────────────────────────────────────────────
   COSTANTI UPLOAD
   ───────────────────────────────────────────────────────────────────────── */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
};

const SUPABASE_BUCKET = "media";
const SUPABASE_PATH_PREFIX = "article-images";

/* ─────────────────────────────────────────────────────────────────────────
   ESTENSIONE IMAGE — classi fisse, nessun resize
   ───────────────────────────────────────────────────────────────────────── */
const ArticleImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      /* Forza sempre le classi CSS di layout — nessun resize manuale */
      class: {
        default: "article-img",
        parseHTML: () => "article-img",
        renderHTML: () => ({ class: "article-img" }),
      },
      /* Rimuove gli attributi width/height dal markup generato */
      width:  { default: null, renderHTML: () => ({}) },
      height: { default: null, renderHTML: () => ({}) },
    };
  },
}).configure({ inline: false, allowBase64: false });

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
interface SimpleEditorProps {
  initialContent?: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   TOOLBAR BUTTON
   ───────────────────────────────────────────────────────────────────────── */
function ToolbarBtn({
  onClick,
  active = false,
  title,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "2rem",
        height: "2rem",
        padding: "0 0.5rem",
        border: "1px solid",
        borderColor: active ? "#722F37" : "#e2e8f0",
        borderRadius: "4px",
        backgroundColor: active ? "rgba(114,47,55,0.10)" : "transparent",
        color: active ? "#722F37" : disabled ? "#cbd5e1" : "#475569",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "0.8rem",
        fontWeight: active ? 700 : 400,
        fontFamily: "var(--font-sans)",
        transition: "all 0.15s ease",
        flexShrink: 0,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 1,
        height: "1.2rem",
        backgroundColor: "#e2e8f0",
        flexShrink: 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   TOAST DI CARICAMENTO
   ───────────────────────────────────────────────────────────────────────── */
function UploadToast({ visible }: { visible: boolean }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "absolute",
        bottom: "0.75rem",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "110%"})`,
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1), opacity 0.25s ease",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#1e293b",
        color: "#f1f5f9",
        borderRadius: "8px",
        padding: "0.55rem 1rem",
        fontSize: "0.8rem",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      {/* Spinner SVG */}
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="#38bdf8" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
        aria-hidden="true"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
      Caricamento immagine in corso…
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SIMPLE EDITOR — Con supporto immagini completo
   ───────────────────────────────────────────────────────────────────────── */
export default function SimpleEditor({
  initialContent = "",
  onUpdate,
  placeholder = "Inizia a scrivere…",
  minHeight = "16rem",
}: SimpleEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        code: false,
        strike: false,
        heading: { levels: [2, 3, 4] },
      }),
      ArticleImage,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        style: [
          "font-family: var(--font-serif)",
          "font-size: 1.05rem",
          "line-height: 1.85",
          "color: var(--color-ink)",
          `min-height: ${minHeight}`,
          "padding: 1.25rem",
          "outline: none",
        ].join(";"),
        "data-placeholder": placeholder,
      },
    },
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
  });

  /* Sincronizza contenuto iniziale se cambia dall'esterno */
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [initialContent, editor]);

  /* ── Pipeline di upload immagine ── */
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      /* Valida tipo file */
      if (!file.type.startsWith("image/")) {
        setUploadError("Il file selezionato non è un'immagine.");
        setTimeout(() => setUploadError(null), 4000);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        /* 1. Compressione client-side */
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

        /* 2. Upload su Supabase Storage */
        const ext = compressed.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg");
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
        const filePath = `${SUPABASE_PATH_PREFIX}/${fileName}`;

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET)
          .upload(filePath, compressed, {
            cacheControl: "31536000",
            upsert: false,
            contentType: compressed.type,
          });

        if (uploadError) throw new Error(`Upload fallito: ${uploadError.message}`);

        /* 3. Recupera URL pubblico */
        const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(filePath);

        /* 4. Inserisce immagine nell'editor */
        editor
          .chain()
          .focus()
          .setImage({ src: data.publicUrl, alt: file.name.replace(/\.[^.]+$/, "") })
          .run();

      } catch (err) {
        const msg = err instanceof Error ? err.message : "Errore sconosciuto durante l'upload.";
        setUploadError(msg);
        setTimeout(() => setUploadError(null), 6000);
      } finally {
        setIsUploading(false);
      }
    },
    [editor]
  );

  /* ── Handler pulsante toolbar ── */
  const handleToolbarImageClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    /* Reset input per permettere di ricaricare lo stesso file */
    e.target.value = "";
  };

  /* ── Drag & Drop sull'area editor ── */
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    /* Evita false leave quando si passa su elementi figli */
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  if (!editor) return null;

  /* Valore corrente del selettore formato */
  const headingValue =
    editor.isActive("heading", { level: 2 }) ? "h2" :
    editor.isActive("heading", { level: 3 }) ? "h3" :
    editor.isActive("heading", { level: 4 }) ? "h4" : "p";

  return (
    <div
      className="editor-wrapper"
      style={{
        border: `1px solid ${isDragOver ? "#722F37" : "#e2e8f0"}`,
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
      }}
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
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Grassetto (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarBtn>

        {/* Corsivo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Corsivo (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarBtn>

        <Sep />

        {/* Formato testo */}
        <select
          value={headingValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(v.replace("h", "")) as 2 | 3 | 4;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          style={{
            padding: "0.2rem 0.5rem",
            fontSize: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            color: "#475569",
            outline: "none",
          }}
          title="Formato testo"
        >
          <option value="p">Paragrafo</option>
          <option value="h2">Titolo 2 (Grande)</option>
          <option value="h3">Titolo 3 (Medio)</option>
          <option value="h4">Titolo 4 (Piccolo)</option>
        </select>

        <Sep />

        {/* Linea orizzontale */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linea divisoria"
        >
          ―
        </ToolbarBtn>

        {/* Lista puntata */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista puntata"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>
            <line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="currentColor"/>
            <circle cx="4" cy="12" r="1" fill="currentColor"/>
            <circle cx="4" cy="18" r="1" fill="currentColor"/>
          </svg>
        </ToolbarBtn>

        <Sep />

        {/* ── Pulsante Immagine ── */}
        <ToolbarBtn
          onClick={handleToolbarImageClick}
          title="Inserisci immagine (JPG, PNG, WebP — max 1 MB dopo compressione)"
          disabled={isUploading}
        >
          {isUploading ? (
            /* Mini spinner mentre carica */
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: "spin 0.8s linear infinite" }} aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            /* Icona immagine */
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
        </ToolbarBtn>

        {/* Input file nascosto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* ── Area scrittura con supporto Drag & Drop ── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: "relative",
          backgroundColor: isDragOver ? "rgba(114,47,55,0.03)" : "transparent",
          transition: "background-color 0.15s ease",
        }}
      >
        {/* Overlay drag visivo */}
        {isDragOver && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              border: "2px dashed #722F37",
              borderRadius: "0 0 8px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              backgroundColor: "rgba(114,47,55,0.06)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#722F37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "0.9rem",
              fontWeight: 600, color: "#722F37",
            }}>
              Rilascia per inserire l&apos;immagine
            </span>
          </div>
        )}

        <EditorContent editor={editor} />

        {/* Toast di upload */}
        <UploadToast visible={isUploading} />
      </div>

      {/* Messaggio di errore upload */}
      {uploadError && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 0.75rem",
            backgroundColor: "#fef2f2",
            borderTop: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "0.78rem",
            fontFamily: "var(--font-sans)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }} aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {uploadError}
        </div>
      )}

      {/* ── Stili editor ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: #94a3b8;
          pointer-events: none; height: 0;
          font-style: italic; font-family: var(--font-serif);
        }
        .tiptap h2 { font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: var(--color-ink); margin: 1.5rem 0 0.6rem; border: none; }
        .tiptap h3 { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600; color: var(--color-ink); margin: 1.25rem 0 0.5rem; }
        .tiptap h4 { font-family: var(--font-serif); font-size: 1rem; font-weight: 600; color: var(--color-ink); margin: 1rem 0 0.4rem; }
        .tiptap p  { margin: 0 0 0.75rem; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap ul { padding-left: 1.5rem; margin: 0 0 0.75rem; list-style: disc; }
        .tiptap hr { border: none; border-top: 1px solid var(--color-border, #e2e8f0); margin: 1.5rem 0; }

        /* ── Immagini: full-width, rounded, nessuna maniglia ── */
        .tiptap img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          object-fit: cover;
          /* Disabilita il resize handle nativo del browser */
          resize: none;
          pointer-events: none;
          user-select: none;
        }
        /* Rimuove qualsiasi widget di selezione/resize di Tiptap */
        .tiptap .ProseMirror-selectednode img,
        .tiptap img.ProseMirror-selectednode {
          outline: 2px solid #722F37;
          outline-offset: 2px;
        }
        .tiptap [data-node-view-wrapper] {
          resize: none !important;
        }

        .editor-wrapper:focus-within {
          border-color: #722F37 !important;
          box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.10);
        }
      `}</style>
    </div>
  );
}
