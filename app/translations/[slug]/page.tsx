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
function inlineSpans(text: string, marks: Mark[], refs: CrossRef[]): Span[] {
  const spans: Span[] = [];
  let cursor = 0;
  for (const mark of marks) {
    const at = text.indexOf(mark.t, cursor);
    if (at < 0) continue;
    spans.push({
      start: at, end: at + mark.t.length,
      node: (key) => mark.k === "key"
        ? <strong className="tr-key" key={key}>{mark.t}</strong>
        : <mark className="tr-safety" key={key}>{mark.t}</mark>,
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

function renderRange(text: string, from: number, to: number, spans: Span[]) {
  const nodes: React.ReactNode[] = [];
  let cursor = from;
  for (const span of spans) {
    if (span.start < cursor || span.end > to) continue;
    if (span.start > cursor) nodes.push(text.slice(cursor, span.start));
    nodes.push(span.node(span.start));
    cursor = span.end;
  }
  if (cursor < to) nodes.push(text.slice(cursor, to));
  return nodes;
}

// 번역문은 한 원문 문단을 여러 문단으로 나눴을 수 있다(빈 줄로 구분).
function Paragraphs({ text, lang, marks = [], refs = [] }: { text: string; lang: "ko" | "en"; marks?: Mark[]; refs?: CrossRef[] }) {
  const spans = marks.length || refs.length ? inlineSpans(text, marks, refs) : [];
  let offset = 0;
  return (
    <>
      {text.split("\n\n").map((part, index) => {
        const start = offset;
        offset += part.length + 2;
        return <p key={index} lang={lang}>{spans.length ? renderRange(text, start, start + part.length, spans) : part}</p>;
      })}
    </>
  );
}

function Row({ block }: { block: TranslationBlock }) {
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

function Toc({ doc }: { doc: TranslationDoc }) {
  const sections: { h2: TranslationBlock; items: TranslationBlock[] }[] = [];
  for (const block of doc.blocks) {
    if (block.type === "h2") sections.push({ h2: block, items: [] });
    else if (block.type === "h3") sections.at(-1)?.items.push(block);
  }
  return (
    <nav className="tr-toc" aria-label="목차">
      <p>목차 · 위험 {doc.stats.items}개</p>
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
          <h1>{doc.title}</h1>
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
            원문 보기 (SEC EDGAR)<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span>
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
          </div>
        </div>
      </article>
      <nav className="article-back" aria-label="글 목록"><a href="/writing">← 글 아카이브로 돌아가기</a></nav>
    </main>
  );
}
