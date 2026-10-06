#!/usr/bin/env python3
"""홈페이지 탭 아이콘 파일을 public/에 쓴다. 정의는 ai-safety-common의 favicon.py("home") 한곳 — 모양·색을 바꾸면 거기서.

    python3 scripts/make_favicon.py      # public/favicon.svg · favicon-32.png · apple-touch-icon.png
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, os.environ.get("AI_SAFETY_COMMON") or str(Path.home() / "Code" / "ai-safety-common"))
from aisafety_common import favicon  # noqa: E402

if __name__ == "__main__":
    for p in favicon.write_files(favicon.HOME_KEY, ROOT / "public"):
        print("->", p.relative_to(ROOT))
