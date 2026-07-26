import { profile, software } from "@/lib/content";
import Sparkle from "./Sparkle";
import { CornerLabel, RegMark, GhostWord } from "./Marginalia";

export default function Hero() {
  return (
    <section className="spec-grid relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
      {/* Marginalia */}
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

      <GhostWord className="-top-4 -right-6 text-[26vw] sm:-right-10 sm:text-[18vw]">
        design
      </GhostWord>

      <Sparkle size={44} className="absolute top-[16%] right-[14%] text-maize/60 sm:size-14" />
      <Sparkle size={24} className="absolute bottom-[18%] left-[7%] text-fawn/50 sm:size-8" />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-fawn/40 bg-deep/60 px-4 py-1.5 backdrop-blur-sm">
          <Sparkle size={11} className="text-maize" />
          <span className="type-pixel text-[9px] text-maize sm:text-[10px]">
            available for freelance
          </span>
        </div>

        {/*
         * The lockup: a small pixel line, then the name set huge in Didone
         * italic, then the roles split across roman and italic. Same move as
         * the reference — one elegant word carrying the weight, everything
         * around it mechanical and quiet.
         */}
        <p className="type-pixel mb-3 text-[10px] text-fawn sm:text-xs">Hi, I&apos;m</p>

        <h1 className="text-maize">
          <span className="type-display type-fringe block text-[22vw] sm:text-[15rem] sm:leading-[0.82]">
            Lana
          </span>
          <span className="type-display-roman mt-2 block text-[8.5vw] leading-[1.02] sm:mt-4 sm:text-6xl">
            Graphic designer, video editor,
            <br className="hidden sm:block" />{" "}
            <span className="type-display text-fawn">and problem solver.</span>
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-fawn sm:text-lg">
          {profile.welcome}
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-maize/70 sm:text-base">
          {profile.shortAbout}
        </p>

        {/* Toolkit */}
        <div className="mt-9">
          <p className="type-pixel mb-3 text-[9px] text-maize/45">Tools</p>
          <div className="flex flex-wrap items-center gap-2">
            {software.map((s) => (
              <span
                key={s}
                className="font-display flex h-10 w-10 items-center justify-center rounded-lg border border-maize/20 bg-ink text-xs font-black text-maize transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-4deg]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="type-pixel press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-ink bg-fawn px-7 text-[10px] text-ink shadow-hard-sm hover:bg-maize"
          >
            See the work →
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-maize/40 px-7 text-sm font-semibold text-maize hover:border-maize"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </section>
  );
}
