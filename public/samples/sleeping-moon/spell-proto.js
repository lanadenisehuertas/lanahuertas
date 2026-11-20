/* Prototype: the spell. Before the moon rises, the scroll casts it up. A circle is drawn round the place the moon will
   be, runes are written between its rings as the pen passes, a six-pointed star is drawn inside, and the words of the
   spell are written under it. Then, as the moon rises through it, the circle breaks apart and fades and the star's
   six points fly out and become the six doors. The lines are smooth; only the runes are small bitmaps. Everything is exactly as far along as the scroll: scrolling back unwrites
   it. Runes near the pointer catch the light. Phones get the same spell on a stage of its own above the moon.
   Quiet mode and reduced motion skip it. */
(() => {
  const { $, $$ } = SM;
  const hero = $("#moon"), board = $("#board");
  if (!hero || !board) return;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (a, b, v) => clamp((v - a) / (b - a));
  const sm = (a, b, v) => SM.smooth(lin(a, b, v));
  const still = () => SM.quiet();   // only the visitor's own quiet switch stills the page, never the system setting (moon.js)
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const CAST = 1.15;                      // screens of scroll the casting takes, before the moon starts to rise
  const INK = "#b9a2ff", DIM = "rgba(185,162,255,0.42)", GOLD = "#fff1c9";

  /* the runes: 7 x 7 cell glyphs (a crescent, a star, an eye, fire, water, the sun, an hourglass, a key) */
  const G = [
    "..###../.##..../##...../##...../##...../.##..../..###..",
    "...#.../...#.../..###../#######/..###../...#.../...#...",
    "......./..###../.#...#./#..#..#/.#...#./..###../.......",
    "...#.../..#.#../..#.#../.#...#./.#...#./#######/.......",
    "#######/.#...#./.#...#./..#.#../..#.#../...#.../.......",
    "..###../.#...#./#.....#/#..#..#/#.....#/.#...#./..###..",
    "#######/.#...#./..#.#../...#.../..#.#../.#...#./#######",
    "..###../..#.#../..###../...#.../.#####./...#.../...#...",
  ].map((g) => g.split("/").flatMap((row, y) => [...row].map((c, x) => (c === "#" ? [x - 3, y - 3] : null)).filter(Boolean)));
  const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const DOORMAP = [4, 3, 2, 5, 0, 1];   // door k is born from the star's point j (0 points right, then clockwise)
  const EDGES = [[0, 2], [2, 4], [4, 0], [1, 3], [3, 5], [5, 1]];

  /** a canvas W x H cells, each cell `cell` CSS pixels, backed at the screen's resolution: the spell is drawn in cells
      and the canvas's transform scales them, so its lines come out smooth rather than as enlarged pixels */
  const hires = (cv, W, H, cell) => {
    const k = cell * Math.min(1.5, devicePixelRatio || 1);
    cv.width = Math.ceil(W * k); cv.height = Math.ceil(H * k);
    const c = cv.getContext("2d");
    c.setTransform(k, 0, 0, k, 0, 0);
    return c;
  };

  /** draw the spell at cast progress s and rise progress p. Everything is measured in cells (g: centre, radius, the
      doors' places). The rings and the star are smooth lines; the runes alone keep the bitmap, as small glyphs of
      square cells, so the board keeps a trace of its 1-bit hand without a field of pixels. */
  function cast(ctx, W, H, g, s, p, ptr) {
    ctx.clearRect(0, 0, W, H);
    const { cx, cy, R } = g, A0 = Math.PI / 2, TAU = Math.PI * 2;
    const rot = 0.5 * sm(0.3, 1, s) + 0.8 * p, gone = sm(0.22, 0.7, p);
    const LW = 0.6;   // a line's weight, in cells
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    // as the moon rises the drawing comes apart: its lines break into shortening fragments, and it fades
    const fade = 1 - gone;
    const broken = (len) => (gone > 0 ? [len * fade + 0.01, len * gone] : []);
    /** a line with a faint wide glow under it */
    const stroke = (path, colour, w, dash, glow) => {
      ctx.setLineDash(dash);
      if (glow) { ctx.globalAlpha = 0.14 * fade; ctx.strokeStyle = colour; ctx.lineWidth = w * 4; ctx.stroke(path); }
      ctx.globalAlpha = fade; ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.stroke(path);
    };
    let pen = null;
    const ring = (r, f, dir, dots, colour, glow) => {
      if (f <= 0) return;
      const a0 = A0 + dir * rot, a1 = a0 + dir * f * TAU, path = new Path2D();
      path.arc(cx, cy, r, a0, a1, dir < 0);
      stroke(path, colour, dots ? LW * 0.9 : LW, dots ? [0.01, dots] : broken((TAU * r) / 72), glow);
      if (f < 1) pen = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
    };
    // the rings: the outer one clockwise from the bottom, a fainter dotted one just outside it, a dotted one inside,
    // the other way
    const f1 = lin(0.04, 0.4, s), f2 = lin(0.14, 0.48, s), f3 = lin(0.46, 0.78, s);
    ring(R, f1, 1, 0, INK, true);
    ring(R * 1.035, f1, 1, 2.2, DIM, false);
    ring(R * 0.84, f2, -1, 3, INK, false);
    // the runes, written between the rings as the pen goes past; the newest, and any near the pointer, are gold. Their
    // cells are one path per colour, so neighbouring squares join without seams; as the moon rises they go cell by cell
    const ink = new Path2D(), gold = new Path2D();
    for (let k = 0; k < 12; k++) {
      const at = (k + 0.5) / 12;
      if (f1 < at) break;
      const a = A0 + at * TAU + rot, x = Math.round(cx + Math.cos(a) * R * 0.92), y = Math.round(cy + Math.sin(a) * R * 0.92);
      const near = ptr && Math.hypot(ptr[0] - x, ptr[1] - y) < R * 0.24, fresh = f1 < 1 && f1 - at < 0.05;
      G[k % G.length].forEach(([gx, gy]) => { if (!gone || hash(x + gx, y + gy) > gone) (near || fresh ? gold : ink).rect(x + gx - 0.5, y + gy - 0.5, 1, 1); });
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = INK; ctx.fill(ink);
    ctx.fillStyle = GOLD; ctx.fill(gold);
    // the six-pointed star: two triangles, one edge after another
    const P = Array.from({ length: 6 }, (_, j) => { const a = (j * Math.PI) / 3 + rot; return [cx + Math.cos(a) * R * 0.84, cy + Math.sin(a) * R * 0.84]; });
    const reached = new Set(), edges = new Path2D();
    EDGES.forEach(([a, b], e) => {
      const f = clamp(f3 * 6 - e);
      if (f <= 0) return;
      const [x0, y0] = P[a], [x1, y1] = P[b];
      edges.moveTo(x0, y0); edges.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f);
      reached.add(a);
      if (f >= 1) reached.add(b); else pen = [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
    });
    stroke(edges, INK, LW, broken(R / 9), true);
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    // its points: gold glints that, as the moon rises, fly out on an arc to where the doors wake, trailing light
    const pts = [];
    P.forEach(([x, y], j) => {
      if (!reached.has(j)) return;
      const k = DOORMAP.indexOf(j), T = g.targets ? g.targets[k] : [cx + (x - cx) * 3.2, cy + (y - cy) * 3.2];
      const t = sm(0.26 + k * 0.025, 0.6 + k * 0.025, p);
      // the room's name stands just outside its point, and goes as the point flies off to become the door
      pts.push({ k, x: cx + (x - cx) * 1.13, y: cy + (y - cy) * 1.13, a: 1 - sm(0.0, 0.3, t) });
      if (t >= 1 && p > 0.64 + k * 0.035) return;   // its door has woken in its place
      const at = (q) => [x + (T[0] - x) * q, y + (T[1] - y) * q - Math.sin(q * Math.PI) * R * 0.2];
      if (t > 0 && t < 1) [0.04, 0.08, 0.12, 0.16, 0.2].forEach((d, i) => { const [qx, qy] = at(Math.max(0, t - d)); dot(ctx, qx, qy, 0.55 - i * 0.07, DIM, 0.9 - i * 0.16); });
      const [qx, qy] = at(t);
      glint(ctx, qx, qy, t > 0 && t < 1 ? 2.8 : 2);
    });
    if (pen && s < 1) glint(ctx, pen[0], pen[1], 1.8);
    return pts;
  }
  /** a soft round dot */
  const dot = (ctx, x, y, r, colour, a) => { ctx.globalAlpha = a; ctx.fillStyle = colour; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; };
  /** a four-point glint with a soft halo, r cells from its centre to the tip of a point */
  const glint = (ctx, x, y, r) => {
    const h = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    h.addColorStop(0, "rgba(255,241,201,0.55)"); h.addColorStop(1, "rgba(255,241,201,0)");
    ctx.fillStyle = h; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = GOLD; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  };

  /** the six rooms' names, one beside each point of the star while it is drawn (the star is a map of the site) */
  const NAMES = $$(".door", board).map((d) => d.dataset.door);
  const namer = (into) => {
    const box = document.createElement("div");
    box.className = "sp-names"; box.setAttribute("aria-hidden", "true");
    box.innerHTML = NAMES.map((n) => `<span>${esc(n)}</span>`).join("");
    into.append(box);
    const els = [...box.children];
    return (pts, cell, cxPx) => {
      const seen = new Set();
      pts.forEach(({ k, x, y, a }) => {
        seen.add(k);
        const el = els[k], X = x * cell, Y = Math.max(92, y * cell), left = X < cxPx - 4;   // never under the masthead or its shade
        el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(${left ? "-100%" : "0"}, -50%)`;
        el.style.opacity = a.toFixed(3);
      });
      els.forEach((el, k) => { if (!seen.has(k)) el.style.opacity = "0"; });
    };
  };

  /** the spell's words, written letter by letter; the three newest are gold */
  const incantation = (el, text) => {
    el.innerHTML = `<span class="vh">${esc(text)}</span><span aria-hidden="true">${[...text].map((c) => `<span class="c">${esc(c)}</span>`).join("")}</span>`;
    const chars = $$(".c", el);
    return (f) => {
      const n = Math.round(f * chars.length);
      if (el._n === n) return;
      el._n = n;
      chars.forEach((c, i) => { c.classList.toggle("w", i < n); c.classList.toggle("n", i < n && i >= n - 3 && n < chars.length); });
    };
  };
  const words = "Each point of the star is a room of my work. Keep scrolling and the moon wakes them.";
  // the study (study-proto.js) casts the spell on its floor and borrows these to do it
  SM.spell = { cast, hires, incantation, words };
  /** with the study in the page, the spell is already cast when the board is reached: it only breaks into the doors */
  const studied = () => document.documentElement.classList.contains("has-study");
  /* how long the board waits before the moon rises: with the study, the room's circle has already landed here by 0.65
     screens, so the moon rises straight away rather than after a held half screen of nothing moving */
  const cast0 = () => (studied() ? 0.65 : CAST);
  // the first words say what is about to happen; the page under it keeps its own title
  const TITLE = "Six rooms of work, asleep.", tEl = $(".pl-title", hero);
  if (tEl) {
    tEl._ch = null; tEl.textContent = TITLE; SM.type(tEl);
    tEl.removeAttribute("aria-label");
    tEl.insertAdjacentHTML("afterbegin", `<span class="vh">${TITLE}</span>`);
  }
  const titleText = TITLE;
  // the first frame says whose work this is: a signature under the title, which leaves with the title as the spell begins
  const BY = "By Lana Huertas, UI/UX and graphic designer in Manila.";
  if (tEl && !$(".pl-by", hero)) tEl.insertAdjacentHTML("afterend", `<p class="pl-by">By Lana Huertas</p>`);
  const byEl = $(".pl-by", hero);

  /* ================================================================ wide screens: the spell on the moon's own board */
  const canvas = Object.assign(document.createElement("canvas"), { className: "spell" });
  canvas.setAttribute("aria-hidden", "true");
  const glow = Object.assign(document.createElement("div"), { className: "spell-glow" });
  $(".xor", board).before(glow);
  const incant = Object.assign(document.createElement("p"), { className: "incant" });
  board.append(canvas, incant);
  const names = namer(board);
  const write = incantation(incant, words);
  let ctx = null, W = 0, H = 0, cell = 4, geo = null, last = "", ptr = null, tWords = [], cue = null;
  const size = () => {
    const U = SM.u(), b = board.getBoundingClientRect();
    cell = Math.max(3, Math.round(U * 0.27));
    W = Math.ceil(board.offsetWidth / cell); H = Math.ceil(board.offsetHeight / cell);
    canvas.style.width = W * cell + "px"; canvas.style.height = H * cell + "px";
    ctx = hires(canvas, W, H, cell);
    geo = { cx: (50 * U) / cell, cy: (28.8 * U) / cell, R: (28 * U) / cell,
      targets: $$(".door", board).map((d) => { const r = ($(".pic", d) || d).getBoundingClientRect(); return [(r.left + r.width / 2 - b.left) / cell, (r.top + r.height / 2 - b.top) / cell]; }) };
    last = "";
  };
  const hint = { cast: "Scroll: a spell draws the map of the six rooms.", rise: "Keep scrolling: the moon wakes the rooms." };
  const run = () => {
    const on = hero.classList.contains("rising") && !still();
    if (on !== hero.classList.contains("casting")) {
      hero.classList.toggle("casting", on);
      hero.style.setProperty("--cast", on ? cast0() : 0);
      hero.dataset.riseAt = on ? cast0() : 0;
      if (on) size();
      else { tWords.forEach((w) => (w.style.transform = w.style.opacity = "")); SM._fs = 1; }
    }
    if (!on) return;
    const t = -SM.where(hero).top / SM.vh;   // the moon's stop's place as the scroll keeps it: no layout each frame
    const CT = cast0();
    if (t < -1 || t > CT + 1.5) return;
    const st = studied(), s = st ? 1 : clamp(t / CT), p = clamp(t - CT), U = SM.u();
    if (!tWords.length) tWords = $$(".pl-title > span", hero);
    cue ||= $(".pl-cue", hero);
    // the title lifts away word by word as the casting begins; the scroll cue goes with it
    tWords.forEach((w, i) => { const q = sm(i * 0.03, 0.12 + i * 0.03, s); w.style.transform = `translate3d(0, ${(-q * 6 * U).toFixed(1)}px, 0)`; w.style.opacity = (1 - q).toFixed(3); });
    if (cue) cue.style.opacity = (1 - sm(0, 0.08, s)).toFixed(3);
    if (byEl) { const q = sm(0.02, 0.16, s); byEl.style.opacity = (1 - q).toFixed(3); byEl.style.transform = `translate3d(0, ${(-q * 4 * U).toFixed(1)}px, 0)`; }
    write(lin(0.16, 0.72, s));
    incant.style.opacity = st ? "0" : (1 - sm(0, 0.22, p)).toFixed(3);
    glow.style.opacity = (sm(0.2, 0.9, s) * (1 - sm(0.35, 0.85, p))).toFixed(3);
    glow.style.transform = `scale(${(0.7 + 0.35 * s + 0.25 * sm(0.3, 0.8, p)).toFixed(3)})`;
    // the stars of the sky are drawn in towards the circle while it is cast, and thrown back out when it breaks
    SM._fs = 1 - 0.05 * SM.smooth(s) + 0.05 * sm(0.3, 0.8, p) + 0.035 * Math.sin(Math.PI * sm(0.3, 0.9, p));
    const h = s < 1 ? hint.cast : hint.rise;
    if (p < 0.86 && !(st && t < 0.9) && hero.dataset.hint !== h) { hero.dataset.hint = h; if (SM.stop === hero) SM.say(); }
    const key = `${s.toFixed(4)}|${p.toFixed(4)}|${ptr ? ptr.map(Math.round).join() : ""}`;
    if (key !== last) { last = key; names(cast(ctx, W, H, geo, s, p, ptr), cell, geo.cx * cell); }
  };
  SM.scrub(run);
  if (SM.HOVER) {
    let q = 0;
    hero.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || !hero.classList.contains("casting")) return;
      const b = board.getBoundingClientRect();
      ptr = [(e.clientX - b.left) / cell, (e.clientY - b.top) / cell];
      if (!q) q = requestAnimationFrame(() => { q = 0; run(); });
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { ptr = null; run(); });
  }
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (hero.classList.contains("casting")) { size(); run(); } pw = 0; prun(); }, 150); });

  /* ================================================================ phones: a stage of its own, above the moon */
  // the stage is already in the page (an empty section before the moon) so that nothing moves when it is filled
  const ph = $(".cast-ph") || Object.assign(document.createElement("section"), { className: "cast-ph" });
  ph.removeAttribute("aria-hidden");
  ph.setAttribute("aria-label", titleText);
  ph.innerHTML = `<div class="cp-stage"><div class="cp-night"></div><div class="cp-glow"></div><canvas aria-hidden="true"></canvas>
    <p class="cp-title display" aria-hidden="true">${titleText.split(" ").map((w) => `<span>${esc(w)}</span>`).join(" ")}</p>
    <p class="cp-by">${esc(BY)}</p>
    <p class="incant cp-incant"></p><span class="pl-cue cp-cue" aria-hidden="true"><i></i></span></div>`;
  if (!ph.isConnected) hero.before(ph);
  const pc = $("canvas", ph), pglow = $(".cp-glow", ph), pnight = $(".cp-night", ph), pWords = $$(".cp-title > span", ph), pcue = $(".cp-cue", ph);
  const pincant = $(".cp-incant", ph), pwrite = incantation(pincant, words), pby = $(".cp-by", ph);
  const pnames = namer(ph.firstElementChild);
  let pw = 0, pcell = 3, pgeo = null, plast = "", pctx = null;
  const psize = () => {
    const st = ph.firstElementChild, w = st.clientWidth, h = st.clientHeight;
    pcell = Math.max(3, Math.round(w / 130)); pw = Math.ceil(w / pcell);
    const phH = Math.ceil(h / pcell);
    pc.style.width = pw * pcell + "px"; pc.style.height = phH * pcell + "px";
    pctx = hires(pc, pw, phH, pcell);
    pgeo = { cx: w / 2 / pcell, cy: (h * 0.47) / pcell, R: Math.min(w * 0.41, h * 0.3) / pcell, targets: null, H: phH };
    plast = "";
  };
  const prun = () => {
    // the section's place and height as the scroll keeps them (SM.where), so the scrub reads no layout each frame
    const at = SM.where(ph);
    if (!at.h || still()) return;
    if (!pw) psize();
    const span = (at.h - SM.vh) / SM.vh, t = -at.top / SM.vh;
    if (t < -1 || t > span + 1) return;
    const s = clamp(t / (span * 0.7)), p = clamp((t - span * 0.7) / (span * 0.3)), V = SM.vw / 100;
    pWords.forEach((w, i) => { const q = sm(i * 0.03, 0.12 + i * 0.03, s); w.style.transform = `translate3d(0, ${(-q * 8 * V).toFixed(1)}px, 0)`; w.style.opacity = (1 - q).toFixed(3); });
    pcue.style.opacity = (1 - sm(0, 0.08, s)).toFixed(3);
    if (pby) pby.style.opacity = (1 - sm(0.02, 0.16, s)).toFixed(3);
    pwrite(lin(0.16, 0.72, s));
    pincant.style.opacity = (1 - sm(0, 0.3, p)).toFixed(3);
    pnight.style.opacity = (1 - sm(0.15, 0.85, p)).toFixed(3);
    pglow.style.opacity = (sm(0.2, 0.9, s) * (1 - sm(0.35, 0.85, p))).toFixed(3);
    pglow.style.transform = `scale(${(0.7 + 0.35 * s + 0.25 * sm(0.3, 0.8, p)).toFixed(3)})`;
    const key = `${s.toFixed(4)}|${p.toFixed(4)}`;
    if (key !== plast) { plast = key; pnames(cast(pctx, pw, pgeo.H, pgeo, s, p, null), pcell, pgeo.cx * pcell); }
  };
  SM.scrub(prun);
})();
