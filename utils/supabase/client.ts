import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase per l'uso nei Client Components ("use client").
 * Usa la ANON KEY pubblica — non ha accesso privilegiato.
 *
 * Utilizzo:
 *   const supabase = createClient();
 *   const { data } = await supabase.from("tabella").select();
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
