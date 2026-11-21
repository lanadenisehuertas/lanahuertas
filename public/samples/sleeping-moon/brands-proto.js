/* Prototype: every brand on one page (brands-proto.html), opened from "See the full branding" in the Brands room.
   Each brand is one spread, laid out on a single board: its numeral and name, the date and the tagline at the top of
   the left column, the key visual large on the right, the brief, the tools and the palette under the name, and then
   all its other pieces in a row across the foot of the board. The page takes the world of the brand being read: its
   ground and ink, and its backdrop behind everything, crossing over to the next brand's as the scroll reaches it.
   A small index of ten moon phases sits fixed at the foot of the window, lit for the brand being read, with arrows
   to the brands either side and the brand's name, which opens the list of all ten. The address's hash (#slug) says
   which brand to open at. */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const MONTHS = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
  const longDate = (d) => String(d).replace(/^([A-Z][a-z]{2})\b/, (m) => MONTHS[m] || m);
  const and = (a) => a.map(esc).join(", ").replace(/, ([^,]*)$/, " and $1");
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, c, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(c)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const B = DATA.brands, N = B.length;
  const worldOf = (b) => ({ "--ground": b.ground, "--ink": b.ink, "--text": "#ece6ff", "--mark": "#fff1c9", "--rule": mix(b.ground, b.ink, 0.55) });
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
  const WORDS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const roman = (k) => ROMAN[k] || String(k + 1);
  const many = WORDS[N - 1] || String(N);
  // each brand has its own phase of the moon, waxing from a thin crescent for the first to full for the last
  const phase = (k) => SM.moonSvg((k + 1) / N);
  // the brand the page opens at: the one the address names, or the first. Its key visual is fetched at once and first
  // (the page's head has already asked for it); every other picture waits until the scroll brings it near
  const opening = Math.max(0, B.findIndex((b) => b.slug === decodeURIComponent(location.hash.slice(1))));

  /* the backdrops, one per brand, stacked behind the page. Each is made a picture, and fetched, only when its brand or
     one beside it is being read (take), and then as its smaller copy: it is only ever seen as the coarse flat tones of
     its canvas, which never need more than that. Each lies in a layer of its own the size of the window (.b-back), so
     it can be made a picture alone and faded as a whole. They cross over with the scroll, as the next brand comes up
     the window (the scrub). */
  document.body.insertAdjacentHTML("afterbegin", `<div class="b-world" aria-hidden="true">${B.map((b, k) => b.backdrop
    ? `<span class="b-back" data-k="${k}"><span class="backdrop pic box" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${mix(b.ground, b.ink, 0.2)};--ground:${b.ground}"><img class="full" data-src="${b.backdrop}" width="1536" height="1024" alt="" decoding="async"></span></span>`
    : "").join("")}</div>`);

  /* one brand, one spread. The article carries its numeral, name and colours for SM.travel, which draws them in the
     iris on a jump from the index. A name with a long word (NEOSTALGIA) is set a size smaller, so it keeps to its
     column. */
  const brand = (b, k) => {
    const [kSrc, , kW, kH] = b.imgs[0], rest = b.imgs.slice(1), first = k === opening;
    return `<article class="b-one" id="${b.slug}" data-k="${k}" data-label="${roman(k)} ${esc(b.name)}" data-ground="${b.ground}" data-ink="${b.ink}" aria-labelledby="bn-${b.slug}">
    <section class="stop b-stop" data-label="I Brands" data-hint="${rest.length ? "Open any piece to see it large." : `${esc(b.name)}, ${k + 1} of ${N}.`}">
      <div class="b-board b-spread${b.name.split(" ").some((w) => w.length > 9) ? " b-long" : ""}">
        <div class="b-text b-head">
          <p class="b-num label"><span class="b-ph" aria-hidden="true">${phase(k)}</span><span aria-hidden="true"><i>${roman(k)}</i>of ${many}</span><span class="vh">Brand ${k + 1} of ${N}</span></p>
          <h2 class="pk-name b-name" id="bn-${b.slug}" tabindex="-1">${esc(b.name)}</h2>
          <p class="pk-meta">${esc(b.org)}, ${esc(longDate(b.date))}</p>
          <p class="pk-tag">${esc(b.tag)}</p>
        </div>
        <div class="b-work">
          <div class="b-glow" aria-hidden="true" style="--glow:${b.ink}"></div>
          <button class="kv" type="button" data-k="${k}" data-i="0" style="--a:${(kW / kH).toFixed(4)}" aria-label="Open ${esc(b.name)}'s key visual large">
            <span class="pic" data-kind="photo" data-main><img class="full" src="${kSrc}" srcset="${srcsetOf(kSrc, kW)}" sizes="${first ? "" : "auto, "}${kvSizes(kW / kH, 46)}" width="${kW}" height="${kH}" alt="${esc(b.name)}, the key visual" ${first ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></span></button>
        </div>
        <div class="b-text b-info">
          <p class="say">${esc(b.brief)}</p>
          <p class="say">${esc(b.roles.map((r, j) => (j ? lower(r) : r)).join(", "))}. In ${and(b.tools)}.</p>
          <div class="swatches">${b.palette.map((c) => `<button class="swatch" type="button" style="--c:${c}" data-hex="${c}" aria-label="Copy ${c}"><i></i>${c.toLowerCase()}</button>`).join("")}</div>
          ${b.href ? `<a class="go" href="${b.href}" target="_blank" rel="noopener">See the campaign post ${ext}<span class="vh"> (opens a new tab)</span></a>` : ""}
        </div>
        ${rest.length ? `<div class="b-rest">
          <p class="b-rest-h label">${rest.length === 1 ? "One more piece" : `${cap(WORDS[rest.length - 1] || String(rest.length))} more pieces`} from ${esc(b.name)}</p>
          <div class="b-wall">${rest.map(([src, , w, h], i) => `<button class="piece" type="button" data-k="${k}" data-i="${i + 1}" data-a="${(w / h).toFixed(4)}" style="aspect-ratio:${w} / ${h};--a:${(w / h).toFixed(4)}" aria-label="Open ${esc(b.name)}, piece ${i + 2} of ${b.imgs.length}, large">
            <img src="${src}" srcset="${srcsetOf(src, w)}" sizes="auto, (max-width: 760px) 46vw, (max-aspect-ratio: 1/1) 46vw, 18vw" width="${w}" height="${h}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div>
        </div>` : ""}
      </div>
    </section>
  </article>`;
  };

  $("#page").innerHTML = `
  <nav class="b-index" aria-label="The ${many} brands">
    <h1 class="b-index-h">${cap(many)} brands, in full</h1>
    <ul>${B.map((b, k) => `<li><a href="#${b.slug}" data-k="${k}">${esc(b.name)}</a></li>`).join("")}</ul>
  </nav>
  ${B.map(brand).join("")}
  <section class="stop b-stop b-end" data-label="I Brands" data-hint="That's all ${many}." aria-label="The end of the brands">
    <div class="b-board b-onward"><div class="b-text">
      <a class="go" href="/#brands">Back to the Brands room</a>
      <a class="go" href="/#posters">On to the posters</a>
    </div></div>
  </section>`;

  /* the index at the foot of the window: the arrows to the brands either side, a moon phase for each brand (its name
     shows above it while pointed at), and the name of the brand being read, which opens the list of all of them */
  document.body.insertAdjacentHTML("beforeend", `<nav class="b-nav" aria-label="Move between the brands">
    <button class="b-step" type="button" data-d="-1">${SM.arrow(-1)}<span class="vh">Previous brand</span></button>
    <ol class="b-phases">${B.map((b, k) => `<li><a href="#${b.slug}" data-k="${k}" aria-label="${esc(b.name)}, ${k + 1} of ${N}"><span class="b-ph" aria-hidden="true">${phase(k)}</span><span class="b-tip" aria-hidden="true"><i>${roman(k)}</i>${esc(b.name)}</span></a></li>`).join("")}</ol>
    <button class="b-now" type="button" aria-expanded="false" aria-controls="b-list"><i></i><span class="b-now-name"></span><span class="vh">, show all ${many}</span></button>
    <button class="b-step" type="button" data-d="1">${SM.arrow(1)}<span class="vh">Next brand</span></button>
    <div class="b-list" id="b-list" hidden>
      <ol>${B.map((b, k) => `<li><a href="#${b.slug}" data-k="${k}"><i>${roman(k)}</i>${esc(b.name)}</a></li>`).join("")}</ol>
      <a class="go b-home" href="/#brands">Back to the Brands room</a>
    </div>
  </nav>`);
  const nav = $(".b-nav"), list = $(".b-list", nav), now = $(".b-now", nav), steps = $$(".b-step", nav);
  const phases = $$(".b-phases a", nav), rows = $$(".b-list ol a", nav);

  /* the page takes the world of the brand nearest the middle of the window */
  const arts = $$(".b-one"), backOf = B.map((b, k) => $(`.b-back[data-k="${k}"]`));
  let cur = -1;
  /* the address names the brand being read, but only once the page has loaded: a name written into it while the page
     is still loading is one the browser then scrolls to, which took a visitor who came without one past the index and
     into the first brand. At the top of the page with no brand named, none is written. */
  let loaded = document.readyState === "complete";
  const name = () => { if (loaded && (cur > 0 || location.hash)) history.replaceState(null, "", `#${B[cur].slug}`); };
  if (!loaded) addEventListener("load", () => { loaded = true; name(); }, { once: true });
  const take = (k) => {
    if (k === cur) return;
    cur = k;
    const w = worldOf(B[k]);
    Object.entries(w).forEach(([p, v]) => document.body.style.setProperty(p, v));
    $$(".b-stop", arts[k]).forEach((s) => Object.entries(w).forEach(([p, v]) => s.style.setProperty(p, v)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", B[k].ground);
    // this backdrop and its neighbours are fetched (their smaller copy) and drawn, ready for the scroll to cross to
    [k - 1, k, k + 1].forEach((j) => {
      const layer = backOf[j], im = layer && $("img", layer);
      if (!im || im.hasAttribute("src")) return;
      im.srcset = `${variant(im.dataset.src, 480)} 1x`; im.src = im.dataset.src;
      SM.pictures(layer).forEach((bm) => bm.load().then(() => { bm.show = 1; bm.draw(); }).catch(() => {}));
    });
    name();
    // the index says which brand this is, lights its moon, and names the brands the arrows lead to
    phases.forEach((a, j) => a.setAttribute("aria-current", String(j === k)));
    rows.forEach((a, j) => a.setAttribute("aria-current", String(j === k)));
    $("i", now).textContent = roman(k);
    $(".b-now-name", now).textContent = B[k].name;
    steps.forEach((s) => {
      const j = k + +s.dataset.d, none = j < 0 || j >= N;
      s.setAttribute("aria-disabled", String(none));
      $(".vh", s).textContent = none ? (j < 0 ? "This is the first brand" : "This is the last brand") : `${j < k ? "Previous" : "Next"} brand, ${B[j].name}`;
    });
  };
  arts.forEach((a, k) => $$(".b-stop", a).forEach((s) => Object.entries(worldOf(B[k])).forEach(([p, v]) => s.style.setProperty(p, v))));

  /* the brands' places and the page's height are read in the measure pass, and only when something has changed size
     (SM.placedGen); the scrub then works from the numbers alone and never reads the page */
  let tops = [], tall = 0, tallGen = -1;
  SM.measure(() => {
    if (tallGen === SM.placedGen) return;
    tallGen = SM.placedGen;
    tall = document.documentElement.scrollHeight;
    const y = SM.y;
    tops = arts.map((a) => SM.where(a).top + y);
  });
  /* the backdrops cross over with the scroll, never on a timer: a brand's own comes in over the last one's as its top
     rises from the foot of the window to near its top, and is half in as the page takes its colours (at 45% of the
     window). Scrolling back takes it out again the same way. The fall of ground colour over them crosses with it. */
  const bw = $(".b-world");
  const shown = new Array(N).fill(-1), into = new Array(N).fill(0);
  SM.scrub(() => {
    const y = SM.y, vh = SM.vh, mid = y + vh * 0.45;
    let k = 0;
    tops.forEach((t, j) => { if (t <= mid) k = j; });
    take(k);
    const max = Math.max(1, tall - vh), F = ((y / max) * 2 - 1).toFixed(3);
    if (bw._f !== F) { bw._f = F; bw.style.setProperty("--f", F); }
    if (!tops.length) return;
    let top = 0;
    for (let j = 0; j < N; j++) {
      into[j] = j ? SM.smooth(Math.min(1, Math.max(0, (y + vh * 0.95 - tops[j]) / (vh * 0.9)))) : 1;
      if (into[j] > 0) top = j;
    }
    for (let j = 0; j < N; j++) {
      // one wholly covered by the one over it is not drawn at all
      const o = j < N - 1 && into[j + 1] >= 1 ? 0 : Math.round(into[j] * 100) / 100;
      if (o !== shown[j] && backOf[j]) { shown[j] = o; backOf[j].style.opacity = o; }
    }
    const g = top && into[top] < 1 ? mix(B[top - 1].ground, B[top].ground, into[top]) : B[top].ground;
    if (bw._g !== g) { bw._g = g; bw.style.setProperty("--ground", g); }
  });

  /* going to a brand. The one either side is reached by gliding down the page, so its world crosses over as it does
     when you scroll; one further away is reached through the iris, as the stops are from the masthead. A press while
     the page is still gliding counts on from the brand it is gliding to, so pressing next twice goes two brands on. */
  let aim = -1;
  const goTo = (j, from, focus) => {
    if (j < 0 || j >= N) return;
    const base = aim >= 0 && SM.moving ? aim : cur;
    aim = j;
    if (Math.abs(j - base) <= 1 || SM.quiet()) SM.glide(SM.landing(arts[j]));
    else SM.travel(B[j].slug, from);
    if (focus) $(".b-name", arts[j]).focus({ preventScroll: true });
  };
  const step = (d) => goTo((aim >= 0 && SM.moving ? aim : cur) + d);
  const centre = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  /* the list of all of them, opened from the brand's name */
  const openList = (open) => {
    list.hidden = !open;
    now.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
    if (open) (rows[cur] || rows[0]).focus();
  };
  now.addEventListener("click", () => openList(list.hidden));
  steps.forEach((s) => s.addEventListener("click", () => step(+s.dataset.d)));
  [...phases, ...rows, ...$$(".b-index a")].forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const fromList = list.contains(a);
    if (fromList) openList(false);
    // a keyboard user who chose a brand from a list is taken into it, so the next Tab is inside that brand
    goTo(+a.dataset.k, centre(a), e.detail === 0);
    if (fromList && e.detail !== 0) now.focus();
  }));
  list.addEventListener("keydown", (e) => {
    const at = rows.indexOf(document.activeElement);
    const j = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: N - 1 }[e.key];
    if (j === undefined || at < 0) return;
    e.preventDefault();
    rows[Math.max(0, Math.min(N - 1, j))].focus();
  });
  addEventListener("pointerdown", (e) => { if (!list.hidden && !nav.contains(e.target)) openList(false); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !list.hidden) { openList(false); now.focus(); return; }
    // the left and right arrow keys go to the brands either side, anywhere on the page but in a field, the viewer,
    // the menu or the open list (whose own arrows move along it)
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
    if (document.querySelector("dialog[open]") || document.body.classList.contains("menu-open") || !list.hidden) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
    e.preventDefault();
    step(e.key === "ArrowLeft" ? -1 : 1);
  });

  /* a brand's other pieces are set in rows that fill the width, each row one height, so pieces of different shapes
     still line up: five at most to a row on a wide screen, spread evenly over as few rows as that takes (thirteen go
     five, four, four), and two to a row on a phone. The rows are made again only when the window crosses between the
     two, moving the same buttons into new rows. */
  const PHONE = matchMedia("(max-width: 760px), (max-aspect-ratio: 1/1), (max-height: 500px)");
  const rowUp = () => $$(".b-wall").forEach((wall) => {
    const ps = $$(".piece", wall), n = ps.length;
    const count = PHONE.matches ? Math.ceil(n / 2) : Math.ceil(n / 5), base = Math.floor(n / count), extra = n % count;
    const made = [];
    for (let r = 0, i = 0; r < count; r++) {
      const set = ps.slice(i, (i += base + (r < extra ? 1 : 0)));
      const row = document.createElement("div");
      row.className = "b-row";
      row.style.setProperty("--sum", set.reduce((t, p) => t + +p.dataset.a, 0).toFixed(4));
      row.style.setProperty("--n", set.length);
      row.append(...set);
      made.push(row);
    }
    wall.replaceChildren(...made);
  });
  rowUp();
  PHONE.addEventListener("change", rowUp);

  SM.pictures($("#page"));
  $$(".b-spread").forEach((el) => SM.corners(el));
  const lists = B.map((b) => b.imgs.map(([, full, w, h], i) => ({ src: full, w, h, alt: `${b.name}, piece ${i + 1}`, cap: b.name })));
  $$(".kv, .piece").forEach((p) => p.addEventListener("click", () => SM.view(lists[+p.dataset.k], +p.dataset.i)));
  $$(".swatch").forEach((s) => s.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(s.dataset.hex); SM.say(`Copied ${s.dataset.hex}`); } catch (e) { SM.say(s.dataset.hex); }
    setTimeout(() => SM.say(), 1800);
  }));

  /* open at the brand named in the address, and go to one named later (an edited address, the back button) */
  const named = () => B.findIndex((b) => b.slug === decodeURIComponent(location.hash.slice(1)));
  const at = named();
  if (at >= 0) {
    const land = () => window.scrollTo(0, SM.landing(arts[at]));
    land(); take(at);
    // the fonts arriving can move the brand a little; until the visitor has scrolled, it is put back at the top
    let mine = true;
    addEventListener("wheel", () => (mine = false), { once: true, passive: true });
    addEventListener("touchstart", () => (mine = false), { once: true, passive: true });
    addEventListener("keydown", () => (mine = false), { once: true });
    document.fonts?.ready.then(() => mine && land());
  } else take(0);
  addEventListener("hashchange", () => { const j = named(); if (j >= 0 && j !== cur) goTo(j); });
  SM.start();
})();
