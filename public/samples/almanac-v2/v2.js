/* Almanac v2 core: scroll progress per chapter, the route bar, quiet mode, the
   guided tour, the loader, worn letters and the shared lightbox. Chapter files
   (ch-*.js) load after this one and use the ALM object. */
const ALM = (() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const quiet = () => root.classList.contains("quiet");
  /** true when nothing should move: reduced motion or quiet mode */
  const still = () => RM || quiet();
  const clamp = (v) => Math.min(1, Math.max(0, v));

  /* moon phases: f = 0 new, 0.5 half, 1 full */
  const moonPath = (f) => f >= 0.99 ? "M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20z" : `M12 2A10 10 0 0 1 12 22A${(Math.abs(1 - 2 * f) * 10).toFixed(2)} 10 0 0 ${f < 0.5 ? 0 : 1} 12 2z`;
  const moonSvg = (f) => `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" class="phase-dark"/><path class="phase-lit" d="${moonPath(f)}"/></svg>`;

  /* ---------- progress: one read per frame, written on each chapter's own element ---------- */
  const chapters = $$(".chapter");
  const subs = {};
  /** call fn(p, enter) whenever chapter `id` moves; p and enter are 0 to 1 */
  const on = (id, fn) => { (subs[id] ||= []).push(fn); };
  let raf = 0;
  const measure = () => {
    raf = 0;
    const vh = innerHeight;
    const doc = root.scrollHeight - vh;
    $(".phases")?.style.setProperty("--prog", clamp(scrollY / Math.max(1, doc)).toFixed(4));
    for (const ch of chapters) {
      const r = ch.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const span = r.height - vh;
      const p = still() ? 0 : span > 8 ? clamp(-r.top / span) : clamp((vh - r.top) / (vh + r.height));
      const enter = still() ? 1 : clamp((vh - r.top) / vh);
      ch.style.setProperty("--p", p.toFixed(4));
      ch.style.setProperty("--in", enter.toFixed(4));
      (subs[ch.id] || []).forEach((fn) => fn(p, enter));
    }
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(measure); };
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", tick);
  addEventListener("load", tick);

  /** travel to a chapter (and optionally to a point 0 to 1 inside its pinned part) */
  const goTo = (id, at = 0) => {
    const ch = document.getElementById(id);
    if (!ch) return;
    const y = ch.getBoundingClientRect().top + scrollY + Math.max(0, ch.offsetHeight - innerHeight) * at;
    scrollTo({ top: y, behavior: still() ? "auto" : "smooth" });
  };

  /* ---------- route bar ---------- */
  const STOPS = [
    { id: "brands", t: "Branding", f: 0.12 }, { id: "posters", t: "Posters", f: 0.28 }, { id: "films", t: "Films", f: 0.45 },
    { id: "products", t: "Products", f: 0.62 }, { id: "about", t: "About", f: 0.8 }, { id: "talk", t: "Contact", f: 1 },
  ];
  const nav = $("#phaseNav");
  if (nav) {
    nav.innerHTML = STOPS.map((s) => `<li><a href="#${s.id}" aria-label="${s.t}">${moonSvg(s.f)}<span>${s.t}</span></a></li>`).join("");
    const links = $$("a", nav);
    links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); goTo(a.hash.slice(1)); history.replaceState(null, "", a.hash); }));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && links.forEach((a) => a.setAttribute("aria-current", String(a.hash === "#" + e.target.id)))), { rootMargin: "-45% 0px -50% 0px" });
    chapters.forEach((c) => io.observe(c));
  }
  $$("svg[data-phase]").forEach((s) => (s.outerHTML = moonSvg(+s.dataset.phase)));
  const fm = $("#footMoons");
  if (fm) fm.innerHTML = STOPS.map((s) => moonSvg(s.f)).join("");

  /* ---------- quiet mode ---------- */
  const sw = $("#quiet");
  if (RM) root.classList.add("quiet");
  if (sw) {
    sw.setAttribute("aria-checked", String(quiet()));
    sw.addEventListener("click", () => {
      const onNow = !quiet();
      root.classList.toggle("quiet", onNow);
      sw.setAttribute("aria-checked", String(onNow));
      try { localStorage.setItem("quiet", onNow ? "1" : "0"); } catch (e) {}
      document.dispatchEvent(new CustomEvent("alm:quiet", { detail: onNow }));
      tick();
    });
  }

  /* ---------- guided tour: the page walks itself; any input from you stops it ---------- */
  const tourBtn = $("#tour");
  let touring = 0, last = 0, stepTimer = 0;
  const stopTour = () => { cancelAnimationFrame(touring); clearInterval(stepTimer); touring = 0; tourBtn?.setAttribute("aria-pressed", "false"); if (tourBtn) $("span", tourBtn).textContent = "Guided tour"; };
  const startTour = () => {
    tourBtn.setAttribute("aria-pressed", "true");
    $("span", tourBtn).textContent = "Pause tour";
    if (still()) { // still mode: step chapter by chapter
      let i = Math.max(0, chapters.findIndex((c) => c.getBoundingClientRect().top > 10));
      touring = 1;
      stepTimer = setInterval(() => { if (i >= chapters.length) return stopTour(); chapters[i++].scrollIntoView(); }, 4000);
      return;
    }
    last = performance.now();
    const walk = (now) => {
      const dt = Math.min(64, now - last); last = now;
      scrollBy(0, (innerHeight * 0.26 * dt) / 1000);
      if (scrollY >= root.scrollHeight - innerHeight - 2) return stopTour();
      touring = requestAnimationFrame(walk);
    };
    touring = requestAnimationFrame(walk);
  };
  tourBtn?.addEventListener("click", () => (touring ? stopTour() : startTour()));
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => addEventListener(ev, (e) => { if (touring && !e.target.closest?.("#tour")) stopTour(); }, { passive: true }));

  /* ---------- loader ---------- */
  const L = $(".loader");
  if (L) {
    if (still() || sessionStorage.getItem("almanac2-seen")) L.classList.add("done");
    else {
      const path = $("#loadMoon"), pct = $("#loadPct"), img = $("#gate .plane.far img");
      const t0 = performance.now();
      let ready = !img || img.complete;
      img?.addEventListener("load", () => (ready = true));
      setTimeout(() => (ready = true), 2400);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1100), f = ready ? k : Math.min(k, 0.85);
        path.setAttribute("d", moonPath(Math.max(0.02, f)));
        pct.textContent = Math.round(f * 100) + "%";
        if (f < 1) requestAnimationFrame(step);
        else { L.classList.add("done"); sessionStorage.setItem("almanac2-seen", "1"); }
      };
      requestAnimationFrame(step);
    }
  }

  /* ---------- worn letters ---------- */
  const wear = (el) => {
    if (el.dataset.worn) return;
    el.dataset.worn = 1;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((w) => `<span style="white-space:nowrap" aria-hidden="true">${[...w].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ");
    el.addEventListener("pointerover", (e) => {
      const c = e.target.closest(".ch");
      if (!c || still() || c.dataset.busy) return;
      c.dataset.busy = 1;
      ["w1", "w2", "w3", "w2", "w1", ""].forEach((s, i, all) => setTimeout(() => { c.classList.remove("w1", "w2", "w3"); if (s) c.classList.add(s); if (i === all.length - 1) delete c.dataset.busy; }, i * 70));
    });
  };
  const wearAll = (scope = document) => $$(".wear", scope).forEach(wear);

  /* ---------- lightbox: ALM.lightbox([{ src, w, h, alt, cap }], index) ---------- */
  let box, items = [], at = 0, opener = null;
  const show = (i) => {
    at = (i + items.length) % items.length;
    const it = items[at];
    $("figure", box).innerHTML = `<img src="${it.src}" width="${it.w}" height="${it.h}" alt="${it.alt || ""}">`;
    $(".bar b", box).textContent = it.cap || "";
    $(".bar span", box).textContent = `${at + 1} of ${items.length}`;
    $$(".prev, .next", box).forEach((b) => (b.hidden = items.length < 2));
  };
  const lightbox = (list, i = 0) => {
    if (!box) {
      document.body.insertAdjacentHTML("beforeend", `<dialog class="lightbox" aria-label="Viewer"><figure></figure><div class="bar"><b></b><span></span></div><button class="x" type="button" aria-label="Close"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button><button class="prev" type="button" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="next" type="button" aria-label="Next"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></dialog>`);
      box = $("dialog.lightbox");
      $(".x", box).addEventListener("click", () => box.close());
      $(".prev", box).addEventListener("click", () => show(at - 1));
      $(".next", box).addEventListener("click", () => show(at + 1));
      box.addEventListener("click", (e) => (e.target === box || e.target.tagName === "FIGURE") && box.close());
      box.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(at - 1); if (e.key === "ArrowRight") show(at + 1); });
      box.addEventListener("close", () => opener?.focus());
    }
    items = list; opener = document.activeElement;
    show(i);
    box.showModal();
  };

  addEventListener("DOMContentLoaded", () => { wearAll(); tick(); });
  return { RM, still, $, $$, clamp, moonSvg, on, goTo, wear, wearAll, lightbox, tick, STOPS };
})();
