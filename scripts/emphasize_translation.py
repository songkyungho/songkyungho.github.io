"""Mark key passages in a /translations JSON with Claude, for readers skimming a long document.

Two kinds of marks are added to each Korean block as {"t": exact substring, "k": kind}:
  key     — the bottom line of a risk item (what the risk is and what follows), 1–2 per item
  safety  — passages that matter for AI safety (misalignment, misuse, catastrophic risk,
            loss of control, safety evaluation, safety governance, ...), marked generously
The model works one heading segment at a time and must copy each passage verbatim; marks that
do not match the Korean text exactly (after whitespace normalisation) are dropped and counted.
Results are cached per segment under work/emphasis/<slug>/ so a rerun only fills the gaps.

Needs the anthropic SDK (run with doc-translator's venv) and SONG_CLAUDE_KEY in the environment
or in ~/.config/ai-safety/env.

Usage: ~/.venvs/doc-translator/bin/python scripts/emphasize_translation.py app/data/translations/SLUG.json [--limit N] [--workers 6]
"""

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import anthropic

MODEL = "claude-opus-5-5"
EFFORT = "medium"
PRICE_IN, PRICE_OUT = 4.0, 20.0  # USD per million tokens
SHARED_ENV = Path.home() / ".config" / "ai-safety" / "env"

SYSTEM = """당신은 AI 안전 연구자를 위해 긴 번역문에 강조 표시를 다는 편집자다. 독자는 프론티어 AI 기업의 공시·정책 문서를 훑어 읽으며, AI 안전과 관련된 서술과 각 항목의 요점을 빨리 찾고 싶어 한다.

입력은 문서의 한 항목(제목과 번호 붙은 본문 블록)이다. 두 종류의 표시를 고른다.

1. safety (형광 밑줄) — AI 안전과 직접 관련된 서술. 넉넉히 표시한다.
   - 모델의 오정렬, 예기치 않거나 의도와 다른 행동, 기만, 보상 해킹, 안전장치 우회
   - 오용: 생물·화학·핵·사이버 공격, 감시, 조작·허위정보, 탈옥
   - 파국적·실존적 위험, 통제 상실, 자율 에이전트의 위험
   - 안전 평가, 레드티밍, 책임 있는 확장 정책(RSP)·AI 안전 수준(ASL), 해석 가능성, 안전 연구
   - 안전과 상업적 압력·경쟁·배포 속도 사이의 긴장, 안전 약속을 지키지 못할 가능성
   - AI 안전과 관련된 규제·수출 통제·정부와의 관계
   - 안전을 위한 지배구조(공익법인, 장기이익신탁 등)와 그것이 주주 이익과 충돌할 수 있다는 서술
   일반적인 사업 위험(세금, 회계, 주가 변동, 일반 경쟁, 인력, 자금 조달)은 표시하지 않는다.
   문장 전체보다 핵심 구절을 고른다(대략 10–80자). 한 블록에 여러 개 골라도 된다.

2. key (굵게) — 이 항목의 핵심 결론: 무엇이 위험이고 그 결과가 무엇인지. 항목 전체에서 1–2곳, 한 문장 이내.
   제목이 없는 머리말이나 절 제목만 있는 입력에는 key를 고르지 않아도 된다.

규칙:
- text는 해당 블록의 한국어 문장에서 한 글자도 바꾸지 않고 그대로 복사한 연속 부분 문자열이어야 한다. 띄어쓰기·문장부호까지 같아야 한다.
- 한 표시가 블록이나 빈 줄(문단 경계)을 넘지 않는다. 서로 겹치는 표시를 고르지 않는다.
- 제목 블록(type h2·h3)은 표시하지 않는다.
- 표시할 것이 없으면 빈 목록을 돌려준다."""

SCHEMA = {
    "type": "object",
    "properties": {
        "marks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "block": {"type": "integer"},
                    "text": {"type": "string"},
                    "kind": {"type": "string", "enum": ["key", "safety"]},
                },
                "required": ["block", "text", "kind"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["marks"],
    "additionalProperties": False,
}


def load_key() -> str:
    key = os.environ.get("SONG_CLAUDE_KEY", "").strip()
    if key or not SHARED_ENV.exists():
        return key
    for line in SHARED_ENV.read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("SONG_CLAUDE_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def segments(blocks: list[dict]) -> list[list[int]]:
    out, cur = [], []
    for n, b in enumerate(blocks):
        if b["type"] in ("h2", "h3") and cur:
            out.append(cur)
            cur = []
        cur.append(n)
    out.append(cur)
    return out


def locate(text: str, needle: str) -> tuple[int, int] | None:
    """Exact match first; otherwise match with any run of whitespace treated as equal."""
    i = text.find(needle)
    if i >= 0:
        return i, i + len(needle)
    words = needle.split()
    if not words:
        return None
    m = re.search(r"\s+".join(map(re.escape, words)), text)
    return (m.start(), m.end()) if m else None


def ask(client: anthropic.Anthropic, blocks: list[dict], seg: list[int]) -> tuple[list[dict], int, int]:
    lines = [f"[{n}] ({blocks[n]['type']}) {blocks[n]['ko']}" for n in seg]
    with client.messages.stream(
        model=MODEL,
        max_tokens=32000,
        system=SYSTEM,
        messages=[{"role": "user", "content": "\n\n".join(lines)}],
        output_config={"effort": EFFORT, "format": {"type": "json_schema", "schema": SCHEMA}},
    ) as stream:
        resp = stream.get_final_message()
    if resp.stop_reason == "refusal":
        raise RuntimeError("refusal")
    text = next(b.text for b in resp.content if b.type == "text")
    return json.loads(text)["marks"], resp.usage.input_tokens, resp.usage.output_tokens


def apply_marks(blocks: list[dict], seg: list[int], marks: list[dict]) -> int:
    """Attach validated, non-overlapping marks to blocks. Returns the number dropped."""
    dropped = 0
    spans: dict[int, list[tuple[int, int, str, str]]] = {}
    for m in marks:
        n = m["block"]
        if n not in seg or blocks[n]["type"] not in ("p", "li"):  # 제목·표에는 강조를 달지 않는다
            dropped += 1
            continue
        ko = blocks[n]["ko"]
        pos = locate(ko, m["text"].strip())
        if pos is None or "\n\n" in ko[pos[0]:pos[1]]:
            dropped += 1
            continue
        taken = spans.setdefault(n, [])
        if any(pos[0] < e and s < pos[1] for s, e, _, _ in taken):
            dropped += 1
            continue
        taken.append((pos[0], pos[1], ko[pos[0]:pos[1]], m["kind"]))
    for n in seg:
        blocks[n].pop("marks", None)
        if n in spans:
            blocks[n]["marks"] = [{"t": t, "k": k} for _, _, t, k in sorted(spans[n])]
    return dropped


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("json_path")
    ap.add_argument("--limit", type=int, help="only the first N segments that have body text")
    ap.add_argument("--only", type=int, nargs="+", help="only the segments starting at these block indices")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()

    path = Path(args.json_path)
    doc = json.loads(path.read_text(encoding="utf-8"))
    blocks = doc["blocks"]
    cache = Path("work/emphasis") / doc["slug"]
    cache.mkdir(parents=True, exist_ok=True)

    segs = [s for s in segments(blocks) if any(blocks[n]["type"] in ("p", "li") for n in s)]
    if args.only:
        segs = [s for s in segs if s[0] in args.only]
    if args.limit:
        segs = segs[: args.limit]
    todo = [s for s in segs if not (cache / f"{s[0]}.json").exists()]
    print(f"{len(segs)} segments, {len(todo)} to ask ({MODEL}, effort {EFFORT})", flush=True)

    api_key = load_key()
    if not api_key:
        sys.exit("!! SONG_CLAUDE_KEY not found")
    client = anthropic.Anthropic(api_key=api_key, max_retries=4)
    tokens_in = tokens_out = 0
    failed = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(ask, client, blocks, s): s for s in todo}
        for i, fut in enumerate(as_completed(futures), 1):
            seg = futures[fut]
            try:
                marks, t_in, t_out = fut.result()
            except Exception as e:  # noqa: BLE001 - report and continue; a rerun retries the gap
                failed.append(seg[0])
                print(f"  ! segment {seg[0]}: {type(e).__name__}: {e}", file=sys.stderr, flush=True)
                continue
            tokens_in += t_in
            tokens_out += t_out
            (cache / f"{seg[0]}.json").write_text(json.dumps(marks, ensure_ascii=False), encoding="utf-8")
            print(f"  [{i}/{len(todo)}] segment {seg[0]}: {len(marks)} marks", flush=True)

    dropped = kept = 0
    for s in segs:
        f = cache / f"{s[0]}.json"
        if f.exists():
            dropped += apply_marks(blocks, s, json.loads(f.read_text(encoding="utf-8")))
            kept += sum(len(blocks[n].get("marks", [])) for n in s)
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    cost = (tokens_in * PRICE_IN + tokens_out * PRICE_OUT) / 1e6
    kinds = {}
    for b in blocks:
        for m in b.get("marks", []):
            kinds[m["k"]] = kinds.get(m["k"], 0) + 1
    print(f"done: marks kept {kept} {kinds}, dropped {dropped}, failed segments {failed}")
    print(f"this run: input {tokens_in:,} / output {tokens_out:,} tokens, about ${cost:.2f}")


if __name__ == "__main__":
    main()
