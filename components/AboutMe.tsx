import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";

/**
 * Layout copied from Lana's own reference sheet: a large portrait on the left
 * with four big app badges straddling its edges, and a right column of
 * headline, script kicker, and justified body.
 *
 * Sizing is deliberately generous. Earlier passes had the photo at ~280px and
 * the badges at ~56px, which read as decoration; in the reference the photo is
 * the dominant element of the panel and the badges are substantial objects
 * sitting half on, half off its edges.
 */
const FLOATERS = [
  // Ps sits mostly ON the photo, upper right — the one badge that overlaps
  // rather than straddles, exactly as the reference has it.
  { i: 0, size: 96, style: { top: "16%", right: "-14%" }, dur: "7s", delay: "0s" },
  { i: 2, size: 92, style: { top: "36%", left: "-20%" }, dur: "9s", delay: "-2s" }, // Pr
  { i: 3, size: 92, style: { top: "40%", right: "-20%" }, dur: "8.5s", delay: "-1s" }, // Ae
  { i: 1, size: 88, style: { top: "60%", left: "-22%" }, dur: "11s", delay: "-4s" }, // Ai
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-20">
      {/* Portrait with badges on its edges */}
      <div className="mx-auto w-full max-w-[300px] px-0 sm:max-w-[460px] sm:px-[72px]">
        <div className="relative">
          {/* Hairline mount, as in the reference — a cut edge, not a frame. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1004}
            height={1100}
            className="block h-auto w-full ring-2 ring-maize/70"
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
        <h3 className="type-display text-[1.8rem] leading-[1.14] sm:text-[2.3rem]">
          {profile.aboutHeadline}
        </h3>

        <p className="type-script mt-4 text-[2.1rem] leading-[1] text-eminence sm:text-[2.8rem]">
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
