"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
export type SaveState = {
  error: string | null;
  fields?: {
    title: string;
    author_name: string;
  };
};

/* ── Helper: upload immagine su Supabase Storage ── */
async function uploadCoverImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `cover/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) return { error: `Upload immagine fallito: ${uploadError.message}` };

  const { data } = supabase.storage.from("media").getPublicUrl(filePath);
  return { url: data.publicUrl };
}

/* ─────────────────────────────────────────────────────────────────────────
   SERVER ACTION — Salva nuova traduzione
   ───────────────────────────────────────────────────────────────────────── */
export async function saveTranslationAction(
  _prevState: SaveState,
  formData: FormData
): Promise<SaveState> {
  const title               = (formData.get("title")        as string)?.trim();
  const author_name         = (formData.get("author_name")  as string)?.trim();
  const latin_text          = (formData.get("latin_text")   as string) ?? "";
  const italian_translation = (formData.get("italian_text") as string) ?? "";
  const action              = (formData.get("action")       as string) ?? "draft";
  const image_position      = (formData.get("image_position") as string) ?? "top";
  const image_file          = formData.get("image_file") as File | null;

  const fields = { title: title ?? "", author_name: author_name ?? "" };

  if (!title)       return { error: "Il titolo è obbligatorio.", fields };
  if (!author_name) return { error: "Il nome dell'autore è obbligatorio.", fields };

  const is_published = action === "publish";
  const supabase     = await createClient();

  /* ── Lookup o creazione autore ── */
  let author_id: string | null = null;

  const { data: existingAuthor, error: lookupError } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", author_name)
    .maybeSingle();

  if (lookupError) return { error: `Errore ricerca autore: ${lookupError.message}`, fields };

  if (existingAuthor) {
    author_id = existingAuthor.id;
  } else {
    const { data: newAuthor, error: insertAuthorError } = await supabase
      .from("authors")
      .insert({ name: author_name })
      .select("id")
      .single();

    if (insertAuthorError || !newAuthor) {
      return { error: `Impossibile creare l'autore: ${insertAuthorError?.message ?? "errore sconosciuto"}`, fields };
    }
    author_id = newAuthor.id;
  }

  /* ── Upload immagine (opzionale) ── */
  let image_url: string | null = null;
  if (image_file && image_file.size > 0) {
    const result = await uploadCoverImage(supabase, image_file);
    if ("error" in result) return { error: result.error, fields };
    image_url = result.url;
  }

  /* ── Inserimento traduzione ── */
  const { error: insertError } = await supabase.from("translations").insert({
    title,
    author_id,
    latin_text,
    italian_translation,
    is_published,
    image_url,
    image_position: image_url ? image_position : null,
  });

  if (insertError) return { error: `Errore nel salvataggio: ${insertError.message}`, fields };

  redirect("/admin/dashboard");
}
