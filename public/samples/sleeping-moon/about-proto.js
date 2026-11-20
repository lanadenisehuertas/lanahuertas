/* Prototype: About and the films' previews (see about-proto.css).
   - The statement's key words, prizes and honours, roles where Lana led and a few strong lines are marked.
   - "What I work with" holds on screen (wide screens) while its entries come in one by one with the scroll.
   - Each film listed in LOOPS gets a short silent loop (loops/films/<id>.mp4) on the monitor while it is under the
     playhead. The list is empty until the loops are cut from the films. */
(() => {
  const { $, $$ } = SM;
  const still = () => SM.quiet();   // only the visitor's own quiet switch stills the page, never the system setting (moon.js)
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const when = (test, fn) => {
    if (test()) return fn();
    const mo = new MutationObserver(() => { if (test()) { mo.disconnect(); fn(); } });
    mo.observe(document.querySelector("main"), { childList: true, subtree: true });
  };

  /* ---------------------------------------------------------------- what matters, marked */
  const PRIZE = /runner-up|high honors|Certiport|Project Management Ready/i;
  const LEAD = /\bhead\b|\bintern\b|\bfreelance\b/i;
  const STRONG = ["Elite Scholar and DOST scholar", "Co-founded it and built its identity", "Led a 10-member editing team", "Design system and UI libraries"];
  const KEY_WORDS = ["pictures", "remember"];
  when(() => $(".yrs"), () => {
    $$(".yr-list > li").forEach((li) => {
      const t = $(".e-t", li)?.textContent || "";
      if (PRIZE.test(t)) li.classList.add("prize");
      else if (LEAD.test(t)) li.classList.add("lead");
      $$("li", li).forEach((b) => { if (STRONG.includes(b.textContent.trim())) b.innerHTML = `<strong class="ach">${b.innerHTML}</strong>`; });
    });
    // a prize's star turns over once, with a little stardust, the first time it comes into view
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target); e.target.classList.add("seen");
      const r = $(".e-t", e.target).getBoundingClientRect();
      setTimeout(() => SM.sparkle?.(r.left + 10, r.top + r.height / 2, 6), 300);
    }), { rootMargin: "0px 0px -25% 0px" });
    $$(".yr-list > li.prize").forEach((li) => io.observe(li));
  });
  // the statement's key words are marked as its letters are split, by the writing below

  /* ---------------------------------------------------------------- Peanut, Lana's orange cat, sits by the mirror
     Asleep in lilac like everything else, Peanut wakes into orange when pointed at (or as the scroll brings the mirror
     in, on touch screens), with a line under the statement. */
  when(() => $(".me .mirror"), () => {
    const m = $(".me .mirror");
    m.insertAdjacentHTML("beforeend", `<span class="pic peanut" data-kind="paint"><img class="full" src="art/peanut.webp" width="332" height="640" alt="Peanut, Lana's orange tabby cat, sitting with eyes half closed, a gold crescent charm on her collar" loading="lazy"></span>`);
    $(".me-roles")?.insertAdjacentHTML("afterend", `<p class="me-cat">And Peanut, my orange cat, who supervises.</p>`);
    SM.pictures(m).filter((b) => b.pic.classList.contains("peanut")).forEach((b) => {
      SM.whenNear(m, () => b.load().then(() => b.setShow(1)).catch(() => {}));
      if (!SM.HOVER) new IntersectionObserver(([e]) => b.setFloor(e.isIntersecting ? 1 : 0), { threshold: 0.6 }).observe(b.pic);
    });
  });

  /* ---------------------------------------------------------------- the statement holds while it is written
     Wide screens: the mirror and the statement stay on screen for about a screen more of scroll, and the
     statement writes itself through that hold (words-proto.js reads the hold's progress). */
  when(() => $(".me .me-say"), () => {
    if (SM.COLUMN.matches) return;
    const me = $(".me"), wrap = document.createElement("div");
    wrap.className = "me-hold";
    me.before(wrap); wrap.append(me);
  });

  /* ---------------------------------------------------------------- About's words, written by the scroll
     Every line of About is split into letters once, and each letter keeps one number, --f: 0 before the scroll has
     reached it, 1 once it is written. About-proto.css turns that number into the letter's look, a different look for
     each kind of line, so the page reads as written by several hands:
     - the statement: each letter flickers up as a rune, sets in the coarse pixel cut (70, then 35) and resolves into
       the smooth face; its key words ignite in pale gold as they land;
     - its kicker is written in by a moonlit quill, the ink wet and bright behind the nib, drying to gold;
     - the roles are typed, with a caret; Peanut's line tumbles in letter by letter, as if batted into place;
     - year by year: the year numbers roll like an odometer or condense out of the pixel cut, in turn; the titles take
       turns between the runes, a breath of letter-spacing drawn in, the pixel cut and words rising one by one, and
       each lights its key word; the dates are typed; the lines are typed or inked, entry by entry.
     The scroll alone drives it, so it all runs back when scrolling back, and every line is whole by the time it is
     a quarter of the way up the window (inside the statement's hold, by the end of the hold). Where each line is gets
     read once, and again only when the page changes size, in the page's read pass; the scrub only does sums and writes
     the letters whose number changed. Quiet mode sets every letter whole. */
  when(() => $(".me-cat") && $(".yrs .yr-n"), () => {
    const RUNES = ["☾", "☽", "✶", "✧", "⋆", "ᚱ", "ᛟ", "ᚦ", "ᛉ", "ᚠ", "◇", "✦", "ᛃ", "ᛗ"];
    // each title's key word, the one that catches the light as it lands
    const KEYS = { "UI/UX design intern": ["UI/UX"], "1st runner-up": ["1st", "runner-up"], "PMI Project": ["PMI"], "IT Specialist": ["Python"],
      "Android Development": ["Kotlin"], "Computer Science": ["Computer", "Science"], "Creatives head": ["Creatives"], "Freelance": ["Freelance"],
      "Regional Science": ["high", "honors"], "Editing head": ["CybeRS"], "Multimedia editor": ["Multimedia"], "First graphics": ["First"] };
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const bare = (w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    // a fixed little random, so a letter's rune and tumble are the same on every visit
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    /** split a line into words and letters once (inline marks such as a strong line are kept round their letters); a
        hidden copy keeps the words whole for screen readers, and the letters are left out of the reading */
    const splitFx = (el, mode, keys = []) => {
      const words = (text) => text.split(/(\s+)/).map((w) => {
        if (!w) return "";
        if (/^\s+$/.test(w)) return " ";
        const cs = [...w], m = cs.length, em = keys.includes(bare(w)) ? " em" : "";
        return `<span class="wd${em}" style="white-space:nowrap">` + cs.map((c, j) =>
          `<span class="ch" data-c="${esc(c)}" style="--i:${j};--j:${(j - (m - 1) / 2).toFixed(1)};--s:${rnd() < 0.5 ? -1 : 1}">${esc(c)}</span>`).join("") + "</span>";
      }).join("");
      const build = (node) => [...node.childNodes].map((n) => n.nodeType === 3 ? words(n.textContent)
        : n.nodeType === 1 ? `<${n.localName}${n.className ? ` class="${esc(n.className)}"` : ""}>${build(n)}</${n.localName}>` : "").join("");
      const text = el.textContent.trim().replace(/\s+/g, " ");
      el.innerHTML = `<span class="vh">${esc(text)}</span><span aria-hidden="true">${build(el).trim()}</span>`;
      return el;
    };
    /** a year as an odometer: each digit is a short strip of digits that rolls up to its own, the last one furthest */
    const splitOdo = (el) => {
      const text = el.textContent.trim(), SP = [2, 3, 5, 8];
      el.innerHTML = `<span class="vh">${esc(text)}</span><span aria-hidden="true"><span class="wd" style="white-space:nowrap">` + [...text].map((d, i) => {
        const k = SP[i] ?? 4, seq = Array.from({ length: k + 1 }, (_, j) => (+d - k + j + 20) % 10);
        return `<span class="ch od" data-c="${d}" style="--k:${k}">${d}<span class="od-s">${seq.map((x) => `<b>${x}</b>`).join("")}</span></span>`;
      }).join("") + "</span></span>";
      return el;
    };

    /* each line to write: how it looks (mode), how its letters are staggered (one by one, or a word at a time) and how
       wide each letter's own stretch is, as a share of the line's progress; inside the statement's hold, the share of
       the hold it is written in; elsewhere, how much of the window it takes to write (span, in screens) and how far
       it waits behind the line it is measured by (lag) */
    const items = [];
    const add = (el, mode, o = {}) => {
      if (!el || el._fx) return;
      if (mode === "odo") splitOdo(el); else splitFx(el, mode, o.keys);
      el._ch = $$(".ch", el); el._wd = $$(".wd", el); el._fx = mode;
      el.classList.add("wl", "fx", `fx-${mode}`);
      const ch = el._ch, n = ch.length, w = o.w ?? 0.3;
      if (o.word) {
        const ws = el._wd, m = ws.length;
        ws.forEach((wd, k) => $$(".ch", wd).forEach((c) => { c._a = m > 1 ? (k / (m - 1)) * (1 - w) : 0; c._w = w; }));
      } else ch.forEach((c, i) => { c._a = n > 1 ? (i / (n - 1)) * (1 - w) : 0; c._w = w; });
      ch.forEach((c) => { c._r = (rnd() * RUNES.length) | 0; });
      let pen = null;
      if (o.pen) { pen = document.createElement("i"); pen.className = `fx-pen fx-${o.pen}`; pen.setAttribute("aria-hidden", "true"); el.append(pen); }
      items.push({ el, mode, pen, hold: o.hold || null, anc: o.anc || null, span: o.span ?? 0.33, lag: o.lag || 0, spark: !!o.spark,
        runes: mode === "runes", px: mode === "runes" || mode === "pixel", P: null });
    };
    const holdEl = $(".me-hold");
    add($(".me-say .display:not(.kick)"), "runes", { w: 0.38, hold: [0, 0.55], span: 0.5, keys: KEY_WORDS, spark: true });
    add($(".me-say .display.kick"), "ink", { w: 0.26, hold: [0.52, 0.79], span: 0.4, pen: "quill", spark: true });
    add($(".me-roles"), "type", { w: 0.3, hold: [0.77, 0.9], span: 0.25, pen: "caret" });
    add($(".me-cat"), "tumble", { w: 0.35, hold: [0.88, 1], span: 0.3 });
    const cal = $(".cal");
    add($(".cal-h"), "runes", { w: 0.35, anc: cal, span: 0.3 });
    add($(".cal-key"), "type", { w: 0.3, anc: cal, span: 0.3, lag: 0.55, pen: "caret" });
    add($(".idx-h"), "pixel", { w: 0.5, span: 0.3 });
    const TITLES = ["runes", "breathe", "pixel", "rise"];
    let e = 0;
    $$(".yrs .yr").forEach((yr, k) => {
      add($(".yr-n", yr), k % 2 ? "pixel" : "odo", { w: k % 2 ? 0.5 : 0.6, span: 0.28 });
      $$(".yr-list > li", yr).forEach((li) => {
        const t = $(".e-t", li), title = t?.textContent || "", mode = TITLES[e % TITLES.length];
        const keys = Object.entries(KEYS).find(([s]) => title.startsWith(s))?.[1];
        add(t, mode, { w: mode === "breathe" || mode === "rise" ? 0.45 : mode === "pixel" ? 0.4 : 0.3, word: mode === "breathe" || mode === "rise", span: 0.3, keys, spark: true });
        add($(".e-w", li), "type", { w: 0.3, span: 0.18, pen: "caret" });
        $$("ul li", li).forEach((b) => add(b, e % 2 ? "ink" : "type", { w: 0.3, span: 0.18, pen: e % 2 ? null : "caret" }));
        e++;
      });
    });

    /* where things are: each line's top in the page (or its anchor's, for the lines in the calendar's sticky corner,
       whose own place changes as it sticks), the hold's, and each letter's place in its line for the pens. Read only
       when the page has changed size, in the read pass, never in the scrub */
    let gen = -1, gw = -1, dirty = true, holdTop = 0, holdH = 0;
    const place = () => {
      if (!dirty && gen === SM.placedGen && gw === SM.vw) return;
      dirty = false; gen = SM.placedGen; gw = SM.vw;
      const y = SM.y;
      const hr = holdEl?.isConnected ? holdEl.getBoundingClientRect() : null;
      if (hr) { holdTop = hr.top + y; holdH = hr.height; }
      for (const it of items) {
        it.top = (it.anc || it.el).getBoundingClientRect().top + y;
        it.P = null;
        if (!it.pen) continue;
        for (const c of it.el._ch) {
          let x = c.offsetLeft, t = c.offsetTop;
          for (let p = c.offsetParent; p && p !== it.el && it.el.contains(p); p = p.offsetParent) { x += p.offsetLeft; t += p.offsetTop; }
          c._x = x; c._y = t; c._ww = c.offsetWidth; c._h = c.offsetHeight;
        }
      }
    };
    document.fonts?.addEventListener("loadingdone", () => { dirty = true; });

    // stardust for the key words as they land and for the quill as it writes, thrown from the next read pass
    let sparks = [];
    const Q = 50;
    const run = () => {
      const y = SM.y, H = SM.vh, calm = still(), held = !!holdEl?.isConnected && !SM.COLUMN.matches;
      // the hold: the statement and its kicker are written while the hold comes up the window (most of the way, 0.82,
      // by the time its top, the stop's top, reaches the window's top, so a jump to the stop lands on them whole); the
      // rest is written through most of its pinned stretch
      const d = holdTop - y, q = d > 0 ? 0.82 * (1 - d / (H * 0.9)) : 0.82 + (0.18 * -d) / Math.max(1, (holdH - H) * 0.85), holdNear = held && holdTop < y + 2 * H && holdTop + holdH > y - H;
      for (const it of items) {
        let P;
        if (calm) P = 9;
        else if (it.hold && held) { if (!holdNear) continue; P = (q - it.hold[0]) / (it.hold[1] - it.hold[0]); }
        else { if (it.top > y + 2 * H || it.top < y - 2 * H) continue; P = (H - (it.top - y)) / (H * it.span) - it.lag; }
        if (it.P === P) continue;
        const fwd = it.P !== null && P > it.P;
        it.P = P;
        const ch = it.el._ch;
        let front = -1;
        for (let i = 0; i < ch.length; i++) {
          const c = ch[i], F = Math.round(Math.min(1, Math.max(0, (P - c._a) / c._w)) * Q) / Q;
          if (F > 0) front = i;
          if (c._f === F) continue;
          if (fwd && it.spark && F >= 0.86 && c._f < 0.86 && (c.parentNode.classList.contains("em") || (it.pen && i % 4 === 0))) sparks.push(c);
          c._f = F; c.style.setProperty("--f", F);
          if (it.runes) { const g = F > 0 && F < 0.45 ? RUNES[(c._r + ((F * 16) | 0)) % RUNES.length] : c._g; if (g && c._g !== g) { c._g = g; c.dataset.g = g; } }
          if (it.px) { const s = F < 0.5 ? "70" : "35"; if (c._s !== s) { c._s = s; c.dataset.s = s; } }
        }
        if (!it.pen || calm) continue;
        // the caret sits after the last letter typed; the quill's nib on the letter being inked, as far across it as
        // the ink has come
        const c = ch[Math.max(0, front)];
        if (c._x === undefined) continue;
        let x, py, o;
        if (it.mode === "type") { x = front >= 0 ? c._x + c._ww : c._x; py = c._y + c._h / 2; o = P <= 0 ? 0 : P < 1 ? 1 : Math.max(0, 1 - (P - 1) / 0.3); }
        else { x = c._x + c._ww * Math.min(1, (c._f || 0) / 0.35); py = c._y + c._h * 0.8; o = Math.min(1, Math.max(0, P / 0.04)) * Math.min(1, Math.max(0, (1.1 - P) / 0.16)); }
        const T = `translate3d(${x.toFixed(1)}px, ${py.toFixed(1)}px, 0)`, O = o.toFixed(2);
        if (it.pen._t !== T) { it.pen._t = T; it.pen.style.transform = T; }
        if (it.pen._o !== O) { it.pen._o = O; it.pen.style.opacity = O; }
      }
    };
    place(); run();
    SM.measure(() => {
      place();
      if (sparks.length) { for (const c of sparks.slice(0, 6)) { const r = c.getBoundingClientRect(); SM.sparkle?.(r.left + r.width / 2, r.top + r.height * 0.4, c.parentNode.classList.contains("em") ? 4 : 2); } sparks = []; }
    });
    SM.scrub(run);
  });

  /* ---------------------------------------------------------------- "What I work with" as a catalogue: each group's
     name stands on its own line, so it drops the full stop that ran it into its list (about-proto.css lays it out) */
  when(() => $(".idx .idx-text p i"), () => $$(".idx .idx-text p i").forEach((i) => { i.textContent = i.textContent.replace(/\.\s*$/, ""); }));

  /* ---------------------------------------------------------------- "What I work with" holds */
  when(() => $(".idx .idx-text p"), () => {
    if (SM.COLUMN.matches) return;
    const idx = $(".idx"), pin = document.createElement("div");
    pin.className = "idx-pin";
    pin.append(...idx.childNodes);
    idx.append(pin);
    idx.classList.add("hold");
    const items = $$(".idx-text p", idx), N = items.length;
    let lastNow = -1, idxRead = null;
    // while the page moves, where the section is gets read in the page's read pass, before any scrub writes
    SM.measure(() => { idxRead = idx.getBoundingClientRect(); });
    const hold = () => {
      const r = idxRead || idx.getBoundingClientRect(), H = SM.vh; idxRead = null;
      if (r.bottom < -H || r.top > 2 * H) return;
      // the entries begin once the section's top reaches the middle of the window, and are all in by three quarters
      // of the hold; the rest of the hold lets them be read
      const p = still() ? 1 : clamp((H * 0.5 - r.top) / (r.height - H * 0.5));
      let now = -1;
      items.forEach((el, i) => {
        const a = (i / N) * 0.72, k = SM.smooth(clamp((p - a) / 0.14)), K = k.toFixed(3);
        if (el._k !== K) { el._k = K; el.style.setProperty("--k", K); }
        if (k > 0.05) now = i;
      });
      if (p >= 0.86) now = -1;
      if (now !== lastNow) {
        items.forEach((el, i) => el.classList.toggle("now", i === now));
        if (now > lastNow && now >= 0) { const ir = $("i", items[now])?.getBoundingClientRect(); if (ir) SM.sparkle?.(ir.left + 6, ir.top + ir.height / 2, 4); }
        lastNow = now;
      }
    };
    hold(); SM.scrub(hold);
  });

  /* ---------------------------------------------------------------- "What I work with": the constellations
     The tools' real icons are the stars, asleep in lilac, joined in three constellations (Design, Video, Code). The
     scroll draws the icons in one after another, then the dotted lines between them; the sparkles turn with the
     scroll. The section's heading moves onto the board, and the full list follows under it (in its hold). The board
     is decoration for sighted readers; the list carries the same tools in words. */
  const TOOLS = [
    // [name, icon, width, height, colour, wide x, y, size, phone x, y, size, constellation]
    ["Figma", "/logos/figma.webp", 192, 192, "#F24E1E", 44, 23, 9.3, 28, 44, 22, 0],
    ["Photoshop", "art/tools/ps.svg", 240, 234, "#31A8FF", 58, 14, 8.5, 70, 36, 20, 0],
    ["Illustrator", "art/tools/ai.svg", 250, 250, "#FF9A00", 69, 28, 8, 76, 70, 18.6, 0],
    ["Canva", "art/tools/canva-tile.svg", 240, 240, "#00C4CC", 54, 37, 7.4, 40, 80, 17, 0],
    ["After Effects", "art/tools/ae.svg", 240, 234, "#9999FF", 89, 30, 7.2, 72, 114, 18.6, 1],
    ["Premiere Pro", "art/tools/pr.svg", 240, 234, "#EA77FF", 80, 45, 8, 30, 122, 20, 1],
    ["Python", "art/tools/py-tile.svg", 240, 234, "#FFD43B", 24, 41, 7.4, 32, 166, 18.6, 2],
    ["JavaScript", "art/tools/js-tile.svg", 240, 234, "#F7DF1E", 36, 52, 6.6, 72, 176, 17, 2],
  ];
  // [name, depth, wide x, y, phone x, y]
  const GROUPS = [["Design", 1.2, 31, 16, 8, 28], ["Video", 2, 87, 41, 8, 104], ["Code", 0.6, 16, 34, 8, 150]];
  const LINES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [6, 7]];
  const toolHtml = (t, k) => `<div class="tool" role="button" tabindex="0" aria-label="${t[0]}" style="--x:${t[5]};--y:${t[6]};--s:${t[7]};--px:${t[8]};--py:${t[9]};--ps:${t[10]};--c:${t[4]}">` +
    `<i class="glow"></i><span class="pic" data-kind="paint"${t[0] === "Canva" ? ' data-lift="0.2"' : ""}><img class="full" src="${t[1]}" width="${t[2]}" height="${t[3]}" alt="" loading="lazy"></span>` +
    `<i class="tw"></i><span class="tool-n" aria-hidden="true">${t[0]}</span></div>`;
  when(() => $(".idx .idx-h"), () => {
    const idx = $(".idx"), head = $(".idx-h");
    const tb = document.createElement("div");
    tb.className = "tb";
    tb.innerHTML = `<div class="stars" aria-hidden="true"></div>` +
      `<svg class="tb-lines" viewBox="0 0 100 62.5" preserveAspectRatio="none" aria-hidden="true">${LINES.map(() => "<line/>").join("")}</svg>` +
      // what the pointer can catch of a constellation besides its stars: a broad band along each of its lines, and the
      // whole of the design group's four-sided figure (wide screens only; phones keep the full list on show)
      `<svg class="tb-hits" viewBox="0 0 100 62.5" preserveAspectRatio="none" aria-hidden="true">` +
      `<polygon data-g="0" points="${[0, 1, 2, 3].map((k) => `${TOOLS[k][5]},${TOOLS[k][6]}`).join(" ")}"/>` +
      LINES.map(([a, b]) => `<line data-g="${TOOLS[a][11]}" x1="${TOOLS[a][5]}" y1="${TOOLS[a][6]}" x2="${TOOLS[b][5]}" y2="${TOOLS[b][6]}"/>`).join("") + `</svg>` +
      `<p class="tb-hint">${SM.HOVER ? "Point at" : "Tap"} a star or a constellation to read its skills.</p>` +
      GROUPS.map(([g, depth, x, y, px, py], gi) => `<div class="grp" data-depth="${depth}"><p class="cn" aria-hidden="true" style="--x:${x};--y:${y};--px:${px};--py:${py}">${g}</p>` +
        TOOLS.map((t, k) => (t[11] === gi ? toolHtml(t, k) : "")).join("") + "</div>").join("");
    idx.before(tb);
    tb.prepend(head);   // the real heading, still the section's label, now set on the board
    SM.stars($(".stars", tb), 46, [[8, 6, 34, 18]], 23);
    const tiles = $$(".tool", tb), bms = SM.pictures(tb).filter((b) => b.pic.closest(".tool"));
    SM.whenNear(tb, () => bms.forEach((b) => b.load().catch(() => {})));
    const order = tiles.map((el) => TOOLS.findIndex((t) => t[0] === $(".tool-n", el).textContent));
    const at = (k) => { const t = TOOLS[k]; return SM.COLUMN.matches ? [t[8], t[9]] : [t[5], t[6]]; };
    const svg = $(".tb-lines", tb), ls = $$("line", svg), sparks = $$(".tw", tb), grps = $$(".grp", tb);

    /* the skills, read off the board: waking a tool (hover, focus or tap) hangs a small label from it on a dotted
       thread, with its constellation's name and the skills that go with it. The skills list under the board stays as
       it is, and each tool points at its group's lines there (aria-describedby), so a screen reader hears them once,
       when the tool is reached, and the label itself is left out of the reading (aria-hidden).
       The label lingers: it stays after the pointer leaves, and goes only when another tool wakes (which takes it over)
       or as the board scrolls away, fading over the last half screen of scroll before it would leave the window. The
       fade is worked out from the scroll in the board's scrub, so it runs back when scrolling back, and no timer is
       needed. On a touch screen a tap shows it and it stays the same way. */
    const SKILLS_OF = [["Design"], ["Video editing"], ["Programming", "Backend & data"]];
    // each line is the group's paragraph without its label; the label is cut by its own text, not at the first full
    // stop, because "Node.js" has one
    const paras = $$(".idx-text p"), nameOf = (p) => p.querySelector("i")?.textContent.replace(/\.$/, "").trim();
    const lines = Object.fromEntries(paras.map((p) => [nameOf(p), p.textContent.replace(p.querySelector("i")?.textContent || "", "").replace(/^[.\s]+/, "").trim()]));
    paras.forEach((p, n) => { p.id ||= `idx-sk-${n}`; });
    tiles.forEach((el, k) => el.setAttribute("aria-describedby", SKILLS_OF[TOOLS[order[k]][11]].map((nm) => paras.find((p) => nameOf(p) === nm)?.id).filter(Boolean).join(" ")));
    // the label and its thread share one layer, which is moved into the woken tool's constellation so that it drifts
    // with it, and whose opacity alone the scroll changes
    const tag = document.createElement("div");
    tag.className = "tb-tag"; tag.setAttribute("aria-hidden", "true");
    tag.innerHTML = `<svg class="tb-tie"><line/></svg><div class="tb-say"></div>`;
    const say = $(".tb-say", tag), tie = $(".tb-tie line", tag);
    // what the fade needs, kept from the wake: the scroll then, and how far the page could scroll either way before
    // the label left the room between the masthead and the foot
    let told = -1, tagAt = null, tagO = "";
    /* the label sits beside the woken tool, on the first side (left, right, above, below) where it touches no other
       tool, no tool's name, no constellation's name, not the board's heading and not the board's edge. Where those
       things are is read from the page here, in the wake handler (never in a scrub), so the constellations' slow drift
       is counted too. Each side is tried centred on the tool and then lined up with its top or bottom (or left or
       right) edge. When no side is clear, the label goes to the clear place on the board nearest the tool, its thread
       then running the longer way to it. When nothing on the board is clear at the usual width, the label tries other
       shapes: wider and so shorter (the code group's two lines then sit side by side), then narrower; last it takes
       the placement that overlaps least. Only the part of the board between the masthead and the foot counts as room,
       so a long label is never pushed up under the masthead.
       shape: 0 the usual width, then the wider ones, then the narrow one (a share of the board's width) */
    const SHAPES = [0, 0.3, 0.35, 0.4, 0.17];
    // k is the woken tool; a constellation woken as a whole (its name or its lines) comes as k = -1 with its group g
    const tell = (k, shape = 0, g = TOOLS[k]?.[11]) => {
      const grp = grps[g];
      if (tag.parentNode !== grp) { grp.append(tag); grps.forEach((x) => (x.style.zIndex = x === grp ? "2" : "")); }
      say.style.width = shape ? `${Math.round(tb.clientWidth * SHAPES[shape])}px` : "";
      // a skill named as its group (Design) needs no title: the group's name already hangs over the constellation
      const out = SKILLS_OF[g].map((name) => (lines[name] ? `<p>${name === GROUPS[g][0] ? "" : `<i>${name}</i>`}<span>${lines[name]}</span></p>` : "")).join("");
      if (say.innerHTML !== out) say.innerHTML = out;
      // everything is measured from the constellation's own box, the box the label is laid in
      const G = grp.getBoundingClientRect(), W = G.width, H = G.height, w = say.offsetWidth, h = say.offsetHeight, gap = 30, pad = 10;   // gap: the thread's length beside the tool
      const rel = (el) => { const r = el.getBoundingClientRect(); return [r.left - G.left, r.top - G.top, r.right - G.left, r.bottom - G.top]; };
      const mast = $(".mast")?.getBoundingClientRect(), foot = $(".foot")?.getBoundingClientRect();
      const T = Math.max(0, (mast ? mast.bottom : 0) - G.top), Bt = Math.min(H, (foot ? foot.top : SM.vh) - G.top);
      const avoid = [rel(head), rel(hint)];
      // a constellation woken as a whole hangs its label from its name
      let me = k < 0 ? rel(cns[g]) : null, nm = me;
      tiles.forEach((el, n) => {
        if (order[n] === k) { me = rel($(".pic", el)); nm = rel($(".tool-n", el)); return; }
        avoid.push(rel($(".pic", el)), rel($(".tool-n", el)));
      });
      $$(".cn", tb).forEach((c) => avoid.push(rel(c)));
      avoid.push(me, nm);   // and the woken tool itself, with its name
      const [l, tp, r, b] = me, cx = (l + r) / 2 - w / 2, cy = (tp + b) / 2 - h / 2, nb = Math.max(b, nm[3]);
      const sides = [
        ["left", l - gap - w, cy], ["left", l - gap - w, tp], ["left", l - gap - w, b - h],
        ["right", r + gap, cy], ["right", r + gap, tp], ["right", r + gap, b - h],
        ["above", cx, tp - gap - h], ["above", l, tp - gap - h], ["above", r - w, tp - gap - h],
        ["below", cx, nb + gap], ["below", l, nb + gap], ["below", r - w, nb + gap],
      ];
      const hit = ([, a, c]) => {
        if (a < 0 || c < T || a + w > W || c + h > Bt) return Infinity;
        return avoid.reduce((m, q) => m + Math.max(0, Math.min(a + w + pad, q[2]) - Math.max(a - pad, q[0])) * Math.max(0, Math.min(c + h + pad, q[3]) - Math.max(c - pad, q[1])), 0);
      };
      // the way out when no side is clear: every place on the board, a few pixels apart, the nearest to the tool first
      const mx = (l + r) / 2, my = (tp + b) / 2, apart = [];
      for (let y = T + 8; y + h <= Bt - 8; y += 12) for (let x = 8; x + w <= W - 8; x += 12) apart.push(["apart", x, y]);
      const far = ([, x, y]) => Math.hypot(clamp(mx, x, x + w) - mx, clamp(my, y, y + h) - my);
      apart.sort((a, c) => far(a) - far(c));
      const first = sides.find((c) => hit(c) === 0) || apart.find((c) => hit(c) === 0);
      if (!first && shape < SHAPES.length - 1) return tell(k, shape + 1, g);   // nothing clear in this shape: the next one
      const best = first || sides.concat(apart).sort((a, c) => hit(a) - hit(c))[0], [, x, y] = best;
      // the thread: from the tool (or from under its name, when the label hangs below) to the nearest point of the label
      const ux = Math.min(l, nm[0]), vx = Math.max(r, nm[2]), vy = best[0] === "below" ? nb : b;
      const ex = clamp(mx, x, x + w), ey = clamp(my, y, y + h);
      const sx = Math.min(Math.max(ex, ux), vx), sy = Math.min(Math.max(ey, tp), vy);
      tie.setAttribute("x1", sx.toFixed(1)); tie.setAttribute("y1", sy.toFixed(1)); tie.setAttribute("x2", ex.toFixed(1)); tie.setAttribute("y2", ey.toFixed(1));
      say.style.left = `${x.toFixed(1)}px`; say.style.top = `${y.toFixed(1)}px`;
      say.dataset.side = best[0];
      tagAt = { y: SM.y, up: y + h - T, down: Bt - y };
      const who = k < 0 ? `g${g}` : k;
      if (told !== who && !still()) say.animate([{ opacity: 0, translate: "0 6px" }, { opacity: 1, translate: "0 0" }], { duration: 220, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
      told = who;
      tagO = ""; fadeTag();
    };
    /** the label's opacity, from the scroll alone: whole while it is well inside the window, then fading over half a
        screen of scroll as it goes under the masthead or the foot (from a quarter screen before it reaches them, or
        from where it was woken, when that was nearer) */
    const fadeTag = () => {
      if (!tagAt) return;
      const d = SM.y - tagAt.y, room = d > 0 ? tagAt.up : tagAt.down, from = Math.max(0, room - SM.vh * 0.25);
      const o = still() ? (Math.abs(d) < room ? 1 : 0) : 1 - SM.smooth(clamp((Math.abs(d) - from) / (SM.vh * 0.5)));
      const s = o < 0.01 ? "0" : (Math.round(o * 50) / 50).toString();
      if (s !== tagO) { tagO = s; tag.style.opacity = s; tag.style.visibility = s === "0" ? "hidden" : "visible"; }
    };
    /* the constellation the pointer is on glows: its lines brighten and its stars catch a little of their own light,
       for as long as the pointer stays (a short transition, about-proto.css) */
    const hint = $(".tb-hint", tb), cns = $$(".cn", tb), lineG = LINES.map(([a]) => TOOLS[a][11]);
    const glowGroup = (g) => {
      grps.forEach((x, n) => x.classList.toggle("hot", n === g));
      ls.forEach((l, j) => l.classList.toggle("hot", lineG[j] === g));
    };
    cns.forEach((c, g) => {
      c.addEventListener("pointerenter", () => { tell(-1, 0, g); glowGroup(g); });
      c.addEventListener("pointerleave", () => glowGroup(-1));
      c.addEventListener("click", () => tell(-1, 0, g));
    });
    $$(".tb-hits [data-g]", tb).forEach((h) => {
      const g = +h.dataset.g;
      h.addEventListener("pointerenter", () => { tell(-1, 0, g); glowGroup(g); });
      h.addEventListener("pointerleave", () => glowGroup(-1));
    });
    tiles.forEach((el, k) => {
      const i = order[k];   // the TOOLS index of this tile
      el.addEventListener("pointerenter", () => glowGroup(TOOLS[i][11]));
      el.addEventListener("pointerleave", () => glowGroup(-1));
      // a tool reached by the keyboard wakes into its colours as the pointer would wake it (the pointer and a tap wake
      // the picture themselves), and stays awake for a while after, as a hovered picture does
      const key = () => { tell(i); const bm = SM.bitmap(el); if (bm) { bm.wakeUp(320); bm.rest(); } };
      el.addEventListener("pointerenter", () => tell(i));
      el.addEventListener("click", () => tell(i));
      el.addEventListener("focusin", () => { if (el.matches(":focus-visible")) key(); });
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); key(); } });
    });
    // where the board is and, with no pointer, where each icon is: only reads the page. While the page moves this runs
    // in the page's read pass, before any scrub writes, so the board costs no layout of its own
    const boardAt = () => {
      const w = SM.where(tb);
      return { w, pics: w.near && !SM.HOVER ? bms.map((b) => b.pic.getBoundingClientRect()) : null };
    };
    let boardRead = null;
    SM.measure(() => { boardRead = boardAt(); });
    const board = () => {
      const { w, pics } = boardRead || boardAt(), q = still(); boardRead = null;
      if (!w.near) return;
      const vb = SM.COLUMN.matches ? "0 0 100 196" : "0 0 100 62.5";
      if (svg.getAttribute("viewBox") !== vb) svg.setAttribute("viewBox", vb);
      // no pointer to wake them: each icon wakes into its colours as the scroll carries it across the middle of the screen
      if (!SM.HOVER) bms.forEach((b, i) => {
        const r = pics[i], f = q ? 0 : SM.smooth(clamp(1 - Math.abs((r.top + r.height / 2) / w.vh - 0.5) / 0.16));
        b.setFloor(f); tiles[i].classList.toggle("lit", f > 0.5);
      });
      const t = q ? 1 : clamp((w.vh - w.top) / (w.vh * 1.1));   // 0 as the board comes in, 1 a little after its top reaches the top
      // the stars are drawn in one after another, then the lines between them, each from one star towards the next
      bms.forEach((b, i) => b.setShow(SM.smooth(clamp((t - 0.12 - order[i] * 0.045) / 0.22))));
      ls.forEach((l, j) => {
        const [a, b] = LINES[j], [ax, ay] = at(a), [bx, by] = at(b), f = SM.smooth(clamp((t - 0.42 - j * 0.06) / 0.2));
        l.setAttribute("x1", ax); l.setAttribute("y1", ay); l.setAttribute("x2", ax + (bx - ax) * f); l.setAttribute("y2", ay + (by - ay) * f);
        l.style.opacity = f > 0 ? 1 : 0;
      });
      // the three constellations sit at different depths, so they slide past each other a little
      const drift = q ? 0 : (0.5 - clamp((-w.top + w.vh * 0.5) / (w.vh * 1.5))) * SM.u();
      grps.forEach((g) => (g.style.transform = `translate3d(0, ${(drift * 3 * +g.dataset.depth).toFixed(1)}px, 0)`));
      // the sparkles turn with the scroll, never on a timer
      sparks.forEach((s, k) => (s.style.opacity = q ? 1 : (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(SM.y / 85 + k * 2.3))).toFixed(3)));
      fadeTag();
    };
    board(); SM.scrub(board);
  });

  /* ---------------------------------------------------------------- films: a silent loop on the monitor */
  when(() => $$(".fr-frame").length, () => {
    // every film has a five-second silent loop, cut from the film itself (960 by 540, about 300 KB each)
    const LOOPS = new Set(["breaking-barriers", "solar-system-song", "horror-trailer", "basick-math", "nobody-mitski", "brenia-18", "arduino-trailer", "self-portrait", "workout-series", "vb-hand-signals"]);
    const films = DATA.films || [], frames = $$(".fr-frame");
    const vids = frames.map((f, i) => {
      const id = films[f.dataset.i != null ? +f.dataset.i : i]?.id;
      if (!id || !LOOPS.has(id)) return null;
      const v = Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true, preload: "none", className: "fr-vid" });
      v.setAttribute("aria-hidden", "true");
      v.dataset.src = `loops/films/${id}.mp4`;
      return { f, v, ok: null };
    });
    // films without a loop keep their still frame
    vids.forEach((x) => { if (!x) return; x.ok = true; x.v.src = x.v.dataset.src; x.f.append(x.v); x.v.addEventListener("error", () => { x.ok = false; x.v.remove(); }); });
    let playing = null;
    const pick = () => {
      if (!SM.where($("#films")).near || still()) { if (playing) { playing.v.pause(); playing.v.classList.remove("on"); playing = null; } return; }
      // the film under the playhead is the first frame the monitor shows in full
      const x = vids.find((y) => y && y.ok && getComputedStyle(y.f).visibility === "visible");
      if (x === playing) return;
      if (playing) { playing.v.pause(); playing.v.classList.remove("on"); }
      playing = x || null;
      if (playing) { playing.v.currentTime = 0; playing.v.play().then(() => playing?.v.classList.add("on")).catch(() => {}); }
    };
    SM.scrub(pick);
  });
})();
