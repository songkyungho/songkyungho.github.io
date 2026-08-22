"use client";

import { useMemo, useState } from "react";

type MediaItem = {
  format: string;
  outlet: string;
  title: string;
  description: string;
  url: string;
  year: string | null;
  month: number | null;
  day: number | null;
  image?: string;
};

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  return match ? match[1] : null;
}

const filters = ["전체", "방송", "영상 인터뷰", "특강 영상", "팟캐스트"];

export default function MediaArchive({ media }: { media: MediaItem[] }) {
  const [filter, setFilter] = useState("전체");
  const counts: Record<string, number> = Object.fromEntries(
    filters.map((item) => [item, item === "전체" ? media.length : media.filter((m) => m.format === item).length])
  );
  const shown = useMemo(
    () => media.filter((item) => filter === "전체" || item.format === filter),
    [filter, media]
  );

  return (
    <section className="archive-block">
      <div className="archive-tools">
        <div className="filter-row" aria-label="미디어 분류">
          {filters.filter((item) => item === "전체" || counts[item] > 0).map((item) => (
            <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)} type="button">
              {item}({counts[item]})
            </button>
          ))}
        </div>
      </div>
      <div className="video-grid">
        {shown.map((item) => {
          const id = youtubeId(item.url);
          const thumb = item.image ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);
          return (
            <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
              {thumb ? <img src={thumb} alt="" /> : <div className="placeholder-thumb">{item.format}</div>}
              <span>{item.outlet}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
