import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────────────────────
   TIPI — colonne attese dalla tabella `translations`
   ───────────────────────────────────────────────────────────────────────── */
type Translation = {
  id: string;
  title: string;
  is_published: boolean;
  created_at: string;
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  const isDraft = !isPublished;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0.2rem 0.6rem",
        borderRadius: "999px",
        backgroundColor: isDraft ? "#fef3c7" : "#dcfce7",
        color:           isDraft ? "#92400e" : "#166534",
        border:          isDraft ? "1px solid #fde68a" : "1px solid #bbf7d0",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 5, height: 5,
          borderRadius: "50%",
          backgroundColor: isDraft ? "#f59e0b" : "#22c55e",
        }}
      />
      {isDraft ? "Bozza" : "Pubblicato"}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DASHBOARD PAGE — Server Component
   ───────────────────────────────────────────────────────────────────────── */
export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: translations, error } = await supabase
    .from("translations")
    .select("id, title, is_published, created_at")
    .order("created_at", { ascending: false });

  const items: Translation[] = translations ?? [];

  return (
    <>
      {/* ── Intestazione ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.875rem",
              fontWeight: 600,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Le tue Traduzioni
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.83rem",
              color: "#64748b",
              margin: "0.25rem 0 0",
            }}
          >
            {items.length === 0
              ? "Nessuna traduzione ancora presente"
              : `${items.length} traduzion${items.length === 1 ? "e" : "i"} in archivio`}
          </p>
        </div>

        <Link
          href="/admin/dashboard/new"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "#fff",
            backgroundColor: "#722F37",
            border: "none",
            borderRadius: "6px",
            padding: "0.65rem 1.25rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "background-color 0.2s ease",
            whiteSpace: "nowrap",
          }}
          className="new-btn"
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuova Traduzione
        </Link>
      </div>

      {/* ── Errore Supabase (es. tabella non esistente) ── */}
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.83rem",
            color: "#991b1b",
          }}
        >
          <strong>Errore nel caricamento:</strong> {error.message}
        </div>
      )}

      {/* ── Stato vuoto ── */}
      {!error && items.length === 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px dashed #cbd5e1",
            borderRadius: "12px",
            padding: "4rem 2rem",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "3.5rem", height: "3.5rem",
              margin: "0 auto 1.25rem",
              borderRadius: "50%",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              color: "#475569",
              margin: "0 0 0.5rem",
              fontStyle: "italic",
            }}
          >
            Nessuna traduzione presente.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.83rem", color: "#94a3b8", margin: "0 0 1.5rem" }}>
            Inizia a scrivere la tua prima traduzione.
          </p>
          <Link
            href="/admin/dashboard/new"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.83rem",
              fontWeight: 600,
              color: "#722F37",
              textDecoration: "none",
              border: "1px solid #722F37",
              borderRadius: "6px",
              padding: "0.5rem 1.1rem",
              display: "inline-block",
            }}
            className="new-btn-outline"
          >
            + Nuova Traduzione
          </Link>
        </div>
      )}

      {/* ── Tabella traduzioni ── */}
      {!error && items.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {["Titolo", "Stato", "Data"].map((col) => (
                  <th
                    key={col}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#64748b",
                      textAlign: "left",
                      padding: "0.75rem 1.25rem",
                    }}
                  >
                    {col}
                  </th>
                ))}
                <th style={{ padding: "0.75rem 1.25rem", width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {items.map((t, i) => (
                <tr
                  key={t.id}
                  style={{
                    borderBottom: i < items.length - 1 ? "1px solid #f1f5f9" : "none",
                    transition: "background-color 0.15s ease",
                  }}
                  className="table-row"
                >
                  {/* Titolo */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1rem",
                        color: "#0f172a",
                        fontWeight: 500,
                      }}
                    >
                      {t.title || <em style={{ color: "#94a3b8" }}>Senza titolo</em>}
                    </span>
                  </td>

                  {/* Stato */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <StatusBadge isPublished={t.is_published} />
                  </td>

                  {/* Data */}
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.83rem",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(t.created_at)}
                  </td>

                  {/* Azione */}
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <Link
                      href={`/admin/dashboard/edit/${t.id}`}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#722F37",
                        textDecoration: "none",
                        padding: "0.3rem 0.65rem",
                        border: "1px solid #e2c0c3",
                        borderRadius: "4px",
                        display: "inline-block",
                        transition: "all 0.2s ease",
                      }}
                      className="edit-btn"
                    >
                      Modifica
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CSS puro ── */}
      <style>{`
        .new-btn:hover { background-color: #5a2029 !important; }
        .new-btn-outline:hover { background-color: rgba(114,47,55,0.05) !important; }
        .table-row:hover { background-color: #f8fafc !important; }
        .edit-btn:hover {
          background-color: #722F37 !important;
          color: #fff !important;
          border-color: #722F37 !important;
        }
      `}</style>
    </>
  );
}
