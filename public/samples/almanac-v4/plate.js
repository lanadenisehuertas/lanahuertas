/* The sleeping moon: a 1-bit plate that wakes into colour where it is touched.

   Every picture (.pic) holds the painted image and a canvas. The canvas is drawn
   once per size at one canvas pixel per bitmap cell and scaled up with
   image-rendering: pixelated, so the pixels stay sharp on any screen. Each cell
   knows three things: whether it is inside the shape, whether its ink is on
   (ordered Bayer dither of the picture's lightness), and its own colour. Two
   numbers then decide what is shown: `show` (how much of the bitmap has been
   drawn in) and `wake` (how much of it has turned to colour). Both move through
   the same Bayer order, so pixels switch on and wake in a pattern, never as a fade. */
(() => {
  const root = document.documentElement;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const still = () => RM || root.classList.contains("quiet");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const B8 = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  const INK = [185, 162, 255], NIGHT = [12, 6, 32], PLUM = [43, 21, 80];

  class Bitmap {
    constructor(pic) {
      this.pic = pic;
      this.canvas = $(".bm", pic);
      this.full = $(".full", pic);
      this.ctx = this.canvas.getContext("2d");
      this.kind = this.canvas.dataset.kind || "paint";
      this.show = 0; this.wake = 0; this.raf = {};
    }
    async load() {
      const img = new Image();
      img.src = this.canvas.dataset.src;
      await img.decode();
      this.img = img;
      this.build();
    }
    /** work out the cells for the picture's current size on screen */
    build() {
      if (!this.img) return;
      const w = this.full.clientWidth, h = this.full.clientHeight;
      if (!w || !h) return;
      const u = parseFloat(getComputedStyle($("#board")).width) / 100;
      const cell = this.kind === "moon" ? Math.max(3, Math.round(u * 0.28)) : Math.max(2, Math.round(u * 0.14));
      const cols = Math.max(12, Math.round(w / cell)), rows = Math.max(12, Math.round(h / cell));
      this.canvas.width = cols; this.canvas.height = rows;
      if (this.kind !== "moon") { this.canvas.style.width = w + "px"; this.canvas.style.height = h + "px"; }
      // read the picture at cell resolution
      const off = document.createElement("canvas"); off.width = cols; off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.imageSmoothingQuality = "high";
      o.drawImage(this.img, 0, 0, cols, rows);
      const d = o.getImageData(0, 0, cols, rows).data, n = cols * rows;
      const inside = new Uint8Array(n), on = new Uint8Array(n), col = new Uint8ClampedArray(n * 3), v = new Float32Array(n);
      let sum = 0, count = 0;
      for (let i = 0; i < n; i++) {
        const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3] / 255;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (this.kind === "moon") {
          // the engraving is cream line on clear: its opacity is its light. Inside the disc every cell belongs to the moon.
          const x = (i % cols + 0.5) / cols - 0.5, y = (Math.floor(i / cols) + 0.5) / rows - 0.5;
          inside[i] = Math.hypot(x, y) < 0.478 ? 1 : 0;
          v[i] = a * lum;
          col[i * 3] = r * a + PLUM[0] * (1 - a); col[i * 3 + 1] = g * a + PLUM[1] * (1 - a); col[i * 3 + 2] = b * a + PLUM[2] * (1 - a);
        } else {
          inside[i] = a >= 0.5 ? 1 : 0;
          v[i] = lum;
          col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b;
        }
        if (inside[i]) { sum += v[i]; count++; }
      }
      // level each picture around its own average, so dark and light objects both read as bitmaps
      const mean = sum / Math.max(1, count);
      const gain = this.kind === "moon" ? 1.9 : 1.75, lift = this.kind === "moon" ? 0.66 : 0.48;
      for (let i = 0; i < n; i++) {
        if (!inside[i]) continue;
        const x = i % cols, y = Math.floor(i / cols);
        const level = (v[i] - mean) * gain + lift;
        on[i] = level * 64 > B8[(y & 7) * 8 + (x & 7)] + 0.5 ? 1 : 0;
        // a solid outline keeps the silhouette readable
        const rim = this.kind !== "moon" && (x === 0 || y === 0 || x === cols - 1 || y === rows - 1);
        if (rim || !inside[i - 1] || !inside[i + 1] || !inside[i - cols] || !inside[i + cols]) on[i] = 1;
      }
      Object.assign(this, { cols, rows, inside, on, col });
      this.image = this.ctx.createImageData(cols, rows);
      this.draw();
    }
    draw() {
      if (!this.image) return;
      const { cols, rows, inside, on, col, show, wake } = this, px = this.image.data;
      const paper = this.kind === "moon" ? null : NIGHT;
      for (let i = 0, n = cols * rows; i < n; i++) {
        const j = i * 4;
        const t = (B8[((Math.floor(i / cols)) & 7) * 8 + ((i % cols) & 7)] + 0.5) / 64;
        if (!inside[i] || t >= show) { px[j + 3] = 0; continue; }
        if (t < wake) { px[j] = col[i * 3]; px[j + 1] = col[i * 3 + 1]; px[j + 2] = col[i * 3 + 2]; px[j + 3] = 255; }
        else if (on[i]) { px[j] = INK[0]; px[j + 1] = INK[1]; px[j + 2] = INK[2]; px[j + 3] = 255; }
        else if (paper) { px[j] = paper[0]; px[j + 1] = paper[1]; px[j + 2] = paper[2]; px[j + 3] = 255; }
        else px[j + 3] = 0;
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
    /** move `show` or `wake` to a value; resolves when it arrives */
    to(prop, target, ms, delay = 0) {
      cancelAnimationFrame(this.raf[prop]);
      clearTimeout(this.raf[prop + "t"]);
      return new Promise((done) => {
        const start = () => {
          if (still() || ms <= 0) { this[prop] = target; this.draw(); return done(); }
          const from = this[prop], t0 = performance.now();
          const step = (now) => {
            const k = Math.min(1, (now - t0) / ms);
            this[prop] = from + (target - from) * k;
            this.draw();
            if (k < 1) this.raf[prop] = requestAnimationFrame(step); else done();
          };
          this.raf[prop] = requestAnimationFrame(step);
        };
        delay && !still() ? (this.raf[prop + "t"] = setTimeout(start, delay)) : start();
      });
    }
    /** bitmap to colour, then the sharp painting takes over */
    async wakeUp(ms = 300, delay = 0) {
      this.awake = true;
      await this.to("wake", 1, ms, delay);
      if (this.awake) this.pic.classList.add("awake");
    }
    sleep(ms = 200) {
      this.awake = false;
      this.pic.classList.remove("awake");
      return this.to("wake", 0, ms);
    }
  }

  /* ---------- pixel stars: a fixed scatter, the same on every load ---------- */
  {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    $(".stars").innerHTML = Array.from({ length: 54 }, (_, k) => {
      const x = 3 + rnd() * 94, y = 9 + rnd() * 80;
      if (Math.hypot(x - 50, (y - 46) * 0.62) < 23) return ""; // keep the moon's face clear
      return `<i class="${k % 7 === 0 ? "b" : ""}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;opacity:${(0.35 + rnd() * 0.55).toFixed(2)}"></i>`;
    }).join("");
  }

  /* ---------- the plate ---------- */
  const board = $("#board"), plate = $(".plate"), sub = $("#sub"), doorName = $("#door");
  const REST = sub.textContent;
  const moon = new Bitmap($("#moon"));
  const doors = $$(".door").map((el) => ({ el, bm: new Bitmap($(".pic", el)) }));
  const all = [moon, ...doors.map((d) => d.bm)];
  let current = null, leaving = false, demo = 0;

  const touch = (d) => {
    if (leaving || current === d) return;
    clearTimeout(demo);
    if (current) release(current, true);
    current = d;
    d.el.classList.add("on");
    board.classList.add("touch");
    doorName.textContent = d.el.dataset.door;
    sub.textContent = d.el.dataset.line;
    d.bm.wakeUp();
  };
  const release = (d, swapping) => {
    if (leaving || !d) return;
    d.el.classList.remove("on");
    d.bm.sleep();
    if (current === d) current = null;
    if (!swapping) { board.classList.remove("touch"); sub.textContent = REST; }
  };

  /** the wake spreads from the chosen door across the plate while the camera pushes into it, then the page goes there */
  const enter = (d) => {
    if (leaving) return;
    if (still()) { location.href = d.el.href; return; }
    leaving = true;
    const b = board.getBoundingClientRect(), r = d.el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    all.forEach((bm) => {
      const p = bm.pic.getBoundingClientRect();
      const dist = Math.hypot(p.left + p.width / 2 - cx, p.top + p.height / 2 - cy);
      bm.wakeUp(260, dist * 0.35);
    });
    board.style.transformOrigin = `${cx - b.left}px ${cy - b.top}px`;
    setTimeout(() => board.classList.add("push"), 240);
    setTimeout(() => { location.href = d.el.href; }, 780);
  };

  let lastPointer = "mouse", armed = null;
  addEventListener("pointerdown", (e) => (lastPointer = e.pointerType), true);
  doors.forEach((d) => {
    d.el.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && touch(d));
    d.el.addEventListener("pointerleave", (e) => e.pointerType !== "touch" && release(d));
    d.el.addEventListener("focus", () => touch(d));
    d.el.addEventListener("blur", () => { if (armed === d) armed = null; release(d); });
    d.el.addEventListener("click", (e) => {
      e.preventDefault();
      // on a touch screen the first tap wakes the door and the second opens it
      // (focus arrives before the click, so the door being awake is not proof of a first tap)
      if (lastPointer === "touch" && armed !== d) { armed = d; touch(d); return; }
      enter(d);
    });
  });
  // the moon wakes too, for whoever tries it
  $("#moon").addEventListener("pointerenter", (e) => e.pointerType !== "touch" && !leaving && moon.wakeUp(420));
  $("#moon").addEventListener("pointerleave", () => !leaving && moon.sleep(260));

  /* ---------- quiet mode ---------- */
  const sw = $("#quiet");
  sw.setAttribute("aria-checked", String(root.classList.contains("quiet")));
  sw.addEventListener("click", () => {
    const on = !root.classList.contains("quiet");
    root.classList.toggle("quiet", on);
    sw.setAttribute("aria-checked", String(on));
    try { localStorage.setItem("quiet", on ? "1" : "0"); } catch (e) {}
  });

  /* ---------- entrance, once: the moon is drawn in, then the name, then the six doors one after another ---------- */
  const ready = Promise.all(all.map((b) => b.load().catch(() => {})));
  const begin = async () => {
    await Promise.race([ready, new Promise((r) => setTimeout(r, 1800))]);
    board.classList.add("in");
    moon.to("show", 1, 560);
    doors.forEach((d, i) => d.bm.to("show", 1, 300, 380 + i * 70));
    // show once how it works: the first door wakes for a moment, unless the visitor is already exploring
    demo = setTimeout(() => {
      if (current || leaving || still()) return;
      const d = doors[0];
      d.bm.wakeUp(360).then(() => setTimeout(() => current !== d && !leaving && d.bm.sleep(300), 760));
    }, 1500);
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", begin) : begin();

  /* ---------- keep the bitmaps sharp when the window changes, and tidy up when the page comes back from history ---------- */
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => all.forEach((b) => b.build()), 120); });
  addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    leaving = false; current = null;
    board.classList.remove("push", "touch");
    sub.textContent = REST;
    doors.forEach((d) => d.el.classList.remove("on"));
    all.forEach((b) => { b.awake = false; b.pic.classList.remove("awake"); b.show = 1; b.wake = 0; b.draw(); });
  });
})();
