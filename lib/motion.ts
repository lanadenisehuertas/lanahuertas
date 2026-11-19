/*
 * The site's "pause motion" switch. When on, <html> carries data-still and the
 * stylesheets stop the ambient drift, the scroll-linked scenes and the reveal
 * travel. The choice is kept for the browser (localStorage); an inline script
 * in the layout applies it before first paint.
 */
export const STILL_KEY = "lc-still";

const subs = new Set<() => void>();

export const isStill = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-still");

export function setStill(on: boolean) {
  document.documentElement.toggleAttribute("data-still", on);
  try {
    if (on) localStorage.setItem(STILL_KEY, "1");
    else localStorage.removeItem(STILL_KEY);
  } catch {}
  subs.forEach((f) => f());
}

export const onStill = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};
