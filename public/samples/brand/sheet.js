/* Shared by the five brand sheets: real content, the sheet switcher, swatches
   with measured contrast, the icon set, work cards, the ticker, a 1-bit
   ditherer for images and one small GPU shader with three looks (flow, dither,
   halftone). Each sheet calls what it needs; the look stays in its own CSS. */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/** The six parts of the site, each with a real piece of Lana's work. */
const PARTS = [
  { t: "Branding & pubmats", s: "10 brands", img: "/work/sm/acm-revival.webp" },
  { t: "One-off posters", s: "12 posters", img: "/work/sm/cs-night.webp" },
  { t: "Moving pictures", s: "10 edits", img: "/work/sm/brenia-18.webp" },
  { t: "UI/UX & code", s: "4 products", img: "/work/psyclick/app-dashboard-sm.webp" },
  { t: "About me", s: "Manila, they/them", img: "/work/lana-portrait.webp" },
  { t: "Let's talk", s: "Open to work", img: "/work/sm/pride-month.webp" },
];

/* ---------- the sheet switcher ---------- */
const SHEETS = ["Moon spell", "Night bloom", "Pop-up herbarium", "Lunar almanac", "Two-ink poster"];
{
  const here = Number((location.pathname.match(/(\d)\.html/) || [0, 0])[1]);
  document.body.insertAdjacentHTML(
    "beforeend",
    `<nav class="bar" aria-label="Brand sheets">${SHEETS.map((n, i) => `<a href="${i + 1}.html"${i + 1 === here ? ' aria-current="page"' : ""}>${i + 1}<span>&nbsp;${n}</span></a>`).join("")}<a href="../1.html">Hero samples</a></nav>`
  );
}

/* ---------- colour: WCAG contrast measured in the browser, not typed in ---------- */
function lum(hex) {
  const c = hex.replace("#", "").match(/../g).map((x) => parseInt(x, 16) / 255);
  const l = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
function grade(r) {
  return r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large" : "Decor only";
}
/** list: [{ name, hex, on, role }] where `on` is the text colour used on it */
function swatches(el, list) {
  el.innerHTML = list
    .map(({ name, hex, on, role }) => {
      const r = ratio(hex, on);
      return `<div class="sw"><i style="background:${hex};color:${on}">Aa</i><span><b>${name}</b>${hex.toUpperCase()} · ${role}<br>${grade(r)} ${r.toFixed(1)}:1 with ${on.toUpperCase()}</span></div>`;
    })
    .join("");
}

/* ---------- icons: one drawing set, styled by each sheet ---------- */
const ICON_NAMES = ["Branding", "Posters", "Motion", "UI/UX", "About", "Contact", "Spark"];
const ICONS = [
  // bloom: six petals round a heart
  [0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="12" cy="6.6" rx="2.9" ry="4.4" transform="rotate(${a} 12 12)"/>`).join("") + `<circle cx="12" cy="12" r="2.2" class="k"/>`,
  // a moon on a poster
  `<rect x="4.5" y="2.5" width="15" height="19" rx="1.5"/><path class="k" d="M14.4 7.6a4.4 4.4 0 1 0 1.9 6.9 3.6 3.6 0 0 1-1.9-6.9z"/>`,
  // play in a ring
  `<circle cx="12" cy="12" r="9.2"/><path class="k" d="M10 8.3v7.4l6.2-3.7z"/>`,
  // a window with a spark
  `<rect x="2.8" y="4.2" width="18.4" height="15.6" rx="2"/><path d="M2.8 8.6h18.4"/><path class="k" d="M12 10.6c.3 2.1 1.2 3 3.3 3.3-2.1.3-3 1.2-3.3 3.3-.3-2.1-1.2-3-3.3-3.3 2.1-.3 3-1.2 3.3-3.3z"/>`,
  // an eye
  `<path d="M2.4 12s3.6-6.4 9.6-6.4 9.6 6.4 9.6 6.4-3.6 6.4-9.6 6.4S2.4 12 2.4 12z"/><circle class="k" cx="12" cy="12" r="3"/>`,
  // a letter
  `<rect x="2.8" y="5.4" width="18.4" height="13.6" rx="2"/><path d="M3.4 6.6 12 13.2l8.6-6.6"/>`,
  // a four-point spark
  `<path class="k" d="M12 2.6c.7 5.7 3.7 8.7 9.4 9.4-5.7.7-8.7 3.7-9.4 9.4-.7-5.7-3.7-8.7-9.4-9.4 5.7-.7 8.7-3.7 9.4-9.4z"/>`,
];
/* the same seven, drawn on a 12 x 12 pixel grid for the bitmap sheet */
const PIX = [
  ".....##.........####.....##.####.##.####.##.####.####..####....#.##.#......#.##.#....####..####.####.##.####.##.####.##.....####.........##.....", // bloom
  "#############..........##....###...##...##.....##..##......##..##......##..##......##...##.....##....###...##..........##..........#############", // poster
  "...######.....#......#...#........#.#...#......##...##.....##...###....##...###....##...##.....##...#......#.#........#...#......#.....######...", // play
  "#############..........##############..........##....#.....##...###....##..#####...##...###....##....#.....##..........##..........#############", // window
  "............................####......##....##...#...##...#.#...####...##...####...#.#...##...#...##....##......####............................", // eye
  "............##############........###.#......#.##..#....#..##...#..#...##....##....##..........##..........#############........................", // letter
  ".....##..........##.........####........####......########..########################..########......####........####.........##..........##.....", // spark
];
function icons(el, mode = "line") {
  el.innerHTML = ICONS.map((d, i) => {
    let svg;
    if (mode === "pixel") {
      const bits = PIX[i].padEnd(144, ".").slice(0, 144);
      let rects = "";
      for (let k = 0; k < 144; k++) if (bits[k] === "#") rects += `<rect x="${k % 12}" y="${Math.floor(k / 12)}" width="1" height="1"/>`;
      svg = `<svg viewBox="0 0 12 12" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
    } else svg = `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
    return `<figure>${svg}<figcaption>${ICON_NAMES[i]}</figcaption></figure>`;
  }).join("");
}
const icon = (i) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i]}</svg>`;

/* ---------- work cards and the ticker ---------- */
function cards(el, n = 3, extra = () => "") {
  el.innerHTML = PARTS.slice(0, n)
    .map((p, i) => `<a class="card" href="#"><span class="ph"><img src="${p.img}" alt="" width="600" height="750" loading="lazy"></span><b>${p.t}</b><small>${p.s}</small>${extra(p, i)}</a>`)
    .join("");
}
function ticker(el, words, sep) {
  const run = `<span>${words.map((w) => `${w}${sep}`).join(`</span><span>`)}</span>`;
  el.innerHTML = `<div aria-hidden="true">${run}${run}</div><span class="vh">${words.join(", ")}</span>`;
}

/* ---------- 1-bit: redraw an image as two inks with a Bayer matrix ---------- */
const B8 = (() => {
  let m = [[0]];
  while (m.length < 8) {
    const n = m.length, r = [];
    for (let y = 0; y < n * 2; y++) { r.push([]); for (let x = 0; x < n * 2; x++) { const b = m[y % n][x % n] * 4; r[y].push(b + [[0, 2], [3, 1]][Math.floor(y / n)][Math.floor(x / n)]); } }
    m = r;
  }
  return m.map((row) => row.map((v) => (v + 0.5) / 64));
})();
function dither(img, ink, paper, px = 3, lift = 1.15) {
  const draw = () => {
    const w = Math.max(1, Math.round(img.clientWidth / px)), h = Math.max(1, Math.round(img.clientHeight / px));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    // cover-fit, like the photo under it
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    g.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
    const d = g.getImageData(0, 0, w, h), a = d.data;
    const I = ink.match(/\w\w/g).map((x) => parseInt(x, 16)), P = paper.match(/\w\w/g).map((x) => parseInt(x, 16));
    for (let i = 0; i < a.length; i += 4) {
      const k = i / 4, x = k % w, y = (k / w) | 0;
      const v = Math.min(1, ((0.3 * a[i] + 0.59 * a[i + 1] + 0.11 * a[i + 2]) / 255) * lift);
      const o = v > B8[y % 8][x % 8] ? I : P;
      a[i] = o[0]; a[i + 1] = o[1]; a[i + 2] = o[2]; a[i + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    c.className = "bit";
    c.setAttribute("aria-hidden", "true");
    img.after(c);
  };
  img.complete && img.naturalWidth ? draw() : img.addEventListener("load", draw, { once: true });
}

/* ---------- one GPU shader, three looks ----------
   mode 0 flow: slow bands of colour, like liquid silk
   mode 1 dither: the same bands as a 1-bit Bayer print; `wake` opens a circle of colour
   mode 2 halftone: the same bands as a rotated dot screen in one ink
   Runs only while on screen; with reduced motion it draws one still frame. */
const FRAG = `precision mediump float;
uniform vec2 r; uniform float t, mode, px, wake, dpr, dens; uniform vec2 wc;
uniform vec3 c0, c1, c2, c3;
float b2(vec2 a){ a = floor(a); return fract(dot(a, vec2(.5, a.y * .75))); }
float b4(vec2 a){ return b2(.5 * a) * .25 + b2(a); }
float b8(vec2 a){ return b4(.5 * a) * .25 + b2(a); }
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 q = p;
  q.x += .32 * sin(q.y * 2.2 + t * .19);
  q.y += .30 * sin(q.x * 1.8 - t * .16);
  q.x += .16 * sin(q.y * 4.3 - t * .11 + 1.7);
  float v = sin((q.x * 1.25 + q.y * 2.05) * 3.1 + t * .22) * .5 + .5;
  v = pow(v, 1.5);
  vec3 col = mix(c0, c1, smoothstep(0., .5, v));
  col = mix(col, c2, smoothstep(.45, .86, v));
  col = mix(col, c3, smoothstep(.88, 1., v));
  if (mode > .5 && mode < 1.5) {
    vec3 bit = v * dens > b8(gl_FragCoord.xy / (px * dpr)) ? c3 : c0;
    // awake, the sky stays night: no top colour, only the deeper bands
    vec3 sky = mix(c0, c1, smoothstep(0., .6, v));
    sky = mix(sky, c2, smoothstep(.55, 1., v));
    float d = distance(p, vec2(wc.x * asp, wc.y));
    col = mix(bit, sky, smoothstep(wake, wake - .02, d));
  } else if (mode > 1.5) {
    float cell = px * dpr;
    float an = .26;
    vec2 g = mat2(cos(an), -sin(an), sin(an), cos(an)) * gl_FragCoord.xy / cell;
    vec2 f = fract(g) - .5;
    float rad = sqrt(v * dens) * .58;
    col = mix(c0, c2, smoothstep(rad, rad - .08, length(f)));
  }
  gl_FragColor = vec4(col, 1.);
}`;
function hex3(h) { return h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255); }
/** opts: { mode: 0|1|2, colors: [4 hex], px: cell size in CSS px, dens: ink density, scale: canvas resolution, speed, wake, wc } */
function shader(canvas, opts) {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) { canvas.style.background = opts.colors[1]; return null; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr);
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n);
  opts.colors.forEach((c, i) => gl.uniform3fv(U("c" + i), hex3(c)));
  gl.uniform1f(U("mode"), opts.mode || 0);
  gl.uniform1f(U("px"), opts.px || 3);
  gl.uniform1f(U("dens"), opts.dens || 1);
  const state = { wake: opts.wake ?? 2, wc: opts.wc || [0.5, 0.5] };
  const scale = opts.scale || 1;
  let w = 0, h = 0, on = false, f = 0, t0 = performance.now() - 9000;
  const size = () => {
    const d = Math.min(devicePixelRatio || 1, 2) * scale;
    w = Math.round(canvas.clientWidth * d); h = Math.round(canvas.clientHeight * d);
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U("r"), w, h);
    gl.uniform1f(U("dpr"), d);
  };
  const frame = (now) => {
    f = 0;
    gl.uniform1f(U("t"), RM ? 9 : ((now - t0) / 1000) * (opts.speed || 1));
    gl.uniform1f(U("wake"), state.wake);
    gl.uniform2f(U("wc"), state.wc[0], state.wc[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (on && !RM) f = requestAnimationFrame(frame);
  };
  size();
  new ResizeObserver(() => { size(); if (!f) frame(performance.now()); }).observe(canvas);
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !f) f = requestAnimationFrame(frame); }).observe(canvas);
  document.addEventListener("visibilitychange", () => { on = !document.hidden; if (on && !f) f = requestAnimationFrame(frame); });
  frame(performance.now());
  /** animate `wake` (the radius of the colour circle) to a value */
  state.to = (target, ms = 1800) => {
    const from = state.wake, s = performance.now();
    const step = (now) => {
      const k = RM ? 1 : Math.min(1, (now - s) / ms);
      state.wake = from + (target - from) * (1 - Math.pow(1 - k, 3));
      if (!on || RM) frame(now);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  return state;
}

/* ---------- reveal panels once, as they come into view ---------- */
{
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.15 });
  addEventListener("DOMContentLoaded", () => $$(".panel").forEach((p) => io.observe(p)));
}
