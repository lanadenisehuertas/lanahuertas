import type { CSSProperties } from "react";
import { tones, type Tone } from "@/lib/palettes";

/**
 * Each artboard's paper tone ("r g b"), sampled from the middle of its
 * backdrop (public/art/backdrops/<slug>.webp), then pushed lighter (light
 * boards, luminance >= 0.7) or darker (dark boards, <= 0.025) until the
 * spread's text reads at WCAG AA on the 92% wash even over the palette's
 * worst colour. Checked ratios, body text: 9.7 to 15.1; tagline >= 5.1.
 * Re-sample when a backdrop is regenerated.
 *
 * Two departures, so the section stays inside the evening: the darkest boards'
 * washes are lifted from near-black to dusk indigo, and the UI/UX boards all
 * share one dusk wash (their pale backdrops are tinted to match in dusk.css).
 */
export const WASH: Record<string, string> = {
  "revival-x": "24 24 82",
  "into-the-code": "32 20 84",
  neostalgia: "253 249 230",
  tabitayo: "44 16 58",
  "rock-of-aces": "242 211 211",
  "battle-of-the-bands": "54 40 78",
  technorun: "230 251 253",
  pacsa: "253 253 239",
  elysium: "65 16 98",
  "techno-week": "253 248 238",
  "code-psyclick": "40 38 120",
  "code-debt-ledger": "40 38 120",
  "code-algebrawl": "40 38 120",
  "code-bloom": "40 38 120",
};

/** Text tone over a backdrop's left side (where the copy sits). */
export const toneOf = (slug: string): Tone => tones[slug]?.left ?? "light";

/** The wash colour as a CSS custom property for `.sp-wash` and the mobile copy panel. */
export const washVar = (slug: string): CSSProperties | undefined =>
  WASH[slug] ? ({ "--wash": WASH[slug] } as CSSProperties) : undefined;

export const pad = (n: number) => String(n).padStart(2, "0");
