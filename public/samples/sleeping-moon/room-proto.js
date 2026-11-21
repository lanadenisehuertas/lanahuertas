/* Prototype: the room. The page opens inside a quiet study at night, built as a real 3D room (CSS 3D planes and
   standing pictures in one perspective). Everything but the work is drawn in line: the walls, floor and ceiling are black
   planes with a few engraved lilac lines, the desk and the side table are line drawings, and the window is the one
   picture beside the work. The six things of the work (the cards and the phone on the desk, the projector on the
   table, the easel on the floor, the mirror on the wall, the letter on the sill) are the only bitmaps: asleep in lilac,
   and woken into colour for good by the pointer or a tap.
   One story, scrubbed by the scroll:
     the camera drifts a short way toward the window and a little to the side, just enough for the near things to slide
     past the far ones and show the room's depth (the pointer moves it a touch the same way); the room says only what
     Lana does, because the moon's stop owns the name;
     the room dims and the six rise, each waking as it lifts, and fly on clean arcs to the points of the spell in front
     of the window, blurred by their own speed, each blooming with light as it arrives; the star draws itself from the
     first arrival to the last and glows;
     the moon rises in the window's empty glass as the camera pushes on; the circle flies out through the window in a
     flash of moonlight, and the camera follows it between the stone mullions, so the circle closes round the risen moon;
     it lands exactly on the moon's board's own circle, where the six dissolve into the light of its points
     as the night thins to show the board (spell-proto.js takes over from there).
   The camera follows the scroll on a spring, so it has weight but settles exactly where the scroll says, and everything
   reverses when you scroll back. Quiet mode (the visitor's own switch) skips the room; the system's reduced-motion
   setting does not, since the room moves only as the visitor scrolls it. */
(() => {
  const { $, $$ } = SM;
  const hero = $("#moon"), board = $("#board");
  if (!hero || !board || !SM.spell) { document.documentElement.classList.remove("has-study"); $(".room-intro")?.remove(); return; }
  const root = document.documentElement;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lin = (a, b, v) => clamp((v - a) / (b - a));
  const sm = (a, b, v) => SM.smooth(lin(a, b, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  const out3 = (x) => 1 - (1 - x) ** 3;
  const bell = (x) => (x > 0 && x < 1 ? Math.sin(Math.PI * x) : 0);
  const still = () => SM.quiet();   // only the visitor's own quiet switch stills the page, never the system setting (moon.js)

  /* the beats, in screens of scroll through the room (the stage holds for SPAN screens) */
  const SPAN = 5;
  /* paced so that each beat takes 0.8 to 1 screen of scroll once warped, as the rest of the page does: the opening, the
     six rising and flying, the star drawn, the push to the window, the landing */
  const BEAT = { cout: [4.0, 4.3], mout: [4.2, 4.5], rise: [1.2, 2.23], name: [0.8, 1.15], lift: 1.85, stagger: 0.1, fly: 0.55, draw: [2.32, 2.98], push: [2.98, 3.82], land: [3.82, 4.65] };
  let P = 2400;   // the perspective: how far the eye stands in front of the screen, in room units (a long lens, so
                    // the side walls are short and the room reads as a room, not a corridor)

  /* the pictures: [width, height] of each file */
  const IMG = { window: [520, 863], "desk-line": [820, 677], "table-line": [500, 625],
    brands: [520, 336], posters: [267, 520], films: [520, 473], products: [264, 520], about: [396, 520], contact: [520, 434] };
  const SIX = ["brands", "posters", "films", "products", "about", "contact"];
  const SRC = (k) => (SIX.includes(k) ? `art/c_${k}.webp` : `art/room/${k}.webp`);
  const DOORMAP = [4, 3, 2, 5, 0, 1];   // door k is born from the star's point j, as in spell-proto.js
  /* what Lana does, in the room's two lines. It sleeps like everything else, in a 1-bit cut of the type (the finer of
     the two, so every word reads from the first frame), and wakes letter by letter into the smooth italic as the scroll
     carries the light along it (WAKE, in beats): a hard front with a row of loose letters just ahead of it, which have
     caught the light but not yet woken. The light has already reached its first words when the page opens, so a visitor
     who never scrolls still sees what the scroll will do */
  const ROLE = ["UI/UX and graphic design, film and code,", "made in Manila by moonlight."];
  const WAKE = [-0.2, 0.6], LOOSE = 3;

  /* two rooms: a wide one for screens and a tall one for phones. The view is a box of view.w x view.h scaled to fit the
     screen; the room is box.w wide and box.h tall with the floor at +box.h/2, its back wall at z = box.back, and its floor
     running forward to z = box.front. Pieces stand with their bottom centre at (x, by, z), or on another piece's top
     ([that piece, fraction of its height from its top]).
     The room is laid out like the spell it becomes: each of the six stands on the side of the room where its point of
     the star is, so they all rise outward and up to their points without crossing. On the left, the round table with the
     projector (Films, low left) in front and the easel (Posters, high left) further back; on the right, the desk with the
     packets (Brands, the top point) and the phone (Products, high right), and the mirror hung on the wall above it
     (About, low right); the letter rests on the window's sill (Contact, the bottom point). Every piece keeps well inside
     the walls, so no wall ever cuts one, and inside the frame for the whole of the camera's drift. */
  const SETS = {
    wide: {
      view: { w: 1440, h: 810 }, box: { w: 1400, h: 800, back: -1000, front: 600 },
      name: { top: 618, role: 30 },
      // the camera's drift: from the first view to the last before the push, a short way in and a little to the left,
      // on a straight line (a sideways step, not a turn, so the near pieces slide past the far wall and show the depth)
      cams: [{ x: 40, y: -40, z: 120, pitch: -3.5 }, { x: 0, y: -46, z: -240, pitch: -3 }],
      ring: { x: 0, y: -60, z: -560, r: 260, out: -2200 },
      items: [
        // the window sits a little low on its wall, so the tip of its arch clears the masthead on a 16:9 screen
        ["window", "window", 370, 0, 272, -992],
        ["about", "about", 150, 350, -30, -982],
        ["contact", "contact", 104, -50, 268, -975],
        ["posters", "posters", 180, -205, 400, -720],
        ["table", "table-line", 270, -395, 400, -380], ["films", "films", 200, -402, ["table", 0.16], -376],
        ["desk", "desk-line", 350, 355, 400, -380], ["brands", "brands", 170, 320, ["desk", 0.2], -376], ["products", "products", 58, 478, ["desk", 0.2], -376],
      ],
    },
    tall: {
      // a phone's tall view is filled by a shorter lens: with the wide room's long one the room would sit small in it
      lens: 1300,
      view: { w: 720, h: 1280 }, box: { w: 900, h: 1200, back: -1000, front: 700 },
      name: { top: 150, role: 36 },
      cams: [{ x: 0, y: 40, z: 150, pitch: -3 }, { x: 40, y: 48, z: -220, pitch: -2.5 }],
      ring: { x: 40, y: 50, z: -560, r: 200, out: -2200 },
      // the moon's stop comes up from below on phones and reaches the top at 5 screens: the circle and the moon land at
      // the moon's resting place first, then the night opens over the last tenth of a screen as the stop arrives under
      // them, and they hand over to its own moon in the same place
      beat: { push: [2.98, 3.95], land: [3.95, 4.85], night: [4.88, 4.99], cout: [4.88, 4.98], mout: [4.9, 4.99] },
      items: [
        ["window", "window", 290, 40, 300, -992],
        ["about", "about", 150, 270, 20, -982],
        ["contact", "contact", 96, 0, 296, -975],
        ["posters", "posters", 120, -100, 600, -780],
        ["table", "table-line", 220, -180, 600, -470], ["films", "films", 160, -186, ["table", 0.16], -466],
        ["desk", "desk-line", 280, 215, 600, -470], ["brands", "brands", 136, 180, ["desk", 0.2], -466], ["products", "products", 48, 300, ["desk", 0.2], -466],
      ],
    },
  };

  /* ------------------------------------------------------------------ the engraved planes: few lines, drawn as SVG */
  const INK = "#b9a2ff", DIM = "#5a4a99";
  // the room's surfaces are night, not nothing: the back wall a little lighter than the side walls, the floor and the
  // ceiling darkest, so the room has volume before a single line is drawn
  const WALL = "#0d0a24", SIDE = "#08061a", FLOOR = "#060414", CEIL = "#040310";
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${body}</svg>`;
  /** one rail and a crown moulding along a wall w wide and h tall, dotted like the rules of the moon's board, so the room is drawn
      in the same hand as the page it flies to */
  const rail = (w, h) => `<path d="M0 ${h * 0.74}H${w}M0 18H${w}" stroke="${DIM}" stroke-width="4" stroke-dasharray="4 12" fill="none"/>`;
  const planes = (set) => {
    const { w, h, back, front } = set.box, d = front - back, win = set.items.find((i) => i[0] === "window");
    const ww = win[2], wh = (ww * IMG.window[1]) / IMG.window[0], wx = win[3] + w / 2, wTop = win[4] - wh + h / 2;
    // the hole the window fills: a pointed arch a little inside its stone frame, so the frame always hides its edge and
    // what flies out through the glass is never cut by a square corner
    const hx0 = wx - ww * 0.34, hx1 = wx + ww * 0.34, hy1 = wTop + wh * 0.87, ys = wTop + wh * 0.36, ya = wTop + wh * 0.08;
    const ya2 = ys - (ys - ya) * 0.55;
    const hole = `M${hx0} ${hy1}V${ys}Q${hx0} ${ya2} ${wx} ${ya}Q${hx1} ${ya2} ${hx1} ${ys}V${hy1}z`;
    const edge = (p) => `<path d="${p}" stroke="${INK}" stroke-width="3" fill="none"/>`;
    // the back wall's black is a plane of its own that never dims with the room's lines: the moon rising behind it must
    // only ever be seen through the window's glass
    const backFill = svg(w, h, `<path fill-rule="evenodd" fill="${WALL}" d="M0 0H${w}V${h}H0z ${hole}"/>`);
    // panels under the rail (none behind the window), and curtains hung from a rod above it, tied back at the sill
    const wx0 = wx - ww * 0.62, wx1 = wx + ww * 0.62, rodY = wTop - 34, sill = wTop + wh * 0.9;
    let panels = "";
    for (let x = 40; x + 150 <= w - 40; x += 190) {
      if (x + 150 > wx0 - 20 && x < wx1 + 20) continue;
      panels += `<rect x="${x}" y="${h * 0.74 + 30}" width="150" height="${h * 0.26 - 64}" rx="6"/>`;
    }
    const drape = (s) => {
      const x0 = wx + s * ww * 0.7, xr = wx + s * ww * 0.36, xt = wx + s * ww * 0.62, tie = sill - 40;
      const out = `M${x0} ${rodY}C${x0 + s * 30} ${rodY + 200} ${xr} ${tie - 120} ${xr + s * 18} ${tie}C${xr + s * 40} ${tie + 70} ${x0 - s * 10} ${tie + 160} ${x0 + s * 30} ${h * 0.97}`;
      const back = `M${x0 + s * 70} ${rodY}V${h * 0.97}`;
      const folds = [0.25, 0.5, 0.75].map((f) => { const xf = x0 + s * 70 * f; return `M${xf} ${rodY + 10}C${xf - s * 10} ${tie - 60} ${xr + s * (20 + 40 * f)} ${tie} ${xf + s * 20} ${h * 0.95}`; }).join("");
      return { line: out + back, folds, tieback: `M${xr + s * 6} ${tie - 6}q${s * 28} 10 ${s * 54} 0` };
    };
    const L = drape(-1), R = drape(1);
    // the rod stays on the wall; each curtain hangs from it on a plane of its own, which sways a little in the night air
    // (room-proto.css), pivoting where it meets the rod
    const curtains = `<path d="M${wx0 - 60} ${rodY}H${wx1 + 60}" stroke="${INK}" stroke-width="5"/>` +
      `<circle cx="${wx0 - 66}" cy="${rodY}" r="9" fill="${INK}"/><circle cx="${wx1 + 66}" cy="${rodY}" r="9" fill="${INK}"/>`;
    const hang = (c, sgn) => {
      const x0 = sgn < 0 ? wx - ww * 0.7 - 110 : wx + ww * 0.24, bw = ww * 0.46 + 110, bh = h - rodY + 4;
      const body = `<path d="${c.line}" stroke="${INK}" stroke-width="3" fill="none"/><path d="${c.folds}" stroke="${DIM}" stroke-width="3" stroke-dasharray="4 10" fill="none"/>` +
        `<path d="${c.tieback}" stroke="${INK}" stroke-width="4" fill="none"/>`;
      const pivot = sgn < 0 ? bw - 40 : 40;
      return `<div class="rm-pl rm-lines" style="transform:translate3d(${(x0 - w / 2).toFixed(1)}px,${(rodY - h / 2).toFixed(1)}px,${back + 1}px)">` +
        `<svg class="rm-drape${sgn < 0 ? "" : " rm-drape-r"}" viewBox="${x0.toFixed(1)} ${rodY} ${bw.toFixed(1)} ${bh}" width="${bw.toFixed(1)}" height="${bh}" style="transform-origin:${pivot.toFixed(0)}px 0" aria-hidden="true">${body}</svg></div>`;
    };
    // the window's night: a pane just behind the glass with its own sky, so the window is never a dead black hole.
    // Stars twinkle, thin clouds drift across, now and then a star falls, and a haze of moonlight breathes low in the
    // glass. Two of the stars keep the board's bitmap, as tiny square crosses. All of it fades as the moon rises.
    // the pane is exactly the hole's box and sits just behind the wall, so the window's stone frame, drawn in front,
    // covers everything of it but the glass
    const gw = hx1 - hx0, gh = hy1 - ya, gx = hx0, gy = ya;
    let gs = 3, glass = "";
    const grnd = () => ((gs = (gs * 16807) % 2147483647) - 1) / 2147483646;
    // the stars twinkle in three groups, each group one layer that breathes at its own pace, rather than each star an
    // animation of its own, which the browser would have to restyle on every frame the page moves
    const tw = ["", "", ""];
    for (let i = 0; i < 26; i++) {
      const x = (8 + grnd() * 84).toFixed(1), y = (4 + grnd() * 80).toFixed(1), d = (2.5 + grnd() * 3).toFixed(1);
      const px = i === 7 || i === 18 ? " rm-px" : "", gold = grnd() < 0.2 ? " rm-gold" : "";
      grnd(); grnd();   // the twinkle's pace and phase, once per star: kept so the clouds after keep their places
      tw[i % 3] += `<i class="rm-st${px}${gold}" style="left:${x}%;top:${y}%;--d:${d}px"></i>`;
    }
    glass += tw.map((g, k) => `<span class="rm-tw rm-tw-${k}">${g}</span>`).join("");
    glass += [[18, 46, 0.62], [42, 61, 0.8], [66, 38, 0.5]].map(([top, dur, sc], k) =>
      `<b class="rm-cloud" style="top:${top}%;--cw:${(gw * sc).toFixed(0)}px;--gw:${gw.toFixed(0)}px;--t:${dur}s;--w:${(-dur * (0.2 + k * 0.3)).toFixed(1)}s"></b>`).join("");
    glass += `<b class="rm-fall"></b><b class="rm-haze"></b>`;
    const pane = `<div class="rm-glass" style="width:${gw.toFixed(0)}px;height:${gh.toFixed(0)}px;transform:translate3d(${(gx - w / 2).toFixed(1)}px,${(gy - h / 2).toFixed(1)}px,${back - 2}px)">${glass}</div>`;
    // motes of dust drifting slowly in the light from the window, between it and the eye
    let dust = "";
    for (let i = 0; i < 16; i++) {
      dust += `<i style="left:${(grnd() * 100).toFixed(1)}%;top:${(20 + grnd() * 75).toFixed(1)}%;--d:${(2.5 + grnd() * 2.5).toFixed(1)}px;--t:${(11 + grnd() * 9).toFixed(1)}s;--w:${(-grnd() * 20).toFixed(1)}s;--x:${((grnd() - 0.5) * 60).toFixed(0)}px"></i>`;
    }
    const motes = `<div class="rm-dust" style="width:${(ww * 1.5).toFixed(0)}px;height:${(h * 0.75).toFixed(0)}px;transform:translate3d(${(wx - ww * 0.75 - w / 2).toFixed(1)}px,${(-h * 0.3).toFixed(1)}px,${back + 380}px)">${dust}</div>`;
    // no stars on the wall itself: the night is only ever seen through the window's glass
    const backWall = svg(w, h, rail(w, h) + `<g stroke="${DIM}" stroke-width="3" stroke-dasharray="4 10" fill="none">${panels}</g>` + curtains + `<rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" stroke="${INK}" stroke-width="3" fill="none"/>`);
    const side = svg(d, h, `<rect width="${d}" height="${h}" fill="${SIDE}"/>${rail(d, h)}${edge(`M${d - 1.5} 0V${h}`)}`);
    // the floor: a few boards running away toward the window
    // the boards are laid across the room, parallel to the back wall, so the floor recedes in steps instead of running
    // to one vanishing point down the middle
    let boards = ""; for (let y = 120; y < d; y += 120) boards += `M0 ${y}H${w}`;
    // a round rug before the window, ringed and fringed in the board's dotted hand
    const ry = front - (back + 520), rug = `<g fill="none"><ellipse cx="${w / 2}" cy="${ry}" rx="430" ry="250" fill="${FLOOR}" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="${w / 2}" cy="${ry}" rx="380" ry="205" stroke="${DIM}" stroke-width="3" stroke-dasharray="4 10"/>` +
      `<ellipse cx="${w / 2}" cy="${ry}" rx="452" ry="272" stroke="${DIM}" stroke-width="6" stroke-dasharray="2 9"/></g>`;
    const floor = svg(w, d, `<rect width="${w}" height="${d}" fill="${FLOOR}"/><path d="${boards}" stroke="${DIM}" stroke-width="4" stroke-dasharray="4 12" fill="none"/>${rug}${edge(`M0 ${d - 1.5}H${w}`)}`);
    const ceil = svg(w, d, `<rect width="${w}" height="${d}" fill="${CEIL}"/>`);
    // a plane with a tone of its own dims its lines under a shade of that same tone (a layer whose opacity alone changes,
    // so dimming never repaints the drawing); the back wall's lines have no fill of their own and simply fade
    const at = (tf, html, tone) => `<div class="rm-pl${tone ? "" : " rm-lines"}" style="transform:${tf}">${html}${tone ? `<i class="rm-shade" style="background:${tone}"></i>` : ""}</div>`;
    // the floor and the ceiling are laid down from the front edge backwards; the side walls stand from the front edge back
    return pane + `<div class="rm-pl rm-mask" style="transform:translate3d(${-w / 2}px,${-h / 2}px,${back - 1}px)">${backFill}</div>` +
      at(`translate3d(${-w / 2}px,${-h / 2}px,${back}px)`, backWall) + hang(L, -1) + hang(R, 1) + motes +
      at(`translate3d(${-w / 2}px,${h / 2}px,${front}px) rotateX(-90deg)`, floor, FLOOR) +
      `<div class="rm-beam" style="transform:translate3d(${-w / 2}px,${h / 2 - 1}px,${front}px) rotateX(-90deg)">${svg(w, d,
        `<defs><linearGradient id="rmb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d9ccff" stop-opacity="0.34"/><stop offset="1" stop-color="#b9a2ff" stop-opacity="0"/></linearGradient></defs>` +
        `<path d="M${wx - ww * 0.3} ${d}L${wx + ww * 0.3} ${d}L${wx + ww * 0.95} ${d - 1250}L${wx - ww * 0.95} ${d - 1250}z" fill="url(#rmb)"/>`)}</div>` +
      at(`translate3d(${-w / 2}px,${-h / 2}px,${front}px) rotateX(-90deg)`, ceil, CEIL) +
      at(`translate3d(${-w / 2}px,${-h / 2}px,${front}px) rotateY(90deg)`, side, SIDE) +
      at(`translate3d(${w / 2}px,${-h / 2}px,${front}px) rotateY(90deg)`, side, SIDE);
  };

  /* ------------------------------------------------------------------ building the room */
  root.classList.add("has-study");
  // the page holds the room's place from its first paint (magic-proto.html), so building it here shifts nothing
  let sec = $(".room-intro");
  if (!sec) { sec = document.createElement("section"); sec.className = "room-intro"; sec.setAttribute("aria-label", "Intro"); ($(".cast-ph") || hero).before(sec); }
  const host = document.createElement("div"); host.className = "rm-stage";
  sec.append(host);
  const liveEl = $("#live"), REST = liveEl ? liveEl.textContent : hero.dataset.hint;

  const N = 300, RC = 100;
  const awake = new Set();
  let glassEl = null, beam, set, B = BEAT, sky, moon, skip, view, world, words, night, circle, halo, flash, vig, blooms = [], cctx, els = {}, pos = {}, pics = [], built = "", lastSpell = -1;
  // the role's letters, and how far along them the light has come
  let roleCh = [], roleN = -1;
  // what dims with the room, each written on its own element (op, below) rather than through custom properties on the
  // world, which every one of its few hundred nodes would inherit and so be restyled for at every step of the scroll
  let fades = { near: [], lines: [], shades: [], room: [] };
  /* the echoes that trail each of the six as it flies: four fading copies of it a little further back along its path.
     They are drawn together on one flat canvas over the room, each at the place and size the camera sees that point of
     the path at (echoAt), instead of as two dozen pictures in the 3D world that the browser would restyle, sort and
     composite every frame. They are nearer the eye than the thing they trail, so over it is where the room had them. */
  let echo = null, echoG = null, echoW = 0, echoH = 0, echoK = 1, echoOn = false;
  const ECHO = [0.5, 0.32, 0.19, 0.09];
  /* the circle's motion blur: a softened copy of the finished drawing, made once (soften), which the frame fades in over
     the sharp one in step with the speed, instead of a blur filter on the moving circle, which the browser would have
     to work out again every frame */
  let soft = null, sharp = null, softFor = -1;
  const build = () => {
    const key = roomKey();
    if (built === key) return;
    // a phone on its side keeps the phone's page (the moon's stop in one column, so the phone's beats and landing), but
    // its screen is wide, so it is given the wide room, which fills it, rather than the tall one standing small in the middle
    built = key; set = SETS[key === "side" ? "wide" : key]; B = { ...BEAT, ...(key === "wide" ? {} : SETS.tall.beat) }; P = set.lens || 2400;
    const { w: vw, h: vh } = set.view, r = set.ring;
    pos = {};
    for (const [id, art, w, x, by, z] of set.items) {
      const h = (w * IMG[art][1]) / IMG[art][0];
      const bottom = Array.isArray(by) ? pos[by[0]].top + pos[by[0]].h * by[1] : by;
      pos[id] = { x, top: bottom - h, w, h, z, cy: bottom - h / 2, on: Array.isArray(by) ? by[0] : null };
    }
    const img = (art) => `<img class="full" src="${SRC(art)}" width="${IMG[art][0]}" height="${IMG[art][1]}" alt="">`;
    const piece = ([id, art, w]) => {
      const six = SIX.includes(id), line = art.endsWith("-line");
      // the desk is drawn as it is seen standing to the right of the eye, its left end showing; on the left of a room it
      // would be turned to face the other way
      const inner = line ? (id === "desk" && pos[id].x < 0 ? img(art).replace("<img ", '<img style="transform:scaleX(-1)" ') : img(art)) : `<span class="pic" data-kind="paint" data-enter="manual" data-still${six ? "" : ' data-lift="0.3"'}>${img(art)}</span>`;
      const nm = six ? `<span class="rm-nm">${id[0].toUpperCase() + id.slice(1)}</span>` : "";
      return `<div class="rm-it ${six ? "rm-six" : "rm-leaf rm-furn"}" data-id="${id}" style="width:${w}px;height:${pos[id].h.toFixed(1)}px">${inner}${nm}</div>`;
    };
    const bs = r.r * 0.8;
    host.innerHTML = `<div class="rm-view" aria-hidden="true" style="width:${vw}px;height:${vh}px;perspective:${P}px">
        <div class="rm-world">
          <div class="rm-sky"><canvas></canvas></div>
          <div class="rm-moon"><span class="pic moon" data-kind="moon" data-enter="manual" data-still><img class="full" src="art/moon-asleep.webp" width="640" height="640" alt=""></span></div>
          ${planes(set)}
          ${set.items.map(piece).join("")}
          <div class="rm-circle" style="width:${r.r * 3}px;height:${r.r * 3}px">
            <i class="rm-halo"></i><canvas class="rm-sharp"></canvas><canvas class="rm-soft"></canvas>
            ${SIX.map((_, k) => { const a = (DOORMAP[k] * Math.PI) / 3 + 0.5, x = r.r * 1.5 + Math.cos(a) * r.r * 0.84, y = r.r * 1.5 + Math.sin(a) * r.r * 0.84; return `<i class="rm-bloom" style="left:${(x - bs / 2).toFixed(1)}px;top:${(y - bs / 2).toFixed(1)}px;width:${bs}px;height:${bs}px"></i>`; }).join("")}
          </div>
        </div>
        <div class="rm-words" style="top:${set.name.top}px"><p class="rm-role" style="font-size:${set.name.role}px">${ROLE.map((l) => `<span class="rm-l">${l.split(" ").map((w) => `<span class="rm-w">${[...w].map((c) => `<span class="rm-c" data-c="${c}">${c}</span>`).join("")}</span>`).join(" ")}</span>`).join(" ")}</p><span class="pl-cue rm-cue"><i></i></span></div>
      </div>
      <canvas class="rm-echo" aria-hidden="true"></canvas>
      <i class="rm-vig" aria-hidden="true"></i><i class="rm-flash" aria-hidden="true"></i>
      <div class="rm-night" aria-hidden="true"></div>
      <a class="go rm-skip" href="#moon">Skip the intro</a>`;
    beam = $(".rm-beam", host);
    view = $(".rm-view", host); world = $(".rm-world", host); words = $(".rm-words", host); night = $(".rm-night", host);
    circle = $(".rm-circle", host); halo = $(".rm-halo", host); flash = $(".rm-flash", host); vig = $(".rm-vig", host);
    sky = $(".rm-sky", host); moon = $(".rm-moon", host); skip = $(".rm-skip", host); blooms = $$(".rm-bloom", host);
    sharp = $(".rm-sharp", circle); soft = $(".rm-soft", circle); cctx = SM.spell.hires(sharp, N, N, 3.5); lastSpell = -1; softFor = -1;
    echo = $(".rm-echo", host); echoG = echo.getContext("2d"); echoOn = false;
    glassEl = $(".rm-glass", host);
    roleCh = $$(".rm-c", host); roleN = -1;
    els = {}; $$(".rm-it", host).forEach((el) => (els[el.dataset.id] = el));
    // the planes: plain black ones go only as the eye reaches the back wall; drawn lines also dim with the room; a toned
    // plane keeps its black and dims its lines under a shade; the furniture and the dust dim with the room
    const pl = $$(".rm-pl", host);
    fades = {
      near: pl.filter((el) => !el.classList.contains("rm-lines")),
      lines: pl.filter((el) => el.classList.contains("rm-lines")),
      shades: $$(".rm-shade", host),
      room: [...$$(".rm-leaf", host).filter((el) => el.dataset.id !== "window"), $(".rm-dust", host)].filter(Boolean),
    };
    drawSky();
    for (const [id] of set.items) if (!SIX.includes(id)) place(els[id], pos[id], 0);
    pics = SM.pictures(host);
    loads = pics.map((b) => b.load().then(() => b.setShow(1)).catch(() => {}));
    awake.forEach((id) => SM.bitmap(els[id])?.wakeUp(0));
    SIX.forEach((id) => {
      els[id].addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch" && !still()) wake(id); });
      els[id].addEventListener("pointerdown", () => {
        if (still()) return;
        wake(id);
        // a tap shows the room's name for a moment, as pointing at it does
        els[id].classList.add("named"); clearTimeout(els[id]._nt); els[id]._nt = setTimeout(() => els[id].classList.remove("named"), 1800);
      });
    });
    fit();
  };
  const roomKey = () => (!SM.COLUMN.matches ? "wide" : SM.vw > SM.vh ? "side" : "tall");
  /** a standing picture at its place in the room, turned to face the camera */
  const place = (el, p, yaw) => { el.style.transform = `translate3d(${(p.x - p.w / 2).toFixed(1)}px,${p.top.toFixed(1)}px,${p.z}px) rotateY(${yaw.toFixed(2)}deg)`; };
  /** the night beyond the window: a far plane of sparse stars, kept as single pixels, the room's one wide bitmap. Its
      canvas is drawn at one pixel a cell and stretched five times by CSS (room-proto.css), unsmoothed */
  const drawSky = () => {
    const cv = $(".rm-sky canvas", host), g = cv.getContext("2d");
    cv.width = 1600; cv.height = 1000;
    let s = 5; const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 380; i++) {
      const x = Math.floor(rnd() * 1600), y = Math.floor(rnd() * 1000), b = rnd();
      g.fillStyle = b > 0.92 ? "#fff1c9" : INK;
      g.fillRect(x, y, 1, 1);
      if (b > 0.97) { g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
    }
  };

  /* ------------------------------------------------------------------ fitting the view to the screen; one size of cell */
  let kv = 1;
  const fit = () => {
    const { w: vw, h: vh } = set.view;
    kv = Math.min(SM.vw / vw, SM.vh / vh);
    view.style.transform = `translate(-50%,-50%) scale(${kv.toFixed(4)})`;
    // every bitmap's cells come out one size on screen, as coarse as the board's at the nearest the camera brings it
    const U = SM.u();
    for (const [id, art, w] of set.items) {
      if (art.endsWith("-line")) continue;
      const sc = Math.max(...set.cams.map((c) => P / (P - Math.min(-120, pos[id].z - c.z)))), base = w > U * 22 ? 0.28 : 0.14;
      $(".pic", els[id]).dataset.cell = (0.26 / (kv * sc * base)).toFixed(3);
    }
    // the role reads at 17px or more however small the room is drawn (a phone on its side draws it at half size)
    const role = $(".rm-role", host);
    if (role) role.style.fontSize = Math.max(set.name.role, 17 / kv).toFixed(1) + "px";
    // the names under the six read at 17px or more from the opening view
    for (const id of SIX) {
      const sc0 = P / (P - (pos[id].z - set.cams[0].z));
      $(".rm-nm", els[id]).style.fontSize = (17 / (kv * sc0)).toFixed(1) + "px";
    }
    // the moon in the window is the board's own moon, seen from far off: its size and its cells are fitted so that it
    // lands exactly on the board's moon, one cell for one cell
    const L = land();
    moon.style.width = moon.style.height = L.d.toFixed(1) + "px";
    $(".pic", moon).dataset.cell = ((+$("#moonpic").dataset.cell || 1) / (kv * L.sc)).toFixed(3);
    pics.forEach((b) => b.imgs && b.build());
    lastSpell = -1; softFor = -1;
    // the echoes' canvas covers the stage, at no more than one and a half of the screen's pixels to each of its own
    echoW = host.clientWidth; echoH = host.clientHeight; echoK = Math.min(1.5, devicePixelRatio || 1);
    echo.width = Math.round(echoW * echoK); echo.height = Math.round(echoH * echoK);
    echoOn = true; clearEcho();
    // the six keep clear of the frame's sides, and of the masthead and the foot, which lie over the stage
    const band = Math.max(4.2 * U, 48);
    edge = { x: 12, t: band * 1.1, b: SM.COLUMN.matches ? 16 : band };
  };

  /* ------------------------------------------------------------------ waking: by the pointer or a tap, or as it lifts */
  const wake = (id) => { if (awake.has(id)) return; awake.add(id); SM.bitmap(els[id])?.wakeUp(320); };

  /* ------------------------------------------------------------------ the camera: one dolly from the room through the window
     The camera moves on one continuous path with no stops: it eases in, drifts slowly toward the window on a single
     shallow arc while the six gather and the star is drawn, then gathers speed through the glass and eases into the
     landing. Its depth is planned in the logarithm of its distance to the far plane where the circle lands, so things
     grow on screen at a steady rate rather than slowly and then all at once, and the speed never jumps: the drift's
     pace flows straight into the push. Sideways and up and down it follows the depth, so it travels in a clean line. */
  let dollyKey = "", dollyL = null;
  /** the eye's log distance to the far plane, over the scroll: L0 at the start, Ld where the push begins, L1 landed */
  const dolly = (L0, Ld, L1) => {
    const P0 = B.push[0], P1 = B.push[1], N = 600, dp = P1 / N;
    const rate = (x) => sm(0, 0.7, x) * (1 - sm(P1 - 0.55, P1, x)), boost = (x) => sm(P0 - 0.15, P0 + 0.55, x);
    const ca = new Float64Array(N + 1), cb = new Float64Array(N + 1);
    for (let i = 1; i <= N; i++) {
      const x0 = (i - 1) * dp, x1 = i * dp, r0 = rate(x0), r1 = rate(x1);
      ca[i] = ca[i - 1] + ((r0 + r1) / 2) * dp; cb[i] = cb[i - 1] + ((r0 * boost(x0) + r1 * boost(x1)) / 2) * dp;
    }
    // the drift's pace c and the push's extra K are solved so the dolly reaches Ld exactly at P0 and L1 exactly at P1
    const i0 = Math.round(P0 / dp), dd = Ld - L0, dt = L1 - L0;
    const K = Math.max(0, (dt * ca[i0] - dd * ca[N]) / (dd * cb[N] - dt * cb[i0])), c = dt / (ca[N] + K * cb[N]);
    return (p) => {
      if (p <= 0) return L0;
      if (p >= P1) return L1;
      const x = p / dp, i = Math.floor(x), t = x - i;
      return L0 + c * ((ca[i] + K * cb[i]) * (1 - t) + (ca[i + 1] + K * cb[i + 1]) * t);
    };
  };
  const camAt = (p) => {
    const [c0, c1] = set.cams, r = set.ring, P0 = B.push[0];
    const e = endCam(target()), L0 = Math.log(P - r.out + c0.z), key = `${P}|${B.push}|${e.z.toFixed(1)}`;
    if (key !== dollyKey) { dollyKey = key; dollyL = dolly(L0, Math.log(P - r.out + c1.z), Math.log(P - r.out + e.z)); }
    const L = dollyL(p), z = Math.exp(L) - P + r.out;
    // the drift: one short straight step in and to the side. The camera never turns, so nothing in the room has to be
    // turned again to face it as it goes
    const su = SM.smooth(clamp(p / P0));
    const d = { x: mix(c0.x, c1.x, su), y: mix(c0.y, c1.y, su), pitch: mix(c0.pitch, c1.pitch, su) };
    if (p <= P0) return { ...d, z };
    // the push: lined up on the landing in step with the depth, so it flies straight rather than drifting sideways
    const Ld = Math.log(P - r.out + c1.z), Lend = Math.log(P - r.out + e.z), g = SM.smooth(clamp((L - Ld) / (Lend - Ld)));
    return { x: mix(d.x, e.x, g), y: mix(d.y, e.y, g), z, pitch: d.pitch * (1 - g) };
  };
  /* within one frame of the camera, each of the few things it measures is measured once, before anything is written,
     so the page is laid out at most once a frame for it; outside the frame (a resize, a first fit) they are measured
     fresh */
  /* what the camera aims at moves only with the scroll, a resize or a change of the page's size, so the measures are
     kept until one of those changes (the room's own idle motion does not move them) */
  let inFrame = false, memoAt = "";
  const memoKey = () => `${SM.y}|${SM.placedGen}|${SM.vw}|${SM.vh}`;
  const memo = new Map();
  // while the page moves, the measures are taken in the page's own read pass (SM.measure), before anything is written
  const premeasure = () => { const m = $("#moonpic"); rectNow(board); rectNow(hero); if (m) { rectNow(m); moonTy(m); moonW(m); } };
  const rectNow = (el) => {
    if (!inFrame) return el.getBoundingClientRect();
    let r = memo.get(el);
    if (!r) { r = el.getBoundingClientRect(); memo.set(el, r); }
    return r;
  };
  const moonW = (m) => {
    if (!inFrame) return m.offsetWidth;
    if (!memo.has("w")) memo.set("w", m.offsetWidth);
    return memo.get("w");
  };
  const moonTy = (m) => {
    const read = () => new DOMMatrixReadOnly(getComputedStyle(m).transform).m42 || 0;
    if (!inFrame) return read();
    if (!memo.has("ty")) memo.set("ty", read());
    return memo.get("ty");
  };
  // where the board's circle is on screen
  const target = () => {
    const U = SM.u();
    // on wide screens: where the board's circle will rest once the moon's stop is pinned, not where it is while it is
    // still coming up under the room, so the camera flies one straight line to it instead of rising and sinking with it
    if (!SM.COLUMN.matches) { const bd = rectNow(board), up = Math.max(0, rectNow(hero).top); return { cx: bd.left + 50 * U, cy: bd.top - up + 28.8 * U, R: 28 * U }; }
    // on phones the moon's stop is still below the fold while the circle flies: aim at where its moon will rest once the
    // stop has come up to the top, and move with the stop over the last moments as the night opens onto it
    const m = rectNow($("#moonpic")), top = rectNow(hero).top;
    return { cx: m.left + m.width / 2, cy: m.top - top * (1 - sm(B.night[0], B.night[1], p)) + m.height / 2, R: m.width * 0.62 };
  };
  /* where the board's moon sits once risen, and so where the room's moon must be in the room, at the circle's depth, to
     land on it: its centre and diameter in room units, and the scale things at that depth have at the end */
  const land = () => {
    const tg = target(), r = set.ring, sc = tg.R / (r.r * kv), m = $("#moonpic"), mr = rectNow(m);
    const ty = moonTy(m);
    let cx = mr.left + mr.width / 2, cy = mr.top + mr.height / 2 - ty;
    if (SM.COLUMN.matches) cy -= rectNow(hero).top * (1 - sm(B.night[0], B.night[1], p));
    else cy -= Math.max(0, rectNow(hero).top);
    return { sc, d: moonW(m) / (kv * sc), x: r.x + (cx - tg.cx) / (kv * sc), y: r.y + (cy - tg.cy) / (kv * sc) };
  };
  // where the camera must stand at the end, so the flown-out circle lands exactly on the board's circle
  const endCam = (tg) => {
    const r = set.ring, sc = tg.R / (r.r * kv);
    return { x: r.x - (tg.cx - SM.vw / 2) / (kv * sc), y: r.y - (tg.cy - SM.vh / 2) / (kv * sc), z: r.out - P + P / sc };
  };

  /* the pointer moves the camera a little to the side and up or down (LOOK, in room units at its far end), so the near
     things slide over the far ones; the scroll is followed on a spring */
  const LOOK = { x: 36, y: 16 };
  let lx = 0, ly = 0, tlx = 0, tly = 0, p = 0, v = 0, raf = 0, lastT = 0, inView = false;
  if (SM.HOVER) addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || still()) return;
    tlx = e.clientX / SM.vw - 0.5; tly = e.clientY / SM.vh - 0.5; kick();
  }, { passive: true });
  /* the scroll, in screens, mapped onto the beats: the opening (beats 0 to 1.2) takes the first 0.8 of a screen,
     so the room moves as much for a turn of the wheel at the start as the page does everywhere else; the rest is spread
     evenly up to the landing (4.65), which is left where the moon's stop needs it */
  const WARP_L = 4.65, WARP_A = 0.5;
  const warp = (s) => {
    if (s <= 0 || s >= WARP_L) return s;
    // s + a·s·(1 - s/L)²: half again as fast at the start, easing to the scroll's own pace by the landing, with no kink
    const x = s / WARP_L;
    return s + WARP_A * s * (1 - x) * (1 - x);
  };
  // the room's section sits in the page's flow, so its place comes from the scroll and a measure kept between resizes
  const scrollT = () => warp(-SM.where(sec).top / SM.vh);
  const kick = () => { if (!raf && inView) { lastT = performance.now(); raf = requestAnimationFrame(loop); } };
  const loop = (now) => {
    raf = 0;
    // a frame asked for before the room went out of view (or quiet mode was switched on) is let go
    if (!inView) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000)); lastT = now;
    // measure first, then write: what the camera aims at is read before the frame changes anything (already done in
    // the page's read pass when the page moved this frame)
    inFrame = true;
    const key = memoKey();
    if (memoAt !== key) { memo.clear(); memoAt = key; if (p < SPAN) premeasure(); }
    const t = scrollT();
    if (Math.abs(t - p) > 1.5) { p = t; v = 0; }
    // a critically damped spring: the camera has a little weight behind the scroll but never overshoots and swings back,
    // so the circle settles onto the board's circle exactly
    const K = 120, C = 2 * Math.sqrt(K);
    v += ((t - p) * K - v * C) * dt; p += v * dt;
    if (Math.abs(t - p) < 0.0003 && Math.abs(v) < 0.0003) { p = t; v = 0; }
    lx += (tlx - lx) * Math.min(1, dt * 5); ly += (tly - ly) * Math.min(1, dt * 5);
    try { draw(); } finally { inFrame = false; }
    if (inView && (p !== t || Math.abs(tlx - lx) + Math.abs(tly - ly) > 0.001)) raf = requestAnimationFrame(loop);
  };
  SM.measure((now) => {
    if (!inView || p >= SPAN) return;
    const key = memoKey();
    if (memoAt === key) return;
    memo.clear(); memoAt = key; inFrame = true;
    try { premeasure(); } finally { inFrame = false; }
  });

  /* ------------------------------------------------------------------ the frame's helpers */
  /** an opacity written only when it changes; whatever has faded right out is also hidden, so the browser stops
      painting and compositing it */
  const op = (el, a, hide = true) => {
    const s = a > 0.0005 ? a.toFixed(3) : "0";
    if (el._o === s) return;
    el._o = s; el.style.opacity = s;
    if (hide) el.style.visibility = s === "0" ? "hidden" : "";
  };
  /** the room's forever-moving ornaments (the curtains, the window's night, the dust) rest while nobody can see them */
  let rested = null, lastNear = 1;
  const rest = (r) => { if (rested !== r) { rested = r; host.classList.toggle("rm-rest", r); } };
  /** where the camera sees a point of the room: its place on the stage and how much things there are scaled. The same
      sums the browser does for the world's transform (room-proto.css): the camera's offset, the turn about the point
      the lens stands at, then the lens's perspective and the view's own scale, from the middle of the stage */
  const echoAt = (cam, yaw, pitch, x, y, z) => {
    const a = (-yaw * Math.PI) / 180, b = (pitch * Math.PI) / 180;
    const x1 = x - cam.x, y1 = y - cam.y, z1 = z - cam.z - P;
    const x2 = x1 * Math.cos(a) + z1 * Math.sin(a), z2 = -x1 * Math.sin(a) + z1 * Math.cos(a);
    const y3 = y1 * Math.cos(b) - z2 * Math.sin(b), z3 = y1 * Math.sin(b) + z2 * Math.cos(b) + P;
    const k = (P / (P - z3)) * kv;
    return { x: echoW / 2 + x2 * k, y: echoH / 2 + y3 * k, k };
  };
  /** how clear of the frame's edges a standing piece is seen: 1 while it keeps a margin from every edge, falling to 0
      as it reaches one (or once the camera has passed it), so a piece the camera leaves behind dissolves before the
      frame could cut it */
  const clear = (cam, yaw, pitch, q) => {
    const a = echoAt(cam, yaw, pitch, q.x - q.w / 2, q.top, q.z), b = echoAt(cam, yaw, pitch, q.x + q.w / 2, q.top + q.h, q.z);
    if (a.k <= 0 || b.k <= 0) return 0;
    return clamp(Math.min(a.x, a.y, echoW - b.x, echoH - b.y) / Math.max(16, echoW * 0.03));
  };
  /** where a picture w x h at scale s, seen at e, must be drawn to sit inside the frame, clear of the masthead and the
      foot (edge, below): null if it already does, or else its nearest place inside, at the largest scale that fits */
  const inside = (e, w, h, s) => {
    if (e.k <= 0) return null;
    const x0 = edge.x, x1 = echoW - edge.x, y0 = edge.t, y1 = echoH - edge.b;
    const s2 = Math.max(0, Math.min(s, (x1 - x0) / (w * e.k), (y1 - y0) / (h * e.k)));
    const hw = (w / 2) * s2 * e.k, hh = (h / 2) * s2 * e.k;
    const x = clamp(e.x, x0 + hw, x1 - hw), y = clamp(e.y, y0 + hh, y1 - hh);
    return x === e.x && y === e.y && s2 === s ? null : { x, y, s: s2 };
  };
  let edge = { x: 12, t: 48, b: 12 };
  const clr = {};
  const clearEcho = () => { if (echoOn) { echoOn = false; echoG.setTransform(1, 0, 0, 1, 0, 0); echoG.clearRect(0, 0, echo.width, echo.height); echo.style.visibility = "hidden"; } };
  /** the circle's softened copy, made once the drawing is whole (and again after the drawing is redone at a new size) */
  const soften = () => {
    if (softFor === lastSpell) return;
    softFor = lastSpell;
    soft.width = Math.round(sharp.width / 2); soft.height = Math.round(sharp.height / 2);
    const g = soft.getContext("2d");
    // as blurred as the circle ever was by its speed (3px of its own size), at the copy's half resolution
    if ("filter" in g) g.filter = `blur(${((3 * soft.width) / (set.ring.r * 3)).toFixed(2)}px)`;
    g.drawImage(sharp, 0, 0, soft.width, soft.height);
  };

  /* ------------------------------------------------------------------ one frame */
  let spoke = false, inRoom = null, lifted = null;
  const HINT = SM.HOVER ? "Point at things to wake them, then scroll." : "Tap things to wake them, then scroll.";
  // once the six lift, the footer says what the board will go on to say, so it never calls them asleep while they fly
  const RISE = "Keep scrolling: the moon wakes the rooms.";
  const draw = () => {
    const r = set.ring, speed = Math.min(1, Math.abs(v) * 1.6);   // how fast the scroll is carrying things, for motion blur
    const f = sm(B.land[0], B.land[1], p);
    const hv = p > SPAN - 0.005 ? "hidden" : "";
    if (host._v !== hv) { host._v = hv; host.style.visibility = hv; }
    if (inRoom !== p < B.lift) { inRoom = p < B.lift; document.body.classList.toggle("in-room", inRoom); }
    const wq = sm(BEAT.name[0], BEAT.name[1], p), wt = `translate3d(0, ${(-wq * 40).toFixed(1)}px, 0)`;
    op(words, 1 - wq);
    // the role wakes along its letters as the scroll goes: behind the front they are awake, the few just ahead are loose
    const rn = Math.round(lin(WAKE[0], WAKE[1], p) * (roleCh.length + LOOSE));
    if (rn !== roleN) {
      roleN = rn;
      roleCh.forEach((c, i) => { const st = i < rn - LOOSE ? "rm-c w" : i < rn ? "rm-c f" : "rm-c"; if (c.className !== st) c.className = st; });
    }
    if (words._t !== wt) { words._t = wt; words.style.transform = wt; }

    // the camera: the slow drift, then out through the window to the board
    const q = lin(B.push[0], B.push[1], p);
    // the pointer's small step is let go of as the six lift, so the flight and the landing follow the scroll alone
    const look = 1 - sm(B.lift, B.push[0], p), cam = camAt(p);
    cam.x += lx * LOOK.x * look; cam.y += ly * LOOK.y * look;
    const yaw = 0, pitch = cam.pitch;
    const vt = `translateZ(${P}px) rotateX(${pitch.toFixed(2)}deg) translateZ(${-P}px) translate3d(${(-cam.x).toFixed(1)}px,${(-cam.y).toFixed(1)}px,${(-cam.z).toFixed(1)}px)`;
    if (world._t !== vt) { world._t = vt; world.style.transform = vt; }
    // the room dims while the six gather, then is gone as the circle reaches the back wall (so the wall never cuts it
    // off as it goes through) or the eye does, whichever is first
    const eye = cam.z + P, near = Math.min(1 - sm(set.box.back + 900, set.box.back + 160, eye), 1 - sm(0.08, 0.5, q));
    const dim = mix(1, 0.28, sm(BEAT.lift, BEAT.lift + 0.8, p)), room = dim * near;
    // the walls keep their black whole (so the moon behind them is only ever seen through the glass); only their lines dim
    fades.near.forEach((el) => op(el, near));
    fades.lines.forEach((el) => op(el, near * dim));
    fades.shades.forEach((el) => op(el, 1 - dim));
    // the furniture also dissolves as the camera carries it toward the edge of the frame, so the frame never cuts it
    fades.room.forEach((el) => { const id = el.dataset.id; if (id) clr[id] = clear(cam, yaw, pitch, pos[id]); op(el, id ? room * clr[id] : room); });
    op(vig, 0.75 * sm(BEAT.lift, BEAT.lift + 0.8, p) * (1 - sm(0.3, 0.8, q)));
    // a flash of moonlight as the circle goes through the glass
    op(flash, 0.55 * bell(lin(0.28, 0.62, q)));
    // the room's own stars go out behind the flash, so that only the moon's sky is ever seen as the night thins
    op(sky, 1 - sm(0.4, 0.8, q));
    // the window's own night (stars, clouds, haze) gives way to the moon rising in the glass, and rests once it has
    if (glassEl) { const gl = near * (1 - sm(B.rise[0] - 0.35, B.rise[0] + 0.25, p)); op(glassEl, gl); if (glassEl._off !== gl <= 0.0005) { glassEl._off = gl <= 0.0005; glassEl.classList.toggle("rm-off", glassEl._off); } }
    lastNear = near; rest(!inView || near <= 0);
    // the moon rises in the window's empty glass while the camera pushes on: it waits at the circle's far depth, so the
    // flown-out circle closes round it, and at the end it is the board's own moon, which takes over in the same place
    if (p > B.rise[0] - 0.4) {
      const L = land(), up = inOut(lin(B.rise[0], B.rise[1], p)), y = L.y + (1 - up) * L.d * 1.3;
      const mt = `translate3d(${(L.x - L.d / 2).toFixed(1)}px,${(y - L.d / 2).toFixed(1)}px,${r.out - 1}px)`;
      if (moon._t !== mt) { moon._t = mt; moon.style.transform = mt; }
      op(moon, 1 - sm(B.mout[0], B.mout[1], p), false);
      if (moon._vis !== "visible") { moon._vis = "visible"; moon.style.visibility = "visible"; }
    } else if (moon._vis !== "hidden") { moon._vis = "hidden"; moon.style.visibility = "hidden"; }
    // the window's stone frame stays while the circle goes out through its glass, and fades as the camera comes close
    // enough that its cells would grow coarse
    op(els.window, room * (1 - sm(-560, -300, pos.window.z - cam.z)));

    // the circle: draws itself between the six in front of the window, flies out, lands on the board's circle. Its
    // canvas is drawn again only when the drawing has moved on by a visible step (a forty-eighth of the way)
    const s = Math.round(lin(BEAT.draw[0], BEAT.draw[1], p) * 48) / 48;
    const cz = mix(r.z, r.out, inOut(lin(B.push[0] + 0.05, B.push[1] - 0.1, p)));
    const cblur = speed * 3 * bell(q);
    const ct = `translate3d(${r.x - r.r * 1.5}px,${r.y - r.r * 1.5}px,${cz.toFixed(1)}px)`;
    if (circle._t !== ct) { circle._t = ct; circle.style.transform = ct; }
    const co = sm(BEAT.draw[0] - 0.25, BEAT.draw[0] + 0.1, p) * (1 - sm(B.cout[0], B.cout[1], p));
    op(circle, co);
    op(halo, 0.5 * s + 0.4 * bell(lin(0.1, 0.6, q)));
    if (co > 0 && s !== lastSpell) { lastSpell = s; SM.spell.cast(cctx, N, N, { cx: N / 2, cy: N / 2, R: RC, targets: null }, s, 0, null); }
    // its motion blur, as the speed carries it out through the glass: the softened copy fades in over the sharp one
    const kb = cblur > 0.15 && s === 1 && !still() ? Math.min(1, cblur / 3) : 0;
    if (kb > 0) soften();
    op(soft, kb); op(sharp, 1 - kb, false);

    // the six: in their places, then up on clean arcs to the star's points, carried out with the circle;
    // on landing each shrinks into the light of its point, which the rising moon then carries out to its door
    let echoes = false;
    const fade = sm(0, 0.6, f);
    SIX.forEach((id, k) => {
      const h = pos[id], j = DOORMAP[k], a = (j * Math.PI) / 3 + 0.5;
      const tx = r.x + Math.cos(a) * r.r * 0.84, ty = r.y + Math.sin(a) * r.r * 0.84, tz = cz + 2;
      const g0 = B.lift + k * B.stagger, g = lin(g0, g0 + B.fly, p), u = out3(g);
      const side = h.x < r.x ? -1 : 1;
      // a curve that rises and swings a little out on its own side before coming in to its point
      const c = { x: (h.x + tx) / 2 + side * 120, y: Math.min(h.cy, ty) - 150, z: (h.z + tz) / 2 + 80 };
      const fit6 = Math.min(1, (r.r * 0.45) / Math.max(h.w, h.h));
      const bz = (a0, c0, b0) => (1 - u) ** 2 * a0 + 2 * (1 - u) * u * c0 + u * u * b0;
      let X = bz(h.x, c.x, tx), Y = bz(h.cy, c.y, ty), Z = bz(h.z, c.z, tz), scl = mix(1, fit6, u) * mix(1, 0.12, fade);
      const el = els[id];
      if (g > 0) wake(id);
      // while it flies it is kept inside the frame, clear of the masthead and the foot: where the circle swells past the
      // screen as the camera pushes on, it slides in from its point just as far as it must, and back out as the circle
      // settles, so the frame never cuts it (and only if the frame is too small for it at all is it made smaller)
      if (g > 0) {
        const e = echoAt(cam, yaw, pitch, X, Y, Z), q = inside(e, h.w, h.h, scl);
        if (q) { X += (q.x - e.x) / e.k; Y += (q.y - e.y) / e.k; scl = q.s; }
      }
      const tf = `translate3d(${(X - h.w / 2).toFixed(1)}px,${(Y - h.h / 2).toFixed(1)}px,${Z.toFixed(1)}px) scale(${scl.toFixed(4)})`;
      if (el._t !== tf) { el._t = tf; el.style.transform = tf; }
      // its echoes: copies a little further back along the same path, fainter the further back, drawn out by the speed of
      // the scroll and gone as it settles at its point, so it is seen to fly rather than to slide
      const trail = g > 0 && g < 1 && !still() ? sm(0.02, 0.12, g) * (1 - sm(0.82, 1, g)) * mix(0.45, 1, speed) : 0;
      const im = trail > 0.01 && (el._im || (el._im = $(".full", el)));
      if (im && im.naturalWidth) {
        if (!echoes) {
          echoes = true;
          if (!echoOn) { echoOn = true; echo.style.visibility = "visible"; }
          echoG.setTransform(1, 0, 0, 1, 0, 0); echoG.clearRect(0, 0, echo.width, echo.height); echoG.setTransform(echoK, 0, 0, echoK, 0, 0);
        }
        for (let i = ECHO.length - 1; i >= 0; i--) {
          const uu = out3(Math.max(0, g - (i + 1) * 0.035 * (0.6 + speed * 1.6)));
          const bz = (a0, c0, b0) => (1 - uu) ** 2 * a0 + 2 * (1 - uu) * uu * c0 + uu * uu * b0;
          const e = echoAt(cam, yaw, pitch, bz(h.x, c.x, tx), bz(h.cy, c.y, ty), bz(h.z, c.z, tz));
          let s0 = mix(1, fit6, uu) * mix(1, 0.12, fade), ex = e.x, ey = e.y;
          const q = inside(e, h.w, h.h, s0);
          if (q) { ex = q.x; ey = q.y; s0 = q.s; }
          const w = h.w * s0 * e.k, hh = h.h * s0 * e.k;
          echoG.globalAlpha = trail * ECHO[i];
          echoG.drawImage(im, ex - w / 2, ey - hh / 2, w, hh);
        }
      }
      // what stands on a piece of furniture goes with it until it lifts off
      op(el, (1 - sm(0.25, 0.6, f)) * (h.on ? mix(clr[h.on] ?? 1, 1, sm(0, 0.2, g)) : 1), false);
      // its name comes up as it lifts (one after another, with the stagger), stays at a steady size while it flies, and
      // goes as the camera pushes on, where the moon's doors take the same names in the same places
      const nm = el._nm || (el._nm = $(".rm-nm", el));
      const no = g > 0 ? sm(0, 0.35, g) * (1 - sm(B.push[0] - 0.25, B.push[0] + 0.05, p)) : 0;
      const nmo = no > 0.001 ? no.toFixed(3) : "", nms = g > 0 ? (1 / Math.max(scl, 0.05)).toFixed(3) : "";
      if (nm._o !== nmo) { nm._o = nmo; nm.style.opacity = nmo; }
      if (nm._s !== nms) { nm._s = nms; nm.style.scale = nms; }
      // no blur filter on the six themselves: the echoes carry the motion, and a filter on a moving picture costs a
      // repaint of the whole picture every frame
      // light blooms at its point as it arrives, and again as the circle lands
      op(blooms[k], Math.max(bell(lin(g0 + B.fly * 0.7, g0 + B.fly * 0.7 + 0.35, p)), 0.9 * bell(lin(0, 0.75, f))));
    });
    if (!echoes) clearEcho();
    if (lifted !== p > B.lift) { lifted = p > B.lift; sec.classList.toggle("lifted", lifted); }

    op(night, 1 - (B.night ? sm(B.night[0], B.night[1], p) : f), false);
    cover(p < (B.night ? B.night[0] : B.land[0]));
    op(beam, sm(B.rise[0] + 0.2, B.rise[1], p) * (1 - sm(0.05, 0.35, q)));
    // the way past the room stays offered while the six fly and the star draws, until the ring heads out of the window
    op(skip, 1 - sm(B.push[0], B.push[0] + 0.35, p), false);
    const sv = p > B.push[0] + 0.35 ? "hidden" : "";
    if (skip._v !== sv) { skip._v = sv; skip.style.visibility = sv; }
    const hh = p < B.lift - 0.1 ? HINT : RISE;
    if (hero.dataset.hint !== hh) hero.dataset.hint = hh;
    if (liveEl && liveEl.textContent !== hh && p < B.land[1]) liveEl.textContent = hh;
  };

  /* ------------------------------------------------------------------ the scroll */
  /* while the room's night is whole, nothing behind it can be seen (the moon's stop, the sky): the page says so with a
     class on the root (.room-covers), and what moves back there rests until the night begins to thin (drift-proto.js,
     depth-proto.js, magic-proto.js), so a frame of the room costs nothing on the pages under it */
  let covering = false;
  const cover = (on) => { if (covering !== on) { covering = on; root.classList.toggle("room-covers", on); } };
  let ready = false, loads = [];
  const run = () => {
    if (still() || !SM.where(sec).h) {   // the section's height as the scroll keeps it, so no layout each frame
      if (spoke) { spoke = false; hero.dataset.hint = REST; SM.say(); document.body.classList.remove("in-room"); inRoom = false; }
      inView = false; cover(false); return;
    }
    if (!ready) return;
    build();
    spoke = true;
    const t = scrollT();
    inView = t > -1 && t < SPAN + 0.2;
    rest(!inView || lastNear <= 0);
    if (!inView) {
      const hv = t > SPAN ? "hidden" : ""; if (host._v !== hv) { host._v = hv; host.style.visibility = hv; }
      // a jump straight past the room (a link, a reload further down) never draws its last frames, so what they would
      // have undone is undone here
      if (inRoom) { inRoom = false; document.body.classList.remove("in-room"); }
      // the role's awake letters are made visible one by one, so hiding the room alone would leave them standing over
      // the moon: past the room its words are faded right out as well (the next frame inside the room gives them back)
      if (t > SPAN && words) op(words, 0);
      cover(false); return;
    }
    kick();
  };
  SM.scrub(run);
  // the quiet switch can be thrown while the page is still: the room then takes its words back at once
  $("#quiet")?.addEventListener("click", () => requestAnimationFrame(run));
  /* the room is built once the page has painted its first frame and the browser has a moment to spare (or after at most
     four tenths of a second), so the first screen's own work is not held up by the room's pictures. The loading veil
     waits for the room (SM.roomReady, magic-proto.js) as it waits for the first screen's pictures, so the room is
     standing, pictures and all, before the page is first seen */
  const idle = window.requestIdleCallback ? (fn) => requestIdleCallback(fn, { timeout: 400 }) : (fn) => setTimeout(fn, 200);
  SM.roomReady = new Promise((done) => requestAnimationFrame(() => idle(() => {
    ready = true; run();
    const imgs = $$("img", host).filter((im) => !im.complete).map((im) => new Promise((r) => { im.addEventListener("load", r, { once: true }); im.addEventListener("error", r, { once: true }); }));
    Promise.all([...loads, ...imgs]).then(done, done);
  })));
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (!set) return; if (built !== roomKey()) build(); else fit(); run(); }, 160); });

  /* skipping the intro goes straight to the moon's stop with its doors drawn in. From the keyboard, the focus goes on to
     the first door; a click or a tap leaves the doors asleep, so the stop is seen as it rests, with the name whole (a
     focused door wakes and lends the name its own word) */
  host.addEventListener("click", (e) => {
    if (!e.target.closest(".rm-skip")) return;
    e.preventDefault();
    const at = hero.offsetTop + (SM.COLUMN.matches ? 0 : (+hero.dataset.riseAt || 0.65) + 0.95) * SM.vh;
    const keys = e.detail === 0;
    scrollTo({ top: at, behavior: "instant" });
    requestAnimationFrame(() => (keys ? $(".door", board)?.focus({ preventScroll: true }) : document.activeElement?.blur()));
  });

  /* the masthead shows the six stops once the moon has woken its doors (wide screens), or once the moon's stop has gone
     by; the room sits before it, so measure from the moon */
  // (from the moon's stop's place as the scroll keeps it, so a scroll event never makes the browser lay the page out)
  const past = () => {
    const w = SM.where(hero);
    document.body.classList.toggle("past", w.bottom < SM.vh * 0.5 || (!SM.COLUMN.matches && hero.classList.contains("risen") && w.top < 0));
  };
  addEventListener("scroll", past, { passive: true });
  // the moon's stop marks itself risen a moment after the scroll that raised it, so look again when it does
  new MutationObserver(past).observe(hero, { attributes: true, attributeFilter: ["class"] });
  document.readyState === "loading" ? addEventListener("DOMContentLoaded", past) : past();
})();
