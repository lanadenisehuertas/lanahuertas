import { profile, software } from "@/lib/content";
import Sparkle from "./Sparkle";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
      <Sparkle
        size={52}
        className="absolute top-[14%] right-[10%] text-maize/70 sm:size-16"
      />
      <Sparkle
        size={26}
        className="absolute bottom-[16%] left-[7%] text-fawn/60 sm:size-9"
      />

      <div className="mx-auto max-w-4xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-fawn/40 bg-deep/60 px-5 py-1.5 backdrop-blur-sm">
          <Sparkle size={12} className="text-maize" />
          <span className="font-display text-xs font-semibold tracking-wide text-maize">
            available for freelance · {profile.location}
          </span>
        </div>

        <h1 className="font-display text-5xl leading-[0.95] font-black tracking-tight text-maize sm:text-7xl lg:text-8xl">
          {profile.title}
          <br />
          <span className="glow-maize text-maize">{profile.titleRole}</span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-fawn sm:text-lg">
          {profile.welcome}
        </p>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-maize/70 sm:text-base">
          {profile.shortAbout}
        </p>

        {/* What I work in — the first thing a client scans for. */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {software.map((s) => (
            <span
              key={s}
              className="font-display flex h-10 w-10 items-center justify-center rounded-lg border border-maize/20 bg-ink text-xs font-black text-maize transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-4deg]"
            >
              {s}
            </span>
          ))}
          <span className="ml-1 text-xs text-maize/50">and more</span>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="font-display press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-ink bg-fawn px-7 text-sm font-bold text-ink shadow-hard-sm hover:bg-maize"
          >
            See the work
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="font-display press flex min-h-[48px] cursor-pointer items-center rounded-full border-2 border-maize/40 px-7 text-sm font-bold text-maize hover:border-maize"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </section>
  );
}
