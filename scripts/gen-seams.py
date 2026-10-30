"""Dither seams between sections (app/styles/showcase.css, "dither horizon").

Writes to public/art/seams/:

  seam-bottom.png  an alpha mask, opaque at the top and dissolving to nothing
                   at the bottom through an ordered (Bayer 8x8) dither in
                   3px cells over 240px, eased. Each cell mixes the smooth
                   gradient with the dither (SOFT), so the pixel grain shows
                   without hard on/off contrast. Tiles horizontally (24px).
  seam-top.png     the same idea over 72px, flipped, for the top edge: short,
                   so it ends above the section label and project index.
  seam-stars.png   pixel stars (dots and tiny plus signs, white and blush)
                   thinning out downwards, drawn over the artboard's lower
                   band so they fall out of the art as it dissolves.

The 3px cell matches the dusk sky (gen-dusk.py) so every dither on the page
shares one grain.

Run with:  python -I scripts/gen-seams.py
"""

from pathlib import Path
import random

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "art" / "seams"

BAYER = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]
CELL = 3
COLS = 8  # one Bayer period across, so the tile repeats seamlessly
ROWS = 80  # 80 cells = 240px
SOFT = 0.55  # share of the smooth gradient in each cell; the rest is dither


def smooth(t: float) -> float:
    return t * t * (3 - 2 * t)


def seam(rows: int = ROWS) -> Image.Image:
    im = Image.new("L", (COLS * CELL, rows * CELL), 0)
    px = im.load()
    for r in range(rows):
        # coverage falls from 1 at the top row to 0 at the bottom row
        cover = 1 - smooth((r + 0.5) / rows)
        for c in range(COLS):
            on = cover > (BAYER[r % 8][c % 8] + 0.5) / 64
            alpha = round(255 * (SOFT * cover + (1 - SOFT) * on))
            for y in range(CELL):
                for x in range(CELL):
                    px[c * CELL + x, r * CELL + y] = alpha
    return im


def stars(width: int = 360, rows: int = ROWS) -> Image.Image:
    rnd = random.Random(7)
    im = Image.new("RGBA", (width, rows * CELL), (0, 0, 0, 0))
    px = im.load()
    cols = width // CELL
    for _ in range(46):
        # denser near the top of the band, sparse lower down
        r = int(rows * (rnd.random() ** 1.8) * 0.9)
        c = rnd.randrange(1, cols - 1)
        colour = (255, 255, 255, 235) if rnd.random() < 0.6 else (255, 211, 239, 235)
        cells = [(c, r)]
        if rnd.random() < 0.3:  # a tiny plus sign
            cells += [(c - 1, r), (c + 1, r), (c, r - 1), (c, r + 1)]
        for cc, rr in cells:
            if 0 <= rr < rows:
                for y in range(CELL):
                    for x in range(CELL):
                        px[cc * CELL + x, rr * CELL + y] = colour
    return im


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    # masks: white with the dither in alpha
    for name, img in (("seam-bottom.png", seam()), ("seam-top.png", seam(24).transpose(Image.FLIP_TOP_BOTTOM))):
        rgba = Image.new("RGBA", img.size, (255, 255, 255, 0))
        rgba.putalpha(img)
        rgba.save(OUT / name, optimize=True)
    stars().save(OUT / "seam-stars.png", optimize=True)
    for f in sorted(OUT.iterdir()):
        print(f.name, f.stat().st_size)


if __name__ == "__main__":
    main()
