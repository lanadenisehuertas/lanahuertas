/* Almanac v2: the lily pond (#products), the attic study (#about), first light (#talk). */
(() => {
  const { $, $$ } = ALM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const lanaImg = (cls = "") => `<img class="lana ${cls}" src="art/lana.webp" width="520" height="520" alt="" loading="lazy">`;
  const bloomSet = ["today", "cycle", "food", "progress"].map((n) => [`/work/bloom/${n}.webp`, `/work/bloom/${n}.webp`, 500, 1082, `Bloom, ${n} screen`]);
  const algSet = ["battle", "select", "story", "tutorial"].map((n) => [`/work/algebrawl/${n}.webp`, `/work/algebrawl/${n}.webp`, 1040, 780, `Algebrawl, ${n} screen`]);
  const psySet = [["dashboard", "dashboard"], ["clients", "clients"], ["intake", "intake"], ["report", "report"], ["typing", "typing test"], ["landing-hero", "landing page"]]
    .map(([n, l]) => [`/work/psyclick/${n === "landing-hero" ? "landing-hero" : "app-" + n}-sm.webp`, `/work/psyclick/${n === "landing-hero" ? "landing-hero" : "app-" + n}.webp`, n === "landing-hero" ? 1600 : 1600, n === "landing-hero" ? 1111 : 1000, `PsyClick, ${l}`]);
  // small src, big src, big w, big h, alt. Small size is stored separately for the swapped image.
  const smallDims = (s) => (s.includes("landing-hero") ? [960, 667] : s.includes("psyclick") ? [960, 600] : null);

  /* ================= products ================= */
  const PRODUCTS = [
    { id: "psyclick", t: "PsyClick", tag: "calmer clinical screening", kind: "desk", set: psySet,
      p: "A desktop app that reads typing rhythm and mouse movement to support clinician-guided mental health screening. It flags; it does not diagnose. I designed the whole experience and led a four-person team through our thesis defense.",
      role: "Project manager, backend developer and lead UI/UX designer · 2025 to 2026", stack: ["Electron", "Python", "React", "Supabase"], href: "https://psyclick-app.vercel.app/", cta: "Visit the live site" },
    { id: "bloom", t: "Bloom", tag: "a coach that follows your cycle", kind: "jar", set: bloomSet,
      p: "A mobile-first app that turns a strength and nutrition plan into a coach that adapts: workouts ease off during your period and push harder in your strongest week. It installs to the home screen, works offline and keeps every log on the phone.",
      role: "Designer and full-stack developer · 2026", stack: ["React", "TypeScript", "Dexie", "PWA"], href: "https://bloom-liart-delta.vercel.app", cta: "Open the app" },
    { id: "algebrawl", t: "Algebrawl", tag: "a pixel-art math battle arena", kind: "desk", set: algSet,
      p: "A turn-based math game where you duel Gauss, Newton and Fibonacci; right answers land hits. I designed the entire UI and hand-drew every sprite, from the title screen to the boss animations.",
      role: "UI designer and pixel artist · January 2025", stack: ["Pixel art", "Java Swing", "React", "KaTeX"], href: "https://algebrawl.vercel.app", cta: "Play the game" },
    { id: "ledger", t: "Debt Payoff Ledger", tag: "a weekly allocator for students", kind: "jar", set: [["/work/shot-debtledger.webp", "/work/shot-debtledger.webp", 500, 1140, "Debt Payoff Ledger on a phone"]],
      p: "A student budget app that sets aside food and school money from a weekly allowance, then puts the rest toward whichever debt is due soonest. Rebuilt from a one-file prototype into a tested Next.js app with a token-based design system.",
      role: "Designer and full-stack developer · 2026", stack: ["Next.js", "TypeScript", "Tailwind", "Vitest"], href: "https://debt-ledger-puce.vercel.app/", cta: "Visit the live site" },
  ];

  const mp = $("#m-products");
  if (mp) {
    const dims = (p, i) => { const s = p.set[i]; const d = smallDims(s[0]); return d || [s[2], s[3]]; };
    const visual = (p) => {
      const s = p.set[0], [w, h] = dims(p, 0);
      return p.kind === "jar"
        ? `<div class="jar"><button class="shot vis" type="button" aria-label="Open ${esc(p.t)} screenshots larger"><img src="${s[0]}" width="${w}" height="${h}" alt="${esc(s[4])}" loading="lazy"></button><img class="glassjar" src="../almanac/art/o_jar.webp" width="631" height="1329" alt=""></div>`
        : `<button class="desk vis" type="button" aria-label="Open ${esc(p.t)} screenshots larger"><img src="${s[0]}" width="${w}" height="${h}" alt="${esc(s[4])}" loading="lazy"></button>`;
    };
    const onPad = (p) => {
      const s = p.set[0], [w, h] = dims(p, 0);
      return p.kind === "jar"
        ? `<span class="onpad jar"><span class="shot"><img src="${s[0]}" width="${w}" height="${h}" alt="" loading="lazy"></span><img class="glassjar" src="../almanac/art/o_jar.webp" width="631" height="1329" alt=""></span>`
        : `<span class="onpad desk"><img src="${s[0]}" width="${w}" height="${h}" alt="" loading="lazy"></span>`;
    };
    mp.innerHTML = `
      <div class="scrim all"></div>
      <div class="body pond">
        <div class="pond-head">
          <h2 class="display wear" id="products-h">Products I designed and built</h2>
          ${lanaImg("bank")}
        </div>
        <p class="lede pond-lede">Four working apps. Pick a lily pad to open its page.</p>
        <div class="pads" role="group" aria-label="Choose a product">
          ${PRODUCTS.map((p, i) => `<button class="pad" type="button" data-i="${i}" aria-pressed="${i === 0}" style="--d:${5 + i * 0.9}s; --o:${i * -1.3}s">
            <span class="rings" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="float"><img class="padimg" src="art/pad.webp" width="640" height="640" alt="" loading="lazy">${onPad(p)}</span>
            <span class="ptag">${p.t}</span></button>`).join("")}
        </div>
        <div class="tabs" role="tablist" aria-label="Products">${PRODUCTS.map((p, i) => `<button class="tab" role="tab" id="ptab-${p.id}" aria-controls="psp-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${p.t}</button>`).join("")}</div>
        <div class="spreads">${PRODUCTS.map((p, i) => `<div class="spread" role="tabpanel" id="psp-${p.id}" aria-labelledby="ptab-${p.id}" data-i="${i}" data-cur="0" ${i ? "hidden" : ""}>
          <div class="left">${visual(p)}${p.set.length > 1 ? `<div class="thumbs" role="group" aria-label="${esc(p.t)} screenshots">${p.set.map((s, j) => `<button type="button" class="th" data-j="${j}" aria-pressed="${j === 0}" aria-label="Show screenshot ${j + 1} of ${p.set.length}"><img src="${s[0]}" width="64" height="${Math.round(64 * dims(p, j)[1] / dims(p, j)[0])}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}</div>
          <div class="right"><h3>${p.t}</h3><span class="sig">${p.tag}</span><p>${p.p}</p><p class="role">${p.role}</p><div class="chips">${p.stack.map((x) => `<span class="chip">${x}</span>`).join("")}</div><div><a class="btn paper" href="${p.href}" target="_blank" rel="noopener">${p.cta}<span class="sr"> (opens a new tab)</span></a></div></div>
        </div>`).join("")}</div>
      </div>`;
    ALM.wearAll?.(mp);

    const pads = $$(".pad", mp), tabs = $$(".tab", mp), spreads = $$(".spread", mp);
    const pick = (i, focusTab) => {
      pads.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      spreads.forEach((s, k) => { const was = s.hidden; s.hidden = k !== i; if (k === i && was) { s.classList.remove("fade"); void s.offsetWidth; s.classList.add("fade"); } });
      if (focusTab) tabs[i].focus();
    };
    pads.forEach((b, i) => b.addEventListener("click", () => pick(i)));
    tabs.forEach((t, i) => t.addEventListener("click", () => pick(i)));
    $(".tabs", mp).addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const n = tabs.length, k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); pick((i + k + n) % n, true); }
      else if (e.key === "Home") { e.preventDefault(); pick(0, true); }
      else if (e.key === "End") { e.preventDefault(); pick(n - 1, true); }
    });
    spreads.forEach((sp, i) => {
      const p = PRODUCTS[i];
      const show = (j) => {
        sp.dataset.cur = j;
        const img = $(".vis img", sp), [w, h] = dims(p, j);
        img.src = p.set[j][0]; img.width = w; img.height = h; img.alt = p.set[j][4];
        $$(".th", sp).forEach((t, k) => t.setAttribute("aria-pressed", String(k === j)));
      };
      $$(".th", sp).forEach((t) => t.addEventListener("click", () => show(+t.dataset.j)));
      $(".vis", sp).addEventListener("click", () => ALM.lightbox(p.set.map((s) => ({ src: s[1], w: s[2], h: s[3], alt: s[4], cap: s[4] })), +sp.dataset.cur));
    });
  }

  /* ================= about ================= */
  const TOOLS = [
    ["Figma", "#b9a2ff", "#2b1470", 3, 6], ["Photoshop", "#fff1c9", "#2b1470", 80, 4], ["Illustrator", "#ee8be4", "#3a0d3a", 5, 34],
    ["Premiere Pro", "#6b46e0", "#fff1c9", 78, 28], ["After Effects", "#efe8ff", "#2b1470", 2, 62], ["Canva", "#b9a2ff", "#2b1470", 80, 58],
    ["Python", "#fff1c9", "#2b1470", 14, 90], ["TypeScript", "#ee8be4", "#3a0d3a", 42, 94], ["Next.js", "#efe8ff", "#2b1470", 70, 88],
  ];
  const ROLES = [
    { t: "UI/UX design intern", d: "Aug 2026 to now", o: "Eden Holdings Philippines, Makati", l: ["Wireframes, flows and Figma prototypes.", "Built and kept the design system."] },
    { t: "Freelance graphic designer and video editor", d: "2023 to 2026", o: "Clients in several industries", l: ["Brand assets and marketing material.", "Edited video for launches and events."] },
    { t: "Creatives committee head", d: "2023 to 2025", o: "Student council and ACM chapter, FEU Tech", l: ["Led two creative teams.", "Designed every campaign."] },
    { t: "Multimedia team editor", d: "2020 to 2025", o: "Lord Jesus Fellowship Church, Bataan", l: ["Edited the weekly video.", "Made the weekly graphics."] },
  ];
  const AWARDS = [
    ["1st runner-up, GCash ImaGnation 2026", "Won first runner-up at the GCash ImaGnation innovation challenge in 2026."],
    ["Elite Scholar, FEU Tech", "Named an Elite Scholar at FEU Institute of Technology."],
    ["DOST scholar", "A scholar of the Department of Science and Technology."],
  ];
  const ma = $("#m-about");
  if (ma) {
    ma.innerHTML = `
      <div class="scrim all"></div>
      <div class="body study">
        <div class="col-l">
          <div class="zone" id="zone">
            <div class="cameo"><div class="face"><img src="/work/lana-portrait.webp" width="1136" height="1200" alt="Lana Huertas" loading="lazy"></div><img class="frame" src="../almanac/art/o_frame.webp" width="760" height="1052" alt="" loading="lazy"></div>
            ${TOOLS.map(([n, bg, fg, x, y]) => `<button type="button" class="stk" style="left:${x}%;top:${y}%;background:${bg};color:${fg}" aria-label="${n} sticker. Drag it, or use the arrow keys.">${n}</button>`).join("")}
          </div>
          <button class="btn line tidy" type="button" id="tidy">Tidy the stickers</button>
        </div>
        <div class="col-r">
          <h2 class="display wear" id="about-h">About Lana</h2>
          <p class="bio">I build visual content and adaptable designs for brands that want to stand out, and I can do it for you, too.</p>
          <div class="book-wrap" id="ledgerBox">
            <div class="ledger2" aria-live="polite">
              <img class="lbg" src="art/ledger.webp" width="1200" height="902" alt="" loading="lazy">
              <div class="pgs" id="pgs"></div>
            </div>
            <div class="lctl">
              <button class="btn paper" type="button" id="lprev">Previous page</button>
              <span class="hud lcount" id="lcount" aria-live="polite"></span>
              <button class="btn paper" type="button" id="lnext">Next page</button>
            </div>
          </div>
          <div class="awards">
            <div class="stamps" role="group" aria-label="Awards">${AWARDS.map((a, i) => `<button type="button" class="stamp" aria-pressed="false" data-i="${i}">${a[0]}</button>`).join("")}</div>
            <p class="anote paper" id="anote" aria-live="polite">Choose a stamp to see what it was for.</p>
          </div>
          <div class="book paper">
            <img src="../almanac/art/o_book.webp" width="760" height="789" alt="" loading="lazy">
            <div><b>B.S. Computer Science</b><p>Software engineering at FEU Institute of Technology, graduating July 2027.</p></div>
          </div>
        </div>
      </div>`;
    ALM.wearAll?.(ma);

    /* ledger */
    let at = 0;
    const pgs = $("#pgs", ma), count = $("#lcount", ma), prev = $("#lprev", ma), next = $("#lnext", ma);
    const draw = () => {
      const r = ROLES[at];
      pgs.innerHTML = `<div class="pg l"><h3>${r.t}</h3><time>${r.d}</time></div><div class="pg r"><b>${r.o}</b><p>${r.l[0]}</p><p>${r.l[1]}</p></div>`;
      count.textContent = `${at + 1} of ${ROLES.length}`;
    };
    const turn = (d) => {
      const n = (at + d + ROLES.length) % ROLES.length;
      if (ALM.still()) { at = n; draw(); return; }
      pgs.classList.add("out");
      setTimeout(() => { at = n; draw(); pgs.classList.remove("out"); }, 120);
    };
    prev.addEventListener("click", () => turn(-1));
    next.addEventListener("click", () => turn(1));
    draw();

    /* stamps */
    const stamps = $$(".stamp", ma), note = $("#anote", ma);
    stamps.forEach((s, i) => s.addEventListener("click", () => {
      const on = s.getAttribute("aria-pressed") !== "true";
      stamps.forEach((x) => x.setAttribute("aria-pressed", "false"));
      s.setAttribute("aria-pressed", String(on));
      note.textContent = on ? AWARDS[i][1] : "Choose a stamp to see what it was for.";
    }));

    /* stickers: drag with a threshold, arrow keys, tidy */
    const zone = $("#zone", ma), stks = $$(".stk", ma);
    const pos = new Map(stks.map((s) => [s, { x: 0, y: 0 }]));
    const apply = (s) => { const p = pos.get(s); s.style.translate = `${p.x}px ${p.y}px`; };
    const clampPos = (s, x, y) => {
      const z = zone.getBoundingClientRect(), w = s.offsetWidth, h = s.offsetHeight;
      const l = s.offsetLeft, t = s.offsetTop;
      return { x: Math.min(z.width - w - l, Math.max(-l, x)), y: Math.min(z.height - h - t, Math.max(-t, y)) };
    };
    stks.forEach((s) => {
      let st = null;
      s.addEventListener("pointerdown", (e) => { st = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: pos.get(s).x, oy: pos.get(s).y, moved: false }; s.setPointerCapture(e.pointerId); });
      s.addEventListener("pointermove", (e) => {
        if (!st || e.pointerId !== st.id) return;
        const dx = e.clientX - st.sx, dy = e.clientY - st.sy;
        if (!st.moved && Math.hypot(dx, dy) < 5) return;
        st.moved = true; s.classList.add("drag");
        pos.set(s, clampPos(s, st.ox + dx, st.oy + dy)); apply(s);
      });
      const end = (e) => { if (st && e.pointerId === st.id) { st = null; s.classList.remove("drag"); } };
      s.addEventListener("pointerup", end); s.addEventListener("pointercancel", end);
      s.addEventListener("keydown", (e) => {
        const k = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key];
        if (!k) return;
        e.preventDefault();
        const p = pos.get(s); pos.set(s, clampPos(s, p.x + k[0], p.y + k[1])); apply(s);
      });
    });
    $("#tidy", ma).addEventListener("click", () => stks.forEach((s) => { pos.set(s, { x: 0, y: 0 }); apply(s); }));
  }

  /* ================= talk ================= */
  const mt = $("#m-talk");
  if (mt) {
    const star = `<svg class="star" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="currentColor"/></svg>`;
    const roles = ["UI/UX design", "brand identity", "posters", "video editing", "front-end code"];
    const one = (c) => roles.map((r) => `<span class="${c}">${r}</span>${star.replace("class=\"star\"", `class="star ${c}"`)}`).join("");
    const run = one("") + one("dup") + one("dup");
    mt.innerHTML = `
      <div class="warm" id="warm" aria-hidden="true"></div>
      <button class="btn glass sun" type="button" id="sun" aria-pressed="false">Bring the morning</button>
      <div class="balloon" aria-hidden="true"><img src="art/balloon.webp" width="520" height="877" alt="" loading="lazy">${lanaImg("ride")}</div>
      <div class="stagebox">
        <div class="letter paper">
          <div class="flap"><div class="front"><h2 class="display wear" id="talk-h">Let's talk</h2><span class="sig">from Manila, open to work</span></div><div class="back"></div></div>
          <div class="lbody">
            <p class="lede">Hiring for UI/UX, brand or motion work, or need publicity for your org? Write to me. I reply within two days.</p>
            <div class="row">
              <a class="btn glass" href="mailto:lanadenisehuertas@gmail.com"><img class="gem" src="../brand/art/g_bud.webp" width="60" height="60" alt="">Email Lana</a>
              <button class="btn paper" type="button" id="copy"><span class="copied"><span class="a">Copy the address</span><span class="b">Copied</span></span></button>
            </div>
            <div class="links"><a href="https://www.linkedin.com/in/lana-denise-huertas/">LinkedIn</a><a href="https://github.com/lanadenisehuertas/">GitHub</a></div>
          </div>
        </div>
      </div>
      <div class="ribbon" id="ribbon">
        <div class="rtrack" role="img" aria-label="UI/UX design, brand identity, posters, video editing, front-end code"><div class="rrun" aria-hidden="true">${run}</div><div class="rrun" aria-hidden="true">${run}</div></div>
        <button class="rpause" type="button" id="rpause" aria-pressed="false" aria-label="Pause the ribbon"><svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true"><path class="pz" d="M5 3v12M13 3v12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
      </div>`;
    ALM.wearAll?.(mt);
    $("#copy", mt).addEventListener("click", async (e) => {
      const b = e.currentTarget;
      try { await navigator.clipboard.writeText("lanadenisehuertas@gmail.com"); } catch (err) { return; }
      b.classList.add("done"); b.setAttribute("aria-label", "Copied");
      setTimeout(() => { b.classList.remove("done"); b.removeAttribute("aria-label"); }, 2200);
    });
    const sun = $("#sun", mt), warm = $("#warm", mt);
    sun.addEventListener("click", () => { const on = sun.getAttribute("aria-pressed") !== "true"; sun.setAttribute("aria-pressed", String(on)); warm.classList.toggle("on", on); });
    const rb = $("#rpause", mt), rib = $("#ribbon", mt);
    rb.addEventListener("click", () => { const on = rb.getAttribute("aria-pressed") !== "true"; rb.setAttribute("aria-pressed", String(on)); rb.setAttribute("aria-label", on ? "Play the ribbon" : "Pause the ribbon"); rib.classList.toggle("paused", on); });
  }
})();
