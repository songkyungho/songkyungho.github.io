import anthropicS1 from "../data/translations/anthropic-s1-2026-risk-factors.json";

// 번역 문서 한 편 = scripts/import_translation.py가 만든 JSON 한 개. 새 문서는 여기 import만 더한다.
export type TranslationBlock = { type: "h2" | "h3" | "p" | "li"; en: string; ko: string; id?: string };
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
  stats: { blocks: number; sections: number; items: number; words_en: number };
  blocks: TranslationBlock[];
};

export const translations = ([anthropicS1] as TranslationDoc[]).sort((a, b) => b.published.localeCompare(a.published));

export const dotDate = (iso: string) => iso.replaceAll("-", ".");
