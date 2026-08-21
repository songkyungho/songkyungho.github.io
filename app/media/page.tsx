import type { Metadata } from "next";
import { PageIntro } from "../components";

export const metadata: Metadata = { title: "미디어 | 송경호", description: "AI 안전과 정치에 관한 인터뷰, 방송과 언론 보도" };

const media = [
  { format: "방송", outlet: "XSFM · News by Daylight", title: "지극히 정치적인 AI", description: "AI가 정치와 전쟁, 사회적 의사결정에 들어올 때 우리가 마주할 질문을 이야기합니다.", url: "https://youtu.be/ODxyzbqMOWk" },
  { format: "방송", outlet: "XSFM · News by Daylight", title: "전쟁에 AI를 어디어디 쓰는 거예요", description: "군사 AI의 실제 활용과 정치적·윤리적 통제의 문제를 다룹니다.", url: "https://youtu.be/-fpfWrbRptw" },
  { format: "방송", outlet: "XSFM · News by Daylight", title: "몸을 가진 AI와 인류, 정치가 풀어야 할 숙제", description: "피지컬 AI가 바꿀 권력과 책임의 경계를 살펴봅니다.", url: "https://www.youtube.com/watch?v=yDKbk9vp4V8" },
  { format: "영상 인터뷰", outlet: "중앙일보", title: "AI 박정희, AI 김대중 만들면? 그게 정치 유튜버보다 무섭다", description: "역사적 정치인을 재현하는 AI와 정치적 권위의 문제를 짚습니다.", url: "https://www.joongang.co.kr/article/25366180" },
  { format: "영상 인터뷰", outlet: "중앙일보", title: "쓰레기장 선정, 찍소리 못한다? AI 정치인 뜨면 생기는 일", description: "알고리즘 의사결정이 민주적 책임에 미치는 영향을 살펴봅니다.", url: "https://www.joongang.co.kr/article/25367971" },
  { format: "영상 인터뷰", outlet: "중앙일보", title: "‘인간 정치인? 혐오스럽지만…’ AI 정치인이 더 무서운 까닭", description: "AGI 정치의 가능성과 위험, 인간 정치의 의미를 이야기합니다.", url: "https://www.joongang.co.kr/article/25369931" },
  { format: "프로젝트", outlet: "AI Basic Act", title: "대한민국 인공지능 기본법", description: "법률 본문과 국제 AI 규제의 연결 관계를 탐색할 수 있는 독립 프로젝트입니다.", url: "https://aibasicact.kr/" },
  { format: "영상 인터뷰", outlet: "돌깨TV", title: "우리시대의 청년은 왜 우파가 되었는가?(3/4)", description: "청년 남성의 정치화를 주제로 한 인터뷰 영상입니다.", url: "https://youtu.be/_oPWn3JEm9U" },
  { format: "특강 영상", outlet: "멋쟁이사자처럼", title: "AI와 인문학, 21세기형 리더에게 필요한 덕목", description: "IT 인재 교육 커뮤니티 멋쟁이사자처럼에서 진행한 특강 영상입니다.", url: "https://youtu.be/aREwn_EoxWA" },
];

export default function MediaPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="MEDIA & RESOURCES" title="자료와 미디어" description="방송, 인터뷰와 공개 프로젝트를 한곳에 모았습니다. 영상과 출판물처럼 구분에 필요한 경우에만 표지 이미지를 사용합니다." />
      <section className="resource-section">
        <div className="section-line"><h2>방송과 영상</h2><span>3</span></div>
        <div className="video-grid">{media.slice(0, 3).map((item, index) => {
          const ids = ["ODxyzbqMOWk", "-fpfWrbRptw", "yDKbk9vp4V8"];
          return <a className="video-card" href={item.url} key={item.title}><img src={`https://i.ytimg.com/vi/${ids[index]}/hqdefault.jpg`} alt="" /><span>{item.outlet}</span><h3>{item.title}</h3><p>{item.description}</p></a>;
        })}</div>
      </section>
      <section className="resource-section">
        <div className="section-line"><h2>인터뷰와 프로젝트</h2><span>{media.length - 3}</span></div>
        <div className="media-list">{media.slice(3).map((item) => <a className="media-row" href={item.url} key={item.title}><span>{item.format}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{item.outlet}</small></div><span aria-hidden="true">↗</span></a>)}</div>
      </section>
    </main>
  );
}
