import { BLOCK, LINK, clean, newId, redis } from "@/lib/garden/store";
import { decode, encode } from "@/lib/dusk/skySong";
import { MADE_LIMITS, MAX_DOC_CHARS, MAX_IMAGE_CHARS, type Made, type MadeKind, type Pubmat, type Song } from "./kinds";

/*
 * Pubmats and songs, in the same Upstash database as the garden.
 *
 *   made:pending      everything new, waiting for Lana (unless GARDEN_MODERATE=0)
 *   made:song         approved songs, newest first (JSON, as lib/made/kinds)
 *   made:pubmat       approved pubmats, newest first (JSON, without pictures)
 *   made:img:<id>     a pubmat's picture: "<mime>;<base64>"
 *   made:doc:<id>     its layers, when the maker allowed remixes
 *   made:rate:<ip>    six pieces an hour from one address
 */
export const MADE = {
  pending: "made:pending",
  list: (k: MadeKind) => `made:${k}`,
  img: (id: string) => `made:img:${id}`,
  doc: (id: string) => `made:doc:${id}`,
  rate: (ip: string) => `made:rate:${ip}`,
};
export const MAX_MADE = 300;

export const parseMade = (raw: unknown): Made | null => {
  try {
    const m = JSON.parse(String(raw));
    return m && typeof m.id === "string" && (m.kind === "song" || m.kind === "pubmat") ? m : null;
  } catch {
    return null;
  }
};

export async function listMade(key: string, n = MAX_MADE): Promise<{ raw: string; m: Made }[]> {
  const [r] = await redis([["LRANGE", key, 0, n - 1]]);
  return ((r.result as string[]) ?? []).map((raw) => ({ raw, m: parseMade(raw)! })).filter((x) => x.m);
}

/* ---------- checks ---------- */

type Words = { title: string; name: string; note: string };
type Fail = { ok: false; field?: keyof Words | "image"; error: string; silent?: boolean };

function words(body: Record<string, unknown>): { ok: true; w: Words } | Fail {
  if (String(body.website ?? "").trim()) return { ok: false, silent: true, error: "" };
  if (Number(body.elapsed) < 3000) return { ok: false, error: "That was quick. Take a breath and send it again." };
  const w = {
    title: clean(body.title, MADE_LIMITS.title),
    name: clean(body.name, MADE_LIMITS.name),
    note: clean(body.note, MADE_LIMITS.note),
  };
  if (!w.title) return { ok: false, field: "title", error: "Give it a title." };
  if (!w.name) return { ok: false, field: "name", error: "Add your name, so people know who made it." };
  for (const f of ["title", "name", "note"] as const) {
    if (LINK.test(w[f])) return { ok: false, field: f, error: "Links and handles can't go in the gallery. Just words, please." };
    if (BLOCK.test(w[f])) return { ok: false, field: f, error: "Let's keep the gallery kind." };
  }
  return { ok: true, w };
}

export type SongCheck = { ok: true; song: Song } | Fail;
export function checkSong(body: Record<string, unknown>): SongCheck {
  const c = words(body);
  if (!c.ok) return c;
  // re-encode, so only real stars are stored
  const code = encode(decode(String(body.code ?? "")));
  if (code.length < 4) return { ok: false, error: "Put at least two stars in the sky first." };
  return { ok: true, song: { id: newId(), kind: "song", ...c.w, code, t: Date.now() } };
}

export type PubmatCheck = { ok: true; pubmat: Pubmat; image: string; doc: string | null } | Fail;
export function checkPubmat(body: Record<string, unknown>): PubmatCheck {
  const c = words(body);
  if (!c.ok) return c;
  const m = /^data:(image\/(?:jpeg|webp|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image ?? ""));
  if (!m) return { ok: false, field: "image", error: "The picture didn't come through. Try again?" };
  if (m[2].length > MAX_IMAGE_CHARS) return { ok: false, field: "image", error: "That picture is too heavy to hang. Try fewer photos?" };
  const w = Math.round(Number(body.w)),
    h = Math.round(Number(body.h));
  if (!(w >= 200 && w <= 4000 && h >= 200 && h <= 4000)) return { ok: false, error: "That size doesn't look right." };
  const remix = body.remix === true;
  let doc: string | null = null;
  if (remix && typeof body.doc === "string" && body.doc.length <= MAX_DOC_CHARS) {
    try {
      const d = JSON.parse(body.doc);
      // only the site's own art travels in a remix: never a visitor's photo
      if (d && Array.isArray(d.layers))
        doc = JSON.stringify({
          name: clean(d.name, 60) || "Remix.psd",
          w,
          h,
          layers: d.layers.filter((l: { kind?: string; src?: string }) => l && (l.kind !== "image" || (typeof l.src === "string" && /^\/[\w\-./]+$/.test(l.src)))).slice(0, 80),
        });
    } catch {}
  }
  return { ok: true, pubmat: { id: newId(), kind: "pubmat", ...c.w, w, h, remix: !!doc, t: Date.now() }, image: `${m[1]};${m[2]}`, doc };
}
