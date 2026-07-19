# Figma plugin — portfolio builder

Generates the portfolio as **editable Figma layers**: real frames, text nodes,
auto-layout, and the palette applied as fills.

## Why a plugin

Figma has no public write API. The REST API is read-only for file content, and every
Figma MCP server (including the official Dev Mode one) reads *existing* designs to
generate code from them. Running a plugin inside Figma is the only way to author a file
programmatically.

## Install

1. Open the **Figma desktop app** (browser Figma cannot load local plugins).
2. **Open the file you want the design in** — the plugin builds onto whatever page is
   currently open, e.g. `lana-denise-huertas`.
3. `Plugins` → `Development` → `Import plugin from manifest…`
4. Select `figma-plugin/manifest.json` from this folder.
5. `Plugins` → `Development` → **Lana Portfolio Builder**.

It builds onto the current page and zooms to fit. Import is a one-time step; after that
the plugin stays in your Development menu for any file.

## Fonts

Tries **Poppins** first and falls back to **Inter** (which ships with Figma) if Poppins
isn't installed. The closing toast tells you which one it used. For the intended look,
install Poppins before running.

## Tab switching

Figma cannot run the site's React state. The work section is instead a **component set**
with one variant per tab (`Work Section`, parked to the right of the page). Each tab pill
fires `CHANGE_TO`, swapping the variant **in place** inside a single page frame.

Hit **Present** (▶ top-right) and click the tabs. Smart-animate, 0.25s.

### Why not page navigation

The first version built five full pages and used `NAVIGATE` with
`preserveScrollPosition: true`. It jumped to the top on every click:
`preserveScrollPosition` is unreliable when destination frames differ in height, and the
five pages did differ, because each tab's blurb is a different length.

`CHANGE_TO` never navigates, so there is no scroll position to preserve or lose. That is
the correct primitive for tab switching in Figma — page navigation is for moving between
screens, not swapping content within one.

### Editing the variants

Edit any variant inside the `Work Section` component set and the instance on the page
updates. To restyle all five (e.g. new panel colour), edit each variant — they are
siblings, not overrides of a base.

## Caveats

- This is a **snapshot**, not a live link. Edits in Figma do not flow back to the
  Next.js site, and site changes do not flow into Figma. Whichever you treat as the
  source of truth, the other has to be updated by hand.
- The aurora wash is approximated with a radial-gradient ellipse. CSS blurs a
  three-stop gradient; Figma gets one ellipse. It reads close, not identical.
- Poster grid cells are empty periwinkle frames — drop images in once you have them.
- Re-running the plugin appends **five more** pages rather than replacing. Delete the
  existing `Portfolio — …` frames before re-running.
- Hover states, smooth scrolling, and the CSS aurora blur have no Figma equivalent. The
  aurora is approximated with a radial-gradient ellipse.
