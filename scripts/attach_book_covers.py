"""Attach local book cover images to the 저서·역서 entries in
app/data/research-archive.json.

Covers were downloaded from the "Book" gallery on the Notion profile
page (public/images/research/book-*.png) and matched to entries by
chronological order - both the gallery and the parsed archive list
books in the same document order, so a straight left-to-right zip is
reliable.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "app" / "data" / "research-archive.json"

SLUG_TO_COVER = {
    "2010-001": "book-2010.png",
    "2021-004": "book-2021-a.png",
    "2021-005": "book-2021-b.png",
    "2022-002": "book-2022.png",
    "2023-004": "book-2023.png",
    "2025-003": "book-2025-a.png",
    "2025-004": "book-2025-b.png",
}


def main():
    data = json.loads(RESEARCH.read_text(encoding="utf-8"))
    tagged = 0
    for item in data:
        item.setdefault("image", None)
        cover = SLUG_TO_COVER.get(item["slug"])
        if cover:
            item["image"] = f"/images/research/{cover}"
            tagged += 1
    RESEARCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"tagged {tagged} / {len(SLUG_TO_COVER)} book covers")


if __name__ == "__main__":
    main()
