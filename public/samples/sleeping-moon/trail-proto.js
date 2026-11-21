/* Prototype: the stardust trail. The pointer leaves a ribbon of soft motes behind it, like a wand: they take a little
   of its speed, rise like embers, wander, twinkle gently and fade out. A small gold glint follows the tip on a spring.
   Resting on something you can open makes motes circle it; a click or tap throws a ring of them.
   The motes are soft dots and four-point glints, drawn from small sprites made once per colour; one in twelve is a tiny
   bitmap rune of square pixels, a trace of the board's 1-bit hand. The loop sleeps when nothing is alive. */
(() => {
  const still = () => SM.quiet();   // only the visitor's own quiet switch stills the page, never the system setting (moon.js)
  const cv = document.createElement("canvas");
  cv.className = "trail"; cv.setAttribute("aria-hidden", "true");
  document.body.append(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = SM.vw; H = SM.vh; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener("resize", size);
  SM.trail = true;

  /* colours: the world's gold and lilac, or deep ink and amber on the pink dawn, where pale motes would vanish */
  let pal = ["#fff1c9", "#b9a2ff", "#ffffff"];
  const recolour = () => {
    const st = typeof SM.stop === "function" ? SM.stop() : SM.stop;
    const el = st instanceof Element ? st : document.body, cs = getComputedStyle(el);
    const dawn = el.id === "talk" || el.dataset?.sky === "dawn";
    const next = dawn ? ["#5b3fc4", "#8a5d00", "#7a4fd6"] : [cs.getPropertyValue("--mark").trim() || "#fff1c9", cs.getPropertyValue("--ink").trim() || "#b9a2ff", "#ffffff"];
    if (next.join() !== pal.join() || !sprites.length) { pal = next; sprites = pal.map((c) => [sprite(c, 0), sprite(c, 1)]); }
  };
  /** a sprite of one colour: kind 0 a soft round dot, kind 1 a four-point glint in a faint halo. The shape is drawn in
      white first and then filled with the colour, so any CSS colour works */
  let sprites = [];
  function sprite(colour, kind) {
    const S = 64, h = S / 2, c = document.createElement("canvas"); c.width = c.height = S;
    const x = c.getContext("2d"), g = x.createRadialGradient(h, h, 0, h, h, h);
    if (kind === 0) { g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.22, "rgba(255,255,255,0.9)"); g.addColorStop(0.5, "rgba(255,255,255,0.22)"); g.addColorStop(1, "rgba(255,255,255,0)"); }
    else { g.addColorStop(0, "rgba(255,255,255,0.5)"); g.addColorStop(0.4, "rgba(255,255,255,0.12)"); g.addColorStop(1, "rgba(255,255,255,0)"); }
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    if (kind === 1) {
      x.fillStyle = "#fff"; x.beginPath();
      x.moveTo(h, 0); x.quadraticCurveTo(h, h, S, h); x.quadraticCurveTo(h, h, h, S); x.quadraticCurveTo(h, h, 0, h); x.quadraticCurveTo(h, h, h, 0); x.fill();
    }
    x.globalCompositeOperation = "source-in"; x.fillStyle = colour; x.fillRect(0, 0, S, S);
    return c;
  }
  /* the runes: tiny bitmaps, one string per row (a crescent, a cross, a rune and a star), drawn in whole CSS pixels */
  const GLYPHS = [["01110", "11000", "10000", "11000", "01110"], ["00100", "00100", "11111", "00100", "00100"], ["10001", "01010", "00100", "01010", "10001"], ["01110", "10101", "11111", "10101", "01110"]]
    .map((g) => g.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? [x - 2, y - 2] : null)).filter(Boolean)));
  // the page opens on the night's own colours, which are the ones above, so the first sprites are made from them
  // without asking the page for its style (that would lay the whole page out while it is still being built); each
  // stop that is reached after that gives its own
  sprites = pal.map((c) => [sprite(c, 0), sprite(c, 1)]); SM.onStop?.(recolour);

  /* the pool: kind 0 soft dot, 1 four-point glint, 2 bitmap rune, 3 the big flash of a click */
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
  const pickKind = () => { const r = Math.random(); return r < 0.6 ? 0 : r < 0.92 ? 1 : 2; };
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

  /* drawing: sprites for the soft motes, whole CSS pixels for the runes */
  const sq = (x, y, s) => ctx.fillRect(Math.round(x), Math.round(y), s, s);
  const put = (img, x, y, d) => ctx.drawImage(img, x - d / 2, y - d / 2, d, d);
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
      // a gentle twinkle, and a smooth fade over the last part of its life
      const end = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45, tw = p.k === 3 ? 1 : 0.72 + 0.28 * Math.sin(p.age / 110 + p.ph * 1.6);
      ctx.globalAlpha = end * end * (3 - 2 * end) * tw;
      const s = p.s, sp = sprites[p.c];
      if (p.k === 0) put(sp[0], p.x, p.y, (t < 0.5 ? 9 : 7) * s);
      else if (p.k === 1) put(sp[1], p.x, p.y, (t < 0.4 ? 15 : 11) * s);
      else if (p.k === 2) { ctx.fillStyle = pal[p.c]; for (const [gx, gy] of GLYPHS[p.g]) sq(p.x + gx * s, p.y + gy * s, s); }
      else { ctx.globalAlpha = 1 - t; put(sprites[0][1], p.x, p.y, 26 + 30 * t); put(sprites[2][0], p.x, p.y, 16 * (1 - t) + 4); }
    }
    if (headOn) {
      // the head: a gold glint with a white heart that breathes rather than blinks
      ctx.globalAlpha = 1; put(sprites[0][1], hx, hy, 16);
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(now / 200); put(sprites[2][0], hx, hy, 7);
    }
    ctx.globalAlpha = 1;
    if (alive || headOn || (rest && idle < 5000)) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  }
})();
