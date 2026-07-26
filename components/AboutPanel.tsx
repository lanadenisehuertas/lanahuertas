"use client";

import { useState } from "react";
import { experience, education, skillGroups, certifications, languages } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import AboutMe from "./AboutMe";
import Sparkle from "./Sparkle";
import { PaperClip } from "./Paper";

const tabs: FolderTab[] = [
  { id: "about", label: "about me", accent: "eminence" },
  { id: "experience", label: "experience", accent: "iris" },
  { id: "education", label: "education & certs", accent: "deep" },
  { id: "skills", label: "skills", accent: "fawn" },
];

export default function AboutPanel() {
  const [active, setActive] = useState("about");

  return (
    <section id="about" className="px-4 pb-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <PaperClip className="-top-3 right-10 sm:right-16" />
        <h2
          id="about-heading"
          className="type-pixel mb-6 pl-2 text-[10px] text-fawn"
        >
          about me
        </h2>

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="about-heading">
          {active === "about" && <AboutMe />}

          {active === "experience" && (
            <div>
              <h3 className="type-display text-4xl sm:text-5xl">
                Where I&apos;ve worked
              </h3>
              <div className="mt-7 space-y-6">
                {experience.map((e) => (
                  <div key={`${e.role}-${e.org}`} className="border-l-2 border-eminence pl-4">
                    <p className="text-xs font-semibold text-eminence">{e.period}</p>
                    <p className="font-display mt-0.5 text-base font-bold">{e.role}</p>
                    <p className="text-sm text-ink/65">
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
              <h3 className="type-display text-4xl sm:text-5xl">
                Where I studied
              </h3>
              <div className="mt-7 space-y-6">
                {education.map((e) => (
                  <div key={e.school} className="border-l-2 border-eminence pl-4">
                    <p className="text-xs font-semibold text-eminence">{e.period}</p>
                    <p className="font-display mt-0.5 text-base font-bold">{e.school}</p>
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

              <h4 className="type-pixel mt-10 text-[9px] text-eminence">
                Certifications
              </h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {certifications.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-xl border-2 border-ink/20 bg-lavender/12 p-4 transition-colors duration-200 hover:border-ink/45"
                  >
                    <p className="font-display text-sm font-black tracking-tight">{c.name}</p>
                    <p className="mt-1 text-xs font-semibold text-eminence">{c.issuer}</p>
                    <p className="mt-0.5 text-xs text-ink/60">{c.date}</p>
                    <p className="mt-2 text-[11px] text-ink/50">{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "skills" && (
            <div>
              <h3 className="type-display text-4xl sm:text-5xl">
                What I work with
              </h3>

              <div className="mt-7 space-y-4">
                {skillGroups.map((g) => (
                  <div key={g.label}>
                    <p className="type-pixel text-[9px] text-eminence">
                      {g.label}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-ink/30 px-3 py-1 text-xs font-medium transition-colors duration-200 hover:border-ink hover:bg-fawn/35"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="type-pixel text-[9px] text-eminence">
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
