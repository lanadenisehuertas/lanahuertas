/* Prototype: the room. The page opens inside a quiet study at night, built as a real 3D room (CSS 3D planes and
   standing pictures in one perspective). Everything but the work is drawn in line: the walls, floor and ceiling are black
   planes with a few engraved lilac lines, the desk and the side table are line drawings, and the window is the one
   picture beside the work. The six things of the work (the cards and the phone on the desk, the projector on the
   table, the easel on the floor, the mirror on the wall, the letter on the sill) are the only bitmaps: asleep in lilac,
   and woken into colour for good by the pointer or a tap.
   One story, scrubbed by the scroll:
     the camera drifts slowly toward the window, the pointer looking a little around; the room says only what Lana does,
     because the moon's stop owns the name;
     the room dims and the six rise, each waking as it lifts, and fly on clean arcs to the points of the spell in front
     of the window, blurred by their own speed, each blooming with light as it arrives; the star draws itself from the
     first arrival to the last and glows;
     the moon rises in the window's empty glass as the camera pushes on; the circle flies out through the window in a
     flash of moonlight, and the camera follows it between the stone mullions, so the circle closes round the risen moon;
     it lands exactly on the moon's board's own circle, where the six dissolve into the light of its points
     as the night thins to show the board (spell-proto.js takes over from there).
   The camera follows the scroll on a spring, so it has weight but settles exactly where the scroll says, and everything
   reverses when you scroll back. Quiet mode and reduced motion skip the room. */
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
  const still = () => SM.quiet() || matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* the beats, in screens of scroll through the room (the stage holds for SPAN screens) */
  const SPAN = 5;
  const BEAT = { cout: [4.23, 4.47], mout: [4.4, 4.62], rise: [1.2, 2.3], name: [0.55, 0.95], lift: 1.85, stagger: 0.1, fly: 0.55, draw: [2.4, 2.95], push: [2.95, 4.05], land: [4.05, 4.65] };
  let P = 2400;   // the perspective: how far the eye stands in front of the screen, in room units (a long lens, so
                    // the side walls are short and the room reads as a room, not a corridor)

  /* the pictures: [width, height] of each file */
  const IMG = { window: [520, 863], "desk-line": [820, 677], "table-line": [500, 625],
    brands: [520, 336], posters: [267, 520], films: [520, 473], products: [264, 520], about: [396, 520], contact: [520, 434] };
  const SIX = ["brands", "posters", "films", "products", "about", "contact"];
  const SRC = (k) => (SIX.includes(k) ? `art/c_${k}.webp` : `art/room/${k}.webp`);
  const DOORMAP = [4, 3, 2, 5, 0, 1];   // door k is born from the star's point j, as in spell-proto.js

  /* two rooms: a wide one for screens and a tall one for phones. The view is a box of view.w x view.h scaled to fit the
     screen; the room is box.w wide and box.h tall with the floor at +box.h/2, its back wall at z = box.back, and its floor
     running forward to z = box.front. Pieces stand with their bottom centre at (x, by, z), or on another piece's top
     ([that piece, fraction of its height from its top]). */
  const SETS = {
    wide: {
      view: { w: 1440, h: 810 }, box: { w: 1400, h: 800, back: -1000, front: 600 },
      name: { top: 660, role: 30 },
      // the camera's drift: from the first view to the last before the push, on one shallow arc to the left and back
      cams: [{ x: 0, y: -40, z: 120, pitch: -4 }, { x: 0, y: -50, z: -400, pitch: -3 }], arc: 36,
      ring: { x: 0, y: -60, z: -560, r: 260, out: -2200 },
      items: [
        ["window", "window", 380, 0, 250, -992],
        ["about", "about", 160, 370, 110, -986],
        ["contact", "contact", 120, 112, 246, -975],
        ["posters", "posters", 200, -250, 400, -640],
        ["desk", "desk-line", 460, -500, 400, -260], ["brands", "brands", 210, -540, ["desk", 0.2], -256], ["products", "products", 74, -360, ["desk", 0.2], -256],
        ["table", "table-line", 340, 530, 400, -250], ["films", "films", 240, 515, ["table", 0.16], -246],
      ],
    },
    tall: {
      // a phone's tall view is filled by a shorter lens: with the wide room's long one the room would sit small in it
      lens: 1300,
      view: { w: 720, h: 1280 }, box: { w: 900, h: 1200, back: -1000, front: 700 },
      name: { top: 150, role: 40 },
      cams: [{ x: 0, y: 40, z: 150, pitch: -3 }, { x: 40, y: 50, z: -360, pitch: -2.5 }], arc: 22,
      ring: { x: 40, y: 50, z: -560, r: 200, out: -2200 },
      // the moon's stop comes up from below on phones and reaches the top at 5 screens: the circle and the moon land at
      // the moon's resting place first, then the night opens over the last tenth of a screen as the stop arrives under
      // them, and they hand over to its own moon in the same place
      beat: { push: [2.95, 4.25], land: [4.25, 4.85], night: [4.88, 4.99], cout: [4.88, 4.98], mout: [4.9, 4.99] },
      items: [
        ["window", "window", 290, 40, 300, -992],
        ["about", "about", 170, 300, 40, -986],
        ["contact", "contact", 140, 140, 296, -975],
        ["posters", "posters", 150, 55, 600, -880],
        ["desk", "desk-line", 400, -200, 600, -200], ["brands", "brands", 190, -235, ["desk", 0.2], -196], ["products", "products", 66, -70, ["desk", 0.2], -196],
        ["table", "table-line", 300, 270, 600, -190], ["films", "films", 210, 258, ["table", 0.16], -186],
      ],
    },
  };

  /* ------------------------------------------------------------------ the engraved planes: few lines, drawn as SVG */
  const INK = "#b9a2ff", DIM = "#5a4a99", FAINT = "#3b3170";
  // the room's surfaces are night, not nothing: the back wall a little lighter than the side walls, the floor and the
  // ceiling darkest, so the room has volume before a single line is drawn
  const WALL = "#0d0a24", SIDE = "#08061a", FLOOR = "#060414", CEIL = "#040310";
  const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${body}</svg>`;
  /** a sparse wallpaper of small four-point stars and crescents, on the back wall only */
  const stars = (w, y0, y1, step, seed) => {
    let s = seed, out = "";
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    for (let y = y0 + step / 2; y < y1; y += step) for (let x = step / 2; x < w; x += step) {
      const px = (x + (rnd() - 0.5) * step * 0.5).toFixed(0), py = (y + (rnd() - 0.5) * step * 0.4).toFixed(0), r = 3 + rnd() * 3;
      out += rnd() < 0.3
        ? `<path transform="translate(${px} ${py})" d="M${-r} 0a${r * 1.3} ${r * 1.3} 0 1 0 ${r * 1.6} ${-r * 1.2}a${r} ${r} 0 1 1 ${-r * 1.6} ${r * 1.2}z"/>`
        : `<path transform="translate(${px} ${py})" d="M0 ${-r * 1.6}L${r * 0.35} ${-r * 0.35}L${r * 1.6} 0L${r * 0.35} ${r * 0.35}L0 ${r * 1.6}L${-r * 0.35} ${r * 0.35}L${-r * 1.6} 0L${-r * 0.35} ${-r * 0.35}z"/>`;
    }
    return `<g fill="${FAINT}">${out}</g>`;
  };
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
  let glassEl = null, ghosts = {}, beam, set, B = BEAT, sky, moon, skip, mask, view, world, words, night, circle, halo, flash, vig, blooms = [], cctx, els = {}, pos = {}, pics = [], built = "", lastSpell = -1;
  const build = () => {
    const key = SM.COLUMN.matches ? "tall" : "wide";
    if (built === key) return;
    built = key; set = SETS[key]; B = { ...BEAT, ...(set.beat || {}) }; P = set.lens || 2400;
    const { w: vw, h: vh } = set.view, r = set.ring;
    pos = {};
    for (const [id, art, w, x, by, z] of set.items) {
      const h = (w * IMG[art][1]) / IMG[art][0];
      const bottom = Array.isArray(by) ? pos[by[0]].top + pos[by[0]].h * by[1] : by;
      pos[id] = { x, top: bottom - h, w, h, z, cy: bottom - h / 2 };
    }
    const img = (art) => `<img class="full" src="${SRC(art)}" width="${IMG[art][0]}" height="${IMG[art][1]}" alt="">`;
    const piece = ([id, art, w]) => {
      const six = SIX.includes(id), line = art.endsWith("-line");
      // the desk is drawn as seen from its right; it stands on the left of the room, seen from the middle, so it is
      // turned to face the other way (its far side is then the one toward the wall, as it should be)
      const inner = line ? (id === "desk" ? img(art).replace("<img ", '<img style="transform:scaleX(-1)" ') : img(art)) : `<span class="pic" data-kind="paint" data-enter="manual" data-still${six ? "" : ' data-lift="0.3"'}>${img(art)}</span>`;
      const nm = six ? `<span class="rm-nm">${id[0].toUpperCase() + id.slice(1)}</span>` : "";
      return `<div class="rm-it ${six ? "rm-six" : "rm-leaf rm-furn"}" data-id="${id}" style="width:${w}px;height:${pos[id].h.toFixed(1)}px">${inner}${nm}</div>`;
    };
    const bs = r.r * 0.8;
    host.innerHTML = `<div class="rm-view" aria-hidden="true" style="width:${vw}px;height:${vh}px;perspective:${P}px">
        <div class="rm-world">
          <div class="rm-sky"><canvas></canvas></div>
          <div class="rm-moon"><span class="pic moon" data-kind="moon" data-enter="manual" data-still><img class="full" src="art/moon-asleep.webp" width="640" height="640" alt=""></span></div>
          ${planes(set)}
          ${SIX.map((id) => [1, 2, 3, 4].map((k) => `<div class="rm-ghost" data-g="${id}" style="width:${pos[id].w}px;height:${pos[id].h.toFixed(1)}px"><img src="${SRC(id)}" width="${IMG[id][0]}" height="${IMG[id][1]}" alt=""></div>`).join("")).join("")}
          ${set.items.map(piece).join("")}
          <div class="rm-circle" style="width:${r.r * 3}px;height:${r.r * 3}px">
            <i class="rm-halo"></i><canvas></canvas>
            ${SIX.map((_, k) => { const a = (DOORMAP[k] * Math.PI) / 3 + 0.5, x = r.r * 1.5 + Math.cos(a) * r.r * 0.84, y = r.r * 1.5 + Math.sin(a) * r.r * 0.84; return `<i class="rm-bloom" style="left:${(x - bs / 2).toFixed(1)}px;top:${(y - bs / 2).toFixed(1)}px;width:${bs}px;height:${bs}px"></i>`; }).join("")}
          </div>
        </div>
        <div class="rm-words" style="top:${set.name.top}px"><p class="rm-role" style="font-size:${set.name.role}px">UI/UX and graphic designer in Manila</p><span class="pl-cue rm-cue"><i></i></span></div>
      </div>
      <i class="rm-vig" aria-hidden="true"></i><i class="rm-flash" aria-hidden="true"></i>
      <div class="rm-night" aria-hidden="true"></div>
      <a class="go rm-skip" href="#moon">Skip the intro</a>`;
    ghosts = {}; $$(".rm-ghost", host).forEach((g) => (ghosts[g.dataset.g] ||= []).push(g)); beam = $(".rm-beam", host);
    view = $(".rm-view", host); world = $(".rm-world", host); words = $(".rm-words", host); night = $(".rm-night", host);
    circle = $(".rm-circle", host); halo = $(".rm-halo", host); flash = $(".rm-flash", host); vig = $(".rm-vig", host);
    sky = $(".rm-sky", host); moon = $(".rm-moon", host); mask = $(".rm-mask", host); skip = $(".rm-skip", host); blooms = $$(".rm-bloom", host); cctx = SM.spell.hires($("canvas", circle), N, N, 3.5); lastSpell = -1;
    glassEl = $(".rm-glass", host);
    els = {}; $$(".rm-it", host).forEach((el) => (els[el.dataset.id] = el));
    drawSky();
    for (const [id] of set.items) if (!SIX.includes(id)) place(els[id], pos[id], 0);
    pics = SM.pictures(host);
    pics.forEach((b) => b.load().then(() => b.setShow(1)).catch(() => {}));
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
  /** a standing picture at its place in the room, turned to face the camera */
  const place = (el, p, yaw) => { el.style.transform = `translate3d(${(p.x - p.w / 2).toFixed(1)}px,${p.top.toFixed(1)}px,${p.z}px) rotateY(${yaw.toFixed(2)}deg)`; };
  /** the night beyond the window: a far plane of sparse stars, kept as single pixels, the room's one wide bitmap */
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
    lastSpell = -1;
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
    // the drift: one shallow arc to the side and back, turning a little toward the window as it goes
    const u = clamp(p / P0), su = SM.smooth(u), bow = Math.sin(Math.PI * su);
    const d = { x: mix(c0.x, c1.x, su) - set.arc * bow, y: mix(c0.y, c1.y, su), yaw: (set.arc / 15) * bow, pitch: mix(c0.pitch, c1.pitch, su) };
    if (p <= P0) return { ...d, z };
    // the push: lined up on the landing in step with the depth, so it flies straight rather than drifting sideways
    const Ld = Math.log(P - r.out + c1.z), Lend = Math.log(P - r.out + e.z), g = SM.smooth(clamp((L - Ld) / (Lend - Ld)));
    return { x: mix(d.x, e.x, g), y: mix(d.y, e.y, g), z, yaw: d.yaw * (1 - g), pitch: d.pitch * (1 - g) };
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

  /* the pointer looks a little around; the scroll is followed on a spring */
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

  /* ------------------------------------------------------------------ one frame */
  let spoke = false;
  const HINT = SM.HOVER ? "Point at things to wake them, then scroll." : "Tap things to wake them, then scroll.";
  // once the six lift, the footer says what the board will go on to say, so it never calls them asleep while they fly
  const RISE = "Keep scrolling: the moon wakes the rooms.";
  const draw = () => {
    const r = set.ring, speed = Math.min(1, Math.abs(v) * 1.6);   // how fast the scroll is carrying things, for motion blur
    const f = sm(B.land[0], B.land[1], p);
    host.style.visibility = p > SPAN - 0.005 ? "hidden" : "";
    document.body.classList.toggle("in-room", p < B.lift);
    const wq = sm(BEAT.name[0], BEAT.name[1], p);
    words.style.opacity = (1 - wq).toFixed(3);
    words.style.transform = `translate3d(0, ${(-wq * 40).toFixed(1)}px, 0)`;

    // the camera: the slow drift, then out through the window to the board
    const q = lin(B.push[0], B.push[1], p);
    const cam = camAt(p);
    const look = 1 - sm(B.lift, B.push[0], p);
    const yaw = cam.yaw + lx * 4.5 * look, pitch = cam.pitch - ly * 2.5 * look;
    world.style.transform = `translateZ(${P}px) rotateX(${pitch.toFixed(2)}deg) rotateY(${(-yaw).toFixed(2)}deg) translateZ(${-P}px) translate3d(${(-cam.x).toFixed(1)}px,${(-cam.y).toFixed(1)}px,${(-cam.z).toFixed(1)}px)`;
    // the room dims while the six gather, then is gone as the circle reaches the back wall (so the wall never cuts it
    // off as it goes through) or the eye does, whichever is first
    const eye = cam.z + P, near = Math.min(1 - sm(set.box.back + 900, set.box.back + 160, eye), 1 - sm(0.08, 0.5, q)), room = mix(1, 0.28, sm(BEAT.lift, BEAT.lift + 0.8, p)) * near;
    mask.style.opacity = near.toFixed(3);
    world.style.setProperty("--room", room.toFixed(3));
    // the walls keep their black whole (so the moon behind them is only ever seen through the glass); only their lines dim
    world.style.setProperty("--dim", mix(1, 0.28, sm(BEAT.lift, BEAT.lift + 0.8, p)).toFixed(3));
    world.style.setProperty("--near", near.toFixed(3));
    vig.style.opacity = (0.75 * sm(BEAT.lift, BEAT.lift + 0.8, p) * (1 - sm(0.3, 0.8, q))).toFixed(3);
    // a flash of moonlight as the circle goes through the glass
    flash.style.opacity = (0.55 * bell(lin(0.28, 0.62, q))).toFixed(3);
    // the room's own stars go out behind the flash, so that only the moon's sky is ever seen as the night thins
    sky.style.opacity = (1 - sm(0.4, 0.8, q)).toFixed(3);
    // the window's own night (stars, clouds, haze) gives way to the moon rising in the glass
    if (glassEl) glassEl.style.opacity = (near * (1 - sm(B.rise[0] - 0.35, B.rise[0] + 0.25, p))).toFixed(3);
    // the moon rises in the window's empty glass while the camera pushes on: it waits at the circle's far depth, so the
    // flown-out circle closes round it, and at the end it is the board's own moon, which takes over in the same place
    if (p > B.rise[0] - 0.4) {
      const L = land(), up = inOut(lin(B.rise[0], B.rise[1], p)), y = L.y + (1 - up) * L.d * 1.3;
      moon.style.transform = `translate3d(${(L.x - L.d / 2).toFixed(1)}px,${(y - L.d / 2).toFixed(1)}px,${r.out - 1}px)`;
      moon.style.opacity = (1 - sm(B.mout[0], B.mout[1], p)).toFixed(3);
      moon.style.visibility = "visible";
    } else moon.style.visibility = "hidden";
    for (const [id] of set.items) if (!SIX.includes(id)) place(els[id], pos[id], yaw);
    // the window's stone frame stays while the circle goes out through its glass, and fades as the camera comes close
    // enough that its cells would grow coarse
    els.window.style.opacity = (room * (1 - sm(-560, -300, pos.window.z - cam.z))).toFixed(3);

    // the circle: draws itself between the six in front of the window, flies out, lands on the board's circle
    const s = lin(BEAT.draw[0], BEAT.draw[1], p);
    const cz = mix(r.z, r.out, inOut(lin(B.push[0] + 0.05, B.push[1] - 0.1, p)));
    const cblur = speed * 3 * bell(q);
    circle.style.transform = `translate3d(${r.x - r.r * 1.5}px,${r.y - r.r * 1.5}px,${cz.toFixed(1)}px)`;
    circle.style.opacity = (sm(BEAT.draw[0] - 0.25, BEAT.draw[0] + 0.1, p) * (1 - sm(B.cout[0], B.cout[1], p))).toFixed(3);
    circle.style.filter = cblur > 0.15 ? `blur(${cblur.toFixed(2)}px)` : "";
    halo.style.opacity = (0.5 * s + 0.4 * bell(lin(0.1, 0.6, q))).toFixed(3);
    if (Math.abs(s - lastSpell) > 0.002 || (s === 1 && lastSpell !== 1)) { lastSpell = s; SM.spell.cast(cctx, N, N, { cx: N / 2, cy: N / 2, R: RC, targets: null }, s, 0, null); }

    // the six: in their places, then up on clean arcs to the star's points, carried out with the circle;
    // on landing each shrinks into the light of its point, which the rising moon then carries out to its door
    SIX.forEach((id, k) => {
      const el = els[id], h = pos[id], j = DOORMAP[k], a = (j * Math.PI) / 3 + 0.5;
      const tx = r.x + Math.cos(a) * r.r * 0.84, ty = r.y + Math.sin(a) * r.r * 0.84, tz = cz + 2;
      const g0 = B.lift + k * B.stagger, g = lin(g0, g0 + B.fly, p), u = out3(g);
      if (g > 0) wake(id);
      const side = h.x < r.x ? -1 : 1;
      // a curve that rises and swings a little out on its own side before coming in to its point
      const c = { x: (h.x + tx) / 2 + side * 120, y: Math.min(h.cy, ty) - 150, z: (h.z + tz) / 2 + 80 };
      const fit6 = Math.min(1, (r.r * 0.45) / Math.max(h.w, h.h)), fade = sm(0, 0.6, f);
      const at = (uu) => {
        const bz = (a0, c0, b0) => (1 - uu) ** 2 * a0 + 2 * (1 - uu) * uu * c0 + uu * uu * b0;
        return `translate3d(${(bz(h.x, c.x, tx) - h.w / 2).toFixed(1)}px,${(bz(h.cy, c.y, ty) - h.h / 2).toFixed(1)}px,${bz(h.z, c.z, tz).toFixed(1)}px) rotateY(${(yaw * (1 - uu)).toFixed(2)}deg) scale(${(mix(1, fit6, uu) * mix(1, 0.12, fade)).toFixed(4)})`;
      };
      el.style.transform = at(u);
      const scl = mix(1, fit6, u) * mix(1, 0.12, fade);
      // its echoes: copies a little further back along the same path, fainter the further back, drawn out by the speed of
      // the scroll and gone as it settles at its point, so it is seen to fly rather than to slide
      const trail = g > 0 && g < 1 && !still() ? sm(0.02, 0.12, g) * (1 - sm(0.82, 1, g)) * mix(0.45, 1, speed) : 0;
      (ghosts[id] || []).forEach((gh, i) => {
        if (trail <= 0.01) { if (gh._on) { gh._on = false; gh.style.opacity = "0"; } return; }
        gh._on = true;
        const gg = Math.max(0, g - (i + 1) * 0.035 * (0.6 + speed * 1.6));
        gh.style.transform = at(out3(gg));
        gh.style.opacity = (trail * [0.5, 0.32, 0.19, 0.09][i]).toFixed(3);
      });
      el.style.opacity = (1 - sm(0.25, 0.6, f)).toFixed(3);
      // its name comes up as it lifts (one after another, with the stagger), stays at a steady size while it flies, and
      // goes as the camera pushes on, where the moon's doors take the same names in the same places
      const nm = el._nm || (el._nm = $(".rm-nm", el));
      const no = g > 0 ? sm(0, 0.35, g) * (1 - sm(B.push[0] - 0.25, B.push[0] + 0.05, p)) : 0;
      nm.style.opacity = no > 0.001 ? no.toFixed(3) : "";
      nm.style.scale = g > 0 ? (1 / scl).toFixed(3) : "";
      // no blur filter on the six themselves: the echoes carry the motion, and a filter on a moving picture costs a
      // repaint of the whole picture every frame
      // light blooms at its point as it arrives, and again as the circle lands
      blooms[k].style.opacity = Math.max(bell(lin(g0 + B.fly * 0.7, g0 + B.fly * 0.7 + 0.35, p)), 0.9 * bell(lin(0, 0.75, f))).toFixed(3);
    });
    sec.classList.toggle("lifted", p > B.lift);

    night.style.opacity = (1 - (B.night ? sm(B.night[0], B.night[1], p) : f)).toFixed(3);
    beam.style.opacity = (sm(B.rise[0] + 0.2, B.rise[1], p) * (1 - sm(0.05, 0.35, q))).toFixed(3);
    // the way past the room stays offered while the six fly and the star draws, until the ring heads out of the window
    skip.style.opacity = (1 - sm(B.push[0], B.push[0] + 0.35, p)).toFixed(3);
    skip.style.visibility = p > B.push[0] + 0.35 ? "hidden" : "";
    const hh = p < B.lift - 0.1 ? HINT : RISE;
    if (hero.dataset.hint !== hh) hero.dataset.hint = hh;
    if (liveEl && liveEl.textContent !== hh && p < B.land[1]) liveEl.textContent = hh;
  };

  /* ------------------------------------------------------------------ the scroll */
  const run = () => {
    if (still() || !SM.where(sec).h) {   // the section's height as the scroll keeps it, so no layout each frame
      if (spoke) { spoke = false; hero.dataset.hint = REST; SM.say(); document.body.classList.remove("in-room"); }
      inView = false; return;
    }
    build();
    spoke = true;
    const t = scrollT();
    inView = t > -1 && t < SPAN + 0.2;
    host.classList.toggle("rm-rest", !inView);
    if (!inView) { host.style.visibility = t > SPAN ? "hidden" : ""; return; }
    kick();
  };
  SM.scrub(run);
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (!set) return; if (built !== (SM.COLUMN.matches ? "tall" : "wide")) build(); else fit(); run(); }, 160); });

  /* skipping the intro goes straight to the moon's stop with its doors drawn in, and puts the keyboard on the first door */
  host.addEventListener("click", (e) => {
    if (!e.target.closest(".rm-skip")) return;
    e.preventDefault();
    const at = hero.offsetTop + (SM.COLUMN.matches ? 0 : (+hero.dataset.riseAt || 0.65) + 0.95) * SM.vh;
    scrollTo({ top: at, behavior: "instant" });
    requestAnimationFrame(() => $(".door", board)?.focus({ preventScroll: true }));
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
