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

# posts with no actual photo of their own get this generic Naver-wide
# blog icon back from their og:image meta tag - treat that as no image
# rather than a real thumbnail
NAVER_DEFAULT_OG_IMAGE = "https://ssl.pstatic.net/static/blog/icon/og_270x270.png"

# this post's og:image is an unrelated 참여사회연구소 논문공모전 poster (a
# link elsewhere in the post, not a photo of the piece itself) - drop it
BAD_IMAGE_LOGNOS = {"222111993470"}

# addDate is when the post was added to the Naver blog, not necessarily
# when the piece was originally published (many older/reposted pieces were
# bulk-imported on the same day) - so it isn't trustworthy for day-level
# precision by default. These are cross-posts of columns run elsewhere
# (4x 프레시안 시민정치시평, 1x 경향신문) whose real publish date is
# recoverable from the original article - keyed by logNo.
DATE_OVERRIDES = {
    "222108390052": ("2020", "7", "16"),
    "222164090739": ("2020", "12", "2"),
    "222317884312": ("2021", "3", "26"),
    "222462598364": ("2021", "7", "30"),
    "222108376126": ("2013", "12", "22"),
}

# one-off correction: this Naver post is an interview with him, not a
# column he wrote - see conversation
SECTION_OVERRIDES = {
    "222108370483": ("보도", "press"),
}

# these are cross-posts of 연세대 통일연구원(YINKS) issue briefs - point
# straight at the original YINKS post instead of serving our own copy
OUTLINK_OVERRIDES = {
    "222124292658": "https://www.yinks.or.kr/post/제142호-송경호-전문연구원-2000년대-이후-한국의-북한-인권-연구-동향",
    "222462606782": "https://www.yinks.or.kr/post/제149호-송경호-전문연구원-북한연속간행물-획득-현황과-활용-과제",
    # 프레시안 [시민정치시평] cross-posts - point at the original pressian.com
    # article instead of serving our own copy (see notion-raw/column-essay.txt)
    "222108390052": "https://www.pressian.com/pages/articles/2020071611204102564",
    "222164090739": "https://www.pressian.com/pages/articles/2020120217341532115",
    "222317884312": "https://www.pressian.com/pages/articles/2021032611152727989",
    "222462598364": "https://www.pressian.com/pages/articles/2021073016225795192",
    "222108376126": "https://www.khan.co.kr/article/201312222036445/?s_code=ao018",
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
        if (saved_image or {}).get("source") == NAVER_DEFAULT_OG_IMAGE or log_no in BAD_IMAGE_LOGNOS:
            saved_image = None
        section = classify(publication, item["categoryNo"])
        if section == "이슈브리프":
            # the meta line already reads "{publication} · 이슈브리프" -
            # drop the word from publication itself so it doesn't repeat
            publication = re.sub(r"\s*이슈브리프\s*$", "", publication).strip()
        kind = "post"
        if log_no in SECTION_OVERRIDES:
            section, kind = SECTION_OVERRIDES[log_no]
        override = DATE_OVERRIDES.get(log_no)
        if override:
            year, month, day = override
        else:
            month, day = None, None
        archive.append({
            "logNo": log_no,
            "slug": featured[0] if featured else f"writing-{log_no}",
            "title": title,
            "rawTitle": raw_title,
            "publication": publication,
            "issue": issue,
            "year": year,
            "month": month,
            "day": day,
            "naverCategory": "칼럼" if item["categoryNo"] == "93" else "에세이",
            "section": section,
            "sourceUrl": OUTLINK_OVERRIDES.get(log_no, f"https://blog.naver.com/ecopower/{log_no}"),
            "naverImportedAt": item["addDate"],
            "image": featured[1] if featured else (saved_image or {}).get("local"),
            "imageSource": (saved_image or {}).get("source", remote_image),
            "body": [] if log_no in OUTLINK_OVERRIDES else paragraphs,
            "kind": kind,
            "migrationStatus": "외부 링크만 (전문 미이전)" if log_no in OUTLINK_OVERRIDES
                else ("상세 페이지 완료" if paragraphs else "본문 확인 필요"),
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
