"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { experience, education, skillGroups, certifications, languages } from "@/lib/content";
import AboutMe, { GardenPortrait, type Org } from "./AboutMe";
import { Sparkle4 } from "./Botanicals";

const TABS = [
  { id: "about", label: "about me" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education & certs" },
  { id: "skills", label: "skills" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PanelHead({ lead, accent }: { lead: string; accent: string }) {
  return (
    <h3 className="type-display text-[1.85rem] leading-[1.1] text-iris sm:text-[2.4rem]">
      {lead} <em className="text-eminence italic">{accent}</em>
    </h3>
  );
}

/** A ✦ bullet list, the site's replacement for pills. */
function Bullets({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((it) => (
        <li key={it} className="flex gap-2.5 text-base leading-relaxed text-ink/85 sm:text-[17px]">
          <Sparkle4 className="mt-[0.5em] h-2.5 w-2.5 shrink-0 text-eminence" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/**
 * About, on the sky with the rest of the page. The portrait stands in the
 * garden on the left (it stays in view while a long tab scrolls past on
 * desktop); the title, the tabs — plain words, the current one underlined —
 * and each tab's content sit on the right as clean ruled rows.
 */
export default function AboutPanel({ orgs }: { orgs: Org[] }) {
  const [active, setActive] = useState<TabId>("about");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  /*
   * Keep the panel you just opened in view: tabs differ a lot in height, so
   * if switching pushes the tab row above the window, pull it back down.
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = stripRef.current?.getBoundingClientRect().top ?? 0;
    if (top >= 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + top - 88, behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  // Arrow keys move along the tabs (roving tabindex, per the ARIA tabs pattern).
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : (i + step + TABS.length) % TABS.length;
    if (!step && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setActive(TABS[to].id);
    tabRefs.current[to]?.focus();
  };

  return (
    <section id="about" aria-labelledby="about-heading" className="overflow-x-clip px-4 pt-24 pb-24 sm:px-8 sm:pt-28">
      {/* Phones read title, portrait, tabs, panel; desktop puts the portrait
          on the left beside all three. */}
      <div className="mx-auto grid max-w-6xl gap-x-[5%] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-rows-[auto_auto_1fr]">
        <h2
          id="about-heading"
          data-perch
          className="type-display text-[clamp(3rem,5vw,5.25rem)] leading-none text-iris lg:col-start-2 lg:row-start-1"
        >
          About <em className="text-lavender italic">me</em>
        </h2>

        <div className="mt-6 lg:sticky lg:top-24 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:self-start">
          <GardenPortrait />
        </div>

        <div ref={stripRef} role="tablist" aria-label="About" className="about-tabs mt-4 lg:col-start-2 lg:row-start-2 lg:mt-6">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className="about-tab"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          className="sheet-in mt-7 min-w-0 text-ink lg:col-start-2 lg:row-start-3"
        >
          {active === "about" && <AboutMe orgs={orgs} />}

          {active === "experience" && (
            <div>
              <PanelHead lead="Where I've" accent="worked" />
              <ol className="mt-7 border-b border-ink/20">
                {experience.map((e) => {
                  const now = /present/i.test(e.period);
                  return (
                    <li
                      key={`${e.role}-${e.org}`}
                      className="grid gap-2 border-t border-ink/20 py-6 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8"
                    >
                      <div className="type-pixel space-y-1 text-[13px] leading-snug text-ink/75">
                        <p>{e.period}</p>
                        <p>{e.place}</p>
                        {now && <p className="text-eminence">✦ now</p>}
                      </div>
                      <div>
                        <h4 className="type-display text-[1.6rem] leading-tight text-iris">{e.role}</h4>
                        <p className="type-display mt-1 text-lg text-eminence italic">{e.org}</p>
                        <Bullets items={e.points} className="mt-3" />
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
              <ol className="mt-7 border-b border-ink/20">
                {education.map((e) => (
                  <li key={e.school} className="grid gap-2 border-t border-ink/20 py-6 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8">
                    <div className="type-pixel space-y-1 text-[13px] leading-snug text-ink/75">
                      <p>{e.period}</p>
                      <p>{e.place}</p>
                    </div>
                    <div>
                      <h4 className="type-display text-[1.6rem] leading-tight text-iris">{e.school}</h4>
                      <p className="mt-2 text-base leading-relaxed text-ink/85 sm:text-[17px]">{e.detail}</p>
                      {e.coursework && (
                        <p className="mt-3 text-base leading-relaxed text-ink/80">
                          <span className="type-pixel text-[13px] text-ink/75">Coursework · </span>
                          {e.coursework}
                        </p>
                      )}
                      {e.honors.length > 0 && <Bullets items={e.honors} className="mt-3" />}
                    </div>
                  </li>
                ))}
              </ol>

              <h4 className="type-pixel mt-12 text-[13px] text-ink/75">certifications</h4>
              <ul className="mt-3 border-b border-ink/20">
                {certifications.map((c) => (
                  <li key={c.name} className="grid gap-2 border-t border-ink/20 py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8">
                    <p className="type-pixel text-[13px] leading-snug text-ink/75">{c.date}</p>
                    <div>
                      <p className="type-display text-[1.35rem] leading-snug text-iris">{c.name}</p>
                      <p className="mt-1 text-base text-ink/85">{c.issuer}</p>
                      <p className="mt-1 text-[15px] text-ink/75">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "skills" && (
            <div>
              <PanelHead lead="What I" accent="work with" />
              <div className="mt-7 grid gap-x-10 sm:grid-cols-2">
                {[...skillGroups, { label: "languages", items: languages }].map((g) => (
                  <div key={g.label} className="border-t border-ink/20 py-5">
                    <h4 className="type-display text-2xl text-iris capitalize">{g.label}</h4>
                    <Bullets items={g.items} className="mt-3" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
