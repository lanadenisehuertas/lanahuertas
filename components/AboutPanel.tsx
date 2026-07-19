"use client";

import { useState } from "react";
import { experience, education, skillGroups, languages } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import Sparkle from "./Sparkle";

const tabs: FolderTab[] = [
  { id: "experience", label: "experience", accent: "iris" },
  { id: "education", label: "education", accent: "deep" },
  { id: "skills", label: "skills", accent: "fawn" },
];

export default function AboutPanel() {
  const [active, setActive] = useState("experience");

  return (
    <section id="background" className="px-4 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2
          id="background-heading"
          className="font-display mb-6 pl-2 text-xs font-bold tracking-[0.22em] text-fawn uppercase"
        >
          more about me
        </h2>

        <Folder
          tabs={tabs}
          active={active}
          onSelect={setActive}
          labelledBy="background-heading"
        >
          {active === "experience" && (
            <div>
              <h3 className="font-display text-3xl font-black tracking-tighter sm:text-4xl">
                Where I&apos;ve worked
              </h3>
              <div className="mt-6 space-y-6">
                {experience.map((e) => (
                  <div key={`${e.role}-${e.org}`} className="border-l-2 border-eminence pl-4">
                    <p className="text-xs font-semibold text-eminence">{e.period}</p>
                    <p className="font-display text-base font-bold">{e.role}</p>
                    <p className="text-sm text-ink/70">
                      {e.org} — {e.place}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {e.points.map((pt) => (
                        <li key={pt} className="text-sm leading-relaxed text-ink/75">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "education" && (
            <div>
              <h3 className="font-display text-3xl font-black tracking-tighter sm:text-4xl">
                Where I studied
              </h3>
              <div className="mt-6 space-y-6">
                {education.map((e) => (
                  <div key={e.school} className="border-l-2 border-eminence pl-4">
                    <p className="text-xs font-semibold text-eminence">{e.period}</p>
                    <p className="font-display text-base font-bold">{e.school}</p>
                    <p className="text-sm text-ink/70">{e.detail}</p>
                    {e.honors.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {e.honors.map((h) => (
                          <li key={h} className="flex items-center gap-1.5 text-sm text-ink/70">
                            <Sparkle size={11} className="shrink-0 text-eminence" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "skills" && (
            <div>
              <h3 className="font-display text-3xl font-black tracking-tighter sm:text-4xl">
                What I work with
              </h3>

              <div className="mt-6 space-y-4">
                {skillGroups.map((g) => (
                  <div key={g.label}>
                    <p className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                      {g.label}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-ink/30 px-3 py-1 text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-bold tracking-wide text-eminence uppercase">
                  languages
                </p>
                <p className="mt-1 text-sm text-ink/75">{languages.join("  ·  ")}</p>
              </div>
            </div>
          )}
        </Folder>
      </div>
    </section>
  );
}
