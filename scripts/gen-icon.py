"""Site icon: the sleeping moon, cut in the site's 1-bit lilac on its black night.

The moon is a 16 x 16 grid of cells drawn here (the disc, a few darker craters, two closed eyes and a smile), and it
writes app/icon.svg, app/icon.png (512), app/apple-icon.png (180) and app/favicon.ico (16, 32, 48). Every size places
the moon on whole pixels, so it stays crisp: 1px a cell at 16, 2px at 32, and so on.

Run from the project root: python scripts/gen-icon.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
G = 16
GROUND, INK, CRATER, SHUT = (0, 0, 0), (185, 162, 255), (138, 116, 214), (0, 0, 0)  # --ground, --ink of moon.css

# the disc: a 14-cell pixel circle, given as the width of each row from the top (rows 1 to 14), centred on the grid
ROWS = [6, 10, 12, 12, 14, 14, 14, 14, 14, 14, 12, 12, 10, 6]
DISC = {(x, y + 1) for y, w in enumerate(ROWS) for x in range((G - w) // 2, (G + w) // 2)}
# craters near the rim, as on the drawn moon (none on the face)
CRATERS = {(5, 3), (6, 3), (10, 4), (3, 5), (12, 9), (4, 12), (11, 12)} & DISC
# closed eyes (a lid curving down, as the drawn moon sleeps) and a small smile, mirrored on the middle of the grid
LEFT_EYE = {(3, 7), (4, 8), (5, 8), (6, 7)}
SMILE = {(6, 11), (7, 12), (8, 12), (9, 11)}
FACE = LEFT_EYE | {(G - 1 - x, y) for x, y in LEFT_EYE} | SMILE


def colour(cell):
    if cell in FACE:
        return SHUT
    if cell in CRATERS:
        return CRATER
    return INK


def tile(size: int, radius_ratio: float, scale: int = 4) -> Image.Image:
    """A black rounded square, drawn large and scaled down for clean corners."""
    big = size * scale
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=round(big * radius_ratio), fill=255)
    out = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    out.paste(Image.new("RGB", (big, big), GROUND), (0, 0), mask)
    return out.resize((size, size), Image.LANCZOS)


def icon(size: int, full_bleed: bool = False) -> Image.Image:
    img = tile(size, 0.0 if full_bleed else 0.22)
    cell = max(1, size // G)
    o = (size - G * cell) // 2
    d = ImageDraw.Draw(img)
    for x, y in sorted(DISC):
        d.rectangle((o + x * cell, o + y * cell, o + (x + 1) * cell - 1, o + (y + 1) * cell - 1), fill=colour((x, y)) + (255,))
    return img


def svg() -> str:
    cell = 512 // G
    paths = {}
    for x, y in sorted(DISC):
        paths.setdefault(colour((x, y)), []).append(f"M{x * cell} {y * cell}h{cell}v{cell}h-{cell}z")
    hexa = lambda c: "#%02x%02x%02x" % c
    body = "".join(f'<path fill="{hexa(c)}" d="{"".join(p)}"/>' for c, p in paths.items())
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" shape-rendering="crispEdges">'
        f'<rect width="512" height="512" rx="112" fill="{hexa(GROUND)}"/>{body}</svg>\n'
    )


(ROOT / "app/icon.svg").write_text(svg(), encoding="utf-8")
icon(512).save(ROOT / "app/icon.png")
icon(180, full_bleed=True).save(ROOT / "app/apple-icon.png")  # iOS rounds the corners itself
icon(48).save(ROOT / "app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon(16), icon(32)])
print(f"{len(DISC)} cells; wrote icon.svg, icon.png, apple-icon.png, favicon.ico")
