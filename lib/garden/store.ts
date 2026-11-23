import { COLOR_KEYS, KINDS, LIMITS, type Flower } from "./flowers";

/*
 * Where the guestbook garden lives: a Redis list on Upstash (Vercel's
 * Marketplace "Upstash for Redis" sets KV_REST_API_URL / KV_REST_API_TOKEN;
 * a direct Upstash database sets UPSTASH_REDIS_REST_URL / _TOKEN). It talks
 * to Upstash's REST API with fetch, so there is no client library.
 *
 * New flowers wait in `garden:pending` until Lana approves them at
 * /api/garden/tend?key=GARDEN_KEY, unless GARDEN_MODERATE=0. Without the
 * env vars the garden runs "offline": the page keeps each visitor's flower
 * in their own browser.
 */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const live = () => !!(URL_ && TOKEN);
export const moderated = () => process.env.GARDEN_MODERATE !== "0";
export const KEY = { flowers: "garden:flowers", pending: "garden:pending", rate: (ip: string) => `garden:rate:${ip}` };
export const MAX_FLOWERS = 400;

type Reply = { result?: unknown; error?: string };
export async function redis(cmds: (string | number)[][]): Promise<Reply[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store ${res.status}`);
  return res.json();
}

export const parse = (raw: unknown): Flower | null => {
  try {
    const f = JSON.parse(String(raw));
    return f && typeof f.id === "string" ? f : null;
  } catch {
    return null;
  }
};

export async function list(key: string, n = MAX_FLOWERS): Promise<{ raw: string; f: Flower }[]> {
  const [r] = await redis([["LRANGE", key, 0, n - 1]]);
  return ((r.result as string[]) ?? []).map((raw) => ({ raw, f: parse(raw)! })).filter((x) => x.f);
}

/* ---------- checks on what a visitor sends ---------- */

// Words that never get planted. Moderation catches the rest.
export const BLOCK = /\b(f+u+c+k+|sh[i1]t|b[i1]tch|c+u+n+t|n[i1]gg|f[a@]g|sl[u*]t|wh[o0]re|d[i1]ck|p[o0]rn|r[a@]pe|kys|kill\s*yourself|nazi|hitler)/i;
export const LINK = /(https?:|www\.|\.(com|net|org|xyz|ru|io|ly|gg|ph)\b|@[a-z0-9_]{3,}|\b\d{7,}\b)/i;
export const clean = (s: unknown, max: number) =>
  String(s ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export type Check = { ok: true; flower: Flower } | { ok: false; field?: "name" | "note"; error: string; silent?: boolean };

export function check(body: Record<string, unknown>): Check {
  // a bot fills the field people never see; pretend it worked and keep nothing
  if (String(body.website ?? "").trim()) return { ok: false, silent: true, error: "" };
  // nobody writes a name and a note in under three seconds
  if (Number(body.elapsed) < 3000) return { ok: false, error: "That was quick. Take a breath and plant it again." };
  const name = clean(body.name, LIMITS.name),
    note = clean(body.note, LIMITS.note),
    kind = KINDS.find((k) => k === body.kind),
    color = COLOR_KEYS.find((c) => c === body.color);
  if (!name) return { ok: false, field: "name", error: "Add your name, so I know who planted it." };
  if (!kind || !color) return { ok: false, error: "Pick a flower and a colour." };
  if (LINK.test(name) || LINK.test(note)) return { ok: false, field: LINK.test(name) ? "name" : "note", error: "Links and handles can't be planted. Just words, please." };
  if (BLOCK.test(name) || BLOCK.test(note)) return { ok: false, field: BLOCK.test(name) ? "name" : "note", error: "Let's keep the garden kind." };
  return { ok: true, flower: { id: newId(), name, note, kind, color, t: Date.now() } };
}

/** time-ordered and hard to guess: the gallery serves pictures by id */
export const newId = () => {
  const r = new Uint8Array(8);
  crypto.getRandomValues(r);
  return Date.now().toString(36) + [...r].map((b) => (b % 36).toString(36)).join("");
};

/** A salted hash of the visitor's address: enough to rate-limit, never stored raw. */
export async function ipKey(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "anon";
  const data = new TextEncoder().encode(`${process.env.GARDEN_SALT ?? "dusk-garden"}:${ip}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash).slice(0, 10)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
