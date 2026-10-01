import type { Metadata } from "next";
import archive from "../../../data/writing-archive.json";
import writingBlocks from "../../../data/writing-blocks.json";
import { SITE_URL } from "../../../../site.config";

type Params = { slug: string };

const records = archive;

type Source = { n: number; title: string; meta: string | null; note: string; url: string | null; host: string | null; status: string | null };
type Figure = { type: "figure"; src: string; alt: string; caption: string; href: string | null; narrow?: boolean };
type Graphic =
  | { type: "graphic"; kind: "timeline"; title: string; caption: string; items: { when: string; text: string; mark?: string }[] }
  | { type: "graphic"; kind: "criteria"; title: string; items: { q: string; a: string; ref: string }[] }
  | { type: "graphic"; kind: "quadrant"; title: string; x: [string, string]; y: [string, string]; points: { pos: "top-left" | "bottom-right"; name: string; sub: string; note: string; ref: string }[] }
  | { type: "graphic"; kind: "doubling"; title: string; caption: string; bars: { label: string; value: number }[] }
  | { type: "graphic"; kind: "statute"; title: string; caption: string; href: string; articles: { head: string; lines: { text: string; indent?: boolean; mark?: boolean }[] }[] };
type Block = { type: "h2" | "h3" | "p"; id?: string | null; text: string } | { type: "refs"; items: Source[] } | Figure | Graphic;
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

function BlogFigure({ figure }: { figure: Figure }) {
  const image = <img alt={figure.alt} loading="lazy" src={figure.src} />;
  return (
    <figure className={figure.narrow ? "blog-figure narrow" : "blog-figure"}>
      {figure.href ? <a href={figure.href} target="_blank" rel="noopener noreferrer">{image}</a> : image}
      <figcaption>
        {figure.href ? (
          <a href={figure.href} target="_blank" rel="noopener noreferrer">{figure.caption}<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span></a>
        ) : figure.caption}
      </figcaption>
    </figure>
  );
}

function BlogGraphic({ graphic }: { graphic: Graphic }) {
  if (graphic.kind === "timeline") {
    return (
      <figure className="blog-graphic">
        <p className="graphic-title">{graphic.title}</p>
        <ol className="graphic-timeline">
          {graphic.items.map((item) => (
            <li className={item.mark ? "marked" : undefined} key={item.when}>
              <time>{item.when}</time>
              <p>{item.text}</p>
              {item.mark && <span>{item.mark}</span>}
            </li>
          ))}
        </ol>
        <figcaption>{graphic.caption}</figcaption>
      </figure>
    );
  }
  if (graphic.kind === "criteria") {
    return (
      <figure className="blog-graphic">
        <p className="graphic-title">{graphic.title}</p>
        <ol className="graphic-criteria">
          {graphic.items.map((item) => (
            <li key={item.ref}>
              <a href={`#s${item.ref}`}><strong>{item.q}</strong><span>{item.a}</span></a>
            </li>
          ))}
        </ol>
      </figure>
    );
  }
  if (graphic.kind === "quadrant") {
    return (
      <figure className="blog-graphic">
        <p className="graphic-title">{graphic.title}</p>
        <div className="graphic-quadrant" role="img" aria-label={graphic.points.map((point) => `${point.name}: ${point.sub}. ${point.note}`).join(" ")}>
          <span className="axis-y">↑ {graphic.y[1]}</span>
          <div className="quadrant-grid">
            {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((cell) => {
              const point = graphic.points.find((item) => item.pos === cell);
              return (
                <div className={point ? `cell ${cell} filled` : `cell ${cell}`} key={cell}>
                  {point && <><strong>{point.name}</strong><span>{point.sub}</span><em>{point.note} · {point.ref}</em></>}
                </div>
              );
            })}
          </div>
          <span className="axis-x">{graphic.x[1]} →</span>
        </div>
      </figure>
    );
  }
  if (graphic.kind === "statute") {
    return (
      <figure className="blog-graphic">
        <p className="graphic-title">
          <a href={graphic.href} target="_blank" rel="noopener noreferrer">{graphic.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (새 창)</span></a>
        </p>
        {graphic.articles.map((article) => (
          <div className="graphic-statute" key={article.head}>
            <strong>{article.head}</strong>
            {article.lines.map((line) => (
              <p className={[line.indent ? "indent" : "", line.mark ? "mark" : ""].join(" ").trim() || undefined} key={line.text.slice(0, 20)}>{line.text}</p>
            ))}
          </div>
        ))}
        <figcaption>{graphic.caption}</figcaption>
      </figure>
    );
  }
  const max = Math.max(...graphic.bars.map((bar) => bar.value));
  return (
    <figure className="blog-graphic">
      <p className="graphic-title">{graphic.title}</p>
      <div className="graphic-bars">
        {graphic.bars.map((bar) => (
          <div key={bar.label}>
            <span className="bar-label">{bar.label}</span>
            <span className="bar-track"><span className="bar-fill" style={{ width: `${(bar.value / max) * 100}%` }} /></span>
            <span className="bar-value">{bar.value === Math.round(bar.value) ? bar.value : `약 ${Math.round(bar.value)}`}배</span>
          </div>
        ))}
      </div>
      <figcaption>{graphic.caption}</figcaption>
    </figure>
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
        if (block.type === "figure") return <BlogFigure figure={block} key={`figure-${index}`} />;
        if (block.type === "graphic") return <BlogGraphic graphic={block} key={`graphic-${index}`} />;
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
