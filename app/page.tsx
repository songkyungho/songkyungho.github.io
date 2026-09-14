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

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  return match ? match[1] : null;
}

const latestMedia = [...media]
  .filter((item) => item.year)
  .sort((a, b) => dateKey(b.year as string, b.month, b.day) - dateKey(a.year as string, a.month, a.day))
  .slice(0, 3)
  .map((item) => {
    const id = youtubeId(item.url);
    return {
      ...item,
      thumb: item.image ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null),
    };
  });

export default function Home() {
  return (
    <main className="archive-home">
      <aside className="profile-rail">
        <p className="profile-name"><a href="/about">송경호 <span>Kyungho David Song, Ph.D.</span></a></p>
        <p className="profile-role">인공지능안전연구소 선임연구원</p>
        <p className="profile-summary">정치학자, AI 안전 연구자</p>
      </aside>

      <section className="recent-index">
        <div className="home-block">
          <p className="eyebrow">FEATURED</p>
          <div className="video-grid">
            {projects.map((item) => (
              <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
                <img src={item.image} alt="" />
                <span>{item.outlet}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="home-block">
          <div className="home-block-head">
            <p className="eyebrow">MEDIA</p>
            <a href="/media">전체 보기</a>
          </div>
          <div className="video-grid">
            {latestMedia.map((item) => {
              const date = formatDate(item.year, item.month, item.day);
              return (
                <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
                  {item.thumb ? <img src={item.thumb} alt="" /> : <div className="placeholder-thumb">{item.format}</div>}
                  <div className="video-meta">
                    {date && <time>{date}</time>}
                    <span>{item.outlet}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </a>
              );
            })}
          </div>
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
              <div>
                <span className="type-chip">{item.type}</span>
                <h2>{item.title}</h2>
                {item.detail && <p>{item.detail}</p>}
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
