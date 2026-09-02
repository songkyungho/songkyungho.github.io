import type { Metadata } from "next";
import changelog from "../data/site-changelog.json";
import { PageIntro } from "../components";

export const metadata: Metadata = {
  title: "업데이트 | 송경호",
  description: "개인 연구 아카이브의 구성과 분류가 바뀐 기록",
};

const monthLabel = (date: string) => {
  const [year, month] = date.split("-");
  return `${year}년 ${Number(month)}월`;
};

function groupByMonth(entries: typeof changelog) {
  const groups: { label: string; items: typeof changelog }[] = [];
  for (const item of entries) {
    const label = monthLabel(item.date);
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

export default function UpdatesPage() {
  const months = groupByMonth(changelog);

  return (
    <main className="inner-page">
      <PageIntro eyebrow="UPDATES" title="업데이트" />

      <section className="about-section">
        <div className="about-section-title"><p className="eyebrow">LOG</p><h2>바뀐 점</h2></div>
        <div className="site-copy">
          <p>
            사이트 구조, 분류, 화면이 바뀐 지점만 적습니다. 글이나 발표를 한 건 추가한 기록은{" "}
            <a href="/site">소개</a>에서 말한 대로 여기 두지 않습니다.
          </p>
        </div>
      </section>

      {months.map(({ label, items }) => (
        <section className="about-section" key={label}>
          <div className="about-section-title"><p className="eyebrow">DATE</p><h2 className="log-month">{label}</h2></div>
          <div className="timeline">
            {items.map((item) => (
              <article className="timeline-row log-entry" key={`${item.date}-${item.title}`}>
                <time dateTime={item.date}>{item.date.replaceAll("-", ".")}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="log-tags">
                    {item.tags.map((tag) => <span className="log-tag" key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
