"""Attach local book cover images and small provenance notes (awards,
translation-grant credit) to the 편저/역서 entries in
app/data/research-archive.json.

Covers were downloaded from the "Book" gallery on the Notion profile
page (public/images/research/book-*.png) and matched to entries by
chronological order - both the gallery and the parsed archive list
books in the same document order, so a straight left-to-right zip is
reliable. Notes came directly from the user, not from Notion.
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

SLUG_TO_NOTE = {
    "2010-001": {"text": "2011년 대한민국학술원 우수학술도서(사회과학 분야) 선정", "url": None},
    "2021-005": {
        "text": "게이오대학교(FMC) 번역출판 지원 프로그램의 지원을 받아 출간",
        "url": "https://www.fmc.keio.ac.jp/publication/translation",
    },
}


def main():
    data = json.loads(RESEARCH.read_text(encoding="utf-8"))
    tagged = 0
    for item in data:
        item.setdefault("image", None)
        item.setdefault("note", None)
        cover = SLUG_TO_COVER.get(item["slug"])
        if cover:
            item["image"] = f"/images/research/{cover}"
            tagged += 1
        note = SLUG_TO_NOTE.get(item["slug"])
        if note:
            item["note"] = note
    RESEARCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"tagged {tagged} / {len(SLUG_TO_COVER)} book covers, {len(SLUG_TO_NOTE)} notes")


if __name__ == "__main__":
    main()
