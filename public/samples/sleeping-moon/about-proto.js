/* Prototype: About and the films' previews (see about-proto.css).
   - The statement's key words, prizes and honours, roles where Lana led and a few strong lines are marked.
   - "What I work with" holds on screen (wide screens) while its entries come in one by one with the scroll.
   - Each film listed in LOOPS gets a short silent loop (loops/films/<id>.mp4) on the monitor while it is under the
     playhead. The list is empty until the loops are cut from the films. */
(() => {
  const { $, $$ } = SM;
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  // the statement is split into letters by words-proto.js; its key words are marked once that has happened
  when(() => $(".me-say .display .ch"), () => {
    $$(".me-say .display:not(.kick) [aria-hidden] > span").forEach((w) => { if (KEY_WORDS.includes(w.textContent)) w.classList.add("em"); });
  });

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
  const toolHtml = (t, k) => `<div class="tool" style="--x:${t[5]};--y:${t[6]};--s:${t[7]};--px:${t[8]};--py:${t[9]};--ps:${t[10]};--c:${t[4]}">` +
    `<i class="glow"></i><span class="pic" data-kind="paint"${t[0] === "Canva" ? ' data-lift="0.2"' : ""}><img class="full" src="${t[1]}" width="${t[2]}" height="${t[3]}" alt="" loading="lazy"></span>` +
    `<i class="tw"></i><span class="tool-n">${t[0]}</span></div>`;
  when(() => $(".idx .idx-h"), () => {
    const idx = $(".idx"), head = $(".idx-h");
    const tb = document.createElement("div");
    tb.className = "tb";
    tb.innerHTML = `<div class="stars" aria-hidden="true"></div>` +
      `<svg class="tb-lines" viewBox="0 0 100 62.5" preserveAspectRatio="none" aria-hidden="true">${LINES.map(() => "<line/>").join("")}</svg>` +
      GROUPS.map(([g, depth, x, y, px, py], gi) => `<div class="grp" data-depth="${depth}" aria-hidden="true"><p class="cn" style="--x:${x};--y:${y};--px:${px};--py:${py}">${g}</p>` +
        TOOLS.map((t, k) => (t[11] === gi ? toolHtml(t, k) : "")).join("") + "</div>").join("");
    idx.before(tb);
    tb.prepend(head);   // the real heading, still the section's label, now set on the board
    SM.stars($(".stars", tb), 46, [[8, 6, 34, 18]], 23);
    const tiles = $$(".tool", tb), bms = SM.pictures(tb).filter((b) => b.pic.closest(".tool"));
    SM.whenNear(tb, () => bms.forEach((b) => b.load().catch(() => {})));
    const order = tiles.map((el) => TOOLS.findIndex((t) => t[0] === $(".tool-n", el).textContent));
    const at = (k) => { const t = TOOLS[k]; return SM.COLUMN.matches ? [t[8], t[9]] : [t[5], t[6]]; };
    const svg = $(".tb-lines", tb), ls = $$("line", svg), sparks = $$(".tw", tb), grps = $$(".grp", tb);
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
