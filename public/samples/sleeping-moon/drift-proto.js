/* Prototype: everything alive (see drift-proto.css). Three kinds of motion, layered:
   idle life (CSS, always on), the scroll's wind (things lag and lean while the page moves, then settle), and the
   pointer's pull (pictures lean towards it). Other scripts own each element's transform; this only ever writes
   --lx, --ly and --w on the element, which the idle animations read. */
(() => {
  const { $$ } = SM;
  const still = () => SM.quiet();   // only the visitor's own quiet switch stills the page, never the system setting (moon.js)
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* what moves, and how: kind of idle motion, its size, its period, and how deep it sits (deeper lags more).
     The brands and posters rooms keep only the motion their own scroll gives them: the owner found more too busy.
     The year-by-year moons stay level: swaying out of step, the row read as broken.
     The films on the editor's timeline stay still too: the owner wanted only minimal movement there, which their own
     small lift on hover and under the playhead already gives. */
  const KINDS = [
    { sel: ".pic.orn", how: (el) => (/moth/.test(el.querySelector("img")?.src || "") ? "moth" : "lily"), depth: 1.6 },
    { sel: ".t-lily", how: () => "lily", depth: 1.4 },
    { sel: ".t-moth", how: () => "moth", depth: 1.4 },
    { sel: ".door > .pic", how: () => "bob", a: [3, 6], t: [4.2, 6.4], depth: 1 },
    { sel: ".pic.moon", how: () => "breathe", r: [0.8, 0.8], t: [9, 9], depth: 0.5 },
    { sel: ".a-phone", how: () => "bob", a: [4, 6], t: [5, 7], depth: 1 },
    { sel: "#talk .env", how: () => "sway", r: [0.5, 0.7], t: [7, 9], depth: 0.5 },
    { sel: ".vs-star .sp-w", how: () => "moth-lite", a: [1.5, 2.5], t: [5, 9], depth: 0.4 },
  ];
  const range = (r, d) => (r ? r[0] + rnd() * (r[1] - r[0]) : d);
  const items = [];
  /* only what is on screen (or about to be) moves: everything else holds its idle loop paused, which costs nothing,
     and the wind and the pull only visit what is showing */
  const vis = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const it = e.target._dr;
    if (e.isIntersecting) { vis.add(it); e.target.classList.remove("dr-off"); }
    else { vis.delete(it); e.target.classList.add("dr-off"); }
  }), { rootMargin: "120px 0px" });
  const adopt = () => {
    KINDS.forEach((k) => $$(k.sel).forEach((el) => {
      if (el._dr || el.closest("#brands, #posters")) return;
      const how = k.how(el), st = el.style;
      el._dr = { el, depth: k.depth, rot: how !== "bob" && how !== "moth" && how !== "moth-lite", lx: 0, ly: 0, w: 0, tx: 0, ty: 0, tw: 0 };
      st.setProperty("--d", `${(-rnd() * 8).toFixed(2)}s`);
      if (how === "moth") { el.classList.add("dr-moth"); st.setProperty("--a", `${range([5, 9]).toFixed(1)}px`); st.setProperty("--t", `${range([7, 11]).toFixed(1)}s`); st.setProperty("--f", `${Math.round(range([700, 1100]))}ms`); }
      else if (how === "moth-lite") { el.classList.add("dr-float"); st.setProperty("--a", `${range(k.a).toFixed(1)}px`); st.setProperty("--t", `${range(k.t).toFixed(1)}s`); }
      else if (how === "lily") { el.classList.add("dr-sway", "lily"); st.setProperty("--r", `${range([1.2, 2.6]).toFixed(2)}deg`); st.setProperty("--t", `${range([5, 8]).toFixed(1)}s`); }
      else if (how === "bob") { el.classList.add("dr-bob"); st.setProperty("--a", `${range(k.a).toFixed(1)}px`); st.setProperty("--t", `${range(k.t).toFixed(1)}s`); }
      else { el.classList.add(how === "breathe" ? "dr-breathe" : "dr-sway"); st.setProperty("--r", `${range(k.r).toFixed(2)}deg`); st.setProperty("--t", `${range(k.t).toFixed(1)}s`); }
      el.classList.add("dr-off");
      items.push(el._dr);
      io.observe(el);
    }));
  };
  adopt();
  // rooms build their plates as you reach them; pick those up as they appear
  let mo = 0;
  new MutationObserver(() => { clearTimeout(mo); mo = setTimeout(adopt, 120); }).observe(document.querySelector("main"), { childList: true, subtree: true });

  /* the wind and the pull */
  let lastY = scrollY, vel = 0, px = -1e4, py = -1e4, raf = 0;
  const kick = () => { if (!raf && !still()) raf = requestAnimationFrame(frame); };
  /* while the page moves, its own frame measures (SM.measure, before anything is written) and a scrub moves things; the
     frame here runs only to let things settle once the page is still, or to follow the pointer */
  let read = null;
  SM.measure(() => { read = nearNow(); });
  SM.scrub(() => {
    const y = SM.y; vel += (y - lastY - vel) * 0.35; lastY = y;
    if (read) { const r = read; read = null; if (step(r)) kick(); } else kick();
  });
  if (SM.HOVER) addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; px = e.clientX; py = e.clientY; kick(); }, { passive: true });
  document.addEventListener("pointerleave", () => { px = py = -1e4; kick(); });
  const R = 280;
  function frame() {
    raf = 0;
    if (SM.moving) return;   // the page's own frame is coming, and moves things from its scrub
    if (step(nearNow())) kick();
  }
  /** what is showing and, for the pointer's pull, where it is: only reads the page */
  function nearNow() {
    const H = SM.vh, near = [], pull = SM.HOVER && !SM.COLUMN.matches && px > -1e3;
    // read everything first, then write, so the page is laid out once a frame. Only the pointer's pull needs to know
    // where things are; without it (phones, or the pointer gone) what is showing comes from the observer alone, and
    // nothing is measured
    for (const it of vis) {
      if (!it.el.isConnected) { vis.delete(it); continue; }
      if (!pull) { near.push([it, null]); continue; }
      const r = it.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > H + 100 || !r.width) continue;
      near.push([it, r]);
    }
    return { near, pull };
  }
  /** move what nearNow found by the wind and the pull: only writes. Says whether anything is still settling */
  function step({ near, pull }) {
    vel *= 0.9;
    let busy = Math.abs(vel) > 0.05;
    for (const [it, r] of near) {
      // wind: while the page scrolls down, things trail behind it and lean back; deeper things more
      let tx = 0, ty = clamp(vel * 0.5 * it.depth, -16, 16), tw = clamp(-vel * 0.12 * it.depth, -5, 5);
      if (pull) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy);
        if (d < R + Math.max(r.width, r.height) / 2) {
          const k = clamp(1 - (d - Math.max(r.width, r.height) / 2) / R, 0, 1) * it.depth;
          tx += (dx / (d || 1)) * 6 * k; ty += (dy / (d || 1)) * 6 * k; tw += (dx / (d || 1)) * 1.6 * k;
        }
      }
      // a soft spring back to rest
      it.lx += (tx - it.lx) * 0.12; it.ly += (ty - it.ly) * 0.12; it.w += (tw - it.w) * 0.12;
      if (Math.abs(tx - it.lx) + Math.abs(ty - it.ly) + Math.abs(tw - it.w) > 0.04) busy = true;
      const s = it.el.style, X = it.lx.toFixed(1), Y = it.ly.toFixed(1), Wd = it.w.toFixed(2);
      if (it.rot) { if (it._w !== Wd) { it._w = Wd; s.setProperty("--w", Wd + "deg"); } }
      else {
        if (it._x !== X) { it._x = X; s.setProperty("--lx", X + "px"); }
        if (it._y !== Y) { it._y = Y; s.setProperty("--ly", Y + "px"); }
      }
    }
    return busy;
  }
})();
