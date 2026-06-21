import { supabase } from "./supabase";

// ── Allowed photo formats ─────────────────────────────────────────────────────
// SVG excluded (can embed JavaScript). HEIC included for iPhone uploads.
export const PHOTO_TYPES: Record<string, string> = {
  "image/png":  "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif":  "gif",
  "image/avif": "avif",
  "image/heic": "heic",
};

// ── Allowed CV/document formats ───────────────────────────────────────────────
// Executables, scripts, archives, HTML all excluded.
export const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "application/vnd.oasis.opendocument.text": "odt",
  "text/plain": "txt",
  "application/rtf": "rtf",
};

const PHOTO_MAX = 5 * 1024 * 1024;  // 5 MB
const CV_MAX    = 10 * 1024 * 1024; // 10 MB

export const PHOTO_ACCEPT = Object.keys(PHOTO_TYPES)
  .concat(Object.values(PHOTO_TYPES).map((e) => `.${e}`))
  .join(",");

export const CV_ACCEPT = Object.keys(CV_TYPES)
  .concat(Object.values(CV_TYPES).map((e) => `.${e}`))
  .join(",");

export function photoExtList() {
  return Object.values(PHOTO_TYPES).map((e) => `.${e}`).join(", ");
}
export function cvExtList() {
  return Object.values(CV_TYPES).map((e) => `.${e}`).join(", ");
}

// Client-side validation — check MIME type AND file extension to catch renamed files
function validateMime(file: File, allowed: Record<string, string>, maxBytes: number): string | null {
  const mime = file.type.toLowerCase();
  const ext  = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!allowed[mime]) {
    return `Not allowed. Accepted: ${Object.values(allowed).map((e) => `.${e}`).join(", ")}`;
  }
  // Double-check extension matches MIME (catches e.g. virus.exe renamed to virus.png)
  if (allowed[mime] !== ext && !(mime === "image/jpeg" && ext === "jpeg")) {
    return `File extension .${ext} doesn't match its content type. Please re-save the file.`;
  }
  if (file.size > maxBytes) {
    return `File too large. Max ${maxBytes / 1024 / 1024} MB.`;
  }
  return null;
}

export async function uploadPhoto(
  userId: string,
  file: File,
): Promise<{ url?: string; error?: string }> {
  const err = validateMime(file, PHOTO_TYPES, PHOTO_MAX);
  if (err) return { error: err };

  const ext  = PHOTO_TYPES[file.type.toLowerCase()];
  const path = `${userId}/avatar.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("user-files")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) return { error: upErr.message };

  const { data } = supabase.storage.from("user-files").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function uploadCV(
  userId: string,
  file: File,
): Promise<{ url?: string; error?: string }> {
  const err = validateMime(file, CV_TYPES, CV_MAX);
  if (err) return { error: err };

  const ext  = CV_TYPES[file.type.toLowerCase()];
  const path = `${userId}/cv.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("user-files")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) return { error: upErr.message };

  const { data } = supabase.storage.from("user-files").getPublicUrl(path);
  return { url: data.publicUrl };
}
