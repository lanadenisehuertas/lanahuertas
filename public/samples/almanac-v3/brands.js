/* Stop 2, the brand corridor. Ten rooms in a sideways track, one viewport wide
   each, rendered from DATA.brands.
   - Pinned (desktop, motion on): the section is 1 + 9 x 0.5 screens tall; the
     scroll picks the room (half a screen per room) and the track glides to it,
     so one whole room is on screen whenever the page is at rest.
   - Strip (phone, quiet mode, reduced motion): one screen tall, a native
     sideways scroller with scroll-snap, stepped with the same buttons or a swipe. */
(() => {
  const sec = document.getElementById("brands");
  const mount = document.getElementById("brands-mount");
  if (!sec || !mount || typeof DATA === "undefined" || typeof V3 === "undefined") return;
  const { $, $$, esc, pic } = V3;
  const stage = sec.querySelector(".stage");
  const B = DATA.brands;
  const N = B.length;
  const STEP = 0.5; // screens of scroll per room
  sec.style.setProperty("--len", String(1 + (N - 1) * STEP));

  /* ---------- colour: the room's ground is its darkest palette colour over its backdrop ---------- */
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const NIGHT = [12, 6, 32], WHITE = [255, 255, 255], MIST = rgb("#d9cfff");
  /* tint strength per room (spec: 72 to 80 percent, raised where a room measured too busy) */
  const ALPHA = { default: 0.86, "rock-of-aces": 0.94, "battle-of-the-bands": 0.94, "into-the-code": 0.92, technorun: 0.92, pacsa: 0.95, "techno-week": 0.92 };
  /** the tint: the darkest palette colour, darkened toward the night only as far as needed so
      mist text passes AA even over the lightest backdrop pixel (white showing through the tint) */
  const tintOf = (b) => {
    const a = ALPHA[b.slug] ?? ALPHA.default;
    const dark = b.palette.map(rgb).sort((x, y) => lum(x) - lum(y))[0];
    let c = dark;
    for (let k = 0; k <= 1.0001; k += 0.04) {
      c = mix(dark, NIGHT, k);
      if (ratio(MIST, mix(WHITE, c, a)) >= 4.8) break;
    }
    return { tint: hex(c), a };
  };

  /* ---------- words ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  /** the first sentence of the brief, cut at a natural break to fit two lines */
  const briefOf = (s, max) => {
    const first = s.split(/(?<=[.!?])\s+/)[0];
    if (first.length <= max) return first;
    const cut = first.slice(0, max);
    const k = Math.max(cut.lastIndexOf(", "), cut.lastIndexOf(" — "), cut.lastIndexOf(": "));
    const t = k > 40 ? first.slice(0, k) : cut.slice(0, cut.lastIndexOf(" "));
    return t.replace(/[\s,:;—-]+$/, "") + ".";
  };
  /** roles and tools as one mono line that fits the column */
  const metaOf = (b, budget) => {
    const tools = b.tools.join(" and ");
    const roles = [];
    for (const r of b.roles) {
      if (!roles.length || [...roles, r, tools].join(" · ").length <= budget) roles.push(r);
      else break;
    }
    return [...roles, tools].join(" · ");
  };
  const shapeOf = (r) => (r < 0.95 ? "tall" : r <= 1.15 ? "square" : "wide");

  const ICON_PREV = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_NEXT = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const room = (b, i) => {
    const [sm, full, w, h] = b.imgs[0];
    const r = w / h;
    const shape = shapeOf(r);
    const wide = shape === "wide";
    const { tint, a } = tintOf(b);
    const early = i < 2; // rooms 1 and 2 load at once; the rest wake up later
    const rest = b.imgs.slice(1);
    const thumbs = rest.slice(0, 3);
    const more = rest.length - thumbs.length;
    const backdrop = b.backdrop.replace("/backdrops/", "/backdrops/sm/");
    return `
<article class="room${i % 2 ? " flip" : ""}" data-i="${i}" data-shape="${shape}" style="--tint:${tint};--a:${a};--r:${r.toFixed(4)}" aria-roledescription="brand sheet" aria-label="${i + 1} of ${N}: ${esc(b.name)}">
  <div class="r-ground" aria-hidden="true">${pic({ src: backdrop, w: 960, h: 640, lazy: !early })}</div>
  <div class="r-grid">
    <div class="r-kv"${i === 0 ? " data-enter" : ""}>
      <button class="press r-key" type="button" data-open="0" aria-label="Open ${esc(b.name)} key visual, large">
        <span class="frame">${pic({ src: sm, srcset: sm === full ? "" : `${sm} 1x, ${full} 2x`, w, h, alt: `${b.name} key visual`, lazy: !early, priority: i === 0 ? "" : "low" })}</span>
      </button>
    </div>
    <div class="r-text"${i === 0 ? " data-enter" : ""}>
      <p class="label r-label">${pad(i + 1)} / ${pad(N)} · ${esc(b.org)} · ${esc(b.date)}</p>
      <h3 class="h3 r-name wear">${esc(b.name)}</h3>
      <p class="r-tag">${esc(b.tag)}</p>
      <p class="r-brief">${esc(briefOf(b.brief, wide ? 92 : 118))}</p>
      <p class="label r-meta">${esc(metaOf(b, wide ? 48 : 60))}</p>
      <div class="r-strip">
        <div class="r-dots" role="group" aria-label="${esc(b.name)} palette: press a colour to copy its code">
          ${b.palette.map((c) => `<button class="r-dot" type="button" data-hex="${c}" aria-label="Copy ${c}" title="${c}"><i style="--c:${c}"></i></button>`).join("")}
        </div>
        <div class="r-thumbs">
          ${thumbs.map((m, j) => `<button class="press r-thumb" type="button" data-open="${j + 1}" aria-label="Open piece ${j + 2} of ${b.imgs.length}, ${esc(b.name)}"><span class="frame">${pic({ src: m[0], w: m[2], h: m[3], alt: "", lazy: true, priority: "low" })}</span></button>`).join("")}
          ${more > 0 ? `<button class="press r-more" type="button" data-open="${thumbs.length + 1}" aria-label="Open the other ${more} pieces, ${esc(b.name)}">+${more}</button>` : ""}
        </div>
        <p class="r-copied" role="status" aria-live="polite"></p>
      </div>
    </div>
  </div>
</article>`;
  };

  mount.innerHTML = `<div class="b-track">${B.map(room).join("")}</div>`;
  stage.insertAdjacentHTML("beforeend", `
<nav class="b-ctl" aria-label="Brand sheets">
  <button class="btn secondary icon b-prev" type="button" aria-label="Previous brand">${ICON_PREV}</button>
  <p class="b-count" aria-live="polite"><span class="label"></span> <b></b></p>
  <button class="btn secondary icon b-next" type="button" aria-label="Next brand">${ICON_NEXT}</button>
</nav>`);

  const track = $(".b-track", mount);
  const rooms = $$(".room", track);
  const prev = $(".b-prev", stage), next = $(".b-next", stage);
  const countLabel = $(".b-count .label", stage), countName = $(".b-count b", stage);
  /* the head ("Brands") is shown on the first room only, so it travels with that room */
  const head = $(".b-head", stage);
  if (head) $(".r-text", rooms[0]).prepend(head);
  V3.moons(mount);
  V3.wearAll(mount);
  V3.enter(mount);

  /* ---------- images: wake the later rooms once the page has loaded or the corridor is near ---------- */
  let awake = false;
  const wake = () => { if (awake) return; awake = true; $$("img[loading=lazy]", track).forEach((img) => (img.loading = "eager")); };
  addEventListener("load", () => setTimeout(wake, 300));
  new IntersectionObserver((es, io) => { if (es.some((e) => e.isIntersecting)) { wake(); io.disconnect(); } }, { rootMargin: "150% 0px" }).observe(sec);

  /* ---------- mode ---------- */
  const isStrip = () => V3.still() || V3.phone.matches;
  let strip = null; // current mode
  let cur = 0;
  const travel = () => Math.max(1, sec.offsetHeight - innerHeight);
  const anchorY = (i) => sec.getBoundingClientRect().top + scrollY + (travel() * i) / (N - 1);

  const setRoom = (i, { now = false } = {}) => {
    i = Math.max(0, Math.min(N - 1, i));
    const changed = i !== cur;
    cur = i;
    if (!strip) {
      if (now) { track.classList.add("now"); requestAnimationFrame(() => requestAnimationFrame(() => track.classList.remove("now"))); }
      track.style.setProperty("--room", i);
    }
    rooms.forEach((el, n) => (el.inert = n !== i));
    countLabel.textContent = `${i + 1} / ${N}`;
    countName.textContent = B[i].name;
    prev.disabled = i === 0;
    next.disabled = i === N - 1;
    return changed;
  };

  const applyMode = () => {
    const s = isStrip();
    if (s === strip) return;
    strip = s;
    sec.classList.toggle("strip", s);
    sec.classList.toggle("pinned", !s);
    if (s) {
      track.style.removeProperty("--room");
      track.scrollLeft = cur * track.clientWidth;
    } else {
      track.scrollLeft = 0;
      setRoom(cur, { now: true });
    }
    V3.refresh();
  };

  /* pinned: the scroll picks the room */
  V3.pin(sec, (p) => { if (!strip) setRoom(Math.round(p * (N - 1))); });

  /* strip: the strip's own scroll picks the room */
  let sraf = 0;
  track.addEventListener("scroll", () => {
    if (!strip || sraf) return;
    sraf = requestAnimationFrame(() => { sraf = 0; if (strip) setRoom(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))); });
  }, { passive: true });

  /** step to room i */
  const go = (i) => {
    i = Math.max(0, Math.min(N - 1, i));
    if (strip) {
      track.scrollTo({ left: i * track.clientWidth, behavior: V3.still() ? "instant" : "smooth" });
      setRoom(i);
    } else {
      scrollTo({ top: Math.round(anchorY(i)), behavior: "instant" });
      setRoom(i);
    }
  };
  prev.addEventListener("click", () => go(cur - 1));
  next.addEventListener("click", () => go(cur + 1));

  /* left and right arrow keys work whenever the corridor is in view */
  const inView = () => {
    const r = sec.getBoundingClientRect();
    if (!strip) return r.top <= 1 && r.bottom >= innerHeight - 1;
    const seen = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    return seen >= innerHeight * 0.6;
  };
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || V3.viewerOpen()) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable], [role=tablist], [role=slider]")) return;
    if (!inView()) return;
    e.preventDefault();
    go(cur + (e.key === "ArrowRight" ? 1 : -1));
  });

  /* quiet mode on or off: stay in the same room */
  document.addEventListener("v3:quiet", (e) => {
    const keep = cur;
    applyMode();
    setRoom(keep, { now: true });
    if (e.detail.anchor !== sec) return;
    e.detail.handled = true;
    if (strip) {
      scrollTo({ top: Math.round(sec.getBoundingClientRect().top + scrollY), behavior: "instant" });
      track.scrollLeft = keep * track.clientWidth;
    } else {
      scrollTo({ top: Math.round(anchorY(keep)), behavior: "instant" });
    }
  });
  /* crossing 860px changes the corridor's height by several screens: if the reader is in it, stay in the same room */
  V3.phone.addEventListener("change", () => {
    const keep = cur, here = inView();
    applyMode();
    setRoom(keep, { now: true });
    if (strip) track.scrollLeft = keep * track.clientWidth;
    if (here) scrollTo({ top: Math.round(strip ? sec.getBoundingClientRect().top + scrollY : anchorY(keep)), behavior: "instant" });
  });
  new ResizeObserver(() => { if (strip) track.scrollLeft = cur * track.clientWidth; }).observe(track);

  /* ---------- inside a room: the lightbox and the palette ---------- */
  mount.addEventListener("click", async (e) => {
    const open = e.target.closest("[data-open]");
    if (open) {
      const b = B[+open.closest(".room").dataset.i];
      const n = b.imgs.length;
      V3.lightbox(b.imgs.map((m, k) => ({
        src: m[1], sm: m[0], w: m[2], h: m[3],
        alt: k ? `${b.name}, piece ${k + 1} of ${n}` : `${b.name} key visual`,
        title: b.name,
        link: b.href ? { href: b.href, text: "See the campaign post" } : null,
      })), +open.dataset.open, open);
      return;
    }
    const dot = e.target.closest(".r-dot");
    if (dot) {
      const msg = $(".r-copied", dot.closest(".r-strip"));
      const ok = await V3.copy(dot.dataset.hex);
      msg.textContent = ok ? `Copied ${dot.dataset.hex}` : dot.dataset.hex;
      clearTimeout(msg._t);
      msg._t = setTimeout(() => (msg.textContent = ""), 1800);
    }
  });

  applyMode();
  setRoom(0, { now: true });
})();
