"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   SERVER ACTION — Logout
   Chiama signOut() e reindirizza alla home pubblica.
   ───────────────────────────────────────────────────────────────────────── */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
