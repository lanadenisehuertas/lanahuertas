import type { CSSProperties } from "react";
import { tones, type Tone } from "@/lib/palettes";

/**
 * Each artboard's paper tone ("r g b"), sampled from the middle of its
 * backdrop (public/art/backdrops/<slug>.webp), then pushed lighter (light
 * boards, luminance >= 0.7) or darker (dark boards, <= 0.025) until the
 * spread's text reads at WCAG AA on the 92% wash even over the palette's
 * worst colour. Checked ratios, body text: 9.7 to 15.1; tagline >= 5.1.
 * Re-sample when a backdrop is regenerated.
 */
export const WASH: Record<string, string> = {
  "revival-x": "2 8 26",
  "into-the-code": "14 3 32",
  neostalgia: "253 249 230",
  tabitayo: "24 2 7",
  "rock-of-aces": "242 211 211",
  "battle-of-the-bands": "46 35 34",
  technorun: "230 251 253",
  pacsa: "253 253 239",
  elysium: "65 16 98",
  "techno-week": "253 248 238",
  "code-psyclick": "247 254 254",
  "code-debt-ledger": "247 246 240",
  "code-algebrawl": "249 211 199",
};

/** Text tone over a backdrop's left side (where the copy sits). */
export const toneOf = (slug: string): Tone => tones[slug]?.left ?? "light";

/** The wash colour as a CSS custom property for `.sp-wash` and the mobile copy panel. */
export const washVar = (slug: string): CSSProperties | undefined =>
  WASH[slug] ? ({ "--wash": WASH[slug] } as CSSProperties) : undefined;

export const pad = (n: number) => String(n).padStart(2, "0");
