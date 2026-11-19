/* Prototype: the stardust trail. The pointer leaves a ribbon of pixel motes behind it, like a wand: they take a little
   of its speed, rise like embers, wander, twinkle in steps and go out. A small gold star follows the tip on a spring.
   Resting on something you can open makes motes circle it; a click or tap throws a ring of them.
   Everything is drawn on one canvas with squares snapped to whole CSS pixels. The loop sleeps when nothing is alive. */
(() => {
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.className = "trail"; cv.setAttribute("aria-hidden", "true");
  document.body.append(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false; };
  size(); addEventListener("resize", size);
  SM.trail = true;

  /* colours: the world's gold and lilac, or deep ink and amber on the pink dawn, where pale motes would vanish */
  let pal = ["#fff1c9", "#b9a2ff", "#ffffff"];
  const recolour = () => {
    const st = typeof SM.stop === "function" ? SM.stop() : SM.stop;
    const el = st instanceof Element ? st : document.body, cs = getComputedStyle(el);
    const dawn = el.id === "talk" || el.dataset?.sky === "dawn";
    pal = dawn ? ["#5b3fc4", "#8a5d00", "#7a4fd6"] : [cs.getPropertyValue("--mark").trim() || "#fff1c9", cs.getPropertyValue("--ink").trim() || "#b9a2ff", "#ffffff"];
  };
  recolour(); SM.onStop?.(recolour);

  /* tiny bitmaps, one string per row: a crescent, a star and a rune */
  const GLYPHS = [["01110", "11000", "10000", "11000", "01110"], ["00100", "00100", "11111", "00100", "00100"], ["10001", "01010", "00100", "01010", "10001"], ["01110", "10101", "11111", "10101", "01110"]]
    .map((g) => g.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? [x - 2, y - 2] : null)).filter(Boolean)));
  const BIG = ["000010000", "000010000", "000111000", "001111100", "111111111", "001111100", "000111000", "000010000", "000010000"]
    .flatMap((row, y) => [...row].map((c, x) => (c === "1" ? [x - 4, y - 4] : null)).filter(Boolean));

  /* the pool: kind 0 square, 1 four-point star, 2 glyph, 3 the big flash */
  const N = 700, P = Array.from({ length: N }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, s: 1, k: 0, g: 0, c: 0, ph: 0 }));
  let next = 0;
  const spawn = (x, y, vx, vy, k, life, s, c) => {
    for (let n = 0; n < N; n++) {
      const p = P[(next + n) % N];
      if (p.on) continue;
      next = (next + n + 1) % N;
      Object.assign(p, { on: true, x, y, vx, vy, age: 0, life, s, k, g: (Math.random() * GLYPHS.length) | 0, c, ph: Math.random() * 4 });
      return p;
    }
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pickKind = () => { const r = Math.random(); return r < 0.62 ? 0 : r < 0.92 ? 1 : 2; };
  const pickColour = () => { const r = Math.random(); return r < 0.5 ? 0 : r < 0.88 ? 1 : 2; };

  /* the pointer and its spring-led head */
  let px = -100, py = -100, lx = -100, ly = -100, hx = -100, hy = -100, hvx = 0, hvy = 0, lastMove = -1e9, down = false, touch = false, rest = null;
  let raf = 0, last = 0;
  const kick = () => { if (!raf && !still()) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const emit = (x0, y0, x1, y1, light) => {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy);
    if (d < 0.5) return;
    // a slow move sprinkles, a fast swipe leaves a ribbon
    const n = Math.min(light ? 6 : 18, Math.floor(d / (light ? 14 : 5)) + (Math.random() < (light ? 0.3 : 0.7) ? 1 : 0));
    for (let i = 0; i < n; i++) {
      const t = Math.random(), sp = Math.min(1, d / 40);
      spawn(x0 + dx * t + rand(-3, 3), y0 + dy * t + rand(-3, 3), dx * 0.05 * sp + rand(-0.5, 0.5), dy * 0.05 * sp + rand(-0.7, 0.2),
        pickKind(), rand(500, 1100) * (light ? 0.8 : 1), Math.random() < 0.2 ? 2 : 1, pickColour());
    }
  };
  addEventListener("pointermove", (e) => {
    if (still()) return;
    touch = e.pointerType === "touch";
    if (touch && !down) return;
    px = e.clientX; py = e.clientY;
    if (performance.now() - lastMove > 400) { lx = hx = px; ly = hy = py; }
    emit(lx, ly, px, py, touch);
    lx = px; ly = py; lastMove = performance.now();
    rest = touch ? null : e.target.closest?.("a, button, [data-wake], .pic.box, .pk-card, .po-hang, .clip, .vs-star") || null;
    kick();
  }, { passive: true });
  addEventListener("pointerdown", (e) => {
    if (still()) return;
    down = true; px = lx = e.clientX; py = ly = e.clientY;
    // the click: a ring of motes and one bright star that flashes
    const n = 16 + ((Math.random() * 5) | 0);
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rand(-0.15, 0.15), v = rand(2.2, 4.2); spawn(px, py, Math.cos(a) * v, Math.sin(a) * v - 0.4, i % 3 ? 0 : 1, rand(450, 800), 1, pickColour()); }
    spawn(px, py, 0, 0, 3, 420, 1, 0);
    kick();
  }, { passive: true });
  // other layers can throw a few motes from a point, as a pen writing or a word arriving does
  SM.sparkle = (x, y, n = 3) => {
    if (still()) return;
    for (let i = 0; i < n; i++) spawn(x + rand(-4, 4), y + rand(-4, 4), rand(-0.9, 0.9), rand(-1.6, -0.2), i ? pickKind() : 1, rand(500, 900), 1, i % 2);
    kick();
  };
  addEventListener("pointerup", () => { down = false; }, { passive: true });
  addEventListener("pointercancel", () => { down = false; }, { passive: true });
  document.addEventListener("pointerleave", () => { rest = null; });

  /* drawing, in whole CSS pixels */
  const sq = (x, y, s) => ctx.fillRect(Math.round(x), Math.round(y), s, s);
  function frame(now) {
    raf = 0;
    const dt = Math.max(0, Math.min(48, now - last)) / 16.7; last = now;
    ctx.clearRect(0, 0, W, H);
    if (still()) { P.forEach((p) => (p.on = false)); return; }
    let alive = 0;
    const idle = now - lastMove;

    // motes circle what the pointer rests on, for a few seconds
    if (rest && idle > 160 && idle < 5000 && rest.isConnected && Math.random() < 0.35 * dt) {
      const r = rest.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const rx = Math.min(r.width / 2 + 8, 220), ry = Math.min(r.height / 2 + 8, 220), a = Math.random() * Math.PI * 2, w = 0.9;
      spawn(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, -Math.sin(a) * w * (rx / 60), Math.cos(a) * w * (ry / 60), Math.random() < 0.5 ? 1 : 0, rand(600, 1000), 1, pickColour());
    }

    // the head chases the tip on a spring and shows only while the pointer moves
    hvx = (hvx + (px - hx) * 0.22 * dt) * 0.62; hvy = (hvy + (py - hy) * 0.22 * dt) * 0.62; hx += hvx * dt; hy += hvy * dt;
    const headOn = !touch && idle < 700;

    for (const p of P) {
      if (!p.on) continue;
      p.age += dt * 16.7;
      if (p.age >= p.life) { p.on = false; continue; }
      alive++;
      // embers: they keep a little of the swipe, slow down, rise and wander
      p.vx = (p.vx + rand(-0.06, 0.06) * dt) * Math.pow(0.95, dt);
      p.vy = (p.vy - 0.028 * dt) * Math.pow(0.95, dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      const t = p.age / p.life;
      // twinkle in steps: each mote blinks off for one beat in four, and fades in coarse steps near the end
      if (p.k !== 3 && ((((p.age / 85) | 0) + (p.ph | 0)) & 3) === 0) continue;
      ctx.globalAlpha = t < 0.7 ? 1 : t < 0.85 ? 0.66 : 0.33;
      ctx.fillStyle = pal[p.c];
      const s = p.s;
      if (p.k === 0) sq(p.x, p.y, t < 0.5 ? s + 1 : s);
      else if (p.k === 1) { const arm = t < 0.4 ? 2 : 1; sq(p.x, p.y, s); for (let i = 1; i <= arm; i++) { sq(p.x + i * s, p.y, s); sq(p.x - i * s, p.y, s); sq(p.x, p.y + i * s, s); sq(p.x, p.y - i * s, s); } }
      else if (p.k === 2) { for (const [gx, gy] of GLYPHS[p.g]) sq(p.x + gx * s, p.y + gy * s, s); }
      else { const c = t < 0.3 ? 3 : t < 0.6 ? 2 : 1; ctx.globalAlpha = 1; for (const [gx, gy] of BIG) sq(p.x + gx * c - c / 2, p.y + gy * c - c / 2, c); }
    }
    if (headOn) {
      ctx.globalAlpha = 1; ctx.fillStyle = pal[0];
      const blink = ((now / 120) | 0) & 1;
      sq(hx - 1, hy - 1, 2); sq(hx - 1, hy - 4, 2); sq(hx - 1, hy + 2, 2); sq(hx - 4, hy - 1, 2); sq(hx + 2, hy - 1, 2);
      if (blink) { ctx.fillStyle = pal[2]; sq(hx - 1, hy - 1, 2); }
    }
    ctx.globalAlpha = 1;
    if (alive || headOn || (rest && idle < 5000)) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  }
})();
