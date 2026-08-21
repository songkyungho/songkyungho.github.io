import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = { title: "소개 | 송경호", description: "정치학자이자 AI 안전 연구자 송경호의 연구 분야, 경력과 학력" };

const areas = ["인공지능과 거버넌스", "디지털 개념사", "동아시아 사상과 역사", "한국학과 남북한", "인권·민주주의·규범정치이론", "기후변화 적응과 리빙랩"];

const positions = [
  ["2026–현재", "우정사업본부 윤리경영위원회 위원", ""],
  ["2026–현재", "여성가족부 양성평등위원회 외부위원", ""],
  ["2025–현재", "국회입법조사처 자문위원", ""],
  ["2025–현재", "UNDP AI 언어 격차 해소 전문가 그룹", "Closing the Language Gap in AI for Sustainable Development"],
  ["2025–현재", "한국전자통신연구원(ETRI) 인공지능안전연구소 선임연구원", "AI 안전 정책 및 전략적 국제협력"],
  ["2023–2025", "연세대학교 기후적응 리빙랩 R&D 선임연구원", ""],
  ["2021–2025", "연세대학교 정치학과 BK21 박사후연구원", ""],
  ["2021–2025", "연세대학교 사회과학대학 강사", ""],
  ["2020–현재", "참여연대 참여사회연구소 운영위원", ""],
  ["2020–현재", "연세대학교 통일연구원 전문연구원", ""],
  ["2020–2021", "숭실대학교 사회과학대학 강사", ""],
  ["2020–2021", "단국대학교 교양학부 강사", ""],
  ["2020–2021", "연세대학교 글로벌융합대학 강사", ""],
  ["2014–2019", "연세대학교 사회과학대학 강사", ""],
  ["2014–2019", "외교부 외교사료관 강사", ""],
];

const education = [
  ["Ph.D.", "정치학 박사", "연세대학교 정치학과 · 2007–2020"],
  ["교류", "박사과정 교류 프로그램", "Tohoku University (Cross National Doctoral Course Program) · 2013–2014"],
  ["M.A.", "정치학 석사", "연세대학교 정치학과 · 2005–2007"],
  ["B.A.", "정치외교학·경제학 학사", "연세대학교 · 2001–2005"],
  ["고등학교", "일본어과", "부산외국어고등학교 · 1998–2001"],
];

const labs = [
  ["Core", ["인공지능과 정치학 애드혹랩", "개념사 애드혹랩", "멀티미디어 애드혹랩"]],
  ["Member", ["정치학 진로교육 랩", "남북 문화교류·통일 랩", "지역정치 애드혹랩"]],
  ["Supervisor", ["정치학 데이터 자원 애드혹랩", "북한·일반화 애드혹랩", "Polython 애드혹랩"]],
] as const;

const lectures = [
  ["연세대학교 사회과학대학·통일학협동과정·정치외교학과·UIC", "민주주의 이론, 인권과 세계시민주의, 근대 국제사상의 기초, 국제인권체제와 북한인권, 현대정치사상, 국제정의론"],
  ["숭실대학교 사회과학대학 정치외교학과", "동아시아 국제관계, 동아시아 정치사상"],
  ["단국대학교 교양학부", "고전 읽기: 사회, 자유론"],
  ["연세대학교 글로벌융합대학 국제관계학전공", "국제정치경제, 국제기구론, 외교정책분석, 한국의 국제관계"],
  ["외교부 외교사료관", "청소년 외교관학교(고등부)"],
];

const others = [
  ["2019", "세계은행그룹(한국사무소) 프리랜스 컨설턴트"],
  ["2018–2019", "아산정책연구원 프리랜스 번역가"],
  ["2017–2021", "연세대학교 Gateway to Korea Program 매니저"],
  ["2013–2018", "웹앱 개발 스타트업 공동창업자·공동대표"],
  ["2012–2013", "독립영화·뮤직비디오 감독 및 프로듀서"],
  ["2011–2013", "독립 웹진·팟캐스트 편집장"],
  ["2009–2011", "대한민국 공군 무장군수 장교"],
  ["2001–2008", "학교 밴드 및 인디밴드 활동"],
];

const languages = ["한국어", "일본어", "영어", "Python · PHP · CSS"];

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
        <div className="timeline">{positions.map(([year, title, note], index) => <div className="timeline-row" key={`${year}-${title}-${index}`}><time>{year}</time><div><strong>{title}</strong>{note && <p>{note}</p>}</div></div>)}</div>
      </section>

      <section className="about-section education-section">
        <div className="about-section-title"><p className="eyebrow">EDUCATION</p><h2>학력</h2></div>
        <div className="timeline">{education.map(([tag, title, note]) => <div className="timeline-row" key={`${tag}-${title}`}><time>{tag}</time><div><strong>{title}</strong><p>{note}</p></div></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LECTURE</p><h2>강의</h2></div>
        <div className="timeline">{lectures.map(([institution, courses]) => <div className="timeline-row" key={institution}><strong>{institution}</strong><p>{courses}</p></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LAB</p><h2>랩 소속</h2></div>
        <div className="timeline">{labs.map(([role, names]) => <div className="timeline-row" key={role}><time>{role}</time><p>{names.join(" · ")}</p></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">OTHERS</p><h2>그 외 이력</h2></div>
        <div className="timeline">{others.map(([year, title]) => <div className="timeline-row" key={`${year}-${title}`}><time>{year}</time><strong>{title}</strong></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LANGUAGE</p><h2>언어·도구</h2></div>
        <p>{languages.join(" · ")}</p>
      </section>

      <section className="source-note"><p>전체 이력과 세부 활동은 기존 공개 프로필에서 확인할 수 있습니다.</p><a href="https://songkyungho.notion.site/Kyungho-David-Song-Ph-D-24aacd1ef23c49dca5c64e347637afb4">기존 프로필 보기 ↗</a></section>
    </main>
  );
}
