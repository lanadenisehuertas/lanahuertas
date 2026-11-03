"use client";

import { MAX_IMAGE_CHARS, addMine, type Made, type Mine } from "./kinds";

/*
 * Sending a piece to the gallery from the browser. When the site has no store
 * (local development, or before Upstash is connected) nothing is POSTed: the
 * piece is kept in this browser and the gallery shows it to its maker.
 */

let liveP: Promise<boolean> | null = null;
export const galleryLive = () =>
  (liveP ??= fetch("/api/made")
    .then((r) => r.json())
    .then((j) => !!j.live)
    .catch(() => false));

export type Sent = { ok: true; status: "pending" | "shown" | "local"; piece: Made } | { ok: false; error: string; field?: string };

export async function sendPiece(body: Record<string, unknown>, local: () => Made, thumb?: string): Promise<Sent> {
  if (!(await galleryLive())) {
    const piece = { ...local(), pending: true };
    addMine({ ...piece, thumb } as Mine);
    return { ok: true, status: "local", piece };
  }
  try {
    const r = await fetch("/api/made", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: j.error || "Something went wrong. Try again?", field: j.field };
    const piece = { ...(j.piece ?? local()), pending: j.status !== "shown" } as Made;
    addMine({ ...piece, thumb } as Mine);
    return { ok: true, status: j.status, piece };
  } catch {
    return { ok: false, error: "The gallery couldn't be reached. Check your connection and try again." };
  }
}

/** A canvas as a JPEG data URL that fits the gallery's limit: lower quality first, then smaller. */
export function packImage(src: HTMLCanvasElement, maxW = 1080): string {
  let w = Math.min(maxW, src.width);
  for (let pass = 0; pass < 6; pass++) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = Math.round((src.height * w) / src.width);
    const x = c.getContext("2d")!;
    x.fillStyle = "#1b1650"; // JPEG has no transparency: the dusk under any clear pixels
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(src, 0, 0, c.width, c.height);
    for (const q of [0.86, 0.76, 0.66]) {
      const url = c.toDataURL("image/jpeg", q);
      if (url.length - 23 <= MAX_IMAGE_CHARS) return url;
    }
    w = Math.round(w * 0.8);
  }
  return src.toDataURL("image/jpeg", 0.5);
}

/** The small copy a maker's browser keeps, so their piece shows while it waits. */
export const thumbOf = (src: HTMLCanvasElement) => packImage(src, 420);

export const localId = () => `local${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
