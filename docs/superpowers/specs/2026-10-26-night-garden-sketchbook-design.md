# Night-garden sketchbook

_2026-10-26 · follows the brand showcase; direction from Lana's feedback and
fourteen Behance references_

## Why

After the showcase landed, the site read as several themes stitched together:
realistic scene backdrops behind the brands, dark rounded video frames over
blurred copies of themselves, six kinds of buttons, and a Y2K layer (gel,
chrome, LCD cells, running ribbons) that fought the garden. It was also slow.

## Direction

Keep every existing element — the garden sky, botanicals, pixel art, the
Redaction name and its hover, the brand collages — and change only the layer
drawn on top: from an operating system to a designer's sketchbook, under a
dusk of halftone, dither and grain.

- **Texture.** The sky gains a dot screen rising from the bottom and film
  grain over everything, both static. Section titles sit on a halftone patch;
  the italic accent word glows.
- **Ink, not boxes.** Primary actions are italic words on a brush swash;
  secondary actions get a pen underline drawn on hover; arrows are pen-drawn in
  a pen ring; the current tab is circled; the current nav item underlined.
  Every mark is one SVG mask, coloured by CSS (`app/globals.css`, "Sketchbook
  ink").
- **Pen notes.** A real pen face (Nanum Pen Script) for margin notes only: the
  section hints, "my part —" under each project, captions, form labels.
- **Things taped in.** Video posters are white-bordered prints with washi tape;
  the About photo is a taped snapshot with a pen caption; the contact form is
  ruled note paper. Phones in the collages are paper with an ink outline.
- **Doodles.** A Codex-drawn pen doodle kit (`public/art/ink`, from
  `scripts/gen-stickers.py`) used as masks, so CSS picks the ink colour.

## Sections

- **Branding.** Each slide is the brand's own artboard edge to edge — drawn by
  Codex from the brand's key visual, so it continues that brand rather than
  inventing a scene — with the pubmats on it and the words set straight on
  the artboard. A soft wash in the artboard's tone sits behind the text side;
  type switches light or dark per side (`lib/palettes.ts`, measured by
  `scripts/extract-palettes.py`). BiblioBOO and repeated pubmats are gone.
- **Videos.** No backdrop: the site's own sky. The poster is as large as the
  slide allows, taped in, with the words beside.
- **UI/UX.** Like branding, with artboards drawn from each product's interface.
- **About.** Tabs as circled words; panels set straight on the sky as ruled
  rows; the taped snapshot with the app icons and doodles; numbers on ruled
  lines; "made for —" the organisations behind the brands.

## Performance

Measured on a production build, then fixed:

- Pointer parallax and the scroll vine wrote custom properties on `<html>`,
  restyling the whole page every frame. They now write only on the elements
  that read them.
- No `will-change` on looping classes; depth of field by opacity, not blur;
  tiles reveal without blur; no SVG turbulence filter on the botanicals.
- Off-screen carousel slides skip rendering (`content-visibility`); one grain
  layer for the page instead of one per slide.
- Lite mode (garden held still) also for touch-first devices.
- The hero clouds load first; logos, the portrait and off-screen galleries
  load lazily; the opening screen lifts when the document is parsed.
- Backdrops ship at 960px below 1536px through `srcset`.
