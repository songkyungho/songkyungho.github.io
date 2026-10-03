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
  // 블로그 글은 날짜를 월까지만 보여 준다 (모바일 목록에서 제목과 겹치지 않게)
  date: formatDate(item.year ?? "0", item.month, item.section === "블로그" ? null : item.day),
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

type LatestCard = { key: number; date: string; outlet: string; title: string; href: string; thumb: string | null; placeholder: string };

// 최근 글(보도 제외)과 미디어를 합쳐 가장 최근 3개
const latest: LatestCard[] = [
  ...writing
    .filter((item) => item.kind === "post" && item.year)
    .map((item) => ({
      key: dateKey(item.year as string, item.month, item.day),
      date: formatDate(item.year as string, item.month, item.section === "블로그" ? null : item.day),
      outlet: item.section === "블로그" ? "블로그" : `${item.publication} · ${item.section}`,
      title: item.title,
      href: item.migrationStatus === "상세 페이지 완료" ? `/writing/archive/${item.slug}` : (item.sourceUrl ?? "/writing"),
      thumb: item.image,
      placeholder: item.section,
    })),
  ...media
    .filter((item) => item.year)
    .map((item) => {
      const id = youtubeId(item.url);
      return {
        key: dateKey(item.year as string, item.month, item.day),
        date: formatDate(item.year as string, item.month, item.day),
        outlet: item.outlet,
        title: item.title,
        href: item.url,
        thumb: item.image ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null),
        placeholder: item.format,
      };
    }),
]
  .sort((a, b) => b.key - a.key)
  .slice(0, 3);

// 피쳐드 세 번째 칸: 카드에 이미 없는 가장 최근 연구·보고서
const cardUrls = new Set(projects.cards.map((card) => card.url));
const latestResearch = [...research]
  .filter((item) => ["논문", "컨퍼런스 페이퍼", "보고서"].includes(item.kind) && item.image && item.url && !cardUrls.has(item.url))
  .sort((a, b) => dateKey(b.year, b.month, b.day) - dateKey(a.year, a.month, a.day))[0];

const featuredCards = [
  ...projects.cards,
  ...(latestResearch
    ? [{
        title: latestResearch.title,
        outlet: `최신 ${latestResearch.kind} · ${formatDate(latestResearch.year, latestResearch.month, null)}`,
        description: latestResearch.org ?? "",
        image: latestResearch.image as string,
        url: latestResearch.url as string,
      }]
    : []),
];

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
          <ul className="project-links">
            {projects.links.map((item) => (
              <li key={item.url}>
                {/* 각 사이트 메인 헤더와 같은 그라데이션 */}
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(165deg, ${item.colors[0]} 0%, ${item.colors[1]} 100%)` }}>
                  <strong>{item.title}<span aria-hidden="true"> ↗</span></strong>
                  <span>{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="home-block">
          <p className="eyebrow">FEATURED</p>
          <div className="video-grid">
            {featuredCards.map((item) => (
              <a className="video-card featured-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
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
            {latest.map((item) => (
              <a
                className="video-card"
                href={item.href}
                key={item.title}
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.thumb ? <img src={item.thumb} alt="" /> : <div className="placeholder-thumb">{item.placeholder}</div>}
                <div className="video-meta">
                  <time>{item.date}</time>
                  <span>{item.outlet}</span>
                </div>
                <h3>{item.title}</h3>
              </a>
            ))}
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
