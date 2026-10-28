"""Pair a source Markdown document with its doc-translator output for a /translations page.

Both files use the same block layout: "## " section headings, "### " item headings,
"- " bullets and plain paragraphs, one block per non-empty line. The translator keeps
headings and bullets, but sometimes splits a long source paragraph (or a run-in lead
such as "Power and fuel constraints.") into several Korean paragraphs. Within each
heading segment, every run of Korean paragraphs is therefore partitioned into as many
groups as the source run has paragraphs, choosing the split whose group lengths best
track the source lengths. A grouped Korean block keeps its own paragraph breaks ("\n\n").

Usage: python3 scripts/import_translation.py SOURCE.md TRANSLATED.md META.json > app/data/translations/SLUG.json
META.json holds the page fields (slug, title, original_title, publisher, published, source_url, model, ...).
"""

import json
import re
import sys
from itertools import groupby

PREFIX = (("## ", "h2"), ("### ", "h3"), ("- ", "li"))


TABLE_SEP = re.compile(r"^\|[\s:|-]+\|$")


def table_rows(chunk: str) -> str:
    """'[표] | a | b | ⏎ | 1 | 2 |' 한 줄이든, 번역 모델이 풀어 쓴 여러 줄 Markdown 표든 같은 꼴로:
    머리 구분선을 버리고 행을 ' ⏎ '로 잇는다."""
    text = chunk.replace("[표]", "", 1)
    rows = [r.strip() for r in re.split(r"\s*⏎\s*|\n", text) if r.strip()]
    return " ⏎ ".join(r for r in rows if r.startswith("|") and not TABLE_SEP.match(r))


def parse(path: str) -> list[dict]:
    """빈 줄로 나뉜 블록을 읽는다. 빈 줄 없이 한 줄 한 블록인 파일(S-1 등)도 그대로 읽힌다."""
    blocks = []
    for chunk in re.split(r"\n\s*\n", open(path, encoding="utf-8").read()):
        chunk = chunk.strip()
        if not chunk:
            continue
        if chunk.startswith(("[표]", "|")):
            blocks.append({"type": "table", "text": table_rows(chunk)})
            continue
        for line in chunk.splitlines():
            line = line.strip()
            if not line or line.startswith("# "):
                continue
            for mark, kind in PREFIX:
                if line.startswith(mark):
                    blocks.append({"type": kind, "text": line[len(mark):].strip()})
                    break
            else:
                blocks.append({"type": "p", "text": line})
    return blocks


def segments(blocks: list[dict]) -> list[list[dict]]:
    out, cur = [], []
    for b in blocks:
        if b["type"] in ("h2", "h3") and cur:
            out.append(cur)
            cur = []
        cur.append(b)
    out.append(cur)
    return out


def runs(blocks: list[dict]) -> list[tuple[str, list[dict]]]:
    return [(kind, list(group)) for kind, group in groupby(blocks, key=lambda b: b["type"])]


def partition(ko: list[str], en: list[str]) -> list[str]:
    """Split ko into len(en) contiguous groups whose lengths best follow the en lengths."""
    if len(ko) == len(en):
        return ko
    ratio = sum(map(len, ko)) / max(1, sum(map(len, en)))
    n, m = len(ko), len(en)
    INF = float("inf")
    # cost[i][j]: best cost placing ko[:i] into en[:j]
    cost = [[INF] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    cost[0][0] = 0.0
    for j in range(1, m + 1):
        for i in range(j, n - (m - j) + 1):
            for k in range(j - 1, i):
                if cost[k][j - 1] == INF:
                    continue
                size = sum(len(t) for t in ko[k:i])
                c = cost[k][j - 1] + (size - len(en[j - 1]) * ratio) ** 2
                if c < cost[i][j]:
                    cost[i][j], back[i][j] = c, k
    groups, i = [], n
    for j in range(m, 0, -1):
        k = back[i][j]
        groups.append("\n\n".join(ko[k:i]))
        i = k
    return groups[::-1]


def align(en: list[dict], ko: list[dict]) -> list[dict]:
    se, sk = segments(en), segments(ko)
    if len(se) != len(sk):
        sys.exit(f"heading count differs: source {len(se)}, translation {len(sk)}")
    blocks = []
    for n, (a, b) in enumerate(zip(se, sk)):
        ra, rb = runs(a), runs(b)
        if [k for k, _ in ra] != [k for k, _ in rb]:
            sys.exit(f"segment {n}: block types differ ({a[0]['text'][:60]!r})")
        for (kind, ea), (_, kb) in zip(ra, rb):
            ko_texts = [x["text"] for x in kb]
            if len(kb) != len(ea):
                if kind != "p" or len(kb) < len(ea):
                    sys.exit(f"segment {n}: {kind} count differs ({a[0]['text'][:60]!r})")
                ko_texts = partition(ko_texts, [x["text"] for x in ea])
            for x, t in zip(ea, ko_texts):
                blocks.append({"type": kind, "en": x["text"], "ko": t})
    return blocks


def main(src: str, translated: str, meta_path: str) -> None:
    blocks = align(parse(src), parse(translated))
    for n, block in enumerate(blocks):
        if block["type"] in ("h2", "h3"):
            block["id"] = f"s{n}"
    meta = json.load(open(meta_path, encoding="utf-8"))
    meta["stats"] = {
        "blocks": len(blocks),
        "sections": sum(b["type"] == "h2" for b in blocks),
        "items": sum(b["type"] == "h3" for b in blocks),
        "words_en": sum(len(b["en"].split()) for b in blocks),
    }
    json.dump({**meta, "blocks": blocks}, sys.stdout, ensure_ascii=False, indent=1)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main(*sys.argv[1:4])
