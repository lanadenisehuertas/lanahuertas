/* Prototype: every brand on one page (brands-proto.html), opened from "See the full branding" in the Brands room.
   Each brand is laid out as brand.js lays out one: the words on the left, the key visual large on the right, then all
   its other pieces. The page takes the world of the brand being read: its ground and ink, and its backdrop behind
   everything, crossing over to the next brand's as the scroll reaches it. The address's hash (#slug) says which brand
   to open at. */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const MONTHS = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
  const longDate = (d) => String(d).replace(/^([A-Z][a-z]{2})\b/, (m) => MONTHS[m] || m);
  const and = (a) => a.map(esc).join(", ").replace(/, ([^,]*)$/, " and $1");
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, c, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(c)[i] - v) * t).toString(16).padStart(2, "0")).join("");
  const B = DATA.brands, N = B.length;
  const worldOf = (b) => ({ "--ground": b.ground, "--ink": b.ink, "--text": "#ece6ff", "--mark": "#fff1c9", "--rule": mix(b.ground, b.ink, 0.55) });

  /* the backdrops, one per brand, stacked behind the page; only the current one is seen */
  document.body.insertAdjacentHTML("afterbegin", `<div class="b-world" aria-hidden="true">${B.map((b, k) => b.backdrop
    ? `<span class="backdrop pic box" data-k="${k}" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${mix(b.ground, b.ink, 0.2)};--ground:${b.ground}"><img class="full" src="${b.backdrop}" width="1536" height="1024" alt="" loading="lazy"></span>`
    : "").join("")}</div>`);

  const brand = (b, k) => {
    const [kSrc, , kW, kH] = b.imgs[0], rest = b.imgs.slice(1);
    return `<article class="b-one" id="${b.slug}" data-k="${k}" aria-labelledby="bn-${b.slug}">
    <section class="stop b-stop" data-label="I Brands" data-hint="${rest.length ? `${rest.length} more ${rest.length === 1 ? "piece" : "pieces"} from ${esc(b.name)} below.` : `${esc(b.name)}, ${k + 1} of ${N}.`}">
      <div class="b-board">
        <div class="b-text">
          <h2 class="pk-name b-name" id="bn-${b.slug}">${esc(b.name)}</h2>
          <p class="pk-meta">${esc(b.org)}, ${esc(longDate(b.date))}</p>
          <p class="pk-tag">${esc(b.tag)}</p>
          <p class="say">${esc(b.brief)}</p>
          <p class="say">${esc(b.roles.map((r, j) => (j ? lower(r) : r)).join(", "))}. In ${and(b.tools)}.</p>
          <div class="swatches">${b.palette.map((c) => `<button class="swatch" type="button" style="--c:${c}" data-hex="${c}" aria-label="Copy ${c}"><i></i>${c.toLowerCase()}</button>`).join("")}</div>
          ${b.href ? `<a class="go" href="${b.href}" target="_blank" rel="noopener">See the campaign post ${ext}<span class="vh"> (opens a new tab)</span></a>` : ""}
        </div>
        <div class="b-work">
          <div class="b-glow" aria-hidden="true" style="--glow:${b.ink}"></div>
          <button class="kv" type="button" data-k="${k}" data-i="0" aria-label="Open ${esc(b.name)}'s key visual large">
            <span class="pic" data-kind="photo" data-main><img class="full" src="${kSrc}" width="${kW}" height="${kH}" alt="${esc(b.name)}, the key visual" loading="${k ? "lazy" : "eager"}"></span></button>
        </div>
      </div>
    </section>
    ${rest.length ? `<section class="stop b-stop b-more" data-label="I Brands" data-hint="Open any piece to see it large.">
      <div class="b-board b-sheet">
        <div class="b-wall">${rest.map(([src, , w, h], i) => `<button class="piece" type="button" data-k="${k}" data-i="${i + 1}" style="aspect-ratio:${w} / ${h}" aria-label="Open ${esc(b.name)}, piece ${i + 2} of ${b.imgs.length}, large">
          <img src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></button>`).join("")}</div>
      </div>
    </section>` : ""}
  </article>`;
  };

  $("#page").innerHTML = `
  <nav class="b-index" aria-label="The ten brands">
    <h1 class="b-index-h">Ten brands, in full</h1>
    <ul>${B.map((b) => `<li><a href="#${b.slug}">${esc(b.name)}</a></li>`).join("")}</ul>
  </nav>
  ${B.map(brand).join("")}
  <section class="stop b-stop b-end" data-label="I Brands" data-hint="That's all ten." aria-label="The end of the brands">
    <div class="b-board b-onward"><div class="b-text">
      <a class="go" href="magic-proto.html#brands">Back to the Brands room</a>
      <a class="go" href="magic-proto.html#posters">On to the posters</a>
    </div></div>
  </section>`;

  /* the page takes the world of the brand nearest the middle of the window */
  const arts = $$(".b-one"), backs = $$(".b-world .backdrop"), bms = new Map();
  SM.pictures($(".b-world")).forEach((bm) => bms.set(+bm.pic.dataset.k, bm));
  let cur = -1;
  const take = (k) => {
    if (k === cur) return;
    cur = k;
    const w = worldOf(B[k]);
    Object.entries(w).forEach(([p, v]) => document.body.style.setProperty(p, v));
    $$(".b-stop", arts[k]).forEach((s) => Object.entries(w).forEach(([p, v]) => s.style.setProperty(p, v)));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", B[k].ground);
    // this backdrop and its neighbours are loaded; only this one is shown
    [k - 1, k, k + 1].forEach((j) => { const bm = bms.get(j); if (bm && !bm._in) { bm._in = true; bm.load().then(() => { bm.show = 1; bm.draw(); }).catch(() => {}); } });
    backs.forEach((el) => el.classList.toggle("on", +el.dataset.k === k));
    history.replaceState(null, "", `#${B[k].slug}`);
  };
  arts.forEach((a, k) => $$(".b-stop", a).forEach((s) => Object.entries(worldOf(B[k])).forEach(([p, v]) => s.style.setProperty(p, v))));
  const pick = () => {
    const mid = innerHeight * 0.45;
    let k = 0;
    arts.forEach((a, j) => { if (a.getBoundingClientRect().top <= mid) k = j; });
    take(k);
  };
  SM.scrub(() => {
    pick();
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), F = ((scrollY / max) * 2 - 1).toFixed(3);
    const bw = $(".b-world");
    if (bw._f !== F) { bw._f = F; bw.style.setProperty("--f", F); }
  });

  SM.pictures($("#page"));
  $$(".b-board:not(.b-onward):not(.b-sheet)").forEach((el) => SM.corners(el));
  const lists = B.map((b) => b.imgs.map(([, full, w, h], i) => ({ src: full, w, h, alt: `${b.name}, piece ${i + 1}`, cap: b.name })));
  $$(".kv, .piece").forEach((p) => p.addEventListener("click", () => SM.view(lists[+p.dataset.k], +p.dataset.i)));
  $$(".swatch").forEach((s) => s.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(s.dataset.hex); SM.say(`Copied ${s.dataset.hex}`); } catch (e) { SM.say(s.dataset.hex); }
    setTimeout(() => SM.say(), 1800);
  }));

  /* open at the brand named in the address */
  const at = B.findIndex((b) => b.slug === decodeURIComponent(location.hash.slice(1)));
  if (at >= 0) { arts[at].scrollIntoView({ block: "start" }); take(at); } else take(0);
  SM.start();
})();
