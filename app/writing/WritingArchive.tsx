"use client";

import { useEffect, useMemo, useState } from "react";

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
  href?: string;
};

function formatDate(item: { year: string | null; month: string | null; day: string | null; section: string }) {
  if (item.month && item.day && item.section !== "블로그" && item.section !== "번역") return `${item.year}.${item.month.padStart(2, "0")}.${item.day.padStart(2, "0")}`;
  if (item.month) return `${item.year}.${item.month.padStart(2, "0")}`;
  return item.year;
}

const filters = ["전체", "이슈브리프", "칼럼", "에세이", "블로그", "번역"];
// 주소 끝(#blog, #translation)으로 탭을 바로 연다 — 홈 ARCHIVE의 '전체 보기'가 쓴다
const HASH_FILTERS: Record<string, string> = { "#blog": "블로그", "#translation": "번역" };

export default function WritingArchive({ archive }: { archive: WritingSummary[] }) {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const fromHash = HASH_FILTERS[window.location.hash];
    // 정적 내보내기라 서버 렌더에서는 주소의 # 부분을 알 수 없어, 마운트 뒤 한 번만 맞춘다
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromHash) setFilter(fromHash);
  }, []);
  const counts: Record<string, number> = Object.fromEntries(
    filters.map((item) => [item, item === "전체" ? archive.length : archive.filter((a) => a.section === item).length])
  );
  const items = useMemo(() => archive.filter((item) => {
    const matchesFilter = filter === "전체" || item.section === filter;
    const haystack = `${item.title} ${item.publication} ${item.year ?? ""}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  }), [archive, filter, query]);

  return (
    <section className="archive-block" aria-label="기고와 에세이">
      <div className="archive-tools writing-tools">
        <div className="filter-row" aria-label="글 분류">
          {filters.map((item) => (
            <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)} type="button">
              {item}({counts[item]})
            </button>
          ))}
        </div>
        <label className="archive-search">
          <span className="sr-only">글 검색</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="제목·매체 검색" type="search" value={query} />
        </label>
      </div>
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
            <a className="writing-row" href={item.href ?? `/writing/archive/${item.slug}`} key={item.slug}>{content}</a>
          ) : (
            <a className="writing-row" href={item.sourceUrl ?? undefined} target="_blank" rel="noopener noreferrer" key={item.slug}>{content}</a>
          );
        })}
      </div>
    </section>
  );
}
