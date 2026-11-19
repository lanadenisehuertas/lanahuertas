/* Prototype: the study. The page opens in a witch's study at night, drawn in the site's lilac 1-bit: an arched window
   with the sleeping moon, shelves, candles, and Peanut asleep on the sill. The light (the pointer, or the moon through
   the window) wakes the room into colour where it falls. Scrolling is one continuous camera move:
     1. the room, with the name and the role;
     2. the camera tilts down, the wall slides up and away, the floor comes up in perspective and the spell draws itself
        on the boards, its words written under it;
     3. looking straight down, the finished circle glows and the boards inside it dissolve, pixel by pixel, onto stars;
     4. the fall: through the hole, the circle's rings come apart in layers and rush past, stars streak;
     5. the last ring lands where the board's own circle is, the night of the stage thins, and the moon's board is there
        under it, with the spell cast; from there spell-proto.js breaks it into the six doors.
   Everything is exactly as far along as the scroll. Quiet mode and reduced motion skip the study. */
(() => {
  const { $ } = SM;
  const hero = $("#moon"), board = $("#board");
  if (!hero || !board || !SM.spell) return;
  const root = document.documentElement;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (a, b, v) => clamp((v - a) / (b - a));
  const sm = (a, b, v) => SM.smooth(lin(a, b, v));
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const B8 = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };

  /* the beats, in screens of scroll through the study (SPAN is how long the stage holds) */
  const SPAN = 3.4;
  const TILT = [0.3, 1.5], DRAW = [0.5, 1.6], OPEN = [1.55, 2.0], FALL = [2.0, 2.7], THIN = [SPAN - 0.85, SPAN - 0.1];

  root.classList.add("has-study");
  const sec = document.createElement("section");
  sec.className = "study"; sec.setAttribute("aria-hidden", "true");
  sec.innerHTML = `<div class="st-stage">
    <div class="st-night"></div>
    <div class="st-world">
      <div class="st-wall">
        <span class="pic box st-room" data-kind="photo" data-enter="manual" data-still><img class="full" src="art/study-room.webp" width="1440" height="810" alt=""></span>
        <div class="st-vig"></div>
        <div class="st-words"><p class="st-name display">Lana Huertas</p><p class="st-role">UI/UX and graphic designer in Manila</p></div>
      </div>
      <div class="st-floor"><img src="art/study-floor.webp" width="400" height="400" alt="" decoding="async"><i class="st-glow"></i><canvas></canvas></div>
    </div>
    <div class="st-tunnel"><canvas></canvas><canvas></canvas><canvas></canvas><canvas class="st-last"></canvas></div>
    <canvas class="st-streak"></canvas>
    <p class="incant st-incant"></p>
  </div>`;
  ($(".cast-ph") || hero).before(sec);
  const stage = $(".st-stage", sec), night = $(".st-night", sec), wall = $(".st-wall", sec), words = $(".st-words", sec);
  const floor = $(".st-floor", sec), fcv = $("canvas", floor), fctx = fcv.getContext("2d"), glow = $(".st-glow", floor);
  const layers = [...sec.querySelectorAll(".st-tunnel canvas")], last = layers[3];
  const streak = $(".st-streak", sec), sctx = streak.getContext("2d");
  const write = SM.spell.incantation($(".st-incant", sec), SM.spell.words), incant = $(".st-incant", sec);

  /* the room: a bitmap that wakes where the light falls. The light rests on the window and the cat; a pointer carries it */
  const roomPic = $(".st-room", sec);
  roomPic.dataset.cell = SM.COLUMN.matches ? "3" : "1.1";
  const [room] = SM.pictures(sec);
  room.load().then(() => { room.setShow(1); light(); }).catch(() => {});
  let ptr = null;
  // the window and Peanut, in the picture's own pixels (1440 x 810), and the light's radius there
  const SILL = [720, 300], GLEAM = 250;
  const light = () => {
    if (!room.image) return;
    const W = roomPic.clientWidth, H = roomPic.clientHeight, k = Math.max(W / 1440, H / 810);
    const ox = (W - 1440 * k) * 0.5, oy = (H - 810 * k) * 0.3, cw = W / room.cols;
    const [x, y, r] = ptr ? [ptr[0], ptr[1], SM.u() * 11] : [ox + SILL[0] * k, oy + SILL[1] * k, GLEAM * k];
    room.lx = x / cw; room.ly = y / cw; room.lr = r / cw;
    room.draw();
  };
  if (SM.HOVER) {
    let q = 0;
    addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || still() || !sec.offsetHeight) return;
      const r = roomPic.getBoundingClientRect();
      if (r.bottom < 0) { if (ptr) { ptr = null; light(); } return; }
      ptr = [e.clientX - r.left, e.clientY - r.top];
      if (!q) q = requestAnimationFrame(() => { q = 0; light(); });
    }, { passive: true });
    document.addEventListener("pointerleave", () => { ptr = null; light(); });
  }

  /* sizes: the floor is a square plane whose circle, seen from straight above, is about the size of the board's */
  let S = 0, N = 300, R = 100, lastKey = "", holeAt = -1;
  const hole = document.createElement("canvas"), hctx = hole.getContext("2d");
  const size = () => {
    const W = innerWidth, H = innerHeight, U = SM.u();
    const target = SM.COLUMN.matches ? Math.min(W * 0.42, H * 0.3) : 28 * U;   // the circle's radius on arrival, px
    S = Math.round(target * 3);
    floor.style.width = floor.style.height = S + "px";
    floor.style.margin = `${-S / 2}px 0 0 ${-S / 2}px`;
    fcv.width = fcv.height = N; hole.width = hole.height = N;
    const cell = Math.max(2, Math.round(Math.min(W, H) / 220));
    streak.width = Math.ceil(W / cell); streak.height = Math.ceil(H / cell);
    streak.style.width = streak.width * cell + "px"; streak.style.height = streak.height * cell + "px";
    // the tunnel's rings: the finished spell, drawn once, at four depths
    const g = { cx: N / 2, cy: N / 2, R, targets: null };
    layers.forEach((c) => { c.width = c.height = N; SM.spell.cast(c.getContext("2d"), N, N, g, 1, 0, null); c.style.width = c.style.height = S + "px"; c.style.margin = `${-S / 2}px 0 0 ${-S / 2}px`; });
    // the last ring lands where the board's own circle is drawn (the board is centred in its screen)
    if (SM.COLUMN.matches) last.dataset.at = `${W / 2},${H * 0.5}`;
    else last.dataset.at = `${W / 2},${(H - 62.5 * U) / 2 + 28.8 * U}`;
    lastKey = ""; holeAt = -1;
  };

  /** the boards inside the circle go, cell by cell in the Bayer order, from the middle out; stars show through */
  const openHole = (d) => {
    d = Math.round(d * 64) / 64;
    if (d === holeAt) return;
    holeAt = d;
    const img = hctx.createImageData(N, N), px = img.data, c = N / 2, rh = R * 0.97;
    if (d > 0) for (let y = Math.floor(c - rh); y <= c + rh; y++) for (let x = Math.floor(c - rh); x <= c + rh; x++) {
      const r = Math.hypot(x + 0.5 - c, y + 0.5 - c) / rh;
      if (r >= 1) continue;
      const t = (B8[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
      if (t >= clamp(d * 1.6 - r * 0.9)) continue;
      const j = (y * N + x) * 4, h = hash(x, y);
      if (h > 0.985) { px[j] = 233; px[j + 1] = 225; px[j + 2] = 255; }
      else if (h > 0.97) { px[j] = 120; px[j + 1] = 96; px[j + 2] = 200; }
      px[j + 3] = 255;
    }
    hctx.putImageData(img, 0, 0);
  };

  /* the streaks of the fall: stars at depths, rushing out from the middle */
  const STARS = Array.from({ length: 150 }, (_, i) => ({ a: hash(i, 7) * Math.PI * 2, z: hash(i, 19), w: hash(i, 31) > 0.7 }));
  const streaks = (q) => {
    const w = streak.width, h = streak.height, cx = w / 2, cy = h / 2, D = Math.hypot(cx, cy);
    sctx.clearRect(0, 0, w, h);
    if (q <= 0 || q >= 1) return;
    const v = Math.sin(Math.PI * q);   // speed: from rest, fastest in the middle of the fall, slowing to arrive
    STARS.forEach((s) => {
      const z = (s.z + q * 2.2) % 1, r0 = D * 0.04 / (1.04 - z), r1 = r0 * (1 + 0.5 * v * z);
      const c = Math.cos(s.a), si = Math.sin(s.a), n = Math.max(1, Math.round(r1 - r0));
      sctx.fillStyle = s.w ? "#e9e1ff" : "#b9a2ff";
      for (let i = 0; i <= n; i += 1) { const r = r0 + ((r1 - r0) * i) / n; sctx.fillRect(Math.round(cx + c * r), Math.round(cy + si * r), 1, 1); }
    });
  };

  const hint = { room: "Scroll to cast the spell.", draw: "Scroll: the spell draws itself on the floor.", open: "Keep scrolling: the circle opens." };
  const run = () => {
    if (still() || !sec.offsetHeight) {
      // the study has gone (quiet mode): give the foot and the moon their own words back
      if (spoke) { spoke = false; document.body.classList.remove("in-room"); hero.dataset.hint = REST; SM.say(); }
      return;
    }
    spoke = true;
    if (!S) size();
    const t = -sec.getBoundingClientRect().top / innerHeight;
    if (t < -1 || t > SPAN + 0.2) { stage.style.visibility = t > SPAN ? "hidden" : ""; return; }
    const H = innerHeight, k = sm(TILT[0], TILT[1], t), s = lin(DRAW[0], DRAW[1], t), d = lin(OPEN[0], OPEN[1], t);
    const q = lin(FALL[0], FALL[1], t), qq = q * q, f = sm(THIN[0], THIN[1], t);
    stage.style.visibility = f >= 1 ? "hidden" : "";
    // 1, 2: the room leans in a little, then the wall slides up and away as the camera tilts down
    wall.style.transform = `translate3d(0, ${(-k * 0.7 * H).toFixed(1)}px, 0) scale(${(1 + 0.05 * sm(0, 0.6, t)).toFixed(4)})`;
    wall.style.visibility = k >= 1 ? "hidden" : "";
    const wq = sm(0.1, 0.45, t);
    words.style.opacity = (1 - wq).toFixed(3);
    words.style.transform = `translate3d(0, ${(-wq * 4 * SM.u()).toFixed(1)}px, 0)`;
    // the floor comes up from edge-on to flat under the eye, then falls past
    const A = 82 * (1 - k), Y = (1 - k) * 0.62 * H, Z = 1 + 5.5 * qq;
    floor.style.transform = `translate3d(0, ${Y.toFixed(1)}px, 0) rotateX(${A.toFixed(2)}deg) scale(${Z.toFixed(3)})`;
    floor.style.opacity = (sm(0, 0.3, k) * (1 - sm(0.4, 0.8, q))).toFixed(3);
    glow.style.opacity = (sm(0.5, 1, s) * (1 - sm(0.2, 0.9, q))).toFixed(3);
    // 2, 3: the spell on the boards, and the hole it opens
    const key = `${s.toFixed(4)}|${d.toFixed(3)}`;
    if (key !== lastKey) {
      lastKey = key;
      SM.spell.cast(fctx, N, N, { cx: N / 2, cy: N / 2, R, targets: null }, s, 0, null);
      if (d > 0) { openHole(d); fctx.globalCompositeOperation = "destination-over"; fctx.drawImage(hole, 0, 0); fctx.globalCompositeOperation = "source-over"; }
    }
    write(lin(0.16, 0.72, s));
    incant.style.opacity = (sm(0, 0.05, s) * (1 - sm(0, 0.25, q))).toFixed(3);
    // 4: the rings come apart in layers and rush past; the last one slows and lands on the board's circle
    layers.forEach((c, i) => {
      if (c === last) return;
      const z = clamp(q * 1.5 - i * 0.22);
      c.style.opacity = (sm(0, 0.12, z) * (1 - sm(0.55, 0.95, z)) * 0.8).toFixed(3);
      c.style.transform = `scale(${(0.12 + z * z * 4).toFixed(3)}) rotate(${(i * 24 + q * 50).toFixed(1)}deg)`;
    });
    const [lx, ly] = last.dataset.at.split(",").map(Number), z = SM.smooth(lin(0.35, 1, q));
    last.style.opacity = (sm(0.35, 0.5, q) * (1 - sm(0.4, 0.9, f))).toFixed(3);
    last.style.transform = `translate3d(${(lx - innerWidth / 2).toFixed(1)}px, ${(ly - H / 2).toFixed(1)}px, 0) scale(${(0.08 + 0.92 * z).toFixed(4)}) rotate(${((1 - z) * -70).toFixed(1)}deg)`;
    streaks(q);
    streak.style.opacity = (1 - f).toFixed(3);
    // 5: the stage's night thins, and the board is there under it
    night.style.opacity = (1 - f).toFixed(3);
    // the foot says what the scroll will do next; the masthead's role line waits while the room says it
    const h = t < DRAW[0] ? hint.room : t < OPEN[0] ? hint.draw : hint.open;
    if (t < THIN[0]) { if (hero.dataset.hint !== h) hero.dataset.hint = h; if (liveEl && liveEl.textContent !== h) liveEl.textContent = h; }
    document.body.classList.toggle("in-room", t < 0.45);
  };
  const liveEl = $("#live"), REST = liveEl ? liveEl.textContent : hero.dataset.hint;
  let spoke = false;
  SM.scrub(run);
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { roomPic.dataset.cell = SM.COLUMN.matches ? "3" : "1.1"; S = 0; run(); setTimeout(light, 200); }, 160); });

  /* the masthead shows the six stops once the moon's stop has gone by; the study sits before it, so measure from the moon */
  const past = () => document.body.classList.toggle("past", scrollY > hero.offsetTop + hero.offsetHeight - innerHeight * 0.5);
  addEventListener("scroll", past, { passive: true });
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", past) : past();
})();
