import type { TranslationDoc } from "./registry";

export function Disclaimer({ doc }: { doc: TranslationDoc }) {
  return (
    <aside className="tr-disclaimer" aria-label="자동번역 안내">
      <p className="tr-disclaimer-head">LLM 자동번역 · 비공식 참고용</p>
      <ul>
        <li>
          {doc.model}로 자동 번역한 글입니다. 사람이 전체를 검수하지 않았으므로
          오역·누락이 있을 수 있습니다.
        </li>
        <li>효력과 해석의 기준은 영어 원문입니다. 인용하거나 판단의 근거로 삼을 때는 반드시 원문을 확인하세요.{doc.doc_kind.startsWith("증권신고서") &&" 투자 권유나 투자 판단 자료가 아닙니다."}</li>
        <li>
          원저작자나 발행 기관이 제공하거나 검토한 번역이 아니며, 번역자가 속한 기관(ETRI·AI안전연구소)의 공식 번역이나
          입장과도 무관한 개인 작업입니다. 원문의 저작권은 원저작자에게 있습니다.
        </li>
        {doc.blocks.some((block) => block.marks?.length) && (
          <li>번역문의 형광 밑줄(AI 안전 관련 서술)과 굵은 글씨(항목의 핵심 결론)는 번역자가 LLM으로 표시한 것으로, 원문에는 없습니다.</li>
        )}
        <li>
          용어는 <a href={doc.glossary_url} target="_blank" rel="noopener noreferrer">AI 안전 번역 용어집</a>
          의 번역어를 따르고, 처음 나올 때 영어를 함께 적습니다.
        </li>
      </ul>
    </aside>
  );
}
