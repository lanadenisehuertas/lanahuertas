/* Night Almanac v3: the shared behaviour. Loads after data.js and before the
   stop scripts (gate.js, brands.js, stops.js), which use the global V3.
   Scroll progress for pinned stops, the route bar and phone menu, quiet mode,
   the one entrance, worn letters, the lightbox and a few helpers.
   See README.md for each function with an example. */
const V3 = (() => {
  const root = document.documentElement;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /** true in quiet mode (also on by default with reduced motion): nothing should move */
  const still = () => root.classList.contains("quiet");
  const phone = matchMedia("(max-width: 860px)");

  /* ---------- moon-phase icons: f = 0 new, 0.5 half, 1 full ---------- */
  const moonPath = (f) => f >= 0.99
    ? "M12 2a10 10 0 1 1 0 20a10 10 0 1 1 0-20z"
    : `M12 2A10 10 0 0 1 12 22A${(Math.abs(1 - 2 * f) * 10).toFixed(2)} 10 0 0 ${f < 0.5 ? 0 : 1} 12 2z`;
  const moon = (f) => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle class="dark" cx="12" cy="12" r="10"/><path class="lit" d="${moonPath(clamp(+f))}"/></svg>`;
  const moons = (scope = document) => $$(".moon[data-phase]", scope).forEach((m) => { if (!m.firstChild) m.innerHTML = moon(m.dataset.phase); });

  /* ---------- an <img> with width, height and alt always set ---------- */
  const pic = ({ src, w, h, alt = "", cls = "", srcset = "", sizes = "", lazy = true, priority = "" }) =>
    `<img${cls ? ` class="${cls}"` : ""} src="${esc(src)}"${srcset ? ` srcset="${esc(srcset)}"` : ""}${sizes ? ` sizes="${esc(sizes)}"` : ""} width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async"${priority ? ` fetchpriority="${priority}"` : ""}>`;

  /* ---------- scroll progress for pinned stops ---------- */
  const pins = [];
  /** call fn(p) whenever the pinned stop `el` moves; p is 0 at pin start, 1 at pin end */
  const pin = (el, fn) => { if (el) { pins.push({ el, fn, last: -1 }); tick(); } };
  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = innerHeight;
    for (const p of pins) {
      const r = p.el.getBoundingClientRect();
      const span = r.height - vh;
      const v = span > 1 ? clamp(-r.top / span) : r.top <= 0 ? 1 : 0;
      if (Math.abs(v - p.last) > 0.0004) { p.last = v; p.fn(v, r); }
    }
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  /** force every pin callback to run on the next frame (after a layout change) */
  const refresh = () => { pins.forEach((p) => (p.last = -1)); tick(); };
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", refresh);

  /** scroll to a stop; `at` 0 to 1 is a point inside its pinned travel */
  const goTo = (id, { at = 0, smooth = !still() } = {}) => {
    const el = typeof id === "string" ? document.getElementById(id.replace(/^#/, "")) : id;
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY + Math.max(0, el.offsetHeight - innerHeight) * at;
    scrollTo({ top: Math.round(y), behavior: smooth ? "smooth" : "instant" });
  };

  /* ---------- the colour journey: put the gradient stops where the stops really are ---------- */
  const ground = () => {
    const H = document.body.scrollHeight || 1;
    const top = (id) => { const el = document.getElementById(id); return el ? el.getBoundingClientRect().top + scrollY : null; };
    const pct = (y) => ((y / H) * 100).toFixed(2) + "%";
    const b = top("brands"), f = top("films"), a = top("about"), t = top("talk");
    const tEl = document.getElementById("talk");
    const s = document.body.style;
    if (b != null) s.setProperty("--g1", pct(b));
    if (f != null) s.setProperty("--g2", pct(f));
    if (a != null) s.setProperty("--g3", pct(a));
    if (t != null) {
      s.setProperty("--g4", pct(t));
      s.setProperty("--g5", pct(t + tEl.offsetHeight * 0.5));
    }
  };
  let groundRaf = 0;
  const groundSoon = () => { cancelAnimationFrame(groundRaf); groundRaf = requestAnimationFrame(ground); };

  /* ---------- route bar: current stop, links, phone menu ---------- */
  const STOPS = ["brands", "posters", "films", "products", "about", "talk"];
  const routeLinks = $$(".route-stops a");
  const setCurrent = (id) => routeLinks.forEach((a) => a.setAttribute("aria-current", String(a.hash === "#" + id)));
  const seen = new Set();
  const routeIO = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
    setCurrent(STOPS.filter((id) => seen.has(id)).pop() || "");
  }, { rootMargin: "-40% 0px -59% 0px" });
  STOPS.forEach((id) => { const el = document.getElementById(id); if (el) routeIO.observe(el); });

  const menu = $("#menu"), menuBtn = $(".route-menu");
  menuBtn?.addEventListener("click", () => menu.showModal());
  $(".menu-close", menu || document)?.addEventListener("click", () => menu.close());
  phone.addEventListener("change", (e) => { if (!e.matches && menu?.open) menu.close(); });

  /* every in-page link to a stop travels there; the menu closes first */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip")) return;
    const id = a.getAttribute("href").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (menu?.open) menu.close();
    goTo(el);
    history.replaceState(null, "", "#" + id);
  });

  /* ---------- quiet mode: remembered; pins become plain screens; entrances off ---------- */
  const sw = $("#quiet");
  const sync = () => sw?.setAttribute("aria-checked", String(still()));
  /** turn quiet mode on or off and keep the reader's place */
  const setQuiet = (on) => {
    if (on === still()) return;
    const line = innerHeight * 0.3;
    let anchor = null;
    for (const s of $$("main > section")) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) { anchor = s; break; }
    }
    const before = anchor ? anchor.getBoundingClientRect() : null;
    const f = before ? (line - before.top) / before.height : 0;
    root.classList.toggle("quiet", on);
    sync();
    try { localStorage.setItem("v3-quiet", on ? "1" : "0"); } catch (e) {}
    if (on) $$("[data-enter]").forEach(settle);
    const detail = { on, anchor, handled: false };
    document.dispatchEvent(new CustomEvent("v3:quiet", { detail }));
    if (!detail.handled && anchor) {
      const r = anchor.getBoundingClientRect();
      const pinned = anchor.classList.contains("pin");
      scrollTo({ top: Math.round(scrollY + r.top + (pinned ? 0 : f * r.height - line)), behavior: "instant" });
    }
    ground();
    refresh();
  };
  sync();
  sw?.addEventListener("click", () => setQuiet(!still()));

  /* ---------- the one entrance: rise 16px, fade in 400ms, 80ms stagger, never again ---------- */
  const settle = (el) => { el.removeAttribute("data-enter"); el.classList.remove("entered"); el.style.removeProperty("--enter-delay"); enterIO.unobserve(el); };
  const enterIO = new IntersectionObserver((es) => {
    const batch = es.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    batch.forEach((el, i) => {
      enterIO.unobserve(el);
      el.style.setProperty("--enter-delay", i * 80 + "ms");
      el.classList.add("entered");
      setTimeout(() => settle(el), 400 + i * 80 + 80);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  /** register every [data-enter] element in scope (call after rendering new markup) */
  const enter = (scope = document) => $$("[data-enter]", scope).forEach((el) => (still() ? settle(el) : enterIO.observe(el)));

  /* ---------- worn letters ---------- */
  /** split a heading into letters that wear through Redaction 70, 35 and 10 when touched */
  const wear = (el) => {
    if (el.dataset.worn) return;
    el.dataset.worn = "1";
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((w) => `<span style="white-space:nowrap" aria-hidden="true">${[...w].map((c) => `<span class="ch">${esc(c)}</span>`).join("")}</span>`).join(" ");
    el.addEventListener("pointerover", (e) => {
      const c = e.target.closest(".ch");
      if (!c || still() || c.dataset.busy) return;
      c.dataset.busy = "1";
      ["w1", "w2", "w3", "w2", "w1", ""].forEach((s, i, all) => setTimeout(() => {
        c.classList.remove("w1", "w2", "w3");
        if (s) c.classList.add(s);
        if (i === all.length - 1) delete c.dataset.busy;
      }, i * 70));
    });
  };
  const wearAll = (scope = document) => $$(".wear", scope).forEach(wear);
  /* the worn cuts load once, early, so the first touch does not flash */
  if (document.fonts) ["Redaction 70", "Redaction 35", "Redaction 10"].forEach((f) => document.fonts.load(`40px "${f}"`).catch(() => {}));

  /* ---------- copy to the clipboard ---------- */
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const t = document.createElement("textarea");
      t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.append(t); t.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_) {}
      t.remove();
      return ok;
    }
  };

  /* ---------- lightbox ---------- */
  const ICON = {
    x: '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    prev: '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  let box = null, items = [], at = 0, opener = null;
  const show = (i) => {
    at = (i + items.length) % items.length;
    const it = items[at];
    const img = $(".lb-fig img", box);
    img.width = it.w; img.height = it.h; img.alt = it.alt || it.title || "";
    img.src = it.sm || it.src; // the small copy is usually cached already: no blank frame
    if (it.sm && it.src !== it.sm) {
      const want = at, big = new Image();
      big.src = it.src;
      big.decode().then(() => { if (at === want && box.open) img.src = it.src; }, () => {});
    }
    $(".lb-title", box).textContent = it.title || "";
    $(".lb-count", box).textContent = items.length > 1 ? `${at + 1} / ${items.length}` : "";
    const link = $(".lb-link", box);
    link.hidden = !it.link;
    if (it.link) { link.href = it.link.href; link.firstChild.textContent = it.link.text + " "; }
    $$(".lb-prev, .lb-next", box).forEach((b) => (b.hidden = items.length < 2));
    [at - 1, at + 1].forEach((n) => { const o = items[(n + items.length) % items.length]; if (o) new Image().src = o.sm || o.src; });
  };
  /** open the shared viewer on a list of pieces at index i */
  const lightbox = (list, i = 0, from = document.activeElement) => {
    if (!box) {
      document.body.insertAdjacentHTML("beforeend", `<dialog class="lightbox" aria-label="Viewer">
        <figure class="lb-fig"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="1" height="1" alt=""></figure>
        <div class="lb-bar"><p class="lb-title"></p><p class="lb-count"></p><a class="lb-link" target="_blank" rel="noopener" hidden>See the post <span aria-hidden="true">↗</span><span class="vh"> (opens in a new tab)</span></a></div>
        <button class="btn secondary icon lb-x" type="button" aria-label="Close">${ICON.x}</button>
        <button class="btn secondary icon lb-prev" type="button" aria-label="Previous">${ICON.prev}</button>
        <button class="btn secondary icon lb-next" type="button" aria-label="Next">${ICON.next}</button>
      </dialog>`);
      box = $("dialog.lightbox");
      $(".lb-x", box).addEventListener("click", () => box.close());
      $(".lb-prev", box).addEventListener("click", () => show(at - 1));
      $(".lb-next", box).addEventListener("click", () => show(at + 1));
      box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-fig")) box.close(); });
      box.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1); }
      });
      box.addEventListener("close", () => { opener?.focus?.({ preventScroll: true }); });
    }
    items = list; opener = from;
    show(i);
    box.showModal();
    $(".lb-x", box).focus();
  };
  const viewerOpen = () => !!(box?.open || menu?.open);

  /* ---------- start ---------- */
  moons();
  wearAll();
  enter();
  ground();
  addEventListener("load", () => { ground(); refresh(); });
  addEventListener("resize", groundSoon);
  new ResizeObserver(groundSoon).observe(document.body);
  document.fonts?.ready.then(groundSoon);

  return { RM, $, $$, clamp, esc, still, phone, moon, moons, pic, pin, tick, refresh, goTo, ground, setQuiet, enter, wear, wearAll, copy, lightbox, viewerOpen, ICON };
})();
