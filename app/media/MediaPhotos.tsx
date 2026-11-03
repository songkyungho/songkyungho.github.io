import media from "../data/media.json";

// 미디어 기록(media.json)의 썸네일을 모아 발표 페이지(TalksPhotos)와 같은 띠로 돌린다.
// 영상은 유튜브 자동 썸네일, 그 밖은 등록된 image를 쓴다. 기록에 없는 출연 사진은 extras에 더한다.
const extras = [
  { src: "/images/media/sbs-newshunters-2026-09.jpg", alt: "SBS 뉴스헌터스 출연 (2026. 9.)", href: "https://youtu.be/eQPU2qmOQWU", key: 2026 * 372 + 9 * 31 + 14 },
];

function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:live|shorts|embed)\/|[?&]v=)([\w-]{11})/);
  return match ? match[1] : null;
}

const fromMedia = media.flatMap((item) => {
  const id = youtubeId(item.url);
  const src = item.image ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);
  if (!src) return [];
  return [{ src, alt: `${item.outlet} · ${item.title}`, href: item.url, key: Number(item.year ?? 0) * 372 + Number(item.month ?? 0) * 31 + Number(item.day ?? 0) }];
});

// 같은 썸네일(중앙일보 3편 등)은 한 번만, 최신순
const seen = new Set<string>();
const photos = [...extras, ...fromMedia]
  .sort((a, b) => b.key - a.key)
  .filter((photo) => (seen.has(photo.src) ? false : (seen.add(photo.src), true)));

export default function MediaPhotos() {
  if (photos.length === 0) return null;
  // 사진이 적을 때도 띠가 화면을 채우도록 최소 열 장까지 되풀이한 뒤, 이어 붙여 끊김 없이 돈다
  const base = Array.from({ length: Math.ceil(10 / photos.length) }, () => photos).flat();
  const track = [...base, ...base];
  return (
    <div className="slideshow-viewport" aria-label="미디어 출연 사진">
      <div className="slideshow-track media-photos" style={{ animationDuration: `${base.length * 4}s` }}>
        {track.map((photo, i) => (
          <a href={photo.href} key={`${photo.src}-${i}`} target="_blank" rel="noopener noreferrer" title={photo.alt}>
            <img alt={photo.alt} src={photo.src} />
          </a>
        ))}
      </div>
    </div>
  );
}
