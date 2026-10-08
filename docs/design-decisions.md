# Portfolio — design decisions

_Last reviewed 2026-07-26_

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

**Palette: the lavender-sunset reference.** Deep Purple `#330C4B` ground, Purple Iris
`#51017C` lifted surface, Eminence `#711E7B` accent, Sunset Lavender `#B9379D`,
Fawn `#E3A88A`, Maize `#EEDAA5` panels and display type.

Roles were assigned by measured contrast, not by eye:

| Pairing | Ratio | Role |
|---|---|---|
| maize on deep | 11.74:1 | display type, panel fills |
| fawn on deep | 7.90:1 | secondary text on dark |
| eminence on maize | 7.00:1 | small labels on light panels |
| lavender on deep | 3.16:1 | **fails as text — decorative fills only** |

`ink` `#1B0730` is the one derived value. Deep Purple cannot serve as both the page
ground and the border colour — at 1.27:1 against Purple Iris every border would
vanish — so it is a deeper shade of the ground.

Two motifs are lifted from the reference image itself: the **aurora gradient wash**
(drifting blooms behind the whole page) and the **four-point sparkle**, which also
drifts through the background as its own layer.

_An earlier build used an electric-blue palette (Dark Ultramarine / Honeydew /
Vanilla Custard). It was replaced wholesale; nothing of it remains._

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

1. `Hero` — name-led (`Lana / I make work that's hard to scroll past.`)
2. `FolderStack` — the work, in four switchable folders
   (graphic design / brand systems / videos / projects)
3. `AboutPanel` — four switchable folders
   (about me / experience / education & certs / skills)
4. `Contact`

Every section is a folder, so the metaphor labels the whole page rather than only the
work section.

## The folder drawer

The work section is a stack of manila folders, not browser tabs
(`components/FolderStack.tsx`, with the tab strip in `components/Folder.tsx`).

- **Tab shape** — rounded rectangles (`rounded-t-xl`). An earlier version used an
  angled `clip-path` notch; the rounded form was preferred and the clip-path removed.
- **Sheet placement** — switching re-keys the panel (`key={activeTab.id}`) so React
  remounts it and the `place-*` keyframes replay. There are four, one per direction
  (`place-br`, `place-bl`, `place-tr`, `place-tl`), so a sheet arrives from the side
  the new tab sits on.

  Each runs in two phases via per-keyframe `animation-timing-function` — the value
  declared in a keyframe governs the segment that *starts* there. Phase one (0–64%)
  glides the sheet in off-axis, visibly slanted and slightly oversized. Phase two
  (64–100%) squares it up, snapping rotation and residual offset to zero on a fast
  curve. That late correction is the whole effect; without it the sheet just slides
  and reads like a carousel.

  The shadow travels with it: wide and soft while airborne, tightening to the hard
  offset shadow on landing. That does more for the sense of depth than the movement
  does. Content inside runs `paper-content` on a delay so it settles onto the sheet.
- **The stack** — two decorative sheets sit behind the panel at slight offsets and
  opposing rotations, so there is visibly something for the new sheet to land on.
  `aria-hidden`, purely decorative.
- **Tight row** — tabs overlap horizontally along a single top edge. Below 640px the
  strip becomes `overflow-x: auto` rather than wrapping — four tabs measured 505px in
  a 375px viewport, and letting them scroll keeps the folder metaphor intact. An
  earlier version stacked each folder vertically with its own visible body strip; that
  left far too much dead vertical space before any content appeared.
- **Tucking** — the active tab sits at `translateY(0)`; inactive tabs sit lower
  (`translateY(9px)`, slightly scaled down and dimmed) and below the folder front, so
  they read as tucked into the folder rather than floating above it.
- **One panel** — only the active folder has a body. Switching swaps content in place;
  nothing expands or collapses, so there is no layout push.
- **Colour per folder** — each tab takes a fill from the palette, paired with a text
  colour that clears contrast on that fill.

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

## Figma plugin

`figma-plugin/` was regenerated on 2026-07-26 against the current design —
lavender-sunset palette, Bricolage/Yellowtail/Silkscreen/Poppins, folder tabs,
edge rails, and the section-title lockups.

It remains a **snapshot, not a sync**: Figma edits do not reach the site and
site changes do not reach Figma. The grain, aurora, placement animation, hover
states, and responsive behaviour have no Figma equivalent and are absent.

Re-run it after any significant design change, and delete the old frame first
since it appends rather than replaces.

## Accessibility audit

Run against the live DOM before launch, not by inspection.

**Contrast.** Twenty-seven pieces of text failed WCAG AA — all 10–12px micro-labels
dimmed with Tailwind opacity modifiers (counts, index numbers, edge-rail marginalia,
definition-list keys). The worst measured 2.18:1 against a 4.5:1 floor. Each token was
raised to the minimum alpha that clears the threshold, solved per token in the browser
rather than guessed, then re-measured across all eight folder tabs. Zero failures.

Two false starts are worth recording, because both produced confident wrong numbers:

- Reading `getComputedStyle().color` with a naive regex breaks on Tailwind opacity
  modifiers, which render as `oklab(...)`. The oklab components were being read as
  RGB. Colours must be resolved by painting them to a canvas and reading the pixel.
- Compositing an element's background from its *parent* upward misses the element's
  own background, so a maize button with deep text measured against the page ground
  and reported 1.16:1 on text that actually passes comfortably.

**Mock UI excluded.** `PsyClickVisual` and `DebtLedgerVisual` are `aria-hidden`
illustrations of other applications, not content, and are left at their original
values.

**Dialog.** Verified live: `role="dialog"`, `aria-modal`, labelled, focus moves to
Close on open, focus is trapped and wraps, Escape closes, focus returns to the exact
card that opened it, background scroll is locked and restored, and scroll position is
unchanged across open/close.

**Motion.** `prefers-reduced-motion` freezes the aurora drift (the colour stays — it is
the background) and removes the sparkle layer entirely, rather than freezing it
mid-twinkle at an arbitrary opacity.

**Overflow.** No horizontal overflow from 320px to 1920px.

## Share metadata

The site had no Open Graph or Twitter tags, so pasting the link anywhere produced a
blank card — on a page whose entire purpose is being shared with recruiters.

`public/og.jpg` is a capture of the real hero (name, garden, tagline) at 1200×630 with
poster corner labels, so the preview always matches the live site; re-capture it when the
hero changes. JPEG keeps it near 70 KB. `metadataBase` reads `VERCEL_PROJECT_PRODUCTION_URL`
(see `lib/site.ts`), because a relative image path resolves against the scraper's host
rather than the site and comes back empty. Set `NEXT_PUBLIC_SITE_URL` once a custom
domain is attached.

## Outstanding

- **Socials are thin.** `lib/content.ts` lists only email and the old Canva portfolio.
  Linking the previous portfolio *from* the new one is circular; it should probably be
  dropped once this site replaces it. There is no LinkedIn and no GitHub link, and both
  are expected for design and engineering applications.
- **`public/work/psyclick.webp` is unused** — `PsyClickVisual` renders in CSS now. Safe
  to delete.
- **Résumé and site disagree.** The current résumé (UI/UX targeted) omits social media
  and VA skills, the CybeRS Robotics Club role, the 2019–2023 school work, and any
  "7+ years" claim. The site carries all of them. Both are defensible, but a recruiter
  holding the two together will notice the gap.
- **Debt Payoff Ledger stack is partly inferred.** Next.js, TypeScript, and Tailwind are
  visible from the deployed app; Vitest and GitHub Actions were not verified against the
  repository.
