/* Prototype: accessibility fixes from the final audit (see fix-proto.css). Loaded last.
   - Tab never skips a room: rooms whose plates are built or made live only as you scroll are entered by keyboard too.
   - A plate's control that takes keyboard focus brings its plate fully into view first.
   - The phone menu moves focus in when it opens and back to its button when it closes, and keeps aria-expanded true.
   - The "Star chart" link in the phone menu works with Space, and focus has somewhere to go when the chart closes.
   - Form errors are spoken once, by a status line, and no longer become part of each field's name. */
(() => {
  const { $, $$ } = SM;
  // what Tab can reach: controls not taken out of the order with tabindex -1 (roving groups such as the film clips use it)
  const TAB = ['a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type=hidden])', 'textarea:not([disabled])', 'select:not([disabled])', '[tabindex]']
    .map((x) => x + ':not([tabindex="-1"])').join(", ");
  const usable = (el) => el.getClientRects().length > 0 && !el.closest("[inert], [aria-hidden=true]") && getComputedStyle(el).visibility !== "hidden";
  const stopOf = (el) => el?.closest("main > .stop");

  /* ---------------------------------------------------------------- Tab into rooms that are not live yet */
  addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey || document.querySelector("dialog[open]")) return;
    const a = document.activeElement, from = stopOf(a);
    if (!from) return;
    const stops = $$("main > .stop"), all = $$(TAB).filter(usable), i = all.indexOf(a), back = e.shiftKey;
    if (i < 0) return;
    const to = stopOf(all[back ? i - 1 : i + 1]);
    const si = stops.indexOf(from), ti = to ? stops.indexOf(to) : back ? -1 : stops.length;
    const between = back ? stops.slice(ti + 1, si).reverse() : stops.slice(si + 1, ti);
    const room = between.find((s) => SM.rooms?.[s.id]);
    if (!room) return;
    e.preventDefault();
    SM.rooms[room.id].jump(back ? 1e9 : 0, true);
    let tries = 0;
    const land = () => {
      const c = $$(TAB, room).filter(usable);
      if (c.length) (back ? c[c.length - 1] : c[0]).focus();
      else if (tries++ < 30) requestAnimationFrame(land);
    };
    requestAnimationFrame(land);
  }, true);

  /* ---------------------------------------------------------------- a focused control's plate comes into view */
  const seen = (el) => { let o = 1; for (let x = el; x && x !== document.body; x = x.parentElement) o *= +getComputedStyle(x).opacity; return o; };
  document.addEventListener("focusin", (e) => {
    const t = e.target;
    if (!(t instanceof Element) || !t.matches(":focus-visible")) return;
    const plate = t.closest(".reel-plate"), stop = stopOf(plate);
    if (!plate || !SM.rooms?.[stop?.id]) return;
    const r = t.getBoundingClientRect();
    if (!plate.classList.contains("now") || seen(t) < 0.9 || r.top < 0 || r.bottom > SM.vh) SM.rooms[stop.id].jump(+plate.dataset.i, true);
  });

  /* ---------------------------------------------------------------- the phone menu */
  const menu = $("#menu");
  if (menu) {
    let was = false;
    new MutationObserver(() => {
      const open = document.body.classList.contains("menu-open");
      if (open === was) return;
      menu.setAttribute("aria-expanded", String(open));
      if (open) requestAnimationFrame(() => $$(".route a").find(usable)?.focus());
      else if (!document.activeElement || document.activeElement === document.body || document.activeElement.closest(".route")) menu.focus({ preventScroll: true });
      was = open;
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---------------------------------------------------------------- the star chart */
  document.addEventListener("keydown", (e) => {
    const l = e.target instanceof Element && e.target.closest(".chart-link");
    if (l && (e.key === " " || e.key === "Spacebar")) { e.preventDefault(); l.click(); }
  });
  $("dialog.atlas")?.addEventListener("close", () => requestAnimationFrame(() => {
    // the dialog gives focus back to the link that opened it, which is hidden once the menu has closed
    const a = document.activeElement;
    if (a && a !== document.body && usable(a)) return;
    [$(".chart-btn"), menu].find((b) => b && usable(b))?.focus({ preventScroll: true });
  }));

  /* ---------------------------------------------------------------- form errors, spoken once */
  const wire = () => $$("#talk form").forEach((f) => {
    if (f._said) return;
    f._said = true;
    const errs = $$(".err", f);
    errs.forEach((x) => x.setAttribute("aria-hidden", "true"));   // still read as each field's description
    const say = Object.assign(document.createElement("p"), { className: "vh" });
    say.setAttribute("role", "status");
    f.append(say);
    // the line sits inside the form it listens to, so it only writes when the words change, or it would wake itself forever
    const hear = () => {
      const t = errs.map((x) => x.textContent.trim()).filter(Boolean).join(" ");
      if (say.textContent !== t) say.textContent = t;
    };
    errs.forEach((x) => new MutationObserver(hear).observe(x, { subtree: true, childList: true, characterData: true }));
  });
  wire();
  new MutationObserver(wire).observe($("#talk") || document.body, { childList: true, subtree: true });

  /* a door reached by the keyboard before the moon is up: the page goes straight to the risen moon, so the focus ring
     sits on a door that can be seen, not on the spell's title */
  document.addEventListener("focusin", (e) => {
    const d = e.target.closest?.(".door"), hero = $(".stop.hero");
    if (!d || !hero || !d.matches(":focus-visible")) return;
    const top = hero.getBoundingClientRect().top, at = +hero.dataset.riseAt || 0;
    if (-top / SM.vh - at >= 1) return;
    SM.glide(top + scrollY + (at + 1.02) * SM.vh, true);
  });

  /* ---------------------------------------------------------------- pictures, fetched as their room comes near
     A room's pictures are marked to wait (loading="lazy") so the first screen is not slowed by rooms far below. The
     browser would only fetch a waiting picture once it is itself on the screen, and many sit off to the side of their
     room's track until the scroll brings them in, so they would arrive late: instead, the whole room is fetched as soon
     as the room is within a screen of the window, including any picture it builds later. */
  const wake = (root) => $$('img[loading="lazy"]', root).forEach((im) => (im.loading = "eager"));
  const warm = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || e.target._warm) return;
    e.target._warm = true; warm.unobserve(e.target); wake(e.target);
    new MutationObserver(() => wake(e.target)).observe(e.target, { childList: true, subtree: true });
  }), { rootMargin: "100% 0px" });
  $$("main > section.stop").forEach((s) => warm.observe(s));
})();
