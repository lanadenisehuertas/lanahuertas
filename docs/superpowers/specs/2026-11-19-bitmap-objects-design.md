# Bitmap objects and a pixel dawn edge

Date: 2026-11-19. Site: the sleeping-moon portfolio (`public/samples/sleeping-moon`).

## Why

Lana first found the dense 1-bit dither tiring, especially while it shimmered during a scroll, so every picture was moved
to a smooth lilac duotone. Since then Lana has asked for the bitmap back in its proper place. Lana liked the bitmap
sleeping filter on the tool icons, and found the blurred dawn edge weird. The balance agreed on: drawn objects carry the
bitmap, while photos of the work and every large transition stay smooth.

## Decisions

1. **Which pictures sleep in bitmap.** The choice follows the picture's `data-kind`:
   - Bitmap: `paint` and `line`. These are the tool icons, the six door objects, the room's objects and window, the seed
     packets and their holder, the mirror frame, Peanut, and the lily and moth ornaments.
   - Smooth duotone, unchanged: `photo` (posters, product screens, brand photos, film stills, the portrait) and `moon`.
2. **The bitmap look.** This is the old 1-bit Bayer dither (8 x 8 `B8` matrix): ink on the stop's ground, with a solid
   outline on painted shapes. The cell size is the old one, `u() * (0.28 large | 0.14 small) * data-cell`, at least
   2px, drawn crisp (`image-rendering: pixelated` on that canvas only). The pattern is fixed to the picture, so it never
   crawls during a scroll.
3. **Waking.** The moonlight sweep (`sweep`, feather `F = 0.24`) stays. In bitmap pictures, each cell turns to colour
   when the sweep's ramp at that cell passes the cell's Bayer threshold. Behind the front a picture is all colour, ahead
   of it all bitmap, and in the feather the cells break up cell by cell. The same threshold rule applies to the entrance
   (`show`), the second face (`face`) and the pointer's circle. The pale glint seam stays on smooth pictures only.
   Hover-woken pictures still rest in colour for about a minute (`Bitmap.rest`).
4. **The dawn edge.** It becomes a crisp stair-stepped ridge of solid square cells, with the same ridge waves as before
   (a 64-cell tile that joins itself) and the same cell size, `max(8, u() * 0.9)`. A few loose single cells sit one or
   two rows above the line, placed by a fixed hash so they never flicker. There is no checkerboard fill and no gradient.
   It rises with the scroll exactly as now.

## Out of scope

The moon, photos, the travel iris, the wipes, the spell lines, the room's circle and the trail all keep their current
treatment.

## Checks

- Screenshots of the tools, the doors, the room, the brands holder and the dawn, at 1440 x 900 and 390 x 844.
- `prod.py` (errors and overflow at all sizes) and `vrow.py` (swipes in every stop).
