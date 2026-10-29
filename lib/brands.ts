// The branding showcase: 10 brands in showcase order, strongest first,
// and the one-off posters row. Copy lives here; images come from the
// generated lib/brand-assets.ts (scripts/import-pubmats.py). Adding a
// brand = an entry in scripts/pubmats.json + scripts/backdrops.json + COPY.
import { brandAssets, moreAssets } from "./brand-assets";
import { workTabs, type Project, type ProjectImage } from "./content";

export type Brand = {
  slug: string;
  name: string;
  /** Shorter name for the project index. */
  short?: string;
  org: string;
  /** Display date on the slide. */
  date: string;
  /** Four-digit year. */
  year: string;
  tagline: string;
  brief: string;
  roles: string[];
  tools: string[];
  /** Brand colour: decorative only — never text. */
  accent: string;
  href?: string;
  /**
   * The three pieces the spread shows large: key visual, then two supporting
   * pieces, as file stems from the set. Defaults to the first three.
   */
  feature?: [string, string, string];
  /** Every piece, in showcase order — the filmstrip and the lightbox. */
  set: ProjectImage[];
  /** Indexes into `set` of the three featured pieces. */
  featured: [number, number, number];
};

type BrandCopy = Omit<Brand, "set" | "featured">;

const ACM = "FEU Tech ACM";
const SCC = "FEU Tech SCC";

const COPY: BrandCopy[] = [
  {
    slug: "revival-x",
    name: "ACM Revival X",
    short: "Revival X",
    org: ACM,
    date: "Jan 2025",
    year: "2025",
    tagline: "Chrome hands, reaching back in.",
    brief:
      "A three-day learning series — Data Dominance, Digital Frontiers, Git Grimoire. Reaching chrome hands and light-trail ribbons carry from the key visual into the day line-up and every speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#8f7cf0",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02ZnYurdY6YJNYMyhsNSbQRwEyuxygKd18zR3pB7BnKVLSi2MBWRrbHmAR8um12raul",
  },
  {
    slug: "into-the-code",
    name: "Into the Code F++ 5.0",
    short: "Into the Code",
    org: ACM,
    date: "Mar 2024",
    year: "2024",
    tagline: "A quantum odyssey in neon wireframe.",
    brief:
      "Outreach event built around a wireframe face dissolving into a light portal. The same neon violet runs through the main poster, the Zero to Hero, Quantum Odyssey and Quantum Revelry sessions, and every keynote and speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#b57cff",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02EDRQRLTiuXJojj9kX4wXLjsW1Vq65CAtnocZGYRVhX7KdfkpBU94apMnBgLvom85l",
  },
  {
    slug: "neostalgia",
    name: "NEOSTALGIA",
    org: "CS Expo 2026",
    date: "2026",
    year: "2026",
    tagline: "Retro-futurism for a computer science expo.",
    brief:
      "The full identity: a space-age key visual and logo, a sticker drive, die-cut stickers, fifty-plus team display pictures and officer intros.",
    roles: ["Logo", "Key visual", "Stickers", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#f08a2c",
    feature: ["main-poster", "sticker-drive-part-1", "7-lana"],
  },
  {
    slug: "tabitayo",
    name: "Tabitayo",
    org: "Client",
    date: "2026",
    year: "2026",
    tagline: "“Anong table ko?” — answered in seconds.",
    brief:
      "Brand and launch campaign for a Philippine event seat-finder: guests scan a QR code, search their name and walk to their seat. Wine-and-cream editorial type across every touchpoint.",
    roles: ["Brand identity", "Launch campaign", "Product marketing", "Print"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#7a1f3d",
    href: "https://www.facebook.com/tabitayo.ph",
  },
  {
    slug: "rock-of-aces",
    name: "Rock of Aces 6.0",
    short: "Rock of Aces",
    org: SCC,
    date: "2025",
    year: "2025",
    tagline: "Hot pink, loud on purpose.",
    brief:
      "The sixth annual band competition, staged for Technoweek 2025. Guitars, drums and keys burst out of a halftone starburst in hot pink and orange — carried through the band intros, partner posts, results and the thank-you.",
    roles: ["Event branding", "Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#ff3d8b",
    feature: ["496303697-1238893154916941-2972311716057454172-n", "485890480-1038198698332880-2237026441107111527-n", "486249653-1040034958149254-381792705508701673-n"],
    href: "https://www.facebook.com/share/p/1KiZ7sbrdp/",
  },
  {
    slug: "battle-of-the-bands",
    name: "Battle of the Bands",
    org: SCC,
    date: "Jun 2024",
    year: "2024",
    tagline: "Print, tape and torn paper.",
    brief:
      "A campus band competition at the Student Plaza. A print-and-tape collage of amps, cassette decks and vintage mics under torn-paper lettering, run across twenty posts — registration and rules, band intros, D-Day, the champions.",
    roles: ["Event branding", "Social media", "Layout"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#a3243b",
    feature: ["2024-05-09-facebook-01", "2024-06-08-facebook-d-day-01", "2024-06-07-facebook-meet-01"],
    href: "https://www.facebook.com/share/p/1JqSHiJsb7/",
  },
  {
    slug: "technorun",
    name: "TechnoRun 2025",
    short: "TechnoRun",
    org: SCC,
    date: "Sep 2025",
    year: "2025",
    tagline: "A run for a healthier FEUture.",
    brief:
      "A charity fun run at the Quirino Grandstand: an announcement carrying every distance, price and registration step, then the race kit — singlets and bibs in four colourways, one per distance.",
    roles: ["Event branding", "Apparel", "Print"],
    tools: ["Illustrator", "Photoshop"],
    accent: "#1f9bd8",
    feature: ["2025-07-31-facebook-01", "3k", "technorun-information"],
    href: "https://www.facebook.com/share/p/19F1hRVPpk/",
  },
  {
    slug: "pacsa",
    name: "Kulay PACSA 2025",
    short: "Kulay PACSA",
    org: "PACSA",
    date: "2025",
    year: "2025",
    tagline: "Woven colour for a national convention.",
    brief:
      "A national convention of campus student advisers in Baguio. One border drawn from Filipino woven textiles carries the DP frames, the speaker line-up, announcements and slide template, and the Teachers Camp house rules.",
    roles: ["Event branding", "Templates", "DP frames"],
    tools: ["Illustrator", "Photoshop"],
    accent: "#f07c1f",
    feature: ["all-speakers", "btc-house-rules", "dp-frame-2-1"],
  },
  {
    slug: "elysium",
    name: "ACM Elysium",
    short: "Elysium",
    org: ACM,
    date: "2024–25",
    year: "2024",
    tagline: "One violet glow for a whole year.",
    brief:
      "The chapter's look for the 2024–25 year: soft violet gradients, chrome and script. It ran from What is ACM, the vision and the mission through the kick-off, merch, sponsors, congratulations and greetings.",
    roles: ["Org identity", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#9b5de5",
    feature: ["2024-08-31-facebook-01", "2024-09-19-facebook-01", "2025-04-21-facebook-02"],
    href: "https://www.facebook.com/feutechACM/posts/pfbid022vVEsU35o3qXJByNrH2cEGbuNy3oYkvEF17znYsmv7BadJJK5bY73vo2jJK9U4tPl",
  },
  {
    slug: "techno-week",
    name: "Techno Week 2025",
    short: "Techno Week",
    org: SCC,
    date: "Feb 2025",
    year: "2025",
    tagline: "Pastel Memphis, all week long.",
    brief:
      "Festival-week poster in a pastel Memphis style — overlapping colour blocks, floating app icons and a ribbon carrying the dates — with the matching frame and schedule posts.",
    roles: ["Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    accent: "#5b8def",
  },
];

export const brands: Brand[] = COPY.map((c) => {
  const a = brandAssets[c.slug];
  if (!a) throw new Error(`No assets for brand "${c.slug}" — run scripts/import-pubmats.py`);
  const stem = (img: ProjectImage) => img.src.slice(img.src.lastIndexOf("/") + 1).replace(/\.webp$/, "");
  const featured = (c.feature ?? []).map((f) => {
    const i = a.set.findIndex((img) => stem(img) === f);
    if (i < 0) throw new Error(`brand "${c.slug}": feature "${f}" is not in its set`);
    return i;
  });
  for (let i = 0; featured.length < 3 && i < a.set.length; i++) if (!featured.includes(i)) featured.push(i);
  while (featured.length < 3) featured.push(featured[featured.length - 1] ?? 0);
  return { ...c, set: a.set, featured: featured as [number, number, number] };
});

export const backdropSrc = (slug: string) => `/art/backdrops/${slug}.webp`;

/* ---- Posters: one-offs and class work, CS Night first -------------------- */

export type Poster = { id: string; title: string; meta: string; img: ProjectImage };

const SCC_FULL = "FEU Tech SCC";
const more = (id: string, i = 0) => {
  const img = moreAssets[id]?.[i];
  if (!img) throw new Error(`posters: no image ${i} for "${id}" in brand-assets.ts`);
  return img;
};
const csNight = brandAssets["cs-night"]?.set[0];
if (!csNight) throw new Error('posters: no "cs-night" image in brand-assets.ts');

export const posters: Poster[] = [
  { id: "cs-night", title: "CS Night 2026", meta: "FEU Tech ACM · 2026", img: csNight },
  { id: "handog-ngiti", title: "Handog Ngiti", meta: `${SCC_FULL} · 2023`, img: more("handog-ngiti", 0) },
  { id: "handog-ngiti-thanks", title: "Handog Ngiti, thank-you", meta: `${SCC_FULL} · 2023`, img: more("handog-ngiti", 1) },
  { id: "students-recognition", title: "Students’ Recognition", meta: `${SCC_FULL} · 2025`, img: more("students-recognition") },
  { id: "pixels-persona", title: "Pixels & Persona", meta: SCC_FULL, img: more("pixels-persona") },
  { id: "always-queer", title: "Always Queer", meta: `${SCC_FULL} · 2025`, img: more("always-queer") },
  { id: "womens-month-library", title: "Women’s Month", meta: "FEU Tech Library · 2025", img: more("womens-month-library") },
  { id: "against-the-orbit", title: "Against the Orbit of Faith", meta: "Class work · movie poster", img: more("class-work", 4) },
  { id: "pieces-that-form", title: "Pieces That Form", meta: "Class work · self-portrait", img: more("class-work", 1) },
  { id: "boxed-self", title: "Unpacking Your Boxed Self", meta: "Class work", img: more("class-work", 2) },
  { id: "mediocre-at-best", title: "Mediocre at Best", meta: "Class work", img: more("class-work", 3) },
  { id: "copernican-revolution", title: "Copernican Revolution", meta: "Class work · infographic", img: more("class-work", 0) },
];

/* ---- Videos --------------------------------------------------------------- */

export const videos: Project[] = workTabs.find((t) => t.id === "videos")?.projects ?? [];
