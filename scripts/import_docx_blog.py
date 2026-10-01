"""Convert a structured Word note into blocks for a /writing blog post.

The note follows one layout: Heading 1 for chapters, Heading 2 for claims,
body paragraphs, and "근거 자료" lists where each source is a "▸ title (meta)"
line, a one-line description, then either a hyperlink or a note such as "미공개".
Everything before the "전체 논지" heading (title page, notes to self) is skipped;
"전체 논지" becomes the summary box and its numbered lines become the contents.

Usage: python3 scripts/import_docx_blog.py NOTE.docx SLUG > blocks.json
The output is one {slug: {...}} object to merge into app/data/writing-blocks.json.
"""

import html
import json
import re
import sys
import zipfile
from urllib.parse import urlparse

PARA = re.compile(r"<w:p[ >].*?</w:p>", re.S)
STYLE = re.compile(r'<w:pStyle w:val="([^"]+)"')
TEXT = re.compile(r"<w:t[^>]*>([^<]*)</w:t>")
LINK = re.compile(r'<w:hyperlink[^>]*r:id="([^"]+)"')
REL = re.compile(r'<Relationship [^>]*Id="([^"]+)"[^>]*Target="([^"]+)"')
OUTLINE = re.compile(r"^(\d+)\. ")
CHAPTER = re.compile(r"^(\d+)\. ")
CLAIM = re.compile(r"^(\d+)-(\d+)\. ")


def paragraphs(path):
    with zipfile.ZipFile(path) as z:
        doc = z.read("word/document.xml").decode()
        rels = dict(REL.findall(z.read("word/_rels/document.xml.rels").decode()))
    for raw in PARA.findall(doc):
        style = STYLE.search(raw)
        text = html.unescape("".join(TEXT.findall(raw))).strip()
        link = LINK.search(raw)
        yield (style.group(1) if style else "", text, html.unescape(rels[link.group(1)]) if link else None)


def split_meta(title):
    """'영국 AISI, 보고서 (2026-08-04)' -> ('영국 AISI, 보고서', '2026-08-04')."""
    if not title.endswith(")"):
        return title, None
    depth = 0
    for i in range(len(title) - 1, -1, -1):
        depth += {")": 1, "(": -1}.get(title[i], 0)
        if depth == 0:
            return title[:i].rstrip(), title[i + 1 : -1]
    return title, None


def convert(path):
    paras = list(paragraphs(path))
    start = next(i for i, (s, t, _) in enumerate(paras) if s == "1" and t == "전체 논지")
    summary, toc, blocks, refs = [], [], [], None
    n = 0
    i = start + 1
    while i < len(paras):
        style, text, url = paras[i]
        i += 1
        if not text:
            continue
        if style == "1":
            refs = None
            m = CHAPTER.match(text)
            blocks.append({"type": "h2", "id": f"ch{m.group(1)}" if m else None, "text": text})
        elif style == "2":
            refs = None
            m = CLAIM.match(text)
            blocks.append({"type": "h3", "id": f"s{m.group(1)}-{m.group(2)}" if m else None, "text": text})
        elif text == "근거 자료":
            refs = {"type": "refs", "items": []}
            blocks.append(refs)
        elif text.startswith("▸"):
            n += 1
            title, meta = split_meta(text.lstrip("▸ ").strip())
            note = paras[i][1]
            _, target, link = paras[i + 1]
            i += 2
            unpublished = not link and "미공개" in target
            if unpublished and meta:
                meta = re.sub(r",?\s*미공개$", "", meta) or None
            refs["items"].append({
                "n": n,
                "title": title,
                "meta": meta,
                "note": note,
                "url": link,
                "host": urlparse(link).hostname.removeprefix("www.") if link else None,
                "status": None if link else ("미공개" if unpublished else target),
            })
        elif not blocks and OUTLINE.match(text) and style:
            toc.append({"id": f"ch{OUTLINE.match(text).group(1)}", "text": text})
        elif not blocks:
            summary.append(text)
        else:
            blocks.append({"type": "p", "text": text})
    return {"summary": summary, "toc": toc, "blocks": blocks}


if __name__ == "__main__":
    docx, slug = sys.argv[1:3]
    json.dump({slug: convert(docx)}, sys.stdout, ensure_ascii=False, indent=2)
