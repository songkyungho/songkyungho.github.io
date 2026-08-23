import research from "../data/research-archive.json";
import talks from "../data/talks-archive.json";
import writing from "../data/writing-archive.json";
import media from "../data/media.json";

const CATS = ["논문", "저서·역서", "보고서", "강연", "발표", "토론·좌담", "글", "미디어", "언론 보도"] as const;
type Cat = (typeof CATS)[number];

function bump(counts: Map<number, Map<Cat, number>>, year: number, cat: Cat) {
  if (!counts.has(year)) counts.set(year, new Map());
  const row = counts.get(year)!;
  row.set(cat, (row.get(cat) ?? 0) + 1);
}

function buildMatrix() {
  const counts = new Map<number, Map<Cat, number>>();

  for (const item of research) {
    const year = Number(item.year);
    if (item.kind === "논문") bump(counts, year, "논문");
    else if (item.kind === "편저" || item.kind === "역서" || item.kind === "학위논문") bump(counts, year, "저서·역서");
    else if (item.kind === "보고서") bump(counts, year, "보고서");
  }

  for (const item of talks) {
    const year = Number(item.year);
    if (item.kind === "특강") bump(counts, year, "강연");
    else if (item.kind === "학술발표" || item.kind === "발표" || item.kind === "포스터") bump(counts, year, "발표");
    else bump(counts, year, "토론·좌담"); // 토론, 좌담, 사회
  }

  for (const item of writing) {
    if (!item.year) continue;
    const year = Number(item.year);
    if (item.section === "보도") bump(counts, year, "언론 보도");
    else if (item.section === "칼럼" || item.section === "이슈브리프" || item.section === "에세이") bump(counts, year, "글");
  }

  for (const item of media) {
    if (!item.year) continue;
    bump(counts, Number(item.year), "미디어");
  }

  const years = [...counts.keys()].sort((a, b) => a - b);
  const rows = CATS.map((cat) => {
    const cells = years.map((year) => counts.get(year)?.get(cat) ?? 0);
    const total = cells.reduce((sum, v) => sum + v, 0);
    return { cat, cells, total };
  });

  return { years, rows };
}

function cellClass(value: number) {
  if (value === 0) return "c0";
  if (value <= 2) return "c1";
  if (value <= 8) return "c2";
  if (value <= 16) return "c3";
  return "c4";
}

export default function AchievementHeatmap() {
  const { years, rows } = buildMatrix();

  return (
    <section className="about-section achievement-section">
      <div className="about-section-title"><p className="eyebrow">ACHIEVEMENTS</p><h2>연도별 활동</h2></div>
      <div className="heatmap-scroll">
        <table className="heatmap">
          <thead>
            <tr>
              <th></th>
              {years.map((year) => <th key={year}>{year}</th>)}
              <th className="total-head">합계</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cat, cells, total }) => (
              <tr key={cat}>
                <th>{cat}</th>
                {cells.map((value, index) => (
                  <td key={years[index]}>
                    <div className={`heat-cell ${cellClass(value)}`}>{value || ""}</div>
                  </td>
                ))}
                <td className="total-cell"><div className="heat-cell total">{total}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="heatmap-legend">
        <span>0</span>
        <span className="heat-cell c0"></span>
        <span className="heat-cell c1"></span>
        <span className="heat-cell c2"></span>
        <span className="heat-cell c3"></span>
        <span className="heat-cell c4"></span>
        <span>16건 이상</span>
      </div>
    </section>
  );
}
