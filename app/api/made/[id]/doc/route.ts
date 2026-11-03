import { live, redis } from "@/lib/garden/store";
import { MADE } from "@/lib/made/store";

/** A pubmat's layers, for "Remix in the studio". Only kept when its maker allowed remixes. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{8,32}$/.test(id) || !live()) return new Response("Not found", { status: 404 });
  try {
    const [r] = await redis([["GET", MADE.doc(id)]]);
    if (typeof r.result !== "string") return new Response("Not found", { status: 404 });
    return new Response(r.result, { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Unavailable", { status: 502 });
  }
}
