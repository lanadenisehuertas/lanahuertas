"use client";

import { Suspense, use, type ReactNode } from "react";

/*
 * Lazy hydration for a section below the first screen.
 *
 * The server renders the section in full, so its HTML, images and
 * scroll-driven CSS are all there from the first paint. On the first load in
 * the browser, the section's React code waits: its Suspense boundary stays
 * dehydrated (plain HTML) until the section comes within a screen of the
 * viewport, is touched or focused, or an in-page link lands on it.
 * A phone then only sets up the hero at load, instead of every carousel,
 * form and timeline on the page in one long block.
 *
 * Only the first page load is deferred: a gate waits only when its section
 * is already in the document as server HTML inside the page's
 * [data-defer-root]. On a client navigation to the page the section is not
 * there yet (or belongs to the page being left), so its gate opens at once
 * and nothing ever waits on a section that is not on screen.
 */

type Gate = Promise<void> & { status?: "fulfilled"; value?: void };

const gates = new Map<string, Gate>();

function open(): Gate {
  const p = Promise.resolve() as Gate;
  p.status = "fulfilled"; // read by use(): no suspension at all
  p.value = undefined;
  return p;
}

function gateFor(id: string): Gate {
  const known = gates.get(id);
  if (known) return known;
  const el = document.getElementById(id);
  if (!el?.closest("[data-defer-root]")) {
    const p = open();
    gates.set(id, p);
    return p;
  }

  let release!: () => void;
  const p = new Promise<void>((r) => (release = r)) as Gate;
  gates.set(id, p);

  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    p.status = "fulfilled";
    p.value = undefined;
    io.disconnect();
    el.removeEventListener("pointerdown", go, true);
    el.removeEventListener("focusin", go, true);
    release();
  };

  // a screen ahead, so it is ready before it is reached
  const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && go(), { rootMargin: "100% 0px" });
  io.observe(el);
  el.addEventListener("pointerdown", go, true);
  el.addEventListener("focusin", go, true);

  // in-page links jump straight to a section; open it on arrival too
  window.addEventListener("hashchange", () => window.location.hash === `#${id}` && go());

  // No "open everything when idle" timer: waking every section at once is
  // the same long block this exists to avoid, just later. A section nobody
  // goes near never needs its code.
  return p;
}

function Gate({ id, children }: { id: string; children: ReactNode }) {
  // the server renders straight through; only the browser's first hydration waits
  if (typeof window !== "undefined") use(gateFor(id) as Promise<void>);
  return children;
}

/** Wrap a section; `id` is the id of the section element it renders. */
export default function Defer({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Suspense>
      <Gate id={id}>{children}</Gate>
    </Suspense>
  );
}
