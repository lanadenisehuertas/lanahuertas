/* A brand's page, laid out from DATA. BRAND and BRAND_AT are set in the page head.
   It is built like a plate in the Brands room, in the brand's own world: its ground colour, its ink, and its backdrop
   cut into flat tones behind everything, drifting slowly as you scroll. The words in the left column, the key visual
   large to the right with a soft light of the brand's own colour behind it, the moth and lily in the corners. The
   other pieces follow at their own shapes and in their own colours, as the pubmats do in the room. The brands either
   side close the page; like the doors, they sleep until they are pointed at. */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const MONTHS = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
  const longDate = (d) => String(d).replace(/^([A-Z][a-z]{2})\b/, (m) => MONTHS[m] || m);
  /** ["A", "B", "C"] as "A, B and C" */
  const and = (a) => a.map(esc).join(", ").replace(/, ([^,]*)$/, " and $1");
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  const b = BRAND, n = DATA.brands.length;
  const prev = DATA.brands[(BRAND_AT + n - 1) % n], next = DATA.brands[(BRAND_AT + 1) % n];
  const [kSrc, , kW, kH] = b.imgs[0];
  const rest = b.imgs.slice(1);
  const list = b.imgs.map(([, full, w, h], i) => ({ src: full, w, h, alt: `${b.name}, piece ${i + 1}`, cap: b.name }));
  const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, c, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(c)[i] - v) * t).toString(16).padStart(2, "0")).join("");

  /* the brand's world: the page, the masthead and the foot take its two colours; its backdrop lies behind it all */
  const world = { "--ground": b.ground, "--ink": b.ink, "--text": "#ece6ff", "--mark": "#fff1c9", "--rule": mix(b.ground, b.ink, 0.55) };
  Object.entries(world).forEach(([k, v]) => document.body.style.setProperty(k, v));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", b.ground);
  document.body.insertAdjacentHTML("afterbegin", `<div class="b-world" aria-hidden="true">${b.backdrop ? `<span class="backdrop pic box" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${mix(b.ground, b.ink, 0.2)};--ground:${b.ground}"><img class="full" src="${b.backdrop}" width="1536" height="1024" alt=""></span>` : ""}</div>`);

  const near = (x, word) => {
    const [src, , w, h] = x.imgs[0];
    return `<a class="near" href="brand.html?b=${x.slug}" data-line="${esc(x.tag)}">
      <span class="pic box" data-kind="photo" data-cell="1.4" style="aspect-ratio:${w} / ${h}"><img class="full" src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></span>
      <span class="n-line"><i>${word}.</i> ${esc(x.name)}</span></a>`;
  };

  $("#page").innerHTML = `
  <section class="stop b-stop" id="spec" data-label="I Brands" data-hint="${rest.length ? `${rest.length} more ${rest.length === 1 ? "piece" : "pieces"} below.` : "Two more brands below, either side of this one."}">
    <div class="b-board">
      <div class="b-text">
        <h1 class="pk-name b-name">${esc(b.name)}</h1>
        <p class="pk-meta">${esc(b.org)}, ${esc(longDate(b.date))}</p>
        <p class="pk-tag">${esc(b.tag)}</p>
        <p class="say">${esc(b.brief)}</p>
        <p class="say">${esc(b.roles.map((r, k) => (k ? lower(r) : r)).join(", "))}. In ${and(b.tools)}.</p>
        <div class="swatches">${b.palette.map((c) => `<button class="swatch" type="button" style="--c:${c}" data-hex="${c}" aria-label="Copy ${c}"><i></i>${c.toLowerCase()}</button>`).join("")}</div>
        ${b.href ? `<a class="go" href="${b.href}" target="_blank" rel="noopener">See the campaign post ${ext}</a>` : ""}
      </div>
      <div class="b-work">
        <div class="b-glow" aria-hidden="true" style="--glow:${b.ink}"></div>
        <button class="kv" type="button" id="kv" aria-label="Open ${esc(b.name)}'s key visual large">
          <span class="pic" data-kind="photo" data-main><img class="full" src="${kSrc}" width="${kW}" height="${kH}" alt="${esc(b.name)}, the key visual"></span></button>
      </div>
    </div>
  </section>
  ${rest.length ? `<section class="stop b-stop" id="sheet" data-label="I Brands" data-hint="Open any piece to see it large." aria-labelledby="sheet-h">
    <h2 class="vh" id="sheet-h">More pieces from ${esc(b.name)}</h2>
    <div class="b-board b-sheet">
      <div class="b-wall">${rest.map(([src, , w, h], i) => `<button class="piece" type="button" data-i="${i + 1}" style="aspect-ratio:${w} / ${h}" aria-label="Open piece ${i + 2} of ${b.imgs.length} large">
        <img src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></button>`).join("")}</div>
    </div>
  </section>` : ""}
  <section class="stop b-stop b-end" id="onward" data-label="I Brands" data-hint="Two more brands, either side of this one." aria-labelledby="onward-h">
    <h2 class="vh" id="onward-h">The brands either side</h2>
    <div class="b-board b-onward">
      <div class="b-text"><a class="go" href="/#brands">All ten brands</a></div>
      <div class="b-near">${near(prev, "Before")}${near(next, "After")}</div>
    </div>
  </section>`;

  $$(".b-stop").forEach((s) => Object.entries(world).forEach(([k, v]) => s.style.setProperty(k, v)));
  const bw = $(".b-world");
  SM.pictures(bw).forEach((bm) => bm.load().then(() => { bm.show = 1; bm.draw(); }).catch(() => {}));
  // the backdrop drifts a little with the scroll, slower than the page
  // the page's height is measured again only when something changes size (SM.placedGen), not every frame
  let tall = 0, tallGen = -1;
  SM.scrub(() => {
    if (tallGen !== SM.placedGen) { tallGen = SM.placedGen; tall = document.documentElement.scrollHeight; }
    const max = Math.max(1, tall - SM.vh), f = (SM.y / max) * 2 - 1;
    const F = f.toFixed(3);
    if (bw._f !== F) { bw._f = F; bw.style.setProperty("--f", F); }
  });
  SM.pictures($("#page"));
  $$(".b-board:not(.b-onward)").forEach((el) => SM.corners(el));
  $("#kv").addEventListener("click", () => SM.view(list, 0));
  $$(".piece").forEach((p) => p.addEventListener("click", () => SM.view(list, +p.dataset.i)));
  $$(".near").forEach((a) => SM.wakeable(a, { line: a.dataset.line }));
  $$(".swatch").forEach((s) => s.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(s.dataset.hex); SM.say(`Copied ${s.dataset.hex}`); } catch (e) { SM.say(s.dataset.hex); }
    setTimeout(() => SM.say(), 1800);
  }));
  SM.start();
})();
