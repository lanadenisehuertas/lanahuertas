// The branding showcase: 14 brands in showcase order, strongest first.
// Copy lives here; images come from the generated lib/brand-assets.ts
// (scripts/import-pubmats.py). Adding a brand = an entry in
// scripts/pubmats.json + scripts/backdrops.json + COPY below.
import { brandAssets, moreAssets, type CollageRole } from "./brand-assets";
import { workTabs, type Project, type ProjectImage } from "./content";

export type BrandLayout = "spread" | "mirror" | "cover" | "fan" | "stickers" | "kit" | "wall";

export type Brand = {
  slug: string;
  name: string;
  org: string;
  /** Shown on the phone mockups' header. */
  handle: string;
  /** Display date on the slide. */
  date: string;
  /** Four-digit year, for the gallery's range label. */
  year: string;
  tagline: string;
  brief: string;
  roles: string[];
  tools: string[];
  layout: BrandLayout;
  /** Brand colour: decorative only (pips, card hairline) — never text. */
  accent: string;
  href?: string;
  collage: Partial<Record<CollageRole, ProjectImage[]>>;
  set: ProjectImage[];
};

type BrandCopy = Omit<Brand, "collage" | "set">;

const ACM = "FEU Tech ACM";
const SCC = "FEU Tech SCC";

const COPY: BrandCopy[] = [
  {
    slug: "revival-x",
    name: "ACM Revival X",
    org: ACM,
    handle: "feutechacm",
    date: "Jan 2025",
    year: "2025",
    tagline: "Chrome hands, reaching back in.",
    brief:
      "A three-day learning series — Data Dominance, Digital Frontiers, Git Grimoire. Reaching chrome hands and light-trail ribbons carry from the key visual into the day line-up and every speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "cover",
    accent: "#8f7cf0",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02ZnYurdY6YJNYMyhsNSbQRwEyuxygKd18zR3pB7BnKVLSi2MBWRrbHmAR8um12raul",
  },
  {
    slug: "into-the-code",
    name: "Into the Code F++ 5.0",
    org: ACM,
    handle: "feutechacm",
    date: "Mar 2024",
    year: "2024",
    tagline: "A quantum odyssey in neon wireframe.",
    brief:
      "Outreach event built around a wireframe face dissolving into a light portal. The same neon violet runs through the main poster, the Zero to Hero, Quantum Odyssey and Quantum Revelry sessions, and every keynote and speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards"],
    tools: ["Photoshop", "Illustrator"],
    layout: "wall",
    accent: "#b57cff",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02EDRQRLTiuXJojj9kX4wXLjsW1Vq65CAtnocZGYRVhX7KdfkpBU94apMnBgLvom85l",
  },
  {
    slug: "neostalgia",
    name: "NEOSTALGIA",
    org: "CS Expo 2026",
    handle: "csexpo",
    date: "2026",
    year: "2026",
    tagline: "Retro-futurism for a computer science expo.",
    brief:
      "The full identity: a space-age key visual and logo, teasers and a sticker drive, die-cut stickers, fifty-plus team display pictures, officer intros, team posters and nameplates, a sponsor call, and jackets in three colourways.",
    roles: ["Logo", "Key visual", "Stickers", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    layout: "spread",
    accent: "#f08a2c",
  },
  {
    slug: "tabitayo",
    name: "Tabitayo",
    org: "Client",
    handle: "tabitayo.ph",
    date: "2026",
    year: "2026",
    tagline: "“Anong table ko?” — answered in seconds.",
    brief:
      "Brand and launch campaign for a Philippine event seat-finder: guests scan a QR code, search their name and walk to their seat. Wine-and-cream editorial type across the teaser, the how-it-works series, the app screens and the printed seating card.",
    roles: ["Brand identity", "Launch campaign", "Product marketing", "Print"],
    tools: ["Photoshop", "Illustrator"],
    layout: "mirror",
    accent: "#7a1f3d",
    href: "https://www.facebook.com/tabitayo.ph",
  },
  {
    slug: "rock-of-aces",
    name: "Rock of Aces 6.0",
    org: SCC,
    handle: "feutechscc",
    date: "2025",
    year: "2025",
    tagline: "Hot pink, loud on purpose.",
    brief:
      "The sixth annual band competition, staged for Technoweek 2025. Guitars, drums and keys burst out of a halftone starburst in hot pink and orange — carried through the band intros, partner posts, results and the thank-you.",
    roles: ["Event branding", "Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "fan",
    accent: "#ff3d8b",
    href: "https://www.facebook.com/share/p/1KiZ7sbrdp/",
  },
  {
    slug: "battle-of-the-bands",
    name: "Battle of the Bands",
    org: SCC,
    handle: "feutechscc",
    date: "Jun 2024",
    year: "2024",
    tagline: "Print, tape and torn paper.",
    brief:
      "A campus band competition at the Student Plaza. A print-and-tape collage of amps, cassette decks and vintage mics under torn-paper lettering, run across twenty posts — registration and rules, band intros, D-Day, the champions.",
    roles: ["Event branding", "Social media", "Layout"],
    tools: ["Photoshop", "Illustrator"],
    layout: "mirror",
    accent: "#a3243b",
    href: "https://www.facebook.com/share/p/1JqSHiJsb7/",
  },
  {
    slug: "biblioboo",
    name: "BiblioBOO",
    org: "FEU Tech Library",
    handle: "feutechlibrary",
    date: "Oct 2025",
    year: "2025",
    tagline: "A haunted book nook and The Isolation Room.",
    brief:
      "Halloween at the library: a ghost mascot, a detective corkboard whose game rules double as the layout, and a four-film screening series for The Isolation Room.",
    roles: ["Mascot", "Campaign", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "stickers",
    accent: "#c7924a",
  },
  {
    slug: "dystopia",
    name: "Dystopia",
    org: ACM,
    handle: "feutechacm",
    date: "Jun 2024",
    year: "2024",
    tagline: "Celebrating tech beyond the horizon.",
    brief:
      "Flagship poster for a week-long tech celebration: distressed chrome lettering over a magenta-lit skyline, with the title ghosted in reflection — carried into the sponsor thank-yous.",
    roles: ["Key visual", "Sponsor posts"],
    tools: ["Photoshop", "Illustrator"],
    layout: "cover",
    accent: "#e0399a",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02YKV4nN6cKVUwPYQzWnsBac3iA8gyuX2jJfcovPQBxXt68AwZNwmZXmGkFM3Jxkvl",
  },
  {
    slug: "technorun",
    name: "TechnoRun 2025",
    org: SCC,
    handle: "feutechscc",
    date: "Sep 2025",
    year: "2025",
    tagline: "A run for a healthier FEUture.",
    brief:
      "A charity fun run at the Quirino Grandstand: an announcement carrying every distance, price and registration step, then the race kit — singlets and bibs in four colourways, one per distance.",
    roles: ["Event branding", "Apparel", "Print"],
    tools: ["Illustrator", "Photoshop"],
    layout: "kit",
    accent: "#1f9bd8",
    href: "https://www.facebook.com/share/p/19F1hRVPpk/",
  },
  {
    slug: "pacsa",
    name: "Kulay PACSA 2025",
    org: "PACSA",
    handle: "pacsa.ph",
    date: "2025",
    year: "2025",
    tagline: "Woven colour for a national convention.",
    brief:
      "A national convention of campus student advisers in Baguio. One border drawn from Filipino woven textiles carries the DP frames, the speaker line-up, announcements and slide template, and the Teachers Camp house rules.",
    roles: ["Event branding", "Templates", "DP frames"],
    tools: ["Illustrator", "Photoshop"],
    layout: "spread",
    accent: "#f07c1f",
  },
  {
    slug: "heartwired",
    name: "HeartWired",
    org: ACM,
    handle: "feutechacm",
    date: "Feb 2025",
    year: "2025",
    tagline: "Meet the hosts, scrapbook style.",
    brief:
      "A Valentine's event host reveal built as a pink scrapbook — tape, stickers, snapshots and hand-drawn hearts around each host.",
    roles: ["Social media", "Layout"],
    tools: ["Photoshop"],
    layout: "fan",
    accent: "#ff7fb0",
    href: "https://www.facebook.com/feutechACM/posts/pfbid036JJNmdNpw2UvffDhK9PmQog9RrZanMy6JWUDUudr45aLg6QowP8UH2oZUYeKt1aZl",
  },
  {
    slug: "elysium",
    name: "ACM Elysium",
    org: ACM,
    handle: "feutechacm",
    date: "2024–25",
    year: "2024",
    tagline: "One violet glow for a whole year.",
    brief:
      "The chapter's look for the 2024–25 year: soft violet gradients, chrome and script. It ran from What is ACM, the vision and the mission through the kick-off, merch, sponsors, congratulations and greetings.",
    roles: ["Org identity", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    layout: "kit",
    accent: "#9b5de5",
    href: "https://www.facebook.com/feutechACM/posts/pfbid022vVEsU35o3qXJByNrH2cEGbuNy3oYkvEF17znYsmv7BadJJK5bY73vo2jJK9U4tPl",
  },
  {
    slug: "cs-night",
    name: "CS Night 2026",
    org: ACM,
    handle: "feutechacm",
    date: "Jun 2026",
    year: "2026",
    tagline: "A masquerade for the 19th anniversary.",
    brief:
      "Performer line-up for the chapter's 19th anniversary, staged as a masquerade ball: eight acts and two hosts in gilded frames up a staircase — a billing order that reads without a single label.",
    roles: ["Key visual", "Compositing"],
    tools: ["Photoshop"],
    layout: "cover",
    accent: "#d4a64a",
    href: "https://www.facebook.com/share/p/1DqJRPbhVz/",
  },
  {
    slug: "techno-week",
    name: "Techno Week 2025",
    org: SCC,
    handle: "feutechscc",
    date: "Feb 2025",
    year: "2025",
    tagline: "Pastel Memphis, all week long.",
    brief:
      "Festival-week poster in a pastel Memphis style — overlapping colour blocks, floating app icons and a ribbon carrying the dates — with the matching frame and schedule posts.",
    roles: ["Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "spread",
    accent: "#5b8def",
  },
];

export const brands: Brand[] = COPY.map((c) => {
  const a = brandAssets[c.slug];
  if (!a) throw new Error(`No assets for brand "${c.slug}" — run scripts/import-pubmats.py`);
  return { ...c, ...a };
});

export const backdropSrc = (slug: string) => `/art/backdrops/${slug}.webp`;

/** A brand's full set as one lightbox entry per piece, for /design. */
export function brandPieces(b: Brand): Project[] {
  return b.set.map((img, i) => ({
    id: `${b.slug}-${i + 1}`,
    title: `${b.name} — ${String(i + 1).padStart(2, "0")}`,
    year: b.year,
    client: b.org,
    role: b.roles.join(", "),
    tools: b.tools,
    description: b.brief,
    href: b.href,
    hrefLabel: b.href ? "See the post" : undefined,
    images: [img],
  }));
}

/* ---- More posters: one-offs that are not a brand of their own ---------- */

// Existing graphic-design entries that no brand covers, in this order.
const KEEP = [
  "techibig",
  "student-orgs-fair",
  "acm-ignition",
  "spooktechular",
  "never-again",
  "back-to-school",
  "pride-month",
  "feu-library",
  "certified-organization",
  "project-horizon",
  "artist-connection-sizes",
];

const existing = workTabs.flatMap((t) => t.projects);

const kept: Project[] = KEEP.map((id) => {
  const p = existing.find((x) => x.id === id);
  if (!p) throw new Error(`morePosters: no project "${id}" in content.ts`);
  if (id !== "feu-library") return p;
  // BiblioBOO is its own brand now; the library entry keeps the rest.
  return {
    ...p,
    images: p.images.filter((i) => !i.src.includes("biblioboo")),
    description:
      "An ongoing series for the campus library, where the brief was almost always the same: make an administrative notice worth stopping for.\n\nThe database announcement became a what-this-means-for-you list. Finals-week opening hours arrived disguised as a multiple-choice question — the schedule only turns up after the joke has landed.",
  };
});

const added: Project[] = [
  {
    id: "handog-ngiti",
    title: "Handog Ngiti 2023",
    year: "2023",
    client: "Student Coordinating Council — FEU Tech",
    role: "Event poster and thank-you post",
    tools: ["Photoshop"],
    description:
      "A Christmas gift-giving drive. Ornaments and pine set the season, and the event details sit on a red bauble so they read at a glance.",
    images: moreAssets["handog-ngiti"],
  },
  {
    id: "pixels-persona",
    title: "Pixels Persona",
    client: "Student Coordinating Council — FEU Tech",
    role: "Poster design",
    tools: ["Photoshop"],
    description: "Cosplay showdown poster — neon violet game-art characters under pixel title lettering.",
    images: moreAssets["pixels-persona"],
  },
  {
    id: "always-queer",
    title: "Always Queer",
    year: "2025",
    client: "Student Coordinating Council — FEU Tech",
    role: "Collage and layout",
    tools: ["Photoshop"],
    description: "Pride Month collage: cut-paper type, stickers and scrawled notes layered into one loud page.",
    images: moreAssets["always-queer"],
  },
  {
    id: "students-recognition",
    title: "Annual Students' Recognition 2025",
    year: "2025",
    client: "Student Coordinating Council — FEU Tech",
    role: "Poster design",
    tools: ["Photoshop", "Illustrator"],
    description: "Awards-night poster framed in Filipino woven patterns, in warm orange and gold.",
    images: moreAssets["students-recognition"],
  },
  {
    id: "womens-month-library",
    title: "Women's Month",
    year: "2025",
    client: "FEU Tech Library",
    role: "Design and retouching",
    tools: ["Photoshop"],
    description: "Women's Month feature for the library: archival portraits graded into one violet field.",
    images: moreAssets["womens-month-library"],
  },
  {
    id: "class-work",
    title: "Class design work",
    role: "Coursework",
    tools: ["Photoshop", "Illustrator"],
    description:
      "Pieces from design classes: an infographic on the Copernican revolution, a self-portrait collage, and three posters.",
    images: moreAssets["class-work"],
  },
];

export const morePosters: Project[] = [...kept, ...added];

/* ---- Videos --------------------------------------------------------------- */

export const videos: Project[] = workTabs.find((t) => t.id === "videos")?.projects ?? [];
