import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";

/**
 * Portrait left, tool badges floating around it, copy right.
 *
 * The two columns are height-matched: the grid stretches both, the photo fills
 * its column with object-cover, and the copy is centred against it. That is
 * what stops the panel reading as a small picture stranded beside a tall slab
 * of text.
 *
 * Badges float clear of the subject rather than sitting on her — offsets are in
 * pixels so they can't creep inward when the photo scales.
 */
const FLOATERS = [
  // Offsets straddle the photo edge — roughly three-quarters of each badge hangs
  // outside, the rest overlaps the frame. GUTTER below is set to the largest of
  // these, so the badges never push the page wider than the column.
  { i: 0, size: 64, style: { top: "6%", left: -48 }, dur: "7s", delay: "0s" }, // Ps
  { i: 2, size: 58, style: { top: "38%", left: -44 }, dur: "9s", delay: "-2s" }, // Pr
  { i: 1, size: 54, style: { top: "70%", left: -41 }, dur: "11s", delay: "-4s" }, // Ai
  { i: 3, size: 64, style: { top: "14%", right: -48 }, dur: "8.5s", delay: "-1s" }, // Ae
  { i: 4, size: 58, style: { top: "46%", right: -44 }, dur: "10s", delay: "-3s" }, // Ca
  { i: 5, size: 54, style: { top: "76%", right: -41 }, dur: "9.5s", delay: "-5s" }, // Fg
  // Py and Js are named in the list below rather than floated — eight badges
  // around one portrait is a crowd, and the code tools are not design tools.
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
      {/* Portrait + floating toolkit */}
      {/* Gutters equal the widest badge offset (48px), so the floating toolkit
          straddles the photo edge without pushing the page wider. Every pixel
          here is width the photo does not get, so it is kept tight. */}
      <div className="mx-auto w-full max-w-[300px] px-0 sm:max-w-[660px] sm:px-12">
        <div className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1136}
            height={1200}
            className="block h-full w-full rounded-[4px] object-cover object-top shadow-hard"
          />

          <div aria-hidden className="hidden sm:block">
            {FLOATERS.map((f) => (
              <ToolBadge
                key={toolkit[f.i].id}
                tool={toolkit[f.i]}
                size={f.size}
                className="float-badge absolute z-20 shadow-hard-sm"
                style={{ ...f.style, animationDuration: f.dur, animationDelay: f.delay }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Copy — centred so it reads level with the picture */}
      <div className="flex flex-col justify-center">
        <h3 className="type-display text-[1.8rem] leading-[1.14] sm:text-[2.3rem]">
          {profile.aboutHeadline}
        </h3>

        <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-eminence sm:text-2xl">
          {profile.aboutKicker}
        </p>

        {/*
         * Justified, as in the reference. Hyphenation is on because justified
         * text without it opens rivers of white space at this measure.
         */}
        <p className="mt-7 text-[15px] leading-[1.8] text-ink/85 sm:text-[17px] [text-align:justify] [hyphens:auto]">
          I pride myself on being a highly adaptable creative. I bring a meticulous eye for
          detail and a versatile skill set, backed by{" "}
          <em className="font-semibold text-eminence not-italic">
            7+ years of experience in Adobe Photoshop, 6 years in Premiere Pro,
          </em>{" "}
          and a{" "}
          <em className="font-semibold text-eminence not-italic">
            sharp command of Illustrator
          </em>
          . From crafting high-impact publicity materials and scalable templates to pacing
          dynamic video edits, I handle the creative heavy lifting so you don&apos;t have to.
        </p>

        {/*
         * The floating badges only carry six tools and are decorative, so the
         * full set is named here — at every width, not just mobile. Previously
         * this was sm:hidden, which left Python and JavaScript with nowhere to
         * appear on desktop.
         */}
        <div className="mt-8 border-t border-ink/12 pt-5">
          <p className="type-pixel text-[10px] text-eminence">tools I work in</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {toolkit.map((t) => (
              <span
                key={t.id}
                className="flex items-center gap-2 rounded-[4px] bg-white/40 py-1 pr-3.5 pl-1.5 text-xs font-semibold ring-1 ring-ink/10 transition-colors duration-200 hover:bg-white/80"
              >
                <ToolBadge tool={t} size={24} className="border" />
                {t.name.replace("Adobe ", "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
