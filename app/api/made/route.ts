import { ipKey, live, moderated, redis } from "@/lib/garden/store";
import { MADE, MAX_MADE, checkPubmat, checkSong, listMade } from "@/lib/made/store";
import type { Pubmat, Song } from "@/lib/made/kinds";

/*
 * The gallery of things visitors made (/made-here).
 *   GET  -> { live, moderated, songs, pubmats }: approved pieces, newest first
 *   POST -> save one: { kind: "song", title, name, note, code }
 *                  or { kind: "pubmat", title, name, note, image, w, h, remix, doc }
 *           plus the honeypot `website` and `elapsed` (ms the form was open)
 * New pieces wait for Lana at /api/garden/tend?key=GARDEN_KEY unless GARDEN_MODERATE=0.
 */
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

export async function GET() {
  const empty = { live: live(), moderated: moderated(), songs: [] as Song[], pubmats: [] as Pubmat[] };
  if (!live()) return json(empty);
  try {
    const [songs, pubmats] = await Promise.all([listMade(MADE.list("song")), listMade(MADE.list("pubmat"))]);
    return json(
      { ...empty, songs: songs.map((x) => x.m), pubmats: pubmats.map((x) => x.m) },
      200,
      { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" }
    );
  } catch {
    return json({ ...empty, live: false });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "That didn't come through. Try again?" }, 400);
  }
  const kind = body.kind === "pubmat" ? "pubmat" : body.kind === "song" ? "song" : null;
  if (!kind) return json({ error: "Nothing to save." }, 400);
  const c = kind === "song" ? checkSong(body) : checkPubmat(body);
  if (!c.ok) return c.silent ? json({ ok: true, status: moderated() ? "pending" : "shown" }) : json({ error: c.error, field: c.field }, 400);
  if (!live()) return json({ error: "offline" }, 503);

  try {
    const rk = MADE.rate(await ipKey(req));
    const [n] = await redis([
      ["INCR", rk],
      ["EXPIRE", rk, 3600, "NX"],
    ]);
    if (Number(n.result) > 6) return json({ error: "You've sent six pieces this hour. Come back in a bit and send another." }, 429);

    const piece = "song" in c ? c.song : c.pubmat,
      raw = JSON.stringify(piece),
      mod = moderated();
    const cmds: (string | number)[][] = mod
      ? [["LPUSH", MADE.pending, raw], ["LTRIM", MADE.pending, 0, 199]]
      : [["LPUSH", MADE.list(kind), raw], ["LTRIM", MADE.list(kind), 0, MAX_MADE - 1]];
    if ("pubmat" in c) {
      cmds.unshift(["SET", MADE.img(piece.id), c.image]);
      if (c.doc) cmds.unshift(["SET", MADE.doc(piece.id), c.doc]);
    }
    await redis(cmds);
    return json({ ok: true, status: mod ? "pending" : "shown", piece }, 201);
  } catch {
    return json({ error: "The gallery couldn't be reached. Your piece is saved in this browser; try again in a bit." }, 502);
  }
}
