/* The sleeping moon: the system. Pages load this first and use the SM object.

   A picture (.pic) holds the real image (.full) and a canvas (.bm). How it sleeps depends on what it is:
     drawn objects (data-kind paint and line: the tools, the doors, the room's things, the ornaments) sleep as 1-bit
     bitmaps, ink on the ground in an 8 x 8 Bayer dither with crisp square cells fixed to the picture;
     photos of the work and the moon (photo, moon) sleep as a smooth lilac duotone, their lightness laid between the
     stop's ground and its ink, so no large area is ever dithered.
   Waking, the colour comes in as a sweep of moonlight from the top left down across the picture. On a bitmap the cells
   at the front turn one by one, each when the front's light passes its Bayer threshold; on a smooth picture the front
   is feathered, and a sparse seam of square cells glints along it while it moves.
   What the canvas shows is decided by:
     show     how much of the picture has come in (the entrance, once)
     wake     how much of the whole picture has turned to colour, from pointing at it
     floor    how much has turned to colour from the scroll: a picture wakes as far
              as the scroll has brought it in, and goes back to sleep as it leaves
     face     for a picture with two faces, how much of the second face is in
   All of them travel along the same sweep, so the picture changes in one soft front, never in a scatter of pixels. */
const SM = (() => {
  const root = document.documentElement;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HOVER = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const COLUMN = matchMedia("(max-width: 760px), (max-aspect-ratio: 1/1), (max-height: 500px)");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  if (RM) root.classList.add("quiet");
  const quiet = () => root.classList.contains("quiet");
  /* the window's size, kept between resizes: reading innerWidth or innerHeight after a style has been written makes the
     browser restyle and lay out the page on the spot, and the scroll asks for them many times a frame */
  let VW = innerWidth, VH = innerHeight;
  addEventListener("resize", () => { VW = innerWidth; VH = innerHeight; }, { capture: true });
  /** the layout unit in px */
  const u = () => (COLUMN.matches ? VW / 100 : Math.min(VW / 100, (VH * 1.6) / 100));

  const B8 = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  /* a scatter of stars, a few of which twinkle: those that twinkle in step share one of three layers (.tg-0 to .tg-2 in
     magic-proto.css) and the layer's opacity is what changes, so the browser runs three animations however many stars
     there are. group(i) gives the layer of the i-th star counting from 1, or -1 for a steady one; a twinkling star
     stands at 0.9, as bright as the twinkle's peak, and its layer dims it */
  const twinkle = (list, group, html) => {
    const layers = [[], [], []], steady = [];
    list.forEach((s, k) => { const g = group(k + 1); (g < 0 ? steady : layers[g]).push(html(s, g < 0 ? s.o.toFixed(2) : "0.9")); });
    return steady.join("") + layers.map((l, g) => (l.length ? `<span class="tg tg-${g}">${l.join("")}</span>` : "")).join("");
  };
  const rgb = (c) => { const m = c.trim().match(/^#?([0-9a-f]{6})$/i); if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)); const n = c.match(/[\d.]+/g); return n ? n.slice(0, 3).map(Number) : [185, 162, 255]; };
  /* a picture's image is decoded off the main thread (an ImageBitmap made from the file itself is decoded on a worker)
     and kept decoded, at no more than 640px on its longest side, which is more than its canvas ever needs. An image
     element would be decoded again on the main thread whenever its canvas was rebuilt or recoloured. Where that cannot
     be done, the image element is the fallback. */
  const viaElement = (src) => { const im = new Image(); im.src = src; return im.decode().then(() => im); };
  /* el, if given, is the page's own image of the same file: it is let finish first, so the file is fetched once and the
     copy here comes from the browser's cache */
  // (a lazy image in a hidden box never loads, so the wait is cut off after a moment and the file fetched anyway)
  const settled = (el) => (!el || el.complete ? Promise.resolve() : new Promise((r) => { el.addEventListener("load", r, { once: true }); el.addEventListener("error", r, { once: true }); setTimeout(r, 2500); }));
  const loadImage = (src, el) => {
    if (!window.createImageBitmap || !window.fetch) return viaElement(src);
    return settled(el).then(() => fetch(src, { cache: "force-cache" })).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then((b) => createImageBitmap(b)).then((bmp) => {
      const k = Math.min(1, 640 / Math.max(bmp.width, bmp.height));
      if (k >= 1) return bmp;
      return createImageBitmap(bmp, { resizeWidth: Math.round(bmp.width * k), resizeHeight: Math.round(bmp.height * k), resizeQuality: "high" })
        .then((small) => { bmp.close(); return small; }, () => bmp);
    }).catch(() => viaElement(src));
  };

  /* ====================================================================== bitmap */
  const all = new Set(), near = new Set();
  class Bitmap {
    constructor(pic) {
      this.pic = pic; pic._bm = this;
      this.full = $(".full", pic);
      this.canvas = $(".bm", pic) || pic.appendChild(Object.assign(document.createElement("canvas"), { className: "bm" }));
      this.canvas.setAttribute("aria-hidden", "true");
      this.ctx = this.canvas.getContext("2d");
      this.kind = pic.dataset.kind || "paint";   // paint: shape from the image's alpha · photo: the whole box · line: engraving · moon: a disc
      this.bits = this.kind === "paint" || this.kind === "line";   // drawn objects sleep as 1-bit bitmaps
      this.canvas.classList.toggle("bits", this.bits);
      this.show = 0; this.wake = 0; this.floor = 0; this.face = 0; this.lr = 0; this.lx = 0; this.ly = 0;
      this.phase = pic.dataset.phase ? +pic.dataset.phase : 1;   // a moon's lit part: 1 full, 0.5 half, 0 new
      this.timers = {};
      all.add(this);
    }
    async load() {
      if (this.loading) return this.loading;
      const srcs = [this.full.getAttribute("src")]; if (this.pic.dataset.alt) srcs.push(this.pic.dataset.alt);
      // a picture in a stop far down the page waits until that stop is within a screen of the window before it fetches
      // its image, so the first screens are not slowed by rooms nobody has reached yet
      this.loading = nearOnce(this.pic).then(() => Promise.all(srcs.map((s, k) => loadImage(s, k ? null : this.full)))).then((ims) => { this.imgs = ims; this.build(); });
      return this.loading;
    }
    /** read one image at canvas size into two layers: { sleep, wake }, each RGBA. Asleep is the duotone (or, for a
        picture with no ground of its own, the ink alone, as strong as the picture is light); awake is the picture. */
    cells(img, cols, rows) {
      const off = document.createElement("canvas"); off.width = cols; off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      o.imageSmoothingQuality = "high";
      if (this.pic.classList.contains("box")) {  // cover the box, as object-fit does
        const pos = (getComputedStyle(this.pic).getPropertyValue("--pos") || "50% 50%").match(/[\d.]+/g) || [50, 50];
        const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
        const s = Math.max(cols / iw, rows / ih), w = iw * s, h = ih * s;
        o.drawImage(img, (cols - w) * (pos[0] / 100), (rows - h) * ((pos[1] ?? 50) / 100), w, h);
      } else o.drawImage(img, 0, 0, cols, rows);
      const d = o.getImageData(0, 0, cols, rows).data, n = cols * rows, k = this.kind, flat = this.pic.hasAttribute("data-flat");
      const inside = new Float32Array(n), v = new Float32Array(n);
      const edge = 1.2 / Math.min(cols, rows);   // a disc's edge is soft over about one canvas pixel
      let sum = 0, count = 0;
      for (let i = 0; i < n; i++) {
        const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3] / 255, lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        if (k === "moon") { const x = ((i % cols) + 0.5) / cols - 0.5, y = (Math.floor(i / cols) + 0.5) / rows - 0.5; inside[i] = Math.min(1, Math.max(0, (0.488 - Math.hypot(x, y)) / edge + 0.5)); v[i] = lum; }
        else if (k === "photo") { inside[i] = 1; v[i] = lum; }
        else if (k === "line") { inside[i] = Math.min(1, Math.max(0, (a * lum - 0.08) / 0.16)); v[i] = a * lum; }
        else { inside[i] = a; v[i] = lum; }
        if (inside[i] > 0.5) { sum += v[i]; count++; }
      }
      if (flat) {
        // a box blur over lightness, twice, so only the big shapes of the picture are left
        const R = 3, tmp = new Float32Array(n);
        for (let pass = 0; pass < 2; pass++) {
          for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const xx = x + d; if (xx >= 0 && xx < cols) { s += v[y * cols + xx]; c++; } } tmp[y * cols + x] = s / c; }
          for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const yy = y + d; if (yy >= 0 && yy < rows) { s += tmp[yy * cols + x]; c++; } } v[y * cols + x] = s / c; }
        }
      }
      // level each picture around its own average, so dark and light pictures both read; softer than the old 1-bit
      // levels, since a smooth tone needs less push than a dither did to show its shapes
      const mean = sum / Math.max(1, count);
      if (this.bits) return this.bitCells(d, v, mean, cols, rows, flat);
      const gain = { moon: 1.9, photo: 1.7, line: 1.5, paint: 1.2 }[k], lift = this.pic.dataset.lift ? +this.pic.dataset.lift : { moon: 0.6, photo: 0.5, line: 0.62, paint: 0.48 }[k];
      const ink = this.ink, paper = this.paper, sleep = new Uint8ClampedArray(n * 4), wake = new Uint8ClampedArray(n * 4);
      for (let i = 0, j = 0; i < n; i++, j += 4) {
        const inn = inside[i];
        wake[j] = d[j]; wake[j + 1] = d[j + 1]; wake[j + 2] = d[j + 2]; wake[j + 3] = inn * 255;
        if (inn <= 0) continue;
        const lv = Math.min(1, Math.max(0, (v[i] - mean) * gain + lift)), t = lv * lv * (3 - 2 * lv);
        if (paper) {
          sleep[j] = paper[0] + (ink[0] - paper[0]) * t; sleep[j + 1] = paper[1] + (ink[1] - paper[1]) * t; sleep[j + 2] = paper[2] + (ink[2] - paper[2]) * t; sleep[j + 3] = inn * 255;
        } else {
          sleep[j] = ink[0]; sleep[j + 1] = ink[1]; sleep[j + 2] = ink[2]; sleep[j + 3] = inn * t * 255;
        }
      }
      return { sleep, wake };
    }
    /** the 1-bit layers of a drawn object: which cells are inside its shape, which of those are ink when asleep (the
        Bayer dither of its levelled lightness, with a solid outline on painted shapes so the silhouette reads), and
        its colours for when it wakes */
    bitCells(d, v, mean, cols, rows, flat) {
      const n = cols * rows, k = this.kind, inside = new Uint8Array(n), on = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const a = d[i * 4 + 3] / 255, lum = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
        inside[i] = k === "line" ? (a * lum > 0.16 ? 1 : 0) : a >= 0.5 ? 1 : 0;
      }
      const gain = { line: 2.2, paint: 1.75 }[k], lift = this.pic.dataset.lift ? +this.pic.dataset.lift : { line: 0.62, paint: 0.48 }[k];
      for (let i = 0; i < n; i++) {
        if (!inside[i]) continue;
        const x = i % cols, y = (i / cols) | 0, level = (v[i] - mean) * gain + lift;
        on[i] = flat ? (level > 0.5 ? 1 : 0) : level * 64 > B8[(y & 7) * 8 + (x & 7)] + 0.5 ? 1 : 0;
        if (k === "line" || flat) continue;
        const rim = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
        if (rim || !inside[i - 1] || !inside[i + 1] || !inside[i - cols] || !inside[i + cols]) on[i] = 1;
      }
      return { bits: true, inside, on, col: d };
    }
    /** work out the canvas for the picture's current size on screen: fine enough to look smooth when the browser scales
        it up, coarse enough (about thirty thousand pixels) to redraw every frame the scroll moves it */
    build() {
      if (!this.imgs) return;
      const w = this.full.offsetWidth, h = this.full.offsetHeight;
      if (!w || !h) return;
      const cs = getComputedStyle(this.pic);
      this.ink = rgb(cs.getPropertyValue("--ink") || "#b9a2ff");
      this.paper = this.kind === "photo" || this.kind === "paint" ? rgb(cs.getPropertyValue("--ground") || "#0c0620") : null;
      // a bitmap's cells are the old size: coarse enough to read as cells, finer on small things (data-cell scales them);
      // a smooth picture's canvas is fine enough to look smooth when scaled, coarse enough to redraw every frame
      const cell = this.bits ? Math.max(2, Math.round(u() * (w > u() * 22 ? 0.28 : 0.14) * (parseFloat(this.pic.dataset.cell) || 1)))
        : Math.max(1.5, Math.sqrt((w * h) / 32000));
      const cols = Math.max(12, Math.round(w / cell)), rows = Math.max(12, Math.round(h / cell));
      Object.assign(this.canvas.style, { left: this.full.offsetLeft + "px", top: this.full.offsetTop + "px", width: w + "px", height: h + "px" });
      this.canvas.width = cols; this.canvas.height = rows;
      this.cols = cols; this.rows = rows;
      // the sweep: where each point sits on the way from the top left to the bottom right, with a slow ripple so the
      // front of the light is never a ruled line
      const sweep = new Float32Array(cols * rows);
      let lo = Infinity, hi = -Infinity;
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        const fx = x / cols, fy = y / rows, t = 0.62 * fy + 0.38 * fx + 0.035 * Math.sin(fx * 7.1 + fy * 3.3) + 0.02 * Math.sin(fy * 11.7 - fx * 4.2);
        sweep[i] = t; if (t < lo) lo = t; if (t > hi) hi = t;
      }
      for (let i = 0; i < sweep.length; i++) sweep[i] = (sweep[i] - lo) / (hi - lo);
      this.sweep = sweep;
      // the seam's cells: squares about six CSS pixels across, each with a fixed chance, so the glints stand still on
      // the picture and only the front decides which of them show
      const blk = Math.max(2, Math.round(6 / cell)), seam = new Float32Array(cols * rows);
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        let h = (((x / blk) | 0) * 374761393 + ((y / blk) | 0) * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177);
        seam[i] = ((h ^ (h >>> 16)) >>> 0) / 4294967295;
      }
      this.seam = seam;
      this.a = this.cells(this.imgs[0], cols, rows);
      this.b = this.imgs[1] ? this.cells(this.imgs[1], cols, rows) : null;
      this.image = this.ctx.createImageData(cols, rows);
      this.draw();
    }
    draw() {
      if (!this.image) return;
      if (this.bits) return this.drawBits();
      const { cols, rows, a, b, show, face, lx, ly, lr, phase, sweep, seam } = this, px = this.image.data, wake = Math.max(this.wake, this.floor);
      const F = 0.24, ramp = (p, t) => { const q = (p * (1 + F) - t) / F; return q <= 0 ? 0 : q >= 1 ? 1 : q * q * (3 - 2 * q); };
      const soft = lr ? lr * 0.35 : 1;
      for (let y = 0, i = 0; y < rows; y++) {
        const dy = y + 0.5 - ly, ny = (y + 0.5) / rows - 0.5, edge = (2 * phase - 1) * Math.sqrt(Math.max(0, 0.25 - ny * ny));   // the terminator
        for (let x = 0; x < cols; x++, i++) {
          const j = i * 4, t = sweep[i];
          let al = ramp(show, t);
          if (al > 0 && phase < 1) { const q = (edge - ((x + 0.5) / cols - 0.5)) * cols * 0.6 + 0.5; al *= q <= 0 ? 0 : q >= 1 ? 1 : q; }
          if (al <= 0) { px[j + 3] = 0; continue; }
          let wk = ramp(wake, t);
          if (lr && wk < 1) { const dx = x + 0.5 - lx, r = Math.sqrt(dx * dx + dy * dy), q = (lr - r) / soft; if (q > wk) wk = q >= 1 ? 1 : q; }
          const fk = b ? ramp(face, t) : 0;
          let r, g, bl, al2;
          if (fk <= 0 || fk >= 1) {
            const L = fk >= 1 ? b : a, S = L.sleep, W = L.wake, sk = 1 - wk;
            r = S[j] * sk + W[j] * wk; g = S[j + 1] * sk + W[j + 1] * wk; bl = S[j + 2] * sk + W[j + 2] * wk; al2 = S[j + 3] * sk + W[j + 3] * wk;
          } else {
            const sk = 1 - wk, fa = 1 - fk;
            const ra = a.sleep[j] * sk + a.wake[j] * wk, ga = a.sleep[j + 1] * sk + a.wake[j + 1] * wk, ba = a.sleep[j + 2] * sk + a.wake[j + 2] * wk, aa = a.sleep[j + 3] * sk + a.wake[j + 3] * wk;
            const rb = b.sleep[j] * sk + b.wake[j] * wk, gb = b.sleep[j + 1] * sk + b.wake[j + 1] * wk, bb = b.sleep[j + 2] * sk + b.wake[j + 2] * wk, ab = b.sleep[j + 3] * sk + b.wake[j + 3] * wk;
            r = ra * fa + rb * fk; g = ga * fa + gb * fk; bl = ba * fa + bb * fk; al2 = aa * fa + ab * fk;
          }
          // the seam: where the light is half way in, a few of the square cells glint pale lilac
          if (wk > 0.04 && wk < 0.96) {
            const m = 4 * wk * (1 - wk);
            if (seam[i] < m * m * m * 0.4) { r += (232 - r) * 0.7; g += (222 - g) * 0.7; bl += (255 - bl) * 0.7; }
          }
          px[j] = r; px[j + 1] = g; px[j + 2] = bl; px[j + 3] = al2 * al;
        }
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
    /** a bitmap's frame: every cell is either asleep (ink, ground or nothing) or awake (its colour), never between. A cell
        turns when the sweep's light at it passes its Bayer threshold, so the front breaks up cell by cell */
    drawBits() {
      const { cols, rows, a, b, show, face, lx, ly, lr, sweep, ink, paper } = this, px = this.image.data, wake = Math.max(this.wake, this.floor);
      const F = 0.24, ramp = (p, t) => { const q = (p * (1 + F) - t) / F; return q <= 0 ? 0 : q >= 1 ? 1 : q * q * (3 - 2 * q); };
      const soft = lr ? lr * 0.35 : 1;
      for (let y = 0, i = 0; y < rows; y++) {
        const dy = y + 0.5 - ly, row = (y & 7) * 8;
        for (let x = 0; x < cols; x++, i++) {
          const j = i * 4, t = sweep[i], th = (B8[row + (x & 7)] + 0.5) / 64;
          const s = b && ramp(face, t) > th ? b : a;
          if (!s.inside[i] || ramp(show, t) <= th) { px[j + 3] = 0; continue; }
          let wk = ramp(wake, t);
          if (lr && wk < 1) { const dx = x + 0.5 - lx, q = (lr - Math.sqrt(dx * dx + dy * dy)) / soft; if (q > wk) wk = q >= 1 ? 1 : q; }
          if (wk > th) { px[j] = s.col[j]; px[j + 1] = s.col[j + 1]; px[j + 2] = s.col[j + 2]; px[j + 3] = 255; }
          else if (s.on[i]) { px[j] = ink[0]; px[j + 1] = ink[1]; px[j + 2] = ink[2]; px[j + 3] = 255; }
          else if (paper) { px[j] = paper[0]; px[j + 1] = paper[1]; px[j + 2] = paper[2]; px[j + 3] = 255; }
          else px[j + 3] = 0;
        }
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
    /** move show, wake or face to a value; resolves when it arrives */
    to(prop, target, ms, delay = 0) {
      cancelAnimationFrame(this.timers[prop]); clearTimeout(this.timers[prop + "d"]);
      return new Promise((done) => {
        const start = () => {
          if (quiet() || ms <= 0) { this[prop] = target; this.draw(); return done(); }
          const from = this[prop], t0 = performance.now();
          const step = (now) => { const k = Math.min(1, (now - t0) / ms); this[prop] = from + (target - from) * k; this.draw(); if (k < 1) this.timers[prop] = requestAnimationFrame(step); else done(); };
          this.timers[prop] = requestAnimationFrame(step);
        };
        delay && !quiet() ? (this.timers[prop + "d"] = setTimeout(start, delay)) : start();
      });
    }
    /** bitmap to colour, then the sharp picture takes over */
    async wakeUp(ms = 300, delay = 0) {
      clearTimeout(this.timers.rest); this.awake = true; this.pic.classList.add("woken");
      try { await this.load(); } catch { this.pic.classList.add("plain"); return; }
      await this.to("wake", 1, ms, delay); this.sync();
    }
    sleep(ms = 200) { clearTimeout(this.timers.rest); this.awake = false; this.pic.classList.remove("woken"); if (this.floor < 1) this.pic.classList.remove("awake"); return this.to("wake", 0, ms); }
    /** once revealed, a picture stays in colour after the pointer leaves, then dissolves back into its bitmap */
    rest(hold = 60000, ms = 900) { clearTimeout(this.timers.rest); this.timers.rest = setTimeout(() => this.sleep(ms), hold); }
    /** the sharp picture shows only while the bitmap is all colour */
    sync() { this.pic.classList.toggle("awake", Math.max(this.wake, this.floor) >= 1); }
    /** set by the scroll, every frame it moves: in steps of 1/64, fine enough that the sweep glides */
    setFloor(v) {
      v = Math.round(Math.min(1, Math.max(0, v)) * 64) / 64;
      if (v === this.floor) return;
      this.floor = v;
      if (!this.image) { if (v > 0) this.load().then(() => { this.draw(); this.sync(); }).catch(() => {}); return; }
      this.draw(); this.sync();
    }
    /** the entrance, set by the scroll instead of a timer */
    setShow(v) {
      v = Math.round(Math.min(1, Math.max(0, v)) * 64) / 64;
      if (v === this.show) return;
      this.show = v; this.entered = true;
      if (this.image) this.draw();
    }
    /** read the colours again (after --ink or --ground changed) and redraw */
    recolour(inkC, groundC) {
      if (!this.image) return;
      // the caller may say what the colours now are, which spares the browser a restyle to work them out
      const cs = inkC && (groundC || !this.paper) ? null : getComputedStyle(this.pic);
      const ink = rgb(inkC || cs.getPropertyValue("--ink") || "#b9a2ff"), paper = this.paper ? rgb(groundC || cs.getPropertyValue("--ground") || "#0c0620") : null;
      if (ink.join() === this.ink.join() && (!paper || paper.join() === this.paper.join())) return;
      this.ink = ink; if (paper) this.paper = paper;
      this.a = this.cells(this.imgs[0], this.cols, this.rows);
      this.b = this.imgs[1] ? this.cells(this.imgs[1], this.cols, this.rows) : null;
      this.draw();
    }
    /** a moon's phase, set by the scroll */
    setPhase(v) {
      v = Math.round(Math.min(1, Math.max(0, v)) * 200) / 200;
      if (v === this.phase) return;
      this.phase = v;
      if (this.image) this.draw();
    }
    /** for a picture with two faces: 0 the first, 1 the second */
    setFace(f, ms = 240) { if (this.pic.dataset.alt) this.full.src = f ? this.pic.dataset.alt : this.pic.dataset.first || (this.pic.dataset.first = this.full.getAttribute("src")); return this.to("face", f, ms); }
  }

  /* pictures are found, built when they come near the screen, and drawn in once */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const bm = e.target._bm;
    // a picture whose image cannot be read is left as the plain image (.plain), never as an empty box
    if (e.isIntersecting) { near.add(bm); bm.load().then(() => { if (!bm.entered && !bm.pic.dataset.enter) { bm.entered = true; bm.to("show", 1, 320); } tick(); }).catch(() => bm.pic.classList.add("plain")); }
    else near.delete(bm);
  }), { rootMargin: "25% 0px" });
  /** run fn once, as soon as el (or the stop it sits in) is within a screen of the window: rooms far down the page
      fetch and build their pictures then, not while the first screen is still arriving */
  const whenNear = (el, fn) => {
    const stop = el.closest("main > section") || el;
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { o.disconnect(); fn(); } }, { rootMargin: "100% 0px" });
    o.observe(stop);
  };
  /** resolves once the stop el sits in is within a screen of the window (at once for anything outside the stops) */
  const nearP = new Map();
  const nearOnce = (el) => {
    const stop = el.closest("main > section");
    if (!stop) return Promise.resolve();
    if (!nearP.has(stop)) nearP.set(stop, new Promise((r) => whenNear(stop, r)));
    return nearP.get(stop);
  };
  /** make every .pic inside scope a bitmap; returns them. data-enter="manual" leaves the drawing-in to the page. */
  const pictures = (scope = document) => $$(".pic", scope).filter((p) => !p._bm).map((p) => {
    const b = new Bitmap(p); io.observe(p);
    // a picture that is not part of a link or button wakes under the pointer by itself, and stays revealed for a minute after
    if (!p.closest("a, button") && !p.hasAttribute("data-still")) {
      p.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && b.wakeUp(320));
      p.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") b.rest(); });
    }
    return b;
  });
  const bitmap = (el) => el && (el._bm || ($(".pic", el) || {})._bm);

  /* ====================================================================== pointing wakes
     A picture wakes whole when the pointer is on it (or its link is hovered, focused or tapped: see wakeable).
     Letters of a display heading take the smooth cut within a small circle around the pointer. */
  let px = -9999, py = -9999, pointerIn = false, raf = 0;
  const out = (el) => { if (el._lit) { for (const c of el._ch) c.classList.remove("lit"); el._lit = false; } };
  /** which letters the pointer's circle reaches: only reads the page. null when there is no pointer on it (phones, or
      the pointer gone), when nothing needs measuring and lit letters are only put out */
  const lettersAt = () => {
    const active = !quiet() && HOVER && pointerIn, R = u() * 3.4;
    if (!active) return null;
    const hit = [];
    for (const el of typed) {
      const hr = el.getBoundingClientRect();
      // a heading off screen, or one the pointer's circle cannot reach, only needs its letters put out
      if (hr.bottom < -50 || hr.top > VH + 50 || px < hr.left - R || px > hr.right + R || py < hr.top - R || py > hr.bottom + R) { hit.push([el, null]); continue; }
      hit.push([el, el._ch.map((c) => { const r = c.getBoundingClientRect(); return (r.left + r.width / 2 - px) ** 2 + (r.top + r.height / 2 - py) ** 2 < R * R; })]);
    }
    return hit;
  };
  /** light the letters lettersAt found: only writes */
  const light = (hit) => {
    if (!hit) { typed.forEach(out); return; }
    for (const [el, on] of hit) {
      if (!on) { out(el); continue; }
      el._lit = true;
      el._ch.forEach((c, k) => c.classList.toggle("lit", on[k]));
    }
  };
  // the pointer moving: a frame of its own, read then write. The page moving: the page's frame reads in its read pass
  // and lights in a scrub (registered below, once scrub exists), so the letters cost no layout of their own
  const frame = () => { raf = 0; light(lettersAt()); };
  let lettersRead;
  const tick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  if (HOVER) {
    addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; px = e.clientX; py = e.clientY; pointerIn = true; tick(); }, { passive: true });
    document.addEventListener("pointerleave", () => { pointerIn = false; tick(); });
  }
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { all.forEach((b) => b.build()); tick(); }, 140); });

  /* ====================================================================== type */
  const typed = [];
  /** split a heading into letters so they can wake one by one */
  const type = (el) => {
    if (el._ch) return el;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((w) => `<span style="white-space:nowrap" aria-hidden="true">${[...w].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ");
    el._ch = $$(".ch", el); typed.push(el);
    return el;
  };

  /* ====================================================================== .wipe-in / .wipe-out (moon.css): a short cross-fade */
  /** replace what a box shows with a short fade: old child out, new child in */
  const swap = (box, next) => {
    const old = box.firstElementChild;
    if (quiet() || !old) { box.replaceChildren(next); return; }
    old.classList.remove("wipe-in"); old.classList.add("wipe-out");
    next.classList.add("wipe-in");
    box.append(next);
    setTimeout(() => old.remove(), 160);
    setTimeout(() => next.classList.remove("wipe-in"), 240);
  };


  /* ====================================================================== scroll
     1. The wheel glides. A wheel or trackpad turn moves a target; the page eases toward it a little every frame,
        so scrolling never jumps a notch at a time. Desktop pointers only: keyboard, scrollbar, touch, quiet mode and
        reduced motion keep the browser's own scrolling.
     2. Scrubbing. Everything that moves with the scroll registers a function with scrub(); all of them run once a
        frame while the page moves, and once after a resize. Nothing that the scroll moves runs on a timer, so it
        moves exactly as far as you scroll and goes back when you scroll back. */
  const scrubs = new Set();
  let travelling = false;
  let sy = scrollY, target = scrollY, gliding = false, lastT = 0, frameReq = 0;
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - VH);
  const smoothOn = () => HOVER && !quiet();
  /* the scroll position is read from the browser only once after the page has moved, and kept until it moves again:
     reading scrollY after a style has been written makes the browser restyle and lay out the page on the spot, so
     every scrub that asked for it would pay for a fresh layout */
  let lastY = scrollY, moved = false;
  const readY = () => { if (moved) { moved = false; lastY = scrollY; } return lastY; };
  const runScrubs = () => scrubs.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
  /* measures: functions that only read the page, run each frame the page moves before any scrub writes, so whatever
     they read costs no extra layout; each gets the frame's time, which every other frame callback also gets */
  const measures = new Set();
  const runMeasures = (now) => measures.forEach((fn) => { try { fn(now); } catch (e) { console.error(e); } });
  const frameLoop = (now) => {
    frameReq = 0;
    if (gliding) {
      // while the page glides, its position is the one set here; the browser's is read once, first thing in the frame,
      // only to notice that something else moved the page (keys, the scrollbar, a link), which ends the glide
      const real = scrollY;
      if (Math.abs(real - lastY) > 3) { gliding = false; lastT = 0; sy = target = lastY = real; moved = false; }
      else {
        const dt = Math.min(48, now - (lastT || now - 16)); lastT = now;
        sy += (target - sy) * (1 - Math.exp(-dt / 105));
        if (Math.abs(target - sy) < 0.4) { sy = target; gliding = false; lastT = 0; }
        window.scrollTo(0, sy); lastY = sy; moved = false;
      }
    } else sy = target = readY();
    readY();
    runMeasures(now);
    runScrubs();
    if (gliding) frameReq = requestAnimationFrame(frameLoop);
  };
  const kick = () => { if (!frameReq) frameReq = requestAnimationFrame(frameLoop); };
  /** move the page to y: glides when it can; instant jumps at once */
  const glide = (y, instant) => {
    y = Math.max(0, Math.min(maxY(), y));
    if (instant || !smoothOn()) {
      gliding = false; sy = target = y;
      window.scrollTo({ top: y, behavior: instant || quiet() ? "instant" : "smooth" }); moved = true;
      kick(); return;
    }
    if (!gliding) sy = readY();
    target = y; gliding = true; kick();
  };
  // whether a box can scroll on its own, asked once per box: the wheel asks it of every box under the pointer
  const scrollable = new WeakMap();
  const scrolls = (n) => {
    let v = scrollable.get(n);
    if (v === undefined) { v = /(auto|scroll)/.test(getComputedStyle(n).overflowY); scrollable.set(n, v); }
    return v;
  };
  addEventListener("wheel", (e) => {
    if (!smoothOn() || e.ctrlKey || e.defaultPrevented) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (document.querySelector("dialog[open]") || document.body.classList.contains("menu-open") || travelling) return;
    // a box inside the page that can still scroll that way keeps the wheel
    for (let n = e.target; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
      if (scrolls(n) && n.scrollHeight > n.clientHeight + 1) {
        if (e.deltaY < 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1) return;
      }
    }
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaMode === 2 ? e.deltaY * VH * 0.9 : e.deltaY;
    if (!gliding) sy = target = readY();
    target = Math.max(0, Math.min(maxY(), target + d));
    gliding = true; kick();
  }, { passive: false });
  addEventListener("scroll", (e) => {
    if (e.target !== document) return;   // a box inside the page scrolled, not the page
    // while it glides the frame keeps the position (and notices if something else moved the page); otherwise the
    // next question about the position reads it afresh
    if (!gliding) moved = true;
    kick();
  }, { passive: true, capture: true });
  addEventListener("resize", () => { moved = true; target = Math.min(target, maxY()); kick(); });
  /** register a function that runs every frame the page moves; returns a way to remove it */
  const scrub = (fn) => { scrubs.add(fn); kick(); return () => scrubs.delete(fn); };
  // the letters' glow follows the page as it moves under a still pointer (see lettersAt)
  if (HOVER) {
    measures.add(() => { lettersRead = lettersAt(); });
    scrub(() => { if (lettersRead !== undefined) { light(lettersRead); lettersRead = undefined; } });
  }
  /** where an element is: its top and bottom in the window, and for a stop taller than the window how far through it
      the window has come (0 when its top reaches the top of the window, 1 when its bottom reaches the bottom) */
  /* a stop's place in the page is kept between frames and measured again only when something changes size, so the
     many things that ask where a stop is each frame do not make the browser lay the page out again after every write;
     anything that is not a stop is measured as it is */
  const placed = new WeakMap();
  const resized = new ResizeObserver(() => gen++);
  let gen = 0;
  const rectOf = (el) => {
    if (el.parentElement?.tagName !== "MAIN") return el.getBoundingClientRect();
    let c = placed.get(el);
    if (!c || c.gen !== gen || c.w !== VW) {
      // measure every stop at once while the page is laid out, rather than one at a time between scrubs that write
      const y = (lastY = scrollY); moved = false;
      for (const st of el.parentElement.children) {
        if (!placed.has(st)) { resized.observe(st); if (!rectOf.body) { rectOf.body = 1; resized.observe(document.body); } }
        const r = st.getBoundingClientRect();
        placed.set(st, { gen, w: VW, top: r.top + y, h: r.height });
      }
      c = placed.get(el);
    }
    const top = c.top - readY();
    return { top, bottom: top + c.h, height: c.h };
  };
  const where = (el) => {
    const r = rectOf(el), vh = VH;
    return { top: r.top, bottom: r.bottom, h: r.height, vh, near: r.bottom > -vh && r.top < vh * 2,
      p: Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh))),
      arrive: Math.min(1, Math.max(0, (vh - r.top) / vh)),       // 0 while below the window, 1 once its top is at the top
      leave: Math.min(1, Math.max(0, (-r.top - (r.height - vh)) / vh)) };   // 0 until its last screen, 1 once it has gone
  };
  const smooth = (t) => t * t * (3 - 2 * t);
  /* a stop's main piece wakes as the stop comes into the window and sleeps as it goes, as far as the scroll has taken
     it: by how much of the window the stop fills (or how much of the stop is in it, for one shorter than the window) */
  scrub(() => {
    for (const s of stops) {
      const w = where(s);
      if (!w.near) continue;
      const vis = Math.max(0, Math.min(w.bottom, w.vh) - Math.max(w.top, 0)) / Math.max(1, Math.min(w.h, w.vh));
      const v = smooth(Math.min(1, vis / 0.62));
      for (const p of s._mains || (s._mains = $$("[data-main]", s))) bitmap(p)?.setFloor(v);
    }
  });

  /* masks for one thing coming in over another, from nothing (0) to everything (LEVELS): a band of moonlight with a soft
     edge sweeps down across it, the same front as a picture waking. mask(cover) gives the CSS for an element's mask. */
  const LEVELS = 40;
  const mask = (cover) => {
    const level = quiet() ? (cover >= 0.5 ? LEVELS : 0) : Math.round(Math.min(1, Math.max(0, cover)) * LEVELS);
    if (level >= LEVELS) return { level, image: "none", size: "100% 100%" };
    if (level <= 0) return { level, image: "hide", size: "100% 100%" };
    const F = 0.3, p = level / LEVELS, b = p * (1 + F), a = b - F;
    return { level, image: `linear-gradient(168deg, #000 ${(a * 100).toFixed(1)}%, rgb(0 0 0 / 0.55) ${(((a + b) / 2) * 100).toFixed(1)}%, transparent ${(b * 100).toFixed(1)}%)`, size: "100% 100%" };
  };
  const paintMask = (el, level) => {
    const m = mask(level / LEVELS);
    el.style.visibility = m.image === "hide" ? "hidden" : "visible";
    const img = m.image === "hide" || m.image === "none" ? "none" : m.image;
    el.style.webkitMaskImage = el.style.maskImage = img;
    el.style.webkitMaskSize = el.style.maskSize = m.size;
  };
  /* hold frames: a dissolve never jumps. However fast the page is flung, the shown level steps toward the scroll's level
     at most one step every HOLD ms, so every stage of the dissolve is on screen for a moment and nothing is skipped;
     a slow scroll is followed exactly. */
  const HOLD = 22, chasing = new Set();
  let chaseReq = 0, chaseT = 0;
  const chase = (now) => {
    chaseReq = 0;
    const steps = Math.max(1, Math.floor((now - chaseT) / HOLD));
    if (now - chaseT >= HOLD) chaseT = now;
    for (const el of chasing) {
      const d = el._mt - el._ml;
      if (!d) { chasing.delete(el); continue; }
      if (now - el._mlt < HOLD) continue;
      el._ml += Math.sign(d) * Math.min(Math.abs(d), steps); el._mlt = now;
      paintMask(el, el._ml);
      if (el._ml === el._mt) chasing.delete(el);
    }
    if (chasing.size) chaseReq = requestAnimationFrame(chase);
  };
  /** put mask(cover) on an element: hidden at 0, whole at 1, tiles between, reached a step at a time */
  const applyMask = (el, cover) => {
    const target = mask(cover).level;
    el._mt = target;
    if (el._ml == null || quiet() || Math.abs(target - el._ml) <= 1) {
      if (el._ml !== target) { el._ml = target; el._mlt = performance.now(); paintMask(el, target); }
      chasing.delete(el);
      return target;
    }
    if (!chasing.has(el)) { chasing.add(el); el._mlt = el._mlt || 0; }
    if (!chaseReq) { chaseT = performance.now(); chaseReq = requestAnimationFrame(chase); }
    return el._ml;
  };

  /* ====================================================================== stops, masthead, live line */
  const stops = [], listeners = [];
  const live = $("#live"), sub = $("#sub"), issue = $("#issue-stop"), route = $("#route");
  const rest = { live: live?.textContent || "", sub: sub?.textContent || "" };
  let current = null;
  /** say what is awake, or nothing to return to the resting line */
  const say = (text) => {
    const hero = !document.body.classList.contains("past");
    // each line is written only when its words change, so a screen reader is not told the same thing over and over
    const a = hero && text ? text : rest.sub, b = !hero && text ? text : (current?.dataset.hint || rest.live);
    if (sub && sub.textContent !== a) sub.textContent = a;
    if (live && live.textContent !== b) live.textContent = b;
  };
  const moonPath = (f) => (f >= 0.99 ? "M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20z" : `M12 2A10 10 0 0 1 12 22A${(Math.abs(1 - 2 * f) * 10).toFixed(2)} 10 0 0 ${f < 0.5 ? 0 : 1} 12 2z`);
  const moonSvg = (f) => `<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="d" cx="12" cy="12" r="10"/><path class="l" d="${moonPath(f)}"/></svg>`;
  const setStop = (s) => {
    if (current === s) return;
    const prev = current; current = s;
    stops.forEach((x) => x.classList.toggle("current", x === s));
    if (issue) issue.textContent = s.dataset.label || "";
    if (route) {
      $$("a[data-stop]", route).forEach((a) => a.setAttribute("aria-current", String(a.dataset.stop === s.id)));
      const i = stops.indexOf(s), f = Math.max(0.08, 1 - i / Math.max(1, stops.length - 1));
      const home = $(".home", route); if (home) home.innerHTML = moonSvg(f);
    }
    say();
    listeners.forEach((fn) => fn(s, prev));
  };
  const so = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setStop(e.target)), { rootMargin: "-45% 0px -50% 0px" });
  // the six stops replace the resting line in the masthead once the first screen has gone by (or always, on pages that say so)
  const always = document.body.dataset.route === "always";
  const past = () => document.body.classList.toggle("past", always || scrollY > (stops[0]?.offsetHeight || VH) - VH * 0.5);
  // a page with the room intro decides this itself (room-proto.js), so the scroll is not read twice
  if (document.body.dataset.route !== "room") addEventListener("scroll", past, { passive: true });
  /** find the page's stops and headings; called once the page is ready, and again by pages that build themselves */
  /* the sky: one fixed layer behind every stop, so moving between rooms never shows an edge */
  const sky = () => {
    if ($(".sky")) return;
    let seed = 41; const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    // the stars that twinkle together share a layer (twinkle()), so the sky runs three animations, not one per star
    const field = twinkle(Array.from({ length: 110 }, (_, k) => ({ x: rnd() * 100, y: rnd() * 100, o: 0.25 + rnd() * 0.5, big: !(k % 9) })),
      (i) => (i % 4 === 0 ? 0 : i % 4 === 2 ? 1 : i % 8 === 1 ? 2 : -1), (s, o) => `<b class="${s.big ? "big" : ""}" style="left:${s.x.toFixed(2)}%;top:${s.y.toFixed(2)}%;opacity:${o}"></b>`);
    document.body.insertAdjacentHTML("afterbegin", `<div class="sky" aria-hidden="true"><i class="night"></i><i class="field">${field}</i><i class="dawn"></i></div>`);
  };

  /* ====================================================================== the bands
     The masthead and the foot take the colours of whatever is behind them. band(tone, which) sets them, on "mast",
     "foot" or both, or gives them back to the page with null. A tone is { ground, ink, text, mark, rule }, each
     [r, g, b, a]; tone({...}) makes one from CSS colours and blend(a, b, t) mixes two. The reels blend the bands from
     one world to the next as the scroll dissolves the worlds; the dawn blends them as its edge passes each band. The
     colours are typed in moon.css, so a change that is not driven by the scroll still cross-fades. */
  const BAND = ["ground", "ink", "text", "mark", "rule"];
  const bands = { mast: $(".mast"), foot: $(".foot") };
  const rgba = (c) => {
    const m = String(c).trim().match(/^#([0-9a-f]{6})$/i);
    if (m) return [...[0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)), 1];
    const n = (String(c).match(/[\d.]+/g) || [0, 0, 0]).map(Number);
    return [n[0], n[1], n[2], n[3] ?? 1];
  };
  const tone = (o) => Object.fromEntries(BAND.map((p) => [p, rgba(o[p])]));
  const blend = (a, b, t) => Object.fromEntries(BAND.map((p) => [p, a[p].map((v, i) => v + (b[p][i] - v) * t)]));
  const cssOf = (c) => `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])} / ${c[3].toFixed(3)})`;
  const band = (t, which) => {
    const vals = t ? BAND.map((p) => cssOf(t[p])) : null, key = vals ? vals.join() : "";
    for (const k of which ? [which] : ["mast", "foot"]) {
      const el = bands[k];
      if (!el || el._band === key) continue;
      el._band = key;
      BAND.forEach((p, i) => (vals ? el.style.setProperty("--" + p, vals[i]) : el.style.removeProperty("--" + p)));
    }
  };

  /* first light: the contact stop's sky comes up the window with the stop's top edge, its own edge cut in big pixels,
     covering the night and its stars as far as you have scrolled and going back down when you scroll back. Each band
     turns to the dawn's colours as the edge passes it (dawnT, 0 to 1, read by the bands below). */
  const NIGHT = tone({ ground: "#000000", ink: "#b9a2ff", text: "#d9cfff", mark: "#fff1c9", rule: "rgb(185 162 255 / 0.5)" });
  const DAWN_MAST = tone({ ground: "#cfb8ea", ink: "#5b3fc4", text: "#2b1470", mark: "#2b1470", rule: "rgb(43 20 112 / 0.4)" });
  const DAWN_FOOT = { ...DAWN_MAST, ground: rgba("#f2d2d2") };
  let bandBox = null;
  const dawnT = { mast: 0, foot: 0 };
  addEventListener("resize", () => (bandBox = null));
  /** where the bands are: their lines (the masthead's bottom, the foot's top) and how far their soft fall reaches */
  const bandAt = () => {
    if (!bandBox) {
      const m = bands.mast?.getBoundingClientRect(), f = bands.foot?.getBoundingClientRect(), vh = VH;
      bandBox = { ml: m ? m.bottom : 0, fl: f ? f.top : vh, mb: m ? m.bottom + m.height * 0.6 : 1, ft: f ? f.top - f.height * 0.6 : vh - 1 };
    }
    return bandBox;
  };
  scrub(() => {
    const layer = $(".sky .dawn"), s = stops.find((x) => x.dataset.sky === "dawn");
    dawnT.mast = dawnT.foot = 0;
    if (!layer || !s) return;
    const vh = VH, top = rectOf(s).top;
    const cell = Math.max(8, Math.round(u() * 0.9)), H = cell * 10;
    if (layer._cell !== cell) {
      /* the edge: a ridge of solid square cells, stepped like a far hill line (a sum of waves that repeats every 64
         cells, so the tile joins itself), with a few loose cells just above it. No dither fill and no blur: the cells
         are fixed, so nothing flickers while it rises */
      layer._cell = cell;
      const W = 64, lift = Array.from({ length: W }, (_, k) => 3.2 + 1.6 * Math.sin((2 * Math.PI * 2 * k) / W + 0.7) + 1.0 * Math.sin((2 * Math.PI * 5 * k) / W + 2.1));
      const c = document.createElement("canvas"); c.width = cell * W; c.height = H;
      const x = c.getContext("2d"); x.fillStyle = "#000";
      const loose = (k, r) => { let h = (k * 374761393 + r * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
      for (let k = 0; k < W; k++) {
        const top = Math.round(lift[k]);
        x.fillRect(k * cell, top * cell, cell, H - top * cell);
        if (top - 2 >= 0 && loose(k, 1) < 0.22) x.fillRect(k * cell, (top - 2) * cell, cell, cell);
        else if (top - 1 >= 0 && loose(k, 2) < 0.12) x.fillRect(k * cell, (top - 1) * cell, cell, cell);
      }
      const st = layer.style;
      st.height = `calc(100% + ${H}px)`;
      st.webkitMaskImage = st.maskImage = `url(${c.toDataURL()}), linear-gradient(#000, #000)`;
      st.webkitMaskSize = st.maskSize = `${cell * W}px ${H}px, 100% calc(100% - ${H}px)`;
      st.webkitMaskPosition = st.maskPosition = `0 0, 0 ${H}px`;
      st.webkitMaskRepeat = st.maskRepeat = "repeat-x, no-repeat";
    }
    // the layer's top: the pixel edge sits just above the stop, so the stop itself is all dawn
    const y = Math.round(Math.max(-H, Math.min(vh, top - H)));
    if (layer._y !== y) { layer._y = y; layer.style.transform = `translate3d(0, ${y}px, 0)`; layer.style.visibility = y >= vh ? "hidden" : "visible"; }
    if (top >= vh + H) return;
    const b = bandAt(), e = top - H / 2, cl = (v) => Math.min(1, Math.max(0, v));
    dawnT.mast = smooth(cl((b.mb - e) / Math.max(1, b.mb)));
    dawnT.foot = smooth(cl((vh - e) / Math.max(1, vh - b.ft)));
  });
  /* each band takes the colours of what is behind it: the stop under its line (a reel gives the tone of its world as
     the scroll has blended it, s._tone(y)) or else the page's own colours, and the dawn as its edge comes up past it */
  scrub(() => {
    const b = bandAt();
    const at = (y) => { for (const st of stops) { const r = rectOf(st); if (r.top <= y && r.bottom > y) return st._tone ? st._tone(y) : null; } return null; };
    const m = at(b.ml), f = at(b.fl);
    band(dawnT.mast > 0 ? blend(m || NIGHT, DAWN_MAST, dawnT.mast) : m, "mast");
    band(dawnT.foot > 0 ? blend(f || NIGHT, DAWN_FOOT, dawnT.foot) : f, "foot");
  });
  const start = () => {
    sky();
    $$(".stop").forEach((s) => { if (!stops.includes(s)) { stops.push(s); so.observe(s); } });
    $$(".type").forEach(type);
    past(); tick();
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", start) : start();
  /** travel to a stop */
  /** where a stop is arrived at: its top, or for data-land="end" its last screen */
  const landing = (el) => el.getBoundingClientRect().top + scrollY + (el.dataset.land === "end" ? Math.max(0, el.offsetHeight - VH) : 0);
  const go = (id) => { const el = document.getElementById(id); if (el) glide(landing(el)); };
  /* ====================================================================== travel
     A jump between stops: a soft-edged iris in the next stop's own ground colour closes from the point you chose,
     the stop's numeral and name stand in it for a moment, you are moved there, and the iris opens again from
     the middle.
     travel(id, { x, y }, { onJump }) resolves when the iris has opened. Quiet mode jumps at once. */
  let iris = null;
  document.fonts?.load("64px Redaction").catch(() => {});
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const colourOf = (el, v) => (el.dataset[v] || getComputedStyle(el).getPropertyValue("--" + v) || (v === "ground" ? "#0c0620" : "#b9a2ff")).trim();
  const travel = (id, from, opts = {}) => {
    const el = document.getElementById(id);
    if (!el) return Promise.resolve();
    const jump = () => { glide(landing(el), true); history.replaceState(null, "", "#" + id); opts.onJump?.(); };
    if (quiet() || travelling) { if (!travelling) jump(); return Promise.resolve(); }
    travelling = true;
    if (!iris) { iris = document.createElement("canvas"); iris.className = "iris"; iris.setAttribute("aria-hidden", "true"); document.body.append(iris); }
    const dpr = Math.min(2, devicePixelRatio || 1), W = VW, H = VH;
    iris.width = Math.round(W * dpr); iris.height = Math.round(H * dpr);
    const c = iris.getContext("2d");
    const ground = colourOf(el, "ground"), ink = colourOf(el, "ink");
    // the stop's numeral and name, drawn once; they show only where the iris has closed
    const lm = (el.dataset.label || "").match(/^([IVX]+)\s+(.+)$/), [num, name] = lm ? [lm[1], lm[2]] : ["", el.dataset.name || el.getAttribute("aria-label") || ""];
    const card = document.createElement("canvas"); card.width = iris.width; card.height = iris.height;
    const k = card.getContext("2d"), big = Math.min(u() * 13, W * 0.16) * dpr;
    k.fillStyle = ink; k.textAlign = "center"; k.textBaseline = "alphabetic";
    k.font = `400 ${big}px Redaction, Georgia, serif`; k.fillText(name, card.width / 2, card.height / 2 + big * 0.32);
    k.font = `400 ${20 * dpr}px "Redaction 35", Redaction, serif`; k.fillText(num, card.width / 2, card.height / 2 - big * 0.62);
    // the iris: a circle from (ox, oy) whose radius grows to the far corner, with a feathered rim
    const order = (ox, oy) => ({ ox, oy, far: Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy)) });
    const paint = (t, p, closing) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, W, H);
      const feather = Math.max(60, t.far * 0.18), r = p * (t.far + feather), r0 = Math.max(0, r - feather);
      const g = c.createRadialGradient(t.ox, t.oy, r0, t.ox, t.oy, Math.max(r0 + 0.1, r));
      g.addColorStop(0, closing ? ground : "transparent"); g.addColorStop(1, closing ? "transparent" : ground);
      if (!closing) { c.fillStyle = ground; c.fillRect(0, 0, W, H); c.globalCompositeOperation = "destination-out"; const h = c.createRadialGradient(t.ox, t.oy, r0, t.ox, t.oy, Math.max(r0 + 0.1, r)); h.addColorStop(0, "#000"); h.addColorStop(1, "rgb(0 0 0 / 0)"); c.fillStyle = h; c.fillRect(0, 0, W, H); c.globalCompositeOperation = "source-over"; }
      else { c.fillStyle = g; c.fillRect(0, 0, W, H); }
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-atop"; c.drawImage(card, 0, 0);
    };
    const run = (t, ms, closing) => new Promise((done) => {
      const t0 = performance.now();
      const step = (now) => { const q = Math.min(1, (now - t0) / ms); paint(t, ease(q) * 1.001, closing); q < 1 ? requestAnimationFrame(step) : done(); };
      requestAnimationFrame(step);
    });
    iris.classList.add("on");
    const ox = from?.x ?? W / 2, oy = from?.y ?? H / 2;
    return run(order(ox, oy), opts.closeMs || 340, true)
      .then(() => new Promise((r) => { jump(); setTimeout(r, 60); }))
      .then(() => run(order(W / 2, H / 2), 300, false))
      .then(() => { iris.classList.remove("on"); c.clearRect(0, 0, iris.width, iris.height); travelling = false; });
  };
  if (route) route.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-stop]"); if (!a || !document.getElementById(a.dataset.stop)) return;
    e.preventDefault(); document.body.classList.remove("menu-open");
    const r = a.getBoundingClientRect();
    travel(a.dataset.stop, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  });
  $("#menu")?.addEventListener("click", () => { const open = document.body.classList.toggle("menu-open"); $("#menu").setAttribute("aria-expanded", String(open)); });
  addEventListener("keydown", (e) => e.key === "Escape" && document.body.classList.remove("menu-open"));

  /* ====================================================================== quiet mode */
  const sw = $("#quiet");
  if (sw) {
    sw.setAttribute("aria-checked", String(quiet()));
    sw.addEventListener("click", () => {
      const on = !quiet();
      root.classList.toggle("quiet", on); sw.setAttribute("aria-checked", String(on));
      try { localStorage.setItem("quiet", on ? "1" : "0"); } catch (e) {}
      tick();
    });
  }

  /* ====================================================================== viewer: SM.view([{ src, w, h, alt, cap }], index) */
  let box, items = [], at = 0, opener = null;
  /** a picture someone asked for comes in through big tiles over a fifth of a second (at once in quiet mode) */
  const reveal = (el, ms = 220) => {
    if (!el || quiet()) return;
    el._ml = null;
    const t0 = performance.now();
    const step = (now) => { const q = Math.min(1, (now - t0) / ms); applyMask(el, 1 - Math.pow(1 - q, 3)); if (q < 1) requestAnimationFrame(step); };
    applyMask(el, 0); requestAnimationFrame(step);
  };
  const showItem = (i) => {
    at = (i + items.length) % items.length; const it = items[at];
    $("figure", box).innerHTML = `<img src="${it.src}" width="${it.w}" height="${it.h}" alt="${it.alt || ""}">`;
    reveal($("figure img", box));
    $(".bar b", box).textContent = it.cap || ""; $(".bar span", box).textContent = items.length > 1 ? `${at + 1} of ${items.length}` : "";
    $$(".prev, .next", box).forEach((b) => (b.hidden = items.length < 2));
  };
  const view = (list, i = 0) => {
    if (!box) {
      const ic = (d, w = 26) => `<svg width="${w}" height="18" viewBox="0 0 ${w} 18" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      document.body.insertAdjacentHTML("beforeend", `<dialog class="viewer" aria-label="Viewer"><figure></figure><div class="bar"><b></b><span></span></div><button class="x" type="button" aria-label="Close">${ic("M3 3l12 12M15 3L3 15", 18)}</button><button class="prev" type="button" aria-label="Previous">${ic("M25 9H2M8 3L2 9l6 6")}</button><button class="next" type="button" aria-label="Next">${ic("M1 9h23M18 3l6 6-6 6")}</button></dialog>`);
      box = $("dialog.viewer");
      $(".x", box).addEventListener("click", () => box.close());
      $(".prev", box).addEventListener("click", () => showItem(at - 1));
      $(".next", box).addEventListener("click", () => showItem(at + 1));
      box.addEventListener("click", (e) => (e.target === box || e.target.tagName === "FIGURE") && box.close());
      box.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") showItem(at - 1); if (e.key === "ArrowRight") showItem(at + 1); });
      box.addEventListener("close", () => opener?.focus());
    }
    items = list; opener = document.activeElement; showItem(i); box.showModal();
  };

  /* ====================================================================== waking an item: hover, focus, tap */
  /** el wakes while hovered or focused; on a touch screen the first tap wakes it and the second activates it.
      opts: { pic (element holding the picture, default el), line (text for the live line), on(), off() } */
  let lastPointer = "mouse", armed = null;
  addEventListener("pointerdown", (e) => (lastPointer = e.pointerType), true);
  const wakeable = (el, opts = {}) => {
    const pic = () => { const p = opts.pic || el; return p.classList.contains("pic") ? p : $(".pic", p); };
    const on = () => { if (el._on) return; el._on = true; el.classList.add("on"); bitmap(pic())?.wakeUp(); say(opts.line || el.dataset.line); opts.on?.(); };
    const off = () => {
      if (!el._on) return;
      el._on = false; el.classList.remove("on");
      bitmap(pic())?.sleep();   // what the scroll has woken stays awake (its floor)
      say(); opts.off?.();
      if (armed === el) armed = null;
    };
    el.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && on());
    el.addEventListener("pointerleave", (e) => e.pointerType !== "touch" && off());
    el.addEventListener("focus", on);
    el.addEventListener("blur", off);
    el.addEventListener("click", (e) => { if (lastPointer === "touch" && armed !== el) { e.preventDefault(); e.stopImmediatePropagation(); armed = el; on(); } }, true);
    return el;
  };

  /* stars: a fixed scatter per plate, the same on every load; keep them off the boxes given as [x0, y0, x1, y1] in percent */
  const stars = (el, count = 40, avoid = [], seed = 7) => {
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const list = [];
    for (let k = 0; k < count; k++) {
      const x = 3 + rnd() * 94, y = 10 + rnd() * 80, o = 0.35 + rnd() * 0.55;
      if (!avoid.some(([a, b, c, d]) => x > a && x < c && y > b && y < d)) list.push({ x, y, o, big: k % 7 === 0 });
    }
    el.innerHTML = twinkle(list, (i) => (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : i % 6 === 2 ? 2 : -1),
      (s, o) => `<i class="${s.big ? "b" : ""}" style="left:${s.x.toFixed(2)}%;top:${s.y.toFixed(2)}%;opacity:${o}"></i>`);
  };

  /** the first screen's corner ornaments (a moth and a lily in opposite corners), on a room's board */
  const corners = (el) => {
    if (!el || $(".corners", el)) return;
    el.insertAdjacentHTML("afterbegin", `<div class="corners" aria-hidden="true">
      <span class="pic orn o-tl" data-kind="line" data-still><img class="full" src="art/e_moth.webp" width="744" height="396" alt="" loading="lazy"></span>
      <span class="pic orn o-tr" data-kind="line" data-still><img class="full" src="art/e_lily.webp" width="457" height="904" alt="" loading="lazy"></span>
      <span class="pic orn o-bl" data-kind="line" data-still><img class="full" src="art/e_lily.webp" width="457" height="904" alt="" loading="lazy"></span>
      <span class="pic orn o-br" data-kind="line" data-still><img class="full" src="art/e_moth.webp" width="744" height="396" alt="" loading="lazy"></span></div>`);
    pictures($(".corners", el));
  };
  /** where you are in a room, as a row of small stars (one per piece: those passed lit, the one in front larger and
      bright, those to come faint; "3 of 12" is read out), and the two thin arrows: the one control every room uses */
  const steps = (label) => `<div class="steps"><p class="count label"><span class="vh"></span><span class="pips" aria-hidden="true"></span></p><span class="arws"><button class="arw prev" type="button" aria-label="Previous ${label}">${arrow(-1)}</button><button class="arw next" type="button" aria-label="Next ${label}">${arrow(1)}</button></span></div>`;
  const setSteps = (box, i, n) => {
    const c = $(".count", box), pips = $(".pips", c);
    if (pips.childElementCount !== n) { pips.innerHTML = "<i></i>".repeat(n); c._i = -1; }
    if (c._i !== i) {
      c._i = i; $(".vh", c).textContent = `${i + 1} of ${n}`;
      [...pips.children].forEach((p, k) => (p.className = k < i ? "was" : k === i ? "now" : ""));
    }
    $(".prev", box).disabled = i === 0; $(".next", box).disabled = i === n - 1;
  };
  /** a thin drawn arrow, for .arw buttons */
  const arrow = (dir) => `<svg viewBox="0 0 26 14" aria-hidden="true"><path d="${dir < 0 ? "M25 7H2M7.5 1.5L2 7l5.5 5.5" : "M1 7h23M18.5 1.5L24 7l-5.5 5.5"}"/></svg>`;
  addEventListener("pageshow", () => tick());
  return { $, $$, u, quiet, HOVER, COLUMN, Bitmap, pictures, bitmap, type, swap, say, go, glide, scrub, where, whenNear, smooth, mask, applyMask, band, tone, blend, travel, view, wakeable, stars, tick, moonSvg, start, arrow, corners, steps, setSteps, landing, onStop: (fn) => listeners.push(fn), get stop() { return current; }, get placedGen() { return gen; }, get moving() { return !!frameReq; }, measure: (fn) => { measures.add(fn); return () => measures.delete(fn); }, get y() { return readY(); }, get vw() { return VW; }, get vh() { return VH; } };
})();
