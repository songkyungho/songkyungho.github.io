"""Add structured author/org/series metadata to 보고서 entries in
app/data/research-archive.json, and append the one report that isn't
on the Notion research page at all (the translated International AI
Safety Report), all per the user directly, not from Notion.

Author entries are "이름 역할" only - no email addresses, which the
user supplied to disambiguate people (there are two similarly-named
지연s on different reports) rather than to publish.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "app" / "data" / "research-archive.json"

AISI = "인공지능안전연구소"

REPORT_DETAILS = {
    "2026-001": {
        "series": None,
        "title": "EU 인공지능법 범용인공지능(GPAI) 실천강령(CoP) 한글 안내서",
        "authors": ["최민석", "송경호", "주지연", "신민규"],
        "org": AISI,
    },
    "2026-002": {
        "series": "AI 안전 동향 분석 시리즈 26-01",
        "title": "AI사고 정의 및 보고체계 국제동향",
        "authors": ["송경호", "주지연"],
        "org": AISI,
    },
    "2026-003": {
        "series": "인공지능 위험과 대응방안",
        "title": "인공지능 사고 데이터 분석을 통한 AI위험 분석",
        "authors": ["송경호"],
        "org": AISI,
    },
    "2025-005": {
        "series": "공론화 기반 AI 정책 보고서: AI와 환각",
        "title": "AI 환각의 기술-사회적 구조와 대응방안",
        "authors": ["송경호"],
        "org": None,
    },
}

NEW_REPORT = {
    "tag": "보고서",
    "year": "2026",
    "month": None,
    "day": None,
    "title": "국제 AI 안전 보고서 2026 (한국어 번역본)",
    "text": "국제 AI 안전 보고서 2026 (한국어 번역본)",
    "kind": "보고서",
    "slug": "2026-intl-report",
    "url": "https://www.aisi.re.kr/kor/article/ATCL75b4fb0a5/119?ptSignature=myq8exWppBvlsub5Sr8a78bbxNkUKo%2FOOa%2BANLitP%2BRowKOb42MhFxHrU0ICe2q3LdIPbqDkrRvJdrTsOsGp9dnU11bqw0oMz45R%2FI9IYLDzXT6qglQn6l1onjnE29oiEv8nRNgTLWhnXaSC9Es%2FmmMJGpdzRzCBZOlC0j%2BazP4dITmIZzhvti5pxvJNK0MtAU2DH7rZuWZAq7ixMWupri8LXwk6UA%2Bi%2Bk0vO39Dc9CE3TpQgizHo6bogvNJseNkQ0MhgRjeEvYesH0QCgy2I73dWs8ndLWNywGuU4df2hmlbGtJlXN7nZsCA1zhb5nV5VGrkHOQyXYE8RPKXANECiE8IXPPMoUKWSsXPMh9q5v2UZMsjUDEJDIiV3U3jUv1XHsKNOjoTOJVg%2BCXr0Vw8w%3D%3D&csSignature=otfgVv%2FgBQVw2Shwj0QlXA%3D%3D&mno=&pageIndex=1&searchCondition=&searchKeyword=",
    "image": None,
    "note": None,
    "series": None,
    "authors": ["최민석", "신민규", "조지연", "송경호"],
    "org": AISI,
}


def main():
    data = json.loads(RESEARCH.read_text(encoding="utf-8"))
    for item in data:
        item.setdefault("series", None)
        item.setdefault("authors", None)
        item.setdefault("org", None)
        details = REPORT_DETAILS.get(item["slug"])
        if details:
            item.update(details)

    if not any(item["slug"] == NEW_REPORT["slug"] for item in data):
        data.append(dict(NEW_REPORT))

    data.sort(key=lambda e: (-int(e["year"]), -(e["month"] or 0), -(e["day"] or 0)))
    RESEARCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"total entries: {len(data)}")


if __name__ == "__main__":
    main()
