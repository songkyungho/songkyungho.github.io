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

# one-off overrides for entries whose source tag doesn't match how the
# entry actually reads (e.g. tagged [좌담] but he was the speaker, not
# just a discussant) - keyed by a distinctive substring of the entry
KIND_OVERRIDES = {
    "나는 내가 믿고 싶은 것을 믿는다": "발표",
    "내란과 극우 앞에선 사회운동의 고민들": "발표",
    # Keio COE-CCC x Yonsei BK21 joint symposium - academic, but named
    # in Japanese so it doesn't hit any of the Korean/English markers
    "慶應義塾大學": "학술발표",
}

# 돌깨TV filmed this talk (the Jesuit center colloquium) - link the
# recording on the talk entry itself rather than filing it as a
# standalone media interview, since that's what it actually is
VIDEO_OVERRIDES = {
    "나는 내가 믿고 싶은 것을 믿는다": "https://youtu.be/_oPWn3JEm9U",
}

YEAR_HEADER_RE = re.compile(r"^(\d{4})(–\d{4})?$")
TAG_LINE_RE = re.compile(r"^\[([^\]]+)\]\s*(.*)$")
DATE_RE = re.compile(r"(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?")
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
    # the only two [.../기타]-tagged talks are round-table-style
    # discussions, so file them under 좌담 rather than a catch-all 기타
    if "기타" in tag:
        return "좌담"
    return "기타"


ACADEMIC_MARKERS = [
    "학회", "학술대회", "학술회의", "학술토론회", "학술제", "학술발표회",
    "학술연구회", "Congress", "APSA", "Conference", "Convention",
]


def is_academic_talk(rest: str) -> bool:
    """[.../발표]-tagged entries split into 학술발표 (run by an academic
    society / styled as a scholarly conference) vs 발표 (government
    briefings, institute policy seminars, inter-institute symposia) -
    see conversation for the worked examples this rule was checked
    against."""
    return any(marker in rest for marker in ACADEMIC_MARKERS)


def region_prefix(tag: str):
    if "국제" in tag:
        return "국제"
    if "국내" in tag:
        return "국내"
    return None


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
            detail = re.sub(r"\s{2,}", " ", rest[: date_match.start()] + " " + rest[date_match.end() :]).strip(" .")
        else:
            year_only = YEAR_ONLY_RE.search(rest)
            year = year_only.group(1) if year_only else current_year
            month, day = None, None
            detail = rest
        if not year:
            year = current_year or "0000"

        title_match = TITLE_RE.search(rest)
        title = title_match.group(1).strip() if title_match else None

        entry = {
            "tag": tag,
            "year": year,
            "detail": detail,
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
            kind = talk_kind(tag)
            # some entries are tagged e.g. [국제/발표] but are actually a
            # poster ("(poster)" noted inline) rather than a talk
            if "(poster)" in rest.lower():
                kind = "포스터"
            for needle, override in KIND_OVERRIDES.items():
                if needle in rest:
                    kind = override
                    break
            if kind == "발표":
                kind = "학술발표" if is_academic_talk(rest) else "발표"
            entry["kind"] = kind
            prefix = region_prefix(tag)
            if kind in ("학술발표", "발표") and prefix:
                entry["detail"] = f"[{prefix}] {entry['detail']}"
            for needle, video_url in VIDEO_OVERRIDES.items():
                if needle in rest:
                    entry["videoUrl"] = video_url
                    break
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
