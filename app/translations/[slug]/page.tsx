import type { Metadata } from "next";
import { Disclaimer } from "../Disclaimer";
import { dotDate, translations, type TranslationBlock, type TranslationDoc } from "../registry";
import { ViewSwitch } from "../ViewSwitch";

type Params = { slug: string };

export function generateStaticParams() {
  return translations.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = translations.find((item) => item.slug === slug);
  if (!doc) return { title: "번역을 찾을 수 없습니다 | 송경호" };
  const description = `${doc.summary} (LLM 자동번역, 비공식 참고용)`;
  return {
    title: `${doc.title} (자동번역) | 송경호`,
    description,
    openGraph: { title: `${doc.title} (자동번역)`, description },
    twitter: { card: "summary", title: `${doc.title} (자동번역)`, description },
  };
}

// 번역문은 한 원문 문단을 여러 문단으로 나눴을 수 있다(빈 줄로 구분).
function Paragraphs({ text, lang }: { text: string; lang: "ko" | "en" }) {
  return <>{text.split("\n\n").map((part, index) => <p key={index} lang={lang}>{part}</p>)}</>;
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
      <div className="tr-ko"><Paragraphs lang="ko" text={block.ko} /></div>
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

        <Disclaimer doc={doc} />

        <div className="tr-source">
          <a href={doc.source_url} target="_blank" rel="noopener noreferrer">
            원문 보기 (SEC EDGAR)<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span>
          </a>
          <span>{doc.source_note}</span>
        </div>

        <div className="tr-layout">
          <aside className="tr-rail">
            <ViewSwitch />
            <Toc doc={doc} />
          </aside>
          <div className="tr-body" data-view="ko" id="tr-body">
            <div className="tr-columns" aria-hidden="true"><span>번역</span><span>원문 (English)</span></div>
            {doc.blocks.map((block, index) => <Row block={block} key={index} />)}
          </div>
        </div>
      </article>
      <nav className="article-back" aria-label="번역 목록"><a href="/translations">← 번역 목록으로 돌아가기</a></nav>
    </main>
  );
}
