import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import EditTranslationForm from "./EditTranslationForm";

export const metadata: Metadata = {
  title: "Modifica Traduzione",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────────────────────
   EDIT PAGE — Server Component
   Next.js 16: params è una Promise, va await-ata.
   ───────────────────────────────────────────────────────────────────────── */
export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  /* Recupera la traduzione con join all'autore */
  const { data: translation, error } = await supabase
    .from("translations")
    .select("*, authors(name)")
    .eq("id", id)
    .single();

  /* Se non trovata o errore → torna alla dashboard */
  if (error || !translation) {
    redirect("/admin/dashboard");
  }

  /* Estrae il nome autore dalla join */
  const authorName =
    Array.isArray(translation.authors)
      ? (translation.authors[0]?.name ?? "")
      : ((translation.authors as { name: string } | null)?.name ?? "");

  return (
    <>
      {/* ── Intestazione ── */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: "0.75rem", marginBottom: "1.75rem",
      }}>
        <Link href="/admin/dashboard" title="Torna alla dashboard"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "2rem", height: "2rem",
            border: "1px solid #e2e8f0", borderRadius: "6px",
            color: "#64748b", backgroundColor: "#fff", textDecoration: "none",
            flexShrink: 0, transition: "all 0.2s ease",
          }} className="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>

        <div>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "1.875rem",
            fontWeight: 600, color: "#0f172a", margin: 0, letterSpacing: "-0.02em",
          }}>
            Modifica Traduzione
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.8rem",
            color: "#64748b", margin: "0.2rem 0 0",
          }}>
            {translation.title}
          </p>
        </div>
      </div>

      {/* ── Form precompilato (Client Component) ── */}
      <EditTranslationForm
        id={id}
        initialTitle={translation.title ?? ""}
        initialAuthorName={authorName}
        initialLatinText={translation.latin_text ?? ""}
        initialItalianTranslation={translation.italian_translation ?? ""}
      />

      <style>{`
        .back-btn:hover {
          border-color: #94a3b8 !important;
          color: #0f172a !important;
        }
      `}</style>
    </>
  );
}
