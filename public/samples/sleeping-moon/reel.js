/* The reel: one thing at a time as you scroll, each in its own world.

   The stop is tall and its stage sticks to the window. Scrolling moves a number q from 0 to n-1. Plate floor(q)
   is shown; near the end of each step the next plate takes over from it, each part of the plate in its own way, all
   moved by the same scroll and going back when you scroll back:
     the pictures (data-bloom) bloom: the new ones bloom in over the old from their centres, in coarse square cells
       behind a few pale sparkles, and the old ones break up under them after (SM.bloom, in moon.js), so there is
       always a picture there;
     the words leave letter by letter, lifting and fading, and the next plate's come in letter by letter, its title
       spelled out of runes first (SM.letters, below);
     the world, its ground, its backdrop and its light, blends smoothly from one to the next.
   While a plate is shown it keeps drifting a little with the scroll, so no scroll is ever a dead one. Each plate is its
   thing's own world: its ground colour, its ink, and its backdrop cut into flat tones. Brands and products use it.
   Every value the scroll moves is written straight onto the element it moves, and only when it changes (see reel.css).

   SM.reel(stop, items, { step, stack, onChange, onScrub })
   item: { name, ground, ink, backdrop, board(i, n): html, setup(plate, item, i) } */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  /** ["Logo", "Key visual", "Merch"] as "logo, key visual and merch" */
  const list2 = (a) => a.map((r) => esc(r.charAt(0).toLowerCase() + r.slice(1))).join(", ").replace(/, ([^,]*)$/, " and $1");
  const MONTHS = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
  const longDate = (d) => String(d).replace(/^([A-Z][a-z]{2})\b/, (m) => MONTHS[m] || m);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const lum = (h) => { const [r, g, b] = hex(h); return 0.299 * r + 0.587 * g + 0.114 * b; };
  /** a world's two colours, the darker as the ground */
  SM.world = (a, b) => (lum(a) <= lum(b) ? { ground: a, ink: b } : { ground: b, ink: a });
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const sm = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
  /** write one style property of an element only when its value changes ("" gives it back to the stylesheet) */
  const set = (el, prop, v) => { const c = el._sv || (el._sv = {}); if (c[prop] !== v) { c[prop] = v; el.style[prop] = v; } };

  /* ================================================================ the words' handover
     A column of words (.pk-text) is split once, as it first takes part in a handover: the title into letters (the same
     .ch letters words-proto.js lights under the pointer, so it reuses them), each short line into words of letters,
     a long line and an italic one into words (single letters would break the italic's kerning), and anything else
     (links, the steps) is kept whole. Each piece has k, its place in the reading order from 0 to 1, the title taking
     the first third. drive(box, w, lv, en) then moves them:
       w, 0 to 1, how far the column has arrived with its plate: its lines come in one after another;
       lv, 0 to 1, how far the words have left: each letter in turn lifts and fades;
       en, 0 to 1, how far the words have come: each letter in turn drops into place, and the title's letters show a
         rune until they are nearly in (runes(), written only when a letter's rune changes).
     Each line's and each letter's opacity and offset are written on it, and only when they change, so a frame restyles
     the few letters that moved, never the whole column. The text itself is never changed, so screen readers, and the
     scripts that read a title back, see the same words. A column whose words are replaced (a caption that moves on) is
     split again the next time a handover asks for it. */
  const RUNES = ["☾", "☽", "✶", "✧", "⋆", "ᚱ", "ᛟ", "ᚦ", "ᛉ", "ᚠ", "◇", "✦", "ᛃ", "ᛗ"];
  const LONG = 110;   // a line longer than this goes word by word
  const TITLE = 0.3, BLOCK = 8;
  const fresh = (box, st) => st && st.count === box.childElementCount && st.parts.every((p) => p.el.firstChild === p.first);
  const letters = (box) => {
    if (!box) return null;
    let st = box._hw;
    if (fresh(box, st)) return st;
    const kids = [...box.children], parts = [];
    let rest = 0;
    for (const el of kids) {
      // a piece split before and not changed since keeps what it was
      const was = el._hwp && el.firstChild === el._hwp.first ? el._hwp : null;
      const text = was ? was.text : el.textContent.trim().replace(/\s+/g, " ");
      const plain = was ? was.kind !== "block" : text && !el.children.length && !el.matches("a, button");
      const title = plain && el.matches(".pk-name");
      const kind = title ? "title" : plain ? (text.length > LONG || el.matches(".pk-tag") ? "words" : "line") : "block";
      const w = kind === "block" ? BLOCK : text.length;
      if (kind !== "title") rest += w;
      parts.push({ el, kind, text, w });
    }
    let at = 0;
    const kOf = (w) => { const k = TITLE + ((1 - TITLE) * at) / Math.max(1, rest); at += w; return k; };
    for (const p of parts) {
      const { el, kind, text } = p;
      if (kind === "block") { el.classList.add("hw"); el._hwp = { kind, text, first: (p.first = el.firstChild), k: kOf(p.w) }; continue; }
      const ws = text.split(" "), lts = [];
      if (kind === "title") {
        const n = text.replace(/ /g, "").length;
        let j = 0;
        el.innerHTML = ws.map((w) => `<span style="white-space:nowrap">${[...w].map((c) => `<span class="ch lt">${esc(c)}</span>`).join("")}</span>`).join(" ");
        el._ch = $$(".ch", el); el.classList.add("wl");
        el._ch.forEach((c) => lts.push({ el: c, k: (TITLE * j++) / Math.max(1, n) }));
      } else if (kind === "line") {
        el.innerHTML = ws.map((w) => `<span class="wd">${[...w].map((c) => `<span class="lt">${esc(c)}</span>`).join("")}</span>`).join(" ");
        el._wd = $$(".wd", el);
        $$(".lt", el).forEach((c) => lts.push({ el: c, k: kOf(1) }));
      } else {
        el.innerHTML = ws.map((w) => `<span class="wd lt">${esc(w)}</span>`).join(" ");
        el._wd = $$(".wd", el);
        el._wd.forEach((c, i) => lts.push({ el: c, k: kOf(ws[i].length + 1) }));
      }
      el._hwp = { kind, text, first: (p.first = el.firstChild), lts };
    }
    st = box._hw = { count: box.childElementCount, parts, title: parts.find((p) => p.kind === "title")?.el, en: -1 };
    return st;
  };
  /** how far a piece at place k has left (lv) or come (en) */
  const lvAt = (lv, k) => clamp((lv - k * 0.62) / 0.38), enAt = (en, k) => clamp((en - k * 0.62) / 0.38);
  /** move a column of words: w its arrival, lv how far its words have left, en how far they have come (see above) */
  const drive = (box, w = 1, lv = 0, en = 1) => {
    if (!box) return;
    const moving = lv > 0 || en < 1;
    // the column is split only for a handover; one split before keeps being driven back to rest until its words change
    const st = moving ? letters(box) : fresh(box, box._hw) ? box._hw : null;
    const kids = box.children;
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i], p = st ? el._hwp : null, o = clamp((w - Math.min(i, 6) * 0.08) / 0.45);
      let op = o, ty = (1 - o) * 10;
      if (p && p.kind === "block") { const l = lvAt(lv, p.k), e = enAt(en, p.k); op *= (1 - l) * e; ty += l * -10 + (1 - e) * 8; }
      set(el, "opacity", op >= 0.999 ? "" : op.toFixed(3));
      set(el, "translate", Math.abs(ty) < 0.05 ? "" : `0 ${ty.toFixed(1)}px`);
      if (!p || !p.lts) continue;
      for (const L of p.lts) {
        // in steps of a twentieth and of a fiftieth of an em, finer than the eye follows, so a letter is restyled only
        // when it visibly moves
        const l = lvAt(lv, L.k), e = enAt(en, L.k), a = Math.round((1 - l) * e * 20) / 20, y = Math.round((l * -0.6 + (1 - e) * 0.35) * 50) / 50;
        set(L.el, "opacity", a >= 1 ? "" : String(a));
        set(L.el, "transform", y === 0 ? "" : `translate3d(0, ${y}em, 0)`);
      }
    }
  };
  /** the title's letters: hidden, then a rune that changes as the scroll moves, then the letter */
  const runes = (box, en) => {
    const st = box?._hw;
    if (!st?.title?._ch) return;
    const E = Math.round(en * 200);
    if (st.en === E) return;
    st.en = E;
    const ch = st.title._ch, n = ch.length;
    ch.forEach((c, j) => {
      const k = (TITLE * j) / Math.max(1, n), rune = !SM.quiet() && en < 1 && en < k * 0.62 + 0.3;
      const g = rune ? RUNES[(j * 5 + Math.floor(en * 48)) % RUNES.length] : "";
      if (c._g !== g) { c._g = g; if (g) { c.dataset.g = g; c.classList.add("rn"); } else c.classList.remove("rn"); }
    });
  };
  SM.letters = { prep: letters, runes, drive };

  /* the moment of a step at which the next plate takes over, and how long it takes, as fractions of the step: the
     handover runs over about a fifth of a screen, and the rest of the step is the thing alone and whole, so wherever
     the scroll rests the work is resolved */
  const COVER = [0.64, 0.26];
  SM.reel = (stop, items, opts = {}) => {
    const n = items.length, STEP = opts.step || 0.85;
    const stage = $(".stage", stop);
    stop.dataset.ground = items[0].ground; stop.dataset.ink = items[0].ink;   // the travel iris arrives in the first world's colours
    // half a screen more than the plates need, so the last one rests whole before the stop moves on
    const setHeight = () => (stop.style.height = opts.stack?.matches ? "" : `calc(${((n - 1) * STEP + 1.5).toFixed(3)} * 100svh)`);
    setHeight();
    const plates = new Array(n).fill(null);
    let cur = -1;

    /** build plate i the first time it is near, so pictures load only when needed */
    const make = (i) => {
      if (i < 0 || i >= n || plates[i]) return;
      const it = items[i];
      const el = document.createElement("article");
      el.className = "reel-plate"; el.dataset.i = i; el.inert = true;
      el.style.cssText = `--ground:${it.ground};--ink:${it.ink};--text:#ece6ff;--mark:#fff1c9;--rule:${mix(it.ground, it.ink, 0.55)};z-index:${i + 1};visibility:hidden`;
      el.setAttribute("aria-label", `${it.name}, ${i + 1} of ${n}`);
      el.innerHTML = `${it.backdrop ? `<span class="backdrop pic box" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${mix(it.ground, it.ink, 0.2)};--pos:50% 50%" aria-hidden="true"><img class="full" loading="lazy" src="${it.backdrop}" width="1536" height="1024" alt=""></span>` : ""}<i class="r-fall" aria-hidden="true"></i>${it.board(i, n)}`;
      stage.append(el);
      plates[i] = el;
      el._ground = it.ground;
      el._st = { a: 1, f: 0, w: 1, g: 1, ga: 1, gn: 1, sky: null, lv: 0, en: 1 };
      SM.pictures(el).forEach((bm) => bm.load().then(() => { bm.show = 1; bm.draw(); }).catch(() => {}));
      it.setup?.(el, it, i);
      opts.onMake?.(el, i);
      paint(el);
    };

    /* the window's masthead and foot take the colours of the world behind them (SM.band, in moon.js, asks the stop
       under each band for its tone): blended from one world to the next as the scroll hands one over to the other,
       or, stacked, the world of the plate under the band */
    const tones = items.map((it) => SM.tone({ ground: it.ground, ink: it.ink, text: "#ece6ff", mark: "#fff1c9", rule: mix(it.ground, it.ink, 0.55) }));
    let tone = null;
    stop._tone = (y) => {
      if (!opts.stack?.matches) return tone || tones[Math.max(0, cur)];
      let k = 0;
      plates.forEach((el, j) => { if (el && el.getBoundingClientRect().top <= y) k = j; });
      return tones[k];
    };

    const setCurrent = (i) => {
      if (i === cur) return;
      const before = plates[cur];
      if (before) { before.classList.remove("now"); before.inert = true; }
      cur = i;
      const el = plates[i];
      el.classList.add("now"); el.inert = false;
      stop.dataset.hint = cur < n - 1 ? `Next: ${items[cur + 1].name}` : `${items[cur].name} is the last one.`;
      if (SM.stop === stop) SM.say();
      opts.onChange?.(i, el);
    };
    /* the fall of ground over a plate's backdrop, toward the words, in the colour c (#rrggbb) */
    const fall = (c) => {
      const [r, g, b] = hex(c), at = (o, p) => `rgb(${r} ${g} ${b} / ${o}) ${p}%`;
      return `linear-gradient(90deg, ${at(1, 0)}, ${at(0.82, 26)}, ${at(0.18, 58)}, ${at(0, 80)}), linear-gradient(0deg, ${at(1, 0)}, ${at(0.6, 16)}, ${at(0, 34)})`;
    };
    /** write a plate's state onto the elements it moves: its arrival a (0 to 1, its work rises), its drift f (-1 to 1),
        its words' arrival w, how much of its world is there g (its backdrop, its light, the film's caption), the fall of
        ground over its backdrop ga, its corners gn, the colour its ground has blended to (sky: a colour, "clear" while
        it comes in over the last, or null for its own), and its words' handover (lv, en) */
    const paint = (el) => {
      const s = el._st, U = SM.u(), q = el._q || (el._q = {
        bd: $(".backdrop", el), fall: $(".r-fall", el), glow: $(".r-glow", el), text: $(".pk-text", el), pin: $(".pk-in", el),
        pieces: $$(".s-piece", el).map((p, d) => [p, d]), cap: $(".a-film figcaption", el) });
      const corners = q.corners || (q.corners = $(".corners", el));
      const sky = s.sky === "clear" ? null : s.sky || el._ground;
      set(el, "backgroundColor", s.sky === "clear" ? "transparent" : s.sky || "");
      if (q.fall) { set(q.fall, "background", fall(sky || el._ground)); set(q.fall, "opacity", s.ga >= 1 ? "" : s.ga.toFixed(3)); }
      if (q.bd) {
        set(q.bd, "opacity", s.g >= 1 ? "" : s.g.toFixed(3));
        set(q.bd, "transform", `translate3d(0, ${(s.f * -2.6 * U).toFixed(1)}px, 0) scale(${(1.04 + (1 - s.a) * 0.05).toFixed(4)})`);
      }
      if (q.glow) { const o = s.a * s.g; set(q.glow, "opacity", o >= 1 ? "" : o.toFixed(3)); }
      if (q.cap) set(q.cap, "opacity", s.g >= 1 ? "" : s.g.toFixed(3));
      if (corners) set(corners, "opacity", s.gn >= 1 ? "" : s.gn.toFixed(3));
      if (q.text) set(q.text, "transform", `translate3d(0, ${((1 - s.a) * 3 * U + s.f * -0.8 * U).toFixed(1)}px, 0)`);
      if (q.pin) {
        const fx = q.pin._fx || 0, fy = q.pin._fy ?? 300;
        set(q.pin, "transform", `translate3d(${(fx * (1 - s.a)).toFixed(1)}px, ${(fy * (1 - s.a) + s.f * -1.4 * U).toFixed(1)}px, 0) scale(${(0.5 + 0.5 * s.a).toFixed(4)})`);
      }
      for (const [p, d] of q.pieces) {
        const pa = clamp((s.a - 0.3 - d * 0.12) / 0.4);
        set(p, "transform", `translate3d(0, ${((1 - pa) * 3 * U + s.f * -1 * (1.8 + d * 0.6) * U).toFixed(1)}px, 0)`);
      }
      drive(q.text, s.w, s.lv, s.en);
      if (q.text && (s.lv > 0 || s.en < 1 || q.text._hw)) runes(q.text, s.en);
    };
    /** a plate's arrival (0 to 1: its work rises), its drift (-1 to 1: how far the scroll is through it), its words'
        arrival with the stop (0 to 1) and how far its pictures have woken (0 to 1, from their lilac sleep) */
    const pose = (el, a, f, w, wake) => {
      const s = el._st, A = +a.toFixed(3), F = +f.toFixed(3), W = +w.toFixed(3), K = wake.toFixed(3);
      if (el._wk !== K) { el._wk = K; (el._wks || (el._wks = $$("[data-wake]", el))).forEach((p) => SM.bitmap(p)?.setFloor(wake)); }
      if (s.a !== A || s.f !== F || s.w !== W) { s.a = A; s.f = F; s.w = W; el._dirty = true; }
    };
    /** the pictures that bloom, in the order they bloom */
    const picsOf = (el) => el._pics || (el._pics = $$("[data-bloom]", el));
    /** a plate's part in the handover: its pictures at s (0 not there, 1 whole, 2 gone), each a little after the one
        before; its words leaving (lv) or coming (en); its world's backdrop and light (g, with the fall over the
        backdrop at ga); its ground (sky: a colour, or "clear" while the plate is coming in over the last) */
    const hand = (el, s, snap, lv, en, g, ga, sky) => {
      const ps = picsOf(el), m = Math.max(1, ps.length - 1);
      ps.forEach((p, j) => {
        const d = j / m;
        const v = s <= 1 ? clamp((s - d * 0.15) / 0.85) : 1 + clamp((s - 1 - d * 0.12) / 0.88);
        SM.bloom(p, v, snap);
      });
      const st = el._st, LV = +lv.toFixed(3), EN = +en.toFixed(3), G = +g.toFixed(3), GA = +ga.toFixed(3), GN = sky === "clear" ? G : 1;
      if (st.lv !== LV || st.en !== EN || st.g !== G || st.ga !== GA || st.gn !== GN || st.sky !== sky) {
        st.lv = LV; st.en = EN; st.g = G; st.ga = GA; st.gn = GN; st.sky = sky; el._dirty = true;   // the corners: the old stay, the new come in over them
      }
    };

    const update = () => {
      const w = SM.where(stop);
      if (!w.near) return;
      const quiet = SM.quiet();
      /* opts.stack (a media query): while it matches, every plate is built and shown one under another, each
         arriving as it comes into the window */
      if (opts.stack?.matches) {
        for (let k = 0; k < n; k++) make(k);
        plates.forEach((el, k) => {
          if (!el._stacked) {
            el._stacked = true; el._shown = undefined;
            el.style.visibility = ""; el.classList.add("now"); el.inert = false;
            hand(el, 1, true, 0, 1, 1, 1, null);
          }
          const r = el.getBoundingClientRect(), a = quiet ? 1 : easeOut(clamp((SM.vh - r.top) / (SM.vh * 0.7)));
          pose(el, a, 0, a, a);
          if (el._dirty) { el._dirty = false; paint(el); }
        });
        return;
      }
      const vh = w.vh, q = Math.min(n - 1, Math.max(0, -w.top / (STEP * vh)));
      const base = Math.min(n - 1, Math.floor(q)), frac = q - base;
      const cover = base >= n - 1 ? 0 : clamp((frac - COVER[0]) / COVER[1]);
      for (let k = base - 1; k <= base + 2; k++) make(k);
      const first = quiet ? 1 : easeOut(clamp(w.arrive / 0.8));   // the first plate's work rises as the stop comes in
      /* the handover, over the cover: the new pictures bloom in over the old over its first part, and only then do the
         old ones break up, under them, so the work is never gone from the screen; the old words leave over the first
         half and the new ones come from a little before the middle; the world blends all the way through. Quiet mode
         cuts it all at the middle */
      const cut = cover >= 0.5 ? 1 : 0;
      const inn = quiet ? cut : clamp(cover / 0.62), out = quiet ? cut : clamp((cover - 0.38) / 0.62);
      const lv = quiet ? cut : clamp(cover / 0.5), en = quiet ? cut : clamp((cover - 0.4) / 0.6);
      plates.forEach((el, k) => {
        if (!el) return;
        const role = k === base ? "base" : k === base + 1 && cover > 0 ? "next" : "off";
        const was = el._shown, shown = role !== "off";
        if (was !== shown) { el._shown = shown; el.style.visibility = shown ? "visible" : "hidden"; }
        if (!shown) return;
        // a plate no one could see a moment ago takes its place at once; the one on show steps through every stage
        const snap = !was;
        if (role === "base") {
          const blend = quiet ? cut : sm(cover);
          hand(el, 1 + out, snap, lv, 1, 1 - (quiet ? cut : sm(cover / 0.7)), 1, cover > 0 ? mix(items[k].ground, items[k + 1].ground, blend) : null);
          const a = k === 0 ? first : 1;
          pose(el, a, quiet ? 0 : Math.max(-1, Math.min(1, frac * 1.4)), k === 0 ? first : 1, a);
        } else {
          hand(el, inn, snap, 0, en, quiet ? cut : sm((cover - 0.1) / 0.6), quiet ? cut : sm((cover - 0.1) / 0.7), "clear");
          pose(el, quiet ? 1 : easeOut(inn), quiet ? 0 : Math.max(-1, (frac - 1) * 1.4), 1, 1);
        }
        if (el._dirty) { el._dirty = false; paint(el); }
      });
      tone = cover > 0 ? SM.blend(tones[base], tones[base + 1], cover) : tones[base];
      setCurrent(cover > 0.5 ? base + 1 : base);
      opts.onScrub?.(q, base, cover);
    };
    SM.scrub(update);
    // stacked, every plate is in the page from the start, so nothing below the stop moves when the later ones are built
    const buildAll = () => { if (opts.stack?.matches) for (let k = 0; k < n; k++) make(k); };
    // when the stack is left (a phone turned to landscape, a window widened), every plate goes back to waiting, so the
    // next scroll makes only the current one current again
    opts.stack?.addEventListener?.("change", () => {
      setHeight(); buildAll();
      plates.forEach((el) => { if (el) { el._stacked = false; el._shown = undefined; el._wk = null; el._dirty = true; if (!opts.stack.matches) { el.classList.remove("now"); el.inert = true; } } });
      if (!opts.stack.matches) cur = -1;
    });
    // a new window size changes the unit the drift is written in
    addEventListener("resize", () => plates.forEach((el) => { if (el) el._dirty = true; }));

    /** travel to item i */
    const jump = (i, instant) => {
      i = Math.min(n - 1, Math.max(0, i));
      if (opts.stack?.matches) { make(i); plates[i].scrollIntoView({ block: "start", behavior: instant || SM.quiet() ? "auto" : "smooth" }); return; }
      SM.glide(stop.getBoundingClientRect().top + scrollY + i * STEP * SM.vh + (i ? 2 : 0), instant);
    };
    addEventListener("keydown", (e) => {
      if (SM.stop !== stop || document.querySelector("dialog[open]") || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest?.("input, textarea, [role=group]")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); jump(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); jump(cur - 1); }
    });
    make(0); make(1); buildAll();
    setCurrent(0);
    (SM.rooms ||= {})[stop.id] = { jump };   // so anything on the page can go straight to one work
    return { jump, get current() { return cur; }, plates, repaint: (el) => paint(el) };
  };

  const first = (s) => { const m = s.match(/^.*?[.!?](\s|$)/); return (m ? m[0] : s).trim(); };

  /* ================================================================ I Brands
     The room behind the first door: a holder of seed packets stands on the ground, one packet per brand. Each brand
     is its own world (its ground, its ink, its backdrop in flat tones). As you scroll, the next brand's world
     dissolves in, its packet lifts and wakes, and its key visual rises out of the packet into colour; beside it, up
     to four of its pubmats, and on the left what the brand is and what I made. Pointing at a packet lifts it and
     says its name; choosing it travels there. */
  const PACKETS = 10;                                   // painted packet backs in art/packets, used in turn
  const brands = $("#brands");
  if (brands && typeof DATA !== "undefined") {
    const B = DATA.brands, stage = $(".stage", brands);
    let pks = [], holderBms = [];
    const room = SM.reel(brands, B.map((b) => {
      const list = b.imgs.map(([, full, w, h], k) => ({ src: full, w, h, alt: `${b.name}, piece ${k + 1}`, cap: b.name }));
      const N = b.imgs.length, [kvs, , kw, kh] = b.imgs[0], more = b.imgs.slice(1, 5);
      /* the row is laid out here, in board units (reel.css: 56.5u wide, 32u tall, 1.4u gaps): a piece stands at full
         height when it fits; one that does not shares a column with the next at half height; what still does not fit
         goes last, where fit() hides it on a desktop and the phone's scrolling row shows it */
      const piece = ([src, , w, h], k) => `<button class="s-piece" type="button" data-k="${k + 1}" data-bloom style="--d:${k};aspect-ratio:${w} / ${h}" aria-label="Open piece ${k + 2} of ${N} large"><img src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></button>`;
      const RW = 56.5, RH = 32, G = 1.4, HALF = (RH - G) / 2;
      const units = [], rest = [];
      let x = (RH * kw) / kh + G, col = null;
      more.forEach((m, k) => {
        const a = m[2] / m[3], html = piece(m, k);
        if (col && col.x + HALF * a <= RW) { col.items.push(html); x = Math.max(x, col.x + HALF * a + G); col = null; }
        else if (x + RH * a <= RW) { units.push(html); x += RH * a + G; col = null; }
        else if (x + HALF * a <= RW) { col = { x, items: [html] }; units.push(col); x += HALF * a + G; }
        else rest.push(html);
      });
      const row = units.map((u) => (typeof u === "string" ? u : `<span class="s-col">${u.items.join("")}</span>`)).join("") + rest.join("");
      return {
        name: b.name, ground: b.ground, ink: b.ink, backdrop: b.backdrop,
        board: (i, n) => `<div class="r-board room">
          <div class="r-glow" aria-hidden="true"></div>
          <div class="pk-text">
            <h3 class="pk-name display">${esc(b.name)}</h3>
            <p class="pk-meta">${esc(b.org)}, ${esc(longDate(b.date))}</p>
            <p class="pk-tag">${esc(b.tag)}</p>
            <p class="say">${esc(b.roles.map((r, k) => (k ? r.charAt(0).toLowerCase() + r.slice(1) : r)).join(", "))}</p>
            <a class="go" href="brand.html?b=${b.slug}">See all ${N} pieces</a>
            ${SM.steps("brand")}
          </div>
          <div class="s-row">
            <button class="pk-card" type="button" style="aspect-ratio:${kw} / ${kh}" aria-label="Open ${esc(b.name)}'s key visual large">
              <span class="pk-in">
                <span class="pk-win pic box" data-kind="photo" data-enter="manual" data-still data-wake data-cell="1.4" data-bloom="0.5 0.96"><img class="full" loading="lazy" src="${kvs}" width="${kw}" height="${kh}" alt="${esc(b.name)}, the key visual"></span>
              </span>
            </button>
            ${row}
          </div>
        </div>`,
        setup: (el, it, i) => {
          SM.setSteps(el, i, B.length);
          SM.corners($(".r-board", el));
          $(".prev", el).addEventListener("click", () => room.jump(i - 1));
          $(".next", el).addEventListener("click", () => room.jump(i + 1));
          $(".pk-card", el).addEventListener("click", () => SM.view(list, 0));
          const strip = $(".s-row", el), pieces = $$(".s-piece", el);
          pieces.forEach((p) => p.addEventListener("click", () => SM.view(list, +p.dataset.k)));
          /* only whole pubmats: a piece or a column that would be cut by the edge of the plate is left out */
          const units = $$(":scope > .s-piece, :scope > .s-col", strip);
          /* on phones the row scrolls sideways and shows every piece, so there is nothing to fit. Elsewhere: show all,
             measure all, then hide; once per frame at most, and only when the row's width has changed or a picture
             has come in */
          let fitW = -1, fitReq = 0;
          const fit = () => {
            fitReq = 0;
            if (SM.COLUMN.matches) return;
            units.forEach((p) => (p.hidden = false));
            const R = strip.getBoundingClientRect().right + 1, cut = units.map((p) => p.getBoundingClientRect().right > R);
            units.forEach((p, k) => (p.hidden = cut[k]));
          };
          const refit = () => { if (!fitReq) fitReq = requestAnimationFrame(fit); };
          pieces.forEach((p) => $("img", p).addEventListener("load", refit, { once: true }));
          new ResizeObserver((es) => { const w = Math.round(es[0].contentRect.width); if (w !== fitW) { fitW = w; refit(); } }).observe(strip);
        },
      };
    }), { step: 0.85, onMake: () => aimSoon(), onScrub: (q) => lift(q), onChange: (i) => tint(i) });

    /* the holder: one packet per brand standing behind a carved rail, on the ground under the work; it stays while
       the worlds change */
    stage.insertAdjacentHTML("beforeend", `<div class="holder">
      <span class="pic h-back" data-kind="paint"><img class="full" src="art/holder-back.webp" width="1600" height="416" alt="" loading="lazy"></span>
      <div class="h-row" role="group" aria-label="The ten brands">${B.map((b, i) => `<button class="h-pk" type="button" data-i="${i}" style="--i:${i}" aria-label="${esc(b.name)}, ${i + 1} of ${B.length}">
        <span class="pic" data-kind="paint" style="--ink:${b.ink}"><img class="full" src="art/packets/p${i % PACKETS}.webp" width="200" height="416" alt="" loading="lazy"></span><span class="h-name" aria-hidden="true">${esc(b.name)}</span></button>`).join("")}</div>
      <span class="pic h-rail" data-kind="paint"><img class="full" src="art/holder.webp" width="1600" height="416" alt="" loading="lazy"></span>
    </div>`);
    const holder = $(".holder", stage);
    holderBms = SM.pictures(holder);
    pks = $$(".h-pk", holder);
    /* the holder takes the colours of the world it stands in; each packet sleeps in its own brand's ink */
    function tint(i) {
      stage.style.setProperty("--ground", B[i].ground); stage.style.setProperty("--ink", B[i].ink);
      holderBms.forEach((bm) => {
        const own = bm.pic.style.getPropertyValue("--ink");   // a packet sleeps in its own brand's ink
        if (!bm.pic.closest(".h-pk")) bm.recolour(own || B[i].ink, B[i].ground); else if (bm.paper) bm.recolour(own || B[i].ink, B[i].ground);
      });
    }
    /* each brand's key visual rises out of its own packet: measure, once per layout, how far the packet is from where
       the picture stands, so the picture can start there (small, at the packet's mouth) and grow into place */
    // plates are made several at a time: measure once for all of them, at the next frame
    function aimSoon() { if (!aimSoon.req) aimSoon.req = requestAnimationFrame(() => { aimSoon.req = 0; aim(); }); }
    function aim() {
      // every plate is measured first and written after, so the page is laid out once rather than once a plate
      const got = $$(".reel-plate", brands).map((pl) => {
        const card = $(".pk-in", pl), pk = pks[+pl.dataset.i];
        if (!card || !pk) return null;
        const c = $(".pk-card", pl).getBoundingClientRect(), p = pk.getBoundingClientRect();
        return c.width ? [card, c, p] : null;
      });
      // the distances are kept on the picture and written into its rise with the plate's next pose
      got.forEach((g) => {
        if (!g) return;
        const [card, c, p] = g;
        card._fx = Math.round(p.left + p.width / 2 - (c.left + c.width / 2));
        card._fy = Math.round(p.top + p.height * 0.25 - c.bottom);
        room.repaint(card.closest(".reel-plate"));
      });
    }
    new ResizeObserver(aim).observe(stage);
    /* the packets follow the scroll: the one for the brand you are on stands up out of the holder and is awake, its
       neighbours part way, the rest asleep in the rail */
    function lift(q) {
      pks.forEach((b, k) => {
        const v = SM.quiet() ? (Math.round(q) === k ? 1 : 0) : Math.max(0, 1 - Math.abs(q - k) * 1.25);
        const V = v.toFixed(3);
        if (b._v === V) return;
        b._v = V;
        b.style.setProperty("--up", V);
        b.setAttribute("aria-current", String(Math.round(q) === k));
        SM.bitmap(b)?.setFloor(v);
      });
    }
    pks.forEach((b, i) => {
      SM.wakeable(b, { line: `Go to ${B[i].name}` });
      b.addEventListener("click", () => room.jump(i));
    });
    lift(0); tint(0);
  }
})();
