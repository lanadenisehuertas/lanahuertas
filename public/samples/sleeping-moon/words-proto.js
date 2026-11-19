/* Prototype: words that answer the pointer (see words-proto.css).
   Headings and work titles are split into letters. Near the pointer the letters lift, catch the light and wake into
   the smooth cut, then settle back on a spring. A work's title spells itself out of runes when the pointer arrives
   (or a finger taps it, or focus reaches its plate). Body lines light the word under the pointer. A few section
   headings are written letter by letter by the scroll. Links and buttons belong to magic-proto.js. */
(() => {
  const { $$ } = SM;
  /* the About statement, in the almanac's voice (Lana chose it 2026-11-17); set before the letters are split */
  const meSay = document.querySelector(".me-say .display:not(.kick)"), meKick = document.querySelector(".me-say .display.kick");
  if (meSay) meSay.textContent = "I make the pictures people remember a brand by: posters, packets, films and apps.";
  if (meKick) meKick.textContent = "Tell me what yours should wake up as.";
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const LIFT = ".pk-name, .yr-n, .cal-h, .idx-h, #about .display, .e-t, #talk h2, #talk h3, .al-q";
  const TITLE = ".pk-name, .e-t";
  const BODY = ".say, .pk-tag, .pk-meta, .a-role, .t-read, .cal-key, .me-roles, .e-w, .t-line, .t-made, .end-line, .dl-keep, #about li, #about p:not(.display):not(.label)";
  const WRITE = ".cal-h, .idx-h, #about .display";
  const WRITEW = ".me-roles, .cal-key";
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
    if (still() || !split(el) || el._dec) return;
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
  function frame() {
    raf = 0;
    let busy = false;
    const calm = still();
    // letters of headings within reach of the pointer, plus any still settling
    for (const el of near) {
      if (!el.isConnected || !el._ch) continue;
      for (const c of el._ch) {
        const r = c.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2 - (c._y || 0);
        const d = Math.hypot(cx - px, cy - py), k = calm ? 0 : clamp(1 - d / R, 0, 1);
        const target = -k * k * Math.min(10, r.height * 0.14);
        c._y = (c._y || 0) + (target - (c._y || 0)) * 0.25;
        if (Math.abs(target - c._y) > 0.05) busy = true; else c._y = target;
        c.style.translate = Math.abs(c._y) < 0.05 ? "" : `0 ${c._y.toFixed(2)}px`;
        c.classList.toggle("wk", d < R * 0.5);
      }
    }
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

  /* ---------------------------------------------------------------- headings written by the scroll */
  const written = [];
  const prepWrite = () => {
    $$(WRITE).forEach((h) => { if (!h._wr && split(h)) { h._wr = true; h.classList.add("wscr"); written.push(h); } });
    // short lines go word by word; the words stay real text for screen readers
    $$(WRITEW).forEach((h) => {
      if (h._wr || h.children.length || skip(h)) return;
      h.innerHTML = h.textContent.trim().split(/\s+/).map((w) => `<span class="wv">${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`).join(" ");
      h._ch = $$(".wv", h); h._wr = true; h.classList.add("wscw"); written.push(h);
    });
  };
  prepWrite();
  /* progress for a line inside a hold: the hold's travel from its top at 30% down the window to the end of its pinned stretch,
     shared out between its lines by length, ending a little early so the finished words rest on screen */
  const held = (h, H) => {
    const hold = h.closest(".me-hold");
    if (!hold) return null;
    const hr = hold.getBoundingClientRect(), q = clamp((H * 0.3 - hr.top) / (H * 0.3 + (hr.height - H) * 0.82), 0, 1);
    const lines = written.filter((x) => hold.contains(x)), len = lines.map((x) => x.textContent.length), all = len.reduce((a, b) => a + b, 0);
    let a = 0;
    for (let i = 0; i < lines.length; i++) {
      const b = a + len[i] / all;
      if (lines[i] === h) return clamp((q - a) / (b - a), 0, 1);
      a = b;
    }
    return null;
  };
  /** where each heading is, and where the pen is in those that move on: only reads the page */
  const penAt = () => {
    const H = SM.vh, calm = still(), todo = [];
    for (const h of written) {
      const r = h.getBoundingClientRect();
      if (r.bottom < -H || r.top > H * 2) continue;
      // written from when its top enters the lower edge to when it reaches the middle of the screen; inside a hold
      // (the About statement) the lines are written one after another while the hold keeps them on screen
      const p = calm ? 1 : held(h, H) ?? clamp((H * 0.96 - r.top) / (H * 0.3), 0, 1), n = h._ch.length, k = Math.round(p * n);
      if (h._k === k) continue;
      const grew = k > (h._k || 0), pen = grew && k > 0 && k < n + 1 && !calm ? h._ch[k - 1] : null;
      todo.push([h, k, n, pen, pen && pen.getBoundingClientRect()]);
    }
    return todo;
  };
  /** ink the letters penAt found: only changes the page */
  const ink = (todo) => {
    for (const [h, k, n, pen, cr] of todo) {
      h._k = k;
      h._ch.forEach((c, i) => { c.classList.toggle("w", i < k); c.classList.toggle("wn", i < k && i >= k - 3 && k < n); });
      // the pen throws a little stardust as it writes forward, more on the words that matter
      if (pen) SM.sparkle?.(cr.right, cr.top + cr.height * 0.6, pen.closest(".em") ? 5 : 2);
    }
  };
  const write = () => ink(penAt());
  write();
  // while the page moves, the reading happens in the page's own read pass (before any scrub writes), so it costs no
  // layout of its own
  let penRead = null;
  SM.measure(() => { penRead = penAt(); });
  SM.scrub(() => { if (penRead) { ink(penRead); penRead = null; } else write(); });

  /* the first words spell themselves out of runes once the veil lifts */
  const intro = document.querySelector(".pl-title");
  if (intro) {
    const go = () => { if (document.documentElement.classList.contains("loading")) return false; setTimeout(() => decode(intro, 1100), 260); return true; };
    if (!go()) { const w = new MutationObserver(() => { if (go()) w.disconnect(); }); w.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); }
  }
  // rooms build their text as you reach them
  let mo = 0;
  new MutationObserver(() => { clearTimeout(mo); mo = setTimeout(() => { prepWrite(); write(); }, 150); }).observe(document.querySelector("main"), { childList: true, subtree: true });
})();
