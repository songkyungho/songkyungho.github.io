import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = { title: "소개 | 송경호", description: "정치학자이자 AI 안전 연구자 송경호의 연구 분야, 경력과 학력" };

const AFFILIATION_LINKS: [string, string][] = [
  ["인공지능안전연구소", "https://www.aisi.re.kr/kor"],
  ["BK21", "https://bk21pol.yonsei.ac.kr"],
];

function linkifyAffiliation(text: string) {
  for (const [needle, url] of AFFILIATION_LINKS) {
    const idx = text.indexOf(needle);
    if (idx === -1) continue;
    return (
      <>
        {text.slice(0, idx)}
        <a href={url} target="_blank" rel="noopener noreferrer">{needle}</a>
        {text.slice(idx + needle.length)}
      </>
    );
  }
  return text;
}

const areas = ["인공지능 안전 거버넌스", "디지털 개념사", "동아시아 사상사", "인권·민주주의·규범정치이론", "한국학 및 북한학", "기후변화 적응과 리빙랩"];

const positions = [
  ["2026–현재", "우정사업본부 윤리경영위원회 위원", ""],
  ["2026–현재", "여성가족부 양성평등위원회 외부위원", ""],
  ["2025–현재", "국회입법조사처 자문위원", ""],
  ["2025–현재", "UNDP AI 언어 격차 해소 전문가 그룹", "Closing the Language Gap in AI for Sustainable Development"],
  ["2025–현재", "한국전자통신연구원(ETRI) 인공지능안전연구소 선임연구원", "AI 안전 정책 및 국제협력실"],
  ["2023–2025", "연세대학교 기후적응 리빙랩 R&D 선임연구원", ""],
  ["2021–2025", "연세대학교 정치학과 BK21 박사후연구원", "혁신과학기술 시대의 정치적 문제 해결 교육연구단"],
  ["2021–2025", "연세대학교 사회과학대학 강사", ""],
  ["2020–현재", "참여연대 참여사회연구소 운영위원", ""],
  ["2020–현재", "연세대학교 통일연구원 전문연구원", ""],
  ["2020–2021", "연세대학교 글로벌융합대학, 단국대학교 교양학부, 숭실대학교 사회과학대학 강사", ""],
  ["2014–2019", "연세대학교 사회과학대학 강사", ""],
  ["2014–2019", "외교부 외교사료관 강사", ""],
];

const awards = [
  ["2024", "교육부장관상 (우수신진연구인력)", "/images/about/award-moe-2024.jpg"],
  ["2024", "연세대학교 총장상 (우수강사)", "/images/about/award-yonsei-2024.jpg"],
];

const education = [
  ["Ph.D.", "정치학 박사", "연세대학교 정치학과 · 2007–2020"],
  ["CNDC", "공동박사학위 프로그램", "Tohoku University (Cross National Doctoral Course Program) · 2013–2014"],
  ["M.A.", "정치학 석사", "연세대학교 정치학과 · 2005–2007"],
  ["B.A.", "정치외교학·경제학 학사", "연세대학교 · 2001–2005"],
  ["고등학교", "일본어과", "부산외국어고등학교 · 1998–2001"],
];

const labs = [
  ["Core", [
    ["인공지능과 정치학 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/artificial-intelligence-in-political-science-ad-hoc-lab"],
    ["개념사 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/-conceptual-history-ad-hoc-lab"],
    ["멀티미디어 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/multimedia-ad-hoc-lab"],
  ]],
  ["Member", [
    ["정치학 진로교육 랩", "https://www.bk21pol.yonsei.ac.kr/labs/political-science-education-for-future-career-lab"],
    ["남북 문화교류·통일 랩", "https://www.bk21pol.yonsei.ac.kr/labs/inter-korean-cultural-exchange-and-unification--lab"],
    ["지역정치 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/local-politics-ad-hoc-lab"],
  ]],
  ["Supervisor", [
    ["정치학 데이터 자원 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/data-resources-in-political-science-ad-hoc-lab"],
    ["북한·일반화 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/north-korea-and-generalization-ad-hoc-lab"],
    ["Polython 애드혹랩", "https://www.bk21pol.yonsei.ac.kr/labs/polython-ad-hoc-lab"],
  ]],
] as const;

const lectures = [
  ["연세대학교", "사회과학대학·통일학협동과정·정치외교학과·UIC — Theories of Democracy, Human Rights and Cosmopolitanism, Foundations of Modern International Thought, 국제인권체제와 북한인권, Contemporary Political Thought, Theories of International Justice"],
  ["숭실대학교", "사회과학대학 정치외교학과 — East Asian International Relations, East Asian Political Thought"],
  ["단국대학교", "교양학부 — Reading the Classics: Society, On Liberty"],
  ["연세대학교", "글로벌융합대학 국제관계학전공 — International Political Economy, International Organizations, Foreign Policy Analysis, Korea's International Relations"],
  ["외교부", "외교사료관 — Youth Diplomat Academy (High School Program)"],
];

const others = [
  ["2019", "세계은행그룹(한국사무소) 프리랜스 컨설턴트"],
  ["2018–2019", "아산정책연구원 프리랜스 번역가"],
  ["2017–2021", "연세대학교 Gateway to Korea Program 매니저"],
  ["2013–2018", "웹앱 개발 스타트업 공동창업자·공동대표"],
  ["2012–2013", "독립영화·뮤직비디오 감독 및 프로듀서"],
  ["2011–2013", "독립 웹진·팟캐스트 편집장"],
  ["2009–2011", "대한민국 공군 무기추천(Weaponeering) 장교 (대위 전역)"],
  ["2001–2008", "학교 밴드 및 인디밴드 활동"],
];

export default function AboutPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="ABOUT" title="소개" />
      <section className="about-lead">
        <div>
          <h2>송경호<br /><span lang="en">Kyungho David Song, Ph.D.</span></h2>
          <p className="role-tagline">인공지능안전연구소 선임연구원</p>
          <p className="about-tagline">정치학자, 개념사학자, AI 안전 연구자</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">FIELDS</p><h2>연구 분야</h2></div>
        <ol className="plain-numbered">{areas.map((area) => <li key={area}>{area}</li>)}</ol>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">POSITIONS</p><h2>주요 경력</h2></div>
        <div className="timeline">{positions.map(([year, title, note], index) => <div className="timeline-row" key={`${year}-${title}-${index}`}><time>{year}</time><div><strong>{linkifyAffiliation(title)}</strong>{note && <p>{note}</p>}</div></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">AWARDS</p><h2>수상</h2></div>
        <div className="timeline">{awards.map(([year, title, image]) => (
          <div className="timeline-row" key={`${year}-${title}`}>
            <time>{year}</time>
            <div className="award-row"><strong>{title}</strong><img alt={`${title} 인증서`} src={image} /></div>
          </div>
        ))}</div>
      </section>

      <section className="about-section education-section">
        <div className="about-section-title"><p className="eyebrow">EDUCATION</p><h2>학력</h2></div>
        <div className="timeline">{education.map(([tag, title, note]) => <div className="timeline-row" key={`${tag}-${title}`}><time>{tag}</time><div><strong>{title}</strong><p>{note}</p></div></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LECTURE</p><h2>강의</h2></div>
        <div className="timeline">{lectures.map(([institution, courses], index) => <div className="timeline-row" key={`${institution}-${index}`}><strong>{institution}</strong><p>{courses}</p></div>)}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LAB</p><h2>랩 소속</h2></div>
        <div className="timeline">{labs.map(([role, entries]) => (
          <div className="timeline-row" key={role}>
            <time>{role}</time>
            <p>{entries.map(([name, url], index) => (
              <span key={name}>
                {index > 0 && " · "}
                <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
              </span>
            ))}</p>
          </div>
        ))}</div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">OTHERS</p><h2>그 외 이력</h2></div>
        <div className="timeline">{others.map(([year, title]) => <div className="timeline-row" key={`${year}-${title}`}><time>{year}</time><strong>{title}</strong></div>)}</div>
      </section>
    </main>
  );
}
