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


def table_cells(row: str) -> list[str]:
    return [c.strip() for c in row.strip().strip("|").split("|")]


def _join(a: str, b: str) -> str:
    if not a:
        return b
    if not b:
        return a
    return a + ("" if b[:1] in ":;,.)" else " ") + b


def merge_continuation_rows(block: dict) -> dict:
    """한 행의 내용이 쪽 경계·셀 줄바꿈으로 여러 행에 나뉜 것을 합친다.
    원문(영어) 첫 칸이 소문자나 문장부호로 시작하면 앞 행의 이어짐으로 보고, 번역문도 같은 행끼리 합친다."""
    en_rows = [table_cells(r) for r in block["en"].split(" ⏎ ")]
    ko_rows = [table_cells(r) for r in block["ko"].split(" ⏎ ")]
    if len(en_rows) != len(ko_rows):
        return block
    keep_en, keep_ko = [en_rows[0]], [ko_rows[0]]
    for en, ko in zip(en_rows[1:], ko_rows[1:]):
        first = next((c for c in en if c), "")
        if len(keep_en) > 1 and first[:1] and (first[:1].islower() or first[:1] in ":;,.●"):
            for kept, row in ((keep_en[-1], en), (keep_ko[-1], ko)):
                for i, cell in enumerate(row[: len(kept)]):
                    kept[i] = _join(kept[i], cell)
        else:
            keep_en.append(en)
            keep_ko.append(ko)
    fmt = lambda rows: " ⏎ ".join("| " + " | ".join(r) + " |" for r in rows)
    return {**block, "en": fmt(keep_en), "ko": fmt(keep_ko)}


NOTE_BODY = re.compile(r"^(\d{1,2})\s{2,}")


def extract_footnotes(blocks: list[dict]) -> tuple[list[dict], list[dict]]:
    """PDF 쪽 하단 각주가 본문 사이에 독립 문단("2  Note that …")으로 끼어 들어온 것을 빼서 모으고,
    본문의 각주 번호를 '[^n]' 표시로 바꾼다(페이지에서 위첨자 링크로 그림).
    원문은 Docling 꼴(번호 뒤 공백 두 칸, 표 안은 낱말 사이 숫자)로, 번역문은 같은 블록에서 그 번호가
    한 번만 나올 때만 바꾼다 — 모호하면 그대로 둔다."""
    notes, body = [], []
    for b in blocks:
        m = NOTE_BODY.match(b["en"]) if b["type"] == "p" else None
        if m:
            notes.append({"n": int(m.group(1)), "en": b["en"][m.end():].strip(),
                          "ko": re.sub(r"^\d{1,2}\s*", "", b["ko"]).strip()})
        else:
            body.append(b)
    for note in notes:
        note["linked"] = link_note_marker(body, note["n"])
    return body, sorted(notes, key=lambda x: x["n"])


def link_note_marker(body: list[dict], n: int) -> bool:
    """본문에서 각주 n의 표시를 원문·번역문 모두 꼭 한 곳에서 찾으면 '[^n]'으로 바꾼다.
    원문: 먼저 Docling 꼴(번호 뒤 공백 두 칸)을, 없으면 표 안의 낱말 사이 숫자('company 3 |')를 찾는다.
    번역문: 같은 블록에서 앞이 띄어쓰기·쉼표·한글이고 뒤에 단위가 붙지 않는 숫자('고역량13 모델', ',11 당사는')
    — 'ASL-3', '제3자', 'SL4', '5배', '3.6절'은 제외."""
    strict = re.compile(rf"(?<=[^\d\s])(\s?){n}(?=\s{{2}})")
    loose = re.compile(rf"(?<=[A-Za-z.,)”’:;])(?<!\d\.)\s?{n}(?=\s|$)")
    hits = [(i, m) for i, b in enumerate(body) if b["type"] in ("p", "li", "table") for m in strict.finditer(b["en"])]
    if not hits:
        hits = [(i, m) for i, b in enumerate(body) if b["type"] == "table" for m in loose.finditer(b["en"])]
    if len(hits) != 1:
        return False
    i, m = hits[0]
    b = body[i]
    ko_hits = list(re.finditer(rf"(?<=[\s,.가-힣])(?<!제)(?<!\d\.){n}(?![\d.]|\s*[배개명년월일회%절])", b["ko"]))
    if len(ko_hits) != 1:
        return False
    b["en"] = b["en"][: m.start()] + f"[^{n}]" + b["en"][m.end():]
    k = ko_hits[0]
    b["ko"] = b["ko"][: k.start()].rstrip() + f"[^{n}]" + b["ko"][k.end():]
    return True


def merge_split_tables(blocks: list[dict]) -> list[dict]:
    """PDF에서 여러 쪽에 걸친 표는 쪽마다 머리글을 되풀이한 별개의 표로 잡힌다.
    원문 머리글(칸 공백 무시)이 같은 표가 연달아 나오면 하나로 합치고, 되풀이된 머리글 행은 버린다."""
    out: list[dict] = []
    for b in blocks:
        prev = out[-1] if out else None
        if (b["type"] == "table" and prev and prev["type"] == "table"
                and table_cells(prev["en"].split(" ⏎ ")[0]) == table_cells(b["en"].split(" ⏎ ")[0])):
            for lang in ("en", "ko"):
                rows = b[lang].split(" ⏎ ")[1:]
                if rows:
                    prev[lang] = prev[lang] + " ⏎ " + " ⏎ ".join(rows)
            continue
        out.append(b)
    return [merge_continuation_rows(b) if b["type"] == "table" else b for b in out]


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
    blocks, notes = extract_footnotes(merge_split_tables(align(parse(src), parse(translated))))
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
    out = {**meta, "blocks": blocks}
    if notes:
        out["notes"] = notes
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main(*sys.argv[1:4])
