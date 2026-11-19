/* Chapters #posters (the pinned wall) and #films (the lantern clearing). */
(() => {
  const { $, $$ } = ALM;
  const mP = $("#m-posters"), mF = $("#m-films");
  const mobile = matchMedia("(max-width: 859px)");

  /* ---------------- posters ---------------- */
  /* 12 hand-set slots: x, y (left/top of the poster, % of board), w (% of board width), rot (deg) */
  const SLOTS = [
    [3, 2.5, 25, -2.5], [30, 1.5, 19, 2], [52, 3, 23, -1.5], [77, 1.5, 19, 3],
    [1.5, 30, 18, 2.5], [21, 34, 25, -2], [49, 29, 19, 1.5], [70, 33, 26, -3],
    [4, 63, 22, -1.5], [28, 66, 19, 3], [50, 63, 25, 2], [78, 68, 19, -2]
  ];
  const NOTES = [
    ["made in one night", 44.5, 24, -5], ["my first print run", 66, 59.5, 4],
    ["type set by hand", 22.5, 61, 3], ["twelve, and counting", 90, 30, -4]
  ];
  const P = DATA.posters;
  if (mP) {
    mP.innerHTML = `<div class="body wall-body">
      <div class="ch-head"><h2 class="display wear" id="posters-h">One-off posters</h2>
      <span class="sig">pressed and pinned</span></div>
      <img class="lana wall-lana" src="art/lana.webp" width="520" height="520" alt="Lana's sticker" loading="lazy">
      <div class="wall-tools"><button class="btn paper" type="button" data-tidy>Tidy the wall</button><button class="btn paper" type="button" data-shuffle>Shuffle</button></div>
      <div class="wall-board paper" id="board">${P.map((p, i) => `<button class="poster tape" type="button" data-i="${i}" aria-label="Open ${p.t}, ${p.m}, ${p.y}"><img src="${p.img[0]}" width="${p.img[2]}" height="${p.img[3]}" alt="" loading="lazy" draggable="false"></button>`).join("")}${NOTES.map(([t, x, y, r]) => `<p class="note" style="--x:${x}%;--y:${y}%;--r:${r}deg">${t}</p>`).join("")}</div></div>`;
    ALM.wearAll(mP);
    const board = $("#board"), posters = $$(".poster", board);
    const pos = posters.map((_, i) => ({ x: SLOTS[i][0], y: SLOTS[i][1], r: SLOTS[i][3] })); // % of board
    const apply = (el, i) => { el.style.left = pos[i].x + "%"; el.style.top = pos[i].y + "%"; el.style.rotate = pos[i].r + "deg"; el.style.width = SLOTS[i][2] + "%"; };
    posters.forEach(apply);
    const list = () => P.map((p) => ({ src: p.img[1], w: p.img[2], h: p.img[3], alt: p.t + " poster", cap: `${p.t}, ${p.m}, ${p.y}` }));
    const open = (i) => ALM.lightbox(list(), i);
    const glide = () => {
      if (ALM.still()) return;
      board.classList.add("glide");
      setTimeout(() => board.classList.remove("glide"), 280);
    };
    // clamp a pixel position inside the board, return as percent
    const keep = (el, px, py) => {
      const bw = board.clientWidth, bh = board.clientHeight, w = el.offsetWidth, h = el.offsetHeight, m = 12;
      return [Math.min(Math.max(px, m), Math.max(m, bw - w - m)) / bw * 100, Math.min(Math.max(py, m + 6), Math.max(m, bh - h - m)) / bh * 100];
    };
    let top = 10;
    posters.forEach((el, i) => {
      let sx, sy, ox, oy, drag = false, down = false;
      el.addEventListener("pointerdown", (e) => {
        if (mobile.matches || e.button > 0) return;
        down = true; drag = false; sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener("pointermove", (e) => {
        if (!down) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!drag && Math.hypot(dx, dy) < 6) return;
        if (!drag) { drag = true; el.classList.add("held"); el.style.zIndex = ++top; }
        [pos[i].x, pos[i].y] = keep(el, ox + dx, oy + dy);
        el.style.left = pos[i].x + "%"; el.style.top = pos[i].y + "%";
      });
      const end = (e) => {
        if (!down) return;
        down = false;
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        el.classList.remove("held");
        if (!drag && e.type === "pointerup") open(i);
        drag = false;
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      el.addEventListener("click", (e) => { if (e.detail === 0 || mobile.matches) open(i); });
      el.addEventListener("keydown", (e) => {
        const d = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
        if (!d || mobile.matches) return;
        e.preventDefault();
        [pos[i].x, pos[i].y] = keep(el, el.offsetLeft + d[0], el.offsetTop + d[1]);
        el.style.zIndex = ++top;
        el.style.left = pos[i].x + "%"; el.style.top = pos[i].y + "%";
      });
    });
    $("[data-tidy]", mP).addEventListener("click", () => {
      glide();
      posters.forEach((el, i) => { pos[i] = { x: SLOTS[i][0], y: SLOTS[i][1], r: SLOTS[i][3] }; apply(el, i); el.style.zIndex = ""; });
    });
    $("[data-shuffle]", mP).addEventListener("click", () => {
      glide();
      posters.forEach((el, i) => {
        const bw = board.clientWidth, bh = board.clientHeight;
        const px = 12 + Math.random() * Math.max(0, bw - el.offsetWidth - 24), py = 18 + Math.random() * Math.max(0, bh - el.offsetHeight - 30);
        const [x, y] = keep(el, px, py);
        pos[i] = { x, y, r: Math.round((Math.random() * 10 - 5) * 10) / 10 };
        el.style.left = x + "%"; el.style.top = y + "%"; el.style.rotate = pos[i].r + "deg"; el.style.zIndex = ++top;
      });
    });
  }

  /* ---------------- films ---------------- */
  const F = DATA.films;
  if (mF) {
    mF.innerHTML = `<div class="body films-body">
      <div class="ch-head"><h2 class="display wear" id="films-h">Moving pictures</h2>
      <p class="lede">Documentaries, trailers, music videos and a song about the planets. Pick a slide and the lantern shows it.</p></div>
      <img class="lana films-lana" src="art/lana.webp" width="520" height="520" alt="Lana's sticker" loading="lazy">
      <div class="cinema" id="cinema">
        <img class="sheet" src="art/sheet.webp" width="1400" height="788" alt="A white cinema sheet hung between two trees" loading="lazy">
        <div class="cloth" id="cloth" aria-live="polite"></div>
        <div class="beam" id="beam" aria-hidden="true"></div>
        <img class="lamp" src="../almanac/art/o_lantern.webp" width="850" height="1079" alt="A brass magic lantern" loading="lazy">
      </div>
      <div class="caption paper"><div><h3 id="f-title"></h3><p id="f-meta"></p></div><a class="btn paper" id="f-link" target="_blank" rel="noopener">Watch on Google Drive</a></div>
      <div class="tray"><p class="tray-h">Slide box</p><div class="slides" id="slides" role="group" aria-label="Choose a film">${F.map((f, i) => `<button class="slide" type="button" aria-pressed="${i === 0}" data-i="${i}"><img src="${f.img[0]}" width="${f.img[1]}" height="${f.img[2]}" alt="" loading="lazy" draggable="false"><b>${f.t}</b><small>${f.d}</small></button>`).join("")}</div></div></div>`;
    ALM.wearAll(mF);
    const cloth = $("#cloth"), beam = $("#beam"), slides = $("#slides"), cinema = $("#cinema");
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      const f = F[i], first = cur < 0;
      cur = i;
      const img = new Image(f.img[1], f.img[2]);
      img.alt = f.t + ", still from the film";
      img.src = f.img[0];
      const olds = $$("img", cloth);
      if (ALM.still() || first) { olds.forEach((o) => o.remove()); cloth.append(img); }
      else {
        img.className = "out"; cloth.append(img);
        const swap = () => requestAnimationFrame(() => { img.classList.remove("out"); olds.forEach((o) => { o.classList.add("out"); setTimeout(() => o.remove(), 260); }); });
        img.complete ? swap() : img.addEventListener("load", swap, { once: true });
        beam.classList.remove("flick"); void beam.offsetWidth; beam.classList.add("flick");
      }
      $("#f-title").textContent = f.t;
      $("#f-meta").textContent = `${f.role} · ${f.d}`;
      const a = $("#f-link"); a.href = f.url;
      a.setAttribute("aria-label", `Watch ${f.t} on Google Drive (opens a new tab)`);
      $$(".slide", slides).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
    };
    set(0);
    slides.addEventListener("click", (e) => { const b = e.target.closest(".slide"); if (b && !b.dataset.dragged) set(+b.dataset.i); });
    // drag a slide onto the lantern or the sheet (mouse and pen)
    $$(".slide", slides).forEach((b) => {
      let g, sx, sy, down = false;
      b.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch" || e.button > 0) return; down = true; sx = e.clientX; sy = e.clientY; delete b.dataset.dragged; b.setPointerCapture(e.pointerId); });
      b.addEventListener("pointermove", (e) => {
        if (!down) return;
        if (!g && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) { g = b.cloneNode(true); g.className = "slide ghost"; g.removeAttribute("aria-pressed"); document.body.append(g); b.dataset.dragged = "1"; }
        if (g) { g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px"; cinema.classList.toggle("ready", document.elementsFromPoint(e.clientX, e.clientY).includes(cinema)); }
      });
      const end = (e) => {
        if (!down) return; down = false;
        try { b.releasePointerCapture(e.pointerId); } catch (_) {}
        if (g) {
          if (document.elementsFromPoint(e.clientX, e.clientY).includes(cinema)) set(+b.dataset.i);
          g.remove(); g = null; cinema.classList.remove("ready");
          setTimeout(() => delete b.dataset.dragged, 0);
        }
      };
      b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end);
    });
  }
})();
