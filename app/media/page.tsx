import type { Metadata } from "next";
import { PageIntro } from "../components";
import media from "../data/media.json";

export const metadata: Metadata = { title: "미디어 | 송경호", description: "AI 안전과 정치에 관한 인터뷰, 방송과 언론 보도" };

export default function MediaPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="MEDIA & RESOURCES" title="자료와 미디어" />
      <section className="resource-section">
        <div className="section-line"><h2>방송과 영상</h2><span>3</span></div>
        <div className="video-grid">{media.slice(0, 3).map((item, index) => {
          const ids = ["ODxyzbqMOWk", "-fpfWrbRptw", "yDKbk9vp4V8"];
          return <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}><img src={`https://i.ytimg.com/vi/${ids[index]}/hqdefault.jpg`} alt="" /><span>{item.outlet}</span><h3>{item.title}</h3><p>{item.description}</p></a>;
        })}</div>
      </section>
      <section className="resource-section">
        <div className="section-line"><h2>인터뷰와 프로젝트</h2><span>{media.length - 3}</span></div>
        <div className="media-list">{media.slice(3).map((item) => <a className="media-row" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}><span>{item.format}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{item.outlet}</small></div><span aria-hidden="true">↗</span></a>)}</div>
      </section>
    </main>
  );
}
