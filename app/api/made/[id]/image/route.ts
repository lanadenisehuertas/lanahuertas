import { live, redis } from "@/lib/garden/store";
import { MADE } from "@/lib/made/store";

/** A pubmat's picture, from made:img:<id>. A picture never changes once saved, so it caches for good. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{8,32}$/.test(id) || !live()) return new Response("Not found", { status: 404 });
  try {
    const [r] = await redis([["GET", MADE.img(id)]]);
    const v = typeof r.result === "string" ? r.result : "";
    const cut = v.indexOf(";");
    if (cut < 0) return new Response("Not found", { status: 404 });
    return new Response(Buffer.from(v.slice(cut + 1), "base64"), {
      headers: { "Content-Type": v.slice(0, cut), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Unavailable", { status: 502 });
  }
}
