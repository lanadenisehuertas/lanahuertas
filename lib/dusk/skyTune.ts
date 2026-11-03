/**
 * The page's tune, played one note per click like keys on a keyboard: each
 * star you put in the sky, each string you pluck on the hero staff and each
 * strum of the bass plays the next note, carried on from section to section.
 *
 * It is "Loretta" (Ginger Root), from the a cappella score in D major: the
 * soprano's intro riff (bars 9-11, at written pitch; "A5+F#5" is a two-note
 * stab), then the lead line of verse 1 and chorus 1 an octave up, so the
 * music-box chime stays bright. Then it starts over.
 */
import { tone } from "./sound";

const RIFF = "F#5 E5 F#5 E5 D5 F#5 E5 F#5 A5+F#5 A5+F#5 A5+F#5 A5+F#5 A5+F#5 F#5 E5 F#5 E5 D5 D5";
// Lo-ret-ta, I see you walking now and then, Lo-ret-ta, I see you coming near
const VERSE = "A4 A5 F#5 F#5 F#5 E5 D5 E5 D5 A4 C5 A4 A5 F#5 F#5 F#5 E5 D5 E5 F#5";
// Why's it oh so hard to turn back and finally whisper, how are we supposed to carry on
const CHORUS = "F#5 E5 D5 D5 A4 A4 F#5 E5 D5 G5 F#5 E5 F#5 B4 D5 D5 F5 F5 A5 A5 D6 D6 B5";

export const SKY_TUNE = `${RIFF} ${VERSE} ${CHORUS}`.split(" ");

const SEMI: Record<string, number> = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
export function noteHz(name: string) {
  const m = name.match(/^([A-G][b#]?)(\d)$/);
  if (!m) return 440;
  return 440 * 2 ** ((SEMI[m[1]] + (Number(m[2]) + 1) * 12 - 69) / 12);
}

let at = 0,
  lastAt = 0;
/** the next note's pitches (one, or two for a stab); the tune starts over after 12 s of quiet */
export function nextSkyNote() {
  const now = performance.now();
  if (now - lastAt > 12000) at = 0;
  lastAt = now;
  const n = SKY_TUNE[at % SKY_TUNE.length];
  at++;
  return n.split("+").map(noteHz);
}

/** play the next note: a music-box chime with a soft fifth over the top voice */
export function playNextNote() {
  nextSkyNote().forEach((f, i) => {
    tone(f, { type: "sine", vol: i ? 0.042 : 0.07, dur: 1.6, lp: 4000 });
    if (!i) tone(f * 1.5, { type: "sine", vol: 0.02, dur: 0.8, lp: 5000, at: 0.02 });
  });
}
