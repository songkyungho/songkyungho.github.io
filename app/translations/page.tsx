import type { Metadata } from "next";
import { PageIntro } from "../components";
import { Disclaimer } from "./Disclaimer";
import { dotDate, translations } from "./registry";

export const metadata: Metadata = {
  title: "번역 | 송경호",
  description: "AI 안전에서 중요한 문서를 AI 안전 번역 용어집에 맞춰 LLM으로 옮긴 비공식 한국어 번역",
};

export default function TranslationsPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="TRANSLATIONS" title="번역" />

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">WHAT</p><h2>무엇을 옮기는가</h2></div>
        <div className="site-copy">
          <p>
            AI 안전·거버넌스에서 중요한 문서를 한국어로 옮겨 둡니다. 같은 개념이 문서마다 다른 말로 번역되지 않도록{" "}
            <a href="https://songkyungho.github.io/ai-safety-glossary/" target="_blank" rel="noopener noreferrer">AI 안전 용어집</a>
            의 번역어를 고정해 LLM으로 번역합니다. 문서마다 원문을 나란히 놓고 대조할 수 있습니다.
          </p>
          <Disclaimer />
        </div>
      </section>

      <section className="tr-index" aria-label="번역 문서 목록">
        {translations.map((doc) => (
          <a className="index-row" href={`/translations/${doc.slug}`} key={doc.slug}>
            <time dateTime={doc.published}>{dotDate(doc.published)}</time>
            <div>
              <p className="eyebrow">{doc.publisher} · {doc.doc_kind}</p>
              <h2>{doc.title}</h2>
              <p className="tr-original-title">{doc.original_title}</p>
              <p>{doc.summary}</p>
            </div>
            <span aria-hidden="true">→</span>
          </a>
        ))}
      </section>
    </main>
  );
}
