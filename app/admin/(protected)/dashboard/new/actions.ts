"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
export type SaveState = {
  error: string | null;
  /** Valori del form restituiti in caso di errore, per non perdere l'input */
  fields?: {
    title: string;
    author_name: string;
  };
};

/* ─────────────────────────────────────────────────────────────────────────
   SERVER ACTION — Salva traduzione
   ───────────────────────────────────────────────────────────────────────── */
export async function saveTranslationAction(
  _prevState: SaveState,
  formData: FormData
): Promise<SaveState> {
  const title              = (formData.get("title")              as string)?.trim();
  const author_name        = (formData.get("author_name")        as string)?.trim();
  const latin_text         = (formData.get("latin_text")         as string) ?? "";
  const italian_translation = (formData.get("italian_text")      as string) ?? "";
  const action             = (formData.get("action")             as string) ?? "draft";

  /* Dati da restituire in caso di errore per preservare i campi */
  const fields = { title: title ?? "", author_name: author_name ?? "" };

  if (!title) {
    return { error: "Il titolo è obbligatorio.", fields };
  }
  if (!author_name) {
    return { error: "Il nome dell'autore è obbligatorio.", fields };
  }

  const is_published = action === "publish";
  const supabase     = await createClient();

  /* ── Lookup o creazione autore ── */
  let author_id: string | null = null;

  // Cerca autore con nome esatto (case-insensitive)
  const { data: existingAuthor, error: lookupError } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", author_name)
    .maybeSingle();

  if (lookupError) {
    return { error: `Errore ricerca autore: ${lookupError.message}`, fields };
  }

  if (existingAuthor) {
    // Autore già presente
    author_id = existingAuthor.id;
  } else {
    // Autore non trovato → lo creiamo
    const { data: newAuthor, error: insertAuthorError } = await supabase
      .from("authors")
      .insert({ name: author_name })
      .select("id")
      .single();

    if (insertAuthorError || !newAuthor) {
      return {
        error: `Impossibile creare l'autore: ${insertAuthorError?.message ?? "errore sconosciuto"}`,
        fields,
      };
    }
    author_id = newAuthor.id;
  }

  /* ── Inserimento traduzione ── */
  const { error: insertError } = await supabase.from("translations").insert({
    title,
    author_id,
    latin_text,
    italian_translation,
    is_published,
  });

  if (insertError) {
    return { error: `Errore nel salvataggio: ${insertError.message}`, fields };
  }

  redirect("/admin/dashboard");
}
