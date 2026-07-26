import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";

/**
 * Layout copied from Lana's own reference sheet: a large plain portrait on the
 * left with four app badges straddling its edges, and a right column of
 * headline, script kicker, and justified body copy.
 *
 * The badges sit ON the photo edge here — half on, half off — which is what the
 * reference does. Earlier versions either buried them in the gutter or dumped
 * all six across her face; this is the middle position that actually works.
 *
 * Only four badges float. Six was too many for the frame, and the remaining
 * two are named in the body copy anyway.
 */
const FLOATERS = [
  { i: 0, size: 64, style: { top: "18%", right: "-12%" }, dur: "7s", delay: "0s" }, // Ps
  { i: 2, size: 58, style: { top: "38%", left: "-14%" }, dur: "9s", delay: "-2s" }, // Pr
  { i: 1, size: 56, style: { top: "62%", left: "-12%" }, dur: "11s", delay: "-4s" }, // Ai
  { i: 3, size: 60, style: { top: "46%", right: "-14%" }, dur: "8.5s", delay: "-1s" }, // Ae
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-16">
      {/* Portrait with badges on its edges */}
      <div className="mx-auto w-full max-w-[300px] px-8 sm:max-w-[360px] sm:px-10">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1004}
            height={1100}
            className="block h-auto w-full"
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

      {/* Copy */}
      <div>
        <h3 className="type-display text-[1.7rem] leading-[1.12] sm:text-[2.15rem]">
          {profile.aboutHeadline}
        </h3>

        <p className="type-script mt-3 text-[2rem] leading-[1] text-eminence sm:text-[2.6rem]">
          {profile.aboutKicker}
        </p>

        {/*
         * Justified, as in the reference. Hyphenation is on because justified
         * text without it opens rivers of white space at this measure.
         */}
        <p className="mt-6 text-[15px] leading-[1.75] text-ink/85 sm:text-base [text-align:justify] [hyphens:auto]">
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

        {/* Badges are decorative and hidden on small screens, so the tools are
            named here where a screen reader and a phone will both find them. */}
        <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 sm:hidden">
          {toolkit.map((t) => (
            <span key={t.id} className="type-pixel text-[10px] text-eminence">
              {t.name.replace("Adobe ", "")}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
