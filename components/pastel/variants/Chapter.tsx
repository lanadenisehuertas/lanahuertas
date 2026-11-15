/*
 * Chapter dividers for the holographic look.
 *
 * Every portfolio in the reference set reads like a slide deck, with a
 * divider before each chapter. The divider is the hero's dawn band reused as
 * a slim chapter header: an outline number, a holographic keyword and the
 * section's facts. All of its styling lives in app/styles/holo.css.
 *
 * It is decoration. The section below it carries the real heading, and the
 * top nav already lists the six chapters, so the divider is hidden from
 * assistive tech and there is no separate contents strip.
 */

export type ChapterInfo = {
  n: number;
  /** the id of the section the chapter opens */
  slug: string;
  /** one keyword for the band; it never repeats the section heading or the nav label */
  word: string;
  /** short facts: counts and tools */
  meta: string[];
};

const pad = (n: number) => String(n).padStart(2, "0");

export function Chapter({ c }: { c: ChapterInfo }) {
  return (
    <div className="chap" aria-hidden>
      <div className="chap-in">
        <span className="chap-n">{pad(c.n)}</span>
        <span className="chap-word">{c.word}</span>
        <span className="chap-meta">
          {c.meta.map((m) => (
            <b key={m}>{m}</b>
          ))}
        </span>
      </div>
      <div className="chap-ribbon" />
    </div>
  );
}
