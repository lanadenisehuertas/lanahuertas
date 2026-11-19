"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SoundToggle from "./SoundToggle";
import { brands, posters, videos } from "@/lib/brands";
import { engineeringProjects } from "@/lib/content";

/** The four kinds of work: a homepage section each, and a line of what is in it. */
const WORK = [
  { id: "branding", label: "Branding and pubmats", note: `${brands.length} brands` },
  { id: "posters", label: "Posters", note: `${posters.length} one-offs` },
  { id: "videos", label: "Motion", note: `${videos.length} edits` },
  { id: "code", label: "UI/UX and code", note: `${engineeringProjects.length} products` },
];
const WORK_IDS = WORK.map((w) => w.id);
const SPY = [...WORK_IDS, "about", "contact"];

/** The section each archive page belongs to, so the nav can mark it. */
const PAGE_SECTION: Record<string, string> = { "/design": "branding", "/videos": "videos", "/ui-ux": "code" };

/**
 * The bar: a wordmark, Work (a menu of the four categories), About, Contact
 * and the sound switch. Over the top of a page it sits on the light with no
 * ground of its own; once the page has moved it becomes a dark surface. On
 * phones the links open as a full sheet set in the page's own type, with
 * focus held inside it until it closes.
 */
export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [sheet, setSheet] = useState(false);
  const header = useRef<HTMLElement>(null);
  const workBtn = useRef<HTMLButtonElement>(null);
  const workItem = useRef<HTMLLIElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  // the bar takes its dark surface once the page has moved
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setSolid(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // the section crossing the middle of the screen is the current one
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id === "hero" ? null : e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    [...SPY, "hero"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, [pathname]);

  // the work menu: Esc, a click elsewhere or focus moving on closes it
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      workBtn.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!workItem.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  // the phone sheet: the page behind it holds still, Esc closes it and hands
  // focus back to the button, and Tab stays inside the bar and the sheet
  useEffect(() => {
    if (!sheet) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    // the page behind the sheet is out of reach while it is open, and focus starts inside it
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    header.current?.querySelector<HTMLElement>("#nav-sheet a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSheet(false);
        burger.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...(header.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // a wider window has the full bar: the sheet has nothing left to do
    const mq = window.matchMedia("(min-width: 860px)");
    const onWide = () => mq.matches && setSheet(false);
    mq.addEventListener("change", onWide);
    return () => {
      main?.removeAttribute("inert");
      root.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [sheet]);

  const page = PAGE_SECTION[pathname];
  const current = (id: string) => (page === id ? "page" : active === id ? "location" : undefined);
  const inWork = WORK_IDS.includes(page ?? active ?? "");
  const closeAll = () => {
    setMenu(false);
    setSheet(false);
  };

  return (
    <header ref={header} className="nav" data-solid={solid || sheet || menu ? "" : undefined}>
      <nav aria-label="Main" className="nav-bar">
        <a href={home ? "#top" : "/"} aria-label="Lana Denise Huertas, home" className="nav-mark" onClick={closeAll}>
          <span aria-hidden className="px-mark" />
          <span aria-hidden>
            Lana Denise
          </span>
        </a>

        <ul className="nav-links">
          <li
            ref={workItem}
            className="nav-work"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(false);
            }}
          >
            <button
              ref={workBtn}
              type="button"
              className="nav-link"
              aria-expanded={menu}
              aria-controls="nav-work-menu"
              aria-current={inWork ? "true" : undefined}
              onClick={() => setMenu((m) => !m)}
              data-t="Work"
            >
              <span>Work</span> <span aria-hidden className="nav-caret" />
            </button>
            {menu && (
              <ul id="nav-work-menu" className="nav-menu">
                {WORK.map((w) => (
                  <li key={w.id}>
                    <a href={href(w.id)} aria-current={current(w.id)} onClick={() => setMenu(false)}>
                      <b>{w.label}</b>
                      <span>{w.note}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <a href={href("about")} aria-current={current("about")} className="nav-link" data-t="About">
              <span>About</span>
            </a>
          </li>
          <li>
            <a href={href("contact")} aria-current={current("contact")} className="nav-link" data-t="Contact">
              <span>Contact</span>
            </a>
          </li>
        </ul>

        <div className="nav-tools">
          <SoundToggle />
          <a href={href("contact")} className="btn-ghost btn-sm nav-cta">
            Hire me
          </a>
          <button
            ref={burger}
            type="button"
            className="nav-burger"
            aria-expanded={sheet}
            aria-controls="nav-sheet"
            aria-label={sheet ? "Close the menu" : "Open the menu"}
            onClick={() => setSheet((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </nav>

      {sheet && (
        <div id="nav-sheet" className="nav-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <h2>Work</h2>
          <ul>
            {WORK.map((w, i) => (
              <li key={w.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={href(w.id)} aria-current={current(w.id)} onClick={closeAll}>
                  {w.label} <span>{w.note}</span>
                </a>
              </li>
            ))}
          </ul>
          <h2>Lana</h2>
          <ul>
            {[
              { id: "about", label: "About" },
              { id: "contact", label: "Contact" },
            ].map((l, i) => (
              <li key={l.id} style={{ "--i": WORK.length + i } as React.CSSProperties}>
                <a href={href(l.id)} aria-current={current(l.id)} onClick={closeAll}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={href("contact")} onClick={closeAll} className="btn">
            Hire me
          </a>
        </div>
      )}
    </header>
  );
}
