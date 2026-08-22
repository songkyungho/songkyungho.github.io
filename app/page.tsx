import research from "./data/research-archive.json";
import talks from "./data/talks-archive.json";
import writing from "./data/writing-archive.json";
import media from "./data/media.json";
import projects from "./data/projects.json";

type RecentItem = {
  dateKey: number;
  date: string;
  type: string;
  title: string;
  detail: string;
  href: string;
};

function dateKey(year: string, month: number | string | null, day: number | string | null) {
  return Number(year) * 372 + Number(month ?? 0) * 31 + Number(day ?? 0);
}

function formatDate(year: string, month: number | string | null, day: number | string | null) {
  if (month && day) return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  if (month) return `${year}.${String(month).padStart(2, "0")}`;
  return year;
}

const researchItems: RecentItem[] = research.map((item) => ({
  dateKey: dateKey(item.year, item.month, item.day),
  date: formatDate(item.year, item.month, item.day),
  type: item.kind,
  title: item.title ?? "",
  detail: item.kind === "보고서" ? [item.authors?.join(", "), item.org].filter(Boolean).join(" · ") : (item.venue ?? ""),
  href: item.url ?? "/research",
}));

const talksItems: RecentItem[] = talks.map((item) => ({
  dateKey: dateKey(item.year, item.month, item.day),
  date: formatDate(item.year, item.month, item.day),
  type: item.kind,
  title: item.title ?? item.venue ?? "",
  detail: item.title ? (item.venue ?? "") : "",
  href: "/talks",
}));

const writingItems: RecentItem[] = writing.map((item) => ({
  dateKey: dateKey(item.year ?? "0", item.month, item.day),
  date: formatDate(item.year ?? "0", item.month, item.day),
  type: item.section,
  title: item.title,
  detail: item.publication,
  href: item.migrationStatus === "상세 페이지 완료" ? `/writing/archive/${item.slug}` : item.sourceUrl,
}));

const mediaItems: RecentItem[] = media
  .filter((item) => item.year)
  .map((item) => ({
    dateKey: dateKey(item.year as string, item.month, item.day),
    date: formatDate(item.year as string, item.month, item.day),
    type: item.format,
    title: item.title,
    detail: item.outlet,
    href: item.url,
  }));

const recent = [...researchItems, ...talksItems, ...writingItems, ...mediaItems]
  .sort((a, b) => b.dateKey - a.dateKey)
  .slice(0, 8);

export default function Home() {
  return (
    <main className="archive-home">
      <aside className="profile-rail">
        <p className="profile-name">송경호 <span>Kyungho David Song, Ph.D.</span></p>
        <p className="profile-role">인공지능안전연구소 선임연구원</p>
        <p className="profile-summary">정치학자, 개념사학자, AI 안전 연구자</p>
        <div className="profile-links">
          <a href="/about">상세 소개</a>
          <a href="https://scholar.google.com/citations?user=AE9lR2wAAAAJ&hl=ko" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>
        </div>
      </aside>

      <section className="recent-index">
        <div className="video-grid projects-grid">
          {projects.map((item) => (
            <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
              <img src={item.image} alt="" />
              <span>{item.outlet}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </a>
          ))}
        </div>

        <header className="index-heading">
          <div><p className="eyebrow">RESEARCH NOTES &amp; ARCHIVE</p><h1>최근 기록</h1></div>
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
      </section>
    </main>
  );
}
