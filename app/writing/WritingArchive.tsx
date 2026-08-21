"use client";

import { useMemo, useState } from "react";

type WritingSummary = {
  slug: string;
  title: string;
  publication: string;
  issue: string | null;
  year: string | null;
  month: string | null;
  day: string | null;
  section: string;
  kind: string;
  sourceUrl: string | null;
  migrationStatus: string;
  note: { text: string; url?: string } | null;
};

function formatDate(item: { year: string | null; month: string | null; day: string | null }) {
  if (item.month && item.day) return `${item.year}.${item.month.padStart(2, "0")}.${item.day.padStart(2, "0")}`;
  return item.year;
}

const filters = ["전체", "이슈브리프", "칼럼", "에세이", "보도"];

export default function WritingArchive({ archive }: { archive: WritingSummary[] }) {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const items = useMemo(() => archive.filter((item) => {
    const matchesFilter = filter === "전체" || item.section === filter;
    const haystack = `${item.title} ${item.publication} ${item.year ?? ""}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  }), [filter, query]);

  return (
    <section className="archive-block" aria-labelledby="writing-archive-heading">
      <div className="section-line archive-section-line">
        <h2 id="writing-archive-heading">기고, 에세이와 언론 보도</h2>
        <span>{archive.length}</span>
      </div>
      <div className="archive-tools writing-tools">
        <div className="filter-row" aria-label="글 분류">
          {filters.map((item) => (
            <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)} type="button">
              {item}
            </button>
          ))}
        </div>
        <label className="archive-search">
          <span className="sr-only">글 검색</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="제목·매체 검색" type="search" value={query} />
        </label>
      </div>
      <p className="result-count">{items.length}편</p>
      <div className="writing-list archive-writing-list">
        {items.map((item) => {
          const hasDetail = item.migrationStatus === "상세 페이지 완료";
          const content = (
            <>
              <span>{formatDate(item)}</span>
              <div>
                <p className="writing-meta">
                  {item.publication}{item.issue ? ` ${item.issue}호` : ""} · {item.section}
                </p>
                <h3>{item.title}</h3>
                {item.note && (
                  <p className="venue">
                    {item.note.text}
                    {item.note.url && ` (${new URL(item.note.url).hostname})`}
                  </p>
                )}
              </div>
              <span aria-hidden="true">{hasDetail ? "→" : "↗"}</span>
            </>
          );
          return hasDetail ? (
            <a className="writing-row" href={`/writing/archive/${item.slug}`} key={item.slug}>{content}</a>
          ) : (
            <a className="writing-row" href={item.sourceUrl ?? undefined} target="_blank" rel="noopener noreferrer" key={item.slug}>{content}</a>
          );
        })}
      </div>
    </section>
  );
}
