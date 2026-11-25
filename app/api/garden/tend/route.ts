import { timingSafeEqual } from "node:crypto";
import { COLORS, type Flower } from "@/lib/garden/flowers";
import { KEY, MAX_FLOWERS, list, live, moderated, redis } from "@/lib/garden/store";

/*
 * Tending the sky: a small private page for Lana. Open
 *   /api/garden/tend?key=GARDEN_KEY
 * to see every star and moon visitors left at the end of the site. The ones waiting (the guestbook is moderated
 * unless GARDEN_MODERATE=0) can be shown one by one or all at once; any shown one can be taken down. The key lives
 * only in the env; without it this page answers 404.
 *
 * The guestbook keeps the garden's words underneath (/api/garden stores flowers); the sky at the end draws each kind
 * as a star or a moon (dawn-proto.js), so this page names them the way visitors saw them.
 */
export const dynamic = "force-dynamic";

const SKY: Record<string, string> = { daisy: "star", bell: "crescent moon", cosmos: "half moon", lotus: "full moon", tulip: "star", heart: "full moon" };

const ok = (key: string | null) => {
  const want = process.env.GARDEN_KEY;
  if (!want || !key || key.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(key), Buffer.from(want));
};
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const date = (t: number) => new Date(t).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });
const html = (body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Tend the sky</title>
<style>
body{margin:0;padding:24px 16px 60px;font:16px/1.5 system-ui,sans-serif;background:#000;color:#d9cfff}main{max-width:760px;margin:0 auto}
h1{font:italic 34px Georgia,serif;margin:0 0 4px;color:#fff1c9}h2{margin:32px 0 10px;font-size:15px;color:#b9a2ff}
ul{padding:0;margin:0}li{display:flex;gap:14px;align-items:center;padding:12px 14px;margin:0 0 8px;border:1px solid rgb(185 162 255/.35);border-radius:10px;list-style:none}
li>i{width:14px;height:14px;border-radius:50%;flex:none}div{flex:1;min-width:0}b{display:block;color:#fff1c9}small{color:#a99bd6}p{color:#a99bd6}
form{display:inline}button{min-height:44px;padding:0 18px;border:0;border-radius:99px;font:600 15px system-ui;cursor:pointer}
.y{background:#fff1c9;color:#000}.n{background:none;color:#d9cfff;text-decoration:underline}.all{margin:4px 0 14px}
.acts{display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end}@media(max-width:560px){li{flex-wrap:wrap}.acts{width:100%;justify-content:flex-start}}
</style></head><body><main>${body}</main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } }
  );

const hidden = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join("");
const what = (f: Flower) => SKY[f.kind] ?? "star";

const row = (f: Flower, key: string, pending: boolean) =>
  `<li><i style="background:${COLORS[f.color] ?? "#fff"}"></i><div><b>${esc(f.name)} · a ${what(f)}</b>${f.note ? `<span>${esc(f.note)}</span><br>` : ""}<small>${date(f.t)}</small></div><span class="acts">${
    pending ? `<form method="post">${hidden({ key, id: f.id })}<button class="y" name="do" value="approve">Show it</button></form>` : ""
  }<form method="post">${hidden({ key, id: f.id, from: pending ? "pending" : "shown" })}<button class="n" name="do" value="remove">Remove</button></form></span></li>`;

async function page(key: string, note = "") {
  const [waiting, shown] = await Promise.all([list(KEY.pending, 200), list(KEY.flowers, MAX_FLOWERS)]);
  const lead = note || (moderated() ? "New stars and moons wait here until you show them." : "Moderation is off (GARDEN_MODERATE=0): new ones show straight away.");
  return html(`<h1>Tend the sky</h1><p>${lead}</p>
<h2>Waiting · ${waiting.length}</h2>${
    waiting.length > 1 ? `<form method="post" class="all">${hidden({ key })}<button class="y" name="do" value="approve-all">Show all ${waiting.length}</button></form>` : ""
  }<ul>${waiting.map((x) => row(x.f, key, true)).join("")}</ul>${waiting.length ? "" : "<p>Nothing waiting.</p>"}
<h2>In the sky · ${shown.length}</h2><ul>${shown.map((x) => row(x.f, key, false)).join("")}</ul>${shown.length ? "" : "<p>No visitors' stars shown yet.</p>"}`);
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!ok(key)) return new Response("Not found", { status: 404 });
  if (!live()) return html("<h1>Tend the sky</h1><p>The guestbook has no store: add Upstash for Redis to the Vercel project (KV_REST_API_URL, KV_REST_API_TOKEN), then redeploy.</p>");
  return page(key!);
}

export async function POST(req: Request) {
  const form = await req.formData(),
    key = String(form.get("key") ?? "");
  if (!ok(key) || !live()) return new Response("Not found", { status: 404 });
  const id = String(form.get("id") ?? ""),
    act = String(form.get("do") ?? "");

  if (act === "approve-all") {
    // oldest first, so the newest ends up on top of the shown list, as it would have if each had been shown on arrival
    const waiting = (await list(KEY.pending, 200)).reverse();
    if (!waiting.length) return page(key, "Nothing was waiting.");
    await redis([...waiting.flatMap((x) => [["LREM", KEY.pending, 1, x.raw], ["LPUSH", KEY.flowers, x.raw]]), ["LTRIM", KEY.flowers, 0, MAX_FLOWERS - 1]]);
    return page(key, `${waiting.length} ${waiting.length === 1 ? "is" : "are"} in the sky now.`);
  }

  const pending = act === "approve" || form.get("from") === "pending";
  const from = pending ? KEY.pending : KEY.flowers;
  const hit = (await list(from, pending ? 200 : MAX_FLOWERS)).find((x) => x.f.id === id);
  if (!hit) return page(key, "That one was already tended.");
  if (act === "approve") {
    await redis([["LREM", KEY.pending, 1, hit.raw], ["LPUSH", KEY.flowers, hit.raw], ["LTRIM", KEY.flowers, 0, MAX_FLOWERS - 1]]);
    return page(key, `${esc(hit.f.name)}'s ${what(hit.f)} is in the sky.`);
  }
  await redis([["LREM", from, 1, hit.raw]]);
  return page(key, `Removed ${esc(hit.f.name)}'s ${what(hit.f)}.`);
}
