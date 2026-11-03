import { timingSafeEqual } from "node:crypto";
import { COLORS, KIND_LABEL, type Flower } from "@/lib/garden/flowers";
import { KEY, MAX_FLOWERS, list, live, moderated, redis } from "@/lib/garden/store";
import { MADE, MAX_MADE, listMade } from "@/lib/made/store";
import { imageUrl, songUrl, type Made } from "@/lib/made/kinds";

/*
 * Tending: a small private page for Lana. Open
 *   /api/garden/tend?key=GARDEN_KEY
 * to see everything visitors made: flowers, songs and pubmats waiting to be
 * shown (approve or remove each), and everything already in the garden and
 * the gallery (remove any). The key lives only in the env; without it this 404s.
 */
export const dynamic = "force-dynamic";

const ok = (key: string | null) => {
  const want = process.env.GARDEN_KEY;
  if (!want || !key || key.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(key), Buffer.from(want));
};
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const date = (t: number) => new Date(t).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });
const html = (body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Tend the garden</title>
<style>
body{margin:0;padding:24px 16px 60px;font:16px/1.5 system-ui,sans-serif;background:#2a2878;color:#fdf3e1}main{max-width:880px;margin:0 auto}
h1{font:italic 34px Georgia,serif;margin:0 0 4px}h2{margin:36px 0 10px;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#ffcfe0}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}nav a{padding:6px 14px;border-radius:99px;background:rgb(253 243 225/.1);color:#fdf3e1;text-decoration:none;font-size:14px}
.n0{opacity:.6}ul{padding:0;margin:0}li{display:flex;gap:14px;align-items:center;padding:12px 14px;margin:0 0 8px;border-radius:14px;background:rgb(64 56 158/.7);list-style:none}
li>i{width:14px;height:14px;border-radius:50%;flex:none}li>img{width:72px;height:90px;object-fit:cover;border-radius:6px;flex:none;background:#1b1650}
div{flex:1;min-width:0}b{display:block}small{color:#d8cff5}a{color:#ffcfe0}
form{display:inline}button{min-height:40px;padding:0 16px;border:0;border-radius:99px;font:600 14px system-ui;cursor:pointer}.y{background:#fdf3e1;color:#1b0730}.n{background:none;color:#ffcfe0;text-decoration:underline}p{color:#d8cff5}
.acts{display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end}@media(max-width:560px){li{flex-wrap:wrap}.acts{width:100%;justify-content:flex-start}}
</style></head><body><main>${body}</main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } }
  );

const hidden = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join("");
const acts = (key: string, type: "flower" | "made", id: string, pending: boolean) =>
  `<span class="acts">${pending ? `<form method="post">${hidden({ key, type, id })}<button class="y" name="do" value="approve">${type === "flower" ? "Let it bloom" : "Show it"}</button></form>` : ""}<form method="post">${hidden({ key, type, id, from: pending ? "pending" : "shown" })}<button class="n" name="do" value="remove">Remove</button></form></span>`;

const flowerRow = (f: Flower, key: string, pending: boolean) =>
  `<li><i style="background:${COLORS[f.color] ?? "#fff"}"></i><div><b>${esc(f.name)} · ${KIND_LABEL[f.kind] ?? f.kind}</b>${f.note ? `<span>${esc(f.note)}</span><br>` : ""}<small>${date(f.t)}</small></div>${acts(key, "flower", f.id, pending)}</li>`;

const madeRow = (m: Made, key: string, pending: boolean) =>
  m.kind === "pubmat"
    ? `<li><a href="${imageUrl(m.id)}" target="_blank" rel="noopener"><img src="${imageUrl(m.id)}" alt="" loading="lazy"></a><div><b>${esc(m.title)}</b><span>by ${esc(m.name)}${m.remix ? " · remixable" : ""} · ${m.w}×${m.h}</span><br>${m.note ? `<span>${esc(m.note)}</span><br>` : ""}<small>${date(m.t)} · <a href="${imageUrl(m.id)}" target="_blank" rel="noopener">full size</a></small></div>${acts(key, "made", m.id, pending)}</li>`
    : `<li><i style="background:#ffd98a"></i><div><b>“${esc(m.title)}”</b><span>by ${esc(m.name)} · ${m.code.length / 2} stars</span><br>${m.note ? `<span>${esc(m.note)}</span><br>` : ""}<small>${date(m.t)} · <a href="${esc(songUrl(m))}" target="_blank" rel="noopener">listen in the sky</a></small></div>${acts(key, "made", m.id, pending)}</li>`;

const none = (s: string) => `<p>${s}</p>`;

async function page(key: string, note = "") {
  const [fp, fl, mp, songs, pubmats] = await Promise.all([
    list(KEY.pending, 200),
    list(KEY.flowers, 120),
    listMade(MADE.pending, 200),
    listMade(MADE.list("song"), 120),
    listMade(MADE.list("pubmat"), 120),
  ]);
  const waiting = fp.length + mp.length;
  return html(`<h1>Tend the garden</h1><p>${note || (moderated() ? "New pieces wait here until you show them." : "Moderation is off (GARDEN_MODERATE=0): new pieces show straight away.")}</p>
<nav><a href="#waiting" class="${waiting ? "" : "n0"}">Waiting · ${waiting}</a><a href="#pubmats">Pubmats · ${pubmats.length}</a><a href="#songs">Songs · ${songs.length}</a><a href="#flowers">Flowers · ${fl.length}</a><a href="/made-here" target="_blank" rel="noopener">Open the public gallery ↗</a></nav>
<h2 id="waiting">Waiting · ${waiting}</h2><ul>${mp.map((x) => madeRow(x.m, key, true)).join("")}${fp.map((x) => flowerRow(x.f, key, true)).join("")}</ul>${waiting ? "" : none("Nothing waiting. ✿")}
<h2 id="pubmats">Pubmats in the gallery · ${pubmats.length}</h2><ul>${pubmats.map((x) => madeRow(x.m, key, false)).join("")}</ul>${pubmats.length ? "" : none("No pubmats yet.")}
<h2 id="songs">Songs in the gallery · ${songs.length}</h2><ul>${songs.map((x) => madeRow(x.m, key, false)).join("")}</ul>${songs.length ? "" : none("No songs yet.")}
<h2 id="flowers">Flowers in the garden · ${fl.length}</h2><ul>${fl.map((x) => flowerRow(x.f, key, false)).join("")}</ul>${fl.length ? "" : none("No flowers yet.")}`);
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!ok(key)) return new Response("Not found", { status: 404 });
  if (!live()) return html("<h1>Tend the garden</h1><p>The garden has no store yet: add Upstash for Redis to the Vercel project (KV_REST_API_URL, KV_REST_API_TOKEN), then redeploy.</p>");
  return page(key!);
}

export async function POST(req: Request) {
  const form = await req.formData(),
    key = String(form.get("key") ?? "");
  if (!ok(key) || !live()) return new Response("Not found", { status: 404 });
  const id = String(form.get("id") ?? ""),
    act = String(form.get("do") ?? ""),
    pending = act === "approve" || form.get("from") === "pending";

  if (form.get("type") === "made") {
    const from = pending ? MADE.pending : null;
    const pool = from ? await listMade(from, 200) : [...(await listMade(MADE.list("pubmat"), MAX_MADE)), ...(await listMade(MADE.list("song"), MAX_MADE))];
    const hit = pool.find((x) => x.m.id === id);
    if (!hit) return page(key, "That piece was already tended.");
    const src = from ?? MADE.list(hit.m.kind);
    if (act === "approve") {
      await redis([["LREM", MADE.pending, 1, hit.raw], ["LPUSH", MADE.list(hit.m.kind), hit.raw], ["LTRIM", MADE.list(hit.m.kind), 0, MAX_MADE - 1]]);
      return page(key, `“${esc(hit.m.title)}” by ${esc(hit.m.name)} is in the gallery.`);
    }
    await redis([["LREM", src, 1, hit.raw], ["DEL", MADE.img(hit.m.id)], ["DEL", MADE.doc(hit.m.id)]]);
    return page(key, `Removed “${esc(hit.m.title)}”.`);
  }

  const from = pending ? KEY.pending : KEY.flowers;
  const hit = (await list(from, pending ? 200 : MAX_FLOWERS)).find((x) => x.f.id === id);
  if (!hit) return page(key, "That flower was already tended.");
  if (act === "approve") {
    await redis([["LREM", KEY.pending, 1, hit.raw], ["LPUSH", KEY.flowers, hit.raw], ["LTRIM", KEY.flowers, 0, MAX_FLOWERS - 1]]);
    return page(key, `${esc(hit.f.name)}'s ${KIND_LABEL[hit.f.kind].toLowerCase()} is blooming.`);
  }
  await redis([["LREM", from, 1, hit.raw]]);
  return page(key, `Removed ${esc(hit.f.name)}'s flower.`);
}
