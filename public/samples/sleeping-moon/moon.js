/* The sleeping moon: the system. Pages load this first and use the SM object.

   A picture (.pic) holds the real image (.full) and a canvas (.bm). How it sleeps depends on what it is:
     drawn objects (data-kind paint and line: the tools, the doors, the room's things, the ornaments) sleep as 1-bit
     bitmaps, ink on the ground in an 8 x 8 Bayer dither with crisp square cells fixed to the picture;
     photos of the work and the moon (photo, moon) sleep as a smooth lilac duotone, their lightness laid between the
     stop's ground and its ink, so no large area is ever dithered.
   Waking, the colour spreads out from the middle of the picture (or from where the pointer came in), and goes back in
   toward it as the picture falls asleep. The front is never a smooth ring: it is made of square cells, a bitmap's own
   or, on a smooth picture, squares about as big, each turning when the light passes its Bayer threshold, with a little
   noise of its own and a few loose cells running ahead; on a smooth picture a sparse few glint pale lilac just before
   they turn.
   What the canvas shows is decided by:
     show     how much of the picture has come in (the entrance, once)
     wake     how much of the whole picture has turned to colour, from pointing at it
     floor    how much has turned to colour from the scroll: a picture wakes as far
              as the scroll has brought it in, and goes back to sleep as it leaves
     face     for a picture with two faces, how much of the second face is in
   All of them travel outward along the same order, so the picture changes in one front of cells, never in noise. */
const SM = (() => {
  const root = document.documentElement;
  const HOVER = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const COLUMN = matchMedia("(max-width: 760px), (max-aspect-ratio: 1/1), (max-height: 500px)");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  /* quiet mode is only ever the visitor's own switch, kept for this visit alone (sessionStorage, read in the page's head).
     The system's reduced-motion setting does not turn it on: everything here moves with the scroll, which the visitor
     drives, so the whole site shows under that setting, and only things that move on their own are stilled by CSS.
     An older version kept the switch for good in localStorage; that key is cleared, so no one comes back to a quiet site
     they never chose this visit */
  try { localStorage.removeItem("quiet"); } catch (e) {}
  const quiet = () => root.classList.contains("quiet");
  /* the window's size, kept between resizes: reading innerWidth or innerHeight after a style has been written makes the
     browser restyle and lay out the page on the spot, and the scroll asks for them many times a frame */
  let VW = innerWidth, VH = innerHeight;
  addEventListener("resize", () => { VW = innerWidth; VH = innerHeight; }, { capture: true });
  /** the layout unit in px */
  const u = () => (COLUMN.matches ? VW / 100 : Math.min(VW / 100, (VH * 1.6) / 100));

  const B8 = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  /** a cell's own fixed chance, 0 to 1, from its column, its row and a salt: the same on every load */
  const cellHash = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h = Math.imul(h ^ (h >>> 16), 2246822519); return ((h ^ (h >>> 15)) >>> 0) / 4294967296; };
  /** how much light a cell at place t in the order has when a picture's show, wake or face is at p: 0 until the front
      reaches it, 1 a short way behind the front (WF of the order), so the cells along the front turn by their Bayer
      thresholds within a narrow band, a hard edge with a row of loose cells ahead of it */
  const WF = 0.16;
  const ramp = (p, t) => { const q = (p * (1 + WF) - t) / WF; return q <= 0 ? 0 : q >= 1 ? 1 : q; };
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
     copy here comes from the browser's cache. An image with a srcset is fetched as the copy the browser chose for it
     (currentSrc), so a smaller copy is not followed by the full-size file. */
  // (a lazy image in a hidden box never loads, so the wait is cut off after a moment and the file fetched anyway)
  const settled = (el) => (!el || el.complete ? Promise.resolve() : new Promise((r) => { el.addEventListener("load", r, { once: true }); el.addEventListener("error", r, { once: true }); setTimeout(r, 2500); }));
  const loadImage = (src, el) => {
    if (!window.createImageBitmap || !window.fetch) return viaElement(src);
    return settled(el).then(() => fetch((el && el.currentSrc) || src, { cache: "force-cache" })).then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then((b) => createImageBitmap(b)).then((bmp) => {
      const k = Math.min(1, 640 / Math.max(bmp.width, bmp.height));
      if (k >= 1) return bmp;
      return createImageBitmap(bmp, { resizeWidth: Math.round(bmp.width * k), resizeHeight: Math.round(bmp.height * k), resizeQuality: "high" })
        .then((small) => { bmp.close(); return small; }, () => bmp);
    }).catch(() => viaElement(src));
  };

  /* ====================================================================== bitmap */
  const all = new Set(), near = new Set();
  /* Pictures that have loaded are built one after another, each in a task of its own between frames, never several in
     one go: a build reads the picture's size and its pixels, and when a scroll brings many pictures near at once,
     building them all together held up the frames of that scroll for a long moment. A task builds what it can in a few
     milliseconds (at least one part of a picture: a build comes in parts, see steps) and leaves the rest to the next. */
  const queued = [];
  let builder = 0;
  const buildSoon = (bm) => new Promise((done, fail) => { queued.push([bm, done, fail]); if (!builder) builder = setTimeout(buildSome, 0); });
  const buildSome = () => {
    const t0 = performance.now();
    while (queued.length) {
      const job = queued[0], [bm, done, fail] = job;
      try { job.it = job.it || bm.steps(); if (job.it.next().done) { queued.shift(); done(); } } catch (e) { queued.shift(); fail(e); }
      if (performance.now() - t0 > 4) break;
    }
    builder = queued.length ? setTimeout(buildSome, 0) : 0;
  };
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
      this.show = 0; this.wake = 0; this.floor = 0; this.face = 0; this.origin = null;
      this.phase = pic.dataset.phase ? +pic.dataset.phase : 1;   // a moon's lit part: 1 full, 0.5 half, 0 new
      this.timers = {};
      all.add(this);
    }
    async load() {
      if (this.loading) return this.loading;
      const srcs = [this.full.getAttribute("src")]; if (this.pic.dataset.alt) srcs.push(this.pic.dataset.alt);
      // a picture in a stop far down the page waits until that stop is within a screen of the window before it fetches
      // its image, so the first screens are not slowed by rooms nobody has reached yet
      this.loading = nearOnce(this.pic).then(() => Promise.all(srcs.map((s, k) => loadImage(s, k ? null : this.full)))).then((ims) => { this.imgs = ims; return buildSoon(this); });
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
    build() { const it = this.steps(); while (!it.next().done); }
    /** the build in parts: the picture's measures and its first image's cells, then its second image's cells (a moon has
        two), then the rest. The queue (buildSome) gives each part a task of its own, so a big picture never holds a
        frame up for long; build() runs them all at once. Nothing the picture shows changes until the last part, which
        puts it all in place together, and a part left over from a build that a newer one has overtaken puts nothing */
    *steps() {
      if (!this.imgs) return;
      const w = this.full.offsetWidth, h = this.full.offsetHeight;
      if (!w || !h) return;
      const gen = (this.gen = (this.gen || 0) + 1), left = this.full.offsetLeft, top = this.full.offsetTop;
      const cs = getComputedStyle(this.pic);
      this.ink = rgb(cs.getPropertyValue("--ink") || "#b9a2ff");
      this.paper = this.kind === "photo" || this.kind === "paint" ? rgb(cs.getPropertyValue("--ground") || "#0c0620") : null;
      // a bitmap's cells are the old size: coarse enough to read as cells, finer on small things (data-cell scales them);
      // a smooth picture's canvas is fine enough to look smooth when scaled, coarse enough to redraw every frame
      const cell = this.bits ? Math.max(2, Math.round(u() * (w > u() * 22 ? 0.28 : 0.14) * (parseFloat(this.pic.dataset.cell) || 1)))
        : Math.max(1.5, Math.sqrt((w * h) / 32000));
      const cols = Math.max(12, Math.round(w / cell)), rows = Math.max(12, Math.round(h / cell));
      /* the front's cells: on a bitmap, its own cells; on a smooth picture, squares about as big as a bitmap's cells
         (half a u), so the light comes in as hard square cells on photos and the moon too. Each cell
         turns at its own threshold, its place in an 8 x 8 Bayer pattern, and keeps a fixed chance of glinting */
      const blk = this.bits ? 1 : Math.max(1, Math.round(Math.max(6, u() * 0.5) / cell));
      const n = cols * rows, thr = new Float32Array(n), seam = new Float32Array(n);
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        const bx = (x / blk) | 0, by = (y / blk) | 0;
        thr[i] = (B8[(by & 7) * 8 + (bx & 7)] + 0.5) / 64;
        seam[i] = cellHash(bx, by, 7);
      }
      const a = this.cells(this.imgs[0], cols, rows);
      yield;
      const b = this.imgs[1] ? this.cells(this.imgs[1], cols, rows) : null;
      if (b) yield;
      if (this.gen !== gen) return;
      Object.assign(this.canvas.style, { left: left + "px", top: top + "px", width: w + "px", height: h + "px" });
      this.canvas.width = cols; this.canvas.height = rows;
      this.cols = cols; this.rows = rows;
      this.blk = blk; this.thr = thr; this.seam = seam;
      this.a = a; this.b = b;
      // the order the cells turn in: outward from the picture's middle, and from where the pointer came in, if it did
      this.ord = this.orderFrom(0.5, 0.5);
      this.pord = this.origin ? this.orderFrom(this.origin[0], this.origin[1]) : null;
      this.image = this.ctx.createImageData(cols, rows);
      this.draw();
    }
    /** each cell's place in the order the light reaches it, 0 first to 1 last: how far its cell is from the point
        (ox, oy), as fractions of the picture, measured against the farthest cell of the picture's own shape, so the
        front reaches the shape's edge just as the wake completes, on a disc as on a wide picture. A little noise of
        each cell's own breaks the circle, and a few cells sit a step early: the loose cells that run ahead of it */
    orderFrom(ox, oy) {
      const { cols, rows, blk, a } = this, n = cols * rows, o = new Float32Array(n);
      const X = ox * cols, Y = oy * rows, half = blk / 2, isIn = this.bits ? (i) => a.inside[i] : (i) => a.wake[i * 4 + 3] > 0;
      let far = 1;
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        if (!isIn(i)) continue;
        const d = Math.hypot(((x / blk) | 0) * blk + half - X, ((y / blk) | 0) * blk + half - Y);
        if (d > far) far = d;
      }
      let lo = Infinity, hi = -Infinity;
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        const bx = (x / blk) | 0, by = (y / blk) | 0;
        let v = Math.min(1, Math.hypot(bx * blk + half - X, by * blk + half - Y) / far) * 0.9 + cellHash(bx, by, 3) * 0.1;
        if (cellHash(bx, by, 5) < 0.05) v -= 0.1;
        o[i] = v;
        if (isIn(i)) { if (v < lo) lo = v; if (v > hi) hi = v; }
      }
      if (!(hi > lo)) { lo = 0; hi = 1; }
      for (let i = 0; i < n; i++) o[i] = Math.min(1, Math.max(0, (o[i] - lo) / (hi - lo)));
      return o;
    }
    draw() {
      if (!this.image) return;
      if (this.bits) return this.drawBits();
      /* a smooth picture: its cells (blk canvas pixels square) are each asleep (the duotone) or awake (the picture),
         never a blend of the two, so the front is a scatter of hard square cells, never a feathered ring. A few cells
         just short of turning glint pale lilac: the sparkle at the edge of the light */
      const { cols, rows, a, b, show, face, phase, ord, thr, seam, wake, floor } = this, px = this.image.data, wo = this.pord || ord;
      for (let y = 0, i = 0; y < rows; y++) {
        const ny = (y + 0.5) / rows - 0.5, edge = (2 * phase - 1) * Math.sqrt(Math.max(0, 0.25 - ny * ny));   // the terminator
        for (let x = 0; x < cols; x++, i++) {
          const j = i * 4, t = ord[i], th = thr[i];
          if (ramp(show, t) <= th) { px[j + 3] = 0; continue; }
          let al = 1;
          if (phase < 1) { const q = (edge - ((x + 0.5) / cols - 0.5)) * cols * 0.6 + 0.5; al = q <= 0 ? 0 : q >= 1 ? 1 : q; if (al <= 0) { px[j + 3] = 0; continue; } }
          const L = b && ramp(face, t) > th ? b : a;
          let wk = floor ? ramp(floor, t) : 0;
          if (wake) { const w2 = ramp(wake, wo[i]); if (w2 > wk) wk = w2; }
          if (wk > th) { const W = L.wake; px[j] = W[j]; px[j + 1] = W[j + 1]; px[j + 2] = W[j + 2]; px[j + 3] = W[j + 3] * al; continue; }
          const S = L.sleep;
          if (wk > 0 && wk > th - 0.22 && seam[i] < 0.3) { px[j] = S[j] + (236 - S[j]) * 0.75; px[j + 1] = S[j + 1] + (226 - S[j + 1]) * 0.75; px[j + 2] = S[j + 2] + (255 - S[j + 2]) * 0.75; }
          else { px[j] = S[j]; px[j + 1] = S[j + 1]; px[j + 2] = S[j + 2]; }
          px[j + 3] = S[j + 3] * al;
        }
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
    /** a bitmap's frame: every cell is either asleep (ink, ground or nothing) or awake (its colour), never between. A cell
        turns when the light spreading out to it passes its Bayer threshold, so the front breaks up cell by cell */
    drawBits() {
      const { cols, rows, a, b, show, face, ord, thr, ink, paper, wake, floor } = this, px = this.image.data, wo = this.pord || ord;
      for (let i = 0, n = cols * rows; i < n; i++) {
        const j = i * 4, t = ord[i], th = thr[i];
        const s = b && ramp(face, t) > th ? b : a;
        if (!s.inside[i] || ramp(show, t) <= th) { px[j + 3] = 0; continue; }
        let wk = floor ? ramp(floor, t) : 0;
        if (wake) { const w2 = ramp(wake, wo[i]); if (w2 > wk) wk = w2; }
        if (wk > th) { px[j] = s.col[j]; px[j + 1] = s.col[j + 1]; px[j + 2] = s.col[j + 2]; px[j + 3] = 255; }
        else if (s.on[i]) { px[j] = ink[0]; px[j + 1] = ink[1]; px[j + 2] = ink[2]; px[j + 3] = 255; }
        else if (paper) { px[j] = paper[0]; px[j + 1] = paper[1]; px[j + 2] = paper[2]; px[j + 3] = 255; }
        else px[j + 3] = 0;
      }
      this.ctx.putImageData(this.image, 0, 0);
    }
    /** move show, wake or face to a value; resolves when it arrives */
    to(prop, target, ms, delay = 0) {
      cancelAnimationFrame(this.timers[prop]); clearTimeout(this.timers[prop + "d"]);
      return new Promise((done) => {
        const start = () => {
          if (ms <= 0) { this[prop] = target; this.draw(); return done(); }
          const from = this[prop], t0 = performance.now();
          const step = (now) => { const k = Math.min(1, (now - t0) / ms); this[prop] = from + (target - from) * k; this.draw(); if (k < 1) this.timers[prop] = requestAnimationFrame(step); else done(); };
          this.timers[prop] = requestAnimationFrame(step);
        };
        delay ? (this.timers[prop + "d"] = setTimeout(start, delay)) : start();
      });
    }
    /** bitmap to colour, then the sharp picture takes over */
    /* at: where the pointer came in, as fractions of the picture, if it did */
    async wakeUp(ms = 300, delay = 0, at) {
      clearTimeout(this.timers.rest); this.awake = true; this.pic.classList.add("woken");
      try { await this.load(); } catch { this.pic.classList.add("plain"); return; }
      this.aim(at);
      await this.to("wake", 1, ms, delay); this.sync();
    }
    /** where the light spreads from: from the point the pointer came in at, drawn halfway to the middle so the far side
        is not left waiting; a round picture (the moon, data-round) and a wake with no pointer spread from the middle.
        A picture still part awake keeps the point it has, so its light never jumps; it goes back to sleep toward it */
    aim(at) {
      if (this.wake > 0 || !this.ord) return;
      const round = this.kind === "moon" || this.pic.hasAttribute("data-round"), c = (v) => Math.min(1, Math.max(0, v));
      const o = at && !round ? [0.5 + (c(at[0]) - 0.5) * 0.5, 0.5 + (c(at[1]) - 0.5) * 0.5] : null;
      if (String(o) === String(this.origin)) return;
      this.origin = o; this.pord = o ? this.orderFrom(o[0], o[1]) : null;
    }
    sleep(ms = 200) { clearTimeout(this.timers.rest); this.awake = false; this.pic.classList.remove("woken"); if (this.floor < 1) this.pic.classList.remove("awake"); return this.to("wake", 0, ms); }
    /** once revealed, a picture stays in colour after the pointer leaves, then dissolves back into its bitmap */
    rest(hold = 60000, ms = 900) { clearTimeout(this.timers.rest); this.timers.rest = setTimeout(() => this.sleep(ms), hold); }
    /** the sharp picture shows only while the bitmap is all colour */
    sync() { this.pic.classList.toggle("awake", Math.max(this.wake, this.floor) >= 1); }
    /** set by the scroll, every frame it moves: in steps of 1/64, fine enough that the front glides */
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
      // the light spreads from where the pointer came in (read once, at the moment it comes in)
      const at = (e) => { const r = p.getBoundingClientRect(); return r.width && r.height ? [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height] : null; };
      p.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && b.wakeUp(320, 0, at(e)));
      p.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") b.rest(); });
      // on a touch screen a tap does what hovering does: the picture wakes and stays awake for a while. The wake waits for
      // the finger to lift in place, so a swipe that starts on a picture only scrolls: the browser cancels the pointer
      // once it takes the gesture for a scroll, and a finger that slides further than a tap never wakes anything.
      // Nothing here blocks the scroll (the listeners are passive and prevent nothing), and pictures inside a link or
      // button are left out, so their own click is never answered twice.
      let down = null;
      p.addEventListener("pointerdown", (e) => { down = e.pointerType === "touch" ? { id: e.pointerId, x: e.clientX, y: e.clientY } : null; }, { passive: true });
      p.addEventListener("pointercancel", () => { down = null; }, { passive: true });
      p.addEventListener("pointerup", (e) => {
        const d = down; down = null;
        if (d && d.id === e.pointerId && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 10) { b.wakeUp(320, 0, at(e)); b.rest(); }
      }, { passive: true });
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
    const active = HOVER && pointerIn, R = u() * 3.4;
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
  /* while the page itself is moving its frame is coming anyway, and reads the letters in its read pass; the pointer's
     own frame then stands aside, since it would run after the page's writes and make the browser lay the page out a
     second time in that frame */
  const frame = () => { raf = 0; if (frameReq) return; light(lettersAt()); };
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
    if (!old) { box.replaceChildren(next); return; }
    old.classList.remove("wipe-in"); old.classList.add("wipe-out");
    next.classList.add("wipe-in");
    box.append(next);
    setTimeout(() => old.remove(), 160);
    setTimeout(() => next.classList.remove("wipe-in"), 240);
  };


  /* ====================================================================== scroll
     1. The wheel is the browser's own. The page once eased toward a wheel target itself, frame by frame, but that
        put every step of the scroll on the page's own thread, so any heavy frame held the scroll up and the page felt
        heavy; the browser scrolls on its own thread and already smooths the wheel. glide() still eases the moves the
        page makes itself (a link, an arrow), with the browser's smooth scrolling.
     2. Scrubbing. Everything that moves with the scroll registers a function with scrub(); all of them run once a
        frame while the page moves, and once after a resize. Nothing that the scroll moves runs on a timer, so it
        moves exactly as far as you scroll and goes back when you scroll back. */
  const scrubs = new Set();
  let travelling = false;
  // (sy and target are set from the page's own position before either is used: see frameLoop, glide and the wheel)
  let sy = 0, target = 0, gliding = false, lastT = 0, frameReq = 0;
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - VH);
  const smoothOn = () => false;
  /* the scroll position is read from the browser only once after the page has moved, and kept until it moves again:
     reading scrollY after a style has been written makes the browser restyle and lay out the page on the spot, so
     every scrub that asked for it would pay for a fresh layout. It is first read when first asked for, not as this
     script runs: on a phone, reading it while the page is still loading lays the whole page out once more */
  let lastY = 0, moved = true;
  const readY = () => { if (moved) { moved = false; lastY = scrollY; } return lastY; };
  const runScrubs = () => scrubs.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
  /* measures: functions that only read the page, run each frame the page moves before any scrub writes, so whatever
     they read costs no extra layout; each gets the frame's time, which every other frame callback also gets */
  const measures = new Set();
  const runMeasures = (now) => measures.forEach((fn) => { try { fn(now); } catch (e) { console.error(e); } });
  let mainEl = null;
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
    // the stops' places are measured again here, in the read pass, whenever something has changed size since the last
    // frame, so that a scrub asking where a stop is (where, rectOf) finds them kept instead of laying the page out after
    // the writes of the scrubs before it
    const first = (mainEl ||= document.querySelector("main"))?.firstElementChild;
    if (first) rectOf(first);
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
  // (not even listened to while the browser scrolls: a wheel listener that may cancel the scroll makes the browser
  // wait for the page before every step of it)
  if (smoothOn()) addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.defaultPrevented) return;
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
  /* a stop that changes size moves every stop under it, so the page is drawn again at once, not at the next scroll: a
     fold opened in About pushes Contact down, and the dawn, still placed for where Contact was, would rise over it */
  const resized = new ResizeObserver(() => { gen++; kick(); });
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

  /* ====================================================================== the bloom
     One picture handing over to the next. Moonlight blooms out from a point on the picture in coarse square cells
     (about one u across, never finer than 14px), so the picture comes in cell by cell, the hard squares a drawn object
     wakes in, and only the picture: its words and its world hand over in their own ways (reel.js). Each cell has its
     place in the order from how far it is from the bloom's centre, broken up by a little noise of its own; near the
     centre the cells turn in blocks of four by four, then two by two, then one by one, so the bloom starts coarse and
     refines as it spreads. Just ahead of the front a few cells sparkle: small squares of pale moonlight, a third of a
     cell across, lavender at the picture's side and gold at the leading edge, with a few loose ones strayed beyond.
     Going, a picture breaks the same way: from the centre out, past a few last sparks.

     bloom(el, s, snap): s runs from 0 (not there) through 1 (whole) to 2 (gone). The picture is cut by a mask, a tiny
     one-bit image with one pixel to a cell (a BMP, written here byte by byte, white where the picture shows), scaled up
     with its pixels kept square (image-rendering: pixelated on the picture while it is cut, given back to everything
     inside it in moon.css), so every edge is hard at any size and the browser only scales a small bitmap. An SVG mask
     had to be built as a document of its own at every step, and a PNG had to be compressed, each costing more than the
     rest of the frame. The sparkles are drawn on a small canvas over the picture, three canvas pixels to a cell. The
     steps for each picture size are made once and kept, and made ahead while the page is idle. A picture's size comes
     from a ResizeObserver, so nothing is read from the page while the scroll moves it. data-bloom="x y" (fractions of
     the picture) puts the centre where the light should come from; otherwise each picture has its own. */
  const BLOOM = 64, RIM = 0.08, LOOSE = 0.7;
  const bloomHash = cellHash;
  const bloomCell = () => Math.max(14, Math.round(u() * 1.15));
  /* a grid: every cell's place in the order (0 first to 1 last), and whether it may stray ahead of the rim */
  const grids = new Map(), warmQueue = [];
  const gridFor = (cols, rows, cx, cy) => {
    const key = `${cols}x${rows}@${cx.toFixed(2)},${cy.toFixed(2)}`;
    let g = grids.get(key);
    if (g) { grids.delete(key); grids.set(key, g); return g; }   // kept in the order last used
    const n = cols * rows, o = new Float32Array(n), loose = new Uint8Array(n), spark = new Float32Array(n), ox = cx * cols, oy = cy * rows;
    const far = Math.max(Math.hypot(ox, oy), Math.hypot(cols - ox, oy), Math.hypot(ox, rows - oy), Math.hypot(cols - ox, rows - oy));
    const small = Math.min(cols, rows), dist = (x, y) => Math.hypot(x - ox, y - oy) / far;
    let lo = Infinity, hi = -Infinity;
    for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
      // the block a cell turns with: four by four right at the centre, two by two further out, then alone
      let b = 1;
      if (small >= 14 && dist((((x >> 2) << 2) + 2), (((y >> 2) << 2) + 2)) < 0.16) b = 4;
      else if (small >= 6 && dist((((x >> 1) << 1) + 1), (((y >> 1) << 1) + 1)) < 0.45) b = 2;
      const bx = Math.floor(x / b) * b, by = Math.floor(y / b) * b;
      const v = dist(bx + b / 2, by + b / 2) * 0.8 + bloomHash(bx, by, b) * 0.2;
      o[i] = v; if (v < lo) lo = v; if (v > hi) hi = v;
      loose[i] = bloomHash(x, y, 9) < 0.08 ? 1 : 0;
      spark[i] = bloomHash(x, y, 11);   // each cell's own chance of sparkling at the front, so the sparkles are a scatter of single cells
    }
    for (let i = 0; i < n; i++) o[i] = ((o[i] - lo) / Math.max(1e-6, hi - lo)) * 0.9999;
    g = { key, cols, rows, o, loose, spark, lv: new Map() };
    grids.set(key, g);
    // only the grids last used keep their steps: the oldest let go of theirs
    if (grids.size > 24) { const old = grids.keys().next().value; grids.get(old).lv.clear(); grids.delete(old); }
    warmQueue.push(g); warmSoon();
    return g;
  };
  /* a one-bit BMP of w x h pixels as a CSS url(), white where on(i) (i counts across each row from the top left) and
     black elsewhere; used as a luminance mask. A BMP needs no compression, so it is written in a moment */
  const bmpUrl = (w, h, on) => {
    const row = ((w + 31) >> 5) << 2, size = 62 + row * h, b = new Uint8Array(size), v = new DataView(b.buffer);
    b[0] = 66; b[1] = 77; v.setUint32(2, size, true); v.setUint32(10, 62, true);
    v.setUint32(14, 40, true); v.setInt32(18, w, true); v.setInt32(22, -h, true); v.setUint16(26, 1, true); v.setUint16(28, 1, true);
    v.setUint32(34, row * h, true); v.setUint32(46, 2, true);
    b[58] = b[59] = b[60] = 255;   // the palette: 0 black, 1 white
    for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i++) if (on(i)) b[62 + y * row + (x >> 3)] |= 128 >> (x & 7);
    let str = "";
    for (let i = 0; i < size; i += 4096) str += String.fromCharCode.apply(null, b.subarray(i, i + 4096));
    return `url("data:image/bmp;base64,${btoa(str)}")`;
  };
  /* one step of a grid: the mask, as CSS, and the sparkles, as a list of cells (each cell's index times two, plus one
     for a gold one). S runs from 1 to BLOOM - 1 coming in, BLOOM + 1 to 2 BLOOM - 1 going */
  const bloomStep = (g, S) => {
    let st = g.lv.get(S);
    if (st) return st;
    const going = S > BLOOM, L = going ? S - BLOOM : S, { cols, rows, o, loose, spark } = g, n = cols * rows;
    // the front: coming in, the picture is every cell before it; going, every cell after its rim
    const t = going ? -RIM + ((1 + RIM * (1 + LOOSE)) * L) / BLOOM : -RIM * (1 + LOOSE) + ((1 + RIM * (1 + LOOSE)) * L) / BLOOM;
    /* 0 nothing, 1 the picture, 2 the picture with a lavender sparkle, 3 with a gold one. At the front a cell sparkles
       by its own chance, more often the nearer it is to the picture, so the sparkles are a light scatter, never a band */
    const kind = (i) => {
      const v = o[i];
      if (going) {
        if (v >= t + RIM) return 1;
        if (v >= t) { const f = (v - t) / RIM; return spark[i] < 0.08 + 0.22 * f ? (f > 0.45 ? 2 : 3) : 1; }
        return v >= t - RIM * LOOSE && loose[i] ? 3 : 0;
      }
      if (v < t) return 1;
      if (v < t + RIM) { const f = (v - t) / RIM; return spark[i] < 0.34 - 0.24 * f ? (f < 0.45 ? 2 : 3) : 0; }
      return v < t + RIM * (1 + LOOSE) && loose[i] ? 3 : 0;
    };
    const ks = new Uint8Array(n);
    let shown = 0, lit = 0;
    for (let i = 0; i < n; i++) { const k = (ks[i] = kind(i)); if (k) shown++; if (k > 1) lit++; }
    let rim = null;
    if (lit) { rim = new Int32Array(lit); for (let i = 0, k = 0; i < n; i++) if (ks[i] > 1) rim[k++] = i * 2 + (ks[i] === 3 ? 1 : 0); }
    st = { mask: shown ? bmpUrl(cols, rows, (i) => ks[i]) : "hide", rim };
    g.lv.set(S, st);
    return st;
  };
  /* every step of the grids met lately is made while the page is idle, so a handover only looks its steps up */
  let warming = 0;
  const warmSoon = () => { if (!warming) warming = (window.requestIdleCallback || ((f) => setTimeout(() => f({ timeRemaining: () => 6 }), 80)))(warm); };
  const warm = (dl) => {
    warming = 0;
    while (warmQueue.length && dl.timeRemaining() > 2) {
      const g = warmQueue[0];
      if (!grids.has(g.key)) { warmQueue.shift(); continue; }
      let S = 1;
      while (S < 2 * BLOOM && (S === BLOOM || g.lv.has(S))) S++;
      if (S >= 2 * BLOOM) { warmQueue.shift(); continue; }
      bloomStep(g, S);
    }
    if (warmQueue.length) warmSoon();
  };
  /* each picture's grid follows its size; the centre is the picture's own */
  const bloomRO = new ResizeObserver((es) => es.forEach((e) => {
    const el = e.target, bs = e.borderBoxSize?.[0], w = bs ? bs.inlineSize : e.contentRect.width, h = bs ? bs.blockSize : e.contentRect.height;
    if (el._bpos == null) { el._bpos = getComputedStyle(el).position; if (el._bpos === "static") el.style.position = "relative"; }
    sizeBloom(el, w, h);
  }));
  const sizeBloom = (el, w, h) => {
    const cell = bloomCell(), cols = Math.max(3, Math.round(w / cell)), rows = Math.max(3, Math.round(h / cell));
    if (!w || !h) { el._bg = null; return; }
    if (el._bg && el._bg.cols === cols && el._bg.rows === rows) return;
    if (!el._bc) {
      const at = (el.dataset.bloom || "").split(/\s+/).map(Number);
      el._bc = at.length === 2 && at.every((v) => v >= 0 && v <= 1) ? at : [0.3 + 0.4 * bloomHash(cols, rows, 3), 0.3 + 0.35 * bloomHash(rows, cols, 5)];
    }
    el._bg = gridFor(cols, rows, el._bc[0], el._bc[1]);
    if (el._bs != null) paintBloom(el, el._bs, true);
  };
  const paintBloom = (el, S, again) => {
    const st = el.style;
    let vis = true, mask = "none", rim = null;
    if (S <= 0 || S >= 2 * BLOOM) vis = false;
    else if (S !== BLOOM) {
      // until the picture's size is known it simply cuts over at the middle of its coming or going
      if (!el._bg) vis = S < BLOOM ? S >= BLOOM / 2 : S < BLOOM * 1.5;
      else { const s = bloomStep(el._bg, S); if (s.mask === "hide") vis = false; else { mask = s.mask; rim = s.rim; } }
    }
    // a shown picture takes its visibility from what holds it, not "visible": a plate the reel has hidden must hide its
    // pictures too, even one left part way through its bloom when a fast fling went by
    const v = vis ? "" : "hidden";
    if (el._bv !== v) { el._bv = v; st.visibility = v; }
    if (el._bk !== mask || again) {
      el._bk = mask;
      st.webkitMaskImage = st.maskImage = mask;
      // the mask's pixels stay square as it is scaled up (moon.css gives everything inside the picture back its own smoothing)
      st.imageRendering = mask !== "none" ? "pixelated" : "";
      if (mask !== "none") { st.maskMode = "luminance"; st.webkitMaskSize = st.maskSize = "100% 100%"; st.webkitMaskRepeat = st.maskRepeat = "no-repeat"; }
    }
    if (el._br !== rim || again) {
      el._br = rim;
      let gl = el._gl;
      if (rim && (!gl || gl.parentNode !== el)) {
        gl = el._gl = gl || Object.assign(document.createElement("canvas"), { className: "glint" });
        gl.setAttribute("aria-hidden", "true");
        gl.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;pointer-events:none;image-rendering:pixelated";
        el.append(gl);
      }
      if (gl) {
        gl.style.display = rim ? "block" : "none";
        if (rim) {
          const g = el._bg, W = g.cols * 3, H = g.rows * 3;
          if (gl.width !== W || gl.height !== H) { gl.width = W; gl.height = H; }
          const x = gl.getContext("2d");
          x.clearRect(0, 0, W, H);
          // each sparkle is the middle pixel of its cell's three by three, so it is a third of a cell across
          for (let gold = 0; gold < 2; gold++) {
            x.fillStyle = gold ? "rgb(255 241 201 / 0.96)" : "rgb(201 182 255 / 0.9)";
            for (let k = 0; k < rim.length; k++) {
              if ((rim[k] & 1) !== gold) continue;
              const i = rim[k] >> 1;
              x.fillRect((i % g.cols) * 3 + 1, ((i / g.cols) | 0) * 3 + 1, 1, 1);
            }
          }
        }
      }
    }
  };
  /* a bloom never jumps: however fast the page is flung, the picture closes a third of the way to the scroll's step
     each frame (at least one step), so a fling catches up within a few frames with the stages between shown in passing,
     and a slow scroll, a step or two a frame, is followed exactly. The steps are taken in the page's own frame, among
     the scrubs, after the frame's read pass: a frame of their own would write before the page's frame reads the scroll,
     and make it lay the page out on the spot. While a picture is still catching up, the page's frame is asked for again. */
  const chasing = new Set();
  // while the page glides its frame asks for the next one itself, so asking here too would run it twice a frame
  const again = () => { if (!gliding) kick(); };
  scrub(() => {
    if (!chasing.size) return;
    for (const el of chasing) {
      const d = el._bt - el._bs;
      if (!d) { chasing.delete(el); continue; }
      el._bs += Math.sign(d) * Math.max(1, Math.ceil(Math.abs(d) / 3));
      paintBloom(el, el._bs);
      if (el._bs === el._bt) chasing.delete(el);
    }
    if (chasing.size) again();
  });
  /** el's picture at s: 0 not there, 1 whole, 2 gone. snap goes straight there (for a picture no one can see). */
  const bloom = (el, s, snap) => {
    if (!el._bw) { el._bw = true; bloomRO.observe(el); }
    const B = BLOOM, S = Math.round(Math.min(2, Math.max(0, s)) * B);
    el._bt = S;
    if (el._bs == null || snap || Math.abs(S - el._bs) <= 2) {
      if (el._bs !== S) { el._bs = S; paintBloom(el, S); }
      chasing.delete(el);
      return;
    }
    chasing.add(el); again();
  };

  /* ====================================================================== stops, masthead, live line */
  const stops = [], listeners = [];
  const live = $("#live"), sub = $("#sub"), issue = $("#issue-stop"), route = $("#route");
  const rest = { live: live?.textContent || "", sub: sub?.textContent || "" };
  let current = null;
  /** say what is awake, or nothing to return to the resting line */
  const say = (text) => {
    const hero = !document.body.classList.contains("past");
    // each line is written only when its words change, so a screen reader is not told the same thing over and over;
    // a stop whose hint is empty (the posters, whose pegs say it all) leaves the foot line empty
    const a = hero && text ? text : rest.sub, b = !hero && text ? text : (current?.dataset.hint ?? rest.live);
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
  /* A band only cross-fades a jump (a new tone, or the page's own colours given back). The small steps the scroll makes
     while it blends one world into the next are written as they are, with the band's transition off: a transition
     started again every frame would run on the main thread and restyle the whole band and everything in it each frame,
     for a fade nobody can see. A jump keeps the fade on for as long as the fade takes, so the steps that follow it do not
     cut it short. */
  const JUMP = 20, FADE = 260;
  const band = (t, which) => {
    const vals = t ? BAND.map((p) => cssOf(t[p])) : null, key = vals ? vals.join() : "";
    for (const k of which ? [which] : ["mast", "foot"]) {
      const el = bands[k];
      if (!el || el._band === key) continue;
      el._band = key;
      const was = el._tone, now = performance.now();
      if (!t || !was || BAND.some((p) => t[p].some((v, i) => Math.abs(v - was[p][i]) > (i === 3 ? 0.08 : JUMP)))) el._fadeTill = now + FADE;
      el._tone = t;
      const fade = now < (el._fadeTill || 0);
      if (el._fade !== fade) { el._fade = fade; el.style.transition = fade ? "" : "none"; }
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
      // the tile is drawn in plain memory rather than on the graphics card (willReadFrequently), because it is read
      // straight back out as an image: reading a card's canvas waits for everything the card has queued, which on the
      // first frames, while the room is being drawn, held the page still for a long moment
      const x = c.getContext("2d", { willReadFrequently: true }); x.fillStyle = "#000";
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
    // (a page with the room intro marks itself past, room-proto.js, so the page is not laid out here for nothing)
    if (document.body.dataset.route !== "room") past();
    tick();
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", start) : start();
  /* coming back. The page builds much of its own height after it has loaded (the rooms set how long they are, the type
     comes in), so the browser's own return to the old place lands short, and a #stop in the address would send it to
     that stop's top. Instead, the place is kept as the stop the window's top was in and how far into it, when the page
     is left; coming back (or reloading), the page is put there again under the veil, and again each time more of it is
     built, until it is all there or the visitor moves it. A page kept whole by the browser comes back as it was. */
  try { history.scrollRestoration = "manual"; } catch (e) {}
  const PLACE = "place:" + location.pathname;
  addEventListener("pagehide", () => {
    let at = null, top = 0;
    for (const s of stops) { const r = s.getBoundingClientRect(); if (r.top <= 0 && r.bottom > 0) { at = s; top = r.top; break; } }
    try { sessionStorage.setItem(PLACE, JSON.stringify({ y: scrollY, id: at?.id || "", off: -top })); } catch (e) {}
  });
  const comeBack = () => {
    const how = performance.getEntriesByType?.("navigation")[0]?.type;
    let place = null;
    if (how === "back_forward" || how === "reload") try { place = JSON.parse(sessionStorage.getItem(PLACE) || "null"); } catch (e) {}
    if (!place) return;
    const put = () => {
      if (!place) return;
      const s = place.id && document.getElementById(place.id);
      glide(s ? s.getBoundingClientRect().top + scrollY + place.off : place.y, true);
    };
    const leave = () => { place = null; MOVES.forEach((t) => removeEventListener(t, leave, true)); };
    const MOVES = ["wheel", "touchstart", "keydown", "pointerdown"];
    MOVES.forEach((t) => addEventListener(t, leave, { capture: true, passive: true }));
    put(); requestAnimationFrame(put);
    const built = [new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true }))), document.fonts?.ready, SM.roomReady].filter(Boolean);
    built.forEach((p) => p.then(put, put));
    Promise.all(built.map((p) => p.catch(() => {}))).then(() => requestAnimationFrame(() => { put(); leave(); }));
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", comeBack) : setTimeout(comeBack);
  /** travel to a stop */
  /** where a stop is arrived at: its top, or for data-land="end" its last screen */
  const landing = (el) => el.getBoundingClientRect().top + scrollY + (el.dataset.land === "end" ? Math.max(0, el.offsetHeight - VH) : 0);
  const go = (id) => { const el = document.getElementById(id); if (el) glide(landing(el)); };
  /* ====================================================================== travel
     A jump between stops: an iris of coarse square cells in the next stop's own ground colour closes from the point you
     chose, stepped like a pixel circle, with a row of loose cells strayed beyond its edge and a few cells of the stop's
     ink glinting among them. The stop's numeral and name stand in it for a moment, you are moved there, and the iris
     opens again from the middle, its edge breaking up the same way. The cells are fixed to the window and each loose
     cell has its own fixed chance, so the edge steps outward without flickering.
     travel(id, { x, y }, { onJump }) resolves when the iris has opened. Quiet mode jumps at once. */
  let iris = null;
  document.fonts?.load("64px Redaction").catch(() => {});
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const colourOf = (el, v) => (el.dataset[v] || getComputedStyle(el).getPropertyValue("--" + v) || (v === "ground" ? "#0c0620" : "#b9a2ff")).trim();
  const travel = (id, from, opts = {}) => {
    const el = document.getElementById(id);
    if (!el) return Promise.resolve();
    const jump = () => { glide(landing(el), true); history.replaceState(null, "", "#" + id); opts.onJump?.(); };
    if (travelling) return Promise.resolve();
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
    /* the cells: about one and a half u across, squared to the window's pixels so no edge is ever smoothed. A loose cell
       stands within EDGE cells of the circle's edge, more likely the nearer it is */
    const cell = Math.max(16, Math.round(u() * 1.5)), cols = Math.ceil(W / cell), rows = Math.ceil(H / cell), EDGE = 1.8;
    const chance = (x, y, s) => { let h = (x * 374761393 + y * 668265263 + s * 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const X = (x) => Math.round(x * cell * dpr), Y = (y) => Math.round(y * cell * dpr);
    const fill = (x0, x1, y) => { if (x1 >= x0) c.fillRect(X(x0), Y(y), X(x1 + 1) - X(x0), Y(y + 1) - Y(y)); };
    const order = (ox, oy) => ({ ox, oy, far: Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy)) + EDGE * cell * 1.5 });
    /* p from 0 to 1: closing, the circle of ground grows from (ox, oy) until it covers the window; opening, a hole grows
       in it from the middle. Each row is one run of whole cells (the stepped circle), plus the loose cells near the edge */
    const paint = (t, p, closing) => {
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, iris.width, iris.height);
      const r = p * t.far, R = r + EDGE * cell, r0 = Math.max(0, r - EDGE * cell), glints = [];
      c.fillStyle = ground;
      for (let y = 0; y < rows; y++) {
        const dy = (y + 0.5) * cell - t.oy;
        // the run of cells whose middles are inside the circle
        const span = (rad) => { const q = rad * rad - dy * dy; if (q <= 0) return null; const hw = Math.sqrt(q); return [Math.ceil((t.ox - hw) / cell - 0.5), Math.floor((t.ox + hw) / cell - 0.5)]; };
        const a = span(r), out = span(closing ? R : r), inn = closing ? a : span(r0);
        if (closing) { if (a) fill(Math.max(0, a[0]), Math.min(cols - 1, a[1]), y); }
        else if (!a) fill(0, cols - 1, y);
        else { fill(0, Math.min(cols - 1, a[0] - 1), y); fill(Math.max(0, a[1] + 1), cols - 1, y); }
        // the loose cells: closing, just outside the edge; opening, just inside the hole
        if (!out) continue;
        for (let x = Math.max(0, out[0]); x <= Math.min(cols - 1, out[1]); x++) {
          if (inn && x >= inn[0] && x <= inn[1]) { x = inn[1]; continue; }
          const d = Math.hypot((x + 0.5) * cell - t.ox, dy);
          const near = closing ? 1 - (d - r) / (R - r) : 1 - (r - d) / (r - r0 || 1);
          if (closing ? d <= r : d > r) continue;
          const ch = chance(x, y, 1);
          if (ch < 0.62 * near) fill(x, x, y);
          if (ch < 0.1 * near) glints.push(x, y);
        }
      }
      c.globalCompositeOperation = "source-atop"; c.drawImage(card, 0, 0);
      // a few loose cells catch the stop's ink, a glint at the edge
      c.globalCompositeOperation = "source-over"; c.fillStyle = ink;
      for (let i = 0; i < glints.length; i += 2) fill(glints[i], glints[i], glints[i + 1]);
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
      try { sessionStorage.setItem("quiet", on ? "1" : "0"); } catch (e) {}
      tick();
    });
  }

  /* ====================================================================== viewer: SM.view([{ src, w, h, alt, cap }], index) */
  let box, items = [], at = 0, opener = null;
  /** a picture someone asked for blooms in over a third of a second. It is a click, not the
      scroll, so its size is read here, and every step is drawn as it comes */
  const reveal = (el, ms = 340) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    sizeBloom(el, r.width, r.height);
    const t0 = performance.now();
    const step = (now) => { const q = Math.min(1, (now - t0) / ms); bloom(el, 1 - Math.pow(1 - q, 3), true); if (q < 1) requestAnimationFrame(step); };
    bloom(el, 0, true); requestAnimationFrame(step);
  };
  const showItem = (i) => {
    at = (i + items.length) % items.length; const it = items[at];
    $("figure", box).innerHTML = `<img src="${it.src}" width="${it.w}" height="${it.h}" alt="${it.alt || ""}" draggable="false">`;
    reveal($("figure", box));
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
      // a swipe across the picture goes to the next or the one before; the click that ends a swipe does not close the viewer
      let down = null, swiped = false;
      box.addEventListener("pointerdown", (e) => { down = e.isPrimary ? { x: e.clientX, y: e.clientY } : null; swiped = false; });
      box.addEventListener("pointerup", (e) => {
        if (!down || items.length < 2) return;
        const dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) { swiped = true; showItem(at + (dx < 0 ? 1 : -1)); }
      });
      box.addEventListener("click", (e) => { if (swiped) { swiped = false; return; } if (e.target === box || e.target.tagName === "FIGURE") box.close(); });
      box.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") showItem(at - 1); if (e.key === "ArrowRight") showItem(at + 1);
        // Tab goes round the viewer's own buttons and never out of it to the page or the browser behind
        if (e.key === "Tab") {
          const bs = $$("button", box).filter((b) => !b.hidden), k = bs.indexOf(document.activeElement);
          if (!bs.length) return;
          e.preventDefault();
          bs[(k < 0 ? (e.shiftKey ? bs.length - 1 : 0) : k + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus();
        }
      });
      box.addEventListener("close", () => opener?.isConnected && opener.focus({ preventScroll: true }));
    }
    // the focus goes back to what opened the viewer: the thing that was clicked, or else whatever had the focus (a
    // browser that does not focus a button when it is clicked would otherwise send the focus back to the page's top)
    const hit = lastClick && performance.now() - lastClick.t < 600 ? lastClick.el.closest("button, a[href], [tabindex]") : null;
    items = list; opener = hit || document.activeElement; showItem(i); box.showModal();
  };
  let lastClick = null;
  addEventListener("click", (e) => { if (e.target instanceof Element) lastClick = { el: e.target, t: performance.now() }; }, true);

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

  /* the arrow keys of a row of pieces that is also a pager. They count from the piece that has focus, not from the piece
     the room is showing, so a keyboard user who has tabbed along the row is never sent back; Home and End go to the ends.
     The focus ring moves first and the room follows it with go(index). */
  /* while the arrows move the focus, SM.arrowing is true: a room's own focus listener, which brings the room to an item
     reached by Tab at once, leaves it alone then, so the page glides to the item (go) instead of jumping first */
  let arrowing = false;
  const arrows = (el, items, current, go) => el.addEventListener("keydown", (e) => {
    const at = items.indexOf(document.activeElement), from = at < 0 ? current() : at;
    const k = { ArrowRight: from + 1, ArrowLeft: from - 1, Home: 0, End: items.length - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault(); e.stopPropagation();
    const j = Math.max(0, Math.min(items.length - 1, k));
    arrowing = true;
    try { items[j].focus({ preventScroll: true }); } finally { arrowing = false; }
    go(j);
  });
  return { $, $$, u, quiet, HOVER, COLUMN, Bitmap, pictures, bitmap, type, swap, say, go, glide, scrub, where, whenNear, smooth, bloom, band, tone, blend, travel, view, wakeable, arrows, stars, tick, moonSvg, start, arrow, corners, steps, setSteps, landing, onStop: (fn) => listeners.push(fn), get stop() { return current; }, get placedGen() { return gen; }, get moving() { return !!frameReq; }, get arrowing() { return arrowing; }, measure: (fn) => { measures.add(fn); return () => measures.delete(fn); }, get y() { return readY(); }, get vw() { return VW; }, get vh() { return VH; } };
})();
