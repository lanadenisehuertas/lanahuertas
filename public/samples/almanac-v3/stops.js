/* Stops 3 to 7: posters, films, products, about, contact. Uses the global V3 (v3.js).
   - Posters: a native sideways row with scroll-snap to the centre, rendered from DATA.posters.
     Drag (mouse), swipe or trackpad, previous and next, and the arrow keys move it; a neighbour
     comes to the centre when clicked; the centre poster opens the shared viewer.
   - Films: rendered from DATA.films. A thumbnail cross-fades the picture in 220ms and updates
     the caption; the picture, caption and thumbnails always share one view.
   - Products: the words are static in index.html; this turns the four panels into tabs
     (200ms cross-fade, arrow keys, Home and End), swaps the screen from its thumbnails and
     opens the viewer from the screen.
   - About: the roles open one at a time.
   - Contact: "Copy the address" says "Copied" for two seconds. */
(() => {
  if (typeof V3 === "undefined") return;
  const { $, $$, esc, pic, clamp } = V3;
  const pad = (n) => String(n).padStart(2, "0");
  const sep = '<span class="sep"> · </span>';
  const how = () => (V3.still() ? "instant" : "smooth");
  /** true when at least `f` of the element (or of the screen, if it is taller) is on screen */
  const onScreen = (el, f = 0.6) => {
    const r = el.getBoundingClientRect();
    const v = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    return v >= Math.min(r.height, innerHeight) * f;
  };
  /** load an area's lazy images once it comes within a screen and a half */
  const wakeNear = (sec, scope = sec) => {
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      $$("img[loading=lazy]", scope).forEach((img) => (img.loading = "eager"));
    }, { rootMargin: "150% 0px" });
    io.observe(sec);
  };
  /** keys that belong to a control the reader is in: never steal them */
  const OWN_KEYS = "input, textarea, select, [contenteditable], [role=tablist], [role=slider], .fl-thumbs, .pd-thumbs, .ab-roles";

  /* ================= 3. Posters ================= */
  (() => {
    const sec = $("#posters"), mount = $("#posters-mount");
    if (!sec || !mount || typeof DATA === "undefined") return;
    const P = DATA.posters, N = P.length;
    const ratio = (p) => (p.img[2] / p.img[3]).toFixed(4);
    mount.innerHTML = `
<div class="pr" data-enter>
  <div class="pr-track" role="group" aria-roledescription="carousel" aria-label="Posters" style="--r0:${ratio(P[0])};--rn:${ratio(P[N - 1])}">
    ${P.map((p, i) => {
      const [sm, full, w, h] = p.img;
      return `<div class="pr-item" data-i="${i}" style="--r:${ratio(p)}" role="group" aria-roledescription="poster" aria-label="${i + 1} of ${N}">
      <button class="press pr-btn" type="button" tabindex="-1"><span class="frame">${pic({ src: sm, srcset: `${sm} 1x, ${full} 2x`, w, h, alt: `${p.t}, poster for ${p.m}, ${p.y}`, priority: i < 3 ? "" : "low" })}</span></button>
    </div>`;
    }).join("")}
  </div>
  <div class="pr-ctl">
    <button class="btn secondary icon pr-prev" type="button" aria-label="Previous poster">${V3.ICON.prev}</button>
    <p class="pr-cap" aria-live="polite"><span class="pr-title"></span><span class="label"></span></p>
    <button class="btn secondary icon pr-next" type="button" aria-label="Next poster">${V3.ICON.next}</button>
  </div>
</div>`;
    const track = $(".pr-track", mount);
    const items = $$(".pr-item", track);
    const btns = items.map((li) => $(".pr-btn", li));
    const prev = $(".pr-prev", mount), next = $(".pr-next", mount);
    const title = $(".pr-title", mount), label = $(".pr-cap .label", mount);
    V3.enter(mount);
    wakeNear(sec, mount);

    let cur = -1;
    const setCur = (i) => {
      if (i === cur) return;
      cur = i;
      items.forEach((li, n) => {
        const d = Math.abs(n - i);
        li.classList.toggle("on", d === 0);
        li.style.setProperty("--dim", d === 0 ? 0 : d === 1 ? 0.55 : 0.75);
        btns[n].tabIndex = d === 0 ? 0 : -1;
        btns[n].setAttribute("aria-label", d === 0 ? `Open ${P[n].t}, large` : `Show ${P[n].t}`);
      });
      title.textContent = P[i].t;
      label.innerHTML = `${pad(i + 1)} / ${pad(N)}${sep}${esc(P[i].m)}${sep}${esc(P[i].y)}`;
      prev.setAttribute("aria-disabled", String(i === 0));
      next.setAttribute("aria-disabled", String(i === N - 1));
    };
    const leftFor = (i) => items[i].offsetLeft + items[i].offsetWidth / 2 - track.clientWidth / 2;
    const nearest = () => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bd = Infinity;
      items.forEach((li, n) => { const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = n; } });
      return best;
    };
    /* while the row glides to a chosen poster, the caption stays on that poster */
    let lock = -1, lockT = 0;
    const go = (i, behavior = how()) => {
      i = clamp(i, 0, N - 1);
      lock = i;
      clearTimeout(lockT);
      lockT = setTimeout(() => { lock = -1; }, 700);
      track.scrollTo({ left: leftFor(i), behavior });
      setCur(i);
      return i;
    };

    let sraf = 0;
    track.addEventListener("scroll", () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => { sraf = 0; if (lock < 0) setCur(nearest()); });
    }, { passive: true });
    track.addEventListener("scrollend", () => { lock = -1; setCur(nearest()); });

    prev.addEventListener("click", () => { if (cur > 0) go(cur - 1); });
    next.addEventListener("click", () => { if (cur < N - 1) go(cur + 1); });

    /* drag with the mouse (touch and trackpads scroll the row natively) */
    let drag = null, swallow = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, id: e.pointerId, moved: false };
    });
    track.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        lock = -1;
        track.classList.add("drag");
        track.setPointerCapture(e.pointerId);
      }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      swallow = true;
      setTimeout(() => (swallow = false), 60);
      track.classList.remove("drag");
      go(nearest());
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("dragstart", (e) => e.preventDefault());

    /* a click on a neighbour brings it to the centre; on the centre poster it opens the viewer */
    track.addEventListener("click", (e) => {
      if (swallow) { swallow = false; e.preventDefault(); return; }
      const b = e.target.closest(".pr-btn");
      if (!b) return;
      const i = +b.parentElement.dataset.i;
      if (i !== cur) { go(i); b.focus({ preventScroll: true }); return; }
      V3.lightbox(P.map((p) => ({ src: p.img[1], sm: p.img[0], w: p.img[2], h: p.img[3], alt: `${p.t}, poster for ${p.m}, ${p.y}`, title: p.t })), i, b);
    });

    /* arrow keys: inside the row always; elsewhere when the row is on screen */
    document.addEventListener("keydown", (e) => {
      const k = e.key;
      if (k !== "ArrowLeft" && k !== "ArrowRight" && k !== "Home" && k !== "End") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || V3.viewerOpen()) return;
      const inside = track.contains(e.target);
      if (!inside) {
        if (k === "Home" || k === "End") return;
        if (e.target.closest?.(OWN_KEYS) || !onScreen(track)) return;
      }
      e.preventDefault();
      const i = go(k === "Home" ? 0 : k === "End" ? N - 1 : cur + (k === "ArrowRight" ? 1 : -1));
      if (inside) btns[i].focus({ preventScroll: true });
    });

    /* keep the chosen poster centred when the row changes size */
    /* the row opens on the second poster, so a neighbour stands on each side */
    const START = 1;
    new ResizeObserver(() => { track.scrollLeft = leftFor(cur < 0 ? START : cur); }).observe(track);
    setCur(START);
    track.scrollLeft = leftFor(START);
  })();

  /* ================= 4. Films ================= */
  (() => {
    const sec = $("#films"), mount = $("#films-mount");
    if (!sec || !mount || typeof DATA === "undefined") return;
    const F = DATA.films, N = F.length;
    const big = (f) => f.img[0].replace("/work/sm/", "/work/");
    const fit = (f) => (Math.abs(f.img[1] / f.img[2] - 16 / 9) > 0.05 ? "contain" : "cover");
    const f0 = F[0];
    mount.innerHTML = `
<div class="fl-main" data-enter>
  <figure class="frame fl-pic">
    ${pic({ src: big(f0), w: f0.img[1], h: f0.img[2], alt: `${f0.t}, a still from the film`, cls: "on" })}
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="16" height="9" alt="" decoding="async">
  </figure>
  <div class="fl-cap">
    <div class="fl-words" aria-live="polite"><h3 class="h3 fl-title"></h3><p class="label"></p></div>
    <a class="btn primary fl-go" href="${esc(f0.url)}" target="_blank" rel="noopener">Watch on Google Drive<span class="vh"> (opens in a new tab)</span></a>
  </div>
  <div class="fl-thumbs" role="group" aria-label="Choose a film">
    ${F.map((f, i) => `<button class="press fl-th" type="button" data-i="${i}" aria-pressed="${i === 0}" tabindex="${i ? -1 : 0}" aria-label="${esc(f.t)}, ${f.d}"><span class="frame">${pic({ src: f.img[0], w: f.img[1], h: f.img[2], alt: "" })}</span><span class="label" aria-hidden="true">${f.d}</span></button>`).join("")}
  </div>
</div>`;
    const imgs = $$(".fl-pic img", mount);
    let front = imgs[0], back = imgs[1];
    front.style.objectFit = fit(f0);
    const words = $(".fl-words", mount), metaEl = $(".fl-words .label", mount), go = $(".fl-go", mount);
    const thumbs = $$(".fl-th", mount);
    V3.enter(mount);
    wakeNear(sec, mount);
    /* the big stills are small files: fetch all ten once the stop is near, so a choice never waits */
    new IntersectionObserver((es, io) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      F.forEach((f) => { new Image().src = big(f); });
    }, { rootMargin: "100% 0px" }).observe(sec);

    let cur = -1, token = 0;
    const caption = (i) => {
      const f = F[i];
      /* a fresh heading each time, so its worn letters belong to the new title */
      const h = document.createElement("h3");
      h.className = "h3 fl-title wear";
      h.textContent = f.t;
      $(".fl-title", words).replaceWith(h);
      V3.wear(h);
      metaEl.innerHTML = `${pad(i + 1)} / ${pad(N)}${sep}${esc(f.role)}${sep}${esc(f.d)}`;
      go.href = f.url;
    };
    const show = (i) => {
      if (i === cur) return;
      const first = cur < 0;
      cur = i;
      const f = F[i];
      thumbs.forEach((t, n) => { t.setAttribute("aria-pressed", String(n === i)); t.tabIndex = n === i ? 0 : -1; });
      caption(i);
      if (first) return;
      const mine = ++token;
      back.width = f.img[1]; back.height = f.img[2];
      back.alt = `${f.t}, a still from the film`;
      back.style.objectFit = fit(f);
      back.src = big(f);
      back.decode().catch(() => {}).then(() => {
        if (mine !== token) return;
        back.classList.add("on");
        front.classList.remove("on");
        front.alt = "";
        [front, back] = [back, front];
      });
    };
    const group = $(".fl-thumbs", mount);
    group.addEventListener("click", (e) => { const t = e.target.closest(".fl-th"); if (t) show(+t.dataset.i); });
    group.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      let i = -1;
      if (k) i = clamp(cur + k, 0, N - 1);
      if (e.key === "Home") i = 0;
      if (e.key === "End") i = N - 1;
      if (i < 0) return;
      e.preventDefault();
      show(i);
      thumbs[i].focus();
    });
    show(0);
  })();

  /* ================= 5. Products ================= */
  (() => {
    const root = $("#products-mount");
    if (!root) return;
    const tabs = $$(".pd-tab", root);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    /* the viewer shows every screen of an app: the thumbnails, plus any extra ones */
    const EXTRA = {
      "pd-psyclick": [
        { src: "/work/psyclick/app-clients.webp", sm: "/work/psyclick/app-clients-sm.webp", w: 960, h: 600, alt: "PsyClick, the client list" },
        { src: "/work/psyclick/landing-hero.webp", sm: "/work/psyclick/landing-hero-sm.webp", w: 960, h: 667, alt: "PsyClick, the landing page" },
      ],
    };
    let at = 0;
    const pick = (i, focus) => {
      at = i;
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[n].classList.toggle("on", on);
        panels[n].inert = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => t.addEventListener("click", () => pick(i)));
    /* the words start under the tab row, however many lines it takes */
    const tabRow = $(".pd-tabs", root);
    new ResizeObserver(() => root.style.setProperty("--tabs-h", tabRow.offsetHeight + "px")).observe(tabRow);
    $(".pd-tabs", root).addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      let i = -1;
      if (k) i = (at + k + tabs.length) % tabs.length;
      if (e.key === "Home") i = 0;
      if (e.key === "End") i = tabs.length - 1;
      if (i < 0) return;
      e.preventDefault();
      pick(i, true);
    });

    panels.forEach((panel) => {
      const shot = $(".pd-shot", panel), img = $(".pd-shot img", panel);
      const thumbs = $$(".pd-thumb", panel);
      const name = $(".pd-name", panel).getAttribute("aria-label") || $(".pd-name", panel).textContent.trim();
      const list = () => {
        const base = thumbs.length
          ? thumbs.map((t) => ({ src: t.dataset.big || t.dataset.src, sm: t.dataset.src, w: +t.dataset.w, h: +t.dataset.h, alt: t.dataset.alt }))
          : [{ src: img.currentSrc || img.src, w: img.width, h: img.height, alt: img.alt }];
        return [...base, ...(EXTRA[panel.id] || [])].map((it) => ({ ...it, title: name }));
      };
      const now = () => Math.max(0, thumbs.findIndex((t) => t.getAttribute("aria-pressed") === "true"));
      shot.addEventListener("click", () => V3.lightbox(list(), now(), shot));
      thumbs.forEach((t) => t.addEventListener("click", () => {
        thumbs.forEach((x) => x.setAttribute("aria-pressed", String(x === t)));
        if (t.dataset.big) img.srcset = `${t.dataset.src} 960w, ${t.dataset.big} 1600w`;
        img.src = t.dataset.src;
        img.alt = t.dataset.alt;
      }));
    });
    pick(0);
  })();

  /* ================= 6. About ================= */
  (() => {
    const lis = $$(".ab-roles li");
    if (!lis.length) return;
    const set = (li, on) => {
      li.classList.toggle("open", on);
      $("button", li).setAttribute("aria-expanded", String(on));
    };
    lis.forEach((li) => $("button", li).addEventListener("click", () => {
      const was = li.classList.contains("open");
      lis.forEach((x) => set(x, false));
      if (!was) set(li, true);
    }));
  })();

  /* ================= 7. Contact ================= */
  (() => {
    const b = $(".tk-copy"), said = $("#tk-said");
    if (!b) return;
    let t = 0;
    b.addEventListener("click", async () => {
      const ok = await V3.copy(b.dataset.copy);
      b.classList.toggle("done", ok);
      said.textContent = ok ? "Address copied" : `The address is ${b.dataset.copy}`;
      clearTimeout(t);
      t = setTimeout(() => { b.classList.remove("done"); said.textContent = ""; }, 2000);
    });
  })();
})();
