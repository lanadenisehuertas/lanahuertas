/*
 * What visitors make on the site, besides flowers (lib/garden): pubmats from
 * the studio and songs written in the stars. Shared by the API, the gallery
 * page (/made-here), the studio, the composer and the tend page.
 */

export type Song = {
  id: string;
  kind: "song";
  title: string;
  name: string;
  note: string;
  /** the stars, as lib/dusk/skySong encodes them for ?song= */
  code: string;
  t: number;
  pending?: boolean;
};

export type Pubmat = {
  id: string;
  kind: "pubmat";
  title: string;
  name: string;
  note: string;
  w: number;
  h: number;
  /** the maker let others open their layers in the studio */
  remix: boolean;
  t: number;
  pending?: boolean;
};

export type Made = Song | Pubmat;
export type MadeKind = Made["kind"];

export const MADE_LIMITS = { title: 40, name: 24, note: 140 };
/** the gallery's copy of a pubmat: a JPEG, at most this many base64 characters */
export const MAX_IMAGE_CHARS = 720_000;
/** the layered document kept for remixing */
export const MAX_DOC_CHARS = 160_000;

export const imageUrl = (id: string) => `/api/made/${id}/image`;
export const docUrl = (id: string) => `/api/made/${id}/doc`;
export const pieceUrl = (m: Made) => `/made-here?${m.kind === "song" ? "s" : "p"}=${m.id}#${m.kind === "song" ? "songs" : "pubmats"}`;
export const songUrl = (s: Pick<Song, "code" | "title">) => `/?song=${s.code}${s.title ? `&title=${encodeURIComponent(s.title)}` : ""}`;

/* ---------- what this browser made: kept so a maker sees their piece while it waits ---------- */

const MINE = "made-mine-v1";
/** a pubmat saved here keeps a small thumbnail, so it shows before (and without) the server */
export type Mine = Made & { thumb?: string };

export function readMine(): Mine[] {
  try {
    const v = JSON.parse(localStorage.getItem(MINE) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function addMine(m: Mine) {
  const all = [m, ...readMine().filter((x) => x.id !== m.id)].slice(0, 24);
  // thumbnails are the heavy part: drop the oldest ones' if storage is full
  for (let keep = all.length; keep >= 0; keep--) {
    try {
      localStorage.setItem(MINE, JSON.stringify(all.map((x, i) => (i < keep ? x : { ...x, thumb: undefined }))));
      return;
    } catch {}
  }
}
export function forgetMine(id: string) {
  try {
    localStorage.setItem(MINE, JSON.stringify(readMine().filter((x) => x.id !== id)));
  } catch {}
}

export const when = (t: number) => new Date(t).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
