"use client";

import { useMemo, useState } from "react";
import talks from "../data/talks-archive.json";

const filters = ["전체", "학술발표", "발표", "특강", "토론", "사회", "좌담", "포스터"];

function formatDate(item: { year: string; month: number | null; day: number | null }) {
  if (item.month && item.day) return `${item.year}.${String(item.month).padStart(2, "0")}.${String(item.day).padStart(2, "0")}`;
  if (item.month) return `${item.year}.${String(item.month).padStart(2, "0")}`;
  return item.year;
}

export default function TalksArchive() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => talks.filter((item) => {
    const typeMatch = filter === "전체" || item.kind === filter;
    const queryMatch = item.text.toLowerCase().includes(query.trim().toLowerCase());
    return typeMatch && queryMatch;
  }), [filter, query]);

  return (
    <section className="archive-block">
      <div className="archive-tools">
        <div className="filter-row" aria-label="발표 유형 필터">{filters.map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <label className="archive-search"><span className="sr-only">발표 검색</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목, 학회, 기관 검색" /></label>
      </div>
      <p className="result-count">{shown.length}건</p>
      <div className="talks-list">
        {shown.map((item) => (
          <article className="talk-row" key={item.slug}>
            <time>{formatDate(item)}</time>
            <span className="type-chip">{item.kind}</span>
            <div>
              <h2>{item.detail}</h2>
              {item.videoUrl && <a className="venue" href={item.videoUrl} target="_blank" rel="noopener noreferrer">영상 보기 ↗</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
