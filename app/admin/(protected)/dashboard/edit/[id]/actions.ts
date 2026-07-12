"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/* ─────────────────────────────────────────────────────────────────────────
   TIPI
   ───────────────────────────────────────────────────────────────────────── */
export type EditState = {
  error: string | null;
  fields?: { title: string; author_name: string };
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

/* ── Helper: lookup o creazione autore ── */
async function resolveAuthorId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  author_name: string
): Promise<{ id: string } | { error: string }> {
  const { data: existing, error: lookupErr } = await supabase
    .from("authors")
    .select("id")
    .ilike("name", author_name)
    .maybeSingle();

  if (lookupErr) return { error: `Errore ricerca autore: ${lookupErr.message}` };
  if (existing)  return { id: existing.id };

  const { data: created, error: createErr } = await supabase
    .from("authors")
    .insert({ name: author_name })
    .select("id")
    .single();

  if (createErr || !created) {
    return { error: `Impossibile creare l'autore: ${createErr?.message ?? "errore sconosciuto"}` };
  }
  return { id: created.id };
}

/* ─────────────────────────────────────────────────────────────────────────
   UPDATE — Aggiorna traduzione esistente
   ───────────────────────────────────────────────────────────────────────── */
export async function updateTranslationAction(
  _prevState: EditState,
  formData: FormData
): Promise<EditState> {
  const id                  = (formData.get("id")             as string)?.trim();
  const title               = (formData.get("title")          as string)?.trim();
  const author_name         = (formData.get("author_name")    as string)?.trim();
  const latin_text          = (formData.get("latin_text")     as string) ?? "";
  const italian_translation = (formData.get("italian_text")   as string) ?? "";
  const action              = (formData.get("action")         as string) ?? "draft";
  const image_position      = (formData.get("image_position") as string) ?? "top";
  const image_file          = formData.get("image_file") as File | null;
  const keep_existing_image = formData.get("keep_existing_image") as string | null;

  const fields = { title: title ?? "", author_name: author_name ?? "" };

  if (!id)          return { error: "ID traduzione mancante.", fields };
  if (!title)       return { error: "Il titolo è obbligatorio.", fields };
  if (!author_name) return { error: "Il nome dell'autore è obbligatorio.", fields };

  const is_published = action === "publish";
  const supabase     = await createClient();

  /* Autore: lookup o crea */
  const authorResult = await resolveAuthorId(supabase, author_name);
  if ("error" in authorResult) return { error: authorResult.error, fields };

  /* Upload nuova immagine (se fornita) */
  let image_url: string | null = keep_existing_image ?? null;
  if (image_file && image_file.size > 0) {
    const result = await uploadCoverImage(supabase, image_file);
    if ("error" in result) return { error: result.error, fields };
    image_url = result.url;
  }

  /* Aggiorna */
  const { error: updateErr } = await supabase
    .from("translations")
    .update({
      title,
      author_id: authorResult.id,
      latin_text,
      italian_translation,
      is_published,
      image_url,
      image_position: image_url ? image_position : null,
    })
    .eq("id", id);

  if (updateErr) return { error: `Errore aggiornamento: ${updateErr.message}`, fields };

  redirect("/admin/dashboard");
}

/* ─────────────────────────────────────────────────────────────────────────
   DELETE — Elimina traduzione
   ───────────────────────────────────────────────────────────────────────── */
export async function deleteTranslationAction(
  _prevState: EditState,
  formData: FormData
): Promise<EditState> {
  const id = (formData.get("id") as string)?.trim();
  if (!id) return { error: "ID mancante." };

  const supabase = await createClient();

  const { error } = await supabase
    .from("translations")
    .delete()
    .eq("id", id);

  if (error) return { error: `Errore eliminazione: ${error.message}` };

  redirect("/admin/dashboard");
}
