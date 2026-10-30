import type { DialogView } from "./Stages";
import { documents } from "./documents";
import { quickQuestions } from "./bcnInfo";
import { photoAlbums } from "./photoAlbums";
import type { PhotoAlbumId } from "./photoAlbums";

type DialogPayload =
  | { type: "content"; view: DialogView; initialQuestion: number; focusSearch: boolean }
  | { type: "photo"; album: PhotoAlbumId; index: number };
export type DialogEntry = DialogPayload & { token: string };
const tracked = new WeakMap<HTMLDialogElement, DialogEntry>();
let sequence = 0;

export function makeDialogEntry(payload: DialogPayload): DialogEntry {
  return { ...payload, token: `bcn-dialog-${Date.now()}-${sequence++}` };
}

export function readDialogEntry(): DialogEntry | undefined {
  const entry = history.state?.bcnOverlay;
  if (!entry || typeof entry.token !== "string" || !entry.token.startsWith("bcn-dialog-")) return;
  if (entry.type === "content" &&
    (entry.view === "index" || entry.view === "registration" || Object.hasOwn(documents, entry.view)) &&
    Number.isInteger(entry.initialQuestion) && entry.initialQuestion >= 0 && entry.initialQuestion < quickQuestions.length &&
    (entry.focusSearch === undefined || typeof entry.focusSearch === "boolean")) return { ...entry, focusSearch: entry.focusSearch !== false };
  if (entry.type === "photo" && Object.hasOwn(photoAlbums, entry.album) && Number.isInteger(entry.index) &&
    entry.index >= 0 && entry.index < photoAlbums[entry.album as PhotoAlbumId].photos.length) return entry;
}

export function trackDialogHistory(dialog: HTMLDialogElement, entry: DialogEntry, restore = false) {
  const existing = tracked.get(dialog);
  const next = existing && dialog.open ? { ...entry, token: existing.token } : entry;
  try {
    if (!restore) {
      const state = { ...history.state, bcnOverlay: next };
      if (existing && dialog.open) history.replaceState(state, "");
      else history.pushState(state, "");
    }
    tracked.set(dialog, next);
  } catch {
    // The dialog remains usable if history writes are restricted.
    tracked.delete(dialog);
  }
}

export function releaseDialogHistory(dialog: HTMLDialogElement): Promise<void> {
  const entry = tracked.get(dialog);
  tracked.delete(dialog);
  // Browser Back already removed the entry; do not go back a second time.
  if (!entry || readDialogEntry()?.token !== entry.token) return Promise.resolve();
  return new Promise((resolve) => {
    const popped = () => { window.removeEventListener("popstate", popped); resolve(); };
    window.addEventListener("popstate", popped);
    try { history.back(); } catch { popped(); }
  });
}
