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

    total = 0
    for n, b in enumerate(blocks):
        b.pop("refs", None)
        en_refs = EN_REF.findall(b["en"])
        if not en_refs:
            continue
        ko_refs = KO_REF.findall(b["ko"])
        if len(ko_refs) != len(en_refs):
            sys.exit(f"block {n}: {len(en_refs)} references in English but {len(ko_refs)} in Korean")
        marks = b.get("marks", [])
        refs = []
        for title, ko in zip(en_refs, ko_refs):
            ko = ko.strip()
            if any(ko in m["t"] or m["t"] in ko for m in marks):
                sys.exit(f"block {n}: reference overlaps an emphasis mark: {ko[:40]!r}")
            refs.append({"t": ko, "to": target(title)})
        b["refs"] = refs
        total += len(refs)

    json.dump(doc, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(path, "a", encoding="utf-8").write("\n")
    print(f"linked {total} cross-references")


if __name__ == "__main__":
    main(sys.argv[1])
