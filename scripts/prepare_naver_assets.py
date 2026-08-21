#!/usr/bin/env python3
"""Prepare curl config files for downloading the author's Naver archive."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "work"
PUBLIC = ROOT / "public" / "images" / "writing" / "archive"
ARCHIVE = ROOT / "app" / "data" / "naver-archive.json"


def curl_line(url: str, output: Path) -> str:
    return f'url = "{url}"\noutput = "{output}"\n'


def prepare_posts(records: list[dict]) -> None:
    config = ["compressed\n", "retry = 3\n", "connect-timeout = 15\n"]
    for item in records:
        output = WORK / f"post-{item['logNo']}.html"
        if not output.exists() or output.stat().st_size < 1000:
            url = f"https://blog.naver.com/PostView.naver?blogId=ecopower&logNo={item['logNo']}&redirect=Dlog"
            config.append(curl_line(url, output))
    (WORK / "fetch-naver-posts.conf").write_text("".join(config), encoding="utf-8")
    print(f"Prepared {len(config) - 3} post downloads")


def image_extension(url: str) -> str:
    suffix = Path(unquote(urlparse(url).path)).suffix.lower()
    aliases = {".jpeg": ".jpg", ".jfif": ".jpg"}
    suffix = aliases.get(suffix, suffix)
    return suffix if suffix in {".jpg", ".png", ".gif", ".webp"} else ".jpg"


def prepare_images(records: list[dict]) -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    config = ["compressed\n", "retry = 3\n", "connect-timeout = 15\n", 'header = "Referer: https://blog.naver.com/ecopower"\n']
    mapping: dict[str, dict[str, str]] = {}
    for item in records:
        html_path = WORK / f"post-{item['logNo']}.html"
        if not html_path.exists():
            continue
        soup = BeautifulSoup(html_path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
        meta = soup.select_one('meta[property="og:image"]')
        if not meta or not meta.get("content"):
            continue
        source = str(meta["content"])
        extension = image_extension(source)
        output = PUBLIC / f"{item['logNo']}{extension}"
        mapping[item["logNo"]] = {
            "local": f"/images/writing/archive/{output.name}",
            "source": source,
        }
        if not output.exists() or output.stat().st_size < 500:
            config.append(curl_line(source, output))
    (WORK / "naver-image-map.json").write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (WORK / "fetch-naver-images.conf").write_text("".join(config), encoding="utf-8")
    print(f"Prepared {len(config) - 4} image downloads; {len(mapping)} posts have a representative image")


def main() -> None:
    records = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    mode = sys.argv[1] if len(sys.argv) > 1 else "posts"
    if mode == "posts":
        prepare_posts(records)
    elif mode == "images":
        prepare_images(records)
    else:
        raise SystemExit("usage: prepare_naver_assets.py [posts|images]")


if __name__ == "__main__":
    main()
