/* The Night Almanac: behaviour for the sample site. Each block is one feature
   and does nothing when its element is missing, so system.html can reuse it. */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const quiet = () => document.documentElement.classList.contains("quiet");
const still = () => RM || quiet();

/* ---------- a moon phase as an SVG path; f = 0 new, 0.5 half, 1 full ---------- */
function moonPath(f) {
  if (f >= 0.99) return "M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20z";
  const rx = Math.abs(1 - 2 * f) * 10;
  const sweep = f < 0.5 ? 0 : 1;
  return `M12 2A10 10 0 0 1 12 22A${rx.toFixed(2)} 10 0 0 ${sweep} 12 2z`;
}
const moonSvg = (f) => `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" class="phase-dark"/><path class="phase-lit" d="${moonPath(f)}"/></svg>`;
$$("svg[data-phase]").forEach((s) => (s.outerHTML = moonSvg(+s.dataset.phase)));

/* ---------- the six sections, as moon phases ---------- */
const STOPS = [
  { id: "brands", t: "Branding", f: 0.12, img: "/work/sm/acm-revival.webp", line: "10 brands, each with its pubmats." },
  { id: "posters", t: "Posters", f: 0.28, img: "/work/sm/cs-night.webp", line: "12 one-off posters, pinned to the wall." },
  { id: "films", t: "Films", f: 0.45, img: "/work/sm/brenia-18.webp", line: "10 edits, from trailers to a documentary." },
  { id: "products", t: "Products", f: 0.62, img: "/work/psyclick/app-dashboard-sm.webp", line: "4 apps I designed and built." },
  { id: "about", t: "About", f: 0.8, img: "/work/lana-portrait.webp", line: "Manila, they/them, UI/UX intern." },
  { id: "talk", t: "Contact", f: 1, img: "/work/sm/pride-month.webp", line: "Open to work. I reply within two days." },
];
{
  const nav = $("#phaseNav");
  if (nav) {
    nav.innerHTML = STOPS.map((s) => `<li><a href="#${s.id}" aria-label="${s.t}">${moonSvg(s.f)}<span>${s.t}</span></a></li>`).join("");
    const links = $$("a", nav);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.setAttribute("aria-current", a.hash === "#" + e.target.id ? "true" : "false"));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    STOPS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    const top = document.getElementById("top");
    if (top) new IntersectionObserver(([e]) => e.isIntersecting && links.forEach((a) => a.setAttribute("aria-current", "false")), { rootMargin: "-45% 0px -50% 0px" }).observe(top);
  }
  const fm = $("#footMoons");
  if (fm) fm.innerHTML = STOPS.map((s) => moonSvg(s.f)).join("");
}

/* ---------- quiet mode: one switch turns every effect off ---------- */
{
  const sw = $("#quiet");
  if (sw) {
    sw.setAttribute("aria-checked", String(quiet()));
    sw.addEventListener("click", () => {
      const on = !quiet();
      document.documentElement.classList.toggle("quiet", on);
      sw.setAttribute("aria-checked", String(on));
      try { localStorage.setItem("quiet", on ? "1" : "0"); } catch (e) {}
    });
  }
}

/* ---------- the loader: a moon that fills while the hero picture arrives ---------- */
{
  const L = $(".loader");
  if (L) {
    const path = $("#loadMoon"), pct = $("#loadPct");
    const seen = sessionStorage.getItem("almanac-seen");
    if (still() || seen) L.classList.add("done");
    else {
      const img = $(".hero .scene img");
      const t0 = performance.now();
      let ready = false;
      const finish = () => { ready = true; };
      img && (img.complete ? finish() : (img.addEventListener("load", finish), img.addEventListener("error", finish)));
      setTimeout(finish, 2400); // never hold the page longer than this
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / 1100);
        const f = ready ? k : Math.min(k, 0.85);
        path.setAttribute("d", moonPath(Math.max(0.02, f)));
        pct.textContent = Math.round(f * 100) + "%";
        if (f < 1) requestAnimationFrame(tick);
        else { L.classList.add("done"); sessionStorage.setItem("almanac-seen", "1"); }
      };
      requestAnimationFrame(tick);
    }
  }
}

/* ---------- worn letters: touched letters run through Redaction's rougher cuts ---------- */
function wear(el) {
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.innerHTML = text
    .split(" ")
    .map((w) => `<span style="white-space:nowrap" aria-hidden="true">${[...w].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`)
    .join(" ");
  el.addEventListener("pointerover", (e) => {
    const c = e.target.closest(".ch");
    if (!c || still() || c.dataset.busy) return;
    c.dataset.busy = 1;
    const steps = ["w1", "w2", "w3", "w2", "w1", ""];
    steps.forEach((s, i) => setTimeout(() => {
      c.classList.remove("w1", "w2", "w3");
      if (s) c.classList.add(s);
      if (i === steps.length - 1) delete c.dataset.busy;
    }, i * 70));
  });
}
$$(".wear").forEach(wear);

/* ---------- hero: drifting motes, a little depth on scroll, flowers planted where you click ---------- */
{
  const hero = $(".hero");
  if (hero) {
    const motes = $(".motes", hero);
    if (motes && !RM) {
      motes.innerHTML = Array.from({ length: 14 }, () => {
        const x = Math.random() * 100, y = 30 + Math.random() * 65;
        return `<span style="left:${x}%;top:${y}%;--d:${7 + Math.random() * 7}s;--dx:${(Math.random() * 80 - 40).toFixed(0)}px;--dy:${(-20 - Math.random() * 60).toFixed(0)}px;opacity:${(0.35 + Math.random() * 0.5).toFixed(2)}"></span>`;
      }).join("");
    }
    let raf = 0, inView = true;
    new IntersectionObserver(([e]) => (inView = e.isIntersecting)).observe(hero);
    addEventListener("scroll", () => {
      if (still() || !inView || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(scrollY, innerHeight);
        hero.style.setProperty("--py", (y * 0.22).toFixed(1) + "px");
        hero.style.setProperty("--ny", (y * 0.1).toFixed(1) + "px");
      });
    }, { passive: true });

    const garden = $(".garden", hero);
    const SPROUTS = ["p_bloom", "p_bud", "p_fly", "p_bloom", "p_bud"];
    let n = 0;
    const plant = (x, y) => {
      const img = new Image();
      img.src = `../brand/art/${SPROUTS[n++ % SPROUTS.length]}.webp`;
      img.alt = "";
      img.style.left = x + "px";
      img.style.top = y + "px";
      img.style.setProperty("--s", Math.round(70 + Math.random() * 60) + "px");
      garden.append(img);
      if (garden.children.length > 16) garden.firstElementChild.remove();
    };
    hero.addEventListener("click", (e) => {
      if (e.target.closest("a, button, h1, p")) return;
      const r = hero.getBoundingClientRect();
      plant(e.clientX - r.left, e.clientY - r.top);
    });
    $("#plant")?.addEventListener("click", () => {
      const r = hero.getBoundingClientRect();
      const side = n % 2 ? 0.08 + Math.random() * 0.22 : 0.7 + Math.random() * 0.22;
      plant(r.width * side, r.height * (0.62 + Math.random() * 0.3));
    });
  }
}

/* ---------- the stop heads: a paper bud stands up once when its section arrives ---------- */
{
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("seen"), io.unobserve(e.target))), { threshold: 0.2 });
  $$(".stop").forEach((s) => io.observe(s));
}

/* ---------- the seed cabinet: six drawers over the photograph ---------- */
{
  const cab = $("#cab"), peek = $("#peek");
  if (cab) {
    // drawer fronts and their brass label holders, measured on art/o_cabinet.webp (percent)
    const cols = [{ x: 9.5, w: 39.5, lx: 19.6, lw: 19.1 }, { x: 52.5, w: 39.5, lx: 62.8, lw: 18.9 }];
    const rows = [{ y: 11, h: 25, ly: 16.9 }, { y: 36.5, h: 25, ly: 42 }, { y: 62.2, h: 25, ly: 67.8 }];
    const SPR = ["p_bloom", "p_moon", "p_fly", "p_bud", "p_bloom", "p_moon"];
    STOPS.forEach((s, i) => {
      const c = cols[i % 2], r = rows[Math.floor(i / 2)];
      const a = document.createElement("a");
      a.className = "drawer";
      a.href = "#" + s.id;
      a.style.cssText = `left:${c.x}%;top:${r.y}%;width:${c.w}%;height:${r.h}%;--lx:${((c.lx - c.x) / c.w) * 100}%;--lw:${(c.lw / c.w) * 100}%;--ly:${((r.ly - r.y) / r.h) * 100}%;--lh:${(6.2 / r.h) * 100}%`;
      a.innerHTML = `<img class="sprout" src="../brand/art/${SPR[i]}.webp" alt=""><span>${s.t}</span>`;
      const show = () => {
        if (!peek) return;
        const im = $("img", peek);
        im.src = s.img;
        $("b", peek).textContent = s.t;
        $("p", peek).textContent = s.line;
      };
      a.addEventListener("pointerenter", show);
      a.addEventListener("focus", show);
      cab.append(a);
    });
  }
}

/* ---------- branding: collectible cards and the plate sheet ---------- */
{
  const deck = $("#deck"), dlg = $("#sheet");
  if (deck && typeof DATA !== "undefined") {
    deck.innerHTML = DATA.brands
      .map((b, i) => {
        const [src, w, h] = b.imgs[0];
        return `<button class="ccard" type="button" data-i="${i}" aria-haspopup="dialog"><span class="win"><img src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></span><b>${b.name}</b><small>${b.tag}</small><span class="stamp count">${b.imgs.length} pieces</span></button>`;
      })
      .join("");
    deck.addEventListener("click", (e) => {
      const c = e.target.closest(".ccard");
      if (!c || !dlg) return;
      const b = DATA.brands[+c.dataset.i];
      $("#sheet-h").textContent = b.name;
      $("#sheet-t").textContent = b.tag;
      $("#sheet-g").innerHTML = b.imgs.map(([s, w, h], k) => `<img src="${s}" width="${w}" height="${h}" alt="${b.name}, piece ${k + 1}" loading="lazy">`).join("");
      dlg.showModal();
    });
    $("#sheetClose")?.addEventListener("click", () => dlg.close());
    dlg?.addEventListener("click", (e) => e.target === dlg && dlg.close());
  }
}

/* ---------- posters: pinned to the herbarium wall ---------- */
{
  const wall = $("#wall");
  if (wall && typeof DATA !== "undefined") {
    const rot = [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7];
    wall.innerHTML = DATA.posters
      .map((p, i) => { const [s, w, h] = p.img; return `<figure class="pin tape" style="--rot:${rot[i % rot.length]}deg"><img src="${s}" width="${w}" height="${h}" alt="${p.t} poster" loading="lazy"><b>${p.t}</b><small>${p.m}</small></figure>`; })
      .join("");
  }
}

/* ---------- films: the lantern shows the chosen slide ---------- */
{
  const screen = $("#screen"), slides = $("#slides");
  if (screen && slides && typeof DATA !== "undefined") {
    const F = DATA.films;
    const first = F[0];
    screen.innerHTML = `<figure><img src="${first.img[0]}" width="${first.img[1]}" height="${first.img[2]}" alt=""></figure><div class="meta"><div><h3></h3><p></p></div><a class="btn paper" target="_blank" rel="noopener">Watch on Google Drive</a></div>`;
    const set = (f) => {
      const old = $("figure img", screen);
      const img = new Image(f.img[1], f.img[2]);
      img.src = f.img[0];
      img.alt = f.t + ", still";
      img.className = "out";
      $("figure", screen).append(img);
      const swap = () => requestAnimationFrame(() => { img.classList.remove("out"); old.classList.add("out"); setTimeout(() => old.remove(), 260); });
      img.complete ? swap() : img.addEventListener("load", swap, { once: true });
      $("h3", screen).textContent = f.t;
      $("p", screen).textContent = `${f.role} · ${f.d}`;
      const a = $("a", screen);
      a.href = f.url;
      a.setAttribute("aria-label", `Watch ${f.t} on Google Drive (opens a new tab)`);
    };
    slides.innerHTML = F.map((f, i) => `<button class="slide" type="button" aria-pressed="${i === 0}" data-i="${i}"><img src="${f.img[0]}" width="${f.img[1]}" height="${f.img[2]}" alt="" loading="lazy"><b>${f.t}</b><small>${f.d}</small></button>`).join("");
    slides.addEventListener("click", (e) => {
      const b = e.target.closest(".slide");
      if (!b || b.getAttribute("aria-pressed") === "true") return;
      $$(".slide", slides).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      set(F[+b.dataset.i]);
    });
    set(first);
  }
}

/* ---------- products: folder tabs over almanac spreads ---------- */
const PRODUCTS = [
  { id: "psyclick", t: "PsyClick", tag: "calmer clinical screening", shot: ["/work/psyclick/app-dashboard-sm.webp", 960, 600], kind: "desk",
    p: "A desktop app that reads typing rhythm and mouse movement to support clinician-guided mental health screening. It flags; it does not diagnose. I designed the whole experience and led a four-person team through our thesis defense.",
    role: "Project manager, backend developer and lead UI/UX designer · 2025 to 2026", stack: ["Electron", "Python", "React", "Supabase"], href: "https://psyclick-app.vercel.app/", cta: "Visit the live site" },
  { id: "bloom", t: "Bloom", tag: "a coach that follows your cycle", shot: ["/work/bloom/today.webp", 500, 1082], kind: "jar",
    p: "A mobile-first app that turns a strength and nutrition plan into a coach that adapts: workouts ease off during your period and push harder in your strongest week. It installs to the home screen, works offline and keeps every log on the phone.",
    role: "Designer and full-stack developer · 2026", stack: ["React", "TypeScript", "Dexie", "PWA"], href: "https://bloom-liart-delta.vercel.app", cta: "Open the app" },
  { id: "algebrawl", t: "Algebrawl", tag: "a pixel-art math battle arena", shot: ["/work/algebrawl/battle.webp", 1040, 780], kind: "desk",
    p: "A turn-based math game where you duel Gauss, Newton and Fibonacci; right answers land hits. I designed the entire UI and hand-drew every sprite, from the title screen to the boss animations.",
    role: "UI designer and pixel artist · January 2025", stack: ["Pixel art", "Java Swing", "React", "KaTeX"], href: "https://algebrawl.vercel.app", cta: "Play the game" },
  { id: "ledger", t: "Debt Payoff Ledger", tag: "a weekly allocator for students", shot: ["/work/shot-debtledger.webp", 500, 1140], kind: "jar",
    p: "A student budget app that sets aside food and school money from a weekly allowance, then puts the rest toward whichever debt is due soonest. Rebuilt from a one-file prototype into a tested Next.js app with a token-based design system.",
    role: "Designer and full-stack developer · 2026", stack: ["Next.js", "TypeScript", "Tailwind", "Vitest"], href: "https://debt-ledger-puce.vercel.app/", cta: "Visit the live site" },
];
{
  const tabs = $("#tabs"), box = $("#spreads");
  if (tabs && box) {
    tabs.innerHTML = PRODUCTS.map((p, i) => `<button class="tab" role="tab" id="tab-${p.id}" aria-controls="sp-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${p.t}</button>`).join("");
    box.innerHTML = PRODUCTS.map((p, i) => {
      const [s, w, h] = p.shot;
      const vis = p.kind === "jar"
        ? `<div class="jar"><div class="shot"><img src="${s}" width="${w}" height="${h}" alt="${p.t} on a phone" loading="lazy"></div><img class="glassjar" src="art/o_jar.webp" width="631" height="1329" alt=""></div>`
        : `<div class="desk"><img src="${s}" width="${w}" height="${h}" alt="${p.t} screen" loading="lazy"></div>`;
      return `<div class="spread" role="tabpanel" id="sp-${p.id}" aria-labelledby="tab-${p.id}" ${i ? "hidden" : ""}><div class="left">${vis}</div><div class="right"><h3>${p.t}</h3><span class="sig">${p.tag}</span><p>${p.p}</p><p class="role">${p.role}</p><div class="chips">${p.stack.map((x) => `<span class="chip">${x}</span>`).join("")}</div><div><a class="btn paper" href="${p.href}" target="_blank" rel="noopener">${p.cta}</a></div></div></div>`;
    }).join("");
    const all = $$(".tab", tabs);
    const pick = (t, focus) => {
      all.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
      if (focus) t.focus();
    };
    tabs.addEventListener("click", (e) => { const t = e.target.closest(".tab"); t && pick(t); });
    tabs.addEventListener("keydown", (e) => {
      const i = all.indexOf(document.activeElement);
      if (i < 0) return;
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); pick(all[(i + k + all.length) % all.length], true); }
      if (e.key === "Home") { e.preventDefault(); pick(all[0], true); }
      if (e.key === "End") { e.preventDefault(); pick(all[all.length - 1], true); }
    });
  }
}

/* ---------- copy the email address ---------- */
$("#copy")?.addEventListener("click", async (e) => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText("lanadenisehuertas@gmail.com"); } catch (err) { return; }
  b.classList.add("done");
  b.setAttribute("aria-label", "Copied");
  setTimeout(() => { b.classList.remove("done"); b.removeAttribute("aria-label"); }, 2200);
});
