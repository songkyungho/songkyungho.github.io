import amazonFmsf from "../data/translations/amazon-fmsf-2026-09.json";
import anthropicRsp34 from "../data/translations/anthropic-rsp-v3-4.json";
import anthropicS1 from "../data/translations/anthropic-s1-2026-risk-factors.json";
import caSb53 from "../data/translations/ca-sb53.json";
import chinaFramework3 from "../data/translations/china-ai-safety-governance-3-0.json";
import cohereSecureAi from "../data/translations/cohere-secure-ai-2025-02.json";
import claudeConstitution from "../data/translations/claude-constitution-2026-01.json";
import g42Fsf from "../data/translations/g42-fsf-2025-02.json";
import gdmFsf31 from "../data/translations/gdm-fsf-v3-1.json";
import ilSb315 from "../data/translations/il-sb315.json";
import nvidiaFra from "../data/translations/nvidia-frontier-risk-assessment.json";
import metaSsf21 from "../data/translations/meta-ssf-v2-1.json";
import microsoftFgf from "../data/translations/microsoft-fgf-2026-02.json";
import nyRaise2026 from "../data/translations/ny-raise-act-2026.json";
import reflectionOsf from "../data/translations/reflection-osf-2026-10.json";
import beamSafetyReport from "../data/translations/beam-safety-report-2026-10.json";
import openaiFgf from "../data/translations/openai-frontier-governance-2026-05.json";
import openaiModelSpec from "../data/translations/openai-model-spec-2026-10.json";
import openaiPreparedness2 from "../data/translations/openai-preparedness-v2.json";
import shailabFrmf2 from "../data/translations/shailab-frmf-v2.json";
import xaiFaif202512 from "../data/translations/xai-faif-2025-12.json";
import zaiOpenWeight from "../data/translations/zai-open-weight-2026-09.json";
// AI 실존 위험 경고 문건 (라이브러리 xrisk-warnings 컬렉션)
import xrButler1863 from "../data/translations/butler-1863.json";
import xrButler1865 from "../data/translations/butler-1865.json";
import pacingFrontier from "../data/translations/pacing-the-frontier-2026.json";
import amodeiPaceFrontier from "../data/translations/amodei-pace-the-frontier-2026-09.json";
import anthropicAdvancedAi from "../data/translations/anthropic-advanced-ai-framework-2026-06.json";
import anthropicEconomicPolicy from "../data/translations/anthropic-economic-policy-framework-2026-06.json";
import openaiFederalBlueprint from "../data/translations/openai-federal-blueprint-2026-06.json";
import openaiBuildingStandards from "../data/translations/openai-building-standards-2026-09.json";
import openaiNewsomLetter from "../data/translations/openai-newsom-letter-2026-10.json";
import googlePragmaticAi from "../data/translations/google-pragmatic-ai-governance-2026-06.json";
import cohereWhoDefines from "../data/translations/cohere-who-defines-rules-2026-09.json";
import aiiaCommitments2025 from "../data/translations/aiia-china-safety-commitments-2025.json";
import hiroshimaPrinciples2023 from "../data/translations/hiroshima-principles-2023.json";
import hiroshimaCode2023 from "../data/translations/hiroshima-code-2023.json";
import hiroshimaAllActors2023 from "../data/translations/hiroshima-all-actors-2023.json";
import reaimCall2023 from "../data/translations/reaim-call-2023.json";
import reaimPathways2026 from "../data/translations/reaim-pathways-2026.json";
import globalDigitalCompact2024 from "../data/translations/global-digital-compact-2024.json";
import parisStatement2025 from "../data/translations/paris-statement-2025.json";
import newDelhiDeclaration2026 from "../data/translations/new-delhi-declaration-2026.json";
import xrTuringHeretical1951 from "../data/translations/turing-heretical-1951.json";
import xrTuringBbc1951 from "../data/translations/turing-bbc-1951.json";
import xrButlerErewhon1872 from "../data/translations/butler-erewhon-1872.json";
import xrFliResearchPriorities2015 from "../data/translations/fli-research-priorities-2015.json";
import xrAsilomar2017 from "../data/translations/asilomar-2017.json";
import xrFliPause2023 from "../data/translations/fli-pause-2023.json";
import xrCaisStatement2023 from "../data/translations/cais-statement-2023.json";
import xrIdaisOxford2023 from "../data/translations/idais-oxford-2023.json";
import xrBletchley2023 from "../data/translations/bletchley-2023.json";
import xrEldersLongview2024 from "../data/translations/elders-longview-2024.json";
import xrIdaisBeijing2024 from "../data/translations/idais-beijing-2024.json";
import xrRightToWarn2024 from "../data/translations/right-to-warn-2024.json";
import xrIdaisVenice2024 from "../data/translations/idais-venice-2024.json";
import xrIdaisShanghai2025 from "../data/translations/idais-shanghai-2025.json";
import xrRedLines2025 from "../data/translations/red-lines-2025.json";
import xrSuperintelligenceStatement2025 from "../data/translations/superintelligence-statement-2025.json";
import xrProHuman2026 from "../data/translations/pro-human-2026.json";
import xrIdaisLondon2026 from "../data/translations/idais-london-2026.json";
import xrAiCyberLetter2026 from "../data/translations/ai-cyber-letter-2026.json";

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

export const translations = ([anthropicS1, anthropicRsp34, openaiPreparedness2, openaiFgf, gdmFsf31, metaSsf21, xaiFaif202512, claudeConstitution, openaiModelSpec, shailabFrmf2, zaiOpenWeight, reflectionOsf, beamSafetyReport, microsoftFgf, amazonFmsf, chinaFramework3, nvidiaFra, cohereSecureAi, g42Fsf, xrButler1863, xrButler1865, xrButlerErewhon1872, xrTuringBbc1951, xrTuringHeretical1951, xrFliResearchPriorities2015, xrAsilomar2017, xrFliPause2023, xrCaisStatement2023, xrIdaisOxford2023, xrBletchley2023, xrEldersLongview2024, xrIdaisBeijing2024, xrRightToWarn2024, xrIdaisVenice2024, xrIdaisShanghai2025, xrRedLines2025, xrSuperintelligenceStatement2025, xrProHuman2026, xrIdaisLondon2026, xrAiCyberLetter2026, pacingFrontier, amodeiPaceFrontier, anthropicAdvancedAi, anthropicEconomicPolicy, openaiFederalBlueprint, openaiBuildingStandards, openaiNewsomLetter, googlePragmaticAi, cohereWhoDefines, aiiaCommitments2025, hiroshimaPrinciples2023, hiroshimaCode2023, hiroshimaAllActors2023, reaimCall2023, reaimPathways2026, globalDigitalCompact2024, parisStatement2025, newDelhiDeclaration2026, caSb53, nyRaise2026, ilSb315] as TranslationDoc[]).sort((a, b) => b.published.localeCompare(a.published));

export const dotDate = (iso: string) => iso.replaceAll("-", ".");

// 목록(글·홈)에 쓰는 제목: 원문 발간일을 괄호로 붙인다. 제목 끝 괄호가 판 날짜('(2026.1)', '(2025.12.30판)')면
// 발간일로 바꾸고, 다른 말('(2026년 개정법)')이면 그 괄호 안에 쉼표로 잇는다.
export const listTitle = (doc: TranslationDoc) => {
  const date = dotDate(doc.published);
  const m = doc.title.match(/^(.*?)\s*\(([^()]*)\)$/);
  if (!m) return `${doc.title} (${date})`;
  return /^\d{4}\.\d{1,2}(\.\d{1,2})?판?$/.test(m[2]) ? `${m[1]} (${date})` : `${m[1]} (${m[2]}, ${date})`;
};
