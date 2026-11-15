# Riso bloom: design direction (initial)

Status: draft, 2026-11-05. Lana has approved the direction from brand sheets.
It is not built into the site yet. A static preview lives outside the repo,
at `http://127.0.0.1:3600/` (scratchpad `preview-site/`).

## 1. What it is

The site is a printed object, and the glass shows only where things float.

The ground is risograph print on pearl paper: two inks, grain and halftone
flowers. Frosted glass appears only on surfaces that sit above the page or
hold work: the hero banner, the chapter labels, the cards and the windows.
On top of both sits the branding the pastel site already has: the dawn
gradient, holographic accent words, glossy wing-gradient buttons, lace edges,
Y2K window chrome and the pixel butterfly and Peanut.

One sentence for decisions: *print the page, frost the things you can touch
or open, and let the dawn colours glow through both.*

### Sources

- **Brand sheet f3, "Riso + frosted header"**, which Lana picked. The sheets
  that led to it were v1 Riso bloom, v2 Frosted index, set 4 Riso halftone
  and set 8 Bloom index. They also took the ornament crop from set 7, Grid
  stitch.
- **The mood board Lana sent on 2026-11-05 (23 images).** It mixes
  dot-matrix and bitmap letters with soft glowing flowers (lily, lotus,
  peony), riso pink and cyan overprint, orbit ellipses, four-point pixel
  sparkles and small captions with dates and coordinates.
- **The second board Lana sent on 2026-11-05 (4 images), weighted toward
  the last two.**
  - "Memory Corruption": a two-ink split of cyan-blue and magenta fields, a
    chunky pixel mosaic, a hairline grid, bitmap-stepped script against a
    clean sans, and a barcode and year footer.
  - "Loving Machine": a white ground over a blue, lilac and pink tile
    mosaic, single-ink dot-matrix flowers (one pink, one blue), a black
    hairline frame with rounded corners, sweeping curves and a starburst.
  - The two pastel posters supply the glassy airbrushed objects, holographic
    blue-to-mint-to-pink outlines, butterflies, ribbons and an oval glow
    frame.
- **The live pastel site** (`app/styles/pastel.css`, `holo.css` and
  `lace.css`). Its gradients, buttons and decorative elements carry over
  unchanged.

## 2. Tokens

### Colour

The colour set is the pastel site's palette, unchanged. Nothing outside it
is allowed.

| Token | Hex | Use |
|---|---|---|
| ink | `#330c4b` | body text, hairlines, window outlines |
| iris | `#51017c` | headings, primary button core |
| plum | `#962480` | italic accents on light ground, pressed states |
| magenta | `#b9379d` | riso ink 1, links, errors (with an icon) |
| periwinkle | `#c8d0f6` | riso ink 2, misregistered offsets |
| window blue | `#9fb0f5` | window title bars |
| selection blue | `#4a5ad8` | focus rings, the selection box, the cursor tag (white text passes AA) |
| pearl | `#fffaf0` | paper ground, field fill |
| lilac | `#c9b9ec` | dawn stop, chips |
| blush | `#f2b8cf` | dawn stop, glows |
| peach | `#f6d3c3` | dawn stop |
| mint | `#b9e4cf` | success toast, the fourth dawn hue |

Errors are magenta with an icon and a sentence. They are never red.

### Gradients (carried over)

- **Dawn** (`--v-dawn`): `180deg, #dce3fa 0%, #c8d0f6 30%, #c9b9ec 55%,
  #f2b8cf 80%, #f6d3c3 100%`. It washes the hero banner, the chapter bands
  and the lotus glow.
- **Holo** (`--v-holo`): `100deg, #51017c 0%, #8b5cf6 22%, #b9379d 44%,
  #e3a88a 60%, #6f7fe0 80%, #51017c 100%`. It colours only the italic accent
  word in a heading: pubmats, posters, pictures, code, me, talk, flower.
- **Wing gloss** (the primary button): `180deg, #9b6ce0 0%, #6a1fa8 48%,
  #51017c 52%, #7a3cc4 100%`.
- **Riso overprint**: magenta multiplied over periwinkle reads as violet.
  Use it in halftone art and the offset copies, never in flat text.

### Colour flow (how colour moves down the page)

The first preview failed here. It put colour in stripes and boxes on a flat
pearl ground. Every reference does the opposite, following six rules.

1. **One hue family per piece, and the type joins it.** A pink poster stays
   pink, with its type in the deepest pink. A blue poster stays blue.
2. **Glow cores.** Colour starts at a bright core (a bloom or a light leak)
   and spreads out to pale paper.
3. **Dissolve by dither.** Colour fades into paper through halftone or pixel
   steps, never a clean edge or a smooth gradient alone.
4. **Two-ink fields.** Big rectangular blocks of blue and magenta split the
   page ("Memory Corruption"). Their edges break into chunky square mosaic
   tiles ("Loving Machine"). A thin hairline grid lies over the fields only.
5. **One pop per piece.** A single complementary accent: mint on magenta,
   blush on blue.
6. **Halos.** A soft colour fringe sits around the main forms.

So the site reads as **one continuous print**. Each chapter owns a hue
family, and the ground cross-fades between chapters through a dither band.
The chapter band is the densest point of that dither, not a separate
stripe.

| Chapter | Core | Deep (headings, labels) | Pop | Field / mosaic |
|---|---|---|---|---|
| hero | blush glow behind the lotus, on dawn | iris `#51017c` | mint | yes, two-ink mosaic behind the frosted banner |
| 01 identity, branding | magenta / blush | plum `#962480` | mint | yes, behind the carousel art |
| 02 print, posters | blush / peach | plum | periwinkle | no |
| 03 motion, videos | window blue to iris, a dusk screen glow; type turns pearl | pearl | blush | yes, the blue field behind the video window |
| 04 interfaces, UI/UX | periwinkle | selection blue `#4a5ad8` | magenta | no |
| 05 hello, about | lilac, with an oval glow behind the portrait | iris | peach | no |
| 06 say hi, contact | dawn again with a peach core, closing the loop | iris | magenta | yes, a light mosaic behind the form |

Each section sets `--hue-core`, `--hue-deep` and `--hue-pop`. Headings, mono
labels and the glass tint read from these variables, so a section's whole
colour comes from one place.

Glass picks up the section hue: a faint tint and a soft halo in
`--hue-core`. It is not the same neutral white everywhere.

### Type

- **Redaction**: display and headings. The italic is the accent voice, and
  there is no script or calligraphy face (Lana's call). The pixel cuts
  (Redaction 10 and 35 in the repo; 20 is missing) are the "bitmap" voice
  for the hero name's offset copy and for display moments. Do not use them
  under 32px.
- **Inter Tight**: body copy at 16px or more, line height 1.6. Buttons use
  it only where the italic serif would be too long.
- **DM Mono**: labels, indices, dates and coordinates, at 14px or more.
- **Sentence case everywhere.** There are no all-caps labels, including
  poster captions and tool names.

Scale: display 88, heading 48, subheading 28, body 16, label 14.

### Space, radius and elevation

- **Spacing:** 4, 8, 16, 24, 40, 64.
- **Radius:** 4 (fields' inner details, swatches), 12 (cards, windows,
  panels) and pill (buttons, chips, labels).
- **Elevation, for print:** none. A flat block with a 1px plum rule.
- **Elevation, for glass:** a translucent white fill, a 1px white inner rim,
  a faint inner glow and a soft blush glow below. Never a grey blur shadow.
- **Elevation, for stickers:** a 3px white border, an ink hairline and a
  solid periwinkle offset.

## 3. Surfaces: print or glass

This is the rule that keeps the direction coherent.

| Print (flat, grain, 1px plum rules) | Glass (frosted, glowing) |
|---|---|
| section grounds and text blocks | hero banner (name, node index, lotus behind) |
| panel header bars (halftone) | chapter label pill ("01 identity") |
| tabs, chips at rest, the poster row ground | project cards, poster frames, video window, `new_message.txt` window, quote cards, guestbook card |
| dotted leaders, sparkles, orbit lines | nav bar, toast, focused input, active tab |

Real `backdrop-filter` is used only on the nav, the hero banner and the
window title bars. Every other glass surface fakes the frost with
translucent gradients and an inner glow. On Lana's integrated-GPU laptop, a
blur on large or scrolling areas costs a repaint every frame.

## 4. Components

- **Primary button.** The glossy wing pill: the wing gradient, a 1px border
  of `rgb(27 7 48 / .7)`, a white top gloss from `::before`, and a white
  italic Redaction label. As the riso touch, a periwinkle copy sits
  misregistered 3px down and to the right. Hover lifts it and saturates;
  pressed shifts it to plum; disabled is pale frosted with ink text at 4.5:1
  or more. It is at least 44px tall.
- **Secondary button.** An outline pill with a 1px plum rule and an iris
  label.
- **Text link.** Iris text, a magenta underline and a ↗ for external links.
- **Icon button.** A 44px round frame with a 1px plum rule, holding an
  arrow, play or sound icon.
- **Chip.** A pale frosted pill with a ✦ prefix and 14px or larger text.
- **Notched label.** A pill with clipped corners and a thin double outline,
  holding a mono number and an italic word ("01 identity"), with dotted
  leaders running out to a sparkle at each end. It is the chapter divider
  and the panel header.
- **Chapter band.** A dawn-gradient strip with halftone four-point stars and
  a scalloped lace ribbon on its bottom edge, holding the frosted notched
  label and two mono facts ("10 brands ✦ Illustrator"). It is aria-hidden;
  the section below carries the real heading.
- **Window.** A frosted body with a window-blue title bar showing a file
  name (`brenia-18.mov`, `new_message.txt`) and min, max and close buttons,
  an ink 1.5px outline and a radius of 12.
- **Cards.** Frosted glass holding riso-halftone imagery, with a title in
  Redaction, mono metadata in sentence case and chips.
- **Sticker frame.** Used for stills (posters, pubmats).
- **Ticket.** The tilted, notched card behind the About portrait, with a
  holographic italic "hello!".
- **Stamp.** A perforated edge and a dashed inner rule. Used on the
  guestbook card.
- **Selection box.** A Figma-style box with square handles and a
  selection-blue cursor tag reading "lana". Used on the hero name only.
- **Tick-bracket labels.** Used for the three hero disciplines.
- **Nav.** A frosted bar with the pixel butterfly mark, sentence-case
  links, the current link underlined, and a "Hire me ↗" primary pill.
- **Tabs.** Flat text at rest. The active tab is a frosted pill.
- **Carousel index.** The brand names, plus "01 / 11" in mono.
- **Form.** Pearl fields with a plum hairline and a radius of 14, the label
  above, and an italic placeholder. Focus adds a 2px selection-blue ring
  and a frosted fill. An error shows a magenta rule, an icon and a sentence
  that says how to fix it ("Add an email so I can reply"). Success is a
  frosted mint toast: "Sent. I'll reply within a few days."

## 5. Ornaments and texture

- **Halftone flowers.** Codex risograph art, exported as transparent WebP
  with the pearl keyed out:
  - Two-ink lotus, lily and peony (magenta and periwinkle overprint). They
    sit on pearl or dawn grounds. The hero lotus glows through the glass.
  - A single-ink pair, a magenta dot-matrix lily and a cobalt line-screen
    spider lily. They go on opposite sides of a composition and on the
    coloured fields, as in "Loving Machine".
- **Mosaic field.** Chunky pixel tiles in cobalt, periwinkle, magenta and
  blush with a pearl grid. They are static and masked into the page with
  dither.
- **Hairline frame.** A 1px ink frame with rounded corners and sweeping
  curve lines around the hero, with a small date at the top. A barcode and
  "lana denise · 2026" sit in the footer.
- **Starburst.** A thin 8-point ink starburst, used alongside the four-point
  sparkles.
- **Holographic outlines.** Butterflies, ribbons and lace details may use
  the blue-to-mint-to-pink outline: `#9fb0f5`, then `#b9e4cf`, then
  `#f2b8cf`.
- **Bitmap word.** One word per hero or chapter may be set in a Redaction
  pixel cut, in hot magenta over the blue field, the way "Memory" works.
- **Sparkles and stars.** Four-point pixel sparkles in three sizes, and
  halftone stars in the chapter bands.
- **Lines.** Thin orbit ellipses, and dotted leader lines.
- **Node index.** The six chapters joined by dots and a line, under the hero
  name.
- **Paper grain.** A fine `feTurbulence` grain over the pearl ground. It is
  static; never animate it.
- **Pixel characters.** The pixel butterfly (nav mark and heading
  butterflies) and Peanut the pixel cat both stay.

Use them sparingly. One hero lotus per screen. Halftone art lives in the
hero, the cards and the bands, and never behind body copy.

## 6. Section map (layout unchanged)

The order and arrangement are the live site's:

1. hero
2. 01 identity: branding
3. 02 print: posters
4. 03 motion: videos
5. 04 interfaces: UI/UX and code
6. 05 hello: about
7. 06 say hi: contact and guestbook
8. footer

Only the surfaces and ornaments change.

## 7. Motion

- One orchestrated moment per view. The hero lotus "prints in" from
  scattered pixels, and the chapter label slides along its leaders when the
  band enters.
- Hover and press feedback stays within 150 to 300ms.
- Under `prefers-reduced-motion`, everything is static and there are no
  infinite loops.
- Keep the existing performance rules. Never put a mask, filter or
  clip-path on an element that runs an infinite animation. Pause offscreen
  animation.

## 8. Accessibility floor

- AA contrast everywhere. Holographic accent words appear only at heading
  sizes (large-text 3:1), with an ink fallback for forced colours.
- Body text is 16px or more, labels 14px or more, and tap targets 44px or
  more.
- A skip link, visible focus rings in selection blue, and sequential
  headings.
- Decorative bands and ornaments are aria-hidden.

## 9. Open questions

- The flowers are now Codex riso art, not procedural canvas art. Should
  more pieces be generated per chapter?
- Redaction 20 is missing from the repo. Add it, or keep 10 and 35 only?
- On the nav butterfly mark against the pale frosted bar: recolour the
  mark, or tint the bar?
- How much lace? The bands keep it, but should the guestbook stamp and the
  ticket stay as well, or does riso print replace those paper props?
