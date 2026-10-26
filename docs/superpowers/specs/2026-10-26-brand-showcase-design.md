# Brand showcase redesign — design

_2026-10-26 · approved in brainstorming_

## Goal

Turn the pubmats from a scattered gallery into **branded showcases**, after two
Behance references:

- **Ref 1** (Annisa, art director): chapter dividers ("Branding", "Campaign"),
  then per brand one intro screen — big serif name, two-line brief, role chips,
  tools chips, a hero mockup — followed by mockup screens on a backdrop in that
  brand's colours. Ends on a "Thank you!" screen.
- **Ref 2** (Flavia, illustrator): every collection gets its own world — a
  custom collage background, props and type matching the collection.

We take ref 1's intro-screen anatomy and ref 2's per-collection world, inside
the existing ethereal-garden site.

## Site structure

### Homepage `/`

1. **Hero** — same elements, re-composed (see _Hero_).
2. **Branding** — chapter card, then a carousel of all 15 brands (one per
   screen), ending on a "see every pubmat →" card linking to `/design`.
3. **Videos** — chapter card, then a carousel of the 7 videos, ending on a card
   linking to `/videos`. Each slide links to `/videos#<id>`.
4. **UI/UX & code** — chapter card, then PsyClick, Debt Ledger and Algebrawl,
   one screen each in ref 1's intro-screen format, on custom backdrops. Ends on
   a link to `/ui-ux`.
5. **About me** — unchanged (`AboutPanel`).
6. **Thank you** — the current `Contact` section, re-headed as a closing
   "Thank you!" screen. Contact form and links kept.

`FolderStack` (the folder tabs) is removed from the homepage.

### New pages

- **`/design`** — all 15 brands in order. Each: the same intro block as its
  carousel slide, then every pubmat of that set in a masonry grid with the
  existing lightbox (`ProjectModal`). After the brands, a **More posters** grid
  of one-offs. Brand sections are anchored (`/design#neostalgia`).
- **`/videos`** — every video: embedded player (existing Drive URLs), title,
  role, runtime, write-up. Anchored per video.
- **`/ui-ux`** — the full case studies: the current `CaseStudy` content,
  including PsyClick's app screens.

All three pages share `Nav` (links resolve to `/#…` from sub-pages) and the
closing Thank-you section.

### Nav

`branding · videos · ui/ux · about · contact` on the homepage (scroll-spy as
today). On sub-pages the same links point to `/#…`, plus the current page
marked.

## Hero

Same elements, one full-screen scene instead of name-above-band.

- The garden sky becomes the whole hero (`min-h-[100svh]`); the name moves
  _into_ the upper sky.
- Depth around the letters: far clouds, orbit and pixel swirls sit **behind**
  "Lana Denise"; the long vine weaves **through** it (passes behind some
  letters, in front of others — done with two clipped copies of the vine
  layer); the near butterfly perches on the "D"; the tall lotus and
  bellflowers rise **in front of** the bottom of the letters.
- The name joins the garden's pointer parallax (shallow depth); `MorphName`
  hover/scramble/glint unchanged.
- Subline and "See the work" sit on the garden floor at the bottom of the
  first screen.
- Mobile: the name breaks onto two lines ("Lana / Denise"); flowers frame it
  from the bottom corners.

## Brands, order and layouts

Ordered by visual strength, Revival X first, then Into the Code. Every event
is its own brand even within the same org.

| # | slug | Brand | Org · date | Layout | Backdrop (generated) |
|---|---|---|---|---|---|
| 1 | `revival-x` | ACM Revival X | ACM · Jan 2025 | Cover | chrome-violet nebula, liquid-metal ribbons |
| 2 | `into-the-code` | Into the Code F++ 5.0 | ACM · Mar 2024 | Speaker wall | deep navy grid tunnel, neon violet wireframe portal |
| 3 | `neostalgia` | NEOSTALGIA | CS Expo · 2026 | Spread | retro-futurist teal sky, ringed orange planet, cream clouds, rocket trail |
| 4 | `rock-of-aces` | Rock of Aces | SCC · 2025 | Phone fan | hot-pink/orange torn xerox paper, starbursts |
| 5 | `battle-of-the-bands` | Battle of the Bands | SCC · 2024 | Mirror | maroon sunburst stage, kraft paper, vintage mic |
| 6 | `biblioboo` | BiblioBOO & The Isolation Room | Library · Oct 2025 | Sticker sheet | moonlit haunted library shelves, cork board |
| 7 | `dystopia` | Dystopia | ACM · Jun 2024 | Cover | chrome cyber skyline at magenta-violet dusk |
| 8 | `tammy` | Tammy & KnowsMore | Library · 2026 | Sticker sheet | warm wooden shelves, green and gold light |
| 9 | `technorun` | TechnoRun | SCC · 2025 | Kit flat-lay | bright running-track lanes at sunrise |
| 10 | `pacsa` | Kulay PACSA | PACSA · 2025 | Spread | Filipino woven-pattern border, Baguio pine hills, golden clouds |
| 11 | `heartwired` | HeartWired | ACM · Feb 2025 | Phone fan | pink grid paper, hearts, ribbon, tape |
| 12 | `tabitayo` | Tabitayo | Client · 2026 | Mirror | wine-and-cream table setting, linen, candlelight |
| 13 | `elysium` | ACM Elysium 2024–25 | ACM · 2024–25 | Kit flat-lay | lavender aurora heavens, soft glow |
| 14 | `cs-night` | CS Night | ACM · 2026 | Speaker wall | art-deco gold on midnight, marquee lights |
| 15 | `techno-week` | Techno Week | SCC · 2025 | Spread | pastel Memphis shapes and confetti |

**More posters** (on `/design` only): ACM Ignition, Handog Ngiti 2023, SCC
general (certified org, birthdays, Never Again, Spooktechular, Holy Week,
Students' Recognition, Pixels Persona, Always Queer, Babae Ka), Library
seasonal posts (Back to School, EBSCO, Pride, finals, 3rd sem, New Year, 15
years, Research Consultation, Women's Month), Project Horizon, TechIbig, class
work.

Source folders map 1:1 from `D:\WORK\PORTFOLIO\PUBMATS` (e.g. `revival-x` ←
`02 FEU Tech ACM/03 ACM Revival (Jan 2025)`; `elysium` ←
`02 FEU Tech ACM/00 ACM Overall Theme 2024-2025` minus pieces belonging to
other brands; `tammy` ← `04 FEU Tech Library/12 Student Journey 2…` +
`13 Tammy mascot & sticker set`).

### Slide anatomy (shared)

- Full-screen slide; generated backdrop fills it (crossfades in as the slide
  arrives), site grain + a few pixel sparkles over it so it belongs to the
  garden.
- **Copy card** — pearl glass card: `NN / 15 · Org · Date` (pixel type),
  brand name (Cormorant display), one-line tagline (italic), two-line brief,
  role chips, tools chips, "View the full set →" (`/design#slug`). Text is
  always on the card, never directly on a backdrop, so contrast holds on every
  brand.
- **Collage** — only the real pubmats, never AI-generated or altered:
  printed-poster (tilted, soft shadow), phone frame (CSS device), die-cut
  stickers (no frame, drop shadow), product shots.
- Carousel chrome: prev/next arrows, numbered pips, swipe/trackpad, ←/→ keys.

### Layout variants

Seven arrangements so consecutive slides never look the same:

- **Spread** — copy card left, collage right: one tilted poster, one phone, two
  or three stickers.
- **Mirror** — collage left, copy card right.
- **Cover** — one key visual very large, bleeding off the right edge; copy card
  overlapping its lower-left corner.
- **Phone fan** — three phones fanned showing a campaign sequence; copy card
  above-left.
- **Sticker sheet** — die-cut pieces (mascots, stickers) scattered around a
  central copy card.
- **Kit flat-lay** — a tidy grid of products (singlets, bibs, frames, merch)
  with the copy card as one tile.
- **Speaker wall** — a row of portrait/speaker cards across the slide, copy
  card below.

On phones every variant collapses to: collage on top (reduced to its 1–3
strongest pieces), copy card below.

## Videos carousel

Seven slides, one per video in `workTabs.videos`. Slide: the widescreen poster
in a frame, blurred copy of the same poster as the slide backdrop (no
generation), copy card with title, role, runtime, play button → `/videos#id`.

## UI/UX & code

Three screens in the brand-slide anatomy (Spread / Mirror alternating) using
the existing `SiteMockup` / device mocks, on generated backdrops:

- PsyClick — calm lavender field with soft waveform lines
- Debt Ledger — pale ledger-paper grid, soft green ink
- Algebrawl — pixel arena sky (matches the game's pixel art)

## Backdrops (Codex)

18 images (15 brands + 3 UI/UX), generated with the Codex CLI
(`C:\Users\Lana\AppData\Local\OpenAI\Codex\bin\a96ca4c1eee0cf35\codex.exe exec`).
Prompt base: flat 2D poster illustration, light grain, soft dreamy light,
**no text, no logos, no people**, quiet negative space where the copy card and
collage sit, 16:9 landscape, in the brand's palette and motifs (table above).
Saved as webp (≤ 300 KB, 1920 wide) in `public/art/backdrops/<slug>.webp`.
Each is reviewed by eye; regenerate any that clash with the garden look.

## Data

`lib/content.ts` gains:

```ts
type BrandLayout = "spread" | "mirror" | "cover" | "fan" | "stickers" | "kit" | "wall";

type Brand = {
  slug: string;
  name: string;
  org: string;
  date: string;
  tagline: string;
  brief: string;       // two lines
  roles: string[];     // chips
  tools: string[];     // ToolBadge ids
  layout: BrandLayout;
  backdrop: string;    // /art/backdrops/<slug>.webp
  accent: string;      // brand colour for pips/links on that slide
  collage: ProjectImage[]; // 1–6 pieces, roles assigned by layout
  set: ProjectImage[];     // the full set for /design
  href?: string;           // Facebook post, where one exists
};
export const brands: Brand[];
export const morePosters: Project[];
```

Briefs and roles are drafted from folder contents and the Facebook credit
notes; Lana reviews them.

## Assets

A one-off script (`scripts/import-pubmats.py`, not shipped) converts the chosen
PUBMATS files to webp (max 1600 px long edge, q≈80) into
`public/work/brands/<slug>/` and prints `{src, w, h}` entries. PSD/AI/URL/MD
files are ignored. Near-duplicate exports (e.g. `MAIN POSTER` vs `MAIN POSTER
2`) are de-duplicated by eye: the final version is kept. The 54 DP blasts are
curated to ~12 for `/design`.

## Components

- `Carousel` — generic: scroll-snap track, arrows, pips, keys, active-index
  callback, `aria-roledescription="carousel"`, each slide
  `role="group" aria-label="3 of 15"`.
- `ChapterCard` — the ref-1 divider ("Branding", "Videos", "UI/UX & code").
- `BrandSlide` — copy card + `BrandCollage` + backdrop for one brand.
- `BrandCollage` — renders a layout variant from `brand.collage`.
- `PhoneFrame`, `PrintFrame`, `Sticker` — collage primitives.
- `VideoSlide`, `CodeSlide`.
- `BrandSection` (for `/design`) — intro block + masonry set + lightbox.
- `ThankYou` — `Contact` re-headed.
- `app/design/page.tsx`, `app/videos/page.tsx`, `app/ui-ux/page.tsx`.

## Behaviour and accessibility

- Images below the fold and off-slide are `loading="lazy"`; only the active
  and adjacent slides' backdrops load eagerly.
- `prefers-reduced-motion`: no crossfades, tilts or parallax; slides switch
  instantly.
- All copy meets WCAG AA on the pearl card (as the rest of the site).
- No horizontal page overflow from 320 px to 1920 px (carousel scrolls inside
  its own track).
- Sitemap gains `/design`, `/videos`, `/ui-ux`, each with its own metadata.

## Verification

No test framework in the repo; verification is:

- `npm run lint` and `npm run build` pass.
- Headless-Chrome screenshots of `/`, `/design`, `/videos`, `/ui-ux` at
  1440×900 and 390×844 (and every carousel slide at 1440), reviewed by eye.
- Keyboard: carousel reachable and operable with Tab and ←/→; lightbox focus
  trap still works.

## Out of scope

- Per-brand case-study pages (`/design/<slug>`).
- Editing or regenerating any pubmat itself.
- ACM X (Nov 2023) — its images are no longer in PUBMATS.
