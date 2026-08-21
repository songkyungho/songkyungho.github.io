"use client";

import { useMemo, useState } from "react";

type WritingSummary = {
  slug: string;
  title: string;
  publication: string;
  issue: string | null;
  year: string | null;
  section: string;
  kind: string;
};

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
          return (
            <a className="writing-row" href={`/writing/archive/${item.slug}`} key={item.slug}>
              <span>{item.year}</span>
              <div>
                <p className="writing-meta">
                  {item.kind === "press" && <span className="ribbon">[보도]</span>}
                  {item.publication}{item.issue ? ` ${item.issue}호` : ""} · {item.section}
                </p>
                <h3>{item.title}</h3>
              </div>
              <span aria-hidden="true">→</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
