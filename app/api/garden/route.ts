import { SEEDS } from "@/lib/garden/flowers";
import { KEY, MAX_FLOWERS, check, ipKey, list, live, moderated, redis } from "@/lib/garden/store";

/*
 * The guestbook garden.
 *   GET  -> the planted flowers (approved only), newest first
 *   POST -> plant one: { name, note, kind, color, website (honeypot), elapsed }
 * Rate limit: three flowers an hour from one address.
 */
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

export async function GET() {
  if (!live()) return json({ live: false, moderated: moderated(), flowers: SEEDS });
  try {
    const got = (await list(KEY.flowers)).map((x) => x.f);
    // Lana's and Peanut's stay planted at the far end
    const flowers = [...got, ...SEEDS.filter((s) => !got.some((g) => g.id === s.id))];
    return json({ live: true, moderated: moderated(), flowers }, 200, { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" });
  } catch {
    return json({ live: false, moderated: moderated(), flowers: SEEDS });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "That didn't come through. Try again?" }, 400);
  }
  const c = check(body);
  if (!c.ok) return c.silent ? json({ ok: true, status: moderated() ? "pending" : "planted" }) : json({ error: c.error, field: c.field }, 400);
  if (!live()) return json({ error: "offline" }, 503);

  try {
    const rk = KEY.rate(await ipKey(req));
    const [n] = await redis([
      ["INCR", rk],
      ["EXPIRE", rk, 3600, "NX"],
    ]);
    if (Number(n.result) > 3) return json({ error: "You've planted three flowers this hour. Come back later and plant another." }, 429);
    const mod = moderated(),
      raw = JSON.stringify(c.flower);
    await redis(mod ? [["LPUSH", KEY.pending, raw], ["LTRIM", KEY.pending, 0, 199]] : [["LPUSH", KEY.flowers, raw], ["LTRIM", KEY.flowers, 0, MAX_FLOWERS - 1]]);
    return json({ ok: true, status: mod ? "pending" : "planted", flower: c.flower }, 201);
  } catch {
    return json({ error: "The garden couldn't be reached. Your flower is saved here; try again in a bit." }, 502);
  }
}
