export function SiteHeader() {
  return (
    <header className="masthead">
      <a className="wordmark" href="/" aria-label="홈으로 이동">
        <span className="wordmark-ko">송경호</span>
        <span className="wordmark-en">KYUNGHO DAVID SONG</span>
      </a>
      <nav aria-label="주요 메뉴">
        <a href="/about/">소개</a>
        <a href="/research/">연구</a>
        <a href="/talks/">발표</a>
        <a href="/writing/">글</a>
        <a href="/media/">미디어</a>
      </nav>
      <span className="language" aria-label="한국어 사이트">KO</span>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div>
        <strong>송경호 · Kyungho David Song, Ph.D.</strong>
        <p>개인 연구 아카이브 · 서울, 대한민국</p>
      </div>
      <div className="footer-links">
        <a href="https://scholar.google.com/citations?user=AE9lR2wAAAAJ&hl=ko">Google Scholar</a>
        <a href="https://github.com/songkyungho">GitHub</a>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <div><h1>{title}</h1><p>{description}</p></div>
    </section>
  );
}
