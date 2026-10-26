"""Write scripts/backdrops.json: every slide backdrop and the image it is drawn from.

Run from the repo root:  python -I scripts/backdrop-refs.py

  <brand slug>     the brand's key visual (first key/print pubmat)
  code-<id>        the product screenshot in CODE_REFS
  video-<id>       the video's poster frame — palette only ("backdrop": false):
                   video slides sit on the site's own sky

gen-backdrops.py attaches each `ref` to the Codex prompt; extract-palettes.py
reads the same refs for the palette strip and the backdrops for text tone.
"""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

CODE_REFS = {
    "code-psyclick": "/work/psyclick/landing-hero-sm.webp",
    "code-debt-ledger": "/work/shot-debtledger.webp",
    "code-algebrawl": "/work/algebrawl-title.webp",
}


def brand_refs() -> dict[str, str]:
    ts = (REPO / "lib" / "brand-assets.ts").read_text(encoding="utf-8")
    start = ts.index("{", ts.index("export const brandAssets"))
    end = ts.index("\n};", start) + 2
    out = {}
    for slug, a in json.loads(ts[start:end]).items():
        c = a["collage"]
        out[slug] = (c.get("key") or c.get("print") or a["set"])[0]["src"]
    return out


def video_refs() -> dict[str, str]:
    src = (REPO / "lib" / "content.ts").read_text(encoding="utf-8")
    tab = src[src.index('id: "videos"'):]
    tab = tab[tab.index("projects: ["):]
    out = {}
    for m in re.finditer(r'\n {8}id: "([a-z0-9-]+)",[\s\S]*?images: \[\s*\{ src: "([^"]+)"', tab):
        out.setdefault(f"video-{m.group(1)}", m.group(2))
    return out


def main() -> None:
    refs = {**brand_refs(), **CODE_REFS, **video_refs()}
    data = {k: {"ref": v, **({"backdrop": False} if k.startswith("video-") else {})} for k, v in refs.items()}
    (REPO / "scripts" / "backdrops.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"{len(data)} backdrops -> scripts/backdrops.json")


if __name__ == "__main__":
    main()
