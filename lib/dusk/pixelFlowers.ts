import { reducedMotion } from "./fx";

/*
 * The little 3x3 pixel flowers that bloom round a name's letters when you
 * touch them, shared by the hero name, the "Thank you" and the portrait.
 */
export const PXF = [
  [".p.", "pyp", ".p."],
  [".c.", "cyc", ".c."],
  [".v.", "vyv", ".v."],
  ["p.p", ".y.", "p.p"],
];
export const PXC: Record<string, string> = { p: "#ff9ec4", c: "#fdf3e1", v: "#c9b8ff", y: "#ffd98a" };

export const pxSvg = (g: string[]) =>
  `<svg viewBox="0 0 3 3" shape-rendering="crispEdges" aria-hidden="true">${g
    .map((r, y) => [...r].map((c, x) => (PXC[c] ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${PXC[c]}"/>` : "")).join(""))
    .join("")}</svg>`;

/**
 * Bloom a small cluster of pixel flowers round each `.morph-letter` inside
 * `box` as a mouse pointer touches it. Returns a cleanup.
 */
export function bloomLetters(box: HTMLElement) {
  if (reducedMotion()) return () => {};
  const letters = [...box.querySelectorAll<HTMLElement>(".morph-letter")];
  const bloom = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const sp = e.currentTarget as HTMLElement;
    if (sp.querySelectorAll(".dk-pxf").length > 6) return;
    for (let k = 0; k < 6; k++) {
      const f = document.createElement("span"),
        sz = [9, 12, 15][k % 3],
        a = Math.random() * Math.PI * 2,
        rr = 0.35 + Math.random() * 0.3;
      f.className = "dk-pxf";
      f.style.width = f.style.height = `${sz}px`;
      f.style.left = `calc(${50 + Math.cos(a) * rr * 100}% - ${sz / 2}px)`;
      f.style.top = `calc(${55 + Math.sin(a) * rr * 80}% - ${sz / 2}px)`;
      f.style.animationDelay = `${k * 60}ms`;
      f.innerHTML = pxSvg(PXF[(Math.random() * PXF.length) | 0]);
      sp.appendChild(f);
      setTimeout(() => f.remove(), 2600);
    }
  };
  letters.forEach((l) => l.addEventListener("pointerenter", bloom));
  return () => letters.forEach((l) => l.removeEventListener("pointerenter", bloom));
}
