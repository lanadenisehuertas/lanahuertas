# Handoff — night-garden sketchbook (paused 2026-10-26)

Branch `feat/brand-showcase-cont` (worktree `.claude/worktrees/brand-showcase-cont`).
Design: `docs/superpowers/specs/2026-10-26-night-garden-sketchbook-design.md`.

## Done
- 13 brands (BiblioBOO and repeated pubmats removed), 10 videos, 3 UI/UX projects as full-bleed slides; artboards drawn by Codex from each key visual; text set straight on the art with a tone wash.
- Videos on the site sky, taped-in posters. Ink controls, pen font, doodles, note-paper form, sketchbook About.
- Perf: root-variable writes removed, no will-change/blur/turbulence, content-visibility on slides, scroll pause for loops, lazy images, lite mode on touch.
- `tsc`, eslint, `next build` pass.

## Next (in order)
1. Re-measure on a production build (`npx next start -p 3100`, then `node <perfscripts>/runtime.mjs / base ...` with `MSYS_NO_PATHCONV=1`). Last run before the final perf edits: scroll 2–9 fps, idle 11–31 fps; pausing ambient loops gave 12 fps scroll. Still to try: fewer `sway`/`twinkle`/`sl-char` elements, botanicals as `<symbol>`/`<use>`.
2. Look at every slide at 1440 and 500 wide again (text contrast on the brighter artboards: pacsa, neostalgia, techno-week, technorun).
3. `/design`, `/videos`, `/ui-ux` pages: check against the new look.
4. Update README/design-decisions (still describe gel/old controls in places).
5. Open a draft PR; do not merge to main.

## Gotchas
- Git Bash rewrites a bare `/` argument: set `MSYS_NO_PATHCONV=1` for the screenshot scripts.
- `scripts/shoot-slides.mjs` needs an absolute Chrome `--user-data-dir`.
- Regenerate art: `python -I scripts/backdrop-refs.py` then `gen-backdrops.py`, `backdrop-sizes.py`, `extract-palettes.py`.
