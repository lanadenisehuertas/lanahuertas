/* The reel: one thing at a time as you scroll, each in its own world.

   The stop is tall and its stage sticks to the window. Scrolling moves a number q from 0 to n-1. Plate floor(q)
   is shown; part way through each step the next plate comes in over it through a dither of big tiles whose
   coverage follows the scroll, so one world dissolves into the next in the Bayer order, and back again when you
   scroll back. While a plate is shown it keeps drifting a little with the scroll (--f), so no scroll is ever a
   dead one. Each plate is its thing's own world: its ground colour, its ink, and its backdrop cut into flat tones.
   Brands and products use it.

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

  SM.reel = (stop, items, opts = {}) => {
    const n = items.length, STEP = opts.step || 0.55;
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
      el.innerHTML = `${it.backdrop ? `<span class="backdrop pic box" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${mix(it.ground, it.ink, 0.2)};--pos:50% 50%" aria-hidden="true"><img class="full" loading="lazy" src="${it.backdrop}" width="1536" height="1024" alt=""></span>` : ""}${it.board(i, n)}`;
      stage.append(el);
      plates[i] = el;
      SM.pictures(el).forEach((bm) => bm.load().then(() => { bm.show = 1; bm.draw(); }).catch(() => {}));
      it.setup?.(el, it, i);
      opts.onMake?.(el, i);
    };

    /* the window's masthead and foot take the colours of the world behind them (SM.band, in moon.js, asks the stop
       under each band for its tone): blended from one world to the next as the scroll dissolves one into the other,
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
    /** a plate's arrival (0 to 1: its work rises and wakes), its drift (-1 to 1: how far the scroll is through it) and
        its words (0 to 1): the words leave before the dissolve begins and come back once it has nearly ended, so two
        sets of words are never seen through each other */
    const pose = (el, a, f, w) => {
      const A = a.toFixed(3), F = f.toFixed(3), W = w.toFixed(3);
      if (el._a !== A) { el._a = A; el.style.setProperty("--a", A); $$("[data-wake]", el).forEach((p) => SM.bitmap(p)?.setFloor(a)); }
      if (el._f !== F) { el._f = F; el.style.setProperty("--f", F); }
      if (el._w !== W) { el._w = W; el.style.setProperty("--w", W); }
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
          el.style.visibility = ""; el.style.maskImage = el.style.webkitMaskImage = "none"; el._ml = null;
          el.classList.add("now"); el.inert = false;
          const r = el.getBoundingClientRect(), a = quiet ? 1 : easeOut(clamp((innerHeight - r.top) / (innerHeight * 0.7)));
          pose(el, a, 0, a);
        });
        return;
      }
      const vh = w.vh, q = Math.min(n - 1, Math.max(0, -w.top / (STEP * vh)));
      const base = Math.min(n - 1, Math.floor(q)), frac = q - base;
      // most of a step is the thing alone and whole, so wherever the scroll rests the work is resolved; the next one
      // comes in over the last stretch of the step (about a quarter of a screen, never a single turn of the wheel)
      const cover = base >= n - 1 ? 0 : clamp((frac - 0.58) / 0.36);
      for (let k = base - 1; k <= base + 2; k++) make(k);
      const first = quiet ? 1 : easeOut(clamp(w.arrive / 0.8));   // the first plate's work rises as the stop comes in
      plates.forEach((el, k) => {
        if (!el) return;
        const c = k === base ? 1 : k === base + 1 ? cover : 0;
        SM.applyMask(el, c);
        if (c <= 0) return;
        const a = quiet ? 1 : k === base ? (k === 0 ? first : 1) : easeOut(cover);
        const f = quiet ? 0 : k === base ? frac * 1.4 : (frac - 1) * 1.4;
        const sm = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
        // the words hand over at the middle of the cover, the old ones out just before it and the new ones in just after,
        // so wherever the scroll rests the picture on show has its own words at full strength
        const w = quiet ? 1 : k === base ? (1 - sm((cover - 0.3) / 0.2)) * (k === 0 ? first : 1) : sm((cover - 0.5) / 0.25);
        pose(el, a, Math.max(-1, Math.min(1, f)), w);
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
      plates.forEach((el) => { if (el) { el._ml = null; el._a = el._f = el._w = null; if (!opts.stack.matches) { el.classList.remove("now"); el.inert = true; } } });
      if (!opts.stack.matches) cur = -1;
    });

    /** travel to item i */
    const jump = (i, instant) => {
      i = Math.min(n - 1, Math.max(0, i));
      if (opts.stack?.matches) { make(i); plates[i].scrollIntoView({ block: "start", behavior: instant || SM.quiet() ? "auto" : "smooth" }); return; }
      SM.glide(stop.getBoundingClientRect().top + scrollY + i * STEP * innerHeight + (i ? 2 : 0), instant);
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
    return { jump, get current() { return cur; }, plates };
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
      const piece = ([src, , w, h], k) => `<button class="s-piece" type="button" data-k="${k + 1}" style="--d:${k};aspect-ratio:${w} / ${h}" aria-label="Open piece ${k + 2} of ${N} large"><img src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></button>`;
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
                <span class="pk-win pic box" data-kind="photo" data-enter="manual" data-still data-wake data-cell="1.4"><img class="full" loading="lazy" src="${kvs}" width="${kw}" height="${kh}" alt="${esc(b.name)}, the key visual"></span>
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
          const fit = () => { units.forEach((p) => (p.hidden = false)); const R = strip.getBoundingClientRect().right + 1; units.forEach((p) => (p.hidden = p.getBoundingClientRect().right > R)); };
          pieces.forEach((p) => $("img", p).addEventListener("load", fit, { once: true }));
          new ResizeObserver(fit).observe(strip);
        },
      };
    }), { step: 0.65, onMake: () => aim(), onScrub: (q) => lift(q), onChange: (i) => tint(i) });

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
      holderBms.forEach((bm) => { if (!bm.pic.closest(".h-pk")) bm.recolour(); else if (bm.paper) bm.recolour(); });
    }
    /* each brand's key visual rises out of its own packet: measure, once per layout, how far the packet is from where
       the picture stands, so the picture can start there (small, at the packet's mouth) and grow into place */
    function aim() {
      $$(".reel-plate", brands).forEach((pl) => {
        const card = $(".pk-in", pl), pk = pks[+pl.dataset.i];
        if (!card || !pk) return;
        const c = $(".pk-card", pl).getBoundingClientRect(), p = pk.getBoundingClientRect();
        if (!c.width) return;
        card.style.setProperty("--fx", (p.left + p.width / 2 - (c.left + c.width / 2)).toFixed(0) + "px");
        card.style.setProperty("--fy", (p.top + p.height * 0.25 - c.bottom).toFixed(0) + "px");
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
