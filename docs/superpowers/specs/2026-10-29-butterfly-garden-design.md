# Butterfly garden — clean spreads, a guide that flies

_2026-10-29 · follows the night-garden sketchbook; direction from Lana's
feedback and thirteen references. Visual decisions were made in the
brainstorm companion; the approved homepage mockup is
`.superpowers/brainstorm/1699-1793284051/content/site-mockup.html` (local,
untracked) — use it as the reference implementation for layout and motion._

## Why

The sketchbook pass read as a scrapbook: tape, polaroids, paper, pen script,
window chrome around the /design sets, phone and ID mockups that outshone the
pubmats, a tall title band above every section, a carousel driven by small
pips at the bottom. Fonts felt off. The page was flat to move through.

## Decisions

### Type
- Redaction (local, `--font-redaction`) for display: hero name, section and
  project titles, italic taglines. The degraded-cut hover on the name stays.
- Inter Tight for body, buttons, links, nav. DM Mono for small uppercase labels.
- Cormorant, Archivo and Nanum Pen Script are gone. `--font-hand` is retired
  (aliased to the body face until every use is removed).
- Sizes: body 17px desktop, never below 16px; labels 13px minimum; nav,
  index and buttons 15–16px; tap targets 44px.

### Contrast
- WCAG AA everywhere: 4.5:1 for text, 3:1 for titles ≥ 24px.
- Text over artwork sits only where the wash is ≥ 90% opaque; the wash fades
  out after the text column ends.
- Dark artboards: dark wash, light text; the nav turns light over them.
- Pink accents only for large italic words or decoration, never small text.

### Spread (branding, videos, UI/UX)
One project per screen (`100svh`), under a nav that fades into the art.
- Full-bleed artboard (`/art/backdrops/<slug>.webp`) with a feathered wash in
  the artboard's tone from the left (opaque to ~30%, gone by ~40%).
- Left column (~27%): small section name ("Branding & *pubmats*"), meta
  label, title, italic tagline, brief, palette swatches, "My part" as a list
  with ✦ bullets (no pills), primary + secondary action.
- Right (~64%): the key visual large, two supporting pieces, all
  `object-fit: contain` so pubmats are never cropped. No device mockups.
- Branding only: a filmstrip of the whole set under the art; hovering a thumb
  previews it in the big frame, click pins it; clicking a piece opens a
  lightbox (arrows, Esc).
- Videos: no filmstrip. The video is the big frame (poster + play, Drive
  player loads on click).
- UI/UX: desktop screens in a thin browser outline with page tabs in its bar
  to switch screens; the screen scrolls inside the outline. Phone outline only
  for real mobile screenshots.
- Moving between projects: a project index across the top (click to jump);
  the left/right screen edges are back/next zones with a cursor label naming
  the next project; drag/swipe; ← →. No pips.
- The section sets `data-tone="light|dark"` for the active slide so the nav
  can switch.

### Content
- Branding: 10 brands. Dystopia and Heartwired removed; CS Night moves to the
  posters. Pieces removed: Neostalgia tv, game, planetcat, teaser-2, glasses,
  csexposticker2background, csexpostickerbackground, dp-blast-3, 1,
  call-for-sponsors, 14-shy, byteme-1080-x-1350-px-1,
  a-woven-thread-of-motion, windows-into-the-pattern, ctrl-c-ctrl-v, byteme,
  jacket-teal; Tabitayo seating-arrangement, layer-2; Technorun
  485004285-987718973215459-1496984069015702086-n.
- Posters (new on the homepage, after branding): CS Night first, then the
  one-offs. One draggable row on the site sky; the poster under the cursor
  lifts and tilts toward it; click opens the lightbox.

### Hero
Name, tagline, "See the work" and the counts as one block centred vertically
in the first screen; the flowers stay as the lower border.

### Nav
Slim, no solid band (gradient fade into the page). Hides on scroll down,
returns on scroll up or when the pointer nears the top. Current section
underlined. Light over dark slides. Phones: name + "menu" opening a
full-screen sheet. Links: branding, posters, videos, ui/ux, about, contact;
"Hire me".

### About and contact
- About: no polaroid, tape, doodles or pen captions. The portrait fades into
  the sky (feathered mask) and is ringed by the site's own garden — leaves,
  lotus, bell flowers, orbs, pixel sparkles, a cloud — floating gently, so it
  reads as part of the page. Tabs are plain underlined words.
- Contact: the existing contact styling, rearranged: the thank-you on the
  left, the form on the right. A successful send dispatches
  `butterfly:send`.

### The butterfly
A CSS-3D butterfly (two wing planes per side on `preserve-3d`, no library).
- Flight is tied to reading, not random: waypoints are `[data-perch]`
  elements in document order (hero name, each section's visible title). As
  the page scrolls it travels the path between the waypoint above and below
  the reading line, arcing through the page margin, so it is always beside
  what you are reading. When scrolling stops it lands on the nearest visible
  perch and rests, wings slowly opening and closing.
- Calm wings: a few soft beats then a glide; no faster flapping on fast
  scroll.
- Trail: sparkles only (four-point stars and soft dots), ~2.5s, capped.
- Hover: a loop-the-loop and a sparkle burst, plus a "hi! click me to fly
  ahead" label. Click: it takes off and the page scrolls to the next section.
  It darts aside only from a fast-approaching cursor.
- `butterfly:send` (contact form): it flies off with a burst.
- Off on touch-first devices and narrow screens; reduced motion: no flight,
  no trail. Lite mode: no trail. One rAF loop; stops when the tab is hidden.
- Wing art: front and back wings as separate layers so the back wings lag a
  beat; starts from `public/art/butterfly.webp`, new layers to be drawn.

### Buttons
Restyled within the theme; options shown to Lana (wing gradient, pearl, pixel
sparkle, petal, halftone fill). Primary uses `.btn`; secondary is an
underlined text link (`.link`).

### Performance
Transform/opacity only; no blur filters on large areas; loops paused off
screen and while the tab is hidden; sparkles capped; lazy images; lite mode
honoured. Profile with 4× CPU throttling before calling it done.

## Pages
`/design`, `/videos`, `/ui-ux` use the same spread, one project after
another down the page. The old window-chrome gallery (`ProjectBento`) goes.
