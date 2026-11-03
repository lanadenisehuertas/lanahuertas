"""Shared helper: ask the Codex CLI for one generated image and return its path.

Codex saves into its own generated_images folder (its exec sandbox is
read-only) and is told to reply with only that path; we read the reply from
--output-last-message, so several runs can go at once without mixing up
whose image is whose.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

CODEX_BIN = Path.home() / "AppData/Local/OpenAI/Codex/bin"
REPLY = "When done, reply with only the absolute path of the saved image file."


def codex_exe() -> Path:
    found = sorted(CODEX_BIN.glob("*/codex.exe"), key=lambda p: p.stat().st_mtime)
    if not found:
        sys.exit(f"codex.exe not found under {CODEX_BIN}")
    return found[-1]


def generate_png(prompt: str, workdir: Path, refs: list[Path] = ()) -> Path:
    """Run one Codex image job; `refs` are attached to the prompt."""
    workdir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        last = Path(tmp) / "last.txt"
        cmd = [str(codex_exe()), "exec", "--skip-git-repo-check", "-C", str(workdir), "-o", str(last)]
        for r in refs:
            cmd += ["-i", str(r)]
        subprocess.run(cmd + ["--", f"{prompt} {REPLY}"], check=True, timeout=900)
        reply = last.read_text(encoding="utf-8", errors="replace") if last.exists() else ""
    paths = [Path(p) for p in re.findall(r"[A-Za-z]:[\\/][^\s`'\"]+?\.png", reply)]
    found = [p for p in paths if p.exists()]
    if not found:
        raise RuntimeError(f"no image path in Codex reply: {reply[:300]!r}")
    return found[-1]
