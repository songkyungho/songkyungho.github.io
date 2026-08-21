import type { Metadata } from "next";
import { PageIntro } from "../components";
import archive from "../data/naver-archive.json";
import WritingArchive from "./WritingArchive";

export const metadata: Metadata = { title: "글 | 송경호", description: "AI 정치, 민주주의, 인권과 동아시아에 관한 칼럼·기고·에세이" };

const writings = [
  { outlet: "UNDP", title: "Building Safer AI for All Languages", topic: "AI 안전 · 언어 포용", url: "https://www.undp.org/digital/blog/building-safer-ai-all-languages-collective-pathway-inclusive-human-development" },
  { outlet: "Korea on Point", title: "The Political Philosophy of REAIM", topic: "자율무기 · 정의전쟁론", url: "https://koreaonpoint.org/view.php?idx=390" },
  { outlet: "프레시안", title: "AI로 정치인 대체하자? ‘IT 강령술사’가 등장한다", topic: "AI 정치 · 민주주의", url: "https://m.pressian.com/m/pages/articles/2024010317011669947" },
  { outlet: "프레시안", title: "‘철인군주AI’로 정치를 대체하자?", topic: "정치철학 · AI", url: "https://m.pressian.com/m/pages/articles/2024010317072429864" },
  { outlet: "경향신문", title: "포퓰리즘이 뭐라고 생각하세요", topic: "포퓰리즘 · 민주주의", url: "https://www.khan.co.kr/opinion/column/article/202301180300065" },
  { outlet: "연세대 디지털사회", title: "게이머의 정치적 주체화와 디지털 공론장의 가능성", topic: "게임 · 디지털 공론장", url: "http://cdss.yonsei.ac.kr/index.php/issue-brief/?uid=205&mod=document" },
];

export default function WritingPage() {
  const summaries = archive.map(({ logNo, slug, title, publication, issue, year, section }) => ({ logNo, slug, title, publication, issue, year, section }));
  return <main className="inner-page"><PageIntro eyebrow="WRITING" title="글" description="연구의 문제의식을 더 넓은 독자와 나눈 이슈브리프, 칼럼과 에세이입니다." /><section className="featured-writing"><div className="section-line"><h2>최근 기고</h2><span>{writings.length}</span></div><div className="writing-list">{writings.map((item) => <a className="writing-row" href={item.url} key={item.title}><span>{item.outlet}</span><div><h3>{item.title}</h3><p>{item.topic}</p></div><span aria-hidden="true">↗</span></a>)}</div></section><WritingArchive archive={summaries} /></main>;
}
