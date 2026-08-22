type PressItem = {
  slug: string;
  title: string;
  publication: string;
  year: string | null;
  month: string | null;
  day: string | null;
  sourceUrl: string | null;
};

function formatDate(item: { year: string | null; month: string | null; day: string | null }) {
  if (item.month && item.day) return `${item.year}.${item.month.padStart(2, "0")}.${item.day.padStart(2, "0")}`;
  return item.year;
}

export default function PressList({ press }: { press: PressItem[] }) {
  if (press.length === 0) return null;

  return (
    <section className="archive-block press-block">
      <div className="archive-tools"><h2>보도({press.length})</h2></div>
      <div className="writing-list">
        {press.map((item) => (
          <a className="writing-row" href={item.sourceUrl ?? undefined} target="_blank" rel="noopener noreferrer" key={item.slug}>
            <span>{formatDate(item)}</span>
            <div>
              <p className="writing-meta">{item.publication}</p>
              <h3>{item.title}</h3>
            </div>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
