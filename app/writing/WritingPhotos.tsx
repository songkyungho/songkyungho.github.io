import archive from "../data/writing-archive.json";

export default function WritingPhotos() {
  const items = archive.filter(
    (item) => item.migrationStatus === "상세 페이지 완료" && item.image && item.section !== "보도"
  );
  if (items.length === 0) return null;
  const track = [...items, ...items];

  return (
    <div className="slideshow-viewport" aria-label="글 이미지">
      <div className="slideshow-track writing-photos" style={{ animationDuration: `${items.length * 3}s` }}>
        {track.map((item, i) => (
          <a href={`/writing/archive/${item.slug}`} key={`${item.slug}-${i}`} title={item.title}>
            <img alt={item.title} src={item.image!} />
          </a>
        ))}
      </div>
    </div>
  );
}
