"""Make the small copies of the slide backdrops and keep the large ones light.

Run from the repo root:  python -I scripts/backdrop-sizes.py

For every public/art/backdrops/<slug>.webp writes sm/<slug>.webp at 960px
wide (served below lg through srcset), and re-saves any full-size file over
300 KB at a lower quality.
"""
from pathlib import Path

from PIL import Image

DIR = Path(__file__).resolve().parent.parent / "public" / "art" / "backdrops"
SM = DIR / "sm"


def main() -> None:
    SM.mkdir(exist_ok=True)
    for f in sorted(DIR.glob("*.webp")):
        im = Image.open(f).convert("RGB")
        if f.stat().st_size > 300_000:
            im.save(f, "WEBP", quality=68, method=6)
        small = im.copy()
        small.thumbnail((960, 960 * im.height // im.width + 1), Image.LANCZOS)
        small.save(SM / f.name, "WEBP", quality=74, method=6)
        print(f"{f.name}: {f.stat().st_size // 1024} KB, sm {(SM / f.name).stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
