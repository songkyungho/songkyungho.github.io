import type { Metadata } from "next";
import archive from "../../../data/writing-archive.json";
import writingBlocks from "../../../data/writing-blocks.json";
import { SITE_URL } from "../../../../site.config";

type Params = { slug: string };

const records = archive;

type Source = { n: number; title: string; meta: string | null; note: string; url: string | null; host: string | null; status: string | null };
type Block = { type: "h2" | "h3" | "p"; id?: string | null; text: string } | { type: "refs"; items: Source[] };
type BlogPost = { intro: string[]; summary: string[]; toc: { id: string; text: string }[]; blocks: Block[] };

const blogPosts = writingBlocks as unknown as Record<string, BlogPost>;

function SourceBox({ items }: { items: Source[] }) {
  return (
    <aside className="source-box" aria-label="근거 자료">
      <ol>
        {items.map((source) => (
          <li id={`source-${source.n}`} key={source.n}>
            <span className="source-n">{source.n}</span>
            <div>
              {source.url ? (
                <a className="source-title" href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span>
                </a>
              ) : (
                <span className="source-title">{source.title}</span>
              )}
              <p className="source-meta">
                {[source.meta, source.host].filter(Boolean).join(" · ")}
                {source.status && <span className="source-status">{source.status}</span>}
              </p>
              <p className="source-desc">{source.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function BlogBody({ post }: { post: BlogPost }) {
  return (
    <>
      {post.intro.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
      <section className="thesis-summary" aria-labelledby="thesis-summary-title">
        <h2 id="thesis-summary-title">전체 논지</h2>
        {post.summary.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
      </section>
      <nav className="article-toc" aria-label="목차">
        <p>목차</p>
        <ol>
          {post.toc.map((entry) => {
            const [head, ...rest] = entry.text.replace(/^\d+\.\s*/, "").split(": ");
            return (
              <li key={entry.id}>
                <a href={`#${entry.id}`}><strong>{head}</strong>{rest.length > 0 && <span>{rest.join(": ")}</span>}</a>
              </li>
            );
          })}
        </ol>
      </nav>
      {post.blocks.map((block, index) => {
        if (block.type === "refs") return <SourceBox items={block.items} key={`refs-${index}`} />;
        if (block.type === "h2") return <h2 className="blog-chapter" id={block.id ?? undefined} key={`h2-${index}`}>{block.text}</h2>;
        if (block.type === "h3") return <h3 className="blog-claim" id={block.id ?? undefined} key={`h3-${index}`}>{block.text}</h3>;
        return <p key={`p-${index}`}>{block.text}</p>;
      })}
    </>
  );
}

export function generateStaticParams() {
  return records.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = records.find((record) => record.slug === slug);
  if (!item) return { title: "글을 찾을 수 없습니다 | 송경호" };
  const post = blogPosts[slug];
  const description = post ? post.intro.join(" ") : `${item.publication}${item.issue ? ` ${item.issue}호` : ""}에 실린 송경호의 글, 「${item.title}」.`;
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
  const post = blogPosts[item.slug];

  return (
    <main className="article-page">
      <article>
        <header className="article-header">
          <p className="eyebrow">{item.kind === "press" ? "보도" : item.section.toUpperCase()}</p>
          <h1>{item.title}</h1>
          <dl className="article-meta">
            <div><dt>매체</dt><dd>{item.publication}</dd></div>
            {item.issue && <div><dt>호수</dt><dd>{item.issue}호</dd></div>}
            {item.year && (
              <div>
                <dt>발행</dt>
                <dd>{item.month && item.day ? `${item.year}.${String(item.month).padStart(2, "0")}.${String(item.day).padStart(2, "0")}` : item.year}</dd>
              </div>
            )}
          </dl>
        </header>
        {item.image && <figure className="article-hero"><img alt={`「${item.title}」 대표 이미지`} src={item.image} /><figcaption>당시 게재 이미지</figcaption></figure>}
        <div className={post ? "article-body blog-body" : "article-body"}>
          {post ? <BlogBody post={post} /> : item.body.map((paragraph, index) => /^#\d+\.?$/.test(paragraph) ? <h2 key={`${paragraph}-${index}`}>{paragraph}</h2> : <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>)}
        </div>
        {item.sourceUrl && item.migrationStatus !== "상세 페이지 완료" && (
          <p className="article-source">
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.kind === "press" ? "원문 기사 보기" : "원문에서 전체 보기"} ↗</a>
          </p>
        )}
      </article>
      <nav className="article-back" aria-label="글 목록"><a href="/writing">← 글 아카이브로 돌아가기</a></nav>
    </main>
  );
}
