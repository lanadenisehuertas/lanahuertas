/*
 * A song written in the sky: stars on a grid where left to right is time and
 * low to high is pitch, like Chrome Music Lab's Song Maker drawn as a
 * constellation. The eight rows are one octave of the D major scale, do to
 * do (the page's tune, "Loretta", is in D), so it plays like a keyboard.
 *
 * A song travels in the link: `?song=` holds two characters a star (its
 * column in base 32, its row 0-7) and `&title=` its name. No server.
 */
import { noteHz } from "./skyTune";
import { tone } from "./sound";

export const LANES = ["D5", "E5", "F#5", "G5", "A5", "B5", "C#6", "D6"];
export const LANE_LABEL = ["D", "E", "F♯", "G", "A", "B", "C♯", "D"];
export const KEYS = ["a", "s", "d", "f", "g", "h", "j", "k"];
export const STEPS = 32;
export const STEP_MS = 250;
export const MAX_STARS = 64;

export type Star = { c: number; l: number };

const B32 = "0123456789abcdefghijklmnopqrstuv";
export const encode = (s: Star[]) => s.map((x) => B32[x.c] + x.l).join("");
export function decode(code: string | null): Star[] {
  if (!code || !/^([0-9a-v][0-7])+$/.test(code)) return [];
  const out: Star[] = [];
  for (let i = 0; i < code.length && out.length < MAX_STARS; i += 2) out.push({ c: B32.indexOf(code[i]), l: +code[i + 1] });
  return sortStars(out);
}
export const sortStars = (s: Star[]) => [...s].sort((a, b) => a.c - b.c || a.l - b.l);
export const cleanTitle = (t: string | null) => (t ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 40);

export function shareUrl(stars: Star[], title: string) {
  const u = new URL(location.origin + location.pathname);
  u.searchParams.set("song", encode(sortStars(stars)));
  if (title.trim()) u.searchParams.set("title", cleanTitle(title));
  return u.toString();
}

/** one star's chime: the music box of the page's tune, a soft fifth over it */
export function chime(l: number, at = 0) {
  const f = noteHz(LANES[l]);
  tone(f, { type: "sine", vol: 0.07, dur: 1.5, lp: 4200, at });
  tone(f * 1.5, { type: "sine", vol: 0.018, dur: 0.7, lp: 5000, at: at + 0.02 });
}
