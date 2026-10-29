"""Dithered dusk sky art for components/DuskSky.tsx.

Writes small static PNGs to public/art/dusk/:

  band-*.png   ordered-dither (Bayer 8x8) transition strips between two
               colours, tiled horizontally on the page. One image pixel is
               one dither cell; the page shows them at 3 CSS px per cell with
               `image-rendering: pixelated`, so the step is visible as print.
  stars.png    a sparse tile of pixel stars (single dots and tiny plus signs)
               for the dusk at the bottom of the page.

Colours are RGBA; a band between two colours puts each cell wholly in one or
the other, so there is no smooth gradient anywhere — that is the point.

Run with:  python -I scripts/gen-dusk.py
"""

from pathlib import Path
import random

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "art" / "dusk"

# 8x8 Bayer matrix, thresholds in (0, 1).
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

CLEAR = (0, 0, 0, 0)
# Keep these in step with the flat fills in app/styles/ambient.css (.dk-*).
L1 = (214, 198, 243, 102)  # rgba(214 198 243 / .40) — over the about sky
L2 = (186, 164, 233, 133)  # rgba(186 164 233 / .52) — behind contact
L3 = (159, 134, 216, 255)  # #9f86d8 — below the contact copy
DEEP = (59, 42, 110, 255)  # #3b2a6e
NIGHT = (42, 29, 85, 255)  # #2a1d55

WIDTH = 64  # cells; a multiple of 8 so the Bayer pattern tiles seamlessly


def band(name: str, a, b, rows: int, ease: float = 1.0) -> None:
    """A vertical transition from colour a (top) to colour b (bottom)."""
    img = Image.new("RGBA", (WIDTH, rows))
    px = img.load()
    for y in range(rows):
        t = ((y + 0.5) / rows) ** ease
        for x in range(WIDTH):
            threshold = (BAYER[y % 8][x % 8] + 0.5) / 64
            px[x, y] = b if t > threshold else a
    img.save(OUT / f"band-{name}.png", optimize=True)


def stars() -> None:
    rnd = random.Random(7)
    size = 96
    img = Image.new("RGBA", (size, size), CLEAR)
    px = img.load()
    palette = [(255, 255, 255, 255), (255, 246, 220, 255), (247, 198, 230, 255), (226, 214, 255, 255)]
    placed = []
    while len(placed) < 14:
        x, y = rnd.randrange(2, size - 2), rnd.randrange(2, size - 2)
        if any(abs(x - u) < 12 and abs(y - v) < 12 for u, v in placed):
            continue
        placed.append((x, y))
        c = rnd.choice(palette)
        px[x, y] = c
        if len(placed) % 3:  # most stars are tiny plus signs, the rest single dots
            dim = c[:3] + (170,)
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                px[x + dx, y + dy] = dim
    img.save(OUT / "stars.png", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    band("a", CLEAR, L1, 120)  # sky -> first lavender, 360px on the page
    band("b", L1, L2, 80)  # -> contact lavender, 240px
    band("c", L2, L3, 56)  # -> mid violet below the copy, 168px
    band("d", L3, DEEP, 40)  # -> dusk, 120px
    band("e", DEEP, NIGHT, 24)  # -> night at the very bottom, 72px
    stars()
    for p in sorted(OUT.iterdir()):
        print(p.name, p.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
