import { profile, toolkit } from "@/lib/content";
import ToolBadge from "./ToolBadge";
import { Tape } from "./Paper";

/**
 * Portrait with the toolkit floating around it, mirroring the layout Lana
 * designed herself.
 *
 * Badges are positioned as percentages of the portrait frame so the
 * arrangement survives every breakpoint, and each carries its own float
 * duration so they never drift in lockstep.
 */
const FLOATERS = [
  { i: 0, top: "12%", left: "-9%", size: 78, dur: "7s", delay: "0s" }, // Ps
  { i: 1, top: "52%", left: "-11%", size: 66, dur: "9s", delay: "-2s" }, // Ai
  { i: 2, top: "30%", right: "-10%", size: 72, dur: "8s", delay: "-1s" }, // Pr
  { i: 3, top: "68%", right: "-8%", size: 62, dur: "10s", delay: "-3s" }, // Ae
  { i: 4, top: "86%", left: "16%", size: 54, dur: "11s", delay: "-4s" }, // Ca
  { i: 5, top: "-5%", right: "22%", size: 56, dur: "9.5s", delay: "-5s" }, // Fg
] as const;

export default function AboutMe() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-16">
      {/* Portrait + floating toolkit */}
      <div className="relative mx-auto w-full max-w-[380px] px-10 lg:px-12">
        <div className="relative">
          {/* Plain rectangle — no radius, no shadow. Taped to the page instead,
              matching the flat photo treatment in the reference. */}
          <div className="relative">
            <Tape className="-top-3 -left-5" rotate={-7} width={86} />
            <Tape className="-right-5 -bottom-3" rotate={-7} width={86} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work/lana-portrait.webp"
              alt="Lana Denise Huertas"
              width={1004}
              height={1100}
              className="cutout block h-auto w-full"
            />
            <span className="label-badge type-pixel absolute -bottom-4 left-4 z-20 rotate-[-4deg] text-[8px] text-fawn">
              Manila · 2026
            </span>
          </div>

          {FLOATERS.map((f) => (
            <ToolBadge
              key={toolkit[f.i].id}
              tool={toolkit[f.i]}
              size={f.size}
              className="float-badge absolute shadow-hard-sm"
              style={{
                top: f.top,
                left: "left" in f ? f.left : undefined,
                right: "right" in f ? f.right : undefined,
                animationDuration: f.dur,
                animationDelay: f.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Copy */}
      <div>
        <h3 className="type-display text-3xl sm:text-4xl">{profile.aboutHeadline}</h3>
        <p className="type-script mt-3 text-4xl text-eminence sm:text-5xl">
          {profile.aboutKicker}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-ink/80 sm:text-base">{profile.aboutBody}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {toolkit.map((t) => (
            <span
              key={t.id}
              className="flex items-center gap-2 rounded-full border-2 border-ink/25 py-1 pr-4 pl-1.5 text-xs font-semibold"
            >
              <ToolBadge tool={t} size={26} className="border" />
              {t.name.replace("Adobe ", "")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
