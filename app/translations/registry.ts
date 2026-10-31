import anthropicRsp34 from "../data/translations/anthropic-rsp-v3-4.json";
import anthropicS1 from "../data/translations/anthropic-s1-2026-risk-factors.json";
import caSb53 from "../data/translations/ca-sb53.json";
import claudeConstitution from "../data/translations/claude-constitution-2026-01.json";
import gdmFsf31 from "../data/translations/gdm-fsf-v3-1.json";
import metaSsf21 from "../data/translations/meta-ssf-v2-1.json";
import nyRaise2026 from "../data/translations/ny-raise-act-2026.json";
import openaiModelSpec from "../data/translations/openai-model-spec-2026-10.json";
import openaiPreparedness2 from "../data/translations/openai-preparedness-v2.json";
import shailabFrmf2 from "../data/translations/shailab-frmf-v2.json";
import xaiFaif202512 from "../data/translations/xai-faif-2025-12.json";
import zaiOpenWeight from "../data/translations/zai-open-weight-2026-09.json";

// 번역 문서 한 편 = scripts/import_translation.py가 만든 JSON 한 개. 새 문서는 여기 import만 더한다.
// marks: 번역문 강조(scripts/emphasize_translation.py). t는 ko의 연속 부분 문자열, 블록 안 순서대로·겹치지 않음.
export type Mark = { t: string; k: "key" | "safety" };
// refs: 문서 안 상호 참조(scripts/link_crossrefs.py). t는 ko의 인용된 제목, to는 가리키는 제목 블록의 id.
export type CrossRef = { t: string; to: string };
// table: 행은 " ⏎ ", 칸은 "|"로 나눈 Markdown 표 한 줄(scripts/import_translation.py). 첫 행이 머리글.
// example: 대화 예시(Model Spec). 줄을 " ⏎ "로 이은 '<user> ⏎ 내용 ⏎ </user> ⏎ <comparison> ⏎ <assistant> <!-- GOOD: … --> …' 꼴.
// untranslated: 번역 모델이 거절해 원문을 그대로 둔 블록(생물·화학 무기 관련 서술 등). ko == en.
export type TranslationBlock = { type: "h2" | "h3" | "p" | "li" | "table" | "example"; en: string; ko: string; id?: string; marks?: Mark[]; refs?: CrossRef[]; untranslated?: boolean };
export type TranslationDoc = {
  slug: string;
  title: string;
  original_title: string;
  publisher: string;
  doc_kind: string;
  published: string;
  source_url: string;
  source_note: string;
  // 원문 링크 문구(기본 "원문 보기")와 목차에 셀 항목 이름(예: "위험" → "위험 87개"). 없으면 개수를 쓰지 않는다.
  source_label?: string;
  item_label?: string;
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
  // 원문 쪽 하단 각주. 본문에는 '[^n]'으로 표시돼 있다(scripts/import_translation.py extract_footnotes).
  notes?: { n: number; en: string; ko: string; linked: boolean; source?: string }[];
  blocks: TranslationBlock[];
};

export const translations = ([anthropicS1, anthropicRsp34, openaiPreparedness2, gdmFsf31, metaSsf21, xaiFaif202512, claudeConstitution, openaiModelSpec, shailabFrmf2, zaiOpenWeight, caSb53, nyRaise2026] as TranslationDoc[]).sort((a, b) => b.published.localeCompare(a.published));

export const dotDate = (iso: string) => iso.replaceAll("-", ".");
