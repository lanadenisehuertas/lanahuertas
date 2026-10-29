"""Generate missing artboard backdrops with the Codex CLI.

Run from the repo root:  python -I scripts/gen-backdrops.py [slug ...]

With no slugs, generates every backdrop in scripts/backdrops.json that does not
yet exist in public/art/backdrops/. Pass slugs to (re)generate just those.

Each backdrop is drawn from the project's own key visual — the `ref` for its
slug in backdrops.json (built by backdrop-refs.py) — attached to the prompt,
so it continues that brand's palette and motifs instead of inventing a scene.
Codex replies with the path of the image it made (see codex_image.py);
this script converts it to webp.
"""
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from codex_image import generate_png  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "art" / "backdrops"


def generate(slug: str, ref: Path) -> None:
    prompt = (
        "Use your image generation tool to create ONE image and nothing else. "
        "The attached image is this project's own key visual. Create a 3:2 landscape background "
        "artboard that belongs to THIS visual system: the same colour palette, the same textures, "
        "materials, patterns and graphic motifs you can see in the attachment, arranged as a calm, "
        "flat, graphic backdrop for laying the project's posters on top. Stay faithful to it: do not "
        "invent a new scene, setting, landscape, room, object or character, and do not reimagine the "
        "concept. Flat 2D graphic design, not photorealistic, no 3D-render look, no photography. "
        "Keep the middle 70% low-contrast and uncluttered and let the motifs gather toward the edges "
        "and corners. No text, letters, numbers, logos, people, faces or hands."
    )
    png = generate_png(prompt, REPO / ".codex-scratch", [ref])
    im = Image.open(png).convert("RGB")
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{slug}.webp", "WEBP", quality=78, method=6)
    print(f"{slug}: {png.name} -> public/art/backdrops/{slug}.webp")


def main() -> None:
    specs = json.loads((REPO / "scripts" / "backdrops.json").read_text(encoding="utf-8"))
    wanted = sys.argv[1:] or [s for s in specs if specs[s].get("backdrop", True) and not (OUT / f"{s}.webp").exists()]
    for slug in wanted:
        if slug not in specs:
            sys.exit(f"unknown backdrop: {slug}")
        generate(slug, REPO / "public" / specs[slug]["ref"].lstrip("/"))


if __name__ == "__main__":
    main()
