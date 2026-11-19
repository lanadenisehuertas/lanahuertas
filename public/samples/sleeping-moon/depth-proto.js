/* Prototype: a sky with depth. Behind every room the night now has three planes: a dim dithered nebula far away, the
   existing star field in the middle, and a few large near stars. The scroll carries each at its own speed and the
   pointer tilts them by different amounts, so the page sits inside a deep sky rather than on flat black. Quiet mode and
   reduced motion keep the planes still. */
(() => {
  const { $ } = SM;
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setup = () => {
    const sky = $(".sky"), field = sky && $(".field", sky);
    if (!field || $(".neb", sky)) return;
    let seed = 97; const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    // the near stars repeat once below themselves, so the layer can wrap round as it drifts without a seam
    const one = Array.from({ length: 14 }, () => [rnd() * 100, rnd() * 50, 0.45 + rnd() * 0.45]);
    const near = [0, 50].flatMap((o) => one.map(([l, t, a]) => `<b style="left:${l.toFixed(2)}%;top:${(t + o).toFixed(2)}%;opacity:${a.toFixed(2)}"></b>`)).join("");
    field.insertAdjacentHTML("beforebegin", `<i class="neb"></i>`);
    field.insertAdjacentHTML("afterend", `<i class="near">${near}</i>`);
    const neb = $(".neb", sky), nearEl = $(".near", sky);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const place = () => {
      const U = SM.u(), H = innerHeight, sy = scrollY / H;
      // far: barely moves; near: moves most, and drifts up faster than the page as it scrolls
      neb.style.transform = `translate3d(${(-x * 0.8 * U).toFixed(1)}px, ${(-y * 0.6 * U - Math.min(sy * 0.3, 8) * U).toFixed(1)}px, 0)`;
      nearEl.style.transform = `translate3d(${(-x * 4.2 * U).toFixed(1)}px, ${(-y * 3.2 * U - ((sy * 0.35) % 1) * H).toFixed(1)}px, 0)`;
    };
    const ease = () => {
      raf = 0;
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      place();
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(ease);
    };
    if (SM.HOVER) addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || still()) return;
      tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(ease);
    }, { passive: true });
    SM.scrub(() => { if (!still()) place(); });
    place();
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", setup) : setup();
})();
