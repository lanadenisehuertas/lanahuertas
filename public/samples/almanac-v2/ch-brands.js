/* Chapter #brands: the glasshouse gallery. A corridor of ten brand rooms that
   moves sideways while the chapter is pinned. Stacked (still mode, phones) it
   is a vertical list of the same rooms. */
(() => {
  const sec = document.getElementById("brands");
  const mount = document.getElementById("m-brands");
  if (!sec || !mount || typeof DATA === "undefined" || typeof ALM === "undefined") return;
  const stage = sec.querySelector(".stage");
  const brands = DATA.brands;
  const N = brands.length;
  const PANELS = N + 1; // intro + rooms
  const mq = matchMedia("(max-width: 860px)");
  const stacked = () => ALM.still() || mq.matches;

  /* ---------- colour helpers: pick text colour by measured luminance ---------- */
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const CREAM = rgb("#fff1c9"), INK = rgb("#2b1470"), BLACK = [10, 4, 24], WHITE = [255, 253, 248];
  /** panel colour from the palette plus a text colour that passes AA on it */
  const scheme = (palette) => {
    const cols = palette.map(rgb).sort((a, b) => lum(a) - lum(b));
    let bg = cols[0]; // the darkest palette colour sits behind the text
    let text = CREAM, toward = BLACK;
    if (ratio(bg, CREAM) < ratio(bg, INK)) { text = INK; toward = WHITE; }
    for (let t = 0; t <= 1 && ratio(bg, text) < 6; t += 0.05) bg = mix(cols[0], toward, t);
    // a light palette (lightest colour very light, darkest still mid) reads best as a pale panel
    return { bg: hex(bg), text: hex(text), dark: text === CREAM };
  };

  /* ---------- markup ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const short = (b) => b.name.replace(/ F\+\+ 5\.0| 2025| 6\.0/g, "");

  const room = (b, i) => {
    const s = scheme(b.palette);
    const k = b.imgs[0];
    const arched = k[2] / k[3] <= 0.9;
    const rest = b.imgs.slice(1);
    const MAXT = 6;
    const tiles = rest.length > MAXT ? rest.slice(0, MAXT - 1) : rest;
    const more = rest.length - tiles.length;
    const cols = rest.length <= 2 ? 2 : i % 2 ? 2 : 3;
    const keyImg = `<img src="${k[0]}" width="${k[2]}" height="${k[3]}" alt="${esc(b.name)} key visual" loading="lazy" decoding="async">`;
    return `
<article class="room${i % 2 ? " flip" : ""}" id="room-${b.slug}" data-i="${i}" aria-label="${esc(b.name)}" style="--pn:${s.bg};--tx:${s.text};--ac:${b.accent}" data-dark="${s.dark}">
  <div class="bwall">
    <img class="bg" src="${b.backdrop}" width="1536" height="1024" alt="" loading="lazy" decoding="async">
    <div class="bsheet">
      <div class="col-a">
        <div class="hang${arched ? " arched" : ""}">
          ${arched ? `<img class="arch" src="art/arch.webp" width="892" height="1418" alt="" loading="lazy" decoding="async">` : ""}
          <button class="key" type="button" data-open="0" aria-label="Open the ${esc(b.name)} key visual large">${keyImg}</button>
        </div>
        <div class="pal panel">
          <ul class="swatches" aria-label="${esc(b.name)} palette">
            ${b.palette.map((c) => `<li><button class="sw" type="button" data-hex="${c}" aria-label="Copy ${c}"><i style="background:${c}"></i><span>${c}</span></button></li>`).join("")}
          </ul>
          <p class="sw-msg" role="status" aria-live="polite"></p>
        </div>
      </div>
      <div class="col-b panel">
        <p class="num">Room ${i + 1} of ${N}</p>
        <h3 class="display">${esc(b.name)}</h3>
        <p class="tag">${esc(b.tag)}</p>
        <p class="meta">${esc(b.org)} · ${esc(b.date)}</p>
        <p class="brief">${esc(b.brief)}</p>
      </div>
      <div class="col-c">
        <div class="board panel c${cols}">
          ${tiles.map((m, j) => `<button class="tile" type="button" data-open="${j + 1}" aria-label="Open pubmat ${j + 2} of ${b.imgs.length}, ${esc(b.name)}"><img src="${m[0]}" width="${m[2]}" height="${m[3]}" alt="" loading="lazy" decoding="async"></button>`).join("")}
          ${more > 0 ? `<button class="tile more" type="button" data-open="${tiles.length + 1}" aria-label="Open the other ${more} pubmats, ${esc(b.name)}"><span>+${more} more</span></button>` : ""}
        </div>
        <aside class="label" aria-label="About this work">
          <p class="lab">Roles</p>
          <ul class="chips">${b.roles.map((r) => `<li class="chip">${esc(r)}</li>`).join("")}</ul>
          <p class="lab">Tools</p>
          <ul class="chips">${b.tools.map((r) => `<li class="chip">${esc(r)}</li>`).join("")}</ul>
          ${b.href ? `<a class="post" href="${esc(b.href)}" target="_blank" rel="noopener">See the campaign post<span class="sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>` : ""}
        </aside>
      </div>
    </div>
  </div>
</article>`;
  };

  mount.innerHTML = `
<div class="gal">
  <div class="track">
    <section class="intro" aria-label="Introduction">
      <div class="scrim left"></div>
      <div class="intro-in">
        <h2 id="brands-h" class="display wear">Branding and pubmats</h2>
        <p class="lede">Ten identities for student councils, chapters and conventions. Walk the corridor: every brand has its own room.</p>
        <button class="btn glass enter" type="button"><span>Enter the first room</span></button>
        <p class="hud walk">Scroll, use the arrows or press the left and right keys.</p>
        <ol class="jump" aria-label="Jump to a brand">${brands.map((b) => `<li><a href="#room-${b.slug}">${esc(short(b))}</a></li>`).join("")}</ol>
      </div>
      <img class="lana" src="art/lana.webp" width="520" height="520" alt="Lana, waving you in" loading="lazy">
    </section>
    ${brands.map(room).join("")}
  </div>
  <nav class="ctl" aria-label="Brand rooms">
    <button class="step prev" type="button" aria-label="Previous room"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <p class="count" aria-live="polite"><b>Intro</b><span>Walk the corridor</span></p>
    <button class="step next" type="button" aria-label="Next room"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <ol class="dots">${brands.map((b, i) => `<li><button type="button" data-go="${i}" aria-label="Go to room ${i + 1}, ${esc(short(b))}"><i></i></button></li>`).join("")}</ol>
  </nav>
</div>`;
  ALM.wearAll(mount);

  const $ = (s, el = mount) => el.querySelector(s);
  const $$ = (s, el = mount) => [...el.querySelectorAll(s)];
  const rooms = $$(".room");
  const dots = $$(".dots button");
  const count = $(".count");
  const prev = $(".prev"), next = $(".next");

  /* ---------- sizes ---------- */
  const size = () => {
    const w = stage.clientWidth;
    sec.style.setProperty("--rw", w + "px");
    sec.style.setProperty("--track", w * PANELS + "px");
  };
  size();
  addEventListener("resize", size);
  new ResizeObserver(size).observe(stage);

  /* ---------- the walk ---------- */
  let cur = -2; // -1 is the intro
  const at = (r) => (r + 1) / (PANELS - 1); // fraction of the pin where room r is centred
  const go = (r) => {
    r = Math.max(-1, Math.min(N - 1, r));
    if (stacked()) { (r < 0 ? $(".intro") : rooms[r]).scrollIntoView({ behavior: ALM.still() ? "auto" : "smooth", block: "start" }); return; }
    ALM.goTo("brands", at(r));
  };
  const setCurrent = (r) => {
    if (r === cur) return;
    cur = r;
    rooms.forEach((el, i) => (i === r ? el.setAttribute("aria-current", "true") : el.removeAttribute("aria-current")));
    dots.forEach((d, i) => (i === r ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
    count.innerHTML = r < 0 ? `<b>Intro</b><span>Walk the corridor</span>` : `<b>${r + 1} of ${N}</b><span>${esc(short(brands[r]))}</span>`;
    prev.disabled = r < 0;
    next.disabled = r >= N - 1;
  };
  ALM.on("brands", (p) => {
    if (stacked()) return;
    setCurrent(Math.round(p * (PANELS - 1)) - 1);
  });
  const sync = () => {
    if (stacked()) {
      cur = -2;
      rooms.forEach((el) => el.removeAttribute("aria-current"));
    } else {
      stage.scrollLeft = 0;
      cur = -2;
      ALM.tick();
    }
  };
  document.addEventListener("alm:quiet", sync);
  mq.addEventListener("change", sync);
  setCurrent(-1);

  prev.addEventListener("click", () => go(Math.max(-1, cur - 1)));
  next.addEventListener("click", () => go(cur + 1));
  dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.go)));
  $(".enter").addEventListener("click", () => go(0));
  sec.addEventListener("keydown", (e) => {
    if (stacked() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  });
  /* focus inside a room walks there; the browser must not scroll the clipped stage sideways */
  stage.addEventListener("scroll", () => { if (stage.scrollLeft) stage.scrollLeft = 0; });
  mount.addEventListener("focusin", (e) => {
    stage.scrollLeft = 0;
    const r = e.target.closest(".room");
    if (r && !stacked() && +r.dataset.i !== cur) go(+r.dataset.i);
  });

  /* ---------- inside a room ---------- */
  mount.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) {
      const b = brands[+open.closest(".room").dataset.i];
      ALM.lightbox(b.imgs.map((m, n) => ({ src: m[1], w: m[2], h: m[3], alt: n ? `${b.name}, pubmat ${n + 1}` : `${b.name} key visual`, cap: b.name })), +open.dataset.open);
      return;
    }
    const sw = e.target.closest(".sw");
    if (sw) {
      const msg = sw.closest(".pal").querySelector(".sw-msg");
      const done = () => { msg.textContent = "Copied " + sw.dataset.hex; clearTimeout(msg._t); msg._t = setTimeout(() => (msg.textContent = ""), 1600); };
      (navigator.clipboard?.writeText(sw.dataset.hex) || Promise.reject()).then(done, () => {
        const t = document.createElement("textarea");
        t.value = sw.dataset.hex; t.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (_) {}
        t.remove(); done();
      });
    }
  });
})();
