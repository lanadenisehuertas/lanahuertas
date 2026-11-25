/* Prototype: the magic layer (see magic-proto.css). Loads after every other script. */
(() => {
  const { $, $$ } = SM, root = document.documentElement;
  const still = () => SM.quiet();   // quiet mode stills the page: the visitor's switch, on from the start under reduced motion (moon.js)
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const arrow = `<svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h23M18.5 1.5L24 7l-5.5 5.5"/></svg>`;

  /* ================================================================ the veil
     It measures real work: the type faces and the first screen's pictures. The moon fills and the words light up as
     far as that work has got; when it is all there the veil dissolves and the title is cast. */
  const veil = $("#veil"), title = $(".pl-title"), plLine = $(".pl-line");
  const lift = () => {
    root.classList.remove("loading");
    if (title) { (title._ch || $$(".ch", title)).forEach((c, i) => c.style.setProperty("--i", i)); title.classList.add("cast"); }
    plLine?.classList.add("cast");
    if (!veil) return;
    veil.classList.add("out");
    setTimeout(() => veil.remove(), 280);
  };
  if (veil) {
    const word = $(".veil-word", veil), moon = $(".veil-moon", veil);
    word.innerHTML = [...word.textContent].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
    const letters = $$("span", word), jobs = [document.fonts?.ready || Promise.resolve()];
    // the faces the first screen is set in, asked for by name and at once: the room's words are only made a moment
    // after the first frame, when the browser's own list of fonts to fetch may already have settled, so waiting on that
    // list alone could lift the veil before the room's type had come, and the words would change face in plain view
    if (document.fonts?.load) ['400 30px "Redaction"', 'italic 400 30px "Redaction"', '400 30px "Redaction 35"', '400 17px "Atkinson Hyperlegible Next"']
      .forEach((f) => jobs.push(document.fonts.load(f).catch(() => {})));
    // the room is built a moment after the first frame (room-proto.js), and says when it and its pictures are there; any
    // face it asked for on the way is waited for too
    if (SM.roomReady) jobs.push(SM.roomReady.then(() => document.fonts?.ready));
    // the pictures on the first screen: the room's, when it opens the page, and the moon's stop's own (not those that
    // wait to be scrolled near, which would hold the veil until its five seconds are up)
    $$(".room-intro img, #moon img").filter((im) => im.loading !== "lazy").forEach((im) => jobs.push(im.complete ? Promise.resolve() : new Promise((r) => { im.addEventListener("load", r, { once: true }); im.addEventListener("error", r, { once: true }); })));
    let got = 0, shown = 0, t0 = performance.now(), gone = false, lastF = -1, last = 0;
    jobs.forEach((j) => j.then(() => got++, () => got++));
    const step = (now) => {
      if (gone) return;
      const goal = now > 5000 || now - t0 > 5000 ? 1 : got / jobs.length;      // never hold anyone longer than five seconds
      // the moon fills a seventh of the way each frame at sixty frames a second; when the page is busy loading and frames
      // come further apart, each frame goes as far as the frames it missed would have, so the veil is not held longer
      // than it needs to be (never less than a seventh, so on a faster screen it fills as it always has)
      const dt = last ? Math.min(100, now - last) : 16.7; last = now;
      shown += (goal - shown) * Math.max(0.14, 1 - Math.pow(0.86, dt / 16.7));
      if (goal === 1 && shown > 0.985) shown = 1;
      const f = Math.round(shown * 12) / 12;
      if (f !== lastF) { lastF = f; moon.innerHTML = SM.moonSvg(Math.max(0.04, f)); letters.forEach((l, i) => l.classList.toggle("lit", i < Math.round(shown * letters.length))); }
      if (shown === 1 && now - t0 > 700) { gone = true; setTimeout(lift, 160); return; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } else lift();

  /* ================================================================ the first screen */
  const hero = $("#moon"), prelude = $("#prelude"), horizon = $(".horizon", hero);
  if (prelude) prelude.insertAdjacentHTML("beforeend", `<span class="pl-cue" aria-hidden="true"><i></i></span>`);
  let motes = [];
  if (horizon) {
    let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const box = Object.assign(document.createElement("div"), { className: "motes" });
    box.innerHTML = Array.from({ length: 22 }, (_, k) => `<i class="${k % 3 ? "" : "b"}" style="left:${(4 + rnd() * 92).toFixed(1)}%"></i>`).join("");
    horizon.append(box);
    motes = $$("i", box).map((el) => ({ el, d: rnd() * 0.55, h: 8 + rnd() * 22, sway: rnd() * 6.28 }));
  }

  /* ================================================================ the sky moves */
  const field = $(".sky .field"), sky = $(".sky");
  const comet = sky && sky.appendChild(Object.assign(document.createElement("i"), { className: "comet" }));
  if (comet) comet.style.inset = "auto";
  let px = 0, py = 0, fx = 0, fy = 0, lean = 0;
  // the star field sways with the scroll and leans away from the pointer
  const sway = () => { const U = SM.u(), y = SM.y; if (field) field.style.transform = `translate3d(${(Math.cos(y / 1300) * 1.4 * U - fx * 1.6 * U).toFixed(1)}px, ${(Math.sin(y / 900) * 2 * U - fy * 1.2 * U).toFixed(1)}px, 0) scale(${(SM._fs || 1).toFixed(4)})`; };
  const leanLoop = () => { fx += (px - fx) * 0.08; fy += (py - fy) * 0.08; sway(); lean = Math.abs(px - fx) + Math.abs(py - fy) > 0.002 ? requestAnimationFrame(leanLoop) : 0; };
  if (SM.HOVER) addEventListener("pointermove", (e) => { if (e.pointerType === "touch" || still()) return; px = e.clientX / SM.vw - 0.5; py = e.clientY / SM.vh - 0.5; if (!lean) lean = requestAnimationFrame(leanLoop); }, { passive: true });
  SM.scrub(() => {
    if (still()) { if (field) field.style.transform = ""; return; }
    // the sky and its comet rest while the room's night hides them (room-proto.js)
    if (root.classList.contains("room-covers")) return;
    const U = SM.u(), y = SM.y, W = SM.vw, H = SM.vh;
    sway();
    // one comet for every screen and a half of scroll; it moves only as far as the scroll does
    if (comet) {
      const t = (y / (H * 1.5)) % 1;
      comet.style.transform = `translate3d(${(W * (1.08 - t * 1.2)).toFixed(1)}px, ${(H * (0.07 + t * 0.3)).toFixed(1)}px, 0)`;
      comet.style.opacity = (Math.sin(t * Math.PI) * 0.9).toFixed(3);
    }
    // motes lift off the horizon while the moon rises
    if (motes.length && hero.classList.contains("rising")) {
      const p = clamp(-SM.where(hero).top / H - (+hero.dataset.riseAt || 0));
      motes.forEach((m) => {
        const q = clamp((p - m.d * 0.6) / 0.45);
        m.el.style.transform = `translate3d(${(Math.sin(q * 5 + m.sway) * 0.8 * U).toFixed(1)}px, ${(-q * m.h * U - p * 14 * U).toFixed(1)}px, 0)`;
        m.el.style.opacity = (Math.sin(q * Math.PI) * 0.95).toFixed(3);
      });
    }
  });

  /* ================================================================ sparkles */
  const layer = document.body.appendChild(Object.assign(document.createElement("div"), { className: "spk-layer" }));
  layer.setAttribute("aria-hidden", "true");
  const pool = Array.from({ length: 22 }, () => layer.appendChild(Object.assign(document.createElement("i"), { className: "spk" })));
  let next = 0, tint = "#fff1c9";
  const retint = () => { tint = SM.stop?.dataset.sky === "dawn" ? "#fffdf4" : (SM.stop && getComputedStyle(SM.stop).getPropertyValue("--mark").trim()) || "#fff1c9"; };
  SM.onStop?.(retint);
  const spark = (x, y, spread = 14, small = false) => {
    const el = pool[next++ % pool.length], a = Math.random() * 6.28, d = spread * (0.5 + Math.random());
    el.className = "spk" + (small ? " s" : "");
    el.style.cssText = `color:${tint};--x:${x.toFixed(0)}px;--y:${y.toFixed(0)}px;--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d - spread * 0.6).toFixed(0)}px`;
    void el.offsetWidth; el.classList.add("fly");
  };
  const burst = (el, n = 5) => {
    if (still() || !el?.getBoundingClientRect) return;
    const r = el.getBoundingClientRect();
    for (let k = 0; k < n; k++) { const e = Math.random() * 4 | 0, t = Math.random();
      spark(e % 2 ? r.left + t * r.width : e ? r.right : r.left, e % 2 ? (e === 1 ? r.top : r.bottom) : r.top + t * r.height, 12, k % 2 === 1); }
  };
  let lx = 0, ly = 0, hot = null;
  addEventListener("pointermove", (e) => {
    if (SM.trail || e.pointerType === "touch" || still()) return;   // trail-proto.js draws the pointer's trail when it is there
    if (Math.hypot(e.clientX - lx, e.clientY - ly) < 64) return;
    lx = e.clientX; ly = e.clientY;
    spark(lx + (Math.random() - 0.5) * 18, ly + (Math.random() - 0.5) * 18, 10, Math.random() < 0.5);
  }, { passive: true });
  addEventListener("pointerover", (e) => {
    const t = e.target.closest?.("a, button, .pic.woken, .vs-star");
    if (t === hot) return;
    hot = t;
    if (t && e.pointerType !== "touch") { spell(t); burst(t, t.matches(".vs-star") ? 3 : 4); }
  }, { passive: true });
  addEventListener("pointerdown", (e) => { if (still() || SM.trail) return; for (let k = 0; k < 6; k++) { const a = k * 1.05; spark(e.clientX + Math.cos(a) * 12, e.clientY + Math.sin(a) * 12, 20, k % 2 === 0); } }, { passive: true });
  document.addEventListener("sm:burst", (e) => burst(e.detail, 12));

  /* ================================================================ words that ripple
     The last run of text in a link or button is split into letters the first time it is pointed at. Screen readers
     keep the whole word. Buttons whose words change while they work are left alone. */
  function spell(el) {
    if (el._sp || !el.matches("a, button") || el.matches("[type=submit], .vs-open, .vs-star, .vs-new, .door, .home, .switch, .h-pk, .s-piece, #t-copy")) return;
    el._sp = true;
    const node = [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!node) return;
    const text = node.textContent, w = document.createElement("span"), sr = document.createElement("span");
    w.className = "sw"; w.setAttribute("aria-hidden", "true"); sr.className = "vh"; sr.textContent = text;
    w.innerHTML = [...text].map((c, i) => (c === " " ? " " : `<span class="sl" style="--i:${i}">${esc(c)}</span>`)).join("");
    node.replaceWith(w, sr);
  }

  /* headings the scroll writes */
  const written = $$("#talk .end-h, #talk .t-big").map((h) => { SM.type(h); h.classList.add("wtype"); return h; });
  // read in the page's read pass, written in a scrub, so the headings cost no layout of their own while the page moves
  const writtenAt = () => written.map((h) => {
    const r = h.getBoundingClientRect(), H = SM.vh;
    if (r.top > H * 1.2 || r.bottom < -H * 0.2) return -1;
    return Math.round(clamp((H * 0.96 - r.top) / (H * 0.42)) * h._ch.length);
  });
  let writtenRead = null;
  SM.measure(() => { writtenRead = writtenAt(); });
  SM.scrub(() => {
    const ns = writtenRead || writtenAt(); writtenRead = null;
    written.forEach((h, i) => { const n = ns[i]; if (n >= 0 && h._n !== n) { h._n = n; h._ch.forEach((c, j) => c.classList.toggle("w", j < n)); } });
  });

  /* ================================================================ the star chart: every work, one click away */
  const D = typeof DATA !== "undefined" ? DATA : { brands: [], posters: [], films: [], products: [] };
  const first = (im) => (Array.isArray(im) ? (Array.isArray(im[0]) ? im[0] : im) : null);
  // each room says in plain words what is in it, so the chart reads as the site's table of contents
  const ROOMS = [
    { id: "brands", num: "I", name: "Brands", what: "Event identities and social campaigns", items: D.brands.map((b) => ({ t: b.name, im: first(b.imgs), c: b.ink })) },
    { id: "posters", num: "II", name: "Posters", what: "Single posters for events and causes", items: D.posters.map((p) => ({ t: p.t, im: first(p.img), c: p.ink })) },
    { id: "films", num: "III", name: "Films", what: "Trailers, short films and edits", items: D.films.map((f) => ({ t: f.t, im: first(f.img) })) },
    { id: "products", num: "IV", name: "Products", what: "Apps and sites I designed and built", items: D.products.map((p) => ({ t: p.t, im: first(p.shots), c: p.ink })) },
    { id: "about", num: "V", name: "About", what: "Who I am, my studies and the tools I use", items: [] },
    { id: "talk", num: "VI", name: "Contact", what: "Write to me, or leave a star in the sky", items: [] },
  ];
  const ALL = ROOMS.reduce((n, r) => n + r.items.length, 0);
  const atlas = document.createElement("dialog");
  atlas.className = "atlas"; atlas.setAttribute("aria-labelledby", "at-h"); atlas.setAttribute("aria-describedby", "at-lead");
  const group = (r) => `<div><button class="at-room" type="button" data-room="${r.id}" aria-describedby="at-d-${r.id}"><i>${r.num}</i>${r.name}</button><p class="at-what" id="at-d-${r.id}">${r.what}${r.items.length ? ` · ${r.items.length}` : ""}</p>${r.items.length ? `<ul>${r.items.map((w, i) =>
    `<li><button class="at-w" type="button" data-room="${r.id}" data-i="${i}" style="--c:${w.c || "#b9a2ff"}"><i></i>${esc(w.t)}</button></li>`).join("")}</ul>` : ""}</div>`;
  atlas.innerHTML = `<div class="stars" aria-hidden="true"></div>
    <div class="at-top"><h2 id="at-h">Star chart</h2><p id="at-lead">The table of contents: all ${ALL} pieces on this site, in six rooms. Pick a piece to go straight to it, or a room's name to start at its beginning.</p><button class="btn at-close" type="button">Close</button></div>
    <div class="at-map">${group(ROOMS[0])}${group(ROOMS[1])}${group(ROOMS[2])}<div>${ROOMS.slice(3).map(group).join("")}</div></div>
    <div class="at-peek" aria-hidden="true"><img alt="" width="720" height="900"></div>`;
  document.body.append(atlas);
  SM.stars($(".stars", atlas), 70, [], 23);
  const peek = $(".at-peek", atlas), peekImg = $("img", peek);
  const openChart = () => {
    if (atlas.open) return;
    document.body.classList.remove("menu-open");
    $$(".at-room", atlas).forEach((b) => b.setAttribute("aria-current", String(SM.stop?.id === b.dataset.room)));
    atlas.showModal();
    ($(".at-room[aria-current=true]", atlas) || $(".at-room", atlas)).focus();
  };
  const leave = (room, i, e) => {
    atlas.close();
    const from = e?.clientX ? { x: e.clientX, y: e.clientY } : undefined;
    SM.travel(room, from, { onJump: () => i != null && SM.rooms?.[room]?.jump(i, true) });
  };
  atlas.addEventListener("click", (e) => {
    const w = e.target.closest(".at-w, .at-room");
    if (w) return leave(w.dataset.room, w.dataset.i != null ? +w.dataset.i : null, e);
    if (e.target.closest(".at-close")) atlas.close();
  });
  const showPeek = (e) => {
    const w = e.target.closest?.(".at-w"), it = w && ROOMS.find((r) => r.id === w.dataset.room).items[+w.dataset.i];
    if (it?.im) { peekImg.src = it.im[0]; peek.classList.add("on"); } else peek.classList.remove("on");
  };
  atlas.addEventListener("pointerover", showPeek); atlas.addEventListener("focusin", showPeek);
  // ways in: the masthead and the phone menu
  const tools = $(".tools");
  // the way in is named for what it holds ("All work"); the chart it opens says it is the star chart
  tools?.insertAdjacentHTML("afterbegin", `<button class="chart-btn" type="button" aria-haspopup="dialog" aria-label="All work: the star chart, this site's table of contents"><i></i>All work</button>`);
  $(".route")?.insertAdjacentHTML("beforeend", `<a class="chart-link" href="#" role="button">All work (star chart)</a>`);
  $$(".chart-btn, .chart-link").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openChart(); }));
  // the room's "See all work" (room-proto.js) opens it too
  SM.chart = openChart;

  /* the way out of a long room: the next stop, always in the foot */
  const stops = $$("main > .stop"), foot = $(".foot");
  if (foot) {
    foot.insertAdjacentHTML("beforeend", `<button class="nextstop" type="button" id="nextstop" hidden></button>`);
    const btn = $("#nextstop");
    const set = () => {
      const k = stops.indexOf(SM.stop), n = k > 0 ? stops[k + 1] : null;
      btn.hidden = !n; btn._sp = false;
      if (n) { btn.dataset.to = n.id; btn.innerHTML = `<span class="long">Skip to</span>${(n.dataset.label || "").replace(/^[IVX]+\s+/, "").trim()}${arrow}`; }
    };
    SM.onStop?.(set); set();
    btn.addEventListener("click", (e) => SM.travel(btn.dataset.to, { x: e.clientX, y: e.clientY }));
  }
  /* ================================================================ the name catches the light
     Pointing at the big name wakes the letters under the pointer: the nearest switch into the coarse 1-bit cut of the
     type, catch the moonlight and lift; their neighbours lift a little; and all of them spring back once the pointer
     has gone. A tap on a touch screen sends one ripple of the same along the name. Only classes change, and only when
     a letter's state does: the lift is a transform, and the coarse letter is drawn over the smooth one in its place
     (magic-proto.css), so nothing is laid out again while the pointer moves. The name is not a control, so the keyboard
     passes it by as before, and its aria-label still gives the whole name. */
  const nameEl = $("#name"), nameRest = nameEl && $(".n-rest", nameEl);
  if (nameEl && nameRest) {
    let chs = null, at = null, atY = NaN, fs = 100, ripT = [];
    const letters = () => chs || (chs = (nameRest._ch || $$(".ch", nameRest)).map((c) => { c.dataset.c = c.textContent; return c; }));
    // where each letter's middle is: read when the pointer comes in, and again only if the page has scrolled since
    const measure = () => {
      fs = parseFloat(getComputedStyle(nameEl).fontSize) || 100;
      at = letters().map((c) => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      atY = SM.y;
    };
    const state = (c, st) => { if (c._nm !== st) { c._nm = st; c.classList.toggle("nm-up", st === 1); c.classList.toggle("nm-px", st === 2); } };
    const calm = () => { at = null; if (chs) chs.forEach((c) => state(c, 0)); };
    const asleep = () => nameRest.classList.contains("gone") || $("#board")?.classList.contains("leave");
    const near = (x, y) => {
      if (asleep()) return calm();
      if (!at || atY !== SM.y) measure();
      letters().forEach((c, i) => {
        // distance in ems of the name, a line's height counting for a little more than a letter's width
        const d = Math.hypot((x - at[i][0]) / fs, (y - at[i][1]) / (fs * 1.6)), st = d < 0.3 ? 2 : d < 0.8 ? 1 : 0;
        // a letter that has just caught the light throws a few pixels of it
        if (st === 2 && c._nm !== 2) { spark(at[i][0], at[i][1] - fs * 0.38, 12, false); spark(at[i][0] + fs * 0.12, at[i][1] - fs * 0.3, 9, true); }
        state(c, st);
      });
    };
    nameEl.addEventListener("pointermove", (e) => { if (e.pointerType !== "touch") near(e.clientX, e.clientY); }, { passive: true });
    nameEl.addEventListener("pointerleave", calm, { passive: true });
    // a tap (not a swipe, which scrolls and so is no click) ripples the name once, a letter at a time, each as short
    // as a hover's
    let tapType = "";
    nameEl.addEventListener("pointerdown", (e) => { tapType = e.pointerType; }, { passive: true });
    nameEl.addEventListener("click", () => {
      if (tapType !== "touch" || asleep()) return;
      ripT.forEach(clearTimeout); ripT = [];
      measure();
      letters().forEach((c, i) => {
        ripT.push(setTimeout(() => { state(c, 2); if (i % 3 === 0) spark(at[i][0], at[i][1] - fs * 0.38, 12, true); }, i * 45));
        ripT.push(setTimeout(() => state(c, 0), i * 45 + 260));
      });
    });
  }
  retint();
})();
