import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Tape } from "./Paper";

/**
 * Portrait with the toolkit arranged around it.
 *
 * The photo is plain — no frame, no mount, no shadow — taped straight onto the
 * page. Mounts and fake die-cut outlines were both tried and pulled.
 *
 * Badge offsets are in pixels, not percentages: each is pushed out by its own
 * width plus a gap, so none can land on the subject however the photo scales.
 * Percentage offsets put all six on top of her, one at 98% coverage.
 */
const FLOATERS = [
  { i: 0, size: 52, style: { top: "4%", left: -60 }, dur: "7s", delay: "0s" }, // Ps
  { i: 1, size: 46, style: { top: "42%", left: -54 }, dur: "9s", delay: "-2s" }, // Ai
  { i: 2, size: 42, style: { top: "76%", left: -50 }, dur: "11s", delay: "-4s" }, // Pr
  { i: 3, size: 52, style: { top: "10%", right: -60 }, dur: "8s", delay: "-1s" }, // Ae
  { i: 4, size: 46, style: { top: "46%", right: -54 }, dur: "10s", delay: "-3s" }, // Ca
  { i: 5, size: 42, style: { top: "79%", right: -50 }, dur: "9.5s", delay: "-5s" }, // Fg
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
      {/* Portrait + toolkit */}
      <div className="mx-auto w-full max-w-[400px] px-0 sm:px-[68px]">
        <div className="relative">
          <Tape className="-top-4 -left-6 z-30" rotate={-8} width={84} />
          <Tape className="-right-6 -bottom-4 z-30" rotate={-8} width={84} />

          {/* Plain photo — no frame, no mount, no shadow. */}
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
        {/*
         * The kicker runs inline with the headline so it flows straight on from
         * "…stand out." instead of taking its own line. Set at 1.15em because a
         * script reads optically smaller than a sans at the same pixel size.
         */}
        <h3 className="type-display text-3xl sm:text-[2.5rem]">
          {profile.aboutHeadline}{" "}
          <span className="type-script text-[1.15em] leading-[0.9] text-eminence">
            {profile.aboutKicker}
          </span>
        </h3>

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
