"""Generate missing slide backdrops with the Codex CLI.

Run from the repo root:  python -I scripts/gen-backdrops.py [slug ...]

With no slugs, generates every backdrop in scripts/backdrops.json that does not
yet exist in public/art/backdrops/. Pass slugs to (re)generate just those.
Codex saves into its own generated_images folder (its exec sandbox is
read-only); this script takes the newest PNG from there and converts it.
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "art" / "backdrops"
CODEX_BIN = Path.home() / "AppData/Local/OpenAI/Codex/bin"
IMAGE_DIRS = [
    Path.home() / "AppData/Roaming/orca/codex-runtime-home/home/generated_images",
    Path.home() / ".codex/generated_images",
]

QUIET = {
    "left": "Keep the left 40% of the frame calm, darker and low-detail, because a text card sits there.",
    "right": "Keep the right 40% of the frame calm and low-detail, because a text card sits there.",
    "lower-left": "Keep the lower-left quarter of the frame calm and low-detail, because a text card sits there.",
    "centre": "Keep the centre of the frame calm and low-detail, because a text card sits there.",
}


def codex_exe() -> Path:
    found = sorted(CODEX_BIN.glob("*/codex.exe"), key=lambda p: p.stat().st_mtime)
    if not found:
        sys.exit(f"codex.exe not found under {CODEX_BIN}")
    return found[-1]


def newest_png(since: float) -> Path | None:
    pngs = [p for d in IMAGE_DIRS if d.exists() for p in d.rglob("*.png") if p.stat().st_mtime >= since]
    return max(pngs, key=lambda p: p.stat().st_mtime) if pngs else None


def generate(slug: str, spec: dict) -> None:
    prompt = (
        "Use your image generation tool to create ONE image and nothing else. "
        "A 16:9 landscape background illustration for a portfolio slide. "
        "Style: flat 2D poster illustration with soft risograph-like grain and gentle gradients, "
        "dreamy and calm, simple shapes, not photorealistic. "
        f"Subject: {spec['subject']}. {QUIET[spec['quiet']]} "
        "No text, no letters, no numbers, no logos, no people, no faces, no hands. "
        "When done, reply with only the absolute path of the saved image file."
    )
    start = time.time() - 1
    scratch = REPO / ".codex-scratch"
    scratch.mkdir(exist_ok=True)
    subprocess.run(
        [str(codex_exe()), "exec", "--skip-git-repo-check", "-C", str(scratch), prompt],
        check=True,
        timeout=600,
    )
    png = newest_png(start)
    if png is None:
        sys.exit(f"{slug}: codex finished but no new PNG was found in {IMAGE_DIRS}")
    im = Image.open(png).convert("RGB")
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{slug}.webp", "WEBP", quality=78, method=6)
    print(f"{slug}: {png.name} -> public/art/backdrops/{slug}.webp")


def main() -> None:
    specs = json.loads((REPO / "scripts" / "backdrops.json").read_text(encoding="utf-8"))
    wanted = sys.argv[1:] or [s for s in specs if not (OUT / f"{s}.webp").exists()]
    for slug in wanted:
        if slug not in specs:
            sys.exit(f"unknown backdrop: {slug}")
        generate(slug, specs[slug])


if __name__ == "__main__":
    main()
