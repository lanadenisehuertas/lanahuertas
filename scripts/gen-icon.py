"""Site icon: the pixel butterfly in white on a violet tile.

Reads the butterfly's cells from public/art/pixel-butterfly.svg (a 13 x 9
grid) and writes app/icon.svg, app/icon.png (512), app/apple-icon.png (180)
and app/favicon.ico (16, 32, 48). Every size places the butterfly on whole
pixels, so it stays crisp: 1px a cell at 16, 2px at 32, and so on.

Run from the project root: python scripts/gen-icon.py
"""
import re
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = (ROOT / "public/art/pixel-butterfly.svg").read_text(encoding="utf-8")
CELLS = sorted({(int(float(x)), int(float(y))) for x, y in re.findall(r"M(\d*\.?\d+) (\d*\.?\d+)h", SRC)})
GW, GH = 13, 9
TOP, BOTTOM = (106, 43, 181), (81, 1, 124)  # #6a2bb5 to #51017c, the gel button's violets


def tile(size: int, radius_ratio: float = 0.22, scale: int = 4) -> Image.Image:
    """A rounded square with the violet gradient, drawn large and scaled down for clean corners."""
    big = size * scale
    grad = Image.new("RGB", (1, big))
    for y in range(big):
        t = y / (big - 1)
        grad.putpixel((0, y), tuple(round(TOP[i] + (BOTTOM[i] - TOP[i]) * t) for i in range(3)))
    grad = grad.resize((big, big))
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=round(big * radius_ratio), fill=255)
    out = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out.resize((size, size), Image.LANCZOS)


def icon(size: int, full_bleed: bool = False) -> Image.Image:
    img = tile(size, 0.0 if full_bleed else 0.22)
    cell = max(1, (size * 13 // 16) // GW)  # the butterfly spans about 13/16 of the tile
    ox, oy = (size - GW * cell) // 2, (size - GH * cell) // 2
    d = ImageDraw.Draw(img)
    for x, y in CELLS:
        d.rectangle((ox + x * cell, oy + y * cell, ox + (x + 1) * cell - 1, oy + (y + 1) * cell - 1), fill=(255, 255, 255, 255))
    return img


def svg() -> str:
    cell = 32
    ox, oy = (512 - GW * cell) // 2, (512 - GH * cell) // 2
    path = "".join(f"M{ox + x * cell} {oy + y * cell}h{cell}v{cell}h-{cell}z" for x, y in CELLS)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
        '<defs><linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a2bb5"/><stop offset="1" stop-color="#51017c"/></linearGradient></defs>'
        '<rect width="512" height="512" rx="112" fill="url(#t)"/>'
        f'<path fill="#fff" shape-rendering="crispEdges" d="{path}"/></svg>\n'
    )


(ROOT / "app/icon.svg").write_text(svg(), encoding="utf-8")
icon(512).save(ROOT / "app/icon.png")
icon(180, full_bleed=True).save(ROOT / "app/apple-icon.png")  # iOS rounds the corners itself
icon(48).save(ROOT / "app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon(16), icon(32)])
print(f"{len(CELLS)} cells; wrote icon.svg, icon.png, apple-icon.png, favicon.ico")
