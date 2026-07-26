import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Tape } from "./Paper";

/**
 * Portrait with the toolkit arranged around it.
 *
 * Badges are positioned against the photo's own box and pushed fully outside
 * it — an earlier version placed them by percentage against a padded wrapper,
 * which put all six on top of the subject (one at 98% coverage).
 *
 * The photo is mounted like a print — thick maize border, slight rotation,
 * taped down. A true die-cut outline needs a transparent PNG; faking it with
 * drop-shadows on a rectangular image just produced a muddy double frame.
 */
const FLOATERS = [
  { i: 0, style: { top: "5%", left: "-15%" }, size: 60, dur: "7s", delay: "0s" }, // Ps
  { i: 1, style: { top: "43%", left: "-17%" }, size: 52, dur: "9s", delay: "-2s" }, // Ai
  { i: 2, style: { top: "76%", left: "-15%" }, size: 44, dur: "11s", delay: "-4s" }, // Pr
  { i: 3, style: { top: "11%", right: "-15%" }, size: 60, dur: "8s", delay: "-1s" }, // Ae
  { i: 4, style: { top: "47%", right: "-17%" }, size: 52, dur: "10s", delay: "-3s" }, // Ca
  { i: 5, style: { top: "79%", right: "-15%" }, size: 44, dur: "9.5s", delay: "-5s" }, // Fg
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
      {/* Portrait + toolkit */}
      <div className="mx-auto w-full max-w-[420px] px-12 sm:px-14">
        <div className="relative rotate-[-1.5deg]">
          <Tape className="-top-4 -left-6 z-30" rotate={-8} width={84} />
          <Tape className="-right-6 -bottom-4 z-30" rotate={-8} width={84} />

          {/* Print mount */}
          <div className="border-[10px] border-maize bg-maize shadow-hard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work/lana-portrait.webp"
              alt="Lana Denise Huertas"
              width={1004}
              height={1100}
              className="block h-auto w-full"
            />
            <p className="type-pixel px-1 pt-2 pb-0.5 text-center text-[10px] text-ink/55">
              Manila · 2026
            </p>
          </div>

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

      {/* Copy */}
      <div>
        <h3 className="type-display text-3xl sm:text-[2.5rem]">{profile.aboutHeadline}</h3>
        <p className="type-script mt-4 text-4xl text-eminence sm:text-5xl">
          {profile.aboutKicker}
        </p>

        <p className="mt-7 text-[15px] leading-relaxed text-ink/80 sm:text-base">
          {profile.aboutBody}
        </p>

        <div className="mt-8">
          <p className="type-pixel text-[10px] text-eminence">tools I work in</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {toolkit.map((t) => (
              <span
                key={t.id}
                className="flex items-center gap-2 rounded-full border-2 border-ink/25 py-1 pr-4 pl-1.5 text-xs font-semibold transition-colors duration-200 hover:border-ink"
              >
                <ToolBadge tool={t} size={26} className="border" />
                {t.name.replace("Adobe ", "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
