import type { Metadata } from "next";
import { PageIntro } from "../components";
import media from "../data/media.json";

export const metadata: Metadata = { title: "미디어 | 송경호", description: "AI 안전과 정치에 관한 인터뷰, 방송과 언론 보도" };

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  return match ? match[1] : null;
}

export default function MediaPage() {
  const broadcasts = media.filter((item) => item.format === "방송");
  const rest = media.filter((item) => item.format !== "방송");
  return (
    <main className="inner-page">
      <PageIntro eyebrow="MEDIA & RESOURCES" title="자료와 미디어" />
      <section className="resource-section">
        <div className="section-line"><h2>방송과 영상</h2><span>{broadcasts.length}</span></div>
        <div className="video-grid">{broadcasts.map((item) => {
          const id = youtubeId(item.url);
          return <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}><img src={id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ""} alt="" /><span>{item.outlet}</span><h3>{item.title}</h3><p>{item.description}</p></a>;
        })}</div>
      </section>
      <section className="resource-section">
        <div className="section-line"><h2>인터뷰와 프로젝트</h2><span>{rest.length}</span></div>
        <div className="media-list">{rest.map((item) => <a className="media-row" href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}><span>{item.format}</span><div><h3>{item.title}</h3><p>{item.description}</p><small>{item.outlet}</small></div><span aria-hidden="true">↗</span></a>)}</div>
      </section>
    </main>
  );
}
