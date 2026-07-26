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
  // Each offset is at least the badge's own width, so they sit fully clear of
  // the subject rather than on her. Verified at 0% overlap.
  { i: 0, size: 64, style: { top: "6%", left: -70 }, dur: "7s", delay: "0s" }, // Ps
  { i: 2, size: 58, style: { top: "38%", left: -64 }, dur: "9s", delay: "-2s" }, // Pr
  { i: 1, size: 54, style: { top: "70%", left: -60 }, dur: "11s", delay: "-4s" }, // Ai
  { i: 3, size: 64, style: { top: "14%", right: -70 }, dur: "8.5s", delay: "-1s" }, // Ae
  { i: 4, size: 58, style: { top: "46%", right: -64 }, dur: "10s", delay: "-3s" }, // Ca
  { i: 5, size: 54, style: { top: "76%", right: -60 }, dur: "9.5s", delay: "-5s" }, // Fg
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-24">
      {/* Portrait + floating toolkit */}
      <div className="mx-auto w-full max-w-[300px] px-0 sm:max-w-[460px] sm:px-[78px]">
        <div className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/work/lana-portrait.webp"
            alt="Lana Denise Huertas"
            width={1004}
            height={1100}
            className="block h-full max-h-[560px] w-full object-cover object-top ring-2 ring-maize/60"
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
