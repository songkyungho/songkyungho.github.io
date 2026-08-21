"use client";

import { useMemo, useState } from "react";

const works = [
  { year: 2026, type: "보고서", title: "EU 인공지능법 범용인공지능(GPAI) 실천강령(CoP) 한글 안내서", en: "", venue: "인공지능안전연구소", url: "https://www.aisi.re.kr/kor/article/ATCL75b4fb0a5/114" },
  { year: 2026, type: "보고서", title: "AI사고 정의 및 보고체계 국제동향", en: "", venue: "AI 안전 동향 분석 시리즈 26-01", url: "https://www.aisi.re.kr/kor/article/ATCL75b4fb0a5/102" },
  { year: 2025, type: "논문", title: "AI 이후의 민주주의: 기술적 가능성과 참여의 역설", en: "", venue: "『입법과 정책』 17(2), 39–72", url: "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003236884" },
  { year: 2025, type: "논문", title: "계산하는 기계는 돌보는 기계가 될 수 있을까?", en: "", venue: "『日本思想』 51, 1–28 · 김태진·송경호", url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003276447" },
  { year: 2024, type: "논문", title: "한국 대학 학부 정치학 교육 생태계의 변화", en: "", venue: "『시민과세계』 45, 181–225 · 김현·송경호·백우열", url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003153554" },
  { year: 2024, type: "논문", title: "북한의 인권 개념과 그 특징", en: "North Korea’s Concept of Human Rights and Its Characteristics", venue: "North Korean Review 20(2), 37–66", url: "https://www.jstor.org/stable/27372578" },
  { year: 2023, type: "논문", title: "‘북한동포’는 누구인가?", en: "", venue: "『정치사상연구』 29(1), 82–114 · 김현·송경호", url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002962170" },
  { year: 2023, type: "논문", title: "민주주의는 어떻게 ‘민주주의’가 되었는가", en: "How Democracy Became Minjujuui: A Conceptual History of Democracy in Modern Korea with Focus on the Generalization Process of Minjujuui", venue: "Korea Journal 63(1), 36–65 · Hyun Kim & Kyungho Song", url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002941098" },
  { year: 2021, type: "논문", title: "녹색 일자리의 매칭과 미스매칭", en: "Matching and Mismatching of Green Jobs: A Big Data Analysis of Job Recruiting and Searching", venue: "Sustainability 13(7), 4074", url: "https://www.mdpi.com/2071-1050/13/7/4074" },
  { year: 2021, type: "역서", title: "서양을 번역하다: 문명개화 시대의 자유, 권리, 주권, 사회", en: "Translating the West", venue: "성균관대학교출판부 · 공동번역", url: "https://product.kyobobook.co.kr/" },
  { year: 2020, type: "학위논문", title: "19세기 동아시아의 인권 수용과 가토 히로유키 천부인권론의 역설", en: "", venue: "연세대학교 정치학 박사학위논문", url: "https://library.yonsei.ac.kr/search/detail/CAT000001996393" },
];

const filters = ["전체", "논문", "보고서", "저서·역서", "학위논문"];

export default function ResearchArchive() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => works.filter((work) => {
    const typeMatch = filter === "전체" || work.type === filter || (filter === "저서·역서" && ["저서", "역서"].includes(work.type));
    const queryMatch = `${work.title} ${work.en} ${work.venue}`.toLowerCase().includes(query.toLowerCase());
    return typeMatch && queryMatch;
  }), [filter, query]);

  return (
    <section className="archive-block">
      <div className="archive-tools">
        <div className="filter-row" aria-label="연구 유형 필터">{filters.map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <label className="archive-search"><span className="sr-only">연구 검색</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목, 학술지, 키워드 검색" /></label>
      </div>
      <p className="result-count">{shown.length}개의 연구성과</p>
      <div className="archive-list">{shown.map((work) => <a className="archive-row" href={work.url} key={`${work.year}-${work.title}`}><div className="archive-year">{work.year}</div><div><span className="type-chip">{work.type}</span><h2>{work.title}</h2>{work.en && <p className="official-en" lang="en">{work.en}</p>}<p className="venue">{work.venue}</p></div><span className="arrow">↗</span></a>)}</div>
    </section>
  );
}
