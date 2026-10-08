"use client";

import { useState, type CSSProperties } from "react";
import { experience, education, skillGroups, certifications, languages } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import AboutMe from "./AboutMe";
import SectionTitle from "./SectionTitle";
import { Lotus, Sparkle4, Blossom } from "./Botanicals";
import { PixelFlower } from "./Ethereal";

/* The hero's printed sheet, reused as header strips so every tab matches. */

function PanelHead({ lead, accent }: { lead: string; accent: string }) {
  return (
    <div>
      <h3 className="type-display text-4xl text-iris sm:text-6xl">
        {lead} <span className="text-lavender italic">{accent}</span>
      </h3>
    </div>
  );
}

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
        <SectionTitle id="about-heading" index="02" lead="About" accent="me" />

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="about-heading">
          {active === "about" && <AboutMe />}

          {active === "experience" && (
            <div>
              <PanelHead lead="Where I've" accent="worked" />

              {/* Vine timeline: a living stem down the left with a blossom at
                  each role (a pulsing bud for the current one). Each role is a
                  layered sheet: a sky band carrying the dates that dissolves in
                  pixel dither into a near-white page for the reading. */}
              <ol className="relative mt-10 space-y-6 pl-10 sm:pl-14">
                <span
                  aria-hidden
                  className="absolute top-3 bottom-3 left-[15px] w-[3px] rounded-full sm:left-[23px]"
                  style={{ background: "linear-gradient(180deg, #4f9a78, #b9e4cf 50%, #4f9a78)" }}
                />
                {experience.map((e, idx) => {
                  const now = /present/i.test(e.period);
                  return (
                    <li key={`${e.role}-${e.org}`} data-rv style={{ "--d": `${idx * 70}ms` } as CSSProperties} className="group relative">
                      <span aria-hidden className="absolute top-4 -left-10 block h-8 w-8 sm:-left-14 sm:h-9 sm:w-9">
                        {now ? (
                          <Lotus className="bud-now h-full w-full" deep />
                        ) : (
                          <Blossom className="h-full w-full transition-transform duration-700 group-hover:rotate-[72deg]" deep={idx % 2 === 1} />
                        )}
                      </span>
                      <div className="sheet-card">
                        <div className="sheet-band px-5 pt-4 pb-6 sm:px-6">
                          <div className="relative flex flex-wrap items-center gap-2">
                            <span className="type-pixel rounded-full bg-iris px-2.5 py-0.5 text-[10px] text-paper">{e.period}</span>
                            {now && (
                              <span className="type-pixel rounded-full border border-lavender bg-white/60 px-2 py-0.5 text-[10px] text-lavender">
                                ✦ now
                              </span>
                            )}
                            <span className="type-pixel ml-auto text-[10px] text-ink/60">{e.place}</span>
                          </div>
                          <h4 className="type-display relative mt-3 text-2xl leading-tight text-iris sm:text-[1.9rem]">{e.role}</h4>
                          <p className="type-display relative text-lg text-lavender italic">{e.org}</p>
                        </div>
                        <ul className="space-y-2 px-5 py-4 sm:px-6">
                          {e.points.map((pt) => (
                            <li key={pt} className="flex gap-2.5 text-[15px] leading-relaxed text-ink/85 sm:text-[14px]">
                              <PixelFlower className="mt-[0.45em] h-2.5 w-2.5 shrink-0" fill="#a9b6f0" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {active === "education" && (
            <div>
              <PanelHead lead="Where I" accent="studied" />

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {education.map((e, idx) => (
                  <article
                    key={e.school}
                    data-rv
                    style={{ "--d": `${idx * 80}ms` } as CSSProperties}
                    className="sheet-card group relative"
                  >
                    <div className="sheet-band relative h-24 overflow-hidden">
                      <p className="type-display absolute bottom-2 left-5 text-3xl text-iris italic">{e.period}</p>
                      <Lotus className="sway absolute -right-2 -bottom-4 w-20 transition-transform duration-500 group-hover:scale-110" deep={idx === 1} />
                    </div>
                    <div className="p-5 sm:p-6">
                      <h4 className="type-display text-2xl leading-tight text-iris">{e.school}</h4>
                      <p className="mt-1 text-[14px] text-ink/80">{e.detail}</p>
                      {e.coursework && (
                        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                          <span className="type-pixel text-[10px] text-ink/50">Coursework </span>
                          {e.coursework}
                        </p>
                      )}
                      {e.honors.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {e.honors.map((h) => (
                            <li key={h} className="flex items-center gap-1.5 rounded-full bg-blush/45 px-3 py-1 text-[12px] text-ink">
                              <Sparkle4 className="h-3 w-3 text-lavender" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              <p className="type-pixel mt-12 text-[11px] text-ink/55">✦ Certifications</p>
              {/* Tickets: a gradient stub, a perforated tear, the details. */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((c, idx) => (
                  <div
                    key={c.name}
                    data-rv
                    style={{ "--d": `${idx * 70}ms` } as CSSProperties}
                    className="sheet-card group flex"
                  >
                    <div className="sheet-band flex w-14 shrink-0 items-center justify-center">
                      <Sparkle4 className="relative h-6 w-6 text-white transition-transform duration-500 group-hover:rotate-180" />
                    </div>
                    <div className="border-l border-dashed border-ink/20 p-4">
                      <p className="type-display text-lg leading-snug text-iris">{c.name}</p>
                      <p className="mt-1 text-[12px] text-ink/70">{c.issuer}</p>
                      <p className="type-pixel mt-2 text-[10px] text-ink/50">
                        {c.date} · {c.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "skills" && (
            <div>
              <PanelHead lead="What I" accent="work with" />

              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...skillGroups, { label: "languages", items: languages }].map((g, i) => (
                  <div
                    key={g.label}
                    data-rv
                    style={{ "--d": `${(i % 3) * 70}ms` } as CSSProperties}
                    className="sheet-card group"
                  >
                    <div className="sheet-band flex items-end justify-between px-4 pt-6 pb-2">
                      <p className="type-display relative text-2xl text-iris capitalize">{g.label}</p>
                      <p className="type-display relative text-3xl text-white italic">{String(i + 1).padStart(2, "0")}</p>
                    </div>
                    <ul className="flex flex-wrap gap-1.5 p-4">
                      {g.items.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[12px] transition-colors duration-150 hover:border-iris hover:bg-iris hover:text-paper"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Folder>
      </div>
    </section>
  );
}
