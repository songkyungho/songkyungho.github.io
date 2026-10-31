import type { Metadata } from "next";
import type React from "react";
import { Disclaimer } from "../Disclaimer";
import { dotDate, translations, type CrossRef, type Mark, type TranslationBlock, type TranslationDoc } from "../registry";
import { ViewSwitch } from "../ViewSwitch";
import { SITE_URL } from "../../../site.config";

type Params = { slug: string };

export function generateStaticParams() {
  return translations.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = translations.find((item) => item.slug === slug);
  if (!doc) return { title: "번역을 찾을 수 없습니다 | 송경호" };
  const description = `${doc.summary} (LLM 자동번역, 비공식 참고용)`;
  const shareImage = doc.og_image ?? doc.image;
  const image = shareImage ? `${SITE_URL}${shareImage}` : undefined;
  return {
    title: `${doc.title} (자동번역) | 송경호`,
    description,
    openGraph: { title: `${doc.title} (자동번역)`, description, images: image ? [{ url: image, width: 1600, height: 893 }] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title: `${doc.title} (자동번역)`, description, images: image ? [image] : [] },
  };
}

type Span = { start: number; end: number; node: (key: number) => React.ReactNode };

// 강조와 상호 참조를 블록 전체 문자열에서 앞에서부터 차례로 찾아 위치를 정한다(둘은 겹치지 않고, 문단 경계를 넘지 않는다).
// 강조 구간 안에 각주 표시가 들어 있을 수 있어 강조 글자도 withNotes로 그린다.
function inlineSpans(text: string, marks: Mark[], refs: CrossRef[], lang: "ko" | "en"): Span[] {
  const spans: Span[] = [];
  let cursor = 0;
  for (const mark of marks) {
    const at = text.indexOf(mark.t, cursor);
    if (at < 0) continue;
    spans.push({
      start: at, end: at + mark.t.length,
      node: (key) => mark.k === "key"
        ? <strong className="tr-key" key={key}>{withNotes(mark.t, lang)}</strong>
        : <mark className="tr-safety" key={key}>{withNotes(mark.t, lang)}</mark>,
    });
    cursor = at + mark.t.length;
  }
  cursor = 0;
  for (const ref of refs) {
    const at = text.indexOf(ref.t, cursor);
    if (at < 0) continue;
    spans.push({ start: at, end: at + ref.t.length, node: (key) => <a className="tr-ref" href={`#${ref.to}`} key={key}>{ref.t}</a> });
    cursor = at + ref.t.length;
  }
  return spans.sort((a, b) => a.start - b.start);
}

// 본문의 각주 표시 '[^n]'을 위첨자 링크로. 번역·원문 칸 모두 그려지므로 되돌아올 자리 id에 언어를 붙인다.
// 같은 각주를 다시 가리키는 '[^n:2]'는 링크만 걸고 id는 달지 않는다(각주의 ↩는 첫 표시로 돌아간다).
function withNotes(text: string, lang: "ko" | "en"): React.ReactNode[] {
  return text.split(/(\[\^\d+(?::\d+)?\])/).map((part) => {
    const m = part.match(/^\[\^(\d+)(:\d+)?\]$/);
    if (!m) return part;
    return <sup className="tr-fn" key={`fn-${m[1]}${m[2] ?? ""}`}><a href={`#fn-${m[1]}`} id={m[2] ? undefined : `fnref-${m[1]}-${lang}`}>{m[1]}</a></sup>;
  });
}

function renderRange(text: string, from: number, to: number, spans: Span[], lang: "ko" | "en") {
  const nodes: React.ReactNode[] = [];
  let cursor = from;
  for (const span of spans) {
    if (span.start < cursor || span.end > to) continue;
    if (span.start > cursor) nodes.push(...withNotes(text.slice(cursor, span.start), lang));
    nodes.push(span.node(span.start));
    cursor = span.end;
  }
  if (cursor < to) nodes.push(...withNotes(text.slice(cursor, to), lang));
  return nodes;
}

// 번역문은 한 원문 문단을 여러 문단으로 나눴을 수 있다(빈 줄로 구분).
function Paragraphs({ text, lang, marks = [], refs = [] }: { text: string; lang: "ko" | "en"; marks?: Mark[]; refs?: CrossRef[] }) {
  const spans = marks.length || refs.length ? inlineSpans(text, marks, refs, lang) : [];
  const parts = text.split("\n\n");
  const starts = parts.map((_, i) => parts.slice(0, i).reduce((sum, p) => sum + p.length + 2, 0));
  return (
    <>
      {parts.map((part, index) => (
        <p key={index} lang={lang}>{renderRange(text, starts[index], starts[index] + part.length, spans, lang)}</p>
      ))}
    </>
  );
}

// 표 첫 칸의 머리말("Anthropic in the lead. …", "Novel chemical/biological weapons production. …",
// "Cybersecurity: …")은 원문에서 굵은 글씨다. 추출본에는 굵기가 없으니, 짧은 첫 문장이나 짧은 이름표(콜론까지)
// 뒤에 설명이 이어지면 그 부분을 굵게 보인다.
function leadSplit(text: string): [string, string] | null {
  const label = text.match(/^([^.:。]{2,60}?)\s?:\s+([\s\S]+)$/);
  if (label) return [`${label[1]}:`, label[2]];
  const m = text.match(/^(.{2,90}?[.。])\s+(?=\D)([\s\S]+)$/);
  return m ? [m[1], m[2]] : null;
}

// 칸 안의 글머리 목록은 PDF에서 "… 다음을 수행한다: ● 첫째 ● 둘째"처럼 한 줄로 이어져 들어온다(● 또는 •).
function Cell({ text, lang, lead }: { text: string; lang: "ko" | "en"; lead: boolean }) {
  const split = lead ? leadSplit(text) : null;
  const rest = split ? split[1] : text;
  const [intro, ...items] = rest.split(/\s*[●•]\s*/);
  const head = split && <strong className="tr-cell-lead">{withNotes(split[0], lang)} </strong>;
  if (!items.length) return <>{head}{withNotes(rest, lang)}</>;
  return (
    <>
      {(head || intro) && <p>{head}{withNotes(intro, lang)}</p>}
      <ul className="tr-cell-list">{items.map((item, i) => <li key={i}>{withNotes(item, lang)}</li>)}</ul>
    </>
  );
}

// 첫 칸이 빈 행은 위 행의 첫 칸을 세로로 이어 쓴다(원문의 병합 칸 — 예: 한 범주의 High·Critical 두 행).
function firstColumnSpans(body: string[][]): number[] {
  const spans = body.map(() => 1);
  body.forEach((row, r) => {
    if (row[0] || r === 0) return;
    let top = r - 1;
    while (top > 0 && !body[top][0]) top--;
    spans[top]++;
    spans[r] = 0;
  });
  return spans;
}

function Table({ text, lang }: { text: string; lang: "ko" | "en" }) {
  const rows = text.split(" ⏎ ").map((row) => row.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  const [head, ...body] = rows;
  const spans = firstColumnSpans(body);
  return (
    <div className="tr-table-wrap">
      <table className="tr-table" lang={lang}>
        <thead><tr>{head.map((cell, i) => <th key={i}>{withNotes(cell, lang)}</th>)}</tr></thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => c === 0 && !spans[r] ? null : (
                <td key={c} rowSpan={c === 0 && spans[r] > 1 ? spans[r] : undefined}><Cell lang={lang} lead={c === 0} text={cell} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ block }: { block: TranslationBlock }) {
  if (block.type === "table") {
    return (
      <div className="tr-row tr-tablerow">
        <div className="tr-ko"><Table lang="ko" text={block.ko} /></div>
        <div className="tr-en"><Table lang="en" text={block.en} /></div>
      </div>
    );
  }
  if (block.type === "h2" || block.type === "h3") {
    const Heading = block.type;
    return (
      <div className={`tr-row tr-${block.type}`} id={block.id}>
        <Heading className="tr-ko" lang="ko">{block.ko}</Heading>
        <p className="tr-en" lang="en">{block.en}</p>
      </div>
    );
  }
  return (
    <div className={`tr-row tr-${block.type}`}>
      <div className="tr-ko"><Paragraphs lang="ko" marks={block.marks} refs={block.refs} text={block.ko} /></div>
      <div className="tr-en"><Paragraphs lang="en" text={block.en} /></div>
    </div>
  );
}

// 원문 쪽 하단 각주는 문서 끝에 모은다. 번역·원문 대조 전환을 그대로 따르도록 같은 tr-row 꼴로 그린다.
function Notes({ notes }: { notes: NonNullable<TranslationDoc["notes"]> }) {
  return (
    <section aria-label="각주" className="tr-notes">
      <div className="tr-row tr-h2" id="notes">
        <h2 className="tr-ko" lang="ko">각주</h2>
        <p className="tr-en" lang="en">Notes</p>
      </div>
      {notes.map((note) => (
        <div className="tr-row tr-note" id={`fn-${note.n}`} key={note.n}>
          {(["ko", "en"] as const).map((lang) => (
            <div className={`tr-${lang}`} key={lang}>
              <p lang={lang}>
                <span className="tr-fn-n">{note.n}</span>
                {note[lang]}
                {note.linked && <> <a aria-label="본문으로 돌아가기" className="tr-fn-back" href={`#fnref-${note.n}-${lang}`}>↩</a></>}
              </p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

function Toc({ doc }: { doc: TranslationDoc }) {
  const sections: { h2: TranslationBlock; items: TranslationBlock[] }[] = [];
  for (const block of doc.blocks) {
    if (block.type === "h2") sections.push({ h2: block, items: [] });
    else if (block.type === "h3") sections.at(-1)?.items.push(block);
  }
  return (
    <nav className="tr-toc" aria-label="목차">
      <p>목차{doc.item_label ? ` · ${doc.item_label} ${doc.stats.items}개` : ""}</p>
      <ol>
        {sections.map(({ h2, items }) => (
          <li key={h2.id}>
            <details>
              <summary><a href={`#${h2.id}`}>{h2.ko}</a><span>{items.length}</span></summary>
              <ol>
                {items.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.ko}</a></li>)}
              </ol>
            </details>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default async function TranslationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = translations.find((item) => item.slug === slug);
  if (!doc) return <main className="article-page"><p>번역을 찾을 수 없습니다.</p></main>;

  return (
    <main className="tr-page">
      <article>
        <header className="article-header">
          <p className="eyebrow">TRANSLATION · 자동번역</p>
          <h1>{doc.title.split(/(\S*\d\S*)/).map((part, i) => i % 2 ? <span className="tr-nowrap" key={i}>{part}</span> : part)}</h1>
          <p className="tr-original-title" lang="en">{doc.original_title}</p>
          <dl className="article-meta">
            <div><dt>원문</dt><dd>{doc.publisher}</dd></div>
            <div><dt>종류</dt><dd>{doc.doc_kind}</dd></div>
            <div><dt>제출</dt><dd>{dotDate(doc.published)}</dd></div>
            <div><dt>번역</dt><dd>{dotDate(doc.translated)}</dd></div>
            <div><dt>분량</dt><dd>영어 {doc.stats.words_en.toLocaleString("ko-KR")}단어</dd></div>
          </dl>
        </header>

        {doc.image && (
          <figure className="article-hero tr-hero">
            <a href={doc.source_url} target="_blank" rel="noopener noreferrer"><img alt={`${doc.original_title} 원문 표지`} src={doc.image} /></a>
            {doc.image_caption && <figcaption>{doc.image_caption}</figcaption>}
          </figure>
        )}

        <Disclaimer doc={doc} />

        <div className="tr-source">
          <a href={doc.source_url} target="_blank" rel="noopener noreferrer">
            {doc.source_label ?? "원문 보기"}<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span>
          </a>
          <span>{doc.source_note}</span>
        </div>

        <div className="tr-layout">
          <aside className="tr-rail">
            <ViewSwitch hasMarks={doc.blocks.some((block) => block.marks?.length)} />
            <Toc doc={doc} />
          </aside>
          <div className="tr-body" data-marks="on" data-view="ko" id="tr-body">
            <div className="tr-columns" aria-hidden="true"><span>번역</span><span>원문 (English)</span></div>
            {doc.blocks.map((block, index) => <Row block={block} key={index} />)}
            {doc.notes?.length ? <Notes notes={doc.notes} /> : null}
          </div>
        </div>
      </article>
      <nav className="article-back" aria-label="글 목록"><a href="/writing">← 글 아카이브로 돌아가기</a></nav>
    </main>
  );
}
