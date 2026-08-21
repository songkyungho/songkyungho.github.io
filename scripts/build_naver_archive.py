#!/usr/bin/env python3
"""Build the site's Naver writing inventory from downloaded source snapshots."""

from __future__ import annotations

import csv
import html
import json
import re
from pathlib import Path
from urllib.parse import unquote_plus

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "work"
OUTPUT = ROOT / "outputs"
DATA = ROOT / "app" / "data"

FEATURED = {
    "222108346299": ("university-tomorrow-734-elephants", "/images/writing/university-tomorrow/734-elephants.jpg"),
    "222108321644": ("university-tomorrow-686-poverty", "/images/writing/university-tomorrow/686-poverty.jpg"),
    "222107544175": ("university-tomorrow-657-song-taeseop", "/images/writing/university-tomorrow/657-song-taeseop.jpg"),
}

IMAGE_MAP_PATH = WORK / "naver-image-map.json"


def parse_naver_json(path: Path) -> dict:
    # Naver escapes apostrophes inside pagingHtml, which is valid JavaScript but
    # invalid strict JSON. It is safe to normalize only that escape sequence.
    return json.loads(path.read_text(encoding="utf-8").replace("\\'", "'"))


def decode_title(value: str) -> str:
    return html.unescape(unquote_plus(value)).strip()


def title_parts(raw: str) -> tuple[str, str, str | None, str | None]:
    bracket = re.match(r"^\[([^]]+)\]\s*", raw)
    outlet = bracket.group(1) if bracket else "개인 에세이"
    title = raw[bracket.end():] if bracket else raw
    year_match = re.search(r"\s*\((20\d{2})\)\s*$", title)
    year = year_match.group(1) if year_match else None
    if year_match:
        title = title[:year_match.start()].strip()
    issue_match = re.search(r"(\d+)호", outlet)
    issue = issue_match.group(1) if issue_match else None
    publication = re.sub(r"\s+\d+호$", "", outlet)
    return title, publication, year, issue


def classify(publication: str, category_no: str) -> str:
    if "이슈브리프" in publication:
        return "이슈브리프"
    if category_no == "92" and "대학내일" not in publication:
        return "에세이"
    return "칼럼"


def extract_post(log_no: str) -> tuple[list[str], str | None]:
    path = WORK / f"post-{log_no}.html"
    if not path.exists():
        return [], None
    soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    main = soup.select_one(".se-main-container")
    paragraphs: list[str] = []
    if main:
        for node in main.select(".se-text-paragraph"):
            text = node.get_text(" ", strip=True).replace("\u200b", "").strip()
            if text and text not in paragraphs:
                paragraphs.append(text)
    else:
        legacy = soup.select_one(".sect_dsc.__se_component_area")
        if legacy:
            for node in legacy.select(".se_textarea"):
                clone = BeautifulSoup(str(node), "html.parser")
                for line_break in clone.find_all("br"):
                    line_break.replace_with("\n")
                raw = clone.get_text("", strip=False).replace("\u200b", "")
                for chunk in re.split(r"\n\s*(?:\xa0\s*)?\n+", raw):
                    text = re.sub(r"\s+", " ", chunk).strip()
                    if text and text not in paragraphs:
                        paragraphs.append(text)
    image = soup.select_one('meta[property="og:image"]')
    return paragraphs, image.get("content") if image else None


def main() -> None:
    image_map = json.loads(IMAGE_MAP_PATH.read_text(encoding="utf-8")) if IMAGE_MAP_PATH.exists() else {}
    records = []
    for path in sorted(WORK.glob("naver-posts-*.json")):
        records.extend(parse_naver_json(path)["postList"])

    archive = []
    for item in records:
        log_no = item["logNo"]
        raw_title = decode_title(item["title"])
        title, publication, year, issue = title_parts(raw_title)
        if not year:
            year = "2014" if publication == "SK이노베이션 블로그" else item["addDate"].split(".")[0]
        paragraphs, remote_image = extract_post(log_no)
        featured = FEATURED.get(log_no)
        saved_image = image_map.get(log_no)
        archive.append({
            "logNo": log_no,
            "slug": featured[0] if featured else f"writing-{log_no}",
            "title": title,
            "rawTitle": raw_title,
            "publication": publication,
            "issue": issue,
            "year": year,
            "naverCategory": "칼럼" if item["categoryNo"] == "93" else "에세이",
            "section": classify(publication, item["categoryNo"]),
            "sourceUrl": f"https://blog.naver.com/ecopower/{log_no}",
            "naverImportedAt": item["addDate"],
            "image": featured[1] if featured else (saved_image or {}).get("local"),
            "imageSource": (saved_image or {}).get("source", remote_image),
            "body": paragraphs,
            "migrationStatus": "상세 페이지 완료" if paragraphs else "본문 확인 필요",
        })

    if len(archive) != 90 or len({item["logNo"] for item in archive}) != 90:
        raise RuntimeError(f"Expected 90 unique posts, got {len(archive)}")

    DATA.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (DATA / "naver-archive.json").write_text(
        json.dumps(archive, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    with (OUTPUT / "naver-writing-inventory.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "logNo", "title", "publication", "issue", "year", "naverCategory",
            "section", "sourceUrl", "naverImportedAt", "migrationStatus", "imageSource",
        ])
        writer.writeheader()
        for item in archive:
            writer.writerow({key: item.get(key) for key in writer.fieldnames})

    print(f"Wrote {len(archive)} records; {sum(bool(item['body']) for item in archive)} include full text.")


if __name__ == "__main__":
    main()
