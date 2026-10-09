"""Match the outbound links captured from the Notion research page
(notion-raw/research-links.json: url -> nearby text) onto
app/data/research-archive.json entries by fuzzy text overlap, adding a
`url` field. Also backfills the corrected sourceUrl/year for the four
새로 발견된 통일연구원 이슈브리프 entries in writing-archive.json now that
their exact publish dates are confirmed from article:published_time.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINKS = json.loads((ROOT / "notion-raw" / "research-links.json").read_text(encoding="utf-8"))
RESEARCH = ROOT / "app" / "data" / "research-archive.json"


TAG_RE = re.compile(r"^\[([^\]]+)\]")
YEAR_RE = re.compile(r"(\d{4})")


def main():
    research = json.loads(RESEARCH.read_text(encoding="utf-8"))
    for item in research:
        item["url"] = None

    used = set()
    matched = 0
    for url, context in LINKS.items():
        tag_match = TAG_RE.match(context.strip())
        if not tag_match:
            continue
        tag = tag_match.group(1)
        year_match = YEAR_RE.search(context[len(tag_match.group(0)):])
        year = year_match.group(1) if year_match else None
        for item in research:
            key = id(item)
            if key in used:
                continue
            if item["tag"] == tag and (year is None or item["year"] == year):
                item["url"] = url
                used.add(key)
                matched += 1
                break

    RESEARCH.write_text(json.dumps(research, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"matched {matched} / {len(research)} research entries with an outbound link")
    unmatched = [item["text"][:70] for item in research if not item["url"]]
    if unmatched:
        print("unmatched:")
        for t in unmatched:
            print(" -", t)


if __name__ == "__main__":
    main()
