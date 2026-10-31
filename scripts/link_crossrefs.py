"""Turn in-document cross-references in a /translations JSON into links to the referenced heading.

SEC filings point to other risk factors as: see the section titled “—<item heading>” (a leading dash
means "within this section"). Each such quoted heading in the English block is matched to an h2/h3
block by its English text; the Korean block carries the same quotes in the same order, so the n-th
dashed quote in Korean is paired with the n-th in English. The result is stored per block as
"refs": [{"t": <exact Korean text inside the quotes>, "to": <heading id>}].
References to other parts of the filing (MD&A, Business, …) are left alone — they are not on the page.

Usage: python3 scripts/link_crossrefs.py app/data/translations/SLUG.json
"""

import json
import re
import sys

EN_REF = re.compile(r"“\s*—\s*(.+?)”", re.S)
KO_REF = re.compile(r"[“\"「『]\s*([—–-]\s*.+?)[”\"」』]", re.S)
EN_NUM = re.compile(r"\bSections?\s+(\d+(?:\.\d+)*)\b|\bAppendix\s+([A-Z](?:\.\d+)*)\b")
KO_NUM = re.compile(r"\d+(?:\.\d+)*절|섹션\s?\d+(?:\.\d+)*|부록\s*[A-Z](?:\.\d+)*")


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def main(path: str) -> None:
    doc = json.load(open(path, encoding="utf-8"))
    blocks = doc["blocks"]
    headings = [(b["id"], norm(b["en"])) for b in blocks if b["type"] in ("h2", "h3")]

    def target(title: str) -> str:
        key = norm(title.rstrip(". ,"))
        hits = [hid for hid, h in headings if h == key] or [hid for hid, h in headings if h.startswith(key) or key.startswith(h)]
        if len(hits) != 1:
            sys.exit(f"cannot resolve reference {title[:70]!r}: {len(hits)} candidate headings")
        return hits[0]

    def numbered_target(number: str | None, letter: str | None) -> str | None:
        """'Section 3.6' → '3.6 …' 제목, 'Appendix A' → 'Appendix A …' 제목(또는 'A …', 'C.1 …'처럼 기호로 시작하는 제목)."""
        for b in blocks:
            if b["type"] not in ("h2", "h3"):
                continue
            en = b["en"].strip()
            if number and re.match(rf"^(?:Section )?{re.escape(number)}[.:]?\s", en):
                return b["id"]
            if letter and re.match(rf"^(?:Appendix )?{re.escape(letter)}[.:]?(?:\s|$)", en):
                return b["id"]
        return None

    total = numbered = skipped = 0
    for n, b in enumerate(blocks):
        b.pop("refs", None)
        if b["type"] not in ("p", "li"):  # 링크는 문단·목록 항목에만 그린다 (제목 자신·표 안은 제외)
            continue
        marks = b.get("marks", [])
        # 정책 문서식 참조: "Section 3.6", "Appendix A" ↔ 번역문의 "3.6절", "부록 A" (순서대로 짝)
        en_num = list(EN_NUM.finditer(b["en"]))
        ko_num = list(KO_NUM.finditer(b["ko"]))
        if en_num and len(en_num) == len(ko_num):
            for e, k in zip(en_num, ko_num):
                to = numbered_target(e.group(1), e.group(2))
                ko = k.group(0)
                if not to or any(ko in m["t"] or m["t"] in ko for m in marks):
                    skipped += 1
                    continue
                b.setdefault("refs", []).append({"t": ko, "to": to})
                numbered += 1
        elif en_num:
            skipped += len(en_num)
        en_refs = EN_REF.findall(b["en"])
        if not en_refs:
            continue
        ko_refs = KO_REF.findall(b["ko"])
        if len(ko_refs) != len(en_refs):
            sys.exit(f"block {n}: {len(en_refs)} references in English but {len(ko_refs)} in Korean")
        refs = b.get("refs", [])
        for title, ko in zip(en_refs, ko_refs):
            ko = ko.strip()
            if any(ko in m["t"] or m["t"] in ko for m in marks):
                sys.exit(f"block {n}: reference overlaps an emphasis mark: {ko[:40]!r}")
            refs.append({"t": ko, "to": target(title)})
        b["refs"] = refs
        total += len(refs)

    json.dump(doc, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(path, "a", encoding="utf-8").write("\n")
    print(f"linked {total} quoted-heading and {numbered} numbered cross-references ({skipped} numbered skipped)")


if __name__ == "__main__":
    main(sys.argv[1])
