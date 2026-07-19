"use client";

import { profile, software } from "@/lib/content";
import Folder from "./Folder";
import Sparkle from "./Sparkle";

/** Short intro folder, directly under the title area. */
export default function ShortAbout() {
  return (
    <section id="about" className="px-4 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Folder tabs={[{ id: "about", label: "about me", accent: "eminence" }]} active="about">
          <div className="grid gap-8 md:grid-cols-[200px_1fr]">
            <div className="mx-auto w-full max-w-[200px]">
              <div className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-ink bg-fawn text-center text-xs font-semibold text-ink/50 shadow-hard-sm">
                portrait
                <br />
                goes here
              </div>
            </div>

            <div>
              <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
                {profile.shortAbout}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {profile.roles.map((r) => (
                  <span
                    key={r}
                    className="font-display flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold"
                  >
                    <Sparkle size={10} className="text-eminence" />
                    {r}
                  </span>
                ))}
              </div>

              <div className="mt-7">
                <p className="text-[11px] font-bold tracking-[0.18em] text-eminence uppercase">
                  tools I work in
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {software.map((s) => (
                    <span
                      key={s}
                      className="font-display flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-sm font-black text-maize transition duration-200 hover:-translate-y-1 hover:rotate-[-4deg]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Folder>
      </div>
    </section>
  );
}
