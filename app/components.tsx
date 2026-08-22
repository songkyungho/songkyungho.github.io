export function SiteHeader() {
  return (
    <header className="masthead">
      <a className="wordmark" href="/" aria-label="홈으로 이동">
        <span className="wordmark-ko">송경호</span>
        <span className="wordmark-en">KYUNGHO DAVID SONG</span>
      </a>
      <nav aria-label="주요 메뉴">
        <a href="/about">소개</a>
        <a href="/research">연구</a>
        <a href="/talks">발표</a>
        <a href="/writing">글</a>
        <a href="/media">미디어</a>
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
      </div>
      <div className="footer-links">
        <a href="https://scholar.google.com/citations?user=AE9lR2wAAAAJ&hl=ko" target="_blank" rel="noopener noreferrer">Google Scholar</a>
        <a href="https://github.com/songkyungho" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/kyungho-song-35a79990/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://www.facebook.com/songkyungho82?locale=ko_KR" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/panda_soooong/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </section>
  );
}
