"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { education, skillGroups, certifications, languages, software, type toolkit } from "@/lib/content";
import AboutMe, { GardenPortrait } from "./AboutMe";
import { Sparkle4 } from "./Botanicals";
import BloomTimeline from "./BloomTimeline";
import { ToolTile, SHORT_NAME } from "./ToolBubbles";

type ToolId = (typeof toolkit)[number]["id"];

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

/** Short items in a wrapped line, each on a small ✦ — scannable, no pills. */
function SparkleItems({ items, label, className = "" }: { items: readonly string[]; label?: string; className?: string }) {
  return (
    <div className={className}>
      {label && <p className="type-pixel mb-1.5 text-[13px] text-ink/75">{label}</p>}
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((it) => (
          <li key={it} className="inline-flex items-center gap-1.5 text-base leading-snug text-ink/85">
            <Sparkle4 className="h-2 w-2 shrink-0 translate-y-[-0.1em] text-eminence" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * About, on the sky with the rest of the page. The arched portrait stands in
 * the garden on the left with the app logos floating round it as bubbles (it
 * stays in view while a long tab scrolls past on desktop); the title, the
 * tabs — plain words, the current one underlined — and each tab's content sit
 * on the right: experience as a blooming stem, the rest in pearl cards.
 */
export default function AboutPanel() {
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
      <div className="mx-auto grid max-w-7xl gap-x-[4%] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:grid-rows-[auto_auto_1fr]">
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
          {active === "about" && <AboutMe />}

          {active === "experience" && (
            <div>
              <PanelHead lead="Where I've" accent="worked" />
              <BloomTimeline />
            </div>
          )}

          {active === "education" && (
            <div>
              <PanelHead lead="Where I" accent="studied" />
              <ul className="mt-7 space-y-4">
                {education.map((e) => (
                  <li key={e.school} className="pearl-card">
                    <p className="type-pixel flex flex-wrap gap-x-2 text-[13px] leading-snug text-ink/75">
                      <span>{e.period}</span>
                      <span aria-hidden>·</span>
                      <span>{e.place}</span>
                    </p>
                    <h4 className="type-display mt-2 text-[1.5rem] leading-[1.1] text-iris">{e.school}</h4>
                    <p className="mt-1.5 text-base leading-snug text-ink/85 sm:text-[17px]">{e.detail}</p>
                    {e.honors.length > 0 && (
                      <SparkleItems label="honors" items={e.honors} className="mt-4" />
                    )}
                    {e.coursework && (
                      <SparkleItems label="coursework" items={e.coursework.split(" · ")} className="mt-3" />
                    )}
                  </li>
                ))}
              </ul>

              <h4 className="type-pixel mt-10 flex items-center gap-2 text-[13px] text-ink/75">
                <Sparkle4 className="h-2.5 w-2.5 text-eminence" />
                certifications
              </h4>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {certifications.map((c) => (
                  <li key={c.name} className="pearl-card pearl-card-sm flex flex-col">
                    <p className="type-pixel text-[13px] text-ink/75">{c.date}</p>
                    <p className="type-display mt-1.5 text-[1.2rem] leading-[1.15] text-iris">{c.name}</p>
                    <p className="mt-auto pt-2 text-base leading-snug text-ink/80">{c.issuer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "skills" && (
            <div>
              <PanelHead lead="What I" accent="work with" />

              <div className="pearl-card mt-7">
                <h4 className="type-pixel text-[13px] text-ink/75">software</h4>
                <ul className="mt-3 grid grid-cols-4 gap-x-2 gap-y-4">
                  {software.map((s) => {
                    const id = s.toLowerCase() as ToolId;
                    return (
                      <li key={s} className="flex flex-col items-center gap-1.5 text-center">
                        <ToolTile id={id} className="h-12 w-12" />
                        <span className="text-[15px] leading-tight text-ink/80">{SHORT_NAME[id]}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <ul className="mt-3 gap-3 sm:columns-2">
                {skillGroups.map((g) => (
                  <li key={g.label} className="pearl-card pearl-card-sm mb-3 break-inside-avoid">
                    <h4 className="type-display text-[1.3rem] leading-tight text-iris first-letter:uppercase">{g.label}</h4>
                    <SparkleItems items={g.items} className="mt-2.5" />
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base text-ink/85 sm:text-[17px]">
                <span className="type-pixel text-[13px] text-ink/75">languages</span>
                {languages.map((l, i) => (
                  <span key={l}>
                    {i > 0 && <span aria-hidden className="mr-3 text-eminence">✦</span>}
                    {l}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
