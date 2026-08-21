import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = { title: "발표와 강연 | 송경호", description: "국제·국내 학술발표, 정책 토론과 대중 강연 기록" };

const talks = [
  { date: "2026.08.19", type: "국내 발표", title: "정치 분야 AI Systemic Risk 소개", host: "한국정치학회 하계학술대회 · 부경대학교" },
  { date: "2026.08.18", type: "국내 발표", title: "정치적 공정성을 한국어로 측정하기: KPE 벤치마크 설계와 방법", host: "한국정치학회 하계학술대회 · 부경대학교" },
  { date: "2026.07.13", type: "국제 발표", title: "AI Verification Research: Why Verification Is Harder Than It Seems", host: "Securing AI · Ministry of Foreign Affairs of the Netherlands · The Hague" },
  { date: "2026.07.10", type: "국제 발표", title: "ROK-FORTRESS", host: "TAIGR @ ICML 2026 · Seoul" },
  { date: "2026.06.25", type: "특강", title: "AI 젠더 편향 평가 방법론: 최신 경향과 함의", host: "양성평등전문위원회" },
  { date: "2026.05.20", type: "특강", title: "AI 안전의 글로벌 거버넌스: 규범, 행위자, 그리고 구조", host: "연세대학교 미래캠퍼스" },
  { date: "2026.05.12", type: "특강", title: "AI and Modern Warfare: Bridging International Relations Theory and Practice", host: "세종대학교" },
  { date: "2025.11.29", type: "국제 발표", title: "Whose Territory Is Dokdo?: Multilingual LLM Responses to a Politically Sensitive Question", host: "AP Conference 2025 · Beppu" },
  { date: "2025.07.12", type: "국제 발표", title: "How Do Chinese LLMs Respond to Political Questions?", host: "IPSA World Congress 2025" },
];

export default function TalksPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="TALKS & PRESENTATIONS" title="발표와 강연" description="학술대회 발표, 정책 세미나, 국제회의와 대중 강연을 기록합니다. 발표 당시 사용된 공식 제목을 유지합니다." />
      <section className="talks-list">{talks.map((talk) => <article className="talk-row" key={`${talk.date}-${talk.title}`}><time>{talk.date}</time><span className="type-chip">{talk.type}</span><div><h2>{talk.title}</h2><p>{talk.host}</p></div></article>)}</section>
      <section className="source-note"><p>과거 발표와 토론 기록은 단계적으로 옮기고 있습니다.</p><a href="https://songkyungho.notion.site/Research-Paper-and-Presentation-2d5e12fefd93809497f4f408ba6f0a27">전체 기록 보기 ↗</a></section>
    </main>
  );
}
