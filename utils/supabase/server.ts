import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase per l'uso nei Server Components, Route Handlers e
 * Server Actions (App Router).
 *
 * Legge e scrive i cookie di sessione tramite l'API cookies() di Next.js,
 * consentendo il refresh automatico del token.
 *
 * ⚠️  Chiamare sempre in un contesto asincrono (async function).
 *
 * Utilizzo:
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll può fallire nei Server Components (read-only).
            // Gestito dal Middleware per il refresh del token.
          }
        },
      },
    }
  );
}
