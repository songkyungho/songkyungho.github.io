import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = {
  title: "이 사이트 | 송경호",
  description: "개인 연구 아카이브의 구성, 자료 관리 방식과 공개 방법",
};

const sections = [
  ["홈", "최근 기록과 진행 중인 프로젝트를 한눈에 둡니다."],
  ["소개", "연구 분야, 경력, 학력, 강의와 연도별 활동 히트맵입니다."],
  ["연구", "논문, 편저·역서, 보고서를 모읍니다."],
  ["발표", "학술발표, 발표, 특강, 토론·좌담을 날짜순으로 둡니다."],
  ["글", "이슈브리프, 칼럼, 에세이와 원문 상세 페이지입니다."],
  ["미디어", "방송, 인터뷰, 특강 영상, 팟캐스트와 언론 보도입니다."],
  ["아트", "음악과 이미지 작업을 모읍니다."],
] as const;

export default function SitePage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="ABOUT THIS SITE" title="이 사이트" />

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">WHAT</p><h2>무엇을 모으는가</h2></div>
        <div className="site-copy">
          <p>
            정치학자 송경호의 연구, 발표, 글, 미디어를 한곳에 두는 개인 아카이브입니다.
            한국어를 기본으로 하고, 공식 영문 제목과 초록이 있으면 함께 적습니다.
          </p>
          <p>
            사람 소개는 <a href="/about">여기</a>에서, 매일 쌓이는 AI 안전 소식은{" "}
            <a href="https://songkyungho.github.io/ai-safety-digest/" target="_blank" rel="noopener noreferrer">AI Safety Daily Digest</a>에서 봅니다.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">PAGES</p><h2>구성</h2></div>
        <div className="timeline">
          {sections.map(([name, note]) => (
            <div className="timeline-row" key={name}>
              <time>{name}</time>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">HOW</p><h2>어떻게 만드는가</h2></div>
        <div className="site-copy">
          <p>
            목록과 본문은 데이터 파일로 관리하고, 사진은 사이트와 같이 둡니다.
            화면은 그 자료를 읽어 페이지를 만듭니다.
          </p>
          <p>
            <code>main</code>에 올리면 GitHub Actions가 정적 파일로 빌드해{" "}
            <a href="https://songkyungho.github.io/">songkyungho.github.io</a>에 게시합니다.
            코드는{" "}
            <a href="https://github.com/songkyungho/songkyungho.github.io" target="_blank" rel="noopener noreferrer">GitHub</a>에 있습니다.
          </p>
          <p>
            사이트 구조가 바뀐 기록은 <a href="/updates">업데이트</a>에만 남깁니다. 글 한 편, 발표 한 건을 추가한 커밋은 적지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
