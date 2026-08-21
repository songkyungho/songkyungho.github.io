"""Parse notion-raw/research-talks.txt into app/data/research-archive.json
and app/data/talks-archive.json.

The source is a flat, year-sectioned log exported from Notion:
  2025
  [tag] authors. YEAR. M. D. "Title" <Venue> (Location) [토론] Names
  ...

Each entry keeps its tag and the full citation text verbatim (this is a
log, not a database - see conversation) rather than trying to split
authors/title/venue into separate fields, since the source formatting is
too inconsistent across 20 years to split reliably.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "notion-raw" / "research-talks.txt"

PUBLICATION_MARKERS = [
    "등재", "SCOPUS", "SSCI", "A&HCI", "저서", "역서", "학위논문", "보고서",
]

YEAR_HEADER_RE = re.compile(r"^(\d{4})(–\d{4})?$")
TAG_LINE_RE = re.compile(r"^\[([^\]]+)\]\s*(.*)$")
DATE_RE = re.compile(r"(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})")
YEAR_ONLY_RE = re.compile(r"(\d{4})")
TITLE_RE = re.compile(r"[“\"『]([^”\"』]{2,200})[”\"』]")


def is_publication(tag: str) -> bool:
    return any(marker in tag for marker in PUBLICATION_MARKERS)


def publication_kind(tag: str) -> str:
    if "학위논문" in tag:
        return "학위논문"
    if "역서" in tag:
        return "역서"
    if "저서" in tag:
        # every "저서"-tagged entry so far is a chapter in an edited
        # volume (someone else is credited as 편/editor), not a
        # solely-authored book - see conversation
        return "편저"
    if "보고서" in tag:
        return "보고서"
    return "논문"


def talk_kind(tag: str) -> str:
    for marker in ["발표", "특강", "토론", "사회", "좌담", "포스터"]:
        if marker in tag:
            return marker
    return "기타"


def slugify(year: str, index: int) -> str:
    return f"{year}-{index:03d}"


def main():
    lines = SRC.read_text(encoding="utf-8").splitlines()
    current_year = None
    publications = []
    talks = []
    pub_counter = {}
    talk_counter = {}

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        year_match = YEAR_HEADER_RE.match(line)
        if year_match:
            current_year = year_match.group(1)
            continue
        tag_match = TAG_LINE_RE.match(line)
        if not tag_match:
            continue
        tag, rest = tag_match.groups()
        rest = rest.strip()

        date_match = DATE_RE.search(rest)
        if date_match:
            year, month, day = date_match.groups()
        else:
            year_only = YEAR_ONLY_RE.search(rest)
            year = year_only.group(1) if year_only else current_year
            month, day = None, None
        if not year:
            year = current_year or "0000"

        title_match = TITLE_RE.search(rest)
        title = title_match.group(1).strip() if title_match else None

        entry = {
            "tag": tag,
            "year": year,
            "month": int(month) if month else None,
            "day": int(day) if day else None,
            "title": title,
            "text": rest,
        }

        if is_publication(tag):
            entry["kind"] = publication_kind(tag)
            counter = pub_counter
            bucket = publications
        else:
            entry["kind"] = talk_kind(tag)
            counter = talk_counter
            bucket = talks

        idx = counter.get(year, 0) + 1
        counter[year] = idx
        entry["slug"] = slugify(year, idx)
        bucket.append(entry)

    def sort_key(e):
        return (-int(e["year"]), -(e["month"] or 0), -(e["day"] or 0))

    publications.sort(key=sort_key)
    talks.sort(key=sort_key)

    (ROOT / "app" / "data" / "research-archive.json").write_text(
        json.dumps(publications, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (ROOT / "app" / "data" / "talks-archive.json").write_text(
        json.dumps(talks, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"publications: {len(publications)}, talks: {len(talks)}")


if __name__ == "__main__":
    main()
