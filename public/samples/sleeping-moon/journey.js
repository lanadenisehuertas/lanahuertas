/* The journey: the moon stop (six doors, the moon's two faces, the name) and the brands stop. */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  /* ================================================================ the moon */
  const hero = $("#moon"), board = $("#board");
  const doors = $$(".door", board);
  const restName = $(".n-rest", board), doorName = $("#door");

  // stars keep clear of the moon, the name and the two door columns (boxes in percent of the board)
  SM.stars($(".stars", board), 60, [[27, 12, 73, 82], [4, 70, 96, 92], [8, 8, 23, 74], [77, 8, 92, 74], [0, 0, 12, 22], [88, 0, 100, 26], [0, 72, 10, 92], [88, 78, 100, 92]]);

  // chart lines: each door is joined to the moon's rim (viewBox is the board in u: 100 x 62.5)
  {
    const C = [50, 28.8], R = 21;
    $(".chart", board).innerHTML = doors.map((d) => {
      const dx = parseFloat(d.style.getPropertyValue("--dx")), y = parseFloat(d.style.getPropertyValue("--cy")) - 0.9;
      const x = 50 + dx + Math.sign(-dx) * 6.4;                       // the door picture's inner edge, plus a gap
      const a = Math.atan2(y - C[1], x - C[0]);
      return `<line x1="${x}" y1="${y}" x2="${(C[0] + Math.cos(a) * (R + 1.2)).toFixed(2)}" y2="${(C[1] + Math.sin(a) * (R + 1.2)).toFixed(2)}"/>`;
    }).join("");
  }

  const bms = SM.pictures(hero);
  const moon = SM.bitmap($("#moonpic"));
  let awake = 0, leaving = false, demo = 0, eyes = false, doze = 0;
  /* the moon opens its eyes when someone moves the pointer, and closes them after a quiet minute */
  const stir = () => {
    clearTimeout(doze);
    if (!eyes && !leaving && !SM.quiet()) { eyes = true; moon.setFace(1, 320); }
    doze = setTimeout(() => { eyes = false; if (!awake && !leaving) moon.setFace(0, 420); }, 60000);
  };
  if (SM.HOVER) hero.addEventListener("pointermove", (e) => e.pointerType !== "touch" && stir(), { passive: true });

  const retrigger = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const showDoor = (text) => { doorName.textContent = text; restName.classList.add("gone"); doorName.classList.add("shown"); retrigger(doorName, "wipe-in"); };
  const showRest = () => { doorName.classList.remove("shown", "wipe-in"); restName.classList.remove("gone"); retrigger(restName, "wipe-in"); };

  doors.forEach((d) => {
    SM.wakeable(d, {
      on() { clearTimeout(demo); awake++; board.classList.add("touch"); showDoor(d.dataset.door); moon.setFace(1); },   // the moon opens its eyes while a door is awake
      off() { awake = Math.max(0, awake - 1); if (!awake && !leaving) { board.classList.remove("touch"); showRest(); moon.setFace(eyes ? 1 : 0); } },
    });
    d.addEventListener("click", (e) => { e.preventDefault(); enter(d); });
  });
  /** choosing a door: the chosen door wakes and flies to the middle of the screen, growing; the other five fall
      away outward, one after another; the moon opens its eyes and wakes into colour; the name breaks up. Then the
      travel iris closes in that stop's colours from the door, shows the stop's name, and opens on the stop. */
  function enter(d) {
    const id = d.dataset.stop;
    if (leaving) return;
    if (SM.quiet()) { SM.travel(id); return; }
    leaving = true;
    const r = d.getBoundingClientRect(), b = board.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, vx = SM.vw / 2, vy = SM.vh / 2;
    const bx = b.left + b.width / 2, by = b.top + b.height / 2, U = SM.u();
    board.classList.add("leave");
    SM.bitmap(d).wakeUp(180);
    moon.setFace(1, 120); moon.wakeUp(420, 80);
    d.style.zIndex = 9;
    d.style.transform = `translate(${vx - cx}px, ${vy - cy}px) scale(${Math.min(3.2, (SM.vh * 0.42) / r.height).toFixed(2)})`;
    d.classList.add("chosen");
    doors.filter((x) => x !== d).forEach((x, i) => {
      const q = x.getBoundingClientRect(), dx = q.left + q.width / 2 - bx, dy = q.top + q.height / 2 - by, l = Math.hypot(dx, dy) || 1;
      x.style.transitionDelay = `${i * 35}ms`;
      x.style.transform = `translate(${(dx / l) * 9 * U}px, ${(dy / l) * 9 * U + 3 * U}px) rotate(${dx < 0 ? -6 : 6}deg) scale(0.86)`;
      x.classList.add("away");
    });
    $$(".ch", restName).forEach((c, i) => { c.style.transitionDelay = `${Math.abs(i - 6) * 18}ms`; c.style.transform = `translateY(${(i % 2 ? -1 : 1) * 2.2 * U}px)`; });
    setTimeout(() => SM.travel(id, { x: vx, y: vy }, { onJump: reset }), 380);   // the iris closes as the door arrives
  }
  /** put the plate back as it was, unseen, for when the visitor returns */
  function reset() {
    board.classList.add("still"); board.classList.remove("leave", "touch");
    doors.forEach((x) => { x.style.transform = x.style.transitionDelay = x.style.zIndex = ""; x.classList.remove("chosen", "away", "on"); x.blur(); x._on = false; });
    $$(".ch", restName).forEach((c) => (c.style.transform = c.style.transitionDelay = ""));
    void board.offsetWidth; board.classList.remove("still");
    bms.forEach((bm) => { bm.awake = false; bm.pic.classList.remove("awake"); bm.wake = 0; bm.draw(); });
    awake = 0; eyes = false; showRest(); moon.setFace(0, 0); SM.say(); leaving = false;
  }

  /* the moonrise: on wide screens the first stop is two screens tall and its plate stays put while the first one
     scrolls by. Night has fallen, the moon is under the horizon; scrolling raises it into place, the horizon sinks
     away, and as it comes up the chart lines, the name and the doors are drawn in, all as far as the scroll has
     taken them, and back out if you scroll back. Quiet mode and phones start risen. */
  const COLUMN = matchMedia("(max-width: 760px), (max-aspect-ratio: 1/1), (max-height: 500px)");
  const moonEl = $("#moonpic"), prelude = $("#prelude"), horizon = $(".horizon", board);
  const hint = { rest: hero.dataset.hint, rising: "Scroll to raise the moon." };
  let rising = false, risen = false, entered = false, rq = 0;
  const enterDoors = () => {
    if (entered) return;
    entered = true;
    board.classList.add("in");
    if (rising) return;   // while the moon rises, the scroll draws the doors in (rise)
    doors.forEach((d, i) => SM.bitmap(d).to("show", 1, 300, 120 + i * 70));
    // show once how it works: the first door wakes for a moment, unless the visitor is already exploring
    demo = setTimeout(() => {
      if (awake || leaving || SM.quiet()) return;
      const bm = SM.bitmap(doors[0]);
      bm.wakeUp(360).then(() => setTimeout(() => !doors[0]._on && !leaving && bm.sleep(300), 760));
    }, 1300);
  };
  const setRisen = (r) => {
    if (r === risen) return;
    risen = r;
    hero.classList.toggle("risen", r);
    hero.dataset.hint = r ? hint.rest : hint.rising;
    if (SM.stop === hero) SM.say();
    if (r) enterDoors();
  };
  const rise = () => {
    rq = 0;
    if (!rising) return;
    // data-rise-at: screens of scroll before the rise begins (something may be cast first)
    // with the room before it (room-proto.js), the moon has already risen in the room's window and arrives in place,
    // so here it stays up and only the horizon, the lines, the name and the doors are drawn in
    const studied = document.documentElement.classList.contains("has-study");
    // the moon's stop sits in the page's flow, so its place comes from the scroll and a measure kept between resizes
    const p = Math.min(1, Math.max(0, -SM.where(hero).top / SM.vh - (+hero.dataset.riseAt || 0))), m = studied ? 1 : 1 - (1 - p) * (1 - p), U = SM.u();
    moonEl.style.transform = `translateY(${((1 - m) * 34 * U).toFixed(1)}px)`;
    horizon.style.transform = `translateY(${(p * 14 * U).toFixed(1)}px)`;
    prelude.style.transform = `translateY(${(-p * 9 * U).toFixed(1)}px)`;
    prelude.style.opacity = Math.max(0, 1 - p * 2.4).toFixed(3);
    // the chart lines, then the name, then the doors one after another, each drawn in by the scroll
    board.style.setProperty("--rp", p.toFixed(3));
    doors.forEach((d, i) => SM.bitmap(d).setShow(Math.min(1, Math.max(0, (p - 0.58 - i * 0.035) / 0.2))));
    setRisen(p > 0.86);
  };
  const setRising = () => {
    rising = !SM.quiet() && !COLUMN.matches;
    hero.classList.toggle("rising", rising);
    if (rising && !risen) { hero.dataset.hint = hint.rising; if (SM.stop === hero) SM.say(); }
    if (!rising) { moonEl.style.transform = horizon.style.transform = prelude.style.transform = prelude.style.opacity = ""; board.style.removeProperty("--rp"); setRisen(true); doors.forEach((d) => SM.bitmap(d).to("show", 1, 0)); }
    else rise();
  };
  SM.scrub(rise);
  COLUMN.addEventListener?.("change", setRising);
  $("#quiet")?.addEventListener("click", setRising);
  setRising();

  /* entrance, once: the moon is drawn in under the horizon, then the ornaments; the rest waits for the moon to be up */
  const begin = async () => {
    await Promise.race([Promise.all(bms.map((b) => b.load().catch(() => {}))), new Promise((r) => setTimeout(r, 1800))]);
    moon.to("show", 1, 560);
    $$(".orn", board).forEach((o, i) => SM.bitmap(o).to("show", 1, 300, 420 + i * 60));
    if (!rising) enterDoors(); else { board.classList.add("in"); rise(); }
  };
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", begin) : begin();

  /* ================================================================ I Brands */
  const grid = $("#brandGrid");
  if (grid && typeof DATA !== "undefined") {
    grid.innerHTML = DATA.brands.map((b, i) => {
      const [src, , w, h] = b.imgs[0];
      return `<a class="tile" href="brand.html?b=${b.slug}" data-line="${esc(b.tag)}">
        <span class="pic box" data-kind="photo" style="--ink:${b.ink};--ground:${b.ground}"><img class="full" src="${src}" width="${w}" height="${h}" alt="" loading="lazy"></span>
        <span class="label"><i>${String(i + 1).padStart(2, "0")}</i>${esc(b.name)}</span></a>`;
    }).join("");
    SM.pictures(grid);
    $$(".tile", grid).forEach((t) => SM.wakeable(t));
  }
})();
