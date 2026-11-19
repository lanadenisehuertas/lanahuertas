/* Shared by the five hero samples. */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The six parts of the site, with a real piece of Lana's work for each. */
const PARTS = [
  { t: "Branding & pubmats", s: "10 brands", img: "/work/sm/acm-revival.webp" },
  { t: "One-off posters", s: "12 posters", img: "/work/sm/cs-night.webp" },
  { t: "Moving pictures", s: "10 edits", img: "/work/sm/brenia-18.webp" },
  { t: "UI/UX & code", s: "4 products", img: "/work/psyclick/app-dashboard-sm.webp" },
  { t: "About me", s: "Manila, they/them", img: "/work/lana-portrait.webp" },
  { t: "Let's talk", s: "Open to work", img: "/work/sm/pride-month.webp" },
  { t: "Battle of the Bands", s: "Branding", img: "/work/sm/battle-of-the-bands.webp" },
  { t: "Spooktechular", s: "Poster", img: "/work/sm/spooktechular.webp" },
];

const NAMES = ["Bloom", "Gate", "Pop-up book", "Swarm", "Moon spell"];
const here = Number((location.pathname.match(/(\d)\.html/) || [0, 0])[1]);
document.body.insertAdjacentHTML(
  "beforeend",
  `<nav class="bar" aria-label="Samples">${NAMES.map((n, i) => `<a href="${i + 1}.html" ${i + 1 === here ? 'aria-current="page"' : ""}>${i + 1}<span>&nbsp;${n}</span></a>`).join("")}<button type="button" onclick="location.reload()">Replay</button><a href="brand/1.html">Brand sheets</a></nav>`
);

/** Layers with class .px lean with the mouse; the values are written on the scene itself, once per frame. */
function parallax(el) {
  if (RM || !matchMedia("(hover: hover)").matches) return;
  let f = 0, x = 0, y = 0;
  addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX / innerWidth - 0.5;
      y = e.clientY / innerHeight - 0.5;
      if (!f)
        f = requestAnimationFrame(() => {
          f = 0;
          el.style.setProperty("--mx", x.toFixed(3));
          el.style.setProperty("--my", y.toFixed(3));
        });
    },
    { passive: true }
  );
}
const card = (p, extra = "") => `<a class="card" href="#" ${extra}><img src="${p.img}" alt="" loading="lazy"><b>${p.t}<small>${p.s}</small></b></a>`;
