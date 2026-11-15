# Portfolio — Lana Denise Huertas

Personal portfolio: graphic design, video editing, and software engineering.

Built with Next.js (App Router), Tailwind CSS v4, and TypeScript. Deployed on Vercel.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build    # production build
npm start        # serve the production build
```

## How it is organised

```
app/
  layout.tsx        fonts, metadata, background layers
  page.tsx          section order: Hero, FolderStack, AboutPanel, Contact
  globals.css       design tokens (@theme) and every utility/keyframe
components/         one component per piece of the page
lib/content.ts      all copy, projects, experience, skills — the single source of truth
public/work/        images
figma-plugin/       generates a Figma snapshot of the design (see below)
docs/               design decisions and the reasoning behind them
```

**Content is data.** Titles, descriptions, project lists, experience, skills, and
tool badges all live in `lib/content.ts`. Adding a project or a whole new work
category is an edit to that file, not to a component.

**Colour is centralised.** The palette is defined once in the `@theme` block in
`app/globals.css`. Roles were assigned by measured contrast, not by eye — the
comment above the tokens records which pairings pass and which are decorative
only. `lavender` in particular is never used behind text.

## Adding a project

Add an entry to the relevant tab's `projects` array in `lib/content.ts`:

```ts
{
  id: "unique-slug",
  title: "Project title",
  description: "What it was and what you did.",
  year: "2026",
  images: [{ src: "/work/filename.webp", w: 1200, h: 1500 }],
  span: 3,            // 3 or 6 — the masonry grid only accepts these
}
```

Put the image in `public/work/`. The grid sizes each card from the `w`/`h` you
supply, so they must match the real file or the layout will jump once it loads.

`span` is restricted to 3 and 6 on purpose: in a 12-column grid, mixing 3 and 4
leaves gaps that cannot be filled (3+4+3 = 10, and nothing fits the remaining 2).

## Deploying

Pushing to `main` deploys automatically if the repo is connected to Vercel.

Once a custom domain is attached, set `NEXT_PUBLIC_SITE_URL` to it in the Vercel
project settings. Share previews (Open Graph / Twitter cards) need absolute URLs;
without it they fall back to the per-deployment Vercel URL.

## Figma

`figma-plugin/` contains a plugin that redraws the current design as a Figma
file, for editing details by hand.

It is a **snapshot, not a sync** — Figma edits do not flow back to the site, and
site changes do not reach Figma. Re-run it after significant design changes, and
delete the old frame first, since it appends rather than replaces.

## Accessibility

Verified in the browser rather than assumed:

- All text meets WCAG AA contrast (4.5:1 body, 3:1 large), measured across every
  folder tab
- The project dialog traps focus, closes on Escape, and returns focus to the card
  that opened it
- `prefers-reduced-motion` stops the drifting background and removes the sparkle
  layer
- No horizontal overflow from 320px to 1920px
