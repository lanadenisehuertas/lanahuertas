# Figma plugin — portfolio builder

Generates the **current** portfolio design as editable Figma layers: real
frames, text nodes, auto-layout, and the palette applied as fills.

Regenerated against the design as of 2026-07-26.

## Why a plugin

Figma has no public write API. The REST API is read-only for file content, and
every Figma MCP server — including the official Dev Mode one — reads *existing*
designs to generate code from them. Running a plugin inside Figma is the only
way to author a file programmatically.

## Install

1. Open the **Figma desktop app** (browser Figma cannot load local plugins).
2. Open the file you want the design in.
3. `Tools` → `Development` → `Import plugin from manifest…`
   (or the Figma logo menu → `Plugins` → `Development`)
4. Select `figma-plugin/manifest.json` from this folder.
5. Run it from `Tools` → `Development` → **Lana Portfolio Builder**.

It builds onto whatever page is open and zooms to fit. Import is one-time;
after that the plugin stays in your Development menu.

## Fonts

The design uses four faces, all on Google Fonts:

| Role | Face | Fallback chain |
|---|---|---|
| Display | Bricolage Grotesque | Archivo → Inter |
| Script accent | Yellowtail | Pacifico → Inter |
| Marginalia | Silkscreen | VT323 → Inter |
| Body | Poppins | Inter |

Each one falls back rather than throwing, and the closing toast names any that
were substituted. For the real thing, make sure all four are available to Figma
before running.

## What it builds

- **Hero** — edge rails top and bottom, the pixel eyebrow, "Lana" at 208px,
  the display + script lockup, tool tiles, and both CTAs.
- **Selected work** — the `selected`/*work* title lockup, the four-tab folder,
  and a mosaic using the same two card widths as the site (the wide one is
  exactly double the narrow plus the gutter).
- **About me** — four-tab folder, portrait placeholder with six tool badges
  floating clear on both sides, headline, script kicker, justified body.
- **Contact** — title lockup, folder, details card, closing rail.

## Caveats

- This is a **snapshot, not a sync**. Edits in Figma do not flow back to the
  site, and site changes do not flow into Figma. Whichever you treat as the
  source of truth, the other needs updating by hand.
- Several things have no Figma equivalent and are simply absent: the paper
  grain, the film-grain plate, the drifting aurora, the folder placement
  animation, hover states, and all responsive behaviour.
- Project artwork is placeholder rectangles. Drop the real images in once the
  frame is there.
- Re-running **appends another copy**. Delete the existing
  `lana denise huertas — portfolio` frame first.

## Notes for anyone editing `code.js`

Three Figma API rules the earlier versions got wrong, all of which shipped
visible bugs:

1. `resize()` on an auto-layout frame forces that axis to FIXED. Create the
   frame plain, resize it, *then* set `layoutMode`.
2. `layoutSizingHorizontal` / `layoutSizingVertical` only apply **after** the
   node is appended to a layout parent.
3. Decorative shapes inside an auto-layout frame need
   `layoutPositioning = "ABSOLUTE"`, or they join the flow and displace
   siblings.

And one more found while regenerating: setting `.x` on a child of a horizontal
auto-layout frame is ignored. To overlap tabs, use negative `itemSpacing`.
