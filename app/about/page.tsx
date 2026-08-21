import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = { title: "소개 | 송경호", description: "정치학자이자 AI 안전 연구자 송경호의 연구 분야, 경력과 학력" };

const areas = ["인공지능과 거버넌스", "디지털 개념사", "동아시아 사상과 역사", "한국학과 남북한", "인권·민주주의·규범정치이론", "기후변화 적응과 리빙랩"];
const positions = [
  ["2025–현재", "인공지능안전연구소 선임연구원", "AI 안전 정책 및 전략적 국제협력"],
  ["2025–현재", "국회입법조사처 자문위원", ""],
  ["2025–현재", "UNDP AI 언어 격차 전문가 그룹", "Closing the Language Gap in AI for Sustainable Development"],
  ["2021–2025", "연세대학교 정치학과 BK21 박사후연구원", ""],
  ["2021–2025", "연세대학교 사회과학대학 강사", ""],
  ["2020–현재", "연세대학교 통일연구원 전문연구원", ""],
];

export default function AboutPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="ABOUT" title="소개" description="정치학의 질문과 AI 안전의 실천을 연결합니다. 기술이 사회의 의사결정과 권력, 권리의 구조를 어떻게 바꾸는지 연구합니다." />
      <section className="about-lead">
        <h2>송경호<br /><span lang="en">Kyungho David Song, Ph.D.</span></h2>
        <div className="prose">
          <p className="lead-quote">기술적으로 가능한 것과 정치적으로 바람직한 것은 같은 질문이 아닙니다.</p>
          <p>정치학 박사이자 AI 안전 연구자로서 인공지능의 안전성, 글로벌 거버넌스, 정치적 편향과 민주적 통제를 연구합니다. 정치사상과 디지털 인문학의 방법론을 AI 정책 연구에 연결하며, 연구 결과를 논문과 정책보고서뿐 아니라 강연과 대중적 글쓰기로 공유합니다.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">FIELDS</p><h2>연구 분야</h2></div>
        <ol className="plain-numbered">{areas.map((area) => <li key={area}>{area}</li>)}</ol>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">POSITIONS</p><h2>주요 경력</h2></div>
        <div className="timeline">{positions.map(([year, title, note]) => <div className="timeline-row" key={`${year}-${title}`}><time>{year}</time><div><strong>{title}</strong>{note && <p>{note}</p>}</div></div>)}</div>
      </section>

      <section className="about-section education-section">
        <div className="about-section-title"><p className="eyebrow">EDUCATION</p><h2>학력</h2></div>
        <div className="timeline">
          <div className="timeline-row"><time>Ph.D.</time><div><strong>정치학 박사</strong><p>연세대학교 정치학과 · 2007–2020</p></div></div>
          <div className="timeline-row"><time>M.A.</time><div><strong>정치학 석사</strong><p>연세대학교 정치학과 · 2005–2007</p></div></div>
          <div className="timeline-row"><time>B.A.</time><div><strong>정치외교학·경제학 학사</strong><p>연세대학교 · 2001–2005</p></div></div>
        </div>
      </section>

      <section className="source-note"><p>전체 이력과 세부 활동은 기존 공개 프로필에서 확인할 수 있습니다.</p><a href="https://songkyungho.notion.site/Kyungho-David-Song-Ph-D-24aacd1ef23c49dca5c64e347637afb4">기존 프로필 보기 ↗</a></section>
    </main>
  );
}
