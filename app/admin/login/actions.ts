"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
export type LoginState = {
  error: string | null;
};

/* ─────────────────────────────────────────────────────────────────────────
   SERVER ACTION — Login
   Riceve prevState (richiesto da useActionState) e il FormData del form.
   In caso di errore restituisce il messaggio al client.
   In caso di successo reindirizza a /admin/dashboard (non ritorna mai).
   ───────────────────────────────────────────────────────────────────────── */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  // Validazione base lato server
  if (!email || !password) {
    return { error: "Compila tutti i campi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Messaggi localizzati — non esponiamo dettagli interni
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Credenziali non valide. Riprova." };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Email non ancora confermata." };
    }
    return { error: "Accesso non riuscito. Riprova tra qualche istante." };
  }

  // Successo: redirect server-side verso la dashboard
  redirect("/admin/dashboard");
}
