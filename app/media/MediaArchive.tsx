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

type PressItem = {
  slug: string;
  title: string;
  publication: string;
  year: string | null;
  month: string | null;
  day: string | null;
  sourceUrl: string | null;
};

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:live|shorts|embed)\/|[?&]v=)([\w-]{11})/);
  return match ? match[1] : null;
}

function formatDate(item: { year: string | null; month: number | string | null; day: number | string | null }) {
  if (!item.year) return null;
  if (item.month && item.day) return `${item.year}.${String(item.month).padStart(2, "0")}.${String(item.day).padStart(2, "0")}`;
  if (item.month) return `${item.year}.${String(item.month).padStart(2, "0")}`;
  return item.year;
}

// 보도(신문·잡지 기사)는 썸네일이 없어 카드 대신 글 목록 모양으로 보인다. '전체'에서는 카드 아래 이어 붙인다.
const filters = ["전체", "방송", "영상 인터뷰", "특강 영상", "팟캐스트", "보도"];

export default function MediaArchive({ media, press }: { media: MediaItem[]; press: PressItem[] }) {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const counts: Record<string, number> = Object.fromEntries(
    filters.map((item) => [item, item === "전체" ? media.length + press.length : item === "보도" ? press.length : media.filter((m) => m.format === item).length])
  );
  const needle = query.trim().toLowerCase();
  const shownMedia = useMemo(
    () => (filter === "보도" ? [] : media.filter((item) => (filter === "전체" || item.format === filter) && `${item.title} ${item.outlet} ${item.year ?? ""}`.toLowerCase().includes(needle))),
    [filter, media, needle]
  );
  const shownPress = useMemo(
    () => (filter === "전체" || filter === "보도" ? press.filter((item) => `${item.title} ${item.publication} ${item.year ?? ""}`.toLowerCase().includes(needle)) : []),
    [filter, press, needle]
  );

  return (
    <section className="archive-block" aria-label="미디어 출연과 보도">
      <div className="archive-tools">
        <div className="filter-row" aria-label="미디어 분류">
          {filters.filter((item) => item === "전체" || counts[item] > 0).map((item) => (
            <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)} type="button">
              {item}({counts[item]})
            </button>
          ))}
        </div>
        <label className="archive-search">
          <span className="sr-only">미디어 검색</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="제목·매체 검색" type="search" value={query} />
        </label>
      </div>
      {shownMedia.length > 0 && (
        <div className="video-grid">
          {shownMedia.map((item) => {
            const id = youtubeId(item.url);
            const thumb = item.image ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);
            const date = formatDate(item);
            return (
              <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
                {thumb ? <img src={thumb} alt="" /> : <div className="placeholder-thumb">{item.format}</div>}
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
      )}
      {shownPress.length > 0 && (
        <div className="writing-list archive-writing-list media-press-list">
          {shownPress.map((item) => (
            <a className="writing-row" href={item.sourceUrl ?? undefined} target="_blank" rel="noopener noreferrer" key={item.slug}>
              <span>{formatDate(item)}</span>
              <div>
                <p className="writing-meta">{item.publication} · 보도</p>
                <h3>{item.title}</h3>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
