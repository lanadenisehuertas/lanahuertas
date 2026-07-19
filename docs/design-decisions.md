# Portfolio — design decisions

_2026-07-18_

## What this is

Personal portfolio for Lana Denise Huertas. Graphic design and video editing today,
software engineering added as an equal half. Next.js (App Router) + Tailwind v4,
deployed to Vercel.

## Decisions

**Figma was dropped, deliberately.** Figma has no public write API — the REST API is
read-only for file content, and every Figma MCP server (official Dev Mode included)
reads existing designs to generate code from them. The only authoring path is a Figma
plugin running inside Figma. Rather than generate a Figma file with no live link to the
site, we build the site directly and iterate in a browser preview.

**Palette: the swatch-card reference.** Dark Ultramarine `#290087` ground, Honeydew
`#F6FFE9` panels, Vanilla Custard `#F2E0A4` display type, Amethyst `#A230A4` and
Periwinkle `#CAC5E5` accents.

One deviation from a literal reading: **Amethyst on Dark Ultramarine measures 2.42:1**,
below the 3:1 floor for large text. So the hero wordmark uses Vanilla Custard (11.06:1)
and Amethyst is reserved for accents on light panels, where it has contrast.

Two motifs are lifted from the reference image itself: the **aurora gradient wash**
(radial blooms behind the hero) and the **four-point sparkle**.

**Layout: reference 1.** Heavy geometric sans (Poppins), hard offset shadows,
tab-folder cards.
Reference 2's dense poster-grid *composition* is used inside the work panels, but
rendered in this palette — its cream-and-serif editorial treatment was dropped because
the two systems use opposite navigation metaphors (click-to-switch vs. scroll-through).

**Content is data.** Everything lives in `lib/content.ts`. Work categories are an array;
adding one — including the engineering showcase — is a data change, not a rewrite.

## Design validation (ui-ux-pro-max)

Ran the design skill against the build. It independently recommended **Neo Brutalism**
for a creative portfolio — thick borders, hard offset shadows, colour blocking,
mechanical press, slight card rotation — which matched the direction already taken.

Four real violations were found by auditing the live DOM, not by inspection:

| Issue | Severity | Fix |
|---|---|---|
| All 5 tab buttons had `cursor: default` | Medium | Tailwind v4 dropped the `<button>` default; added `cursor-pointer` |
| Touch targets 38px tall | **Critical** | `min-h-[44px]` on tabs and contact links |
| `★` text glyph used as an icon (×2) | Medium | Replaced with the `Sparkle` SVG component |
| No visible focus rings | **High** | Global `:focus-visible` outline in custard |

Added per the style's motion spec: mechanical press (`translate` equal to the shadow
offset, shadow collapses to 0), hover lift + slight rotation on grid cells, staggered
scroll reveal.

`prefers-reduced-motion` forces `.reveal` to `opacity: 1` and zeroes transitions, and
`Reveal.tsx` checks the media query before creating the observer — so content can never
be stranded invisible if the observer fails or motion is disabled. Verified: all reveal
nodes reach `opacity: 1` on scroll.

## Page order

1. Title area — name-led (`Hi, I'm Lana. / Designer, video editor, and problem solver.`)
2. About me, short — one folder, portrait + a paragraph
3. Projects — five switchable folders
4. About me, extended — three switchable folders (experience / education / skills)
5. Contact — one folder

Every section is a folder, so the metaphor labels the whole page rather than only the
work section.

## The folder drawer

The work section is a stack of manila folders, not browser tabs
(`components/FolderStack.tsx`).

- **Tab shape** — rounded rectangles (`rounded-t-xl`). An earlier version used an
  angled `clip-path` notch; the rounded form was preferred and the clip-path removed.
- **Sheet placement** — switching re-keys the panel (`key={activeTab.id}`) so React
  remounts it and the `paper-drop` keyframes replay. The sheet is released 26px above
  the stack with a 0.5deg tilt and slight upscale, then settles. The shadow starts wide
  and soft (in the air) and tightens to the hard offset shadow (landed) — that shadow
  transition is what sells the depth, more than the movement does. Content inside runs
  `paper-content` on a 90ms delay so it appears to settle onto the sheet.
- **The stack** — two decorative sheets sit behind the panel at slight offsets and
  opposing rotations, so there is visibly something for the new sheet to land on.
  `aria-hidden`, purely decorative.
- **Tight row** — tabs overlap horizontally by `-12px` along a single top edge. An
  earlier version stacked each folder vertically with its own visible body strip; that
  left far too much dead vertical space before any content appeared.
- **Tucking** — the active tab sits at `translateY(0)` with `z-40`; inactive tabs sit
  at `translateY(7px)` with `z-10+i`, below the folder front (`z-30`), so they read as
  tucked into the folder rather than floating above it.
- **One panel** — only the active folder has a body. Switching swaps content in place;
  nothing expands or collapses, so there is no layout push.
- **Colour per folder** — amethyst / custard / periwinkle / honeydew / violet, each
  paired with a text colour that clears contrast on that fill.

Opening a folder does not move the page: verified scroll position identical before and
after a switch (1985 -> 1985). This is the failure the Figma prototype had.

## Project lightbox

Clicking a card opens `components/ProjectModal.tsx` — full image (or video player)
alongside title, description, client, role, year, and tools.

Accessibility, all verified live rather than assumed:

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Focus moves to Close on open, returns to **the exact card that opened it** on close
- Escape closes; scrim click closes; scrim is a real `<button>` with an aria-label
- Tab is trapped inside the dialog and wraps
- Background scroll locked, with `padding-right` compensating for the scrollbar so the
  page does not jump

### Bug found during verification

Focus initially landed on the hero badge instead of the Close button. Cause: `handleKey`
was in the focus effect's dependency array, and `onClose` gets a new identity on every
parent render — so the effect tore down and re-ran constantly, and its cleanup's
focus-restore fired immediately after open. Fixed by splitting into two effects: focus
and scroll lock depend only on `open`; the key listener re-binds freely.

This is why focus behaviour needs to be exercised, not eyeballed — the dialog looked
perfect on screen while being unusable by keyboard.

### Empty slots

Placeholder cards are clickable and open the dialog in an empty state naming the slot
number and pointing at `lib/content.ts`. Nothing is invented — no fake project titles
or descriptions stand in for real work.

## Content notes

- **"7+ years" is correct and confirmed.** Lana has been doing graphic design and video
  editing since 2019 through school and org projects — 2019 to 2026 is 7 years.

  The résumé understates this: it says "5+ years" and its earliest listed role is 2020
  (Lord Jesus Fellowship Church), so the 2019 school/org work is invisible. The site and
  the résumé therefore disagree, and a recruiter comparing them would notice.

  **The site is right; the résumé is the one to update** — change "5+" to "7+" and
  consider adding a line covering the 2019 school and org design work so the timeline
  supports the number.
- **Street address omitted.** The résumé carries a full street-level address; the site
  shows only "Manila, Philippines". A public indexed page is a different privacy context
  than a résumé handed to one employer. (The address is deliberately not repeated here —
  this file is committed to the repo.)
- **Testimonial dropped.** The Canva site's testimonial is unedited placeholder text
  ("Testimonials are short quotes from people who love your brand…") attributed to
  Alaia Domingo. Not carried over. Restore only with a real quote.

## Figma plugin: intentionally out of date

`figma-plugin/` is **knowingly stale** as of 2026-07-18. It still builds the old
layout: the giant `PORTFOLIO` wordmark instead of the name-led title, one monolithic
about panel instead of short + extended, software tiles in the wrong section, and the
old tab styling. It has no equivalent of the project lightbox.

This is a decision, not neglect. The Figma file is a snapshot with no live link to the
site, so re-syncing during active design iteration means rewriting ~20KB repeatedly —
and each rewrite risks regressions (the sizing bug and the scroll-jump bug both came
from plugin rewrites).

**Resync when the design settles**, which realistically means after the real work images
land, since those will drive final grid and card decisions.

The architecture in `figma-plugin/README.md` is still correct and should be kept on any
rewrite: component set + `CHANGE_TO` for tab switching, and the three sizing rules at
the top of `code.js`.

## Outstanding

- **Canva scrape produced nothing usable.** Only 7 media assets ever loaded, all
  background grain textures and gradient washes. The project carousels are
  interaction-gated and never rendered headlessly. Images must come from Lana directly.
- Work images. `public/work/` is empty; panels render numbered placeholders.
  Candidates spotted in `Documents/personal`: `FRONT.png`, `BACK.png`, `MOCKUP.png`,
  `MAGDA.psd`, `CHRISTMAS.psd`. Not used without explicit say-so — that folder also
  holds personal documents.
- Portrait. `components/AboutPanel.tsx` has a placeholder slot.
  `HUERTAS 1X1.png` is a candidate.
- Video hosting. Determines embed vs. self-hosted player.
- Engineering projects and repos, to fill the `engineering` tab.
