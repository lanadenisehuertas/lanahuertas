"""Lana's portrait as a one-ink ordered dither (public/art/pixel/portrait-*.png).

The photograph (public/work/lana-portrait.webp) is reduced to a small grid and
each cell is either ink or nothing, decided by an 8x8 Bayer matrix, so the
picture is made of the same squares as the pixel blooms. Two files, shown at
twice their size with `image-rendering: pixelated`:

  portrait-light.png   bone ink where the photo is bright (for dark tiles)
  portrait-dark.png    near-black ink where the photo is dark (for light tiles)

usage: python scripts/gen-dither.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "work" / "lana-portrait.webp"
OUT = ROOT / "public" / "art" / "pixel"
OUT.mkdir(parents=True, exist_ok=True)

W = 284  # cells across; the portrait is 1136 x 1200, so one cell is 4 source pixels


def bayer(n: int) -> np.ndarray:
    m = np.array([[0]])
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return (m + 0.5) / (n * n)


im = Image.open(SRC).convert("L")
im = ImageOps.autocontrast(im.resize((W, round(im.height * W / im.width)), Image.LANCZOS), cutoff=1)
g = (np.asarray(im).astype(np.float32) / 255.0) ** 0.82  # lift the midtones a little
h, w = g.shape
t = np.tile(bayer(8), (h // 8 + 1, w // 8 + 1))[:h, :w]
bright = g > t

for name, mask, ink in (("light", bright, (242, 238, 227)), ("dark", ~bright, (11, 10, 18))):
    out = np.zeros((h, w, 4), np.uint8)
    out[mask] = (*ink, 255)
    dst = OUT / f"portrait-{name}.png"
    Image.fromarray(out, "RGBA").save(dst, optimize=True)
    print(dst.name, w, h, dst.stat().st_size // 1024, "KB")
