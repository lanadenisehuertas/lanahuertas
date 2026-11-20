/* Rooms II, III and IV: the posters' line, the films' timeline and the products' phone.
   Each is pinned while you scroll through it, and the scroll drives everything in it: nothing in a room moves on a
   timer, so it moves exactly as far as you scroll and goes back when you scroll back (SM.scrub in moon.js). */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const two = (n) => String(n).padStart(2, "0");
  const narrow = matchMedia("(max-width: 760px), (max-aspect-ratio: 1/1), (max-height: 500px)");
  /** a stop's left and right arrow keys, while it is the current stop and nothing else has focus that uses them */
  const keys = (stop, step) => addEventListener("keydown", (e) => {
    if (SM.stop !== stop || document.querySelector("dialog[open]") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest?.("input, textarea, [role=group], [role=tablist]")) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); step(e.key === "ArrowRight" ? 1 : -1); }
  });

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  /** a pinned stop: tall enough for its steps, its stage sticks to the window (reel.css .stage) */
  const pin = (stop, screens) => {
    const set = () => (stop.style.height = `calc(${screens().toFixed(3)} * 100svh)`);
    set();
    return set;
  };
  /** the top of a stop in page coordinates, plus how far into it step k is */
  const at = (stop, k, step) => stop.getBoundingClientRect().top + scrollY + k * step * SM.vh + 2;

  /* ================================================================ II Posters: the line
     The eight posters hang large, one after another, on a dotted line, each held by a painted clothespin. The stop
     is pinned; scrolling draws the line along, so the posters pass the middle of the window one at a time. The one in
     the middle hangs straight and wakes into colour; the others swing a little on their pins as they come and go and
     sleep in lilac. The line slows as each poster reaches the middle, so every poster has a moment of its own. A
     soft light of the poster's own colour stands behind it. Clicking the poster in the middle opens it large;
     clicking another draws the line to it. */
  const pm = $("#m-posters"), posters = $("#posters");
  if (pm && typeof DATA !== "undefined") {
    const P = DATA.posters, n = P.length, STEP = 0.55;
    // who it was for and the year, without the year again when the title already ends with it ("CS Night 2026")
    // the year is added only when neither the title nor the maker already says it ("CS Expo 2026, 2026")
    const meta = (p) => (String(p.t).includes(String(p.y)) || String(p.m).includes(String(p.y)) ? p.m : `${p.m}, ${p.y}`);
    const list = P.map((p) => ({ src: p.img[1], w: p.img[2], h: p.img[3], alt: `${p.t} poster`, cap: `${p.t}, ${meta(p)}` }));
    pm.innerHTML = `<div class="po">
      <div class="po-glow" aria-hidden="true"></div>
      <div class="po-win">
        <span class="po-focus" aria-hidden="true"></span>
        <div class="po-track">
          <svg class="po-line" aria-hidden="true"><path/></svg>
          ${P.map((p, i) => `<button class="po-hang" type="button" data-i="${i}" tabindex="${i ? -1 : 0}" aria-label="${esc(p.t)}, ${i + 1} of ${n}">
            <img class="po-pin" src="art/pin.webp" width="120" height="434" alt="" loading="lazy">
            <span class="pic box po-sheet" data-kind="photo" data-enter="manual" data-flat data-cell="2.4" style="aspect-ratio:${p.img[2]} / ${p.img[3]};--ar:${(p.img[2] / p.img[3]).toFixed(4)}"><img class="full" loading="lazy" src="${p.img[0]}" srcset="${p.img[0]} 720w, ${p.img[1]} 1280w" sizes="(max-width: 760px) 60vw, 40vw" width="${p.img[2]}" height="${p.img[3]}" alt=""></span>
          </button>`).join("")}
        </div>
      </div>
      <div class="pk-text po-text">
        <h3 class="pk-name po-t"></h3>
        <p class="pk-meta po-m"></p>
        <button class="go" type="button" id="po-big">See it large</button>
      </div>
    </div>`;
    const room = $(".po", pm), win = $(".po-win", pm), track = $(".po-track", pm), hangs = $$(".po-hang", pm), focus = $(".po-focus", pm), words = $(".po-text", pm), line = $(".po-line", pm);
    const bms = SM.pictures(pm).filter((b) => b.pic.classList.contains("po-sheet"));
    SM.whenNear(pm, () => bms.forEach((b) => b.load().then(() => b.setShow(1)).catch(() => {})));
    SM.corners(room);
    // half a screen more than the line needs, so the last poster rests in place before the room moves on
    const reheight = pin(posters, () => (n - 1) * STEP + 1.5);
    let cur = -1, cx = [], focusX = 0;
    const caption = (i) => {
      cur = i;
      const p = P[i];
      $(".po-t", pm).textContent = p.t;
      $(".po-m", pm).textContent = meta(p);
      hangs.forEach((h, k) => { h.tabIndex = k === i ? 0 : -1; h.setAttribute("aria-current", String(k === i)); h.setAttribute("aria-label", `${P[k].t}, ${k + 1} of ${n}${k === i ? ". Open it large" : ". Bring it to the middle"}`); });
      // the pegs are the room's pager (each a button with its poster's name), so the foot says nothing more here
      posters.dataset.hint = "";
      if (SM.stop === posters) SM.say();
    };
    /* asleep, a poster is a few flat lilac shapes (data-flat), never a fine dither over its whole size */
    /* the line: from before the first pin to after the last, sagging a little between pins */
    const layout = () => {
      cx = hangs.map((h) => h.offsetLeft + h.offsetWidth / 2);
      focusX = focus.offsetLeft;   // kept with the posters' places, so each frame reads nothing back from the page
      if (!cx.length || !hangs[0].offsetWidth) return;
      const U = SM.u(), y = $(".po-pin", hangs[0]).offsetTop + $(".po-pin", hangs[0]).offsetHeight * 0.3, pad = 60 * U, sag = 1.6 * U;
      const W = track.scrollWidth + pad * 2, xs = [-pad, ...cx, cx[n - 1] + pad].map((x) => x + pad);
      line.setAttribute("viewBox", `0 0 ${W.toFixed(0)} ${(y + sag * 2 + 4).toFixed(0)}`);
      line.style.cssText = `left:${-pad}px;width:${W}px;height:${y + sag * 2 + 4}px`;
      let d = `M${xs[0].toFixed(1)} ${y.toFixed(1)}`;
      for (let k = 1; k < xs.length; k++) d += ` Q${((xs[k - 1] + xs[k]) / 2).toFixed(1)} ${(y + 2 * sag).toFixed(1)} ${xs[k].toFixed(1)} ${y.toFixed(1)}`;
      $("path", line).setAttribute("d", d);
    };
    const update = () => {
      const w = SM.where(posters);
      if (!w.near) return;
      if (!cx.length || !cx[0]) layout();
      if (!cx.length) return;
      const quiet = SM.quiet();
      const q = Math.min(n - 1, Math.max(0, -w.top / (STEP * w.vh)));
      const base = Math.min(n - 1, Math.floor(q)), frac = q - base;
      // the line rests with a poster in the middle for most of a step and moves on in between, so the scroll mostly
      // stops on a whole poster with its words
      const e = quiet ? Math.round(frac) : SM.smooth(clamp((frac - 0.3) / 0.4)), qe = base + e;
      const nx = base < n - 1 ? cx[base + 1] : cx[base];
      track.style.transform = `translate3d(${(focusX - (cx[base] + (nx - cx[base]) * e)).toFixed(1)}px, 0, 0)`;
      hangs.forEach((h, k) => {
        const d = k - qe, ad = Math.abs(d);
        if (ad > 2.6 && h._far) return;
        h._far = ad > 2.6;
        const s = 1 - Math.min(1, ad) * 0.12, r = quiet ? 0 : Math.max(-1, Math.min(1, d)) * 3.4;
        // a poster is wholly awake (no dither left) while the line rests on it, and only falls asleep once it moves away
        const wake = 1 - SM.smooth(clamp((ad - 0.3) / 0.55));
        h.style.transform = `rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        h.style.opacity = (0.5 + 0.5 * wake).toFixed(3);   // the ones asleep step back
        bms[k].setFloor(wake);
      });
      room.style.setProperty("--glow", base < n - 1 ? mix(P[base].ink, P[base + 1].ink, e) : P[base].ink);
      // the words go out as the line moves and come back with the next poster's
      const t = Math.abs(qe - Math.round(qe));
      // the caption's lines go and come back one after another (reel.css, .pk-text > *), driven by --w
      words.style.setProperty("--w", (1 - SM.smooth(clamp((t - 0.16) / 0.24))).toFixed(3));
      const i = Math.round(qe);
      if (i !== cur) caption(i);
    };
    SM.scrub(update);
    const jump = (k, instant) => SM.glide(at(posters, Math.max(0, Math.min(n - 1, k)), STEP), instant);
    (SM.rooms ||= {}).posters = { jump };
    hangs.forEach((h, k) => {
      h.addEventListener("click", () => (k === cur ? SM.view(list, k) : jump(k)));
      h.addEventListener("focus", () => { if (k !== cur && !SM.arrowing && h.matches(":focus-visible")) jump(k, true); });
      SM.wakeable(h, { line: `${P[k].t}, ${P[k].m}` });
    });
    // the arrow keys move along the pegs and the line glides to the one they reach
    SM.arrows($(".po-track", pm), hangs, () => cur, jump);
    // a poster reached by Tab while its room is off the screen brings the room to it, so the focus ring is always seen
    const seen = (el) => { const r = el.getBoundingClientRect(); return r.right > 0 && r.left < SM.vw && r.bottom > 0 && r.top < SM.vh; };
    hangs.forEach((h) => h.addEventListener("focus", () => { win.scrollLeft = 0; if (!SM.arrowing && !seen(h)) jump(+h.dataset.i, true); }));
    $("#po-big").addEventListener("click", () => SM.view(list, cur));
    keys(posters, (d) => jump(cur + d));
    caption(0);
    new ResizeObserver(() => { layout(); reheight(); update(); }).observe(track);
  }

  /* ================================================================ III Films: the edit
     An editor's timeline. The ten films lie end to end on V1, each as long as it runs, with the sound under them on
     A1 and a ruler of minutes above. The stop is pinned; scrolling plays the timeline: the playhead runs along it,
     the timecode counts, and the frame of the film under the playhead fills the monitor, pushing in slowly as the
     film runs. At each cut the next film's frame blooms in over it in moonlight cells.
     Clicking a clip moves the playhead to it. */
  const fm = $("#m-films"), films = $("#films");
  if (fm && typeof DATA !== "undefined") {
    const F = DATA.films, n = F.length, STEP = 0.6;
    const secs = F.map((f) => { const [m, s] = f.d.split(":").map(Number); return m * 60 + s; });
    const starts = secs.map((_, i) => secs.slice(0, i).reduce((a, b) => a + b, 0)), total = starts[n - 1] + secs[n - 1];
    const tcs = (t) => { const s = Math.floor(t), f = Math.min(23, Math.floor((t - s) * 24)); return `${two(Math.floor(s / 3600))}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}:${two(f)}`; };
    const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
    fm.innerHTML = `<div class="fr">
      <div class="pk-text fr-text">
        <h3 class="pk-name fr-t"></h3>
        <p class="pk-meta fr-role"></p>
        <a class="go" id="fr-watch" target="_blank" rel="noopener">Watch it ${ext}</a>
        ${SM.steps("film")}
      </div>
      <div class="fr-mon">
        <div class="fr-screen" aria-hidden="true">${F.map((f, i) => `<span class="fr-frame" data-i="${i}"><img src="${f.img[0]}" width="${f.img[1]}" height="${f.img[2]}" alt="" loading="lazy"></span>`).join("")}</div>
        <p class="fr-tc" aria-hidden="true"><b class="tc"></b><span>of ${tcs(total)}</span></p>
      </div>
      <div class="fr-tl">
        <div class="tl-g" aria-hidden="true"><span></span><span>V1</span><span>A1</span></div>
        <div class="lanes">
          <div class="ruler" aria-hidden="true"></div>
          <div class="track" role="group" aria-label="The ten films on a timeline. Arrow keys move the playhead from one to the next.">${F.map((f, i) => `<button class="clip" type="button" data-i="${i}" tabindex="${i ? -1 : 0}" style="flex-grow:${secs[i]}" aria-label="${esc(f.t)}, ${f.d}">
            <span class="pic box clip-pic" data-kind="photo" data-cell="1.6"><img class="full" src="${f.img[0]}" width="${f.img[1]}" height="${f.img[2]}" alt="" loading="lazy"></span><span class="c-t" aria-hidden="true">${esc(f.t)}</span></button>`).join("")}</div>
          <svg class="wave" aria-hidden="true"></svg>
          <span class="playhead" aria-hidden="true"></span>
        </div>
      </div>
    </div>`;
    const room = $(".fr", fm), frames = $$(".fr-frame", fm), clips = $$(".clip", fm), lanes = $(".lanes", fm), head = $(".playhead", fm), tc = $(".fr-tc .tc", fm), words = $(".fr-text", fm);
    const bms = SM.pictures(fm);
    SM.corners(room);
    const reheight = pin(films, () => n * STEP + 1);
    let cur = -1, seg = [];
    const caption = (i) => {
      cur = i;
      const f = F[i];
      $(".fr-t", fm).textContent = f.t;
      $(".fr-role", fm).textContent = `${f.role}, ${f.d} long`;
      SM.setSteps(fm, i, n);
      const w = $("#fr-watch"); w.href = f.url; w.setAttribute("aria-label", `Watch ${f.t} on Google Drive (opens in a new tab)`);
      clips.forEach((c, k) => { c.tabIndex = k === i ? 0 : -1; c.setAttribute("aria-current", String(k === i)); });
      films.dataset.hint = i < n - 1 ? `Next on the timeline: ${F[i + 1].t}` : `${f.t} is the last cut.`;
      if (SM.stop === films) SM.say();
    };
    /* the ruler, the clip names and the waveform follow the clips as laid out (short clips are stretched to stay
       tappable, so time runs a little faster through them) */
    const layout = () => {
      const W = lanes.offsetWidth;
      if (!W) return;
      seg = clips.map((c, i) => ({ x0: c.offsetLeft, x1: c.offsetLeft + c.offsetWidth, t0: starts[i], t1: starts[i] + secs[i] }));
      const xAt = (t) => { const s = seg.find((g) => t >= g.t0 && t < g.t1) || seg[n - 1]; return s.x0 + ((t - s.t0) / (s.t1 - s.t0)) * (s.x1 - s.x0); };
      // a label every five minutes, or every ten where five would crowd them
      let marks = "", last = -1e9;
      for (let m = 0; m * 60 <= total; m++) {
        const x = Math.round(xAt(m * 60));
        marks += `<i class="${m % 5 ? "" : "big"}" style="left:${x}px"></i>`;
        if (m % 5 === 0 && x - last > 64) { marks += `<b style="left:${x}px" class="${m ? (x > W - 40 ? "end" : "") : "start"}">${two(m)}:00</b>`; last = x; }
      }
      $(".ruler", fm).innerHTML = marks;
      clips.forEach((c) => c.classList.toggle("named", c.offsetWidth > SM.u() * 9));
      const svg = $(".wave", fm), H = svg.clientHeight, mid = H / 2, step = Math.max(5, Math.round(SM.u() * 0.5));
      let seed = 11, env = 0.5, d = "";
      const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      seg.forEach((g) => {
        for (let x = g.x0; x < g.x1 - 1; x += step) {
          env = Math.min(1, Math.max(0.12, env + (rnd() - 0.5) * 0.35));
          const h = Math.max(1, Math.round(mid * env * (0.7 + rnd() * 0.3))), w = Math.min(step - 1, g.x1 - x);
          d += `M${x} ${mid - h}h${w}v${2 * h}h${-w}z`;
        }
      });
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.innerHTML = `<path d="${d}"/>`;
    };
    const update = () => {
      const w = SM.where(films);
      if (!w.near) return;
      if (!seg.length) layout();
      if (!seg.length) return;
      const quiet = SM.quiet();
      const q = Math.min(n - 0.0001, Math.max(0, -w.top / (STEP * w.vh)));
      const base = Math.floor(q), frac = q - base, g = seg[base];
      head.style.transform = `translate3d(${(g.x0 + frac * (g.x1 - g.x0) - 1).toFixed(1)}px, 0, 0)`;
      tc.textContent = tcs(starts[base] + frac * secs[base]);
      // the monitor: this film's frame, pushing in as it runs; over the last third the next one blooms in over it in
      // moonlight cells (SM.bloom). Only that one steps through its stages: the rest are under it or not there
      const cover = base < n - 1 ? clamp((frac - 0.68) / 0.32) : 0;
      frames.forEach((f, k) => {
        const c = k === base ? 1 : k === base + 1 ? cover : 0;
        SM.bloom(f, c, k !== base + 1);
        if (c <= 0) return;
        const p = quiet ? 0 : k === base ? frac : 0;
        f.style.transform = `scale(${(1.02 + p * 0.07).toFixed(4)})`;
      });
      clips.forEach((c, k) => bms[k]?.setFloor(k === base ? 1 : k === base + 1 ? cover : 0));
      if (base !== cur) caption(base);
      // the words: this film's leave letter by letter as the next frame blooms, and the next film's come in after the
      // cut, its title spelled out of runes (SM.letters, in reel.js). Quiet mode changes them at the cut
      const lv = quiet || base >= n - 1 ? 0 : clamp((frac - 0.62) / 0.3), en = quiet || base === 0 ? 1 : clamp(frac / 0.24);
      if (lv > 0 || en < 1) SM.letters.prep(words);
      const LV = lv ? lv.toFixed(3) : "", EN = en < 1 ? en.toFixed(3) : "";
      if (words._lv !== LV) { words._lv = LV; LV ? words.style.setProperty("--lv", LV) : words.style.removeProperty("--lv"); }
      if (words._en !== EN) { words._en = EN; EN ? words.style.setProperty("--en", EN) : words.style.removeProperty("--en"); }
      SM.letters.runes(words, en);
    };
    // each film's light blooms from its own point on the frame
    const AT = ["0.5 0.42", "0.32 0.38", "0.68 0.56", "0.44 0.64", "0.62 0.34"];
    frames.forEach((f, k) => (f.dataset.bloom = AT[k % AT.length]));
    SM.scrub(update);
    const jump = (k, instant) => SM.glide(films.getBoundingClientRect().top + scrollY + (Math.max(0, Math.min(n - 1, k)) + 0.3) * STEP * SM.vh, instant);
    (SM.rooms ||= {}).films = { jump };
    clips.forEach((c, k) => {
      c.addEventListener("click", () => jump(k));
      SM.wakeable(c, { line: `${F[k].t}, ${F[k].role}` });
    });
    $(".track", fm).addEventListener("keydown", (e) => {
      const k = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: n - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault(); e.stopPropagation();
      const j = Math.max(0, Math.min(n - 1, k));
      clips[j].focus({ preventScroll: true }); jump(j);
    });
    // a clip reached by Tab while the timeline is off the screen brings the room to it
    clips.forEach((c) => c.addEventListener("focus", () => { const r = c.getBoundingClientRect(); if (r.bottom < 0 || r.top > SM.vh) jump(+c.dataset.i, true); }));
    $(".steps .prev", fm).addEventListener("click", () => jump(cur - 1));
    $(".steps .next", fm).addEventListener("click", () => jump(cur + 1));
    keys(films, (d) => jump(cur + d));
    caption(0);
    new ResizeObserver(() => { layout(); reheight(); update(); }).observe(lanes);
  }

  /* ================================================================ IV Products: the apps themselves
     A reel, like the brands: the four apps come one at a time as you scroll. Each plate: what the app is and what I
     did on the left, with the case study as the way in and the live app beside it, and a film of the real app as
     large as the room allows on the right, in a light of the app's own colour, so the interface itself leads. The
     film plays only on the current plate, can be paused, and is a still for reduced motion. */
  const products = $("#products");
  if (products && typeof DATA !== "undefined") {
    const FILMS = {
      psyclick: { film: ["loops/psyclick.webp", "loops/psyclick-poster.webp", 1920, 584, "wide"], alt: "PsyClick's typing warm-up: a client types an answer and rhythm bars build under it as they type.",
        say: "Typing rhythm, drawn as bars. Flags for the clinician, never a diagnosis." },
      bloom: { film: ["loops/bloom.webp", "loops/bloom-poster.webp", 780, 1688, "phone"], alt: "Bloom's cycle screen: days are tapped onto the calendar, symptoms are chosen, and today's plan turns to active recovery.",
        say: "Cycle calendar, one-tap symptoms, a plan that follows the phase. Offline." },
      algebrawl: { film: ["loops/algebrawl.webp", "loops/algebrawl-poster.webp", 720, 450, "desk"], alt: "Algebrawl's battle: a rival is chosen, Newton steps up, and the duel plays out under a pixel-art apple tree.",
        say: "Duel Gauss, Newton or Fibonacci. Each right answer lands a hit." },
      "debt-ledger": { film: ["loops/debt.webp", "loops/debt-poster.webp", 780, 1688, "phone"], alt: "Debt Payoff Ledger: an allowance of 3,200 pesos is entered, two debts are added, and the split sends 1,700 pesos to tuition.",
        say: "Weekly allowance in. Food and school set aside, the rest to the nearest debt." },
    };
    const A = DATA.products.filter((p) => FILMS[p.id]), N = A.length, stage = $(".stage", products);
    const list3 = (a) => a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0];
    const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
    const right = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>`;
    const pauseIcon = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2v10M10 2v10"/></svg>`, playIcon = `<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2l9 5-9 5z"/></svg>`;
    let paused = false, atQ = 0;   // atQ: how far through the room the scroll is, in plates (from the reel)
    /** the film plays on the current plate only, unless paused; quiet mode keeps the still */
    const seen = new IntersectionObserver((es) => { es.forEach((e) => (e.target._seen = e.isIntersecting)); play(); }, { rootMargin: "10% 0px" });
    // the films are fetched only once the room is near: until then every plate shows its still (a film is half a megabyte)
    let near = false;
    new IntersectionObserver((es) => { near = es[es.length - 1].isIntersecting; play(); }, { rootMargin: "100% 0px" }).observe(products);
    let close = false;
    new IntersectionObserver((es) => { close = es[es.length - 1].isIntersecting; play(); }, { rootMargin: "15% 0px" }).observe(products);
    const play = () => $$(".reel-plate", products).forEach((pl) => {
      const on = near && (narrow.matches ? pl._seen : pl.classList.contains("now"));
      const img = $(".a-loop", pl), want = on && !paused && !SM.quiet() ? img.dataset.loop : img.dataset.poster;
      if (img.getAttribute("src") !== want) img.setAttribute("src", want);
      // the landing page's recording plays with the film, and only then (it is fetched the first time it is wanted)
      const v = $(".a-land-v", pl);
      if (v) {
        const go = on && close && !paused && !SM.quiet();
        if (go && !v.src) v.src = v.dataset.src;
        if (go && v.paused) v.play().catch(() => {});
        else if (!go && !v.paused) v.pause();
      }
      const b = $(".a-pause", pl);
      b.setAttribute("aria-pressed", String(paused));
      b.innerHTML = paused ? `${playIcon}<span>Play the film</span>` : `${pauseIcon}<span>Pause the film</span>`;
    });
    /* ---------- the working pieces ----------
       Parked: the plates now give their room to the app's own interface, so these are not drawn. They are kept here
       so a piece can come back; to show one, put <div class="a-try" data-try="id"> on the board and call tries[id]. */
    const peso = (v) => "₱" + Math.round(v).toLocaleString("en-PH");
    const tries = {
      /* PsyClick: type a line, see its rhythm */
      psyclick: (el) => {
        el.innerHTML = `<label class="label" for="psy-in">Try it: how has your week been, honestly?</label>
          <input id="psy-in" type="text" autocomplete="off" spellcheck="false" maxlength="90" placeholder="Type a line">
          <div class="psy-bars" aria-hidden="true"></div>
          <p class="t-read" aria-live="polite">Each key you press draws a bar for the gap before it. Long pauses show in a warmer colour.</p>`;
        const input = $("input", el), bars = $(".psy-bars", el), read = $(".t-read", el);
        let last = 0, gaps = [];
        input.addEventListener("keydown", (e) => {
          if (e.key.length !== 1 && e.key !== "Backspace") return;
          const now = performance.now(), g = last ? now - last : 0; last = now;
          if (!g) return;
          gaps.push(g); if (gaps.length > 48) gaps.shift();
          bars.innerHTML = gaps.map((v) => `<i class="${v > 700 ? "p" : ""}" style="--h:${Math.min(1, v / 900).toFixed(2)}"></i>`).join("");
          const sorted = [...gaps].sort((a, b) => a - b), mid = sorted[Math.floor(sorted.length / 2)], pauses = gaps.filter((v) => v > 700).length;
          read.textContent = `${gaps.length + 1} keys, ${pauses} ${pauses === 1 ? "pause" : "pauses"}, a typical gap of ${Math.round(mid)} ms. PsyClick would only flag this for a clinician to read.`;
        });
        input.addEventListener("input", () => { if (!input.value) { gaps = []; last = 0; bars.innerHTML = ""; } });
      },
      /* Bloom: tap the days you bleed; the phase for day 14 follows */
      bloom: (el) => {
        el.innerHTML = `<p class="label" id="bl-h">Try it: tap the days you bleed</p>
          <div class="bl-grid" role="group" aria-labelledby="bl-h">${Array.from({ length: 28 }, (_, d) => `<button type="button" aria-pressed="false" aria-label="Day ${d + 1}">${d + 1}</button>`).join("")}</div>
          <p class="t-read" aria-live="polite">Nothing logged yet. Tap day 1 to start a period.</p>`;
        const days = $$(".bl-grid button", el), read = $(".t-read", el);
        const phase = (rel, L) => (rel < L ? "menstrual" : rel < 13 ? "follicular" : rel < 16 ? "ovulation" : "luteal");
        days.forEach((b) => b.addEventListener("click", () => {
          b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
          const on = days.map((x, d) => (x.getAttribute("aria-pressed") === "true" ? d : -1)).filter((d) => d >= 0);
          if (!on.length) { read.textContent = "Nothing logged yet. Tap day 1 to start a period."; return; }
          const s = on[0], L = on.length, today = 13, rel = (today - s + 28) % 28;
          read.textContent = `A period of ${L} ${L === 1 ? "day" : "days"} from day ${s + 1}. On day 14 you would be in the ${phase(rel, L)} phase, and the next period is due around day ${((s + 28) % 28) + 1} of the next cycle.`;
        }));
      },
      /* Algebrawl: answer Newton */
      algebrawl: (el) => {
        const Q = [["3x + 5 = 20", 5, [3, 5, 6, 15]], ["2x − 7 = 9", 8, [1, 8, 9, 16]], ["x ÷ 4 + 2 = 5", 12, [3, 7, 12, 28]]];
        const TAUNT = ["Newton: even an apple falls with more purpose.", "Newton: check your working, then try me again.", "Newton: a body at rest stays at rest. Move!"];
        el.innerHTML = `<p class="label">Try it: duel Newton</p>
          <div class="al-hp" aria-hidden="true"><span>Newton</span><b><i></i></b></div>
          <p class="al-q" aria-live="polite"></p>
          <div class="al-opts" role="group" aria-label="Answers"></div>
          <p class="t-read" aria-live="polite">Solve for x. A right answer lands a hit.</p>`;
        const hp = $(".al-hp i", el), q = $(".al-q", el), opts = $(".al-opts", el), read = $(".t-read", el);
        let k = 0, life = 100, miss = 0;
        const ask = () => {
          if (life <= 0) { q.textContent = "Newton is out."; opts.innerHTML = `<button type="button" class="go">Duel again</button>`; $("button", opts).onclick = () => { life = 100; k = 0; hp.style.transform = "scaleX(1)"; read.textContent = "Solve for x. A right answer lands a hit."; ask(); }; return; }
          const [eq, , ch] = Q[k % Q.length];
          q.innerHTML = `Solve for <i>x</i>: ${eq}`;
          opts.innerHTML = ch.map((c) => `<button type="button">${c}</button>`).join("");
          $$("button", opts).forEach((b) => b.addEventListener("click", () => {
            if (+b.textContent === Q[k % Q.length][1]) {
              life = Math.max(0, life - 34); hp.style.transform = `scaleX(${life / 100})`;
              read.textContent = life ? `Hit. Newton takes 34 damage and has ${life} left.` : "Hit. Newton is out of health. You win the duel.";
              k++; ask();
            } else { read.textContent = TAUNT[miss++ % TAUNT.length]; b.disabled = true; }
          }));
        };
        ask();
      },
      /* Debt Ledger: drag the allowance and watch it split */
      "debt-ledger": (el) => {
        const KEEP = 1500, D = [["Tuition balance", 4500, "due 21 November"], ["GCash loan", 1200, "due 5 December"]];
        el.innerHTML = `<label class="label" for="dl-in">Try it: Sunday's allowance, <output id="dl-out">₱3,200</output></label>
          <input id="dl-in" type="range" min="500" max="8000" step="100" value="3200">
          <p class="dl-keep">${peso(KEEP)} kept for food and school</p>
          <ul class="dl-debts">${D.map(([nm, owe, due]) => `<li><span>${nm}, ${peso(owe)} ${due}</span><b><i></i></b><em></em></li>`).join("")}</ul>`;
        const input = $("input", el), out = $("output", el), rows = $$(".dl-debts li", el);
        const split = () => {
          const v = +input.value; let rest = Math.max(0, v - KEEP);
          out.textContent = peso(v);
          D.forEach(([, owe], i) => {
            const pay = Math.min(owe, rest); rest -= pay;
            $("i", rows[i]).style.transform = `scaleX(${(pay / owe).toFixed(3)})`;
            $("em", rows[i]).textContent = pay ? `${peso(pay)} this week` : "nothing this week";
          });
        };
        input.addEventListener("input", split); split();
      },
    };
    /* the app's own screens, beside its film: the visitor sees the whole of what was made, and each opens large */
    const SMALL = new Set(["psyclick"]);   // apps whose screens also come as small copies (name-sm.webp)
    const shotName = (src) => { const b = src.split("/").pop().replace(/\.webp$/, "").replace(/^(app|shot)-/, ""); return /debt/.test(b) ? "home" : b.replace(/-/g, " "); };
    const shotList = (p) => p.shots.map(([src, w, h]) => ({ src, w, h, alt: `${p.t}, the ${shotName(src)} screen`, cap: `${p.t}, ${shotName(src)}` }));
    /* a recording of an app's landing page, scrolled from top to bottom, leads its strip of screens */
    const LAND = { psyclick: ["loops/psyclick-landing.mp4", "loops/psyclick-landing-poster.webp", 960, 600] };
    /* the screens ride in a strip that the scroll carries past the film (or, for a phone app, in two columns that drift
       against each other), so every screen is seen without a click; each still opens large */
    const shotsHtml = (p) => {
      const land = LAND[p.id];
      const lead = land ? `<li class="a-land"><figure data-bloom><video class="a-land-v" muted loop playsinline preload="none" poster="${land[1]}" data-src="${land[0]}" width="${land[2]}" height="${land[3]}" aria-label="The ${esc(p.t)} landing page, scrolled from top to bottom"></video><figcaption>The landing page</figcaption></figure></li>` : "";
      const tiles = p.shots.map(([src, w, h], k) => `<li><button class="a-shot" type="button" data-bloom data-k="${k}" aria-label="Open the ${esc(shotName(src))} screen large"><img src="${SMALL.has(p.id) ? src.replace(/\.webp$/, "-sm.webp") : src}" width="${w}" height="${h}" alt="" loading="lazy" decoding="async"></button></li>`).join("");
      return `<div class="a-shots"><ul class="a-track" aria-label="${esc(p.t)} screens">${lead}${tiles}</ul></div>`;
    };
    const room = SM.reel(products, A.map((p) => {
      const f = FILMS[p.id], [src, poster, w, h, shape] = f.film;
      const world = SM.world(p.ground, p.ink);
      return {
        name: p.t, ground: world.ground, ink: world.ink, backdrop: p.backdrop,
        board: () => `<div class="r-board app ${shape}" id="app-${p.id}" style="--a-ink:${world.ink}">
          <div class="r-glow" aria-hidden="true"></div>
          <div class="pk-text">
            <h3 class="pk-name">${esc(p.t)}</h3>
            <p class="pk-meta">${esc(p.year)}</p>
            <p class="pk-tag">${esc(p.tag)}</p>
            <p class="say">${esc(f.say)}</p>
            <p class="a-role">${esc(p.role)}. ${esc(list3(p.stack.filter((t) => !p.role.toLowerCase().includes(t.toLowerCase()))))}.</p>
            <div class="acts">
              <a class="go cs" href="/ui-ux#${p.id}">Read the case study ${right}</a>
              <a class="go live" href="${p.href}" target="_blank" rel="noopener">${esc(p.cta)} ${ext}<span class="vh"> (opens a new tab)</span></a>
            </div>
            ${SM.steps("app")}
          </div>
          <figure class="a-film">
            <picture data-bloom="0.5 0.5"><img class="a-loop" loading="lazy" src="${poster}" data-loop="${src}" data-poster="${poster}" width="${w}" height="${h}" alt="${esc(f.alt)}"></picture>
            <figcaption><button class="a-pause" type="button" aria-pressed="false">${pauseIcon}<span>Pause the film</span></button></figcaption>
          </figure>
          ${shotsHtml(p)}
        </div>`,
        setup: (el, it, i) => {
          SM.setSteps(el, i, N);
          el._k = i;
          SM.corners($(".r-board", el));
          $(".steps .prev", el).addEventListener("click", () => room.jump(room.current - 1));
          $(".steps .next", el).addEventListener("click", () => room.jump(room.current + 1));
          $(".a-pause", el).addEventListener("click", () => { paused = !paused; play(); });
          $$(".a-shot", el).forEach((b) => b.addEventListener("click", () => SM.view(shotList(p), +b.dataset.k)));
          seen.observe(el);
          play();
        },
      };
    }), { step: 0.95, stack: narrow, onScrub: (q) => (atQ = q), onChange: (i) => { play(); stage.style.setProperty("--ink", SM.world(A[i].ground, A[i].ink).ink); stage.style.setProperty("--ground", SM.world(A[i].ground, A[i].ink).ground); } });
    $("#quiet")?.addEventListener("click", play);

    /* the strip of screens follows the scroll: --p runs from 0 as a plate arrives to 1 as it leaves (its own pass through
       the window, when the plates are stacked), and --travel is how far the strip must move to show its last screen */
    const measure = () => $$(".a-shots", products).forEach((box) => {
      const track = $(".a-track", box);
      box.style.setProperty("--travel", Math.max(0, track.scrollWidth - box.clientWidth + 12).toFixed(0) + "px");
    });
    const drive = () => {
      if (!SM.where(products).near) return;
      $$(".reel-plate", products).forEach((pl) => {
        const box = pl._shots || (pl._shots = $(".a-shots", pl));
        if (!box) return;
        if (!box._measured) { box._measured = true; measure(); }
        let p;
        if (narrow.matches) { const r = box.getBoundingClientRect(); p = clamp((SM.vh * 0.9 - r.top) / (SM.vh * 0.9)); }
        // the first plate is whole from the start, so its strip waits there; a later one starts as it comes in over the last
        else { const k = pl._k ?? 0; p = k ? clamp((atQ - k + 0.25) / 1.2) : clamp((atQ - 0.1) / 0.85); }
        if (SM.quiet()) p = 0;
        // a screen that has the keyboard's focus is brought into view, whatever the scroll says
        const fx = box.contains(document.activeElement) && document.activeElement.closest("li");
        if (fx && !narrow.matches) {
          const travel = parseFloat(box.style.getPropertyValue("--travel")) || 0;
          if (travel > 0) p = clamp((fx.offsetLeft + fx.offsetWidth / 2 - box.clientWidth / 2) / travel);
        }
        const P = p.toFixed(3);
        if (box._p !== P) { box._p = P; box.style.setProperty("--p", P); }
      });
    };
    SM.scrub(drive);
    products.addEventListener("focusin", (e) => { if (e.target.closest(".a-shots")) requestAnimationFrame(drive); });
    addEventListener("resize", () => requestAnimationFrame(measure));
    addEventListener("load", measure);

  }
})();
