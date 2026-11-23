/* Prototype: words that answer the pointer (see words-proto.css).
   Headings and work titles are split into letters. Near the pointer the letters lift, catch the light and wake into
   the smooth cut, then settle back on a spring. A work's title spells itself out of runes when the pointer arrives
   (or a finger taps it, or focus reaches its plate). Body lines light the word under the pointer. About's lines are
   written in by the scroll in about-proto.js, which splits them into letters the same way, so they lift here too.
   Links and buttons belong to magic-proto.js. */
(() => {
  const { $$ } = SM;
  // the About statement itself is written in stops.js, in the almanac's voice
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const LIFT = ".pk-name, .yr-n, .cal-h, .idx-h, #about .display, .e-t, #talk h2, #talk h3, .al-q";
  const TITLE = ".pk-name, .e-t";
  const BODY = ".say, .pk-tag, .pk-meta, .a-role, .t-read, .cal-key, .me-roles, .e-w, .t-line, .t-made, .end-line, .dl-keep, #about li, #about p:not(.display):not(.label)";
  const skip = (el) => el.closest("a, button, form, label, .route, dialog, .vh, .veil");

  /* split into letters, keeping whole words for screen readers (a hidden copy) and on one line each */
  const split = (el) => {
    if (el._ch) { el.classList.add("wl"); return el; }
    if (el.children.length || skip(el)) return null;
    const text = el.textContent.trim();
    if (!text) return null;
    el.innerHTML = `<span class="vh">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span><span aria-hidden="true">` +
      text.split(/\s+/).map((w) => `<span style="white-space:nowrap">${[...w].map((c) => `<span class="ch">${c.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join("")}</span>`).join(" ") + "</span>";
    el._ch = $$(".ch", el);
    el.classList.add("wl");
    return el;
  };

  /* ---------------------------------------------------------------- the decode */
  const RUNES = ["☾", "☽", "✶", "✧", "⋆", "ᚱ", "ᛟ", "ᚦ", "ᛉ", "ᚠ", "◇", "✦", "ᛃ", "ᛗ"];
  const decode = (el, DUR = 420) => {
    if (!split(el) || el._dec) return;
    const ch = el._ch, n = ch.length, t0 = performance.now();
    el._dec = true;
    const step = (now) => {
      const t = now - t0;
      let busy = false;
      ch.forEach((c, i) => {
        // each letter resolves in turn from the left; until then it flickers through runes
        if (t < 40 + (i / Math.max(1, n - 1)) * (DUR - 90)) {
          busy = true;
          if (!c.classList.contains("rn") || Math.random() < 0.35) c.dataset.g = RUNES[(Math.random() * RUNES.length) | 0];
          c.classList.add("rn");
        } else c.classList.remove("rn");
      });
      if (busy) requestAnimationFrame(step); else el._dec = false;
    };
    requestAnimationFrame(step);
  };

  /* ---------------------------------------------------------------- body lines: wrap words the first time */
  const wrapWords = (p) => {
    if (p._wd || skip(p)) return p._wd;
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    if (!nodes.length) return null;
    for (const t of nodes) {
      if (t.parentElement.closest("a, button, input, textarea, .vh")) continue;
      const parts = t.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
      for (const s of parts) {
        if (!s) continue;
        if (/^\s+$/.test(s)) frag.append(s);
        else { const w = document.createElement("span"); w.className = "wd"; w.textContent = s; frag.append(w); }
      }
      t.replaceWith(frag);
    }
    p._wd = $$(".wd", p);
    return p._wd;
  };
  let lastWords = null, lit = [];
  const clearWords = () => { lit.forEach((w) => w.classList.remove("w1", "w2")); lit = []; };
  const lightWords = (p, x, y) => {
    const ws = wrapWords(p);
    if (!ws?.length) return;
    let best = -1, bd = 1e9;
    for (let i = 0; i < ws.length; i++) {
      const r = ws[i].getBoundingClientRect(), dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom), d = dx * dx + dy * dy * 4;
      if (d < bd) { bd = d; best = i; }
    }
    if (bd > 900) { clearWords(); return; }
    const want = [[ws[best], "w2"], [ws[best - 1], "w1"], [ws[best + 1], "w1"]].filter(([w]) => w);
    if (lit[0] === ws[best]) return;
    clearWords();
    want.forEach(([w, k]) => { w.classList.add(k); lit.push(w); });
  };

  /* ---------------------------------------------------------------- the lift: one loop, asleep when settled */
  let px = -1e4, py = -1e4, raf = 0, near = [];
  const R = 120;
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  /* where each letter sits in its heading (its middle, unlifted, and its height) is read once, and again only when the
     page changes size; each frame then reads only the heading's own box, all of them before any letter is written,
     so the lift never makes the browser lay the page out between letters */
  const placeLetters = (el) => {
    if (el._lg === SM.placedGen && el._lw === SM.vw) return;
    el._lg = SM.placedGen; el._lw = SM.vw;
    const e = el.getBoundingClientRect();
    for (const c of el._ch) { const r = c.getBoundingClientRect(); c._cx = r.left + r.width / 2 - e.left; c._cy = r.top + r.height / 2 - (c._y || 0) - e.top; c._h = r.height; }
  };
  function frame() {
    raf = 0;
    let busy = false;
    // letters of headings within reach of the pointer, plus any still settling: first every read, then every write
    const live = near.filter((el) => el.isConnected && el._ch);
    const boxes = live.map((el) => { placeLetters(el); return el.getBoundingClientRect(); });
    live.forEach((el, n) => {
      const e = boxes[n];
      for (const c of el._ch) {
        const d = Math.hypot(e.left + c._cx - px, e.top + c._cy - py), k = clamp(1 - d / R, 0, 1);
        const target = -k * k * Math.min(10, c._h * 0.14);
        c._y = (c._y || 0) + (target - (c._y || 0)) * 0.25;
        if (Math.abs(target - c._y) > 0.05) busy = true; else c._y = target;
        const t = Math.abs(c._y) < 0.05 ? "" : `0 ${c._y.toFixed(2)}px`, wk = d < R * 0.5;
        if (c._t !== t) { c._t = t; c.style.translate = t; }
        if (c._wk !== wk) { c._wk = wk; c.classList.toggle("wk", wk); }
      }
    });
    near = near.filter((el) => el._ch?.some((c) => c._y) || el._hot);
    if (busy) kick();
  }

  if (SM.HOVER) {
    addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      px = e.clientX; py = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      // headings: wake letters within reach of the pointer; the heading is found by its box, so letters start to
      // stir just before the pointer reaches the words
      const h = t?.closest(LIFT);
      for (const el of near) el._hot = false;
      if (h && split(h)) { h._hot = true; if (!near.includes(h)) near.push(h); }
      kick();
      // body lines
      const p = t?.closest(BODY);
      if (p !== lastWords) { clearWords(); lastWords = p; }
      if (p) lightWords(p, px, py);
    }, { passive: true });
    document.addEventListener("pointerleave", () => { for (const el of near) el._hot = false; px = py = -1e4; clearWords(); lastWords = null; kick(); });
    // the decode plays once each time the pointer arrives on a title
    document.addEventListener("pointerover", (e) => {
      if (e.pointerType === "touch") return;
      const t = e.target instanceof Element ? e.target.closest(TITLE) : null;
      if (t && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget))) decode(t);
    });
  }
  // a tap on a title spells it out too
  document.addEventListener("pointerdown", (e) => { if (e.pointerType !== "touch") return; const t = e.target instanceof Element ? e.target.closest(TITLE) : null; if (t) decode(t); });
  // focus reaching a work's plate lights its title and spells it
  const plateTitle = (el) => { for (let a = el.parentElement, n = 0; a && n < 5; a = a.parentElement, n++) { const t = a.querySelector(TITLE); if (t) return t; } return null; };
  document.addEventListener("focusin", (e) => {
    $$(".wl.focus-lit").forEach((x) => x.classList.remove("focus-lit"));
    if (!(e.target instanceof Element) || !e.target.matches(":focus-visible")) return;
    const t = plateTitle(e.target);
    if (t && split(t)) { t.classList.add("focus-lit"); decode(t); }
  });
  document.addEventListener("focusout", () => $$(".wl.focus-lit").forEach((x) => x.classList.remove("focus-lit")));

  /* the first words spell themselves out of runes once the veil lifts */
  const intro = document.querySelector(".pl-title");
  if (intro) {
    const go = () => { if (document.documentElement.classList.contains("loading")) return false; setTimeout(() => decode(intro, 1100), 260); return true; };
    if (!go()) { const w = new MutationObserver(() => { if (go()) w.disconnect(); }); w.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); }
  }
})();
