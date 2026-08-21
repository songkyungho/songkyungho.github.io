"use client";

import { useMemo, useState } from "react";
import research from "../data/research-archive.json";

const filters = ["전체", "논문", "보고서", "편저", "역서", "학위논문"];

export default function ResearchArchive() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => research.filter((item) => {
    const typeMatch = filter === "전체" || item.kind === filter;
    const haystack = [item.text, item.series, item.org, ...(item.authors ?? [])].filter(Boolean).join(" ").toLowerCase();
    const queryMatch = haystack.includes(query.trim().toLowerCase());
    return typeMatch && queryMatch;
  }), [filter, query]);

  return (
    <section className="archive-block">
      <div className="archive-tools">
        <div className="filter-row" aria-label="연구 유형 필터">{filters.map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <label className="archive-search"><span className="sr-only">연구 검색</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목, 학술지, 키워드 검색" /></label>
      </div>
      <p className="result-count">{shown.length}개의 연구성과</p>
      <div className="archive-list">
        {shown.map((item) => {
          const content = (
            <>
              <div className="archive-year">{item.year}</div>
              <div>
                <span className="type-chip">{item.kind}</span>
                {item.authors ? (
                  <>
                    {item.series && <p className="venue">{item.series}</p>}
                    <h2>{item.title}</h2>
                    <p className="venue">{item.authors.join(", ")}{item.org && ` · ${item.org}`}</p>
                  </>
                ) : (
                  <h2>{item.detail}</h2>
                )}
                {item.note && (
                  <p className="venue note-with-badge">
                    {item.note.image && <img alt="" src={item.note.image} />}
                    {item.note.text}
                    {item.note.url && ` (${new URL(item.note.url).hostname})`}
                  </p>
                )}
              </div>
              {item.url && <span className="arrow" aria-hidden="true">↗</span>}
            </>
          );
          return item.url ? (
            <a className="archive-row" href={item.url} target="_blank" rel="noopener noreferrer" key={`${item.year}-${item.slug}`}>{content}</a>
          ) : (
            <div className="archive-row" key={`${item.year}-${item.slug}`}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
