"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkle4 } from "./Botanicals";

type Screen = { id: string; label: string; caption: string };
type Group = { who: string; screens: Screen[] };

/*
 * Real screens from the PsyClick desktop app, captured from a local run
 * seeded with the app's own simulated demo clients (DEMO-01…18) — no real
 * client data. Files live in public/work/psyclick/app-<id>(-sm).webp.
 */
const GROUPS: Group[] = [
  {
    who: "Clinician",
    screens: [
      { id: "dashboard", label: "Dashboard", caption: "Today at a glance: who needs review first, self-harm answers on top." },
      { id: "clients", label: "Clients", caption: "Every client as a card, flagged by their latest result." },
      { id: "client", label: "Client history", caption: "Scores over time, so change between visits is easy to read." },
      { id: "report", label: "Report", caption: "The decision-support report: overall flag, what to do next, and why." },
      { id: "intake", label: "New session", caption: "Setting up a session: client code, consent, and what happens next." },
    ],
  },
  {
    who: "Client",
    screens: [
      { id: "welcome", label: "Welcome", caption: "The client's view: four short parts, no right or wrong answers." },
      { id: "typing", label: "Typing warm-up", caption: "A typing warm-up that learns the client's normal rhythm." },
      { id: "clicking", label: "Clicking warm-up", caption: "Clicking circles in order to baseline mouse movement." },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.screens);
const STEP_MS = 4800;
const src = (id: string, sm = false) => `/work/psyclick/app-${id}${sm ? "-sm" : ""}.webp`;

/**
 * The PsyClick app in an Aero window. Screens cross-fade on a timer while the
 * window is on screen; hover or focus pauses it, and the tabs underneath jump
 * to any screen. Images load as they are first needed.
 */
export default function AppShowcase() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]));
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only run the timer while the window is actually in view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !paused;

  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go((i + 1) % ALL.length), STEP_MS);
    return () => window.clearTimeout(t);
  });

  function go(n: number) {
    setI(n);
    // Warm the next screen so the fade never waits on the network.
    setSeen((s) => new Set(s).add(n).add((n + 1) % ALL.length));
  }

  const current = ALL[i];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative"
    >
      {/* The window */}
      <div className="tile relative overflow-hidden rounded-[8px] border border-ink/60 bg-paper shadow-[8px_8px_0_var(--color-sky),0_30px_60px_-24px_rgb(81_1_124/0.45)]">
        <div className="titlebar type-pixel flex h-8 items-center gap-1.5 px-3 text-[10px]">
          <span className="closebox" />
          <span className="closebox" style={{ filter: "hue-rotate(60deg)" }} />
          <span className="closebox" style={{ filter: "hue-rotate(140deg)" }} />
          <span className="mx-auto truncate normal-case">PsyClick — {current.label}</span>
          <span className="hidden shrink-0 text-ink/55 sm:inline">demo data</span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#eaf6f5]">
          {ALL.map((s, k) =>
            seen.has(k) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.id}
                src={src(s.id, true)}
                srcSet={`${src(s.id, true)} 960w, ${src(s.id)} 1600w`}
                sizes="(min-width: 1024px) 70vw, 92vw"
                alt={k === i ? `PsyClick — ${s.label}` : ""}
                aria-hidden={k !== i}
                loading={k < 2 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,scale] duration-700 ease-out ${
                  k === i ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
                }`}
              />
            ) : null
          )}
          <Sparkle4 className="spin-slow pointer-events-none absolute right-3 bottom-3 h-5 w-5 text-white drop-shadow" />
        </div>
      </div>

      {/* Caption */}
      <p aria-live="polite" className="type-display mt-5 min-h-[2.5em] text-center text-xl text-ink/80 italic sm:text-2xl">
        {current.caption}
      </p>

      {/* Tabs, grouped by who sees the screen */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {GROUPS.map((g) => (
          <div key={g.who} className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="type-pixel mr-1 text-[10px] text-ink/50">{g.who}</span>
            {g.screens.map((s) => {
              const k = ALL.indexOf(s);
              const on = k === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => go(k)}
                  className={`relative overflow-hidden rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-150 ${
                    on ? "border-iris bg-iris text-paper" : "border-ink/20 bg-white/60 text-ink hover:border-iris"
                  }`}
                >
                  {s.label}
                  {on && running && (
                    <span
                      key={i}
                      aria-hidden
                      className="showcase-progress absolute inset-x-0 bottom-0 h-[2px] bg-blush"
                      style={{ animationDuration: `${STEP_MS}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
