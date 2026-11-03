"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { education, skillGroups, certifications, languages } from "@/lib/content";
import AboutMe from "./AboutMe";
import SkyNotes from "./dusk/SkyNotes";
import DuskPortrait from "./dusk/DuskPortrait";
import DuskAboutSky from "./dusk/DuskAboutSky";
import { Sparkle4 } from "./Botanicals";
import BloomTimeline from "./BloomTimeline";

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

/* phones and tablets (below lg): tap a tab to switch parts instead of scrolling through all four */
const PHONE = "(max-width: 1023px)";
const onPhoneChange = (f: () => void) => {
  const mq = matchMedia(PHONE);
  mq.addEventListener("change", f);
  return () => mq.removeEventListener("change", f);
};
const isPhone = () => matchMedia(PHONE).matches;

/**
 * About, on the dusk sky. The portrait stands on the left and stays put on
 * wide screens while the right column scrolls: all four parts (about me,
 * experience, education, skills) follow one another, so reading on walks
 * through every tab. The tab row rides along at the top of the column and
 * marks the part you are in; clicking a tab glides to it. Below lg the
 * column would run to about seven phone screens that way, so there the tabs
 * switch instead: one part shows at a time, and a tap swaps it in place.
 */
export default function AboutPanel() {
  const [active, setActive] = useState<TabId>("about");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLElement>(null);
  const phone = useSyncExternalStore(onPhoneChange, isPhone, () => false);

  // The part whose top has passed 40% of the screen is the current one.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      // Asks the screen, not `phone`: on the first pass after hydration that
      // still holds the server's guess, and on a phone the hidden parts have
      // no box, so they would all read as above the line.
      if (!isPhone()) {
        let cur: TabId = TABS[0].id;
        panels.current.forEach((el, i) => {
          if (el && el.offsetHeight && el.getBoundingClientRect().top < innerHeight * 0.4) cur = TABS[i].id;
        });
        setActive(cur);
      }
      // the frosted band behind the tabs only shows once the row is stuck
      const nav = bar.current;
      if (nav) {
        const stuck = nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 1;
        if (stuck !== nav.hasAttribute("data-stuck")) nav.toggleAttribute("data-stuck", stuck);
      }
    };
    // only while the section is on or near the screen: elsewhere there is nothing to read
    let near = true;
    const host = bar.current?.closest("section");
    const nearIo = new IntersectionObserver(([e]) => (near = e.isIntersecting), { rootMargin: "50% 0px" });
    if (host) nearIo.observe(host);
    const ask = () => {
      if (near && !raf) raf = requestAnimationFrame(read);
    };
    addEventListener("scroll", ask, { passive: true });
    read();
    // each part rises in once as it arrives
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target as HTMLElement).setAttribute("data-in", "")),
      { rootMargin: "0px 0px -12% 0px" }
    );
    panels.current.forEach((el) => el && io.observe(el));
    return () => {
      removeEventListener("scroll", ask);
      cancelAnimationFrame(raf);
      io.disconnect();
      nearIo.disconnect();
    };
  }, [phone]);

  const go = (i: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (phone) {
      // swap the part in place; if you had read down into the last one, bring its top back under the tabs
      setActive(TABS[i].id);
      requestAnimationFrame(() => {
        const el = panels.current[i];
        if (el && el.getBoundingClientRect().top < 0) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: reduced ? "auto" : "smooth" });
      });
      return;
    }
    const el = panels.current[i];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: reduced ? "auto" : "smooth" });
  };

  // Arrow keys move along the tabs.
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : (i + step + TABS.length) % TABS.length;
    if (!step && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    go(to);
    tabRefs.current[to]?.focus();
  };

  return (
    <section id="about" aria-labelledby="about-heading" data-tone="dark" className="dk dk-about dk-sky-about dk-seam-tb relative isolate overflow-x-clip px-4 pt-36 pb-56 sm:px-8 md:pt-[200px] md:pb-[max(290px,calc(16.3vw+60px))]">
      <DuskAboutSky />
      <SkyNotes />
      <div className="relative z-30 mx-auto grid max-w-[1440px] gap-x-[5%] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:pr-[4%]">
        <div className="order-2 mt-10 lg:order-1 lg:mt-0 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center lg:self-start lg:-ml-[2%]">
          <DuskPortrait />
        </div>

        {/* phones: this column dissolves into the grid (display: contents) so
            the portrait can sit between the heading and the tabs */}
        <div className="contents lg:order-2 lg:block lg:min-w-0">
          <h2 id="about-heading" data-perch data-rv="mist" className="relative z-50 order-1 type-display text-[clamp(3rem,5.4vw,5.6rem)] leading-none text-iris">
            About <em className="text-lavender italic">me</em>
          </h2>

          <nav ref={bar} aria-label="About" className="dk-abtabs about-tabs sticky top-16 z-40 order-3 mt-10 lg:top-20 lg:mt-6">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                aria-current={active === t.id ? "true" : undefined}
                aria-controls={`panel-${t.id}`}
                onClick={() => go(i)}
                onKeyDown={(e) => onKey(e, i)}
                className="about-tab"
              >
                {t.label}
              </button>
            ))}
          </nav>

          {TABS.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => {
                panels.current[i] = el;
              }}
              id={`panel-${t.id}`}
              // On phones only the active part shows. CSS hides the rest
              // (dusk.css, .dk-apanel[data-rest]) so the server's HTML is
              // already right on first paint, instead of laying out all four
              // parts and hiding three once React wakes up.
              data-rest={active !== t.id ? "" : undefined}
              aria-label={t.label}
              role="region"
              className="dk-apanel order-3 min-w-0 pt-12 text-ink lg:min-h-[78svh]"
            >
              {t.id === "about" && <AboutMe />}

              {t.id === "experience" && (
            <div>
              <PanelHead lead="Where I've" accent="worked" />
              <BloomTimeline />
            </div>
          )}

              {t.id === "education" && (
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

              {t.id === "skills" && (
            <div>
              <PanelHead lead="What I" accent="work with" />

              {/* The software itself is the constellation round the portrait
                  (a row of stars on phones), so it is not listed again here. */}
              <ul className="mt-7 gap-3 sm:columns-2">
                {skillGroups.map((g) => (
                  <li key={g.label} className="pearl-card pearl-card-sm mb-3 break-inside-avoid">
                    <h4 className="type-display text-[1.3rem] leading-tight text-iris first-letter:uppercase">{g.label}</h4>
                    <SparkleItems items={g.items} className="mt-2.5" />
                  </li>
                ))}
                {/* languages as a card like the rest, not a loose line under them */}
                <li className="pearl-card pearl-card-sm mb-3 break-inside-avoid">
                  <h4 className="type-display text-[1.3rem] leading-tight text-iris">Languages</h4>
                  <SparkleItems items={languages} className="mt-2.5" />
                </li>
              </ul>
            </div>
          )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
