const recent = [
  { date: "2026.08.19", type: "발표", title: "정치 분야 AI Systemic Risk 소개", detail: "한국정치학회 하계학술대회", href: "/talks" },
  { date: "2026.08.18", type: "발표", title: "정치적 공정성을 한국어로 측정하기: KPE 벤치마크 설계와 방법", detail: "한국정치학회 하계학술대회", href: "/talks" },
  { date: "2026.07.16", type: "보고서", title: "EU 인공지능법 범용인공지능(GPAI) 실천강령(CoP) 한글 안내서", detail: "인공지능안전연구소", href: "https://www.aisi.re.kr/kor/article/ATCL75b4fb0a5/114" },
  { date: "2026.07.13", type: "발표", title: "AI Verification Research: Why Verification Is Harder Than It Seems", detail: "Securing AI · The Hague", href: "/talks" },
  { date: "2026.01", type: "보고서", title: "AI사고 정의 및 보고체계 국제동향", detail: "AI 안전 동향 분석 시리즈 26-01", href: "https://www.aisi.re.kr/kor/article/ATCL75b4fb0a5/102" },
  { date: "2025", type: "논문", title: "AI 이후의 민주주의: 기술적 가능성과 참여의 역설", detail: "『입법과 정책』 17(2), 39–72", href: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003236884" },
  { date: "2025", type: "논문", title: "계산하는 기계는 돌보는 기계가 될 수 있을까?", detail: "『日本思想』 51, 1–28", href: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003276447" },
  { date: "2025", type: "글", title: "Building Safer AI for All Languages", detail: "UNDP Digital", href: "https://www.undp.org/digital/blog/building-safer-ai-all-languages-collective-pathway-inclusive-human-development" },
];

export default function Home() {
  return (
    <main className="archive-home">
      <aside className="profile-rail">
        <p className="profile-name">송경호 <span>Kyungho David Song, Ph.D.</span></p>
        <p className="profile-role">인공지능안전연구소 선임연구원</p>
        <p className="profile-summary">정치학자, 개념사학자, AI 안전 연구자</p>
        <dl>
          <div><dt>연구</dt><dd>AI 안전 · 민주주의 · 규범정치이론</dd></div>
          <div><dt>방법</dt><dd>정치사상 · 개념사 · 디지털 인문학</dd></div>
        </dl>
        <div className="profile-links">
          <a href="/about">상세 소개</a>
          <a href="https://scholar.google.com/citations?user=AE9lR2wAAAAJ&hl=ko" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>
        </div>
      </aside>

      <section className="recent-index">
        <header className="index-heading">
          <div><p className="eyebrow">RESEARCH NOTES &amp; ARCHIVE</p><h1>최근 기록</h1></div>
          <p>논문, 정책보고서, 발표와 대중적 글쓰기를 최근 순서로 모았습니다.</p>
        </header>
        <div className="index-list">
          {recent.map((item) => (
            <a
              className="index-row"
              href={item.href}
              key={`${item.date}-${item.title}`}
              {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <time>{item.date}</time>
              <span className="index-type">{item.type}</span>
              <div><h2>{item.title}</h2><p>{item.detail}</p></div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <nav className="archive-shortcuts" aria-label="전체 자료 바로가기">
          <a href="/research">연구 전체 보기</a>
          <a href="/talks">발표 전체 보기</a>
          <a href="/writing">글 전체 보기</a>
        </nav>
      </section>
    </main>
  );
}
