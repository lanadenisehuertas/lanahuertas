"use client";

import { useState, type CSSProperties } from "react";
import { experience, education, skillGroups, certifications, languages } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import AboutMe, { type Org } from "./AboutMe";
import SectionTitle from "./SectionTitle";
import { Lotus, Blossom } from "./Botanicals";
import { PixelFlower } from "./Ethereal";

function PanelHead({ lead, accent }: { lead: string; accent: string }) {
  return (
    <h3 className="type-display text-4xl text-iris sm:text-6xl">
      {lead} <span className="text-lavender italic">{accent}</span>
    </h3>
  );
}

const tabs: FolderTab[] = [
  { id: "about", label: "about me", accent: "eminence" },
  { id: "experience", label: "experience", accent: "iris" },
  { id: "education", label: "education & certs", accent: "deep" },
  { id: "skills", label: "skills", accent: "fawn" },
];

/**
 * About, on the sky like everything else — no panels. The tabs are the
 * house tab buttons; each tab is set as a printed page: ruled rows, pixel
 * labels, the garden growing along the timeline.
 */
export default function AboutPanel({ orgs }: { orgs: Org[] }) {
  const [active, setActive] = useState("about");

  return (
    <section id="about" className="px-4 pb-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="about-heading" index="04" lead="About" accent="me" />

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="about-heading">
          {active === "about" && <AboutMe orgs={orgs} />}

          {active === "experience" && (
            <div>
              <PanelHead lead="Where I've" accent="worked" />
              {/* The vine runs down the left with a blossom at each role (a pulsing bud for the current one). */}
              <ol className="relative mt-10 pl-10 sm:pl-14">
                <span
                  aria-hidden
                  className="absolute top-3 bottom-3 left-[15px] w-[3px] rounded-full sm:left-[23px]"
                  style={{ background: "linear-gradient(180deg, #4f9a78, #b9e4cf 50%, #4f9a78)" }}
                />
                {experience.map((e, idx) => {
                  const now = /present/i.test(e.period);
                  return (
                    <li
                      key={`${e.role}-${e.org}`}
                      data-rv
                      style={{ "--d": `${idx * 70}ms` } as CSSProperties}
                      className="group relative grid gap-3 border-t border-ink/12 py-7 first:border-t-0 first:pt-2 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10"
                    >
                      <span aria-hidden className="absolute top-7 -left-10 block h-8 w-8 group-first:top-2 sm:-left-14 sm:h-9 sm:w-9">
                        {now ? (
                          <Lotus className="bud-now h-full w-full" deep />
                        ) : (
                          <Blossom className="h-full w-full transition-transform duration-700 group-hover:rotate-[72deg]" deep={idx % 2 === 1} />
                        )}
                      </span>
                      <div className="space-y-1.5">
                        <p className="idx">{e.period}</p>
                        {now && <p className="type-pixel text-[10px] text-lavender">now</p>}
                        <p className="type-pixel text-[10px] text-ink/55">{e.place}</p>
                      </div>
                      <div>
                        <h4 className="type-display text-2xl leading-tight text-iris sm:text-[1.9rem]">{e.role}</h4>
                        <p className="type-display text-lg text-lavender italic">{e.org}</p>
                        <ul className="mt-3 space-y-2">
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
              <div className="mt-10 grid gap-12 md:grid-cols-2">
                {education.map((e, idx) => (
                  <article key={e.school} data-rv style={{ "--d": `${idx * 80}ms` } as CSSProperties} className="relative border-t border-ink/15 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <p className="type-display text-4xl text-lavender italic">{e.period}</p>
                      <Lotus className="sway w-14 shrink-0" deep={idx === 1} />
                    </div>
                    <h4 className="type-display mt-3 text-2xl leading-tight text-iris">{e.school}</h4>
                    <p className="mt-1 text-[14px] text-ink/80">{e.detail}</p>
                    {e.coursework && (
                      <p className="mt-3 text-[13px] leading-relaxed text-ink/65">
                        <span className="type-pixel text-[10px] text-ink/50">Coursework · </span>
                        {e.coursework}
                      </p>
                    )}
                    {e.honors.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-y-1">
                        {e.honors.map((h) => (
                          <li key={h} className="chip">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>

              <p className="hand mt-14">certifications —</p>
              <ul className="mt-4 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((c, idx) => (
                  <li key={c.name} data-rv style={{ "--d": `${idx * 70}ms` } as CSSProperties} className="border-t border-ink/15 py-4">
                    <p className="type-display text-lg leading-snug text-iris">{c.name}</p>
                    <p className="mt-1 text-[12px] text-ink/70">{c.issuer}</p>
                    <p className="type-pixel mt-2 text-[10px] text-ink/50">
                      {c.date} · {c.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "skills" && (
            <div>
              <PanelHead lead="What I" accent="work with" />
              <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                {[...skillGroups, { label: "languages", items: languages }].map((g, i) => (
                  <div key={g.label} data-rv style={{ "--d": `${(i % 3) * 70}ms` } as CSSProperties} className="border-t border-ink/15 pt-4">
                    <p className="flex items-baseline justify-between">
                      <span className="type-display text-2xl text-iris capitalize">{g.label}</span>
                      <span className="type-pixel text-[10px] text-ink/45">{String(i + 1).padStart(2, "0")}</span>
                    </p>
                    <ul className="mt-3 flex flex-col gap-1">
                      {g.items.map((s) => (
                        <li key={s} className="chip">
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
