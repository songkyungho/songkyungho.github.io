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

# this entry has no single talk title of its own - the only quoted
# text is a panel name inside the venue tag, which TITLE_RE would
# otherwise mistake for the title and split the venue text in two
NO_TITLE_OVERRIDES = {
    "IT정치연구회 기획 패널",
}

# 돌깨TV filmed this talk (the Jesuit center colloquium) - link the
# recording on the talk entry itself rather than filing it as a
# standalone media interview, since that's what it actually is
VIDEO_OVERRIDES = {
    "나는 내가 믿고 싶은 것을 믿는다": "https://youtu.be/_oPWn3JEm9U",
}

# every 특강/토론/사회 entry is his own (unlike 발표, which lists whichever
# collaborators presented) - the byline naming him before the date is
# redundant there, so strip it when it's the whole entry
NAME_PREFIX_KINDS = {"특강", "토론", "사회"}
NAME_PREFIXES = ["송경호. ", "Kyungho Song. ", "김현ㆍ송경호. "]

# a handful of 특강 entries give only a month (no day), because they're
# recurring semester-long courses rather than a single-day talk - keyed
# by a distinctive prefix of the untouched source line
SEMESTER_LABELS = {
    "2021. 3. 클러스터": "2021년 1학기 클러스터",
    "2020. 9. 클러스터": "2020년 2학기 클러스터",
    "2020. 3. 주문형강좌": "2020년 1학기 주문형강좌",
    "2020 3. 클러스터": "2020년 1학기 클러스터",
    "2019. 2. 청소년": "2019년 겨울학기 청소년",
    "2017. 8. 청소년": "2017년 여름학기 청소년",
    "2017. 2. 청소년": "2017년 겨울학기 청소년",
    "2016. 8. 청소년": "2016년 여름학기 청소년",
    "2016. 2. 청소년": "2016년 겨울학기 청소년",
    "2015. 8. 청소년": "2015년 여름학기 청소년",
    "2015. 2. 청소년": "2015년 겨울학기 청소년",
    "2014. 8. 청소년": "2014년 여름학기 청소년",
}

# a multi-year posting, not a single date - show it as an explicit
# period instead of leaving the raw "2009. 1. – 2011. 12." text
PERIOD_LABELS = {
    "2009. 1. – 2011. 12.": "(2009.01–2011.12)",
}

# entries that ran across two non-adjacent days - keyed by a distinctive
# prefix of the untouched source line, value is (month2, day2). The
# leftover "& ..." fragment left behind by DATE_RE is stripped from the
# detail separately once the override matches.
DOUBLE_DATE_OVERRIDES = {
    "2024. 7. 28. & 8. 1.": (8, 1),
    "2024. 7. 8. & 15.": (7, 15),
    "2019. 11. 26. & 28.": (11, 28),
    "2019. 5. 28. & 30.": (5, 30),
}
DOUBLE_DATE_LEFTOVER_RE = re.compile(r"^&\s*(?:\d{1,2}\.\s*)?\d{1,2}\.?\s*")

YEAR_HEADER_RE = re.compile(r"^(\d{4})(–\d{4})?$")
TAG_LINE_RE = re.compile(r"^\[([^\]]+)\]\s*(.*)$")
DATE_RE = re.compile(r"(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?")
YEAR_ONLY_RE = re.compile(r"(\d{4})")
# each quote style is its own alternative (rather than one character
# class covering all three) so a “...” title that itself contains a
# nested 『book title』 doesn't get truncated at the inner closing mark
TITLE_RE = re.compile(r"“([^”]{2,200})”|\"([^\"]{2,200})\"|『([^』]{2,200})』")


def title_text(match):
    return next(g for g in match.groups() if g is not None)


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
            # a day-range date ("2008. 3. 26-29." or "2007. 2. 16~17.")
            # only ever matches the first day, leaving the range's tail
            # stuck right after the author list - drop it rather than
            # show it dangling before the title
            detail = re.sub(r"\.\s*[-~]\d{1,2}\.\s*", ". ", detail)
        else:
            year_only = YEAR_ONLY_RE.search(rest)
            year = year_only.group(1) if year_only else current_year
            month, day = None, None
            detail = rest
        if not year:
            year = current_year or "0000"

        title_match = None if any(n in rest for n in NO_TITLE_OVERRIDES) else TITLE_RE.search(rest)
        title = title_text(title_match).rstrip(",").strip() if title_match else None

        authors_raw = rest[: date_match.start()].strip(" .") if date_match else ""
        authors = re.sub(r"\s*[ㆍ;]\s*", ", ", authors_raw).strip(", ") or None

        entry = {
            "tag": tag,
            "year": year,
            "detail": detail,
            "month": int(month) if month else None,
            "day": int(day) if day else None,
            "title": title,
            "authors": authors,
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
            if kind in NAME_PREFIX_KINDS:
                for name_prefix in NAME_PREFIXES:
                    if entry["detail"].startswith(name_prefix):
                        entry["detail"] = entry["detail"][len(name_prefix):]
                        break
            if kind == "특강":
                for needle, label in SEMESTER_LABELS.items():
                    if rest.startswith(needle):
                        entry["detail"] = label + entry["detail"][len(needle):]
                        break
                for needle, label in PERIOD_LABELS.items():
                    if rest.startswith(needle):
                        entry["detail"] = label + entry["detail"][len(needle):]
                        break
                for needle, (month2, day2) in DOUBLE_DATE_OVERRIDES.items():
                    if rest.startswith(needle):
                        entry["month2"] = month2
                        entry["day2"] = day2
                        entry["detail"] = DOUBLE_DATE_LEFTOVER_RE.sub("", entry["detail"])
                        break
            for needle, video_url in VIDEO_OVERRIDES.items():
                if needle in rest:
                    entry["videoUrl"] = video_url
                    break

            entry["region"] = prefix if kind in ("학술발표", "발표") else None
            venue = entry["detail"]
            if prefix and venue.startswith(f"[{prefix}] "):
                venue = venue[len(f"[{prefix}] "):]
            title_in_venue = None if any(n in rest for n in NO_TITLE_OVERRIDES) else TITLE_RE.search(venue)
            if title_in_venue:
                venue = venue[title_in_venue.end():]
            elif authors_raw and venue.startswith(authors_raw):
                venue = venue[len(authors_raw):]
            venue = re.sub(r"^[,.\s]+", "", venue).strip()
            entry["venue"] = venue or None

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
