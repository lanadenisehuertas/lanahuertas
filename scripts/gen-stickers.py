"""Generate the sketchbook doodle kit with the Codex CLI.

Run from the repo root:  python -I scripts/gen-stickers.py [name ...]

With no names, makes every doodle in DOODLES that is missing from
public/art/ink/. Each is drawn in black pen on flat white; the ink's
darkness becomes the alpha (paper drops out everywhere), the result trimmed
and saved as a transparent webp. The site uses them as masks (.doodle), so CSS chooses the ink colour.
"""
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from codex_image import generate_png  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "art" / "ink"

STYLE = (
    "A hand-drawn doodle from an illustrator's sketchbook: quick, confident black fineliner pen line "
    "art with slightly uneven line weight and a few loose hatching or stipple marks, drawn by a real "
    "person, charming and a little mystical. Pure black ink only, no colour, no grey fills, no shading "
    "gradients. A single centred drawing filling about 80% of a square frame, on plain flat pure-white "
    "#ffffff paper with nothing else, no shadow, no border, no paper texture. No text, letters or numbers."
)

DOODLES = {
    "moon": "a crescent moon with a sleepy face, two small stars and a few dots around it",
    "stars": "a little cluster of three hand-drawn stars of different sizes with tiny sparkle lines",
    "butterfly": "a small butterfly with patterned wings, drawn in quick pen lines",
    "daisy": "a daisy on a curved stem with two leaves",
    "swirl": "a loose spiral flourish trailing off into three dots",
    "heart": "a slightly lopsided heart drawn with a double outline",
    "eye": "a mystical eye with lashes and short rays around it, like a tarot card",
    "comet": "a shooting star with a long curly tail",
}

def cut_out(png: Path) -> Image.Image:
    """Ink to alpha: the darker the pen, the more opaque — white paper,
    inside the drawing as well as around it, drops out. Trimmed to the ink."""
    lum = Image.open(png).convert("L")
    alpha = lum.point(lambda v: max(0, min(255, round((236 - v) * 1.6))))
    im = Image.new("RGBA", lum.size, (0, 0, 0, 0))
    im.putalpha(alpha)
    box = alpha.getbbox()
    return im.crop(box) if box else im


def make(name: str) -> None:
    png = generate_png(f"Use your image generation tool to create ONE image and nothing else: {DOODLES[name]}. {STYLE}", REPO / ".codex-scratch")
    im = cut_out(png)
    im.thumbnail((512, 512), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{name}.webp", "WEBP", quality=90, method=6)
    print(f"{name}: {png.name} -> public/art/ink/{name}.webp {im.size}")


def main() -> None:
    wanted = sys.argv[1:] or [n for n in DOODLES if not (OUT / f"{n}.webp").exists()]
    for name in wanted:
        if name not in DOODLES:
            sys.exit(f"unknown doodle: {name}")
        make(name)


if __name__ == "__main__":
    main()
