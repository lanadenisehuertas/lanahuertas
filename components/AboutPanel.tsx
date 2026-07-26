"use client";

import { useState } from "react";
import { experience, education, skillGroups, certifications, languages } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import AboutMe from "./AboutMe";
import Sparkle from "./Sparkle";
import { PaperClip } from "./Paper";
import SectionTitle from "./SectionTitle";

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
        <SectionTitle id="about-heading" lead="about" accent="me" />

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="about-heading">
          {active === "about" && <AboutMe />}

          {active === "experience" && (
            <div>
              <h3 className="type-display text-4xl sm:text-5xl">
                Where I&apos;ve worked
              </h3>
              <div className="mt-7 space-y-6">
                {experience.map((e) => {
                  const [from, to] = e.period.split("—").map((x) => x.trim());
                  return (
                  <div
                    key={`${e.role}-${e.org}`}
                    className="grid gap-4"
                    style={{ gridTemplateColumns: "3.6rem 1fr" }}
                  >
                    {/* Year stack — start over end, in colour, as in the reference CVs. */}
                    <div className="year-stack font-display pt-0.5 text-right text-sm font-black">
                      <div className="text-eminence">{from}</div>
                      <div className="text-ink/65">{to}</div>
                    </div>
                    <div className="border-l-2 border-eminence/30 pl-4">
                    <p className="type-display text-[1.25rem] leading-tight">{e.role}</p>
                    <p className="mt-1 text-[15px] font-semibold text-eminence">
                      {e.org}
                      <span className="font-normal text-ink/65"> — {e.place}</span>
                    </p>
                    <ul className="mt-2 space-y-1">
                      {e.points.map((pt) => (
                        <li key={pt} className="text-sm leading-relaxed text-ink/75">
                          {pt}
                        </li>
                      ))}
                    </ul>
                    </div>
                  </div>
                  );
                })}
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
                    <p className="type-display mt-1 text-[1.25rem] leading-tight">{e.school}</p>
                    <p className="mt-0.5 text-[15px] font-semibold text-eminence">{e.detail}</p>
                    {e.coursework && (
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/65">
                        Coursework: {e.coursework}
                      </p>
                    )}
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

              <h4 className="type-pixel mt-10 text-[10px] text-eminence">
                Certifications
              </h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {certifications.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-xl border-2 border-ink/20 bg-lavender/12 p-4 transition-colors duration-200 hover:border-ink/45"
                  >
                    <p className="type-display text-base leading-snug">{c.name}</p>
                    <p className="mt-1 text-xs font-semibold text-eminence">{c.issuer}</p>
                    <p className="mt-0.5 text-xs text-ink/65">{c.date}</p>
                    <p className="mt-2 text-[11px] text-ink/65">{c.detail}</p>
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

              {/*
               * Five stacked groups of loose chips read as one long wall. Each
               * group now sits in its own bordered card in a two-column grid,
               * with a numbered label and a count, so the eye can find a
               * discipline instead of scanning every pill.
               */}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {skillGroups.map((g, i) => (
                  <div
                    key={g.label}
                    className="rounded-xl border-2 border-ink/15 bg-lavender/8 p-5 transition-colors duration-200 hover:border-ink/40"
                  >
                    <div className="flex items-baseline gap-2.5 border-b-2 border-ink/10 pb-3">
                      <span className="type-pixel text-[10px] text-eminence/85 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display flex-1 text-[15px] font-black tracking-tight">
                        {g.label}
                      </p>
                      <span className="type-pixel text-[10px] text-ink/65 tabular-nums">
                        {g.items.length}
                      </span>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {g.items.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-ink/25 bg-maize px-3 py-1 text-xs font-medium transition-colors duration-200 hover:border-ink hover:bg-fawn/40"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Languages shares the card treatment so the grid closes evenly. */}
                <div className="rounded-xl border-2 border-ink/15 bg-lavender/8 p-5">
                  <div className="flex items-baseline gap-2.5 border-b-2 border-ink/10 pb-3">
                    <span className="type-pixel text-[10px] text-eminence/85 tabular-nums">
                      {String(skillGroups.length + 1).padStart(2, "0")}
                    </span>
                    <p className="font-display flex-1 text-[15px] font-black tracking-tight">
                      languages
                    </p>
                    <span className="type-pixel text-[10px] text-ink/65 tabular-nums">
                      {languages.length}
                    </span>
                  </div>

                  <ul className="mt-3.5 space-y-1.5">
                    {languages.map((l) => {
                      const [name, level] = l.replace(")", "").split(" (");
                      return (
                        <li key={l} className="flex items-baseline justify-between gap-3 text-sm">
                          <span className="font-semibold">{name}</span>
                          <span className="text-xs text-ink/65">{level}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Folder>
      </div>
    </section>
  );
}
