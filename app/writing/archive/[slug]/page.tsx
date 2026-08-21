import type { Metadata } from "next";
import archive from "../../../data/naver-archive.json";
import { SITE_URL } from "../../../../site.config";

type Params = { slug: string };

const records = archive;

export function generateStaticParams() {
  return records.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = records.find((record) => record.slug === slug);
  if (!item) return { title: "글을 찾을 수 없습니다 | 송경호" };
  const description = `${item.publication}${item.issue ? ` ${item.issue}호` : ""}에 실린 송경호의 글, 「${item.title}」.`;
  const image = item.image ? `${SITE_URL}${item.image}` : undefined;
  return {
    title: `${item.title} | 송경호`,
    description,
    openGraph: { title: item.title, description, images: image ? [{ url: image }] : [] },
    twitter: { card: image ? "summary_large_image" : "summary", title: item.title, description, images: image ? [image] : [] },
  };
}

export default async function ArchivedWritingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = records.find((record) => record.slug === slug);
  if (!item) return <main className="article-page"><p>글을 찾을 수 없습니다.</p></main>;

  return (
    <main className="article-page">
      <article>
        <header className="article-header">
          <p className="eyebrow">{item.section.toUpperCase()}</p>
          <h1>{item.title}</h1>
          <dl className="article-meta">
            <div><dt>매체</dt><dd>{item.publication}</dd></div>
            {item.issue && <div><dt>호수</dt><dd>{item.issue}호</dd></div>}
            {item.year && <div><dt>발행</dt><dd>{item.year}</dd></div>}
          </dl>
        </header>
        {item.image && <figure className="article-hero"><img alt={`「${item.title}」 대표 이미지`} src={item.image} /><figcaption>당시 게재 이미지</figcaption></figure>}
        <div className="article-body">
          {item.body.map((paragraph, index) => /^#\d+\.?$/.test(paragraph) ? <h2 key={`${paragraph}-${index}`}>{paragraph}</h2> : <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>)}
        </div>
      </article>
      <nav className="article-back" aria-label="글 목록"><a href="/writing">← 글 아카이브로 돌아가기</a></nav>
    </main>
  );
}
