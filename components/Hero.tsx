import { profile, software } from "@/lib/content";
import Sparkle from "./Sparkle";
import { CornerLabel, RegMark, GhostWord } from "./Marginalia";

export default function Hero() {
  return (
    <section className="spec-grid relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28">
      <CornerLabel className="top-5 left-6 sm:left-10">
        Manila, PH
        <br />
        Est. 2019
      </CornerLabel>
      <CornerLabel className="top-5 right-6 text-right sm:right-10">
        Portfolio
        <br />
        Vol. 01
      </CornerLabel>
      <RegMark className="top-1/3 left-[4%]" />
      <RegMark className="right-[6%] bottom-1/4" />

      <GhostWord className="-top-6 -right-8 text-[30vw] sm:-right-12 sm:text-[20vw]">
        design
      </GhostWord>

      <Sparkle size={40} className="absolute top-[20%] right-[16%] text-maize/55 sm:size-12" />
      <Sparkle size={22} className="absolute bottom-[20%] left-[6%] text-fawn/45 sm:size-7" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-fawn/40 bg-deep/60 px-4 py-1.5 backdrop-blur-sm">
          <Sparkle size={11} className="text-maize" />
          <span className="type-pixel text-[9px] text-maize sm:text-[10px]">
            available for freelance
          </span>
        </div>

        {/*
         * Lockup: name set huge, then a statement where the payoff word runs in
         * script and overlaps the line above it — the move from the reference
         * sheets. Poppins Black does the shouting; the script is rationed to
         * exactly one phrase.
         */}
        <p className="type-pixel mb-2 text-[10px] text-fawn sm:text-xs">Hi, I&apos;m</p>

        <h1 className="text-maize">
          <span className="type-display type-fringe block text-[24vw] sm:text-[13rem] sm:leading-[0.8]">
            Lana
          </span>

          <span className="mt-4 block sm:mt-5">
            <span className="type-display block text-[9vw] leading-[0.95] sm:text-6xl lg:text-7xl">
              {profile.heroLead}
            </span>
            <span className="type-script -mt-1 block text-[13vw] leading-[0.9] text-fawn sm:-mt-2 sm:text-8xl lg:text-9xl">
              {profile.heroAccent}
            </span>
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-sm leading-relaxed text-maize/75 sm:text-base">
          {profile.heroSub}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {software.map((s) => (
            <span
              key={s}
              className="font-display flex h-9 w-9 items-center justify-center rounded-lg border border-maize/20 bg-ink text-[11px] font-black text-maize transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-4deg]"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="type-pixel press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-ink bg-fawn px-7 text-[10px] text-ink shadow-hard-sm hover:bg-maize"
          >
            See the work →
          </a>
          <a
            href="#contact"
            className="type-pixel press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-maize/40 px-7 text-[10px] text-maize hover:border-maize"
          >
            Contact me
          </a>
        </div>
      </div>
    </section>
  );
}
