"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { id: "branding", label: "branding" },
  { id: "posters", label: "posters" },
  { id: "videos", label: "videos" },
  { id: "code", label: "ui/ux" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];

/** The section each sub-page belongs to, so the nav can mark it. */
const PAGE_SECTION: Record<string, string> = { "/design": "branding", "/videos": "videos", "/ui-ux": "code" };

/** Height of the bar; the tone check samples the page just under its middle. */
const BAR = 64;

/**
 * A slim bar that fades into whatever is under it — no solid band. It slips
 * away while you read downwards and comes back when you scroll up or reach
 * for the top edge. Over a dark artboard (any section marked
 * `data-tone="dark"` under the bar) its words turn light. The section in view
 * is underlined. On phones the links fold into a full-screen sheet.
 */
export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
      // Tone: the toned section that sits under the bar right now.
      let tone = false;
      for (const el of document.querySelectorAll<HTMLElement>("[data-tone]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= BAR / 2 && r.bottom > BAR / 2) {
          tone = el.dataset.tone === "dark";
          break;
        }
      }
      setDark(tone);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.clientY < BAR + 16) setHidden(false);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    // Carousels change tone without a scroll.
    const tones = new MutationObserver(onScroll);
    tones.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-tone"] });

    // The section crossing the middle of the screen is the current one.
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) spy.observe(el);
    });
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "0px 0px -60% 0px" });
    const hero = home ? document.getElementById("top")?.querySelector("section") : null;
    if (hero) top.observe(hero);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      tones.disconnect();
      spy.disconnect();
      top.disconnect();
    };
  }, [home]);

  // The sheet: Esc closes it and hands focus back to the button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const page = PAGE_SECTION[pathname];
  const current = (id: string) => (page === id ? "page" : active === id ? "location" : undefined);

  return (
    <header
      className={`masthead fixed inset-x-0 top-0 z-50 ${hidden && !open ? "is-hidden" : ""} ${dark && !open ? "is-dark" : ""}`}
    >
      <nav aria-label="Main" className="relative mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-10">
        <a href={home ? "#top" : "/"} className="masthead-name flex min-h-[44px] items-center">
          Lana Denise Huertas
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={href(l.id)} aria-current={current(l.id)} className="nav-link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href={href("contact")} className="btn btn-sm hidden sm:inline-flex">
            Hire me <span aria-hidden>↗</span>
          </a>
          <div className="md:hidden">
          <button
            ref={menuBtn}
            type="button"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((o) => !o)}
            className="nav-link"
          >
            {open ? "close" : "menu"}
          </button>
          </div>
        </div>
      </nav>

      {open && (
        <div id="nav-sheet" className="nav-sheet md:hidden">
          <ul>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={href(l.id)} aria-current={current(l.id)} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={href("contact")} onClick={() => setOpen(false)} className="btn mt-10">
            Hire me <span aria-hidden>↗</span>
          </a>
        </div>
      )}
    </header>
  );
}
