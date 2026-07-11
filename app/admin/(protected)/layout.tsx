import { createClient } from "@/utils/supabase/server";
import AdminNav from "./AdminNav";

/* ─────────────────────────────────────────────────────────────────────────
   ADMIN LAYOUT — Server Component
   Si annida dentro il root layout (app/layout.tsx).
   Recupera il profilo utente lato server e lo passa alla navbar admin.
   ───────────────────────────────────────────────────────────────────────── */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f1f5f9",  /* slate-100 — area operativa */
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Navbar amministrativa */}
      <AdminNav userEmail={user?.email} />

      {/* Contenuto della pagina admin */}
      <main style={{ flex: 1, padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {children}
        </div>
      </main>

      {/* Footer minimale admin */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "0.875rem 1.5rem",
          textAlign: "center",
          fontFamily: "var(--font-sans)",
          fontSize: "0.7rem",
          color: "#94a3b8",
        }}
      >
        Castrimaris · Area Amministrativa — accesso riservato
      </footer>
    </div>
  );
}
