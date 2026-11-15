// The folder tabs, in the order the live site shows the work: branding,
// posters, videos (the "ui/ux & code" tab is added by FolderStack). The
// content is the current site's: the ten curated brands and the posters row
// from lib/brands.ts, and the videos with Brenia first.
import { brands, posters, videos } from "./brands";
import { workTabs, type Project, type WorkTab } from "./content";

const brandProjects: Project[] = brands.map((b, i) => {
  // the brand's key visual is the card cover; the rest follow in set order
  const order = [...b.featured, ...b.set.map((_, k) => k).filter((k) => !b.featured.includes(k))];
  const images = [...new Set(order)].map((k) => b.set[k]);
  return {
    id: b.slug,
    title: b.name,
    span: i % 3 === 0 ? 6 : 3,
    year: b.year,
    client: b.org,
    role: b.roles.join(" · "),
    tools: b.tools,
    description: `${b.tagline}\n\n${b.brief}`,
    href: b.href,
    hrefLabel: b.href ? "See the launch post" : undefined,
    images,
  };
});

const posterProjects: Project[] = posters.map((p) => ({
  id: p.id,
  title: p.title,
  span: 3,
  client: p.meta,
  images: [p.img],
}));

export const displayTabs: WorkTab[] = [
  {
    id: "branding",
    label: "branding",
    heading: "Branding",
    blurb:
      "Ten event identities, key visuals and social systems for student organizations and clients, 2023 to 2026. Each one carries a single idea from the key visual into every post, card and print.",
    accent: "eminence",
    projects: brandProjects,
  },
  {
    id: "posters",
    label: "posters",
    heading: "Posters",
    blurb: "One-off pieces for campus events, campaigns and causes, and class work.",
    accent: "fawn",
    projects: posterProjects,
  },
  // the videos tab keeps its own copy from content.ts, with Brenia first
  { ...workTabs.find((t) => t.id === "videos")!, projects: videos },
];
