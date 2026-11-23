"""Phone hero: the live garden band rendered once into a still picture.

On phones the hero garden (about 400 SVG pieces, clouds, bokeh and dither
layers) is replaced by one transparent WebP of the same band, so a phone
decodes one image instead of laying out and repainting the whole garden.
Desktop keeps the live garden.

The picture is taken from the page itself: start the site (`npx next start`)
and run, from the project root:

    python scripts/gen-phone-stills.py http://127.0.0.1:3600/

It opens the page at 430px wide at 2x with motion reduced (so every piece
sits in its resting place), hides everything but the garden band, and saves
public/art/still/hero-garden.webp plus the band's box relative to
.hero-bloom, which Hero.tsx uses to place it (printed at the end).
Requires Playwright with Chrome, and Pillow.
"""
import io
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3600/"
OUT = ROOT / "public/art/still"
W, H, DPR = 430, 932, 2

HIDE = """
html, body { background: transparent !important; }
#garden-loader, header, .graph-ground, .starfield, .scroll-vine, .motion-toggle,
main > :not(:first-child), .hero-name, .hero-still { visibility: hidden !important; }
main > :first-child { background: transparent !important; }
"""

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=DPR, reduced_motion="reduce")
    page.goto(URL, wait_until="load")
    page.add_style_tag(content=HIDE)
    page.wait_for_timeout(1500)
    box = page.evaluate(
        """() => {
          const bloom = document.querySelector('.hero-bloom');
          const b = bloom.getBoundingClientRect();
          let top = b.top, bottom = b.bottom;
          for (const el of bloom.querySelectorAll('*')) {
            if (el.classList.contains('hero-still')) continue;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            top = Math.min(top, r.top);
            bottom = Math.max(bottom, r.bottom);
          }
          const sec = bloom.closest('section').getBoundingClientRect();
          top = Math.max(top, sec.top);
          bottom = Math.min(bottom, sec.bottom);
          return { top, bottom, bTop: b.top, bH: b.height, sy: scrollY };
        }"""
    )
    png = page.screenshot(clip={"x": 0, "y": box["top"] + box["sy"], "width": W, "height": box["bottom"] - box["top"]}, full_page=True, omit_background=True)
    browser.close()

OUT.mkdir(parents=True, exist_ok=True)
img = Image.open(io.BytesIO(png)).convert("RGBA")
img.save(OUT / "hero-garden.webp", "WEBP", quality=78, method=6)
img.resize((img.width // 2, img.height // 2), Image.LANCZOS).save(OUT / "hero-garden-sm.webp", "WEBP", quality=80, method=6)
top_pct = (box["top"] - box["bTop"]) / box["bH"] * 100
h_pct = (box["bottom"] - box["top"]) / box["bH"] * 100
print(f"{img.width}x{img.height}; {(OUT / 'hero-garden.webp').stat().st_size // 1024} KB, sm {(OUT / 'hero-garden-sm.webp').stat().st_size // 1024} KB")
print(f"place in .hero-bloom: top {top_pct:.2f}%  height {h_pct:.2f}%  aspect {img.width}/{img.height}")
