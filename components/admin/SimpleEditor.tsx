"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

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
        padding: "0 0.5rem",
        border: "1px solid",
        borderColor: active ? "#722F37" : "#e2e8f0",
        borderRadius: "4px",
        backgroundColor: active ? "rgba(114,47,55,0.10)" : "transparent",
        color: active ? "#722F37" : "#475569",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: active ? 700 : 400,
        fontFamily: "var(--font-sans)",
        transition: "all 0.15s ease",
        flexShrink: 0,
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
   SIMPLE EDITOR — Solo testo, nessuna immagine
   ───────────────────────────────────────────────────────────────────────── */
export default function SimpleEditor({
  initialContent = "",
  onUpdate,
  placeholder = "Inizia a scrivere…",
  minHeight = "16rem",
}: SimpleEditorProps) {
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
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

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
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        transition: "border-color 0.2s ease",
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
      </div>

      {/* ── Area scrittura ── */}
      <EditorContent editor={editor} />

      {/* ── Stili editor ── */}
      <style>{`
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
        .editor-wrapper:focus-within {
          border-color: #722F37 !important;
          box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.10);
        }
      `}</style>
    </div>
  );
}
