import anthropicS1 from "../data/translations/anthropic-s1-2026-risk-factors.json";

// 번역 문서 한 편 = scripts/import_translation.py가 만든 JSON 한 개. 새 문서는 여기 import만 더한다.
// marks: 번역문 강조(scripts/emphasize_translation.py). t는 ko의 연속 부분 문자열, 블록 안 순서대로·겹치지 않음.
export type Mark = { t: string; k: "key" | "safety" };
export type TranslationBlock = { type: "h2" | "h3" | "p" | "li"; en: string; ko: string; id?: string; marks?: Mark[] };
export type TranslationDoc = {
  slug: string;
  title: string;
  original_title: string;
  publisher: string;
  doc_kind: string;
  published: string;
  source_url: string;
  source_note: string;
  translated: string;
  model: string;
  glossary: string;
  glossary_url: string;
  summary: string;
  // 대표 이미지(블로그 글과 같은 1600×893). 문서 상단·공유 미리보기·홈 최근 카드에 쓴다.
  image?: string;
  image_caption?: string;
  // 공유 미리보기용 JPEG (페이스북은 WebP를 못 읽는 경우가 있다). 없으면 image를 쓴다.
  og_image?: string;
  stats: { blocks: number; sections: number; items: number; words_en: number };
  blocks: TranslationBlock[];
};

export const translations = ([anthropicS1] as TranslationDoc[]).sort((a, b) => b.published.localeCompare(a.published));

export const dotDate = (iso: string) => iso.replaceAll("-", ".");
